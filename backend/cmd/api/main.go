package main

import (
	"fmt"
	"log"
	"os"

	"trade-tracker/core/config"
	"trade-tracker/core/delivery/http"
	"trade-tracker/core/integrations/providers"
	"trade-tracker/core/repository"
	"trade-tracker/core/services"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	db, err := config.InitDBConnection(os.Getenv("DB_CONNECTION"))
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	log.Println("Database connection established.")

	userRepo := repository.NewUserRepo(db)
	posRepo := repository.NewPositionRepo(db)
	tranRepo := repository.NewTransactionRepo(db)
	noteRepo := repository.NewNoteRepo(db)
	balRepo := repository.NewBalanceRepo(db)

	priceProvider := providers.NewPriceProvider()

	nService := services.NewNoteService(noteRepo)
	tService := services.NewTransactionService(tranRepo)
	bService := services.NewBalanceService(balRepo)
	pService := services.NewPositionService(posRepo, userRepo, priceProvider, tService, bService)
	uService := services.NewUserService(userRepo, pService, tService, bService)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	app := http.InitRoutes(uService, pService, tService, nService, bService)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}
