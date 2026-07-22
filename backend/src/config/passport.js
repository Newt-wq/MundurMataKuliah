const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

/**
 * Konfigurasi Google OAuth 2.0 menggunakan Passport.js
 * Strategy ini akan:
 * 1. Menerima callback dari Google setelah user login
 * 2. Memvalidasi domain email (hanya @students.paramadina.ac.id & @paramadina.ac.id)
 * 3. Mencari atau membuat user baru di MongoDB
 */
const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID || "placeholder-client-id";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret";

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      "⚠️  [Passport Warning] GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum diisi di backend/.env. Fitur Google Login memerlukan credentials asli."
    );
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        // Gunakan env variable agar bisa ganti saat production (Railway, dsb)
        callbackURL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          // =====================================================
          // VALIDASI DOMAIN EMAIL
          // Mengizinkan email kampus & @gmail.com untuk kemudahan testing
          // =====================================================
          const allowedDomains = [
            "@students.paramadina.ac.id",
            "@paramadina.ac.id",
            "@gmail.com",
          ];
          const isAllowedDomain = allowedDomains.some((domain) =>
            email.endsWith(domain)
          );

          if (!isAllowedDomain) {
            return done(null, false, {
              message:
                "Akses ditolak. Gunakan akun Google Workspace Universitas Paramadina.",
            });
          }

          // Tentukan role berdasarkan domain email
          const role = email.endsWith("@paramadina.ac.id")
            ? "admin"
            : "mahasiswa";

          // Cari user yang sudah ada berdasarkan googleId
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Jika belum ada, buat user baru (MongoDB async query)
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: email,
              role: role,
              avatar: profile.photos[0]?.value || null,
            });
          } else {
            // Update avatar jika berubah
            user.avatar = profile.photos[0]?.value || user.avatar;
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // =====================================================
  // TIDAK MENGGUNAKAN serializeUser / deserializeUser
  // karena autentikasi menggunakan JWT httpOnly cookie,
  // bukan server-side session. passport.session() sudah dihapus dari app.js.
  // =====================================================
};

module.exports = configurePassport;
