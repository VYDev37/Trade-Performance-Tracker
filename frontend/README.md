# Trade Performance Tracker - Frontend Platform

This directory contains the Next.js frontend platform for the Trade Performance Tracker application. It is a highly interactive, responsive, and visually gorgeous dashboard made with **React 19**, **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **Zustand**.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router with Server Components by default)
- **View Layer**: React 19
- **State Management**: Zustand (Global client state stores)
- **Data Validation**: Zod (Enforcing type-safe runtime data schemas)
- **Styling**: Tailwind CSS v4 & CSS variables (Custom dark mode)
- **Visualizers**: Recharts & TradingView Lightweight Charts (Real-time candle / line renders)
- **Component Primitives**: shadcn/ui (Radix UI) & Lucide Icons
- **Data Fetching**: Axios
- **Package Manager**: pnpm

---

## 🧩 Architectural Modularization & Folder Structure

The frontend leverages Next.js App Router conventions and features modular, domain-driven directories located in `app/`:

### 📂 Folder Conventions in `app/`

- **`app/(account)/`**: Authentication routes group.
  - `loading.tsx`: Elegant shared card skeleton loader that renders during state changes.
  - `login/` & `register/`: Split into pure **Server Component entrypoints** (`page.tsx` rendering SEO-compliant static meta headers) and modular, interactive **Client child components** (`LoginClient.tsx` & `RegisterClient.tsx`).
- **`app/admin/`**: Secured dashboards and features layouts.
  - `dashboard/`: Displaying unified stats and portfolios metrics cards.
  - `stocks/`: Positions, real-time tickers list, equipped with dynamic metadata headers.
  - `transactions/`: Complete transaction lists, paginated order histories, and audit filters.
  - `profile/`: Credentials forms, asset allocation diagrams, and capital sheets.
  - `journals/`: Formatted diary cards, notebook notes, and media attachments.
  - `composite/[[...id]]/`: Real-time stock details, interactive charts, and core fundamentals on the IDX Composite Terminal.
  - `calculator/` & `assistant/`: Position size selectors and AI copilot workspaces.
- **`app/components/`**: Decomposed application components (scoped by business domain):
  - `calculator/`: Interactive keys and display fields.
  - `dashboard/`: Overall balance displays and charts grids.
  - `journal/`: Inline notes forms and modal dialog boxes.
  - `profile/`: Glassmorphism donut charts, managing cash sheets, and details widgets.
  - `stock/`: Buying sheets, position listings, and trends sparklines.
  - `terminal/`: High-performance charts adapters (candle/line lightweight charts).
  - `tracker/`: Budgets, mobile-friendly cashflow structures, and columns layout.
  - `trades/`: Trade performance results, custom shareable cards, and PnL forms.
  - `transaction/`: Responsive history tables, mobile records cards, and actions.
  - `user/`: Login/register inputs and forms wrappers.
  - *Direct elements*: `AdminSidebar.tsx` (primary navigation layout) & `ThemeProvider.tsx` (system theme modes selector).
- **`app/hooks/`**: Specialized React hooks abstracting API actions, caches, and states:
  - `asset/`: IDX composite details and candle chart queries.
  - `calculator/`: Formulas and evaluations helpers.
  - `note/`: Journal fetchers, adders, modifiers, and deleters.
  - `position/`: Holdings mutations and live-prices socket listeners.
  - `table/`: Sorting and paginating helpers.
  - `transaction/`: Historical lists queries and migrations handlers.
  - `user/`: Auth session actions, registration flows, and profiles.
- **`app/lib/`**: Network configurations and text formatters:
  - `axios.ts`: Preconfigured axios instance routing to backend endpoints.
  - `formatter.ts`: Currency conversion, dates, and number formatters.
- **`app/schemas/`**: Strict runtime schema validators using Zod:
  - `asset.schema.ts`, `auth.schema.ts`, `balance.schema.ts`, `journal.schema.ts`, `transaction.schema.ts`
- **`app/stores/`**: High-performance Zustand store handlers:
  - `useUserStore.ts`: Dynamic user profiles and active accounts state.
  - `useTransactionStore.ts`: Real-time synced list of transaction logs.

### 📦 Root UI Helpers

- **`components/ui/`**: Core shadcn/ui primitive components (buttons, input, sheet, select, dropdowns, etc.).
- **`hooks/use-mobile.ts`**: Helper hook resolving device viewport size for responsive layout changes.
- **`lib/utils.ts`**: Reusable `cn` merger combining Tailwind classes safely.

---

## ⚙️ Environment Config

By default, the client directs API requests using the following fallback inside `app/lib/axios.ts`:
```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
```

To configure custom endpoints or integrations, create a `.env.local` inside `/frontend`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

---

## 🚀 Get Started

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
4. Access the web dashboard at [http://localhost:3000](http://localhost:3000).
