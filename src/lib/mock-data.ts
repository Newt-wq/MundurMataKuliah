import { User, Pengajuan } from "../types";

export const MOCK_USERS: { mahasiswa: User; admin: User } = {
  mahasiswa: {
    id: "mhs_1",
    name: "Budi Santoso",
    nim: "1212022001",
    email: "budi.santoso@students.paramadina.ac.id",
    prodi: "Informatika",
    semester: "Ganjil 2025/2026",
    alamat: "Jl. Mampang Prapatan No. 45, Pancoran, Jakarta Selatan 12790",
    role: "mahasiswa"
  },
  admin: {
    id: "adm_1",
    name: "Siti Rahmawati, S.T., M.T.",
    nim: "UPPS-FIR-01",
    email: "fir@paramadina.ac.id",
    prodi: "Fakultas Ilmu Rekayasa",
    semester: "",
    alamat: "Gedung A, Kampus Universitas Paramadina, Cilandak, Jakarta Selatan",
    role: "admin"
  }
};

export const MOCK_PENGAJUAN_INIT: Pengajuan[] = [
  {
    id: "REQ-2025-001",
    nim: "1212022001",
    namaMahasiswa: "Budi Santoso",
    prodi: "Informatika",
    semester: "Ganjil 2025/2026",
    alamat: "Jl. Mampang Prapatan No. 45, Pancoran, Jakarta Selatan 12790",
    alasan: "Tabrakan jadwal kerja shift sore dengan jadwal praktikum mata kuliah ini.",
    tanggalPengajuan: "10/09/2025",
    daftarMatakuliah: [
      { kode: "INF-202", nama: "Pemrograman Web Lanjut", sks: 3 }
    ],
    status: "DISETUJUI",
    catatanAdmin: "Disetujui. Silakan cek SKS Anda di portal akademik.",
    updatedAt: "2025-09-12T09:30:00.000Z"
  },
  {
    id: "REQ-2025-002",
    nim: "1212022001",
    namaMahasiswa: "Budi Santoso",
    prodi: "Informatika",
    semester: "Ganjil 2025/2026",
    alamat: "Jl. Mampang Prapatan No. 45, Pancoran, Jakarta Selatan 12790",
    alasan: "Ingin fokus pada proyek tugas akhir dan mengurangi beban mata kuliah pilihan.",
    tanggalPengajuan: "15/09/2025",
    daftarMatakuliah: [
      { kode: "INF-302", nama: "Kecerdasan Buatan", sks: 3 },
      { kode: "GEN-102", nama: "Bahasa Inggris Akademik", sks: 2 }
    ],
    status: "DITOLAK",
    catatanAdmin: "Pengajuan ditolak karena telah melewati batas waktu pertemuan ke-2 (14 September 2025).",
    updatedAt: "2025-09-16T14:15:00.000Z"
  },
  {
    id: "REQ-2025-003",
    nim: "1212022001",
    namaMahasiswa: "Budi Santoso",
    prodi: "Informatika",
    semester: "Ganjil 2025/2026",
    alamat: "Jl. Mampang Prapatan No. 45, Pancoran, Jakarta Selatan 12790",
    alasan: "Mengalami sakit berkepanjangan dan harus menjalani rawat jalan selama semester ini.",
    tanggalPengajuan: "17/07/2026", // Today's date relative to simulated time
    daftarMatakuliah: [
      { kode: "INF-201", nama: "Pemrograman Asinkron Node.js", sks: 3 }
    ],
    status: "MENUNGGU",
    updatedAt: "2026-07-17T03:30:00.000Z"
  },
  {
    id: "REQ-2025-004",
    nim: "1212022002",
    namaMahasiswa: "Randi Prasetyo",
    prodi: "Teknik Elektro",
    semester: "Ganjil 2025/2026",
    alamat: "Perumahan Indah Permai Blok B2 No. 8, Depok",
    alasan: "Mata kuliah Mikrokontroler membutuhkan banyak prasyarat dasar yang belum saya kuasai sepenuhnya.",
    tanggalPengajuan: "16/07/2026",
    daftarMatakuliah: [
      { kode: "ELK-203", nama: "Mikrokontroler", sks: 4 }
    ],
    status: "MENUNGGU",
    updatedAt: "2026-07-16T11:00:00.000Z"
  },
  {
    id: "REQ-2025-005",
    nim: "1212022009",
    namaMahasiswa: "Amanda Putri",
    prodi: "Desain Produk",
    semester: "Ganjil 2025/2026",
    alamat: "Kost Green House Kamar 12, Kebayoran Baru, Jakarta Selatan",
    alasan: "Jumlah SKS terlalu berat bagi saya yang sedang magang di industri.",
    tanggalPengajuan: "14/07/2026",
    daftarMatakuliah: [
      { kode: "DSP-201", nama: "Desain Produk Dasar", sks: 4 },
      { kode: "GEN-101", nama: "Etika Paramadina", sks: 2 }
    ],
    status: "DISETUJUI",
    catatanAdmin: "ACC. Berkas administrasi lengkap.",
    updatedAt: "2026-07-15T08:00:00.000Z"
  }
];
