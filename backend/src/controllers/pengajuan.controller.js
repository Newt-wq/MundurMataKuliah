const Pengajuan = require("../models/Pengajuan");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const fs = require("fs");

/**
 * @desc    Mendapatkan daftar pengajuan
 *          - Mahasiswa: hanya melihat pengajuan milik sendiri
 *          - Admin: melihat semua pengajuan dengan filter & search
 * @route   GET /api/pengajuan
 * @access  Private (mahasiswa & admin)
 *
 * Memenuhi requirement:
 * - REST API: GET endpoint
 * - Authorization: Role-based data filtering
 * - MongoDB Async Query: Model.find() dengan async/await
 */
const getPengajuans = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  // Build query filter berdasarkan role
  let filter = {};

  if (req.user.role === "mahasiswa") {
    // Mahasiswa hanya bisa lihat pengajuan miliknya sendiri
    filter.userId = req.user._id;
  }

  // Filter tambahan (hanya admin yang bisa filter semua data)
  if (status && ["MENUNGGU", "DISETUJUI", "DITOLAK", "DIBATALKAN"].includes(status)) {
    filter.status = status;
  }

  // Search by nama mahasiswa atau NIM (hanya untuk admin)
  if (search && req.user.role === "admin") {
    filter.$or = [
      { namaMahasiswa: { $regex: search, $options: "i" } },
      { nim: { $regex: search, $options: "i" } },
    ];
  }

  // MongoDB Asynchronous Query menggunakan async/await
  const pengajuans = await Pengajuan.find(filter)
    .populate("userId", "name email avatar")
    .sort({ createdAt: -1 }); // Terbaru di atas

  res.status(200).json({
    success: true,
    count: pengajuans.length,
    data: pengajuans,
  });
});

/**
 * @desc    Membuat pengajuan baru
 * @route   POST /api/pengajuan
 * @access  Private (mahasiswa only)
 *
 * Memenuhi requirement:
 * - REST API: POST endpoint
 * - CRUD Data: Create
 * - Validasi Data: Dilakukan oleh validator middleware sebelumnya
 * - MongoDB Async Query: document.save()
 */
const createPengajuan = asyncHandler(async (req, res) => {
  const { namaMahasiswa, email, nim, prodi, semester, alamat, daftarMatakuliah, alasan } = req.body;

  // Buat dokumen pengajuan baru
  // idPublik dan tanggalPengajuan di-generate otomatis oleh pre-save hook di model
  const pengajuan = new Pengajuan({
    userId: req.user._id,
    namaMahasiswa,
    email: email || req.user.email,
    nim,
    prodi,
    semester,
    alamat,
    daftarMatakuliah,
    alasan,
  });

  // Simpan ke MongoDB (async) — pre-save hook akan berjalan di sini
  await pengajuan.save();

  res.status(201).json({
    success: true,
    message: "Pengajuan berhasil dibuat.",
    data: pengajuan,
  });
});

/**
 * @desc    Mendapatkan detail satu pengajuan berdasarkan ID publik (REQ-YYYY-NNN)
 * @route   GET /api/pengajuan/:id
 * @access  Private (mahasiswa hanya miliknya, admin semua)
 *
 * Memenuhi requirement:
 * - REST API: GET by ID endpoint
 * - Authorization: Ownership check untuk mahasiswa
 */
const getPengajuanById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Coba cari by idPublik dulu, fallback ke _id jika valid ObjectId
  let pengajuan = await Pengajuan.findOne({ idPublik: id })
    .populate("userId", "name email avatar");

  if (!pengajuan && id.match(/^[0-9a-fA-F]{24}$/)) {
    pengajuan = await Pengajuan.findById(id).populate("userId", "name email avatar");
  }

  if (!pengajuan) {
    return res.status(404).json({
      success: false,
      message: `Pengajuan dengan ID ${req.params.id} tidak ditemukan.`,
    });
  }

  // Mahasiswa hanya bisa melihat pengajuan miliknya sendiri
  if (
    req.user.role === "mahasiswa" &&
    pengajuan.userId._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Anda tidak memiliki izin untuk melihat pengajuan ini.",
    });
  }

  res.status(200).json({
    success: true,
    data: pengajuan,
  });
});

