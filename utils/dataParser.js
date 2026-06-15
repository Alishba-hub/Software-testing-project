const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseTagValue: true,
  trimValues: true,
  removeNSPrefix: true
});

function toArray(value) {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

class DataParser {
  static readJson(relativeFilePath) {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Data file not found: ${fullPath}`);
    }

    const raw = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(raw);
  }

  static readXml(relativeFilePath) {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Data file not found: ${fullPath}`);
    }

    const raw = fs.readFileSync(fullPath, "utf-8");
    return xmlParser.parse(raw);
  }

  static readData(relativeFilePath) {
    const extension = path.extname(relativeFilePath).toLowerCase();

    if (extension === ".json") {
      return this.readJson(relativeFilePath);
    }

    if (extension === ".xml") {
      return this.readXml(relativeFilePath);
    }

    throw new Error(`Unsupported data format: ${extension}`);
  }

  static normalizeXmlCollection(value) {
    return toArray(value);
  }
}

module.exports = { DataParser };
