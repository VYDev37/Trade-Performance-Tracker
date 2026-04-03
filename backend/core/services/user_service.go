package services

import (
	"trade-tracker/core/domain"
	"trade-tracker/core/repository"
	"trade-tracker/pkg/utils/hash"

	"strings"

	"gorm.io/gorm"
)

type UserService interface {
	CreateUser(user *domain.User) error

	Login(identifier, password string) (*domain.User, error)
	GetUserByUsernameOrEmail(username, email string) (*domain.User, error)
	GetProfile(userID uint64) (*domain.UserProfileResponse, error)
}

type userService struct {
	repo        repository.UserRepository
	posService  PositionService
	tranService TransactionService
	balService  BalanceService
}

func NewUserService(repo repository.UserRepository, posService PositionService, tranService TransactionService, balService BalanceService) UserService {
	return &userService{repo: repo, posService: posService, tranService: tranService, balService: balService}
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

	db := s.repo.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		if err := s.repo.CreateUser(user, tx); err != nil {
			return err
		}

		defaultBalances := []domain.Balance{
			{UserID: uint64(user.ID), AssetType: "stock_balance", Amount: 0},
			{UserID: uint64(user.ID), AssetType: "cash_balance", Amount: 0},
		}

		for _, b := range defaultBalances {
			if err := s.balService.CreateBalance(&b, tx); err != nil {
				return err
			}
		}

		return nil
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

	balance, err := s.balService.GetBalances(userID, nil)
	if err != nil {
		return nil, err
	}

	totalEquity := balance.StockBalance
	for _, p := range portfolio {
		totalEquity += p.CurrentMarketPrice
	}

	return &domain.UserProfileResponse{
		Name:     user.Name,
		Username: user.Username,
		Balance: domain.BalanceDetail{
			CashBalance:  balance.CashBalance,
			StockBalance: balance.StockBalance,
		},
		TotalEquity: totalEquity,
		Portfolio:   portfolio,
	}, nil
}
