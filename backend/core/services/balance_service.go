package services

import (
	"math"
	"strings"
	"trade-tracker/core/domain"
	"trade-tracker/core/repositories"

	"gorm.io/gorm"
)

type BalanceService interface {
	CreateBalance(balance *domain.Balance, trx *gorm.DB) error
	RemoveBalance(id uint64, userID uint64, trx *gorm.DB) error
	AdjustBalance(userID uint64, req domain.BalanceUpdateReq) error
	UpdateBalance(userID uint64, amount float64, assetType string, tx *gorm.DB) error

	GetBalanceByType(userID uint64, balanceType string, trx *gorm.DB) (float64, error)
	GetBalances(userID uint64, trx *gorm.DB) (*domain.BalanceResponse, error)
}

type balanceService struct {
	repo        repositories.BalanceRepository
	tranService TransactionService
}

func NewBalanceService(repo repositories.BalanceRepository, tranService TransactionService) BalanceService {
	return &balanceService{repo: repo, tranService: tranService}
}

func (s *balanceService) CreateBalance(balance *domain.Balance, trx *gorm.DB) error {
	return s.repo.CreateBalance(balance, trx)
}

func (s *balanceService) RemoveBalance(id uint64, userID uint64, trx *gorm.DB) error {
	if balance, err := s.repo.GetBalance(id, trx); err != nil || balance.UserID != userID {
		return domain.ErrMismatchInfo
	}

	return s.repo.RemoveBalance(id, trx)
}

func (s *balanceService) UpdateBalance(userID uint64, amount float64, assetType string, tx *gorm.DB) error {
	if amount < 0 {
		current, _ := s.repo.GetBalanceByType(userID, assetType, tx)
		if current < math.Abs(amount) {
			return domain.ErrInsufficientBalance
		}
	}
	return s.repo.UpdateBalance(&domain.Balance{
		UserID:    userID,
		Amount:    amount,
		AssetType: assetType,
	}, tx)
}

func (s *balanceService) AdjustBalance(userID uint64, req domain.BalanceUpdateReq) error {
	db := s.repo.GetDB()

	return db.Transaction(func(tx *gorm.DB) error {
		bal, err := s.repo.GetBalanceByType(userID, req.AssetType, tx)
		if err != nil {
			return err
		}

		var logged float64

		tType := ""
		switch strings.ToLower(req.Mode) {
		case "add":
			logged = req.Amount
			if req.AssetType == "cash_balance" {
				tType = "income"
			}
		case "rem":
			if bal < req.Amount {
				return domain.ErrInsufficientBalance
			}
			logged = -req.Amount
			if req.AssetType == "cash_balance" {
				tType = "expense"
			}
		case "mod":
			logged = req.Amount - bal
		}

		if err := s.UpdateBalance(userID, logged, req.AssetType, tx); err != nil {
			return err
		}

		note := req.Note
		if note == "" {
			note = req.Mode + " Cash"
		}

		if tType == "" {
			tType = "cashflow"
		}

		return s.tranService.LogActivity(LogActivityParams{
			Position: &domain.Position{
				OwnerID: userID,
				Ticker:  req.BankSource,
			},
			Action:    tType,
			Title:     req.Title,
			Price:     req.Amount,
			Fee:       req.Fee,
			Quantity:  0,
			BasePrice: 0,
			Notes:     req.Note,
		}, tx)
	})
}

func (s *balanceService) GetBalanceByType(userID uint64, balanceType string, trx *gorm.DB) (float64, error) {
	return s.repo.GetBalanceByType(userID, balanceType, trx)
}

func (s *balanceService) GetBalances(userID uint64, trx *gorm.DB) (*domain.BalanceResponse, error) {
	balances, err := s.repo.GetBalances(userID, trx)
	if err != nil {
		return nil, err
	}

	res := &domain.BalanceResponse{}
	for _, b := range balances {
		switch b.AssetType {
		case "stock_balance":
			res.StockBalance = b.Amount
		case "cash_balance":
			res.CashBalance = b.Amount
		}
	}

	return res, nil
}
