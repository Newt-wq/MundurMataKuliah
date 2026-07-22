import { z } from "zod";

export const step1Schema = z.object({
  setujuKetentuan: z.literal(true, {
    message: "Anda harus memahami dan menyetujui ketentuan untuk melanjutkan.",
  }),
});

export const step2Schema = z.object({
  namaMahasiswa: z.string().min(2, "Nama mahasiswa wajib diisi."),
  nim: z.string().min(8, "NIM minimal terdiri dari 8 karakter."),
  prodi: z.string().min(1, "Silakan pilih Program Studi."),
  semester: z.string().min(1, "Silakan pilih Semester/Tahun Ajaran."),
  alamat: z.string().min(10, "Alamat lengkap wajib diisi (minimal 10 karakter)."),
});

export const courseItemSchema = z.object({
  kode: z.string().min(1, "Kode mata kuliah wajib diisi."),
  nama: z.string().min(1, "Nama mata kuliah wajib diisi."),
  sks: z.coerce.number().min(1, "SKS minimal 1.").max(6, "SKS maksimal 6."),
});

export const step3Schema = z.object({
  daftarMatakuliah: z.array(courseItemSchema).min(1, "Minimal pilih 1 mata kuliah yang ingin diundurkan."),
});

export const step4Schema = z.object({
  alasan: z.string().min(15, "Alasan pengunduran wajib diisi (minimal 15 karakter)."),
  diketahuiPA: z.literal(true, {
    message: "Anda harus mengonfirmasi bahwa pengajuan telah diketahui Dosen PA.",
  }),
});

// Full combined schema for final submission validation
export const pengajuanFormSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});
