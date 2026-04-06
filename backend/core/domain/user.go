package domain

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	Name     string `gorm:"not null" json:"name"`
	Email    string `gorm:"not null;email;index" json:"email"`
	Username string `gorm:"not null;index" json:"username"`
	Password string `gorm:"not null"`
	Verified bool   `gorm:"not null;default:false" json:"verified"`

	Balances []Balance  `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"balances"`
	Notes    []Note     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"notes"`
	Position []Position `gorm:"foreignKey:OwnerID;reference:ID;not null;default:0" json:"positions"`
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
	Balance     BalanceDetail       `json:"balance"`
	TotalEquity float64             `json:"total_equity"`
	Portfolio   []PortfolioResponse `json:"positions"`
}
