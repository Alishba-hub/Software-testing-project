const fs = require("fs");
const { getConfig } = require("../../utils/configReader");
const { WaitUtils } = require("../../utils/waitUtils");
const { AlertUtil } = require("../../utils/alertUtil");
const { ScreenshotUtil } = require("../../utils/screenshotUtil");
const { logger } = require("../../utils/logger");

/**
 * Registers the standard Playwright test hooks (beforeAll / beforeEach / afterEach / afterAll)
 * for a suite. Each spec file calls `applySuiteHooks(test)` once, so the hooks bind reliably to
 * that file (registering hooks at the top level of a shared imported module would bind them to
 * only one spec file).
 *
 * Responsibilities handled by these hooks:
 *  - Test initialization (implicit waits / default timeouts)
 *  - Alert & popup safety net
 *  - Logging (suite + per-test)
 *  - Reporting integration (screenshot on every test, failure screenshot + log on failure)
 *
 * Browser setup and closure are managed by Playwright's `page` fixture (a fresh, isolated
 * context per test), which is the framework-recommended replacement for manual browser hooks.
 */
function applySuiteHooks(test) {
  const config = getConfig();

  test.beforeAll(async () => {
    logger.info("Suite started.");
  });

  test.beforeEach(async ({ page }, testInfo) => {
    // Implicit waits: default action + navigation timeouts for every interaction.
    WaitUtils.setDefaultTimeout(page, config.defaultTimeoutMs);
    WaitUtils.setDefaultNavigationTimeout(page, config.navigationTimeoutMs);
    // Popup/alert safety net: auto-dismiss any unexpected native dialog.
    AlertUtil.dismissNextDialog(page);
    logger.info(`Starting test: ${testInfo.title}`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Always attach a final-state screenshot (saved to disk + report); add a failure one on failure.
    try {
      await ScreenshotUtil.attachAfterEach(page, testInfo);
    } catch (err) {
      logger.warn(`Could not capture screenshot for "${testInfo.title}": ${err.message}`);
    }

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test failed: ${testInfo.title}`);
      const logFile = logger.getLogFilePath();
      if (fs.existsSync(logFile)) {
        await testInfo.attach("framework-log", { path: logFile, contentType: "text/plain" });
      }
    }

    logger.info(
      `Completed test: ${testInfo.title}; status: ${testInfo.status}; durationMs: ${testInfo.duration}`
    );
  });

  test.afterAll(async () => {
    logger.info("Suite ended.");
  });
}

module.exports = { applySuiteHooks };
