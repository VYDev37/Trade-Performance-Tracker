package market

import (
	"time"
)

func IsMarketOpen(holidays CheckedList, targetTime time.Time) bool {
	loc, _ := time.LoadLocation("Asia/Jakarta")
	now := targetTime.In(loc)

	weekday := now.Weekday()
	if weekday == time.Saturday || weekday == time.Sunday { // weekend
		return false
	}

	dateStr := now.Format("02-01")
	if holidays[dateStr] {
		return false
	}

	hour := now.Hour()
	minute := now.Minute()
	totalMinutes := hour*60 + minute

	openTime := 9 * 60     // 09:00
	closeTime := 16 * 60   // 16:00
	lunchStart := 12 * 60  // 12:00
	lunchEnd := 13*60 + 30 // 13:30

	if totalMinutes < openTime || totalMinutes >= closeTime {
		return false
	}

	if totalMinutes >= lunchStart && totalMinutes < lunchEnd {
		return false
	}

	return true
}
