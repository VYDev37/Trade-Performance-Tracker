package main

import (
	"fmt"
	"log"
	"os"

	"trade-tracker/internal/config"
	"trade-tracker/internal/delivery/http"
	"trade-tracker/internal/integrations/providers"
	"trade-tracker/internal/repository"
	"trade-tracker/internal/services"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := config.InitDBConnection(os.Getenv("DB_CONNECTION"))
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	userRepo := repository.NewUserRepo(db)
	posRepo := repository.NewPositionRepo(db)
	tranRepo := repository.NewTransactionRepo(db)

	priceProvider := providers.NewPriceProvider()

	tService := services.NewTransactionService(tranRepo)
	pService := services.NewPositionService(posRepo, userRepo, priceProvider, tService)
	uService := services.NewUserService(userRepo, pService, tService)

	app := http.InitRoutes(uService, pService, tService)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", os.Getenv("SERVER_PORT"))))
}
