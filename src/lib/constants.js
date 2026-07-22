export const PROSEDUR_MUNDUR = [
  "Mundur mata kuliah paling lambat dilakukan pada pertemuan ke-2 perkuliahan semester berjalan.",
  "Tanggal pertemuan ke-2 mengikuti kalender akademik yang diterbitkan.",
  "Pembayaran yang telah dilakukan tidak dapat dikembalikan / dijadikan deposit.",
  "Formulir diserahkan langsung ke ruang UPPS FIR atau dikirim via email ke fir@paramadina.ac.id.",
  "SKS mata kuliah yang diundurkan tidak dihitung.",
  "Sebelum diajukan, harus diketahui oleh Dosen Pembimbing Akademik (PA)."
];

export const EMAIL_UPPS = "fir@paramadina.ac.id";
export const WA_HOTLINE_NUMBER = "628159181193"; // Nomor WhatsApp Official UPPS FIR Paramadina
export const WA_HOTLINE_DISPLAY = "+62 815-9181-193";

/**
 * Generate URL WhatsApp me dengan pesan otomatis
 */
export const createWaHotlineUrl = (customMessage = "") => {
  const defaultText = customMessage || "Halo Admin UPPS FIR Universitas Paramadina, saya ingin berkonsultasi mengenai pengunduran mata kuliah.";
  return `https://wa.me/${WA_HOTLINE_NUMBER}?text=${encodeURIComponent(defaultText)}`;
};

export const PROGRAM_STUDI = [
  "Informatika",
  "DKV",
  "Desain Produk",
];

export const SEMESTER_TAHUN_AJARAN = [
  "Ganjil 2025/2026",
  "Genap 2025/2026",
  "Ganjil 2026/2027",
  "Genap 2026/2027"
];

// Catalog of FIR courses for auto-selection or suggestions
export const KATALOG_MATA_KULIAH = [
  { kode: "INF-201", nama: "Pemrograman Asinkron Node.js", sks: 3 },
  { kode: "INF-202", nama: "Pemrograman Web Lanjut", sks: 3 },
  { kode: "INF-101", nama: "Algoritma dan Pemrograman", sks: 4 },
  { kode: "INF-302", nama: "Kecerdasan Buatan", sks: 3 },
  { kode: "INF-205", nama: "Basis Data", sks: 3 },
  { kode: "ELK-101", nama: "Rangkaian Listrik I", sks: 3 },
  { kode: "ELK-203", nama: "Mikrokontroler", sks: 4 },
  { kode: "ELK-301", nama: "Sistem Kendali", sks: 3 },
  { kode: "DSP-102", nama: "Gambar Teknik", sks: 2 },
  { kode: "DSP-201", nama: "Desain Produk Dasar", sks: 4 },
  { kode: "DSP-304", nama: "Ergonomi Desain", sks: 3 },
  { kode: "GEN-101", nama: "Etika Paramadina", sks: 2 },
  { kode: "GEN-102", nama: "Bahasa Inggris Akademik", sks: 2 }
];
