# Project Documentation

## Objective
Build a robust, maintainable Playwright automation framework in JavaScript using industry best practices.

## Implemented Requirements Mapping

1. Application Selection
- Chosen application: SauceDemo (https://www.saucedemo.com).

2. Framework Architecture
- Modular architecture documented in docs/ARCHITECTURE.md.
- Includes test suites, cases, data, page objects, utilities, hooks, and reporting.

3. Page Object Model
- Implemented classes:
  - pages/BasePage.js
  - pages/LoginPage.js
  - pages/InventoryPage.js
  - pages/CartPage.js
  - pages/CheckoutPage.js

4. Data-Driven Testing
- JSON test data files:
  - data/loginData.json
  - data/checkoutData.json
- Parser utility: utils/dataParser.js.

5. Reporting
- Integrated reporters:
  - Allure (allure-results)
  - Playwright HTML (playwright-report)
- Includes pass/fail details, execution data, and failure screenshots.

6. Core/Generalized Methods
- Reusable operations implemented in utilities and POM methods:
  - Login/logout
  - Navigation
  - Wait handling
  - Screenshot capture
  - Alert/popup handling

7. Mandatory Core Structure
- Utilities layer implemented with:
  - logger.js
  - configReader.js
  - screenshotUtil.js
  - dataParser.js
  - waitUtils.js
- Hooks implemented:
  - tests/hooks/globalSetup.js
  - tests/hooks/globalTeardown.js
  - tests/hooks/testHooks.js

## Test Coverage Summary
- Authentication scenarios
- Navigation and cart scenarios
- Checkout flow scenarios
- Validation and negative test scenarios

## Notes
- Framework is scalable up to 40 test cases by adding more data sets and suite files.
