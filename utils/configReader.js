const fs = require("fs");
const path = require("path");

let cachedConfig = null;

function getConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  const env = process.env.TEST_ENV || "qa";
  const configPath = path.join(process.cwd(), "config", `env.${env}.json`);

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  const configRaw = fs.readFileSync(configPath, "utf-8");
  cachedConfig = JSON.parse(configRaw);
  return cachedConfig;
}

module.exports = { getConfig };
