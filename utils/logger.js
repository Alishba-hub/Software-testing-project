const fs = require("fs");
const path = require("path");

const logDir = path.join(process.cwd(), "logs");
const logFilePath = path.join(logDir, "framework.log");

function ensureLogFile() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "", "utf-8");
  }
}

function write(level, message) {
  ensureLogFile();
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  fs.appendFileSync(logFilePath, `${line}\n`, "utf-8");
  console.log(line);
}

const logger = {
  info(message) {
    write("info", message);
  },
  warn(message) {
    write("warn", message);
  },
  error(message) {
    write("error", message);
  },
  separator() {
    write("info", "------------------------------------------------------------");
  },
  getLogFilePath() {
    ensureLogFile();
    return logFilePath;
  }
};

module.exports = { logger };
