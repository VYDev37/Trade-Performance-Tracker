package domain

import (
	"time"

	"gorm.io/gorm"
)

type Position struct {
	gorm.Model

	OwnerID           uint64  `gorm:"not null;index"`
	Ticker            string  `gorm:"not null;index" json:"ticker"`
	TotalQty          float64 `gorm:"not null" json:"total_qty"` // bisa aja untuk crypto
	InvestedTotal     float64 `gorm:"not null" json:"invested_total"`
	PositionType      string  `gorm:"type:varchar(20);not null;default:'stocks'" json:"position_type"`    // stocks / crypto / futures
	PositionDirection string  `gorm:"type:varchar(10);not null;default:'LONG'" json:"position_direction"` // LONG / SHORT
	TakeProfit        float64 `json:"tp_position"`
	StopLoss          float64 `json:"sl_position"`
}

type PositionAddReq struct {
	Ticker        string  `json:"ticker" validate:"required,min=4,max=10"` // crypto coming soon
	PositionType  string  `json:"position_type" validate:"required,oneof=stocks crypto futures"`
	TotalQty      float64 `json:"total_qty" validate:"required,gt=0"`
	InvestedTotal float64 `json:"invested_total" validate:"required,gt=0"` // avg price to add (ex: buy 3 lot BBRI for 800k IDR, avg += 800k, qty += 3)
	Fee           float64 `json:"fee" validate:"gte=0"`
	Notes         float64 `json:"notes" validate:"max=255"`
}

type PortfolioResponse struct {
	Ticker             string    `json:"ticker"`
	TotalQty           float64   `json:"total_qty"`
	InvestedTotal      float64   `json:"invested_total"`
	CurrentMarketPrice float64   `json:"current_price"`
	UnrealizedPnL      float64   `json:"unrealized_pnl"`
	PnLPercentage      float64   `json:"pnl_percentage"`
	UpdatedAt          time.Time `json:"updated_at"`
}
