package domain

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model

	ID              uint    `json:"id"`
	OwnerID         uint64  `gorm:"not null" json:"owner_id"`
	TransactionType string  `gorm:"not null;default:'buy'" json:"transaction_type"`
	TransactionFee  float64 `gorm:"not null" json:"transaction_fee"`
	Quantity        float64 `gorm:"not null" json:"quantity"`
	BasePrice       float64 `gorm:"not null" json:"base_price"`
	Price           float64 `gorm:"not null" json:"price"`
	Ticker          string  `gorm:"not null" json:"ticker"`
	Notes           string  `gorm:"type:varchar(255)" json:"notes"`

	CreatedAt time.Time `json:"created_at"`
}

type TransactionResponse struct {
	Transaction

	RealizedPnl  float64 `json:"realized_pnl"`
	PricePerUnit float64 `json:"price_per_unit"`
}
