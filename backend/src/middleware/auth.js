const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * verifyToken – Authentication Middleware
 *
 * Memverifikasi JWT yang dikirim melalui httpOnly cookie.
 * Jika token valid, user object akan ditambahkan ke req.user.
 * Jika tidak valid atau tidak ada, mengembalikan response 401.
 *
 * Memenuhi requirement:
 * - Authentication: Verifikasi JWT token
 * - Authorization: Menyediakan req.user untuk middleware selanjutnya
 * - Asynchronous Programming: Async/Await + MongoDB async query
 */
const verifyToken = async (req, res, next) => {
  try {
    // Ambil token dari httpOnly cookie (lebih aman dari localStorage)
    const token = req.cookies?.jwt_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Silakan login terlebih dahulu.",
      });
    }

    // Verifikasi dan decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil user dari database menggunakan async query
    const user = await User.findById(decoded.userId).select("-googleId");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid. User tidak ditemukan.",
      });
    }

    // Tambahkan user ke request object untuk digunakan di controller
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Sesi telah berakhir. Silakan login kembali.",
      });
    }
    next(error);
  }
};

module.exports = verifyToken;
