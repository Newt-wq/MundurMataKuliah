const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const verifyToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createPengajuanValidator,
  updateStatusValidator,
} = require("../validators/pengajuan.validator");
const {
  getPengajuans,
  createPengajuan,
  getPengajuanById,
  updatePengajuanStatus,
  uploadDokumen,
} = require("../controllers/pengajuan.controller");

const router = express.Router();

// =====================================================
// KONFIGURASI MULTER UNTUK UPLOAD DOKUMEN
// =====================================================
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Format nama file: {idPublik}_{timestamp}.{ext}
    const ext = path.extname(file.originalname);
    const filename = `${req.params.id}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// Filter: hanya izinkan PDF, JPG, PNG
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["application/pdf", "image/jpeg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung. Gunakan PDF, JPG, atau PNG."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024,
  },
});

// =====================================================
// PENGAJUAN ROUTES
// =====================================================

/**
 * @route   GET /api/pengajuan
 * @desc    Mendapatkan daftar pengajuan
 *          - Mahasiswa: hanya pengajuan miliknya
 *          - Admin: semua pengajuan (dengan filter status & search)
 * @access  Private (mahasiswa & admin)
 * @query   status, search
 */
router.get(
  "/",
  verifyToken,
  authorize("mahasiswa", "admin"),
  getPengajuans
);

/**
 * @route   POST /api/pengajuan
 * @desc    Membuat pengajuan mundur mata kuliah baru
 * @access  Private (mahasiswa only)
 */
router.post(
  "/",
  verifyToken,
  authorize("mahasiswa"),
  createPengajuanValidator,
  validate,
  createPengajuan
);

/**
 * @route   GET /api/pengajuan/:id
 * @desc    Mendapatkan detail pengajuan berdasarkan ID publik (REQ-YYYY-NNN)
 * @access  Private (mahasiswa hanya miliknya, admin semua)
 */
router.get(
  "/:id",
  verifyToken,
  authorize("mahasiswa", "admin"),
  getPengajuanById
);

/**
 * @route   PATCH /api/pengajuan/:id/status
 * @desc    Update status pengajuan
 *          - Admin: DISETUJUI / DITOLAK
 *          - Mahasiswa: DIBATALKAN
 * @access  Private (mahasiswa & admin)
 */
router.patch(
  "/:id/status",
  verifyToken,
  authorize("mahasiswa", "admin"),
  updateStatusValidator,
  validate,
  updatePengajuanStatus
);

/**
 * @route   POST /api/pengajuan/:id/dokumen
 * @desc    Upload dokumen pendukung untuk pengajuan
 * @access  Private (mahasiswa only)
 */
router.post(
  "/:id/dokumen",
  verifyToken,
  authorize("mahasiswa"),
  upload.single("dokumen"),
  uploadDokumen
);

/**
 * @route   GET /api/pengajuan/:id/dokumen
 * @desc    Download/view dokumen yang diupload
 * @access  Private (mahasiswa hanya miliknya, admin semua)
 */
router.get(
  "/:id/dokumen",
  verifyToken,
  authorize("mahasiswa", "admin"),
  asyncHandler(async (req, res) => {
    const Pengajuan = require("../models/Pengajuan");
    const pengajuan = await Pengajuan.findOne({ idPublik: req.params.id });

    if (!pengajuan || !pengajuan.dokumen) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan.",
      });
    }

    // Cek ownership untuk mahasiswa
    if (
      req.user.role === "mahasiswa" &&
      pengajuan.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Akses ditolak." });
    }

    const filePath = path.join(uploadDir, pengajuan.dokumen);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File tidak ditemukan di server.",
      });
    }

    res.sendFile(filePath);
  })
);

module.exports = router;
