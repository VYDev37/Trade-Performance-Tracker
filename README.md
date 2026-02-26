# Trade Performance Tracker

A comprehensive full-stack application for tracking and analyzing trade performance, managing stock portfolios, and monitoring transaction histories.

## 🌟 Features

- **User Authentication**: Secure Login and Registration system using JWT.
- **Interactive Dashboard**: Overview of account balance and portfolio allocation with visual charts (Recharts).
- **Transaction Management**: Record buy/sell actions with detailed history.
- **Stock Positions**: Track current holdings and live performance.
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
│   ├── internal/             # Application code (Clean Architecture)
│   │   ├── config/           # Configuration loaders
│   │   ├── delivery/         # HTTP handlers and routing
│   │   ├── domain/           # Core interfaces and entities
│   │   ├── repository/       # Database interactions
│   │   └── services/         # Business logic
│   ├── pkg/                  # Shared utilities and helpers
│   ├── .env.example          # Example environment variables
│   └── go.mod                # Go module dependencies
└── frontend/                 # Next.js Application
    ├── app/                  # App Router pages and layouts
    │   ├── (account)/        # Auth pages (login, register)
    │   └── admin/            # Dashboard, Profile, Stocks, Transactions, Assistant
    ├── components/           # Reusable UI components (shadcn, charts, etc.)
    ├── hooks/                # Custom React hooks for API and state management
    ├── lib/                  # Utility functions
    ├── types/                # TypeScript interface definitions
    ├── package.json          # Node dependencies
    └── pnpm-lock.yaml        # pnpm lockfile
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
