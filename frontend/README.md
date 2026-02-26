# Trade Performance Tracker - Frontend

This directory contains the Next.js frontend for the Trade Performance Tracker application. It provides a highly interactive, responsive, and aesthetically pleasing dashboard for users to manage their trading portfolios.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React & FontAwesome
- **Charts**: Recharts
- **Data Fetching / State**: Axios & Custom Hooks
- **Package Manager**: pnpm

---

## 🧩 Key Components

The frontend is modularized into several feature-specific directories under `app/components/`:

- **Dashboard**
  - `StatValue.tsx`: Displays high-level account statistics (e.g., total balance, profit/loss).
- **Profile**
  - `PortfolioPieChart.tsx`: A visually rich, glassmorphism-styled donut chart visualizing asset allocation.
  - `AccountSummaryCard.tsx`: Summarizes account standing.
  - `PortfolioOverviewCard.tsx`: Provides a quick glance at the current portfolio.
  - `ManageBalanceSheet.tsx` *(in `helper/`)*: A slide-out sheet for adding, removing, or modifying account balances.
- **Stock**
  - `StockList.tsx`: Evaluates and lists current stock holdings with real-time (or near real-time) valuation.
  - `StockAddPosition.tsx`: Form for registering new stock buys.
  - `StockChart.tsx`: Minimal chart for stock trends.
- **Transaction**
  - `TransactionTable.tsx`: Detailed data table of all historical transactions (buys/sells) with sorting and filtering.
  - `TransactionCard.tsx`: Card-based layout for mobile transaction viewing.
- **Shared / Layout**
  - `AuthForm.tsx`: Reusable login and registration form component.
  - `AdminSidebar.tsx`: The primary navigation for the dashboard.
  - `ThemeProvider.tsx`: Handles dark/light mode switching.

---

## 🪝 Custom Hooks

The application heavily relies on custom hooks (located in `app/hooks/`) to abstract API calls and manage state efficiently:

- `useGetCurrentPrice`: Fetches live market prices for specific ticker symbols.
- `useAddPosition`: Handles the mutation logic when buying new stocks.
- `useGetTransactions`: Fetches and stores the user's historical transaction log.
- `useUpdateBalance`: Directly interacts with the API to update the user's cash balance.
- `useLogin` & `useRegister`: Manages authentication flows and JWT storage.

---

## ⚙️ Environment Configuration

To run the application locally, you may need to configure the API URL if your backend is not running on the default `localhost:8080`.

Since the application uses `axios` (`app/lib/axios.tsx`), by default it tries to connect to:
```typescript
baseURL: `http://${typeof window !== 'undefined' ? window.location.hostname : "localhost"}:8080/api`
```

*(No `.env.local` file is strictly required out-of-the-box as it auto-detects the hostname, but ensure your backend is running on port `8080`).*

---

## 🚀 Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
