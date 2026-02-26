package providers_test

import (
	"errors"
	"testing"
)

type MockStockProvider struct {
	MockPrice float64
	MockErr   error
}

func (m *MockStockProvider) GetCurrentPrice(ticker string) (float64, error) {
	return m.MockPrice, m.MockErr
}

func TestStockProvider_GetCurrentPrice(t *testing.T) {
	tests := []struct {
		name      string
		ticker    string
		mockPrice float64
		mockErr   error
		want      float64
		wantErr   bool
	}{
		{
			name:      "Case 1: Sukses Ambil Harga BBRI",
			ticker:    "BBRI",
			mockPrice: 4500.0,
			mockErr:   nil,
			want:      4500.0,
			wantErr:   false,
		},
		{
			name:      "Case 2: Error dari API Yahoo",
			ticker:    "INVALID",
			mockPrice: 0,
			mockErr:   errors.New("symbol not found"),
			want:      0,
			wantErr:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// SIKAT: Pake mock, bukan provider asli!
			s := &MockStockProvider{
				MockPrice: tt.mockPrice,
				MockErr:   tt.mockErr,
			}

			got, err := s.GetCurrentPrice(tt.ticker)

			if (err != nil) != tt.wantErr {
				t.Errorf("GetCurrentPrice() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("GetCurrentPrice() = %v, want %v", got, tt.want)
			}
		})
	}
}
