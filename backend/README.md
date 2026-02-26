# Trade Performance Tracker - Backend

This directory contains the Go backend for the Trade Performance Tracker application. It is built using the **Fiber v3** framework for high-performance HTTP routing and **GORM** for robust database interactions with PostgreSQL.

## 🏗 Architecture

The backend follows a strict **Clean Architecture / Domain-Driven Design (DDD)** approach:
- **`cmd/`**: Entry point (`main.go`). Initializes configuration, database, repositories, services, and HTTP handlers.
- **`config/`**: Database connection and environment variable setups.
- **`delivery/http/`**: Fiber HTTP routing and controllers (handlers).
- **`domain/`**: Core data models and interface contracts.
- **`repository/`**: Database queries and persistence logic using GORM.
- **`services/`**: Core business logic and use cases.
- **`pkg/`**: Shared utilities (e.g., JWT auth middleware).

---

## 💾 Database & GORM Setup

The application connects to a **PostgreSQL** database. The connection pool is optimized in `config/database.go` with the following parameters:
- `MaxIdleConns`: 10
- `MaxOpenConns`: 100
- `ConnMaxLifetime`: 1 hour

### 🔄 Migrations
Database migrations are handled **automatically on startup**. 
There are no manual CLI migration commands to run. When the application boots up (`go run cmd/api/main.go`), GORM's `AutoMigrate` function automatically synchronizes the database schema with the following domain models:
- `domain.User`
- `domain.Position`
- `domain.Transaction`

*Note: `AutoMigrate` will only create tables, missing columns, and missing indexes. It will NOT delete unused columns to protect your data.*

---

## 🌐 API Routes

The backend uses **Fiber** for routing. CORS is pre-configured to accept requests from `http://localhost:3000`.

### Public Routes
- **`GET /api/`** - Health check / Hello World
- **`POST /api/account/register`** - Register a new user
- **`POST /api/account/login`** - Authenticate user and return a JWT

### Protected Routes (Requires JWT Auth Middleware)

#### User (`/api/user`)
- **`GET /me`** - Get current authenticated user details
- **`POST /update-balance`** - Update the user's account balance

#### Positions (`/api/position`)
- **`POST /add/:type`** - Add a new stock position (supports different types)
- **`GET /get-price/:ticker`** - Get the current market price for a specific ticker symbol
- **`GET /portfolio`** - Retrieve the user's complete portfolio of positions

#### Transactions (`/api/transactions`)
- **`GET /my-info`** - Retrieve the historical transaction history for the authenticated user

---

## 🚀 Running the Server

1. Ensure your `.env` file is completely configured with your `DB_CONNECTION` string and `SERVER_PORT`.
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Start the server (migrations will run automatically):
   ```bash
   go run cmd/api/main.go
   ```
