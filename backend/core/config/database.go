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
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	isProduction := (os.Getenv("PRODUCTION_MODE") == "true")
	gormConfig := &gorm.Config{Logger: nil, PrepareStmt: false}
	if !isProduction {
		gormConfig.Logger = newLogger
	}

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dbConnection,
		PreferSimpleProtocol: true,
	}), gormConfig)

	if err != nil {
		return nil, err
	}

	sqlDB, _ := db.DB()
	if err := sqlDB.Ping(); err != nil {
		log.Fatal("Database unreachable")
	}

	if isProduction {
		sqlDB.SetMaxIdleConns(2)
		sqlDB.SetMaxOpenConns(10)
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
