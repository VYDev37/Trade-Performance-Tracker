package repository

import (
	"trade-tracker/internal/domain"

	"gorm.io/gorm"
)

type BalanceRepository interface {
	CreateBalance(balance *domain.Balance, trx *gorm.DB) error
	RemoveBalance(balanceID uint64, trx *gorm.DB) error
	UpdateBalance(balance *domain.Balance, trx *gorm.DB) error

	GetBalanceByType(userID uint64, assetType string, trx *gorm.DB) (float64, error)
	GetBalance(balanceID uint64, trx *gorm.DB) (*domain.Balance, error)
	GetBalances(userID uint64, trx *gorm.DB) ([]domain.Balance, error)
	GetDB() *gorm.DB
}

type balanceRepo struct {
	DB *gorm.DB
}

func NewBalanceRepo(DB *gorm.DB) BalanceRepository {
	return &balanceRepo{DB: DB}
}

func (r *balanceRepo) CreateBalance(balance *domain.Balance, trx *gorm.DB) error {
	db := r.DB
	if trx != nil {
		db = trx
	}
	return db.Create(balance).Error
}

func (r *balanceRepo) RemoveBalance(balanceID uint64, trx *gorm.DB) error {
	db := r.DB
	if trx != nil {
		db = trx
	}

	result := db.Unscoped().Delete(&domain.Balance{}, balanceID)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return domain.ErrItemNotFound
	}

	return nil
}

func (r *balanceRepo) UpdateBalance(balance *domain.Balance, trx *gorm.DB) error {
	db := r.DB
	if trx != nil {
		db = trx
	}
	return db.Model(&domain.Balance{}).Where("user_id = ? AND asset_type = ?", balance.UserID, balance.AssetType).Update("amount", gorm.Expr("amount + ?", balance.Amount)).Error
}

func (r *balanceRepo) GetBalances(userID uint64, trx *gorm.DB) ([]domain.Balance, error) {
	var balance []domain.Balance
	db := r.DB
	if trx != nil {
		db = trx
	}

	if err := db.Where("user_id = ?", userID).Find(&balance).Error; err != nil {
		return nil, err
	}

	return balance, nil
}

func (r *balanceRepo) GetBalance(balanceID uint64, trx *gorm.DB) (*domain.Balance, error) {
	var balances domain.Balance
	db := r.DB
	if trx != nil {
		db = trx
	}

	if err := db.Where("id = ?", balanceID).Find(&balances).Error; err != nil {
		return nil, err
	}

	return &balances, nil
}

func (r *balanceRepo) GetBalanceByType(userID uint64, assetType string, trx *gorm.DB) (float64, error) {
	var balance domain.Balance
	db := r.DB
	if trx != nil {
		db = trx
	}

	if err := db.Where("user_id = ? AND asset_type = ?", userID, assetType).Find(&balance).Error; err != nil {
		return 0, err
	}

	return balance.Amount, nil
}

func (r *balanceRepo) GetDB() *gorm.DB {
	return r.DB
}
