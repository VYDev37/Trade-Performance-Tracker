package services

import (
	"trade-tracker/core/domain"
	"trade-tracker/core/repository"

	"gorm.io/gorm"
)

type TransactionService interface {
	LogActivity(params LogActivityParams, txx *gorm.DB) error
	GetLocalTransactions(userID uint64) ([]domain.TransactionResponse, error)
	UpdateTransaction(id uint, userID uint64, req domain.TransactionUpdateReq) error
}

type transactionService struct {
	repo    repository.TransactionRepository
	balRepo repository.BalanceRepository
}

type LogActivityParams struct {
	Position  *domain.Position
	Quantity  float64
	Price     float64
	Fee       float64
	BasePrice float64
	Action    string
	Notes     string
	Title     string
}

func NewTransactionService(repo repository.TransactionRepository, balRepo repository.BalanceRepository) TransactionService {
	return &transactionService{repo: repo, balRepo: balRepo}
}

func (s *transactionService) LogActivity(params LogActivityParams, tx *gorm.DB) error {
	log := &domain.Transaction{
		OwnerID:         params.Position.OwnerID,
		Ticker:          params.Position.Ticker,
		TransactionType: params.Action,
		Quantity:        params.Quantity,
		Price:           params.Price,
		BasePrice:       params.BasePrice,
		TransactionFee:  params.Fee,
		Notes:           params.Notes,
		Title:           params.Title,
	}

	err := s.repo.AddTransaction(log, tx)
	if err != nil {
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
		isTrade := t.TransactionType == "sell" || t.TransactionType == "buy"
		if isTrade && t.Quantity <= 0 {
			continue
		}

		realizedPnl := t.Price - t.BasePrice - t.TransactionFee
		if t.TransactionType != "sell" {
			realizedPnl = 0
		}

		ppu := t.BasePrice / t.Quantity
		//if t.TransactionType == "cashflow" || t.TransactionType == "expense" || t.TransactionType == "income"
		if !isTrade {
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

func (s *transactionService) UpdateTransaction(id uint, userID uint64, req domain.TransactionUpdateReq) error {
	db := s.repo.GetDB()

	return db.Transaction(func(tx *gorm.DB) error {
		trx, err := s.repo.GetTransactionByID(id, tx)
		if err != nil {
			return domain.ErrItemNotFound
		}

		if trx.OwnerID != userID || (trx.TransactionType != "income" && trx.TransactionType != "expense") {
			return domain.ErrMismatchInfo
		}

		oldPrice := trx.Price
		if trx.Price != oldPrice {
			delta := trx.Price - oldPrice
			if trx.TransactionType == "expense" {
				delta *= -1
			}

			bal, err := s.balRepo.GetBalanceByType(userID, "cash_balance", tx)
			if err != nil {
				return err
			}

			if bal+delta < 0 {
				return domain.ErrInsufficientBalance
			}

			if err := s.balRepo.UpdateBalance(&domain.Balance{
				UserID:    userID,
				AssetType: "cash_balance",
				Amount:    delta,
			}, tx); err != nil {
				return err
			}
		}

		trx.Title = req.Title
		trx.Notes = req.Notes
		trx.Price = req.Price

		return s.repo.UpdateTransaction(trx, tx)
	})
}
