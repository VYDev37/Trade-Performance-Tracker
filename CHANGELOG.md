# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-04-21
### Changed
- Splitted `price_per_unit` to 2 mode (`entry_price_unit` (for entry avg price) & `sell_price_unit` (for sell avg price)) to ensure consistency.
- Optimized portfolio and its total equity retrieval.
- Refactored backend code.
- Added more data to export profile.
- Enhanced `excel.BuildTable` result.

## [0.2.1] - 2026-04-14
### Added
- Update for Export Profile to Excel feature, now it also includes transaction sheet and packed into table.
### Changed
- Fixed typo.

## [0.2.0] - 2026-04-10
### Added
- Lazy Loading Implementation: Integrated next/dynamic for high-overhead components to reduce initial bundle size and improve TTI (Time to Interactive).
- Export Profile to Excel button. (Beta)
- Unrealized PnL Report Card for running positions (only supported in realized profits before).
- Revert mode (Income <-> Expense) for transaction update.

### Changed
- Implemented useMemo and useCallback across core modules (Transactions, Notes, Dashboard, Stocks, and Profile) to minimize redundant re-renders.
- Optimized PortfolioOverviewCard and PortfolioPieChart rendering logic.
- Optimized PnL Report Card rendering logic & adjusted view (mobile-friendly).
- Context Optimization: Memoized login and logout functions within UserContext to prevent unnecessary downstream component updates during auth state changes.
- Code Splitting: Moved PortfolioPieChart to dynamic import mode with SSR disabled for better hydration performance.

## [0.1.9] - 2026-04-08
### Added
- Edit button in Financial Tracker card
- Textarea line break is now preserved in modal content (for example: transactions notes, personal journal, etc.)

### Changed
- Refactored backend code for error handling
- Transaction update API (for financial tracker)

## [0.1.8] - 2026-04-07
### Changed
- Changed PreparedStatement mode (`true` -> `false`) 
- Changed size of maximum idle and open connections for production environment due to restriction (for Supabase free version)
- Optimized design on sheets
- Refactored some backend codes.

## [0.1.7] - 2026-04-06
### Added
- Added 'Backspace' and hotkeys in Calculator
- Improved security on handlers and optimized backend functions (and SQL queries)
- Returned http res error message for axios

## [0.1.6] - 2026-04-04
### Added
- Logout route
- Auto kick in middleware when the token is invalid or expired

## [0.1.5] - 2026-04-03
### Added
- Added missing functionalities on design (`NoteEmpty`)
- Deployment is now supported in Vercel with setup tutorial
- Calculator page for simple calculation
- Financial tracker page (actually done in [v0.1.4]([0.1.4]-2026-03-30))
### Changed
- JWT Token lifetime (1h -> 24h)
- Moved some files to ensure consistency
- Optimized backend functions (to make sure it works well in serverless environment)
- Fixed typo & error in design
- Auto migrate is now separated with the main program. (Run `go run cmd/script/auto-migrate.go` in `backend` folder to do database migration)

## [0.1.4] - 2026-03-30
### Added
- Added `CustomDialog` component to replace repetitive markup across modals.
- Implemented "Load More" style pagination for tracking statistics.
- Combined inflow and outflow into a single chronologically sorted view for mobile form factors.
- Added comprehensive backend infrastructure (handler, service, repo) to support direct balance adjustments.
- Added text formatting utility `pkg/utils/format/text.go` for localized number formats in the backend.

### Changed
- Extracted and modularized the `Tracker` page into mobile-friendly shared components (`TrackerHeader`, `TrackerSummary`, `TrackerTransactionColumn`, `TrackerCombinedColumn`).
- User balance now moved to separate table
- Updated `useUpdateBalance` hook for seamless balance manipulation.
- Minor changes in account registration

## [0.1.3] - 2026-03-25
### Added
- Auto update market price (`hooks/useGetCurrentPrice.tsx`) with SWR.
- Global context for transaction (`context/TransactionContext.tsx`).
- PnL, ROI, PnL & ROI mode in `PnLReportModal` component.
- Added more skeletons (loading).
- Added pagination for transaction page.
- Added pagination for stocks page.
- Personal Note Page (Journals) with image and long text support and pagination.

### Changed
- `hooks/useGetTransactions.tsx` -> `context/TransactionContext.tsx`.
- Pie chart section now displays both allocation (by capital & by initial investment).
- Changed Dashboard unrealized PnL, WR, Winner and loser to realized version.

## [0.1.2] - 2026-03-09
### Added
- Added fee by percentage input for transactions.
- Added shareable trade result (PnL) report card.
- Added Skeleton (loading) on more page

### Changed
- Removed `fontawesome` package and fully switched to `lucide-react` for icons.
- Refactored various components for better maintainability and performance.
- Stocks list table are now sorted by ticker name

## [0.1.1] - 2026-03-02
### Fixed
- Fixed an issue where transactions with the same ticker and `owner_id` could not be logged.
- Fixed a bug where a sell transaction could not be logged if the user sold all of their remaining items (e.g., selling exactly 69 lots of a stock when owning exactly 69 lots).

### Added
- Dockerfile (still messy for now, need some changes on environment variables)
- Slider for quantity (in sell mode)
- Price customizer (in both buy and sell mode)

## [0.1.0] - 2026-02-26
- Initial commit with base project structure and features.
