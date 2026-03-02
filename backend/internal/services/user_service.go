package services

import (
	"trade-tracker/internal/domain"
	"trade-tracker/internal/repository"
	"trade-tracker/pkg/utils/hash"

	"strings"

	"gorm.io/gorm"
)

type UserService interface {
	CreateUser(user *domain.User) error
	UpdateBalance(userID uint64, req domain.UserBalanceUpdateReq) error

	Login(identifier, password string) (*domain.User, error)
	GetUserByUsernameOrEmail(username, email string) (*domain.User, error)
	GetProfile(userID uint64) (*domain.UserProfileResponse, error)
}

type userService struct {
	repo        repository.UserRepository
	posService  PositionService
	tranService TransactionService
}

func NewUserService(repo repository.UserRepository, posService PositionService, tranService TransactionService) UserService {
	return &userService{repo: repo, posService: posService, tranService: tranService}
}

func (s *userService) CreateUser(user *domain.User) error {
	if _, err := s.repo.GetUserByUsernameOrEmail(user.Username, user.Email); err == nil {
		return domain.ErrAlreadyExist
	}

	hashed, err := hash.HashPassword(user.Password)
	if err != nil {
		return domain.ErrInvalidInput
	}

	user.Username = strings.ToLower(user.Username)
	user.Password = hashed

	return s.repo.CreateUser(user)
}

func (s *userService) UpdateBalance(userID uint64, req domain.UserBalanceUpdateReq) error {
	db := s.repo.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		bal, err := s.repo.GetBalance(userID, tx)
		if err != nil {
			return err
		}

		var logged float64
		switch strings.ToLower(req.Mode) {
		case "add":
			logged = req.Amount
		case "rem":
			if bal < req.Amount {
				return domain.ErrInsufficientBalance
			}
			logged = -req.Amount
		case "mod":
			logged = req.Amount - bal
		}

		if err := s.repo.UpdateBalance(userID, logged, tx); err != nil {
			return err
		}

		note := req.Note
		if note == "" {
			note = req.Mode + " Cash"
		}

		return tx.Create(&domain.Transaction{
			OwnerID:         userID,
			TransactionType: "cashflow",
			BasePrice:       logged,
			Price:           logged + req.Fee,
			TransactionFee:  req.Fee,
			Ticker:          req.BankSource,
			Notes:           note,
		}).Error
	})
}

func (s *userService) Login(identifier, password string) (*domain.User, error) {
	user, err := s.repo.GetUserByUsernameOrEmail(identifier, identifier)
	if err != nil {
		return nil, domain.ErrWrongCredential
	}

	if isCorrect, err := hash.VerifyPassword(password, user.Password); err != nil || !isCorrect {
		return nil, domain.ErrWrongCredential
	}

	resp := &domain.User{}
	resp.ID = user.ID

	return resp, nil
}

func (s *userService) GetUserByUsernameOrEmail(username, email string) (*domain.User, error) {
	return s.repo.GetUserByUsernameOrEmail(username, email)
}

func (s *userService) GetProfile(userID uint64) (*domain.UserProfileResponse, error) {
	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	portfolio, err := s.posService.GetPortfolio(userID)
	if err != nil {
		return nil, err
	}

	totalEquity := user.Balance
	for _, p := range portfolio {
		totalEquity += p.CurrentMarketPrice
	}

	return &domain.UserProfileResponse{
		Name:        user.Name,
		Username:    user.Username,
		Balance:     user.Balance,
		TotalEquity: totalEquity,
		Portfolio:   portfolio,
	}, nil
}
