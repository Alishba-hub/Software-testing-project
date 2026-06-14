const { logger } = require("../../utils/logger");

async function globalTeardown() {
  logger.info("Global teardown completed.");
  logger.separator();
}

module.exports = globalTeardown;
