package excel

import "github.com/xuri/excelize/v2"

type ExcelWriter struct {
	File       *excelize.File
	Sheet      string
	CurrentRow int
}

func NewWriter(f *excelize.File, sheet string, startRow int) *ExcelWriter {
	return &ExcelWriter{File: f, Sheet: sheet, CurrentRow: startRow}
}

func (w *ExcelWriter) WriteRow(values []interface{}) error {
	cell, _ := excelize.CoordinatesToCellName(1, w.CurrentRow)
	err := w.File.SetSheetRow(w.Sheet, cell, &values)
	if err == nil {
		w.CurrentRow++
	}
	return err
}

func (w *ExcelWriter) WriteHeader(values []interface{}) error {
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

	endCell, _ := excelize.CoordinatesToCellName(len(values), w.CurrentRow)
	err = w.File.SetCellStyle(w.Sheet, startCell, endCell, styleID)

	w.File.SetRowHeight(w.Sheet, w.CurrentRow, 20)

	if err == nil {
		w.CurrentRow++
	}
	return err
}

func (w *ExcelWriter) BuildTable(tableName string, startRow int, colCount int) error {
	startCell, _ := excelize.CoordinatesToCellName(1, startRow)
	endCell, _ := excelize.CoordinatesToCellName(colCount, w.CurrentRow-1)
	tableRange := startCell + ":" + endCell

	var showStripes = true
	err := w.File.AddTable(w.Sheet, &excelize.Table{
		Range:          tableRange,
		Name:           tableName,
		StyleName:      "TableStyleMedium9",
		ShowRowStripes: &showStripes,
	})

	for i := 1; i <= colCount; i++ {
		colName, _ := excelize.ColumnNumberToName(i)
		w.File.SetColWidth(w.Sheet, colName, colName, 18)
	}

	return err
}

func (w *ExcelWriter) SkipRow() {
	w.CurrentRow++
}
