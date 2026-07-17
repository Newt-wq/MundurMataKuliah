export type Role = 'mahasiswa' | 'admin';

export interface User {
  id: string;
  name: string;
  nim: string;
  email: string;
  prodi: string;
  semester: string;
  alamat: string;
  role: Role;
}

export interface MataKuliah {
  kode: string;
  nama: string;
  sks: number;
}

export type PengajuanStatus = 'MENUNGGU' | 'DISETUJUI' | 'DITOLAK';

export interface Pengajuan {
  id: string;
  nim: string;
  namaMahasiswa: string;
  prodi: string;
  semester: string; // e.g. "Ganjil 2025/2026"
  alamat: string;
  alasan: string;
  tanggalPengajuan: string; // Format: dd/mm/yyyy
  daftarMatakuliah: MataKuliah[];
  status: PengajuanStatus;
  catatanAdmin?: string; // For rejection comments
  updatedAt: string; // ISO string
}
