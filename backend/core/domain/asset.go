package domain

import "time"

type AssetType string

const (
	AssetTypeStock  AssetType = "stock"
	AssetTypeCrypto AssetType = "crypto"
)

type Asset struct {
	Ticker       string    `gorm:"primaryKey;type:varchar(20)" json:"ticker"`
	AssetType    AssetType `gorm:"type:varchar(10);not null" json:"asset_type"`
	CurrentPrice float64   `gorm:"not null" json:"current_price"`
	MarketCap    float64   `json:"market_cap"`
	PBV          float64   `json:"pbv"`
	FreeFloat    float64   `json:"free_float"`
	ProfitQ1     float64   `json:"profit_q1"`
	ProfitQ2     float64   `json:"profit_q2"`
	ProfitQ3     float64   `json:"profit_q3"`
	ProfitQ4     float64   `json:"profit_q4"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

type AssetChartResponse struct {
	Ticker    string   `json:"ticker"`
	LastPrice float64  `json:"last_price"`
	DailyOpen float64  `json:"daily_open"`
	DailyHigh float64  `json:"daily_high"`
	DailyLow  float64  `json:"daily_low"`
	LastVol   float64  `json:"last_vol"`
	Chart     []Candle `json:"chart"`
}

type Candle struct {
	Time   int64   `json:"time"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume float64 `json:"volume"`
}
