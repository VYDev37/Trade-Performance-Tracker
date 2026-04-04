package config

import (
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitDBConnection(dbConnection string) (*gorm.DB, error) {
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             500 * time.Millisecond,
			LogLevel:                  logger.Warn,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	isProduction := (os.Getenv("PRODUCTION_MODE") == "true")
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dbConnection,
		PreferSimpleProtocol: true,
	}), &gorm.Config{Logger: newLogger, PrepareStmt: isProduction})

	if err != nil {
		return nil, err
	}

	sqlDB, _ := db.DB()
	if isProduction {
		sqlDB.SetMaxIdleConns(1)
		sqlDB.SetMaxOpenConns(2)
		sqlDB.SetConnMaxLifetime(5 * time.Minute)
	} else {
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(20)
		sqlDB.SetConnMaxLifetime(time.Hour)
	}

	// if err := db.AutoMigrate(&domain.User{}, &domain.Position{},
	// 	&domain.Transaction{}, &domain.Note{}, &domain.Balance{}); err != nil {
	// 	return nil, err
	// }

	log.Println("Database connection has been established.")
	return db, nil
}
