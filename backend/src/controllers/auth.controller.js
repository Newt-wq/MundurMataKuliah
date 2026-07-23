const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * Helper untuk membuat dan mengirim JWT sebagai httpOnly cookie
 * @param {Object} user - User document dari MongoDB
 * @param {import('express').Response} res - Express response object
 */
const sendTokenResponse = (user, res) => {
  // Sign JWT token dengan userId sebagai payload
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  // Konfigurasi httpOnly cookie
  const cookieOptions = {
    httpOnly: true,        // JavaScript tidak bisa membaca cookie ini
    secure: process.env.NODE_ENV === "production", // Hanya HTTPS di production
    sameSite: "lax",       // Proteksi CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
  };

  res.cookie("jwt_token", token, cookieOptions);
  return token;
};

/**
 * @desc    Redirect user ke halaman Google Login
 * @route   GET /api/auth/google
 * @access  Public
 */
const googleLogin = (req, res, next) => {
  // Ditangani oleh passport.authenticate di route
  next();
};

/**
 * @desc    Callback setelah Google OAuth berhasil
 *          Membuat JWT, set httpOnly cookie, redirect ke frontend
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const googleCallback = asyncHandler(async (req, res) => {
  // req.user sudah diisi oleh passport setelah OAuth berhasil
  const user = req.user;

  if (!user) {
    // Jika OAuth gagal (email domain tidak valid)
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=domain_not_allowed`
    );
  }

  // Buat JWT dan set sebagai httpOnly cookie
  sendTokenResponse(user, res);

  // Redirect ke halaman callback frontend
  // Halaman /auth/callback akan memanggil /api/auth/me dan redirect ke dashboard
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
});

/**
 * @desc    Mendapatkan data user yang sedang login
 * @route   GET /api/auth/me
 * @access  Private (memerlukan JWT cookie)
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user diisi oleh verifyToken middleware
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      nim: req.user.nim,
      prodi: req.user.prodi,
      avatar: req.user.avatar,
    },
  });
});

/**
 * @desc    Logout user dengan menghapus JWT cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Hapus cookie dengan mengeset maxAge ke 1ms (kadaluarsa segera)
  res.cookie("jwt_token", "none", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1,
  });

  res.status(200).json({
    success: true,
    message: "Logout berhasil.",
  });
});


module.exports = { googleCallback, getMe, logout };
