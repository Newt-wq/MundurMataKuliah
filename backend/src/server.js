require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const { logger } = require("./middleware/requestLogger");

const PORT = process.env.PORT || 5000;

/**
 * Server Entry Point
 *
 * Menghubungkan ke MongoDB terlebih dahulu menggunakan async/await,
 * baru kemudian menjalankan Express server.
 *
 * Memenuhi requirement:
 * - Asynchronous Programming: Async/Await untuk startup sequence
 */
const startServer = async () => {
  try {
    // 1. Hubungkan ke MongoDB (async)
    await connectDB();

    // 2. Jalankan Express server setelah DB siap
    app.listen(PORT, () => {
      logger.info(`🚀 Server berjalan di http://localhost:${PORT}`);
      logger.info(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error("❌ Gagal menjalankan server:", error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

startServer();
