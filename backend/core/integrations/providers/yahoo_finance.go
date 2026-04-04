package providers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type PriceProvider interface {
	GetCurrentPrice(ticker string) (float64, error)
	GetBatchPrices(tickers []string) (map[string]float64, error)
}

type priceProvider struct {
	Client *http.Client
}

func NewPriceProvider() PriceProvider {
	return &priceProvider{Client: &http.Client{Timeout: 10 * time.Second}}
}

func (s *priceProvider) GetCurrentPrice(ticker string) (float64, error) {
	url := fmt.Sprintf("https://query1.finance.yahoo.com/v8/finance/chart/%s.JK", ticker)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

	resp, err := s.Client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("yahoo v8 API error: status %d", resp.StatusCode)
	}

	var data struct {
		Chart struct {
			Result []struct {
				Meta struct {
					RegularMarketPrice float64 `json:"regularMarketPrice"`
				} `json:"meta"`
			} `json:"result"`
		} `json:"chart"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return 0, err
	}

	if len(data.Chart.Result) == 0 {
		return 0, fmt.Errorf("ticker %s tidak ditemukan", ticker)
	}

	return data.Chart.Result[0].Meta.RegularMarketPrice, nil
}

func (s *priceProvider) GetBatchPrices(tickers []string) (map[string]float64, error) {
	result := make(map[string]float64)
	resChan := make(chan struct {
		ticker string
		price  float64
	}, len(tickers))

	var wg sync.WaitGroup

	for _, t := range tickers {
		wg.Add(1)
		go func(ticker string) {
			defer wg.Done()
			price, err := s.GetCurrentPrice(ticker)
			if err == nil {
				resChan <- struct {
					ticker string
					price  float64
				}{ticker, price}
			}
		}(t)
	}

	go func() {
		wg.Wait()
		close(resChan)
	}()

	for r := range resChan {
		result[r.ticker] = r.price
	}

	return result, nil
}
