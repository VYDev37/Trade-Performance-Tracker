package providers

import "github.com/VYDev37/go-tvscanner-api/pkg/scanner"

type AssetProvider interface {
	GetAssets() []scanner.M
}

type assetProvider struct {
}

func NewAssetProvider() AssetProvider {
	return &assetProvider{}
}

func (s *assetProvider) GetAssets() []scanner.M {
	data := scanner.GlobalStore.GetData()
	var assetList []scanner.M
	for _, asset := range data {
		assetList = append(assetList, scanner.M{
			"ticker": asset.Ticker,
			"name":   asset.Description,
			"price":  asset.Price,
			"change": asset.Change,
		})
	}

	return assetList
}
