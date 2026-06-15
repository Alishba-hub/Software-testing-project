# Project Documentation

## Team Members

| Name           | Roll No. |
| -------------- | -------- |
| Alishba Hassan | 22k-4333 |
| Nimil Zubair   | 22k-4617 |

## Objective

Build a robust, maintainable Playwright automation framework in JavaScript using industry best practices.

## Setup & Execution

### One-time setup

```bash
npm install                       # install dependencies
npx playwright install chromium   # install the browser
```

### Run the tests

```bash
npm test                 # run all 26 tests (headless)
npm run test:headed      # run with a visible browser
npm run test:login       # run only the login suite
npm run test:checkout    # run only the checkout suite
npm run test:navigation  # run only the navigation suite
npm run test:inventory   # run only the inventory suite
npm run test:smoke       # run only @smoke-tagged tests
npm run test:regression  # run only @regression-tagged tests
```

### View the reports

```bash
npm run report:allure:generate   # build the Allure report from the latest run
npm run report:allure:open       # open the Allure report
npm run report:allure:serve      # build + open in one step
npm run report:html              # open the Playwright HTML report
```

### Clean run (no stale data from previous runs)

Always regenerate the report after a run, and clear old artifacts first so nothing is stale:

```powershell
# PowerShell (Windows)
Remove-Item -Recurse -Force allure-results, allure-report, test-results, playwright-report -ErrorAction SilentlyContinue
npm test
npm run report:allure:generate
npm run report:allure:open
```

```bash
# bash / macOS / Linux
rm -rf allure-results allure-report test-results playwright-report
npm test
npm run report:allure:generate
npm run report:allure:open
```

> Note: deleting `allure-report` also clears Trend history. To keep trends, delete only
> `allure-results` and `test-results`.

### Select an environment

```bash
# PowerShell
$env:TEST_ENV="staging"; npm test
# bash
TEST_ENV=dev npm test
```

## Project Structure

```text
st project/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI: lint → install browser → test → upload reports
├── config/                         # Per-environment configuration (selected by TEST_ENV)
│   ├── env.qa.json                 # Default environment (headless)
│   ├── env.dev.json                # Local debugging environment (headed)
│   └── env.staging.json            # Staging environment (longer timeouts)
├── data/                           # Data-driven test inputs (JSON)
│   ├── loginData.json              # Valid/invalid users + field-validation cases
│   ├── checkoutData.json           # Checkout users + mandatory-field cases
│   └── inventoryData.json          # Product count, sort cases, multi-add products
├── docs/                           # Project documentation
│   ├── ARCHITECTURE.md             # Architecture diagram, layers, execution flow, hooks
│   ├── PROJECT_DOCUMENTATION.md    # This file
│   └── architecture diagram.png    # Exported architecture diagram image
├── pages/                          # Page Object Model classes
│   ├── BasePage.js                 # Shared primitives (goto, click, fill, getText)
│   ├── LoginPage.js                # Login page locators + actions
│   ├── InventoryPage.js            # Inventory page locators + actions
│   ├── CartPage.js                 # Cart page locators + actions
│   └── CheckoutPage.js             # Checkout page locators + actions
├── scripts/
│   └── prepareAllure.js            # Writes environment, categories, history into allure-results
├── tests/
│   ├── e2e/                        # Test suites
│   │   ├── login.spec.js           # Login suite (8 tests)
│   │   ├── checkout.spec.js        # Checkout suite (7 tests)
│   │   ├── navigation.spec.js      # Navigation & cart suite (5 tests)
│   │   └── inventory.spec.js       # Inventory suite (6 tests)
│   ├── fixtures/
│   │   └── testFixtures.js         # Page-object fixtures (loginPage, inventoryPage, ...)
│   └── hooks/
│       ├── globalSetup.js          # Global setup (create dirs, log separator)
│       ├── globalTeardown.js       # Global teardown (log separator)
│       └── testHooks.js            # applySuiteHooks: beforeAll/beforeEach/afterEach/afterAll
├── utils/                          # Reusable utilities layer
│   ├── logger.js                   # File + console logger
│   ├── configReader.js             # Loads/caches env config
│   ├── dataParser.js               # Reads JSON test data
│   ├── waitUtils.js                # Explicit + implicit wait helpers
│   ├── screenshotUtil.js           # Step / final / failure screenshots
│   ├── navigationUtil.js           # Direct navigation helpers
│   ├── alertUtil.js                # Native dialog (alert/popup) handling
│   └── allureHelper.js             # Allure annotation helper (epic/feature/story/...)
├── .eslintrc.json                  # ESLint config
├── .prettierrc.json                # Prettier config
├── .prettierignore                 # Prettier ignore list
├── .gitignore                      # Git ignore list
├── playwright.config.js            # Playwright config (reporters, timeouts, hooks, browser)
├── package.json                    # Scripts + dependencies
└── README.md                       # Setup & execution guide
```

