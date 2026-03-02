package handlers

import (
	"fmt"
	"strings"
	"trade-tracker/internal/domain"
	"trade-tracker/internal/services"
	"trade-tracker/pkg/utils/format"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type PositionHandler struct {
	service services.PositionService
}

func NewPositionHandler(service services.PositionService) *PositionHandler {
	return &PositionHandler{service: service}
}

func (h *PositionHandler) HandleGetTickerMarketPrice(c fiber.Ctx) error {
	ticker := strings.ToUpper(c.Params("ticker"))
	if ticker == "" {
		return c.Status(401).JSON(fiber.Map{"message": "Please input ticker."})
	}

	price, err := h.service.GetTickerCurrentPrice(ticker)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Success", "price": price})
}

func (h *PositionHandler) HandleAddPosition(c fiber.Ctx) error {
	directionType := c.Params("type")
	rawUid := c.Locals("user_id")

	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	var req domain.PositionAddReq

	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Failed to parse body."})
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			errFirst := validationErrors[0]
			return c.Status(400).JSON(fiber.Map{"message": format.FormatError(errFirst)})
		}
		return c.Status(400).JSON(fiber.Map{"message": "Invalid request."})
	}

	if err := h.service.AddPosition(directionType, &domain.Position{
		OwnerID:       rawUid.(uint64),
		TotalQty:      req.TotalQty,
		Ticker:        req.Ticker,
		InvestedTotal: req.InvestedTotal,
		PositionType:  req.PositionType,
	}, req.Fee); err != nil {
		fmt.Println(err.Error())
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Position added."})
}

func (h *PositionHandler) HandleGetPortfolio(c fiber.Ctx) error {
	rawUid := c.Locals("user_id")

	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	data, err := h.service.GetPositions(rawUid.(uint64))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"portfolio": data})
}
