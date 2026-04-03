# Trade Performance Tracker

A comprehensive full-stack application for tracking and analyzing trade performance, managing stock portfolios, and monitoring transaction histories.

## 🌟 Features

- **User Authentication**: Secure Login and Registration system using JWT.
- **Interactive Dashboard**: Overview of account balance and portfolio allocation with visual charts (Recharts).
- **Transaction Management**: Record buy/sell actions with detailed, paginated history (including fee by percentage input).
- **Stock Positions**: Track current holdings and live performance with auto-updating market prices.
- **Trade Results**: Generate and share comprehensive trade result (PnL & ROI) report cards.
- **Journals & Notes**: Personal note page with image and long-text support.
- **Financial Tracker**: Manage and track personal financial activities through a dedicated dashboard with mobile-responsive consolidated views.
- **Profile Management**: Manage user settings and adjust balance sheets dynamically.
- **AI Assistant**: Built-in assistant to help analyze trading patterns and offer insights. (Coming soon)

## 🛠 Tech Stack

### Backend
- **Language**: Go 1.25+
- **Framework**: Fiber v3
- **Database ORM**: GORM
- **Database**: PostgreSQL
- **Security**: Argon2id for password hashing, Validator for struct validation
- **Architecture**: Domain-Driven Design / Clean Architecture (`delivery`, `domain`, `repository`, `services`)

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI), Lucide Icons
- **Data Fetching**: Axios
- **Charts**: Recharts
- **Package Manager**: pnpm

---

## 📂 Project Structure

```text
Trade-Performance-Tracker/
├── backend/                  # Go API Server
│   ├── cmd/                  # Entry point for the application (main.go)
│   │   ├── api/              # Where main.go located
│   ├── internal/             # Application code (Clean Architecture)
│   │   ├── config/           # Configuration loaders
│   │   ├── delivery/         # HTTP handlers and routing
│   │   ├── domain/           # Core interfaces and entities
│   │   ├── repository/       # Database interactions
│   │   └── services/         # Business logic
│   ├── pkg/                  # Shared utilities and helpers
│   ├── .dockerignore         # Ignored files (Docker)
│   ├── .env.example          # Example environment variables
│   ├── .gitignore            # Ignored files (Git)
│   ├── go.mod                # Go module dependencies
│   ├── go.sum                # Another Go file
│   └── README.md             # README
└── frontend/                 # Next.js Application
│   ├── app/                  # App Router pages and layouts
│   │   ├── (account)/        # Auth pages (login, register)
│   │   ├── admin/            # Dashboard, Profile, Stocks, Transactions, Assistant, Tracker, Calculator, Journals
│   │   └── components/       # Shared & Local Page UI Components (for pages, etc.)
│   ├── components/           # Reusable UI components (shadcn, charts, etc.)
│   ├── hooks/                # Custom React hooks for API and state management
│   ├── lib/                  # Utility functions
│   ├── types/                # TypeScript interface definitions
│   ├── .env.example          # Example environment variables for frontend
│   ├── Dockerfile            # Docker instructions for frontend deployment
│   ├── eslint.config.mjs     # Linting rules and code style configuration
│   ├── next.env-d.ts         # TypeScript definitions for Next.js
│   ├── next.config.ts        # Next.js specific configuration
│   ├── package.json          # Node dependencies
│   ├── pnpm-lock.yaml        # pnpm lockfile
│   ├── pnpm-workspace.yaml   # Monorepo workspace configuration for pnpm
│   ├── postcss.config.mjs    # Tailwind CSS and PostCSS configuration
│   ├── proxy.ts              # Local development proxy settings
│   ├── README.md             # README
│   └── tsconfig.json         # TypeScript compiler configuration
├── .gitignore                # Ignored files for the entire workspace (Git)
├── backup-trade-tracker.sql  # Database snapshot or backup file
├── CHANGELOG.md              # Record of all notable changes to the project
├── docker-compose.yml        # Docker orchestration for local development
├── README.md                 # Main project documentation
└── vercel.json               # Vercel config file
```

---

## 🚀 Installation & Setup

### Prerequisites
- [Go](https://go.dev/doc/install) (1.25 or higher)
- [Node.js](https://nodejs.org/) (20 or higher)
- [pnpm](https://pnpm.io/installation) (Preferred package manager)
- [PostgreSQL](https://www.postgresql.org/download/)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to match your PostgreSQL database credentials.*
3. Install dependencies:
   ```bash
   go mod tidy
   ```
4. Run the Go server:
   ```bash
   go run cmd/api/main.go
   ```
   *The API will start on the configured port (default is usually :3000 or :8080).*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies via pnpm:
   ```bash
   pnpm install
   ```
3. Set up environment variables (if required for API endpoint URLs):
   ```bash
   # Create a .env.local if you need to override the default API URL
   ```
4. Start the Next.js development server:
   ```bash
   pnpm run dev
   ```
   *The frontend will be available at [http://localhost:3000](http://localhost:3000).*

---

## 📝 License

This project is licensed under the MIT License.
