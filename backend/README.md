# Trade Performance Tracker - Backend Engine

This directory contains the Go backend engine for the Trade Performance Tracker application. It is built using the **Fiber v3** framework for high-performance HTTP routing, **GORM** for robust database transactions with PostgreSQL, and features clean background price synchronization workers.

## 🏗 Domain-Driven & Clean Architecture

The engine follows a strict **Clean Architecture / Domain-Driven Design (DDD)** folder hierarchy:

- **`cmd/`**
  - `api/main.go`: Application entrypoint. Boots system environment settings, database connections, integrations, and launches the Fiber HTTP daemon.
- **`core/`**
  - `config/`: Configuration loaders and connection pooling definitions (`database.go`, `env.go`).
  - `delivery/`: Request routers and entry controller handlers.
    - `handlers/`: Form data controllers parsing queries and handling inputs (`user`, `positions`, `transactions`, `notes`, `assets`, etc.).
    - `http/routers.go`: Router bindings, CORS setups, and endpoint groupings.
  - `domain/`: Business entities, relational models, GORM schema tags, and adapter interfaces.
  - `integrations/`: Third-party services integrations.
    - `providers/`: Adaptors for Yahoo Finance and TV Scanner (TradingView scanner feed).
  - `repositories/`: GORM persistence queries and database transactions logic.
  - `script/`: Automation utilities (e.g., `auto-migrate.go` schema database initializer).
  - `services/`: Business cases execution, financial PnL calculators, and balance sheets formulas.
  - `worker/`: Cron processes and daemon runners (`update_stock.go` market synchronizer).
- **`pkg/`**
  - `middleware/`: Security and authorization filters (`auth.go` verifying JWT headers).
  - `utils/`: Common tools (Argon2id password hashes, error wrapping, local currencies formatting).

---

## 💾 Database & GORM Configurations

The application targets a **PostgreSQL** database. The connections pool is optimized inside `core/config/database.go` with the following parameters:
- `MaxIdleConns`: 10 (Active connections on idle standby)
- `MaxOpenConns`: 100 (Maximum parallel database transactions)
- `ConnMaxLifetime`: 1 hour (Connection duration limit)

### 🔄 Schema Auto-Migrations
Database schemas are automatically updated when running the auto-migrate script:
```bash
go run core/script/auto-migrate.go
```
The GORM auto-migration engine synchronizes structures into PostgreSQL tables for:
- `domain.User`: Credential schemas, names, and passwords.
- `domain.Balance`: Ledger accounts (Brokers, Bank cash assets).
- `domain.Position`: Open stock assets holding logs.
- `domain.Transaction`: Audited trade logs, buy/sell transactions, and execution costs.
- `domain.Note`: Markdown notebook journals with attachments.
- `domain.Asset`: Registered IDX market tickers, live prices, and statistics.

---

## 🌐 API Routes Reference

Routes are grouped under the `/api` prefix (configurable via `API_GROUP_NAME` env). CORS parameters are dynamically loaded to safely allow access from the frontend client.

### 🔓 Public Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **`GET`** | `/api/` | Hello World health check |
| **`POST`** | `/api/account/register` | Register a new user credential |
| **`POST`** | `/api/account/login` | Authenticate user credentials and return a JWT cookie |
| **`POST`** | `/api/account/logout` | Revoke authorizations and flush current user cookies |

### 🔒 Secured Routes (JWT Auth Required)
| Area | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **User** | **`GET`** | `/api/user/me` | Fetch authenticated profile details |
| **Positions** | **`POST`** | `/api/position/add/:type` | Add a stock position (buy / cashflow injection) |
| | **`GET`** | `/api/position/get-price/:ticker` | Query live market tick price for a symbol |
| | **`GET`** | `/api/position/portfolio` | Retrieve unified portfolio assets summaries |
| | **`POST`** | `/api/position/migrate` | Perform portfolio account-level migrations |
| **Transactions** | **`GET`** | `/api/transactions/my-info` | Fetch historic logs with paging and search parameters |
| | **`PUT`** | `/api/transactions/update/:id` | Update execution details of a specific transaction |
| | **`POST`** | `/api/transactions/migrate` | Bulk migrate older transactions to new broker codes |
| **Journals** | **`GET`** | `/api/notes/get` | List personal journals list |
| | **`POST`** | `/api/notes/add` | Store new markdown journal post with media links |
| | **`PUT`** | `/api/notes/update/:nId` | Update an existing journal entry |
| | **`DELETE`** | `/api/notes/remove/:nId` | Remove a journal from database |
| **Balance** | **`POST`** | `/api/balance/update-balance` | Modify broker or bank ledger card balances |
| | **`GET`** | `/api/balance/accounts/:type` | Fetch bank or broker account listings |
| **Reports** | **`GET`** | `/api/report/get` | Generate printable PnL performance summaries |
| **IDX Market** | **`GET`** | `/api/asset/get-items` | Get filterable/searchable lists of IDX stock assets |
| | **`GET`** | `/api/asset/get-item/:ticker` | Fetch fundamentals, metrics, and summary card data |
| | **`GET`** | `/api/asset/get-chart/:ticker` | Get candle charts database history for TradingView lightweight charts |

### ⚙️ Worker Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **`GET`** | `/worker/update-prices` | Trigger database synchronizations of asset market prices |

---

## 🚀 Run locally

1. Ensure your `.env` is setup with correct `DB_CONNECTION` and `PORT` parameters.
2. Install external modules:
   ```bash
   go mod tidy
   ```
3. Initialize the database schemas:
   ```bash
   go run core/script/auto-migrate.go
   ```
4. Start the engine server daemon:
   ```bash
   go run cmd/api/main.go
   ```
