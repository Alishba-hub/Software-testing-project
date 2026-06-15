/**
 * Enriches allure-results before report generation so the Allure dashboard shows:
 *  - an Environment widget (env name, base URL, browser, platform)
 *  - a Categories tab/graph (failures grouped by defect type)
 *  - Trend graphs (by preserving history across runs)
 *
 * Run automatically by the `report:allure:*` npm scripts.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const cwd = process.cwd();
const resultsDir = path.join(cwd, "allure-results");
const reportDir = path.join(cwd, "allure-report");

fs.mkdirSync(resultsDir, { recursive: true });

function readConfig() {
  const env = process.env.TEST_ENV || "qa";
  const configPath = path.join(cwd, "config", `env.${env}.json`);
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  return { environment: env };
}

const config = readConfig();

// 1. Environment widget
const environment = [
  `Environment=${config.environment || "qa"}`,
  `Base.URL=${config.baseUrl || "https://www.saucedemo.com"}`,
  `Browser=Chromium`,
  `Headless=${config.headless}`,
  `Platform=${os.type()} ${os.release()}`,
  `Node=${process.version}`
].join("\n");
fs.writeFileSync(path.join(resultsDir, "environment.properties"), `${environment}\n`, "utf-8");

// 2. Categories — classify failures into meaningful buckets (drives the Categories graph)
const categories = [
  { name: "Ignored / skipped tests", matchedStatuses: ["skipped"] },
  {
    name: "Timeouts",
    matchedStatuses: ["broken", "failed"],
    messageRegex: ".*[Tt]imeout.*"
  },
  {
    name: "Assertion failures (product defects)",
    matchedStatuses: ["failed"],
    messageRegex: ".*([Ee]xpect|toBe|toHave|toContain).*"
  },
  {
    name: "Element / locator errors (test defects)",
    matchedStatuses: ["broken", "failed"],
    messageRegex: ".*(locator|selector|not found|not visible).*"
  },
  { name: "Broken tests (automation defects)", matchedStatuses: ["broken"] }
];
fs.writeFileSync(
  path.join(resultsDir, "categories.json"),
  JSON.stringify(categories, null, 2),
  "utf-8"
);

// 3. Preserve history so Trend graphs build up across runs
const prevHistory = path.join(reportDir, "history");
const nextHistory = path.join(resultsDir, "history");
if (fs.existsSync(prevHistory)) {
  fs.cpSync(prevHistory, nextHistory, { recursive: true });
}

console.log("Allure metadata prepared: environment, categories, history.");
