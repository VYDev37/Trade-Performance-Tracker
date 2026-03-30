package http

import (
	"trade-tracker/internal/delivery/handlers"
	"trade-tracker/internal/services"
	"trade-tracker/pkg/middleware"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func InitRoutes(uService services.UserService, pService services.PositionService,
	tService services.TransactionService, nService services.NoteService, bService services.BalanceService) *fiber.App {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		AllowCredentials: true,
	}))

	app.Use(func(c fiber.Ctx) error {
		if c.Method() == "OPTIONS" {
			c.Set("Access-Control-Allow-Origin", c.Get("Origin"))
			c.Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS")
			c.Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With")
			c.Set("Access-Control-Allow-Credentials", "true")
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	})

	api := app.Group("/api")
	api.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello World!")
	})

	accountApi := api.Group("/account")
	userService := handlers.NewUserHandler(uService)

	accountApi.Post("/register", userService.HandleRegister)
	accountApi.Post("/login", userService.HandleLogin)

	userApi := api.Group("/user", middleware.AuthMiddleware())

	userApi.Get("/me", userService.HandleGetMe)

	positionApi := api.Group("/position", middleware.AuthMiddleware())
	positionService := handlers.NewPositionHandler(pService)

	positionApi.Post("/add/:type", positionService.HandleAddPosition)
	positionApi.Get("/get-price/:ticker", positionService.HandleGetTickerMarketPrice)
	positionApi.Get("/portfolio", positionService.HandleGetPortfolio)

	trxApi := api.Group("/transactions", middleware.AuthMiddleware())
	trxService := handlers.NewTransactionHandler(tService)

	trxApi.Get("/my-info", trxService.HandleGetLocalTransaction)

	noteApi := api.Group("/notes", middleware.AuthMiddleware())
	noteService := handlers.NewNoteHandler(nService)

	noteApi.Get("/get", noteService.HandleGetNotes)
	noteApi.Post("/add", noteService.HandleAddNote)
	noteApi.Delete("/remove/:nId", noteService.HandleRemoveNote)
	noteApi.Put("/update/:nId", noteService.HandleUpdateNote)

	balanceApi := api.Group("/balance", middleware.AuthMiddleware())
	balanceService := handlers.NewBalanceHandler(bService)

	balanceApi.Post("/update-balance", balanceService.HandleUpdateBalance)

	return app
}
