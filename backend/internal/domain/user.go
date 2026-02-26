package domain

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	Name     string     `gorm:"not null" json:"name"`
	Email    string     `gorm:"not null;email" json:"email"`
	Username string     `gorm:"not null" json:"username"`
	Password string     `gorm:"not null"`
	Verified bool       `gorm:"not null;default:false" json:"verified"`
	Balance  float64    `gorm:"not null;default:0" json:"balance"`
	Position []Position `gorm:"foreignKey:OwnerID;reference:OwnerID;not null;default:0" json:"positions"`
}

type UserRegisterReq struct {
	Name     string `json:"name" validate:"required,min=3"`
	Username string `json:"username" validate:"required,alphanum,min=4"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,gte=8"`
}

type UserLoginReq struct {
	Identifier string `json:"identifier" validate:"required"`
	Password   string `json:"password" validate:"required"`
}

type UserProfileResponse struct {
	Name        string              `json:"name"`
	Username    string              `json:"username"`
	Balance     float64             `json:"balance"`
	TotalEquity float64             `json:"total_equity"`
	Portfolio   []PortfolioResponse `json:"positions"`
}

type UserBalanceUpdateReq struct {
	Amount     float64 `json:"amount" validate:"required,gt=0"`
	Fee        float64 `json:"fee" validate:"gte=0"`
	Mode       string  `json:"mode" validate:"required,oneof=add rem mod"`
	Note       string  `json:"note" validate:"lt=50"`
	BankSource string  `json:"bank_src" validate:"required,gt=0,lt=18"`
}
