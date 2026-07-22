const morgan = require("morgan");
const winston = require("winston");
const path = require("path");
const fs = require("fs");

// Pastikan folder logs/ ada
const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * logger – Instance Winston untuk logging ke file
 *
 * Memenuhi requirement:
 * - Logging: Semua request dan error di-log
 * - Menggunakan Winston untuk structured logging
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Log semua level ke file app.log
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      maxsize: 5 * 1024 * 1024, // 5MB per file
      maxFiles: 5,
    }),
    // Log hanya error ke file error.log
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
  ],
});

// Di development, tampilkan log ke console juga dengan format yang lebih mudah dibaca
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

/**
 * requestLogger – Morgan middleware untuk HTTP request logging
 *
 * Menggunakan morgan format 'combined' yang mencatat:
 * - Method, URL, Status Code, Response Time, User Agent, IP
 *
 * Output diteruskan ke Winston stream agar tersimpan di file log.
 */
const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms [:date[clf]] :remote-addr",
  { stream: morganStream }
);

module.exports = { requestLogger, logger };
