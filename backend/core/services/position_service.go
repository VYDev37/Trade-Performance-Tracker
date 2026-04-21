package services

import (
	"errors"
	"fmt"
	"strings"

	"trade-tracker/core/domain"
	"trade-tracker/core/integrations/providers"
	"trade-tracker/core/repositories"
	"trade-tracker/pkg/utils/format"

	"gorm.io/gorm"
)

type PositionService interface {
	AddPosition(directionType string, pos *domain.Position, fee float64) error

	GetPositions(userID uint64) ([]domain.Position, error)
	GetPortfolio(userID uint64) (*domain.PortfolioResponse, error)
	GetTickerCurrentPrice(ticker string) (float64, error)
}

type positionService struct {
	repo     repositories.PositionRepository
	uRepo    repositories.UserRepository
	provider providers.PriceProvider

	balService         BalanceService
	transactionService TransactionService
}

func NewPositionService(repo repositories.PositionRepository, uRepo repositories.UserRepository, provider providers.PriceProvider, transactionService TransactionService, balService BalanceService) PositionService {
	return &positionService{repo: repo, uRepo: uRepo, provider: provider, transactionService: transactionService, balService: balService}
}

func (s *positionService) handleSellMode(existing *domain.Position, sellData *domain.Position, fee float64, tx *gorm.DB) error {
	if existing == nil || existing.ID == 0 || existing.TotalQty < sellData.TotalQty {
		return domain.ErrInsufficientAmount
	}

	if existing.OwnerID != sellData.OwnerID {
		return domain.ErrMismatchInfo
	}

	basePrice := (existing.InvestedTotal / existing.TotalQty) * sellData.TotalQty
	if sellData.TotalQty >= existing.TotalQty {
		basePrice = existing.InvestedTotal
	}

	if err := s.balService.UpdateBalance(existing.OwnerID, sellData.InvestedTotal-fee, "stock_balance", tx); err != nil {
		return domain.ErrInternalServerError
	}

	existing.InvestedTotal -= basePrice
	existing.TotalQty -= sellData.TotalQty

	if existing.TotalQty <= 0 {
		if err := s.repo.RemovePosition(existing.ID, tx); err != nil {
			return err
		}
	} else {
		if err := s.repo.UpdatePosition(existing, tx); err != nil {
			return err
		}
	}

	return s.transactionService.LogActivity(LogActivityParams{
		Position:  existing,
		Quantity:  sellData.TotalQty,
		Price:     sellData.InvestedTotal,
		Fee:       fee,
		BasePrice: basePrice,
		Action:    "sell",
		Notes:     fmt.Sprintf("Sold %.f lot of %s for %s.", sellData.TotalQty, sellData.Ticker, format.FormatNumber(sellData.InvestedTotal)),
		Title:     "",
	}, tx)
}

func (s *positionService) handleBuyMode(existing *domain.Position, buyData *domain.Position, fee float64, tx *gorm.DB) error {
	balance, err := s.balService.GetBalanceByType(buyData.OwnerID, "stock_balance", tx)
	if err != nil {
		return err
	}

	if balance < (buyData.InvestedTotal + fee) {
		return domain.ErrInsufficientBalance
	}

	if err := s.balService.UpdateBalance(buyData.OwnerID, -(buyData.InvestedTotal + fee), "stock_balance", tx); err != nil {
		return err
	}

	if existing != nil {
		if existing.OwnerID != buyData.OwnerID {
			return domain.ErrMismatchInfo
		}

		existing.TotalQty += buyData.TotalQty
		existing.InvestedTotal += buyData.InvestedTotal

		if err := s.repo.UpdatePosition(existing, tx); err != nil {
			return err
		}
	} else {
		if err := s.repo.AddPosition(buyData, tx); err != nil {
			return err
		}
	}

	return s.transactionService.LogActivity(LogActivityParams{
		Position:  buyData,
		Quantity:  buyData.TotalQty,
		Price:     buyData.InvestedTotal + fee,
		Fee:       fee,
		BasePrice: buyData.InvestedTotal,
		Action:    "buy",
		Notes:     fmt.Sprintf("Bought %.f lot of %s for %s.", buyData.TotalQty, buyData.Ticker, format.FormatNumber(buyData.InvestedTotal)),
		Title:     "",
	}, tx)
}

func (s *positionService) AddPosition(directionType string, pos *domain.Position, fee float64) error {
	directionType = strings.ToLower(directionType)

	pos.PositionType = strings.ToLower(pos.PositionType)
	pos.Ticker = strings.ToUpper(pos.Ticker)

	if _, err := s.provider.GetCurrentPrice(pos.Ticker); err != nil {
		return domain.ErrItemNotFound
	}

	if pos.TotalQty <= 0 {
		return domain.ErrInsufficientAmount
	}

	if directionType != "sell" && directionType != "buy" {
		directionType = "buy"
	}

	db := s.repo.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		existing, err := s.repo.GetPosByTicker(pos.OwnerID, pos.Ticker, tx)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		if pos.PositionType == "stocks" {
			pos.TotalQty *= 100 // convert to lot
		}

		if directionType == "sell" {
			return s.handleSellMode(existing, pos, fee, tx)
		}

		return s.handleBuyMode(existing, pos, fee, tx)
	})
}

func (s *positionService) GetPositions(userID uint64) ([]domain.Position, error) {
	return s.repo.GetPositions(userID)
}

func (s *positionService) GetPortfolio(userID uint64) (*domain.PortfolioResponse, error) {
	positions, err := s.repo.GetPositions(userID)
	if err != nil {
		return nil, err
	}

	tickers := []string{}
	for _, p := range positions {
		tickers = append(tickers, p.Ticker)
	}

	prices, _ := s.provider.GetBatchPrices(tickers)

	var totalEquity float64
	var portfolio []domain.PortfolioItem
	for _, p := range positions {
		currentPrice := prices[p.Ticker] * p.TotalQty // price per lot (only for IDX now)
		totalEquity += currentPrice

		unrealizedPnL := (currentPrice - p.InvestedTotal)
		pnlPercentage := 0.0
		if p.InvestedTotal > 0 {
			pnlPercentage = (unrealizedPnL / p.InvestedTotal) * 100
		}

		portfolio = append(portfolio, domain.PortfolioItem{
			Ticker:             p.Ticker,
			TotalQty:           p.TotalQty,
			InvestedTotal:      p.InvestedTotal,
			CurrentMarketPrice: currentPrice,
			UnrealizedPnL:      unrealizedPnL,
			PnLPercentage:      pnlPercentage,
			UpdatedAt:          p.UpdatedAt,
		})
	}

	return &domain.PortfolioResponse{
		Items:       portfolio,
		TotalEquity: totalEquity,
	}, nil
}

func (s *positionService) GetTickerCurrentPrice(ticker string) (float64, error) {
	return s.provider.GetCurrentPrice(ticker)
}
