package repository

import (
	"trade-tracker/internal/domain"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	AddTransaction(log *domain.Transaction, tx *gorm.DB) error
	GetTransactions(userID uint64) ([]domain.Transaction, error)
}

type transactionRepo struct {
	DB *gorm.DB
}

func NewTransactionRepo(DB *gorm.DB) TransactionRepository {
	return &transactionRepo{DB: DB}
}

func (r *transactionRepo) AddTransaction(log *domain.Transaction, tx *gorm.DB) error {
	db := r.DB
	if tx != nil {
		db = tx
	}
	return db.Create(&log).Error
}

func (r *transactionRepo) GetTransactions(userID uint64) ([]domain.Transaction, error) {
	var transactions []domain.Transaction
	if err := r.DB.Where("owner_id = ?", userID).Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}
