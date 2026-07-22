const { body } = require("express-validator");

/**
 * Validator Rules untuk Pengajuan
 *
 * Memenuhi requirement:
 * - Validasi Data: Input validation menggunakan express-validator
 *
 * Sesuai dengan Zod schema di frontend (src/lib/validations.js)
 */

/**
 * Rules untuk membuat pengajuan baru (POST /api/pengajuan)
 */
const createPengajuanValidator = [
  body("namaMahasiswa")
    .trim()
    .notEmpty().withMessage("Nama mahasiswa wajib diisi.")
    .isLength({ min: 2 }).withMessage("Nama minimal 2 karakter."),

  body("nim")
    .trim()
    .notEmpty().withMessage("NIM wajib diisi.")
    .isLength({ min: 8 }).withMessage("NIM minimal terdiri dari 8 karakter."),

  body("prodi")
    .trim()
    .notEmpty().withMessage("Program Studi wajib diisi."),

  body("semester")
    .trim()
    .notEmpty().withMessage("Semester wajib diisi."),

  body("alamat")
    .trim()
    .notEmpty().withMessage("Alamat wajib diisi.")
    .isLength({ min: 10 }).withMessage("Alamat minimal 10 karakter."),

  body("alasan")
    .trim()
    .notEmpty().withMessage("Alasan pengunduran wajib diisi.")
    .isLength({ min: 15 }).withMessage("Alasan minimal 15 karakter."),

  body("daftarMatakuliah")
    .isArray({ min: 1, max: 7 })
    .withMessage("Daftar mata kuliah harus antara 1 sampai 7 mata kuliah."),

  body("daftarMatakuliah.*.kode")
    .trim()
    .notEmpty().withMessage("Kode mata kuliah wajib diisi."),

  body("daftarMatakuliah.*.nama")
    .trim()
    .notEmpty().withMessage("Nama mata kuliah wajib diisi."),

  body("daftarMatakuliah.*.sks")
    .isInt({ min: 1, max: 6 })
    .withMessage("SKS harus antara 1 sampai 6."),
];

/**
 * Rules untuk update status pengajuan (PATCH /api/pengajuan/:id/status)
 * Admin: DISETUJUI atau DITOLAK (dengan catatan)
 * Mahasiswa: DIBATALKAN saja
 */
const updateStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status wajib diisi.")
    .isIn(["DISETUJUI", "DITOLAK", "DIBATALKAN"])
    .withMessage("Status tidak valid. Pilih: DISETUJUI, DITOLAK, atau DIBATALKAN."),

  body("catatanAdmin")
    .if(body("status").isIn(["DISETUJUI", "DITOLAK"]))
    .optional()
    .trim()
    .isString().withMessage("Catatan admin harus berupa teks."),
];

module.exports = { createPengajuanValidator, updateStatusValidator };
