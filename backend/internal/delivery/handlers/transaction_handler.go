package handlers

import (
	"trade-tracker/internal/services"

	"github.com/gofiber/fiber/v3"
)

type TransactionHandler struct {
	service services.TransactionService
}

func NewTransactionHandler(service services.TransactionService) *TransactionHandler {
	return &TransactionHandler{service: service}
}

func (h *TransactionHandler) HandleGetLocalTransaction(c fiber.Ctx) error {
	rawUid := c.Locals("user_id")
	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	data, err := h.service.GetLocalTransactions(rawUid.(uint64))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"transactions": data})
}
