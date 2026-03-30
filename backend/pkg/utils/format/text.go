package format

import (
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

func FormatNumber(amount float64) string {
	p := message.NewPrinter(language.Indonesian)
	return p.Sprintf("%.2f", amount)
}
