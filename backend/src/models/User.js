const mongoose = require("mongoose");

/**
 * Schema untuk Collection 'users'
 * Sesuai dengan spesifikasi PRD Section 4
 */
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) =>
          v.endsWith("@students.paramadina.ac.id") ||
          v.endsWith("@paramadina.ac.id"),
        message: "Email harus dari domain resmi Universitas Paramadina.",
      },
    },
    role: {
      type: String,
      enum: ["mahasiswa", "admin"],
      required: true,
    },
    // NIM hanya untuk mahasiswa, diisi setelah login pertama kali (opsional)
    nim: {
      type: String,
      trim: true,
      default: null,
    },
    prodi: {
      type: String,
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    // Otomatis tambahkan createdAt dan updatedAt
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
