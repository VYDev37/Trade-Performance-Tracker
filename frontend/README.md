# Trade Performance Tracker - Frontend

This directory contains the Next.js frontend for the Trade Performance Tracker application. It provides a highly interactive, responsive, and aesthetically pleasing dashboard for users to manage their trading portfolios.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data Fetching / State**: Axios & Custom Hooks
- **Package Manager**: pnpm

---

## 🧩 Key Components

The frontend is modularized into several feature-specific directories under `app/components/`:
- **Calculator**
  - `Calculator.tsx`: Main component that contains other components (`CalculatorDisplay` & `CalculatorKeypad`).
  - `CalculatorDisplay.tsx`: Part that displays current arithmethic operation and result.
  - `CalculatorKeypad.tsx`: As it name suggests, this part contains keypads of the calculator, which is used to form the equation.
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
- **Journal**
  - `NoteCard.tsx` & `NoteSheet.tsx`: Manage text and visual journal entries.
- **Trades**
  - `PnLReportModal.tsx`: Shareable PnL and ROI report card for trades.
- **Tracker**
  - `TrackerHeader.tsx` & `TrackerSummary.tsx`: Displays high-level balance and inflow/outflow properties.
  - `TrackerTransactionColumn.tsx` & `TrackerCombinedColumn.tsx`: Lists separated transactions on desktop, and a dynamically combined and chronologically sorted view tailored for mobile context.
- **User**
  - `AuthForm.tsx`: Reusable login and registration form component.
- **Shared**
  - `CustomDialog.tsx`: Reusable wrapper component for standardizing interactive modal overlays.
  - `ConfirmationDialog.tsx`: Reusable wrapper component for confirmation question.
  - `ImageBox.tsx`: Reusable wrapper component for modal with attachment (images).
- **Shared / Layout**
  - `AdminSidebar.tsx`: The primary navigation for the dashboard.
  - `ThemeProvider.tsx`: Handles dark/light mode switching.

---

## 🪝 Custom Hooks

The application heavily relies on custom hooks (located in `app/hooks/`) to abstract API calls and manage state efficiently:

- `useGetCurrentPrice`: Fetches live market prices for specific ticker symbols (using SWR).
- `useAddPosition`: Handles the mutation logic when buying new stocks.
- `useGetNotes`: Fetches and stores the user's journal entries.
- `useUpdateBalance`: Directly interacts with the API to update the user's cash balance.
- `useLogin` & `useRegister`: Manages authentication flows and JWT storage.
- `useCalculator`: Fetches the expression, waiting state, and result of calculation. 

*Note: Global transaction state is now managed via `TransactionContext` rather than `useGetTransactions` for better global data consistency.*

---

## ⚙️ Environment Configuration

To run the application locally, you may need to configure the API URL if your backend is not running on the default `{url}/api`.

Since the application uses `axios` (`app/lib/axios.tsx`), by default it tries to connect to:
```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || `/api`
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
