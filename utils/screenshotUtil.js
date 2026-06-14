const path = require("path");

class ScreenshotUtil {
  static async capture(page, fileName, testInfo) {
    const folderPath = path.join(process.cwd(), "test-results", "screenshots");
    const fullPath = path.join(folderPath, fileName);

    await page.screenshot({ path: fullPath, fullPage: true });

    if (testInfo) {
      await testInfo.attach("failure-screenshot", {
        path: fullPath,
        contentType: "image/png"
      });
    }

    return fullPath;
  }
}

module.exports = { ScreenshotUtil };