/**
 * @desc    Update status pengajuan
 *          - Admin: DISETUJUI atau DITOLAK (+ catatan admin)
 *          - Mahasiswa: DIBATALKAN (hanya jika status masih MENUNGGU)
 * @route   PATCH /api/pengajuan/:id/status
 * @access  Private (mahasiswa & admin, dengan batasan berbeda)
 *
 * Memenuhi requirement:
 * - REST API: PATCH endpoint
 * - CRUD Data: Update
 * - Authorization: Role-based action restriction
 */
const updatePengajuanStatus = asyncHandler(async (req, res) => {
  const { status, catatanAdmin } = req.body;
  const { id } = req.params;

  // Coba cari by idPublik dulu, fallback ke _id jika valid ObjectId
  let pengajuan = await Pengajuan.findOne({ idPublik: id });
  if (!pengajuan && id.match(/^[0-9a-fA-F]{24}$/)) {
    pengajuan = await Pengajuan.findById(id);
  }

  if (!pengajuan) {
    return res.status(404).json({
      success: false,
      message: `Pengajuan dengan ID ${req.params.id} tidak ditemukan.`,
    });
  }

  // Validasi berdasarkan role
  if (req.user.role === "mahasiswa") {
    // Mahasiswa hanya bisa membatalkan pengajuan miliknya sendiri
    if (pengajuan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak.",
      });
    }
    // Mahasiswa hanya bisa set status DIBATALKAN
    if (status !== "DIBATALKAN") {
      return res.status(403).json({
        success: false,
        message: "Mahasiswa hanya dapat membatalkan pengajuan.",
      });
    }
    // Hanya bisa dibatalkan jika status masih MENUNGGU
    if (pengajuan.status !== "MENUNGGU") {
      return res.status(400).json({
        success: false,
        message: `Pengajuan tidak dapat dibatalkan karena sudah berstatus ${pengajuan.status}.`,
      });
    }
  } else if (req.user.role === "admin") {
    // Admin hanya bisa set DISETUJUI atau DITOLAK
    if (!["DISETUJUI", "DITOLAK"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Admin hanya dapat menyetujui atau menolak pengajuan.",
      });
    }
    // Hanya bisa diproses jika status MENUNGGU
    if (pengajuan.status !== "MENUNGGU") {
      return res.status(400).json({
        success: false,
        message: `Pengajuan tidak dapat diproses karena sudah berstatus ${pengajuan.status}.`,
      });
    }
  }

  // Update status dan catatan admin
  pengajuan.status = status;
  if (catatanAdmin !== undefined) {
    pengajuan.catatanAdmin = catatanAdmin;
  }

  // Simpan perubahan ke MongoDB (async)
  await pengajuan.save();

  res.status(200).json({
    success: true,
    message: `Status pengajuan berhasil diupdate menjadi ${status}.`,
    data: pengajuan,
  });
});

/**
 * @desc    Upload dokumen pendukung untuk pengajuan
 * @route   POST /api/pengajuan/:id/dokumen
 * @access  Private (mahasiswa, hanya miliknya sendiri)
 *
 * Memenuhi requirement:
 * - Upload Dokumen: Menggunakan multer untuk file upload
 * - REST API: POST endpoint untuk upload
 */
const uploadDokumen = asyncHandler(async (req, res) => {
  const pengajuan = await Pengajuan.findOne({ idPublik: req.params.id });

  if (!pengajuan) {
    return res.status(404).json({
      success: false,
      message: `Pengajuan dengan ID ${req.params.id} tidak ditemukan.`,
    });
  }

  // Hanya pemilik yang bisa upload
  if (pengajuan.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak.",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada file yang diupload.",
    });
  }

  // Hapus file lama jika ada
  if (pengajuan.dokumen) {
    const oldFilePath = path.join(__dirname, "../../uploads", pengajuan.dokumen);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  // Simpan nama file ke database
  pengajuan.dokumen = req.file.filename;
  await pengajuan.save();

  res.status(200).json({
    success: true,
    message: "Dokumen berhasil diupload.",
    data: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    },
  });
});

module.exports = {
  getPengajuans,
  createPengajuan,
  getPengajuanById,
  updatePengajuanStatus,
  uploadDokumen,
};
