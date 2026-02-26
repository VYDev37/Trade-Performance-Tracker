package middleware

import (
	"fmt"
	"os"
	"strings"

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
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			fmt.Println(err)
			return c.Status(401).JSON(fiber.Map{"message": "Invalid token."})
		}

		claims := token.Claims.(jwt.MapClaims)
		if userID, ok := claims["user_id"]; ok {
			c.Locals("user_id", uint64(userID.(float64)))
		} else {
			return c.Status(401).JSON(fiber.Map{"message": "User ID not found in token."})
		}

		return c.Next()
	}
}
