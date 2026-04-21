package main

import (
	"fmt"
	"log"
	"os"

	"trade-tracker/core/config"
	"trade-tracker/core/delivery/http"
	"trade-tracker/core/integrations/providers"
	"trade-tracker/core/repositories"
	"trade-tracker/core/services"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	connStr := os.Getenv("DB_CONNECTION")
	// log.Printf("Connection string: %s\n", connStr)
	db, err := config.InitDBConnection(connStr)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	log.Println("Database connection established.")

	userRepo := repositories.NewUserRepo(db)
	posRepo := repositories.NewPositionRepo(db)
	tranRepo := repositories.NewTransactionRepo(db)
	noteRepo := repositories.NewNoteRepo(db)
	balRepo := repositories.NewBalanceRepo(db)

	priceProvider := providers.NewPriceProvider()

	nService := services.NewNoteService(noteRepo)
	tService := services.NewTransactionService(tranRepo, balRepo)
	bService := services.NewBalanceService(balRepo, tService)
	pService := services.NewPositionService(posRepo, userRepo, priceProvider, tService, bService)
	uService := services.NewUserService(userRepo, pService, tService, bService)
	rService := services.NewReportService(pService, uService, tService, priceProvider)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	app := http.InitRoutes(uService, pService, tService, nService, bService, rService)
	log.Fatal(app.Listen(fmt.Sprintf(":%s", port)))
}
