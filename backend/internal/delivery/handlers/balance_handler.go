package handlers

import (
	"trade-tracker/internal/domain"
	"trade-tracker/internal/services"
	"trade-tracker/pkg/utils/format"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type BalanceHandler struct {
	service services.BalanceService
}

func NewBalanceHandler(service services.BalanceService) *BalanceHandler {
	return &BalanceHandler{service: service}
}

func (h *BalanceHandler) HandleUpdateBalance(c fiber.Ctx) error {
	rawUid := c.Locals("user_id")
	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	var req domain.BalanceUpdateReq
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

	if err := h.service.AdjustBalance(rawUid.(uint64), req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Balance updated."})
}
