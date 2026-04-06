package handlers

import (
	"log"
	"os"
	"time"

	"trade-tracker/core/domain"
	"trade-tracker/core/services"
	"trade-tracker/pkg/utils/auth"
	"trade-tracker/pkg/utils/format"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
)

type UserHandler struct {
	service  services.UserService
	validate *validator.Validate
}

func NewUserHandler(service services.UserService) *UserHandler {
	return &UserHandler{
		service:  service,
		validate: validator.New(),
	}
}

func (h *UserHandler) HandleRegister(c fiber.Ctx) error {
	var req domain.UserRegisterReq

	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Failed to parse body."})
	}

	user := &domain.User{
		Username: req.Username,
		Name:     req.Name,
		Password: req.Password,
		Email:    req.Email,
	}

	if err := h.validate.Struct(req); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			errFirst := validationErrors[0]
			return c.Status(400).JSON(fiber.Map{"message": format.FormatError(errFirst)})
		}
		return c.Status(400).JSON(fiber.Map{"message": "Invalid request."})
	}

	if err := h.service.CreateUser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Registration success."})
}

func (h *UserHandler) HandleLogin(c fiber.Ctx) error {
	var req domain.UserLoginReq
	if err := c.Bind().Body(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Failed to parse body."})
	}

	if err := h.validate.Struct(req); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			errFirst := validationErrors[0]
			return c.Status(400).JSON(fiber.Map{"message": format.FormatError(errFirst)})
		}
		return c.Status(400).JSON(fiber.Map{"message": "Invalid request."})
	}

	user, err := h.service.Login(req.Identifier, req.Password)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	token, err := auth.GenerateToken(user.ID)
	if err != nil {
		log.Printf("Error when trying to generate token: %v.\n", err.Error())
		return c.Status(500).JSON(fiber.Map{"message": "Internal server error."})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   os.Getenv("PRODUCTION_MODE") == "true",
		SameSite: "None",
		Path:     "/",
	})

	return c.Status(200).JSON(fiber.Map{"message": "Login success.", "token": token})
}

func (h *UserHandler) HandleGetMe(c fiber.Ctx) error {
	uid, ok := c.Locals("user_id").(uint64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
	}
	res, err := h.service.GetProfile(uid)
	if err != nil {
		log.Printf("Error when trying to get profile: %v.\n", err.Error())
		return c.Status(500).JSON(fiber.Map{"message": "Internal server error."})
	}

	return c.Status(200).JSON(fiber.Map{"data": res})
}

func (h *UserHandler) Logout(c fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HTTPOnly: true,
		Secure:   (os.Getenv("PRODUCTION_MODE") == "true"),
		SameSite: "None",
		Path:     "/",
	})
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Logged out from server",
	})
}
