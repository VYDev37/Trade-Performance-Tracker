package domain

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model

	ID              uint    `json:"id"`
	OwnerID         uint64  `gorm:"not null;index" json:"owner_id"`
	TransactionType string  `gorm:"not null;default:'buy'" json:"transaction_type"`
	TransactionFee  float64 `gorm:"not null" json:"transaction_fee"`
	Quantity        float64 `gorm:"not null" json:"quantity"`
	BasePrice       float64 `gorm:"not null" json:"base_price"`
	Price           float64 `gorm:"not null" json:"price"`
	Ticker          string  `gorm:"not null" json:"ticker"`
	Title           string  `gorm:"type:varchar(50)" json:"title"`
	Notes           string  `gorm:"type:varchar(255)" json:"notes"`

	CreatedAt time.Time `json:"created_at"`
}

type TransactionResponse struct {
	Transaction

	RealizedPnl  float64 `json:"realized_pnl"`
	PricePerUnit float64 `json:"price_per_unit"`
}

type TransactionUpdateReq struct {
	Title string  `json:"title"`
	Notes string  `json:"notes"`
	Price float64 `json:"price" validate:"gte=0"`
}
