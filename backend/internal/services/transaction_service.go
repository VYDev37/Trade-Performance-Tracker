package services

import (
	"fmt"
	"trade-tracker/internal/domain"
	"trade-tracker/internal/repository"

	"gorm.io/gorm"
)

type TransactionService interface {
	LogActivity(pos *domain.Position, qty, price, fee, basePrice float64, action, notes string, txx *gorm.DB) error
	GetLocalTransactions(userID uint64) ([]domain.TransactionResponse, error)
}

type transactionService struct {
	repo repository.TransactionRepository
}

func NewTransactionService(repo repository.TransactionRepository) TransactionService {
	return &transactionService{repo: repo}
}

func (s *transactionService) LogActivity(pos *domain.Position, qty, price, fee, basePrice float64, action, notes string, tx *gorm.DB) error {
	log := &domain.Transaction{
		OwnerID:         pos.OwnerID,
		Ticker:          pos.Ticker,
		TransactionType: action,
		Quantity:        qty,
		Price:           price,
		BasePrice:       basePrice,
		TransactionFee:  fee,
		Notes:           notes,
	}

	err := s.repo.AddTransaction(log, tx)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}

func (s *transactionService) GetLocalTransactions(userID uint64) ([]domain.TransactionResponse, error) {
	var result []domain.TransactionResponse

	trans, err := s.repo.GetTransactions(userID)
	if err != nil {
		return nil, err
	}

	for _, t := range trans {
		realizedPnl := t.Price - t.BasePrice - t.TransactionFee
		if t.TransactionType != "sell" {
			realizedPnl = 0
		}

		ppu := t.BasePrice / t.Quantity
		if t.TransactionType == "cashflow" {
			ppu = 0
		}

		result = append(result, domain.TransactionResponse{
			Transaction:  t,
			PricePerUnit: ppu,
			RealizedPnl:  realizedPnl,
		})
	}

	return result, nil
}
