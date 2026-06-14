const fs = require("fs");
const path = require("path");

class DataParser {
  static readJson(relativeFilePath) {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Data file not found: ${fullPath}`);
    }

    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw);
  }
}

module.exports = { DataParser };
