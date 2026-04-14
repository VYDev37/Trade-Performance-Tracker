package format

import (
	"math"

	"golang.org/x/text/currency"
	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

func FormatNumber(amount float64) string {
	p := message.NewPrinter(language.Indonesian)
	return p.Sprintf("%.2f", amount)
}

func FormatCurrency(amount float64) string {
	p := message.NewPrinter(language.Indonesian)
	formatted := p.Sprintf("%v", currency.Symbol(currency.IDR.Amount(math.Abs(amount))))

	if amount < 0 {
		return p.Sprintf("-%v", formatted)
	}

	return formatted
}
