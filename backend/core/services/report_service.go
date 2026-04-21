package services

import (
	"fmt"
	"math"
	"strings"

	"trade-tracker/core/integrations/providers"
	"trade-tracker/pkg/utils/excel"
	"trade-tracker/pkg/utils/format"

	"github.com/xuri/excelize/v2"
)

type ReportService interface {
	ExportProfile(userID uint64) (*excelize.File, error)
}

type reportService struct {
	pService PositionService
	uService UserService
	tService TransactionService

	provider providers.PriceProvider
}

func NewReportService(pService PositionService, uService UserService,
	tService TransactionService, provider providers.PriceProvider) ReportService {
	return &reportService{pService: pService, uService: uService, tService: tService, provider: provider}
}

func (s *reportService) exportFinancialLog(f *excelize.File, userID uint64) {
	sectionName := "Financial"
	f.NewSheet(sectionName)

	writer := excel.NewWriter(f, sectionName, 1)
	writer.WriteHeader([]interface{}{"My Financial Log"})

	startRow := writer.CurrentRow

	writer.SetFormat(2, excel.FormatDate)     // 2nd col: date
	writer.SetFormat(4, excel.FormatCurrency) // 4th col: amt
	writer.SetFormat(5, excel.FormatCurrency) // 5th col: fee

	header := []interface{}{"ID", "Date", "Source", "Amount", "Fee", "Flow type", "Note"}
	writer.WriteHeader(header)

	txs, err := s.tService.GetLocalTransactions(userID)
	if err != nil {
		return
	}

	for _, t := range txs {
		if t.TransactionType != "income" && t.TransactionType != "expense" {
			continue
		}
		writer.WriteRow([]interface{}{
			fmt.Sprintf("#%d", t.ID),
			t.CreatedAt,
			t.Ticker,
			t.Price,
			t.TransactionFee,
			strings.ToUpper(t.TransactionType),
			t.Notes,
		})
	}

	writer.BuildTable(sectionName, startRow, len(header))
}

func (s *reportService) exportTransactions(f *excelize.File, userID uint64) {
	sectionName := "Transactions"
	f.NewSheet(sectionName)

	writer := excel.NewWriter(f, sectionName, 1)
	writer.WriteHeader([]interface{}{"My Transactions"})

	startRow := writer.CurrentRow

	header := []interface{}{"ID", "Date", "Ticker", "Amount", "Fee", "Action"}
	writer.WriteHeader(header)

	txs, err := s.tService.GetLocalTransactions(userID)
	if err != nil {
		return
	}
	for _, t := range txs {
		if t.TransactionType != "buy" && t.TransactionType != "sell" {
			continue
		}
		writer.WriteRow([]interface{}{
			fmt.Sprintf("#%d", t.ID),
			t.CreatedAt,
			t.Ticker,
			format.FormatCurrency(t.Price),
			format.FormatCurrency(t.TransactionFee),
			strings.ToUpper(t.TransactionType),
		})
	}

	writer.BuildTable(sectionName, startRow, len(header))
}

func (s *reportService) exportPositions(f *excelize.File, userID uint64) {
	sectionName := "Portfolio"
	f.NewSheet(sectionName)

	writer := excel.NewWriter(f, sectionName, 1)
	writer.WriteHeader([]interface{}{"My Open Positions"})

	startRow := writer.CurrentRow
	header := []interface{}{
		"No", "Ticker", "AvgPrice", "Invested Amount",
		"Quantity", "Market Value", "PnL Unrealized", "PnL Unrealized (Percentage)",
	}

	writer.WriteHeader(header)

	pos, _ := s.pService.GetPositions(userID)
	tickers := []string{}

	for _, p := range pos {
		tickers = append(tickers, p.Ticker)
	}

	var currentValue float64

	portfolio, err := s.pService.GetPortfolio(userID)
	if portfolio == nil || err != nil {
		return
	}

	prices, _ := s.provider.GetBatchPrices(tickers)
	for i, p := range pos {
		currentPrice := prices[p.Ticker] * p.TotalQty
		if currentPrice <= 0 || p.InvestedTotal <= 0 {
			continue
		}
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
			format.FormatCurrency(p.InvestedTotal / p.TotalQty),
			format.FormatCurrency(p.InvestedTotal),
			format.FormatNumber(p.TotalQty),
			format.FormatCurrency(currentPrice),
			format.FormatCurrency(delta),
			percentStr,
		})
	}

	writer.BuildTable(sectionName, startRow, len(header))
	writer.SkipRow()

	header2 := []interface{}{"NAME", "AMOUNT"}
	startRow2 := writer.CurrentRow

	writer.WriteHeader(header2)

	writer.WriteRow([]interface{}{"Total invested amount", format.FormatCurrency(portfolio.TotalEquity)})
	writer.WriteRow([]interface{}{"Market value", format.FormatCurrency(currentValue)})

	writer.BuildTable(sectionName+"_2", startRow2, len(header2))
}

func (s *reportService) ExportProfile(userID uint64) (*excelize.File, error) {
	f := excelize.NewFile()

	s.exportTransactions(f, userID)
	s.exportPositions(f, userID)
	s.exportFinancialLog(f, userID)

	index, _ := f.GetSheetIndex("Transactions")

	f.SetActiveSheet(index)
	f.DeleteSheet("Sheet1")

	return f, nil
}
