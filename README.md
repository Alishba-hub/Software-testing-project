# Playwright Automation Framework — SauceDemo

[![Playwright Tests](https://github.com/Alishba-hub/Software-testing-project/actions/workflows/playwright.yml/badge.svg)](https://github.com/Alishba-hub/Software-testing-project/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.60-2EAD33?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Allure](https://img.shields.io/badge/Report-Allure-FF6B6B)
![License](https://img.shields.io/badge/License-ISC-blue)

A production-style UI automation framework built with **Playwright + JavaScript**, following industry
best practices: Page Object Model, fixtures, data-driven testing, reusable utilities, tagged suites,
rich Allure reporting, and CI on every push.

> **Application under test:** [SauceDemo](https://www.saucedemo.com) — a stable, reputable web app
> widely used for UI automation practice.

---

## Tech Stack

| Concern        | Choice                                          |
| -------------- | ----------------------------------------------- |
| Test runner    | Playwright Test                                 |
| Language       | JavaScript (CommonJS)                           |
| Design pattern | Page Object Model + Playwright fixtures         |
| Test data      | JSON (data-driven)                              |
| Reporting      | Allure + Playwright HTML                        |
| Quality gates  | ESLint + Prettier                               |
| CI             | GitHub Actions (lint → test → report artifacts) |

---

## Project Structure

```text
.
├── .github/workflows/      # CI pipeline (Playwright tests + reports)
├── config/                 # Per-environment config (qa / dev / staging)
├── data/                   # JSON test data (data-driven inputs)
├── docs/                   # Architecture & project documentation
├── pages/                  # Page Objects (BasePage + page classes)
├── tests/
│   ├── e2e/                # Test suites: login, checkout, navigation, inventory
│   ├── fixtures/           # Page-object fixtures
│   └── hooks/              # Suite hooks + global setup / teardown
├── utils/                  # logger, config, waits, screenshots, parser, allure helper
├── playwright.config.js
└── package.json
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install the Chromium browser
npx playwright install chromium
```

---

## Running Tests

| Command                   | What it does                          |
| ------------------------- | ------------------------------------- |
| `npm test`                | Run the whole suite (headless)        |
| `npm run test:headed`     | Run with a visible browser            |
| `npm run test:debug`      | Step through tests with the inspector |
| `npm run test:login`      | Run only the login suite              |
| `npm run test:checkout`   | Run only the checkout suite           |
| `npm run test:navigation` | Run only the navigation suite         |
| `npm run test:inventory`  | Run only the inventory suite          |
| `npm run test:smoke`      | Run only `@smoke`-tagged tests        |
| `npm run test:regression` | Run only `@regression`-tagged tests   |

### Choosing an environment

Config is selected with the `TEST_ENV` variable (defaults to `qa`):

```bash
# PowerShell
$env:TEST_ENV="staging"; npm test

# bash
TEST_ENV=dev npm test
```

| Env       | File                      | Notes                       |
| --------- | ------------------------- | --------------------------- |
| `qa`      | `config/env.qa.json`      | Default, headless           |
| `dev`     | `config/env.dev.json`     | Headed, for local debugging |
| `staging` | `config/env.staging.json` | Longer timeouts             |

---

## Reporting

### Allure (rich report with steps, severity, epics/features)

```bash
npm run report:allure:generate   # build allure-report/ from allure-results/
npm run report:allure:open       # open it in the browser
# or, in one step:
npm run report:allure:serve
```

The Allure report is rich by design — `npm run report:allure:serve` opens a dashboard with:

- **Behaviors** — tests grouped by **epic / feature / story** (every test is annotated).
- **Step-by-step screenshots** — each `test.step()` attaches a labelled PNG (e.g. `01 - Login page opened`).
- A **Final Screenshot** on **every** test (pass or fail) plus a **Failure Screenshot** on failures.
- **Severity** labels (blocker → trivial) and **tags** (`@smoke`, `@regression`, …).
- An **Environment** widget (env, base URL, browser, platform) and a **Categories** graph that
  classifies failures (timeouts, assertion defects, locator/test defects).
- **Trend** graphs that build up across runs (history is preserved automatically).

`scripts/prepareAllure.js` writes the environment, categories, and history into `allure-results/`
before the report is generated — it runs automatically as part of the Allure npm scripts.

### Playwright HTML report

```bash
npm run report:html
```

### Where are the screenshots?

Screenshots are captured for **every test** and appear in three places:

1. **Inside the Allure report** — per-step images + a Final Screenshot under each test.
2. **Inside the Playwright HTML report** — attachments per test.
3. **On disk** — saved as PNG files under `test-results/screenshots/` (one per test, plus a
   `*_failure.png` for any failures), so you can open them directly.

> Previously you saw none because the config only captured `only-on-failure` and every test passed.
> The framework now always attaches a final-state screenshot, and traces/videos are still retained
> on failure for deep debugging.

---

## Code Quality

```bash
npm run lint          # ESLint (incl. eslint-plugin-playwright)
npm run lint:fix      # auto-fix lint issues
npm run format        # apply Prettier
npm run format:check  # verify formatting
```

---

## Continuous Integration

`.github/workflows/playwright.yml` runs on every push / PR to `main`/`master`:

1. Install dependencies (`npm ci`)
2. Lint + format check
3. Install Chromium and run the suite
4. Upload **Playwright HTML report**, **Allure results**, and **Allure report** as build artifacts

---

## Key Framework Features

- **Page Object Model** with a shared `BasePage` for maintainable locators/actions
- **Playwright fixtures** that inject ready-to-use page objects into every test
- **Data-driven testing** from JSON (`data/`)
- **Tagged suites** (`@smoke`, `@regression`, `@negative`, `@e2e`, `@security`) for targeted runs
- **Reusable utilities**: logging, config, waits, screenshots, data parsing, navigation, dialogs
- **Hooks**: global setup/teardown + `beforeAll`/`beforeEach`/`afterEach`/`afterAll` per suite
- **Dual reporting**: Allure (annotated, step-by-step) + Playwright HTML
- **CI-ready** with linting and report artifacts

---

## 📚 Documentation

Full documentation lives in [`docs/`](./docs/):

| Doc                                                      | Purpose                                          |
| -------------------------------------------------------- | ------------------------------------------------ |
| [Architecture](./docs/ARCHITECTURE.md)                   | Diagram, layers, execution flow, hooks rationale |
| [Project Documentation](./docs/PROJECT_DOCUMENTATION.md) | Requirement mapping, test coverage, environments |
