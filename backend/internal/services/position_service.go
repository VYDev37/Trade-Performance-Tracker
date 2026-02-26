package services

import (
	"fmt"
	"strings"

	"trade-tracker/internal/domain"
	"trade-tracker/internal/integrations/providers"
	"trade-tracker/internal/repository"

	"gorm.io/gorm"
)

type PositionService interface {
	AddPosition(directionType string, pos *domain.Position, fee float64) error

	GetPositions(userID uint64) ([]domain.Position, error)
	GetPortfolio(userID uint64) ([]domain.PortfolioResponse, error)
	GetTickerCurrentPrice(ticker string) (float64, error)
}

type positionService struct {
	repo               repository.PositionRepository
	uRepo              repository.UserRepository
	provider           providers.PriceProvider
	transactionService TransactionService
}

func NewPositionService(repo repository.PositionRepository, uRepo repository.UserRepository, provider providers.PriceProvider, transactionService TransactionService) PositionService {
	return &positionService{repo: repo, uRepo: uRepo, provider: provider, transactionService: transactionService}
}

func (s *positionService) handleSellMode(existing *domain.Position, sellData *domain.Position, fee float64) error {
	db := s.repo.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		if existing.ID == 0 || existing.TotalQty < sellData.TotalQty {
			return domain.ErrInsufficientAmount
		}

		if existing.OwnerID != sellData.OwnerID {
			return domain.ErrMismatchInfo
		}

		basePrice := (existing.InvestedTotal / existing.TotalQty) * sellData.TotalQty
		if sellData.TotalQty >= existing.TotalQty {
			basePrice = existing.InvestedTotal
		}

		existing.InvestedTotal -= basePrice
		existing.TotalQty -= sellData.TotalQty

		if err := s.uRepo.UpdateBalance(existing.OwnerID, sellData.InvestedTotal-fee, tx); err != nil {
			return domain.ErrInternalServerError
		}
		if existing.TotalQty <= 0 {
			return s.repo.RemovePosition(existing.OwnerID, existing.Ticker, tx)
		}
		if err := s.repo.Update(existing, tx); err != nil {
			return err
		}
		return s.transactionService.LogActivity(existing, sellData.TotalQty, sellData.InvestedTotal, fee, basePrice,
			"sell", fmt.Sprintf("Sold %.f lot of %s for Rp%.f.", sellData.TotalQty, sellData.Ticker, sellData.InvestedTotal), tx)
	})
}

func (s *positionService) handleBuyMode(existing *domain.Position, buyData *domain.Position, fee float64) error {
	db := s.repo.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		balance, err := s.uRepo.GetBalance(buyData.OwnerID, tx)
		if err != nil {
			return err
		}

		if balance < (buyData.InvestedTotal + fee) {
			return domain.ErrInsufficientBalance
		}

		if err := s.uRepo.UpdateBalance(buyData.OwnerID, -(buyData.InvestedTotal + fee), tx); err != nil {
			return err
		}

		if existing.ID != 0 {
			if existing.OwnerID != buyData.OwnerID {
				return domain.ErrMismatchInfo
			}

			existing.TotalQty += buyData.TotalQty
			existing.InvestedTotal += buyData.InvestedTotal

			if err := s.repo.Update(existing, tx); err != nil {
				return err
			}
		} else {
			if err := s.repo.AddPosition(buyData, tx); err != nil {
				return err
			}
		}

		return s.transactionService.LogActivity(existing, buyData.TotalQty, buyData.InvestedTotal+fee, fee, buyData.InvestedTotal, "buy",
			fmt.Sprintf("Bought %.f lot of %s for Rp%.f", buyData.TotalQty, buyData.Ticker, buyData.InvestedTotal), tx)
	})
}

func (s *positionService) AddPosition(directionType string, pos *domain.Position, fee float64) error {
	directionType = strings.ToLower(directionType)
	pos.PositionType = strings.ToLower(pos.PositionType)

	if directionType != "sell" && directionType != "buy" {
		directionType = "buy"
	}

	existing, _ := s.repo.GetPosByTicker(pos.OwnerID, pos.Ticker)
	if _, err := s.provider.GetCurrentPrice(pos.Ticker); err != nil {
		return domain.ErrItemNotFound
	}

	if pos.PositionType == "stocks" {
		pos.TotalQty *= 100 // convert to lot
	}

	if directionType == "sell" {
		return s.handleSellMode(existing, pos, fee)
	}

	return s.handleBuyMode(existing, pos, fee)
}

func (s *positionService) GetPositions(userID uint64) ([]domain.Position, error) {
	return s.repo.GetPositions(userID)
}

func (s *positionService) GetPortfolio(userID uint64) ([]domain.PortfolioResponse, error) {
	positions, err := s.repo.GetPositions(userID)
	if err != nil {
		return nil, err
	}

	tickers := []string{}
	for _, p := range positions {
		tickers = append(tickers, p.Ticker)
	}

	prices, _ := s.provider.GetBatchPrices(tickers)

	var portfolio []domain.PortfolioResponse
	for _, p := range positions {
		currentPrice := prices[p.Ticker] * p.TotalQty // price per lot (only for IDX now)

		unrealizedPnL := (currentPrice - p.InvestedTotal)
		pnlPercentage := 0.0
		if p.InvestedTotal > 0 {
			pnlPercentage = (unrealizedPnL / p.InvestedTotal) * 100
		}

		portfolio = append(portfolio, domain.PortfolioResponse{
			Ticker:             p.Ticker,
			TotalQty:           p.TotalQty,
			InvestedTotal:      p.InvestedTotal,
			CurrentMarketPrice: currentPrice,
			UnrealizedPnL:      unrealizedPnL,
			PnLPercentage:      pnlPercentage,
			UpdatedAt:          p.UpdatedAt,
		})
	}

	return portfolio, nil
}

func (s *positionService) GetTickerCurrentPrice(ticker string) (float64, error) {
	return s.provider.GetCurrentPrice(ticker)
}
