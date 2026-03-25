package handlers

import (
	"fmt"
	"strconv"
	"trade-tracker/internal/domain"
	"trade-tracker/internal/services"
	"trade-tracker/pkg/utils/format"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type NoteHandler struct {
	service services.NoteService
}

func NewNoteHandler(service services.NoteService) *NoteHandler {
	return &NoteHandler{service: service}
}

func (h *NoteHandler) HandleAddNote(c fiber.Ctx) error {
	rawUid := c.Locals("user_id")

	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	var req domain.NoteRequest

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

	if err := h.service.AddNote(&domain.Note{
		UserID:      rawUid.(uint64),
		Title:       req.Title,
		Description: req.Description,
		Category:    req.Category,
		ImageURL:    req.ImageURL,
	}); err != nil {
		fmt.Println(err.Error())
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Note added."})
}

func (h *NoteHandler) HandleUpdateNote(c fiber.Ctx) error {
	rawUid := c.Locals("user_id")
	noteId, err := strconv.Atoi(c.Params("nId"))

	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": err.Error()})
	}

	var req domain.NoteRequest

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

	note := &domain.Note{
		UserID:      rawUid.(uint64),
		Title:       req.Title,
		Description: req.Description,
		Category:    req.Category,
		ImageURL:    req.ImageURL,
	}
	note.ID = uint(noteId)

	if err := h.service.UpdateNote(note); err != nil {
		fmt.Println(err.Error())
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Note added."})
}

func (h *NoteHandler) HandleGetNotes(c fiber.Ctx) error {
	rawUid := c.Locals("user_id")

	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	data, err := h.service.GetNotes(rawUid.(uint64))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"notes": data})
}

func (h *NoteHandler) HandleRemoveNote(c fiber.Ctx) error {
	rawUid := c.Locals("user_id")
	noteId, err := strconv.Atoi(c.Params("nId"))

	if rawUid == nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}

	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": err.Error()})
	}

	if err := h.service.RemoveNote(uint(noteId), rawUid.(uint64)); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "success"})
}
