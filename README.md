# Playwright JS Automation Framework - SauceDemo

This repository contains a robust automation testing framework built with Playwright and JavaScript, following industry best practices (POM, data-driven testing, hooks, utilities, and reporting).

## Tech Stack
- Playwright Test Runner
- JavaScript (CommonJS)
- Allure Reporting
- Playwright HTML Report

## Project Structure

```text
.
|-- config/
|   `-- env.qa.json
|-- data/
|   |-- checkoutData.json
|   `-- loginData.json
|-- docs/
|   |-- ARCHITECTURE.md
|   `-- PROJECT_DOCUMENTATION.md
|-- pages/
|   |-- BasePage.js
|   |-- CartPage.js
|   |-- CheckoutPage.js
|   |-- InventoryPage.js
|   `-- LoginPage.js
|-- tests/
|   |-- e2e/
|   |   |-- checkout.spec.js
|   |   |-- login.spec.js
|   |   `-- navigation.spec.js
|   `-- hooks/
|       |-- globalSetup.js
|       |-- globalTeardown.js
|       `-- testHooks.js
|-- utils/
|   |-- alertUtil.js
|   |-- configReader.js
|   |-- dataParser.js
|   |-- logger.js
|   |-- navigationUtil.js
|   |-- screenshotUtil.js
|   `-- waitUtils.js
|-- playwright.config.js
`-- package.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browser:

```bash
npx playwright install chromium
```

## Run Tests

Run all tests:

```bash
npm test
```

Run only login suite:

```bash
npm run test:login
```

Run only checkout suite:

```bash
npm run test:checkout
```

## Reporting

Generate Allure report:

```bash
npm run report:allure:generate
```

Open Allure report:

```bash
npm run report:allure:open
```

Open Playwright HTML report:

```bash
npm run report:html
```

## Key Framework Features
- Page Object Model implementation for maintainability
- Data-driven testing with JSON
- Reusable utilities layer (logging, config, waits, screenshots, parser)
- Hooks for setup and teardown
- Failure handling with screenshot capture
- Integrated reporting (Allure + HTML)

## Chosen Application
SauceDemo (https://www.saucedemo.com) - a well-known and reputable web app commonly used for UI automation practice.
