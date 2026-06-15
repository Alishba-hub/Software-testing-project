const fs = require("fs");
const path = require("path");
const { test } = require("@playwright/test");

class ScreenshotUtil {
  /**
   * Captures a screenshot, saves it to test-results/screenshots/ (a real PNG file
   * you can open), and attaches it to the current test so it shows in the Allure /
   * Playwright HTML report. Attaches the in-memory buffer (not a path) so the image
   * is embedded reliably regardless of output-folder housekeeping.
   */
  static async capture(page, fileName, testInfo, attachmentName = "screenshot") {
    const folderPath = path.join(process.cwd(), "test-results", "screenshots");
    const fullPath = path.join(folderPath, fileName);
    fs.mkdirSync(folderPath, { recursive: true });

    const buffer = await page.screenshot({ fullPage: true });
    fs.writeFileSync(fullPath, buffer);

    if (testInfo) {
      await testInfo.attach(attachmentName, { body: buffer, contentType: "image/png" });
    }

    return fullPath;
  }

  /**
   * During-test screenshot: attaches a PNG to the currently running test step so the
   * Allure report shows an image under each step. Call this INSIDE a running test.
   */
  static async attachStep(page, name) {
    await test.info().attach(name, {
      body: await page.screenshot(),
      contentType: "image/png"
    });
  }

  /**
   * Post-test screenshots for the report. Use only from test.afterEach.
   * Always attaches a "Final Screenshot"; on failure also attaches a "Failure Screenshot".
   */
  static async attachAfterEach(page, testInfo) {
    const safeName = testInfo.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    await ScreenshotUtil.capture(page, `${safeName}_final.png`, testInfo, "Final Screenshot");

    if (testInfo.status !== testInfo.expectedStatus) {
      await ScreenshotUtil.capture(page, `${safeName}_failure.png`, testInfo, "Failure Screenshot");
    }
  }
}

module.exports = { ScreenshotUtil };
