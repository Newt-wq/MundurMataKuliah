const mongoose = require("mongoose");

/**
 * Menghubungkan aplikasi ke MongoDB menggunakan Mongoose.
 * Menggunakan async/await untuk MongoDB Asynchronous Query.
 * Memenuhi requirement: Asynchronous Programming - Async/Await & MongoDB Async Query
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/mundur_matkul";
    if (!process.env.MONGODB_URI) {
      console.warn("⚠️  [MongoDB Warning] MONGODB_URI belum diisi di backend/.env. Mencoba koneksi ke local: mongodb://localhost:27017/mundur_matkul");
    }
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure jika koneksi gagal
    process.exit(1);
  }
};

module.exports = connectDB;
