package handlers

import (
	"fmt"
	"strings"
	"time"
	"trade-tracker/core/services"
	"trade-tracker/core/worker"
	"trade-tracker/pkg/utils/market"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type AssetHandler struct {
	service  services.AssetService
	validate *validator.Validate
	holidays market.CheckedList
}

func NewAssetHandler(service services.AssetService) *AssetHandler {
	holidays := market.LoadHolidays("./holidays.json")
	return &AssetHandler{
		service:  service,
		validate: validator.New(),
		holidays: holidays,
	}
}

func (h *AssetHandler) HandleGetAssets(c fiber.Ctx) error {
	_, ok := c.Locals("user_id").(uint64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	assetList := h.service.GetAssets()
	return c.Status(200).JSON(fiber.Map{"length": len(assetList), "data": assetList})
}

func (h *AssetHandler) HandleGetAsset(c fiber.Ctx) error {
	ticker := strings.ToUpper(c.Params("ticker"))
	_, ok := c.Locals("user_id").(uint64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	asset, found := h.service.GetAsset(ticker)
	if !found {
		return c.Status(404).JSON(fiber.Map{"message": "Not found."})
	}

	return c.Status(200).JSON(fiber.Map{"data": asset})
}

func (h *AssetHandler) HandleGetAssetChart(c fiber.Ctx) error {
	ticker := strings.ToUpper(c.Params("ticker"))
	_, ok := c.Locals("user_id").(uint64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	timeframe := c.Query("timeframe")
	if timeframe == "" {
		timeframe = "1M"
	}

	chartData, err := h.service.GetTickerChart(ticker, timeframe)
	if err != nil {
		fmt.Println(err)
		return c.Status(400).JSON(fiber.Map{"message": "Error bad request."})
	}

	return c.Status(200).JSON(fiber.Map{"data": chartData})
}

func (h *AssetHandler) HandleUpdateStock(c fiber.Ctx) error {
	var now time.Time
	loc, _ := time.LoadLocation("Asia/Jakarta")

	if time_ := c.Query("time"); time_ != "" {
		parsedTime, err := time.Parse(time.RFC3339, time_)
		if err == nil {
			now = parsedTime.In(loc)
		} else {
			return c.Status(fiber.StatusBadRequest).SendString("Error: mismatch time format (use RFC3339 instead)")
		}
	} else {
		now = time.Now().In(loc)
	}

	if !worker.UpdateStock(h.holidays, now, false) {
		return c.Status(fiber.StatusOK).SendString(fmt.Sprintf("[SKIP WORKER] Market closed at %s. (Causes no data to be changed.)", now.Format("2006-01-02 15:04:05")))
	}

	return c.Status(fiber.StatusOK).SendString(fmt.Sprintf("[SUCCESS WORKER] Stock data updated successfully at %s", now.Format("15:04:05")))
}
