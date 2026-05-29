package market

import (
	"encoding/json"
	"fmt"
	"os"
)

type CheckedList map[string]bool

type HolidayInfo struct {
	Year2026 []string `json:"2026"`
}

func LoadHolidays(path string) CheckedList {
	holidays := make(CheckedList)

	file, err := os.ReadFile(path)
	if err != nil {
		fmt.Println("Skipped due to failure when trying to parse json:", err)
	}

	var holiday HolidayInfo
	if err := json.Unmarshal(file, &holiday); err != nil {
		fmt.Println("Skipped due to failure when trying to parse json:", err)
	}

	for _, date := range holiday.Year2026 {
		holidays[date] = true
	}

	return holidays
}
