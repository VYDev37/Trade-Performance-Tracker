package middleware

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() fiber.Handler {
	return func(c fiber.Ctx) error {
		tokenStr := c.Cookies("token")

		if tokenStr == "" {
			header := c.Get("Authorization")
			if header != "" {
				tokenStr = strings.Replace(header, "Bearer ", "", 1)
			}
		}

		if tokenStr == "" {
			return c.Status(401).JSON(fiber.Map{"message": "Unauthorized."})
		}

		tokenStr = strings.Replace(tokenStr, "Bearer ", "", 1)
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.Cookie(&fiber.Cookie{
				Name:     "token",
				Value:    "",
				Expires:  time.Unix(0, 0),
				Path:     "/",
				HTTPOnly: true,
				Secure:   (os.Getenv("PRODUCTION_MODE") == "true"),
				SameSite: "None",
			})
			return c.Status(401).JSON(fiber.Map{"message": "Invalid token."})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"message": "Invalid token claims."})
		}

		if val, ok := claims["user_id"]; ok {
			if userID, ok := val.(float64); ok {
				c.Locals("user_id", uint64(userID))
			} else {
				return c.Status(401).JSON(fiber.Map{"message": "Invalid user_id."})
			}
		} else {
			return c.Status(401).JSON(fiber.Map{"message": "User ID missing from claims."})
		}
		return c.Next()
	}
}
