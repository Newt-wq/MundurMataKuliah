"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import ApprovalActions from "@/components/approval-actions";
import NextImage from "next/image";
import { ArrowLeft, Printer, AlertCircle, FileText, CheckCircle2, XCircle } from "lucide-react";

export default function AdminReviewDetailPage() {
  const { id } = useParams();
  const { currentUser, pengajuans, isLoading } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [refreshState, setRefreshState] = useState(0);

  useEffect(() => {
    setIsClient(true);
    if (!isLoading && !currentUser) {
      router.push("/login");
    } else if (!isLoading && currentUser && currentUser.role === "mahasiswa") {
      router.push("/");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || !isClient || currentUser.role !== "admin") {
    return (
      <div className="flex-1 flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-madani" />
      </div>
    );
  }

  // Find the requested submission
  const pengajuan = pengajuans.find((p) => p.id === id);

  if (!pengajuan) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-5 text-center my-12 space-y-3 max-w-md mx-auto">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h4 className="font-bold">Pengajuan Tidak Ditemukan</h4>
        <p className="text-xs">
          Berkas dengan ID <span className="font-mono">{id}</span> tidak ditemukan.
        </p>
        <Link
          href="/admin"
          className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs py-2 px-4 rounded transition-colors"
        >
          Kembali ke Dashboard Admin
        </Link>
      </div>
    );
  }

  const totalSks = pengajuan.daftarMatakuliah.reduce((acc, curr) => acc + curr.sks, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleSuccess = () => {
    // Triggers local component re-render to fetch the updated state in Context
    setRefreshState((prev) => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-3 print:hidden">
        <div className="space-y-1">
          <Link
            href="/admin/pengajuan"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-madani font-medium transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Pengajuan</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-madani" />
            <span>Peninjauan Berkas Pengajuan</span>
            <span className="font-mono text-slate-400 text-sm sm:text-base font-normal">#{pengajuan.id}</span>
          </h1>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2 px-4 rounded text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Berkas</span>
          </button>
        </div>
      </div>

      {/* Admin Comment Notification if Resolved */}
      {pengajuan.catatanAdmin && (
        <div className={`p-4 rounded-lg border text-xs leading-relaxed print:hidden flex gap-3 ${
          pengajuan.status === "DISETUJUI" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
            : "bg-rose-50 border-rose-200 text-rose-900"
        }`}>
          {pengajuan.status === "DISETUJUI" 
            ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          }
          <div>
            <span className="font-bold">Keputusan Peninjauan Selesai:</span>
            <p className="mt-1 font-medium italic">"{pengajuan.catatanAdmin}"</p>
          </div>
        </div>
      )}

      {/* Admin action controller (ACC / Reject buttons) */}
      <div className="print:hidden">
        <ApprovalActions pengajuan={pengajuan} onSuccess={handleSuccess} />
      </div>

      {/* Printable Preview Document Form */}
      <div className="bg-white border-2 border-slate-300 rounded-lg shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden font-serif text-slate-900 mx-auto max-w-3xl print:border-none print:shadow-none">
        
        {/* Header Block exactly like docx table layout */}
        <div className="grid grid-cols-3 items-center border-b-2 border-slate-800 pb-4 gap-4">
          <div className="col-span-1 flex justify-start">
            <NextImage
              src="/images/logo-paramadina.png"
              alt="Logo Paramadina"
              width={160}
              height={50}
              className="object-contain max-h-12"
            />
          </div>
          <div className="col-span-2 text-center sm:text-left">
            <h1 className="text-base sm:text-lg font-bold underline tracking-wide font-sans text-slate-950 uppercase">
              FORMULIR MUNDUR MATAKULIAH
            </h1>
          </div>
        </div>

        {/* Student Metadata exactly like docx layout */}
        <div className="space-y-2 text-xs font-sans">
          <div className="grid grid-cols-4 gap-2 pb-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500 col-span-1">Nama Mahasiswa</span>
            <span className="col-span-3 text-slate-900 font-bold">: {pengajuan.namaMahasiswa}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pb-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500 col-span-1">NIM</span>
            <span className="col-span-3 text-slate-900 font-mono font-bold">: {pengajuan.nim}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pb-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500 col-span-1">Program Studi</span>
            <span className="col-span-3 text-slate-900 font-bold">: {pengajuan.prodi}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pb-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500 col-span-1">Semester/Tahun Ajaran</span>
            <span className="col-span-3 text-slate-900 font-bold">: {pengajuan.semester}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pb-1 border-b border-slate-200">
            <span className="font-semibold text-slate-500 col-span-1">Alamat</span>
            <span className="col-span-3 text-slate-900 font-medium leading-relaxed">: {pengajuan.alamat}</span>
          </div>
        </div>

        {/* Dynamic Courses Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 font-sans tracking-wide">
            Mengajukan permohonan mundur matakuliah :
          </h3>
          <div className="border border-slate-400 rounded overflow-hidden">
            <table className="min-w-full divide-y divide-slate-400 text-xs font-sans">
              <thead className="bg-slate-50 text-slate-800 font-bold">
                <tr className="divide-x divide-slate-400">
                  <th className="px-3 py-2 text-center w-12">NO</th>
                  <th className="px-3 py-2 text-left w-1/4">Kode Matakuliah</th>
                  <th className="px-3 py-2 text-left">Nama Matakuliah</th>
                  <th className="px-3 py-2 text-center w-20">SKS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {(() => {
                  const rows = [...pengajuan.daftarMatakuliah];
                  while (rows.length < 7) {
                    rows.push({ kode: "", nama: "", sks: 0 });
                  }
                  return rows.map((mk, index) => (
                    <tr key={index} className="divide-x divide-slate-300 h-8">
                      <td className="px-3 py-1.5 text-center text-slate-600 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-3 py-1.5 font-mono font-semibold text-slate-700">
                        {mk.kode || "\u00A0"}
                      </td>
                      <td className="px-3 py-1.5 text-slate-800">
                        {mk.nama || "\u00A0"}
                      </td>
                      <td className="px-3 py-1.5 text-center font-bold text-slate-800">
                        {mk.sks > 0 ? `${mk.sks}` : "\u00A0"}
                      </td>
                    </tr>
                  ));
                })()}
                
                {/* SKS Summary row */}
                <tr className="bg-slate-50 font-bold border-t border-slate-400 divide-x divide-slate-400">
                  <td colSpan={3} className="px-3 py-2 text-right uppercase tracking-wide text-[10px] text-slate-700 italic">
                    Total SKS:
                  </td>
                  <td className="px-3 py-2 text-center text-slate-900 font-black">
                    {totalSks}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reasons block */}
        <div className="space-y-1 font-sans text-xs">
          <p className="font-semibold text-slate-800">
            Alasan mundur matakuliah :
          </p>
          <div className="border-b border-dashed border-slate-400 pb-1 text-slate-800 italic leading-relaxed min-h-[24px]">
            {pengajuan.alasan}
          </div>
        </div>

        {/* Jakarta Date Row */}
        <div className="text-right text-xs font-sans text-slate-800">
          Jakarta, {new Date(pengajuan.tanggalPengajuan).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </div>

        {/* Signatures/Stamps section (Three Parties Approval layout) */}
        <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs font-sans text-slate-900">
          
          {/* Column 1: Yang Mengajukan */}
          <div className="flex flex-col justify-between h-40 border border-slate-200 p-2.5 rounded bg-slate-50/50">
            <span className="font-semibold text-slate-800 uppercase tracking-wide text-[10px]">
              Yang Mengajukan
            </span>
            
            {/* Materai Rp 10.000 placeholder box */}
            <div className="my-2 border border-dashed border-slate-400 rounded p-1 mx-auto flex items-center justify-center w-24 h-14 bg-white select-none">
              <span className="text-[8px] text-slate-400 font-bold uppercase leading-tight tracking-wider">
                Materai<br />Rp 10.000
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 underline decoration-slate-400">
                {pengajuan.namaMahasiswa}
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                NIM: {pengajuan.nim}
              </span>
            </div>
          </div>

          {/* Column 2: Orang Tua / Wali */}
          <div className="flex flex-col justify-between h-40 border border-slate-200 p-2.5 rounded bg-slate-50/50">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Mengetahui</span>
              <span className="font-semibold text-slate-800 uppercase tracking-wide text-[10px] mt-0.5">
                Orang Tua / Wali
              </span>
            </div>
            
            {/* Digital Stamp Simulation */}
            <div className="my-2 text-[10px] text-emerald-700 font-bold flex flex-col items-center justify-center">
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md">
                Disetujui Wali
              </span>
              <span className="text-[8px] font-mono text-slate-400 mt-1">
                Autentikasi Digital
              </span>
            </div>
            
            <span className="font-bold text-slate-800 border-t border-dashed border-slate-300 pt-1 italic text-[11px]">
              (...................................)
            </span>
          </div>

          {/* Column 3: Dekan FIR */}
          <div className="flex flex-col justify-between h-40 border border-slate-200 p-2.5 rounded bg-slate-50/50">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">Mengetahui</span>
              <span className="font-semibold text-slate-800 uppercase tracking-wide text-[10px] mt-0.5">
                Dekan FIR
              </span>
            </div>
            
            <div className="my-2 flex flex-col items-center justify-center flex-1">
              {pengajuan.status === "DISETUJUI" ? (
                <div className="border-2 border-emerald-600 text-emerald-600 font-black rounded px-2 py-0.5 rotate-[-5deg] text-[9px] uppercase tracking-widest bg-emerald-50/50 select-none">
                  APPROVED UPPS
                </div>
              ) : pengajuan.status === "DITOLAK" ? (
                <div className="border-2 border-rose-600 text-rose-600 font-black rounded px-2 py-0.5 rotate-[-5deg] text-[9px] uppercase tracking-widest bg-rose-50/50 select-none">
                  REJECTED UPPS
                </div>
              ) : (
                <span className="text-[9px] text-slate-400 font-medium">
                  Menunggu Proses...
                </span>
              )}
            </div>

            <span className="font-bold text-slate-800 underline decoration-slate-400">
              Siti Rahmawati, S.T.
            </span>
          </div>

        </div>

        {/* Catatan Footer exactly like docx */}
        <div className="border-t border-slate-300 pt-3 text-[10px] leading-relaxed font-sans text-slate-500">
          <span className="font-bold text-slate-700 block mb-0.5">Catatan:</span>
          1. Jika mundur matakuliah SKS tidak dihitung <br />
          2. Uang SKS tidak dikembalikan <br />
          3. Pastikan telah diketahui Dosen PA
        </div>
      </div>

    </div>
  );
}
