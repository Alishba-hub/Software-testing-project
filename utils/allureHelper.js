const allure = require("allure-js-commons");

/**
 * Applies common Allure metadata to the current test in a single call.
 * Keeps the spec files declarative and consistent.
 *
 * @param {Object} meta
 * @param {string} [meta.epic]     High-level product area (e.g. "Authentication").
 * @param {string} [meta.feature]  Feature under test (e.g. "Login").
 * @param {string} [meta.story]    User story / scenario.
 * @param {string} [meta.severity] One of: blocker, critical, normal, minor, trivial.
 * @param {string} [meta.owner]    Test owner.
 *
 * Tags are intentionally NOT handled here: they are declared via Playwright's
 * native `{ tag: [...] }` test option, which both drives `--grep` filtering and
 * is automatically surfaced as Allure tags by allure-playwright.
 */
async function annotate(meta = {}) {
  const { epic, feature, story, severity, owner } = meta;
  if (epic) await allure.epic(epic);
  if (feature) await allure.feature(feature);
  if (story) await allure.story(story);
  if (severity) await allure.severity(severity);
  if (owner) await allure.owner(owner);
}

module.exports = { allure, annotate };
