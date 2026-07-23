const express = require("express");
const passport = require("passport");
const verifyToken = require("../middleware/auth");
const { googleCallback, getMe, logout } = require("../controllers/auth.controller");

const router = express.Router();

/**
 * Auth Routes
 *
 * @module auth.routes
 */



/**
 * @route   GET /api/auth/google
 * @desc    Memulai alur Google OAuth 2.0
 * @access  Public
 *
 * Alur: User klik login → redirect ke halaman Google untuk memilih akun
 * scope 'email' dan 'profile' dibutuhkan untuk mendapatkan data user
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // Selalu tampilkan pilihan akun Google
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Callback URL setelah Google OAuth selesai
 * @access  Public
 *
 * Google akan redirect ke sini setelah user memilih akun.
 * failureRedirect akan mengarahkan ke halaman login jika gagal.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  googleCallback
);

/**
 * @route   GET /api/auth/me
 * @desc    Mendapatkan data user yang sedang login
 * @access  Private
 */
router.get("/me", verifyToken, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user dengan menghapus httpOnly cookie
 * @access  Private
 */
router.post("/logout", verifyToken, logout);

module.exports = router;
