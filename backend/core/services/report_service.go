package services

import (
	"fmt"
	"math"
	"trade-tracker/core/integrations/providers"
	"trade-tracker/core/repository"
	"trade-tracker/pkg/utils/excel"
	"trade-tracker/pkg/utils/format"

	"github.com/xuri/excelize/v2"
)

type ReportService interface {
	ExportProfile(userID uint64) (*excelize.File, error)
}

type reportService struct {
	pRepo repository.PositionRepository
	uRepo repository.UserRepository
	tRepo repository.TransactionRepository

	provider providers.PriceProvider
}

func NewReportService(pRepo repository.PositionRepository, uRepo repository.UserRepository,
	tRepo repository.TransactionRepository, provider providers.PriceProvider) ReportService {
	return &reportService{pRepo: pRepo, uRepo: uRepo, tRepo: tRepo, provider: provider}
}

func (s *reportService) exportTransactions(f *excelize.File, userID uint64) {
	sheetName := "Transactions"
	f.NewSheet(sheetName)

	writer := excel.NewWriter(f, sheetName, 1)
	writer.WriteRow([]interface{}{"ID", "Date", "Ticker", "Amount"})

	txs, _ := s.tRepo.GetTransactions(userID)
	for _, t := range txs {
		writer.WriteRow([]interface{}{fmt.Sprintf("#%d", t.ID), t.CreatedAt, t.Ticker, t.Price})
	}
}

func (s *reportService) exportPositions(f *excelize.File, userID uint64) {
	sheetName := "Portfolio"
	f.NewSheet(sheetName)

	writer := excel.NewWriter(f, sheetName, 1)
	writer.WriteRow([]interface{}{"My Open Positions"})

	startRow := writer.CurrentRow
	header := []interface{}{
		"No", "Ticker", "AvgPrice", "Invested Amount",
		"Lot", "Market Value", "PnL Unrealized", "PnL Unrealized (Percentage)",
	}

	writer.WriteHeader(header)

	pos, _ := s.pRepo.GetPositions(userID)
	tickers := []string{}

	for _, p := range pos {
		tickers = append(tickers, p.Ticker)
	}

	var investedTotal float64
	var currentValue float64

	prices, _ := s.provider.GetBatchPrices(tickers)
	for i, p := range pos {
		currentPrice := prices[p.Ticker] * p.TotalQty
		if currentPrice <= 0 || p.InvestedTotal <= 0 {
			continue
		}

		investedTotal += p.InvestedTotal
		currentValue += currentPrice

		delta := currentPrice - p.InvestedTotal
		pnlPercent := math.Abs((delta / p.InvestedTotal) * 100)

		percentStr := format.FormatNumber(pnlPercent)
		if delta < 0 {
			percentStr = "(" + percentStr + ")"
		}
		writer.WriteRow([]interface{}{
			i + 1,
			p.Ticker,
			format.FormatNumber(p.InvestedTotal / p.TotalQty),
			format.FormatNumber(p.InvestedTotal),
			format.FormatNumber(p.TotalQty),
			format.FormatNumber(currentPrice),
			fmt.Sprintf("%.2f", delta),
			percentStr,
		})
	}

	writer.BuildTable("Positions", startRow, len(header))

	writer.WriteRow([]interface{}{"Total invested amount: " + format.FormatNumber(investedTotal)})
	writer.WriteRow([]interface{}{"Market value: " + format.FormatNumber(currentValue)})
}

func (s *reportService) ExportProfile(userID uint64) (*excelize.File, error) {
	f := excelize.NewFile()

	s.exportTransactions(f, userID)
	s.exportPositions(f, userID)

	index, _ := f.GetSheetIndex("Transactions")

	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	return f, nil
}
