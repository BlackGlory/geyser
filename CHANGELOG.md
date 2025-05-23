# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.2](https://github.com/BlackGlory/geyser/compare/v0.5.1...v0.5.2) (2025-05-10)

### [0.5.1](https://github.com/BlackGlory/geyser/compare/v0.5.0...v0.5.1) (2025-05-10)


### Bug Fixes

* use a transaction for `setRateLimiter` ([78ff6bf](https://github.com/BlackGlory/geyser/commit/78ff6bf328c22a7623ce56e56378e1708cc25c25))

## [0.5.0](https://github.com/BlackGlory/geyser/compare/v0.4.0...v0.5.0) (2023-04-03)


### ⚠ BREAKING CHANGES

* Replaced HTTP with WebSocket

* replace HTTP with WebSocket ([f270054](https://github.com/BlackGlory/geyser/commit/f270054e289cbedd42c2d4c1bd58fb3c94ffd027))

## [0.4.0](https://github.com/BlackGlory/geyser/compare/v0.3.2...v0.4.0) (2023-03-10)


### ⚠ BREAKING CHANGES

* The APIs have been redesigned
* Removed access control

### Bug Fixes

* seconds => milliseconds ([e7b40d1](https://github.com/BlackGlory/geyser/commit/e7b40d161c00ebb8368cc37e893bd53b83a7f017))


* remove access control ([cb15ff3](https://github.com/BlackGlory/geyser/commit/cb15ff35aef0fe3590f7464af3647e31f44255fe))
* the APIs have been redesigned ([8d2fa71](https://github.com/BlackGlory/geyser/commit/8d2fa71e6bcd1aadb732399c22978abaff667fc7))

### [0.3.2](https://github.com/BlackGlory/geyser/compare/v0.3.1...v0.3.2) (2023-02-02)

### [0.3.1](https://github.com/BlackGlory/geyser/compare/v0.3.0...v0.3.1) (2023-02-01)

## [0.3.0](https://github.com/BlackGlory/geyser/compare/v0.2.12...v0.3.0) (2023-01-29)


### ⚠ BREAKING CHANGES

* - The `Accept-Version` header is semver now.
- Removed `/metrics`.
- Removed HTTP2 support.

* upgrade dependencies ([14c7dbf](https://github.com/BlackGlory/geyser/commit/14c7dbf2782bd70d77726e0d2f9b0601bcf7c98e))

### [0.2.12](https://github.com/BlackGlory/geyser/compare/v0.2.11...v0.2.12) (2022-09-07)

### [0.2.11](https://github.com/BlackGlory/geyser/compare/v0.2.10...v0.2.11) (2022-08-11)

### [0.2.10](https://github.com/BlackGlory/geyser/compare/v0.2.9...v0.2.10) (2022-07-24)

### [0.2.9](https://github.com/BlackGlory/geyser/compare/v0.2.8...v0.2.9) (2022-02-16)

### [0.2.8](https://github.com/BlackGlory/geyser/compare/v0.2.7...v0.2.8) (2022-02-13)

### [0.2.7](https://github.com/BlackGlory/geyser/compare/v0.2.6...v0.2.7) (2022-02-01)


### Features

* add resetCycle service ([ae59b69](https://github.com/BlackGlory/geyser/commit/ae59b69f2b7ba582601cfc92a4f199f86ade8edf))
* **dao:** add resetCycle ([4f3f33e](https://github.com/BlackGlory/geyser/commit/4f3f33e54e89998f946b5f3cabe3d2c7b5bc1032))

### [0.2.6](https://github.com/BlackGlory/geyser/compare/v0.2.5...v0.2.6) (2022-01-16)


### Features

* add accept-version support ([2ad5edf](https://github.com/BlackGlory/geyser/commit/2ad5edfe0237edb2b113afab7c040a8cd35ddb45))
* add cache-control header ([f57955f](https://github.com/BlackGlory/geyser/commit/f57955fb243e976ed51dd179fd7e488e4dee328e))


### Bug Fixes

* **docker:** build ([8c632d2](https://github.com/BlackGlory/geyser/commit/8c632d2ae53b0bc20a49a177f0dbc84eee110b30))
* **docker:** healthcheck ([368baf9](https://github.com/BlackGlory/geyser/commit/368baf98b1727901cb954dcb403b65b5e7c58c76))

### [0.2.5](https://github.com/BlackGlory/geyser/compare/v0.2.4...v0.2.5) (2021-10-14)

### [0.2.4](https://github.com/BlackGlory/geyser/compare/v0.2.3...v0.2.4) (2021-07-13)

### [0.2.3](https://github.com/BlackGlory/geyser/compare/v0.2.2...v0.2.3) (2021-07-12)

### [0.2.2](https://github.com/BlackGlory/geyser/compare/v0.2.1...v0.2.2) (2021-07-03)

### [0.2.1](https://github.com/BlackGlory/geyser/compare/v0.2.0...v0.2.1) (2021-06-21)


### Features

* add /health ([3a05cdd](https://github.com/BlackGlory/geyser/commit/3a05cdd8177d94544dd9bb17c1ce846991ac1baf))


### Bug Fixes

* docker build ([91579a2](https://github.com/BlackGlory/geyser/commit/91579a2773519bdc27bcd618193d5c6244e80192))
* scripts ([28ec985](https://github.com/BlackGlory/geyser/commit/28ec9857c2fe2d3c93390d2d4857dec2cb8a4a07))

## 0.2.0 (2021-04-28)


### ⚠ BREAKING CHANGES

* The database schema has been upgraded.

### Features

* add GeyserDAO ([6ac2523](https://github.com/BlackGlory/geyser/commit/6ac25235336c3800f2e6e51c6f3b5e4a5f084079))
* init ([bbd157d](https://github.com/BlackGlory/geyser/commit/bbd157d49b9d00a4d2d066c9e947c649a22684f0))


### Bug Fixes

* import AbortController ([3523352](https://github.com/BlackGlory/geyser/commit/3523352cf7fd7d1d71d26ea0e7b64761e1bbc07c))
* tick ([88df04f](https://github.com/BlackGlory/geyser/commit/88df04fd7dee4b91ac8580c01c117b5504ea0596))


* rename ([383c337](https://github.com/BlackGlory/geyser/commit/383c3374527a86639f58921ad80a52b6c976bbe1))
