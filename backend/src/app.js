const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const { requestLogger } = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const configurePassport = require("./config/passport");

// Import routes
const authRoutes = require("./routes/auth.routes");
const pengajuanRoutes = require("./routes/pengajuan.routes");

const app = express();

// =====================================================
// SECURITY MIDDLEWARE
// =====================================================
// Helmet: Mengatur berbagai HTTP headers untuk keamanan
app.use(helmet());

// CORS: Izinkan request dari frontend Next.js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // PENTING: agar cookie dikirim di setiap request
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =====================================================
// BODY PARSING MIDDLEWARE
// =====================================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies dari request

// =====================================================
// PASSPORT (Google OAuth)
// Hanya menggunakan passport.initialize() — tidak perlu session
// karena autentikasi menggunakan JWT httpOnly cookie, bukan server session.
// =====================================================
configurePassport();
app.use(passport.initialize());

// =====================================================
// LOGGING MIDDLEWARE (request logger)
// =====================================================
app.use(requestLogger);

// =====================================================
// ROUTES
// =====================================================
app.use("/api/auth", authRoutes);
app.use("/api/pengajuan", pengajuanRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MundurMatkul API berjalan normal.",
    timestamp: new Date().toISOString(),
  });
});

// Handle route yang tidak ditemukan (404)
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER (harus didaftarkan TERAKHIR)
// =====================================================
app.use(errorHandler);

module.exports = app;
