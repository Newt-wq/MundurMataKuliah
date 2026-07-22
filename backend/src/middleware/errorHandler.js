const { logger } = require("./requestLogger");

/**
 * errorHandler – Global Error Handler Middleware
 *
 * Menangani semua error yang diteruskan melalui next(error) dari seluruh
 * route handler dan middleware lainnya. Harus didaftarkan TERAKHIR di app.js.
 *
 * Memenuhi requirement:
 * - Error Handling: Centralized error handling
 * - Logging: Semua error di-log ke file
 *
 * Error yang ditangani:
 * - Mongoose ValidationError → 400
 * - Mongoose CastError (ID tidak valid) → 400
 * - Mongoose Duplicate Key → 409
 * - JWT errors → 401 (ditangani di auth.js)
 * - Semua error lainnya → 500
 *
 * @param {Error} err - Error object
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Terjadi kesalahan pada server.";

  // Log error ke file (hanya untuk error 5xx)
  if (statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  // Mongoose ValidationError (field required, enum tidak valid, dll)
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(statusCode).json({
      success: false,
      message: "Data yang dikirim tidak valid.",
      errors,
    });
  }

  // Mongoose CastError (ObjectId tidak valid)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `ID tidak valid: ${err.value}`;
  }

  // Mongoose Duplicate Key Error (unique constraint violation)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} sudah terdaftar.`;
  }

  // express-validator errors (dari middleware validate.js)
  if (err.name === "ExpressValidatorError") {
    statusCode = 400;
    return res.status(statusCode).json({
      success: false,
      message: "Validasi data gagal.",
      errors: err.errors,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Tampilkan stack trace hanya di development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
