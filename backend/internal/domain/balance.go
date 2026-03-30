package domain

import (
	"gorm.io/gorm"
)

type Balance struct {
	gorm.Model

	UserID    uint64  `gorm:"not null;index"`
	Amount    float64 `gorm:"default:0;not null"`
	AssetType string  `gorm:"type:varchar(20);not null;default:'stock_balance';index"`
}

type BalanceResponse struct {
	CashBalance  float64 `json:"cash_balance"`
	StockBalance float64 `json:"stock_balance"`
}

type BalanceDetail struct {
	StockBalance float64 `json:"stock_balance"`
	CashBalance  float64 `json:"cash_balance"`
	TotalLiquid  float64 `json:"total_liquid"`
}

type BalanceUpdateReq struct {
	Amount     float64 `json:"amount" validate:"required,gt=0"`
	Fee        float64 `json:"fee" validate:"gte=0"`
	Mode       string  `json:"mode" validate:"required,oneof=add rem mod"`
	AssetType  string  `json:"asset_type" validate:"required,oneof=stock_balance cash_balance"`
	Note       string  `json:"note" validate:"lt=50"`
	BankSource string  `json:"bank_src" validate:"required,gt=0,lt=18"`
	Title      string  `json:"title" validate:"lt=20"`
}
