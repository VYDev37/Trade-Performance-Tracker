package excel

import (
	"fmt"
	"time"
	"unicode/utf8"

	"github.com/xuri/excelize/v2"
)

const (
	FormatText = iota
	FormatCurrency
	FormatNumber
	FormatDate
)

type ExcelWriter struct {
	File       *excelize.File
	Sheet      string
	CurrentRow int
	MaxWidths  []float64
	Styles     map[int]int
	ColMapping map[int]int
}

func strPtr(s string) *string {
	return &s
}

func NewWriter(f *excelize.File, sheet string, startRow int) *ExcelWriter {
	styles := make(map[int]int)
	styles[FormatCurrency], _ = f.NewStyle(&excelize.Style{
		CustomNumFmt: strPtr(`_("Rp"* #,##0_);_([Red]"Rp"* (#,##0);_("Rp"* "-"_);_(@_)`),
		Alignment:    &excelize.Alignment{Horizontal: "right"},
	})

	styles[FormatNumber], _ = f.NewStyle(&excelize.Style{
		CustomNumFmt: strPtr("#,##0.00"),
		Alignment:    &excelize.Alignment{Horizontal: "right"},
	})

	styles[FormatDate], _ = f.NewStyle(&excelize.Style{
		CustomNumFmt: strPtr("yyyy-mm-dd hh:mm"),
	})

	if startRow < 1 {
		startRow = 1
	}

	return &ExcelWriter{
		File:       f,
		Sheet:      sheet,
		CurrentRow: startRow,
		MaxWidths:  []float64{},
		Styles:     styles,
		ColMapping: make(map[int]int),
	}
}

func (w *ExcelWriter) updateWidth(colIdx int, length float64) {
	for len(w.MaxWidths) <= colIdx {
		w.MaxWidths = append(w.MaxWidths, 0)
	}
	if length > w.MaxWidths[colIdx] {
		w.MaxWidths[colIdx] = length
	}
}

func (w *ExcelWriter) SetFormat(colIdx int, formatType int) {
	w.ColMapping[colIdx] = formatType
}

func (w *ExcelWriter) AutoFit() {
	for i, width := range w.MaxWidths {
		colName, _ := excelize.ColumnNumberToName(i + 1)

		finalWidth := width
		if finalWidth < 10 {
			finalWidth = 10
		}
		if finalWidth > 55 {
			finalWidth = 55
		}

		w.File.SetColWidth(w.Sheet, colName, colName, finalWidth)
	}
}

func (w *ExcelWriter) WriteRow(values []interface{}) error {
	cell, _ := excelize.CoordinatesToCellName(1, w.CurrentRow)
	err := w.File.SetSheetRow(w.Sheet, cell, &values)
	if err != nil {
		return err
	}

	for i, val := range values {
		if fmtType, ok := w.ColMapping[i+1]; ok {
			targetCell, _ := excelize.CoordinatesToCellName(i+1, w.CurrentRow)
			w.File.SetCellStyle(w.Sheet, targetCell, targetCell, w.Styles[fmtType])
		}

		var length float64
		if _, ok := val.(time.Time); ok {
			length = 18
		} else {
			strVal := fmt.Sprintf("%v", val)
			length = float64(utf8.RuneCountInString(strVal))
		}

		w.updateWidth(i, length+2)
	}
	w.CurrentRow++
	return nil
}

func (w *ExcelWriter) WriteHeader(values []interface{}) error {
	if len(w.MaxWidths) == 0 {
		w.MaxWidths = make([]float64, len(values))
	}
	styleID, err := w.File.NewStyle(&excelize.Style{
		Fill: excelize.Fill{
			Type: "pattern", Color: []string{"#002060"}, Pattern: 1,
		},
		Font: &excelize.Font{
			Bold: true, Color: "#FFFFFF", Size: 11,
		},
		Alignment: &excelize.Alignment{
			Horizontal: "center", Vertical: "center",
		},
		Border: []excelize.Border{
			{Type: "bottom", Color: "000000", Style: 2},
		},
	})
	if err != nil {
		return err
	}

	startCell, _ := excelize.CoordinatesToCellName(1, w.CurrentRow)
	if err := w.File.SetSheetRow(w.Sheet, startCell, &values); err != nil {
		return err
	}

	for i, val := range values {
		strVal := fmt.Sprintf("%v", val)
		length := float64(utf8.RuneCountInString(strVal))
		w.updateWidth(i, length+4)
	}

	endCell, _ := excelize.CoordinatesToCellName(len(values), w.CurrentRow)
	if err := w.File.SetCellStyle(w.Sheet, startCell, endCell, styleID); err != nil {
		return err
	}

	w.File.SetRowHeight(w.Sheet, w.CurrentRow, 20)
	w.CurrentRow++

	return nil
}

func (w *ExcelWriter) BuildTable(tableName string, startRow int, colCount int) error {
	lastRow := w.CurrentRow - 1
	if lastRow < startRow {
		lastRow = startRow
	}
	startCell, _ := excelize.CoordinatesToCellName(1, startRow)
	endCell, _ := excelize.CoordinatesToCellName(colCount, w.CurrentRow-1)
	tableRange := fmt.Sprintf("%v:%v", startCell, endCell)

	var showStripes = true
	err := w.File.AddTable(w.Sheet, &excelize.Table{
		Range:          tableRange,
		Name:           tableName,
		StyleName:      "TableStyleMedium9",
		ShowRowStripes: &showStripes,
	})

	w.AutoFit()
	return err
}

func (w *ExcelWriter) SkipRow() {
	w.CurrentRow++
}
