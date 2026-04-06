package domain

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Note struct {
	gorm.Model

	Title       string         `gorm:"type:varchar(255);not null"`
	Description string         `gorm:"type:text;not null"`
	Category    string         `gorm:"type:varchar(100);not null;default:'General';index"`
	ImageURL    pq.StringArray `gorm:"type:text[]"`
	UserID      uint64         `gorm:"not null;index"`
}

type NoteResponse struct {
	ID          uint      `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	ImageURL    []string  `json:"image_url"`
	CreatedAt   time.Time `json:"created_at"`
}

type NoteRequest struct {
	Title       string   `json:"title" validate:"required,min=2,max=50"`
	Description string   `json:"description" validate:"required"`
	Category    string   `json:"category"`
	ImageURL    []string `json:"image_url" validate:"max=5,dive,url"`
}
