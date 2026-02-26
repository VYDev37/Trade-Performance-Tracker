package format

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

func FormatError(err validator.FieldError) string {
	field := err.Field()
	param := err.Param()

	switch err.Tag() {
	case "required":
		return fmt.Sprintf("%s must not be empty.", field)
	case "email":
		return "Email format is not valid."
	case "gte", "min":
		if err.Kind().String() == "string" {
			return fmt.Sprintf("%s must be at least %s characters.", field, param)
		}
		return fmt.Sprintf("%s must be at least %s.", field, param)
	case "alphanum":
		return fmt.Sprintf("%s must only contain number and characters.", field)
	case "oneof":
		return fmt.Sprintf("%s must be one of: %s.", field, param)
	case "max", "lte":
		if err.Kind().String() == "string" {
			return fmt.Sprintf("%s must be at most %s characters.", field, param)
		}
		return fmt.Sprintf("%s must be at most %s.", field, param)
	}
	return fmt.Sprintf("%s is invalid.", field)
}
