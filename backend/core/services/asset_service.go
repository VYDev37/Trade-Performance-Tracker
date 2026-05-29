package services

import (
	"context"
	"log"
	"strings"

	"trade-tracker/core/domain"
	"trade-tracker/core/integrations/providers"
	"trade-tracker/core/repositories"

	"github.com/VYDev37/go-tvscanner-api/pkg/scanner"
)

type AssetService interface {
	FetchAndSync(ctx context.Context) error
	GetTickerChart(ticker string, timeframe string) (*domain.AssetChartResponse, error)

	GetAssets() []scanner.M
	GetAsset(ticker string) (scanner.TVAsset, bool)
}

type assetService struct {
	assetRepo repositories.AssetRepository
	aProvider providers.AssetProvider
	pProvider providers.PriceProvider
	// client    *http.Client
}

func NewAssetService(repo repositories.AssetRepository, aProvider providers.AssetProvider, pProvider providers.PriceProvider) AssetService {
	// tr := &http.Transport{
	// 	MaxIdleConns:       10,
	// 	IdleConnTimeout:    30 * time.Second,
	// 	DisableCompression: true,
	// }
	// client := &http.Client{
	// 	Transport: tr,
	// 	Timeout:   10 * time.Second,
	// }

	return &assetService{assetRepo: repo, aProvider: aProvider, pProvider: pProvider}
}

func (s *assetService) FetchAndSync(ctx context.Context) error {
	log.Println("Starting FetchAndSync...")

	// SOON: change with go-tradingview lib

	log.Println("FetchAndSync completed.")
	return nil
}

func (s *assetService) GetTickerChart(ticker string, timeframe string) (*domain.AssetChartResponse, error) {
	return s.pProvider.GetChart(strings.ToUpper(ticker), timeframe)
}

func (s *assetService) GetAssets() []scanner.M {
	return s.aProvider.GetAssets()
}

func (s *assetService) GetAsset(ticker string) (scanner.TVAsset, bool) {
	item := scanner.GlobalStore
	item.RLock()

	asset, found := item.Index[ticker]
	item.RUnlock()

	return asset, found
}
