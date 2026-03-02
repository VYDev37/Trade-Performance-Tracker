# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - Bug Fixes
### Fixed
- Fixed an issue where transactions with the same ticker and `owner_id` could not be logged.
- Fixed a bug where a sell transaction could not be logged if the user sold all of their remaining items (e.g., selling exactly 69 lots of a stock when owning exactly 69 lots).

### Added
- Dockerfile (still messy for now, need some changes on environment variables)
- Slider for quantity (in sell mode)
- Price customizer (in both buy and sell mode)

## [0.1.0] - Initial Release
- Initial commit with base project structure and features.
