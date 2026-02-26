package repository

import (
	"trade-tracker/internal/domain"

	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(user *domain.User) error
	UpdateBalance(userID uint64, balance float64, trx *gorm.DB) error
	GetUserByUsernameOrEmail(username, email string) (*domain.User, error)
	GetUserByID(userID uint64) (*domain.User, error)
	GetBalance(userID uint64, trx *gorm.DB) (float64, error)

	GetDB() *gorm.DB
}

type userRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) CreateUser(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *userRepo) UpdateBalance(userID uint64, balance float64, trx *gorm.DB) error {
	db := r.db
	if trx != nil {
		db = trx
	}
	return db.Model(&domain.User{}).Where("id = ?", userID).Update("balance", gorm.Expr("balance + ?", balance)).Error
}

func (r *userRepo) GetUserByUsernameOrEmail(username, email string) (*domain.User, error) {
	var user domain.User
	if err := r.db.Where("username ILIKE ? OR email ILIKE ?", username, email).Take(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) GetUserByID(userID uint64) (*domain.User, error) {
	var user domain.User
	if err := r.db.First(&user, userID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) GetBalance(userID uint64, trx *gorm.DB) (float64, error) {
	db := r.db
	if trx != nil {
		db = trx
	}

	var balance float64
	err := db.Model(&domain.User{}).Where("id = ?", userID).Pluck("balance", &balance).Error

	return balance, err
}

func (r *userRepo) GetDB() *gorm.DB {
	return r.db
}