> Generated folders (not committed): `node_modules/`, `allure-results/`, `allure-report/`,
> `playwright-report/`, `test-results/`, `logs/`.

## Implemented Requirements Mapping

1. **Application Selection**
   - Chosen application: SauceDemo (https://www.saucedemo.com).

2. **Framework Architecture**
   - Modular architecture documented in `docs/ARCHITECTURE.md`.
   - Layers: test suites, fixtures, page objects, data, utilities, hooks, config, reporting, CI.

3. **Page Object Model**
   - `pages/BasePage.js`, `pages/LoginPage.js`, `pages/InventoryPage.js`, `pages/CartPage.js`, `pages/CheckoutPage.js`.
   - Page objects are injected into tests via fixtures (`tests/fixtures/testFixtures.js`).

4. **Data-Driven Testing**
   - JSON data: `data/loginData.json`, `data/checkoutData.json`, `data/inventoryData.json`.
   - Parser utility: `utils/dataParser.js`.

5. **Reporting**
   - Allure (`allure-results`) with epic/feature/story/severity/owner annotations and `test.step()` timelines.
   - Playwright HTML (`playwright-report`).
   - A screenshot is attached to **every** test (per-step images + a Final Screenshot); failures add a
     Failure Screenshot, plus traces and videos.
   - `scripts/prepareAllure.js` adds the Environment widget, Categories graph, and Trend history.

6. **Core / Generalized Methods**
   - Reusable operations in utilities and page methods: login/logout, navigation, wait handling,
     screenshot capture, dialog handling, Allure annotation, product sorting/reading.

7. **Mandatory Core Structure**
   - Utilities: `logger.js`, `configReader.js`, `screenshotUtil.js`, `dataParser.js`, `waitUtils.js`,
     `navigationUtil.js`, `alertUtil.js`, `allureHelper.js`.
   - Global hooks: `tests/hooks/globalSetup.js`, `tests/hooks/globalTeardown.js`.
   - Suite hooks: `tests/hooks/testHooks.js` exposes `applySuiteHooks(test)` implementing
     `beforeAll` / `beforeEach` / `afterEach` / `afterAll`, wired into every spec (see
     [ARCHITECTURE.md](./ARCHITECTURE.md#hooks)).

8. **Quality Gates**
   - ESLint (with `eslint-plugin-playwright`) and Prettier.

9. **Continuous Integration**
   - GitHub Actions workflow runs lint, tests, and publishes report artifacts on every push/PR.

## Test Coverage Summary

| Suite      | Scenarios                                                                 |
| ---------- | ------------------------------------------------------------------------- |
| Login      | Valid logins (3 users), invalid logins (3), required-field validation (2) |
| Checkout   | End-to-end purchase (4 data sets), mandatory-field validation (3)         |
| Navigation | Add/remove cart, navigate to cart, sort, logout, protected-page redirect  |
| Inventory  | Product count, 4 sorting orders verified, multi-item cart badge           |

Total: **26 tests**, all tagged for selective execution (`@smoke`, `@regression`, `@negative`, `@e2e`, `@security`).

## Environments

Selected via `TEST_ENV` (defaults to `qa`): `config/env.qa.json`, `config/env.dev.json`, `config/env.staging.json`.

## Notes

- Framework scales by adding JSON data sets and suite files without touching core code.
- Single-worker, retry-on-failure execution for deterministic, reproducible runs.

## Related documentation

- [Architecture](./ARCHITECTURE.md) — diagram, layers, execution flow, hooks.
