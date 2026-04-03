# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.5] - 2026-04-03
### Added
- Deployment is now supported in Vercel
### Changed
- Optimized backend functions (to make sure it works well in serverless environment)
- Fixed typo & error in design

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
