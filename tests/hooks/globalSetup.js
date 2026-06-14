const fs = require("fs");
const path = require("path");
const { logger } = require("../../utils/logger");

async function globalSetup() {
  const requiredDirs = [
    path.join(process.cwd(), "logs"),
    path.join(process.cwd(), "test-results"),
    path.join(process.cwd(), "test-results", "screenshots"),
    path.join(process.cwd(), "allure-results")
  ];

  requiredDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  logger.separator();
  logger.info("Global setup started.");
}

module.exports = globalSetup;
