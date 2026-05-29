package worker

import (
	"fmt"
	"time"
	"trade-tracker/pkg/utils/market"

	"github.com/VYDev37/go-tvscanner-api/pkg/scanner"
)

func UpdateStock(holidays market.CheckedList, now time.Time, isInit bool) bool {
	if !market.IsMarketOpen(holidays, now) && !isInit {
		return false
	}

	opts := scanner.FetcherOptions{Market: "indonesia", Limit: 1000}
	data, err := scanner.FetchStockData(opts)
	if err == nil {
		scanner.GlobalStore.UpdateData(data)
		fmt.Println("[WORKER]: Stock data updated at", time.Now().Format("15:04:05"))
	}

	return true
}
