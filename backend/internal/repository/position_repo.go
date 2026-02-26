package repository

import (
	"trade-tracker/internal/domain"

	"gorm.io/gorm"
)

type PositionRepository interface {
	AddPosition(pos *domain.Position, trx *gorm.DB) error
	RemovePosition(userID uint64, ticker string, trx *gorm.DB) error
	Update(pos *domain.Position, trx *gorm.DB) error

	GetPositions(userID uint64) ([]domain.Position, error)
	GetPosByTicker(userID uint64, ticker string) (*domain.Position, error)
	GetDB() *gorm.DB
}

type positionRepo struct {
	DB *gorm.DB
}

func NewPositionRepo(DB *gorm.DB) PositionRepository {
	return &positionRepo{DB: DB}
}

func (r *positionRepo) AddPosition(pos *domain.Position, trx *gorm.DB) error {
	db := r.DB
	if trx != nil {
		db = trx
	}
	return db.Create(&pos).Error
}

func (r *positionRepo) GetPosByTicker(userID uint64, ticker string) (*domain.Position, error) {
	var pos domain.Position
	err := r.DB.Where("owner_id = ? AND ticker ILIKE ?", userID, ticker).First(&pos).Error

	return &pos, err
}

func (r *positionRepo) GetPositions(userID uint64) ([]domain.Position, error) {
	var positions []domain.Position
	if err := r.DB.Where("owner_id = ?", userID).Find(&positions).Error; err != nil {
		return nil, err
	}

	return positions, nil
}

func (r *positionRepo) RemovePosition(userID uint64, ticker string, trx *gorm.DB) error {
	db := r.DB
	if trx != nil {
		db = trx
	}
	result := db.Unscoped().Where("owner_id = ? AND ticker ILIKE ?", userID, ticker).Delete(&domain.Position{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return domain.ErrItemNotFound
	}

	return nil
}
func (r *positionRepo) Update(pos *domain.Position, trx *gorm.DB) error {
	db := r.DB
	if trx != nil {
		db = trx
	}
	return db.Save(pos).Error
}

func (r *positionRepo) GetDB() *gorm.DB {
	return r.DB
}
