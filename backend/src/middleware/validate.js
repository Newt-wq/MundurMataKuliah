const { validationResult } = require("express-validator");

/**
 * validate – Middleware untuk Validasi Data
 *
 * Dijalankan setelah express-validator rules.
 * Mengecek hasil validasi dan menghentikan request jika ada error.
 *
 * Memenuhi requirement:
 * - Validasi Data: Centralized validation result handler
 *
 * Penggunaan:
 *   router.post('/path', [...validationRules], validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validasi data gagal. Periksa kembali data yang Anda kirimkan.",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = validate;
