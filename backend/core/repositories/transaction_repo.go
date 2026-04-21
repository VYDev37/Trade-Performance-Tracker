package repositories

import (
	"trade-tracker/core/domain"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	AddTransaction(log *domain.Transaction, tx *gorm.DB) error
	GetTransactions(userID uint64) ([]domain.Transaction, error)
	GetTransactionByID(id uint, tx *gorm.DB) (*domain.Transaction, error)
	UpdateTransaction(transaction *domain.Transaction, tx *gorm.DB) error
	GetDB() *gorm.DB
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

func (r *transactionRepo) GetTransactionByID(id uint, tx *gorm.DB) (*domain.Transaction, error) {
	db := r.DB
	if tx != nil {
		db = tx
	}
	var transaction domain.Transaction
	if err := db.First(&transaction, id).Error; err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *transactionRepo) UpdateTransaction(transaction *domain.Transaction, tx *gorm.DB) error {
	db := r.DB
	if tx != nil {
		db = tx
	}
	return db.Save(transaction).Error
}

func (r *transactionRepo) GetDB() *gorm.DB {
	return r.DB
}
