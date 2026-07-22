const mongoose = require("mongoose");

/**
 * Sub-schema untuk setiap mata kuliah dalam daftar
 */
const matakuliahSchema = new mongoose.Schema(
  {
    kode: {
      type: String,
      required: [true, "Kode mata kuliah wajib diisi"],
      trim: true,
    },
    nama: {
      type: String,
      required: [true, "Nama mata kuliah wajib diisi"],
      trim: true,
    },
    sks: {
      type: Number,
      required: [true, "SKS wajib diisi"],
      min: [1, "SKS minimal 1"],
      max: [6, "SKS maksimal 6"],
    },
  },
  { _id: false } // Tidak perlu _id untuk subdocument
);

/**
 * Schema untuk Collection 'pengajuans'
 * Sesuai dengan spesifikasi PRD Section 4
 */
const pengajuanSchema = new mongoose.Schema(
  {
    // ID publik yang mudah dibaca (REQ-YYYY-NNN)
    idPublik: {
      type: String,
      unique: true,
      index: true,
    },
    // Referensi ke user yang membuat pengajuan
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    namaMahasiswa: {
      type: String,
      required: [true, "Nama mahasiswa wajib diisi"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: null,
    },
    nim: {
      type: String,
      required: [true, "NIM wajib diisi"],
      trim: true,
    },
    prodi: {
      type: String,
      required: [true, "Program Studi wajib diisi"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester wajib diisi"],
      trim: true,
    },
    alamat: {
      type: String,
      required: [true, "Alamat wajib diisi"],
      trim: true,
    },
    daftarMatakuliah: {
      type: [matakuliahSchema],
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 7,
        message: "Daftar mata kuliah harus antara 1 sampai 7 mata kuliah",
      },
    },
    alasan: {
      type: String,
      required: [true, "Alasan pengunduran wajib diisi"],
      minlength: [15, "Alasan minimal 15 karakter"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["MENUNGGU", "DISETUJUI", "DITOLAK", "DIBATALKAN"],
      default: "MENUNGGU",
    },
    catatanAdmin: {
      type: String,
      default: null,
    },
    tanggalPengajuan: {
      type: String, // Format: DD/MM/YYYY
    },
    // Path file dokumen yang diupload (opsional)
    dokumen: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Otomatis createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getter agar pengajuan.id mengembalikan idPublik (misal REQ-2026-001)
pengajuanSchema.virtual("id").get(function () {
  return this.idPublik || this._id.toHexString();
});

/**
 * Pre-save hook: Auto-generate idPublik sebelum dokumen disimpan pertama kali
 * Format: REQ-YYYY-NNN (contoh: REQ-2026-001)
 * Memenuhi requirement: Asynchronous Programming - Promise & Mongoose Middleware
 */
pengajuanSchema.pre("save", async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const dd = String(new Date().getDate()).padStart(2, "0");
    const mm = String(new Date().getMonth() + 1).padStart(2, "0");

    // Hitung jumlah pengajuan di tahun ini untuk generate nomor urut
    const count = await mongoose.model("Pengajuan").countDocuments({
      idPublik: { $regex: `^REQ-${year}-` },
    });

    this.idPublik = `REQ-${year}-${String(count + 1).padStart(3, "0")}`;
    this.tanggalPengajuan = `${dd}/${mm}/${year}`;
  }
  next();
});

const Pengajuan = mongoose.model("Pengajuan", pengajuanSchema);

module.exports = Pengajuan;
