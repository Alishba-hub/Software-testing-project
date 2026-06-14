const fs = require("fs");
const { logger } = require("../../utils/logger");
const { getConfig } = require("../../utils/configReader");
const { WaitUtils } = require("../../utils/waitUtils");
const { ScreenshotUtil } = require("../../utils/screenshotUtil");

function applyCommonHooks(test) {
  const config = getConfig();

  test.beforeAll(async () => {
    logger.info("Test suite started.");
  });

  test.beforeEach(async ({ page }, testInfo) => {
    WaitUtils.setDefaultTimeout(page, config.defaultTimeoutMs);
    WaitUtils.setDefaultNavigationTimeout(page, config.navigationTimeoutMs);
    logger.info(`Starting test: ${testInfo.title}`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const elapsedMs = testInfo.duration;

    if (testInfo.status !== testInfo.expectedStatus) {
      const safeName = testInfo.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const screenshotName = `${safeName}_${Date.now()}.png`;
      const screenshotPath = await ScreenshotUtil.capture(page, screenshotName, testInfo);
      logger.error(`Test failed: ${testInfo.title}; screenshot: ${screenshotPath}`);

      const logFile = logger.getLogFilePath();
      if (fs.existsSync(logFile)) {
        await testInfo.attach("framework-log", {
          path: logFile,
          contentType: "text/plain"
        });
      }
    }

    logger.info(`Completed test: ${testInfo.title}; status: ${testInfo.status}; durationMs: ${elapsedMs}`);
  });

  test.afterAll(async () => {
    logger.info("Test suite ended.");
  });
}

module.exports = { applyCommonHooks };
