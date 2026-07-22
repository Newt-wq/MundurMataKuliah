"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ApprovalActions from "@/components/approval-actions";
import { ArrowLeft, Printer, Download, AlertCircle, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function AdminReviewDetailPage() {
  const { id } = useParams();
  const { currentUser, pengajuans, isLoading } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [refreshState, setRefreshState] = useState(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isLoading && !currentUser) {
      router.push("/login");
    }

    // Preload html2pdf script
    if (typeof window !== "undefined" && !window.html2pdf) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || !isClient) {
    return (
      <div className="flex-1 flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-madani" />
      </div>
    );
  }

  // Find the requested submission
  const pengajuan = pengajuans.find((p) => p.id === id || p.idPublik === id || p._id === id);

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

  const totalSks = pengajuan.daftarMatakuliah?.reduce((acc, curr) => acc + (Number(curr?.sks) || 0), 0) || 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      if (!window.html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const element = document.getElementById("printable-form");
      const reqIdForPdf = pengajuan.idPublik || pengajuan._id;
      const opt = {
        margin: [5, 5, 5, 5],
        filename: `Formulir-Mundur-Matakuliah-${reqIdForPdf}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      await window.html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Gagal mengunduh PDF secara otomatis. Mencoba membuka jendela cetak...");
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleSuccess = () => {
    // Triggers local component re-render to fetch updated state in Context
    setRefreshState((prev) => prev + 1);
  };

  // Safe date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "22 Juli 2026";
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      const d = parts[0];
      const m = parts[1];
      const y = parts[2];
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      if (d && m && y && months[Number(m) - 1]) {
        return `${Number(d)} ${months[Number(m) - 1]} ${y}`;
      }
    }
    return dateStr;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* CSS Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
          }
          nav, footer, .print\\:hidden {
            display: none !important;
          }
          .print-form-container {
            border: none !important;
            box-shadow: none !important;
            padding: 15mm 20mm !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

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
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            title="Cetak fisik dokumen via printer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2 px-3.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Form</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            title="Unduh berkas sebagai file .pdf langsung"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
            <span>{isDownloadingPdf ? "Mengunduh PDF..." : "Unduh File PDF"}</span>
          </button>
        </div>
      </div>

      {/* Admin Comment Notification if Resolved */}
      {pengajuan.catatanAdmin && (
        <div className={`p-4 rounded-xl border text-xs leading-relaxed print:hidden flex gap-3 ${
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

      {/* EXACT PHYSICAL FORM PRINTABLE CANVAS (Standard Hex Color Inline Styles) */}
      <div 
        id="printable-form"
        style={{ backgroundColor: "#ffffff", color: "#000000" }}
        className="print-form-container p-6 sm:p-10 space-y-6 relative font-sans mx-auto max-w-3xl"
      >
        
        {/* Header Block with Logo Left and Title Right */}
        <div style={{ borderColor: "#000000" }} className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-paramadina.png"
              alt="Logo Paramadina"
              className="object-contain max-h-12 w-auto"
            />
          </div>
          <div>
            <h1 style={{ color: "#000000" }} className="text-sm sm:text-base font-extrabold underline tracking-wide font-sans uppercase text-right">
              FORMULIR MUNDUR MATAKULIAH
            </h1>
          </div>
        </div>

        {/* Student Metadata */}
        <div style={{ color: "#000000" }} className="space-y-2 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span style={{ color: "#334155" }} className="w-40 font-normal">Nama Mahasiswa</span>
            <span style={{ color: "#000000" }} className="font-bold">: {pengajuan.namaMahasiswa}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "#334155" }} className="w-40 font-normal">Email Mahasiswa</span>
            <span style={{ color: "#000000" }} className="font-medium">: {pengajuan.email || (typeof pengajuan.userId === "object" ? pengajuan.userId?.email : "")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "#334155" }} className="w-40 font-normal">NIM</span>
            <span style={{ color: "#000000" }} className="font-mono font-bold">: {pengajuan.nim}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "#334155" }} className="w-40 font-normal">Program Studi</span>
            <span style={{ color: "#000000" }} className="font-bold">: {pengajuan.prodi}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: "#334155" }} className="w-40 font-normal">Semester/Tahun Ajaran</span>
            <span style={{ color: "#000000" }} className="font-bold">: {pengajuan.semester}</span>
          </div>
          <div className="flex items-start gap-2">
            <span style={{ color: "#334155" }} className="w-40 font-normal shrink-0">Alamat</span>
            <span style={{ color: "#000000" }} className="font-medium leading-relaxed">: {pengajuan.alamat}</span>
          </div>
        </div>

        {/* Course Table */}
        <div className="space-y-2 pt-2">
          <h3 style={{ color: "#000000" }} className="text-xs font-normal tracking-wide">
            Mengajukan permohonan mundur matakuliah :
          </h3>
          <div style={{ borderColor: "#000000" }} className="border overflow-hidden">
            <table style={{ borderColor: "#000000" }} className="w-full text-xs border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", color: "#000000", borderColor: "#000000" }} className="font-bold border-b">
                  <th style={{ borderColor: "#000000", color: "#000000" }} className="px-3 py-2 text-center w-12 border-r">NO</th>
                  <th style={{ borderColor: "#000000", color: "#000000" }} className="px-3 py-2 text-left w-1/4 border-r">Kode Matakuliah</th>
                  <th style={{ borderColor: "#000000", color: "#000000" }} className="px-3 py-2 text-left border-r">Nama Matakuliah</th>
                  <th style={{ color: "#000000" }} className="px-3 py-2 text-center w-16">SKS</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows = [...(pengajuan.daftarMatakuliah || [])];
                  while (rows.length < 7) {
                    rows.push({ kode: "", nama: "", sks: 0 });
                  }
                  return rows.map((mk, index) => (
                    <tr key={index} style={{ borderColor: "#000000" }} className="border-b h-7">
                      <td style={{ borderColor: "#000000", color: "#000000" }} className="px-3 py-1 text-center border-r font-medium">
                        {index + 1}
                      </td>
                      <td style={{ borderColor: "#000000", color: "#000000" }} className="px-3 py-1 font-mono font-semibold border-r">
                        {mk.kode || "\u00A0"}
                      </td>
                      <td style={{ borderColor: "#000000", color: "#000000" }} className="px-3 py-1 font-medium border-r">
                        {mk.nama || "\u00A0"}
                      </td>
                      <td style={{ color: "#000000" }} className="px-3 py-1 text-center font-bold">
                        {mk.sks > 0 ? `${mk.sks}` : "\u00A0"}
                      </td>
                    </tr>
                  ));
                })()}
                
                {/* Total SKS Row */}
                <tr style={{ borderColor: "#000000", color: "#000000" }} className="font-bold border-t">
                  <td colSpan={3} style={{ borderColor: "#000000", color: "#000000" }} className="px-3 py-1.5 text-right font-extrabold italic border-r">
                    Total SKS
                  </td>
                  <td style={{ color: "#000000" }} className="px-3 py-1.5 text-center font-black">
                    {totalSks}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reasons block */}
        <div style={{ color: "#000000" }} className="space-y-1 text-xs pt-1">
          <p className="font-normal">
            Alasan mundur matakuliah: <span style={{ color: "#000000" }} className="italic font-medium underline">{pengajuan.alasan}</span>
          </p>
        </div>

        {/* Date Row */}
        <div style={{ color: "#000000" }} className="text-xs pt-2 font-normal">
          Jakarta, <span style={{ borderColor: "#000000" }} className="border-b border-dotted px-4">{formatDate(pengajuan.tanggalPengajuan)}</span>
        </div>

        {/* Signature Columns */}
        <div style={{ color: "#000000" }} className="grid grid-cols-3 gap-6 pt-2 text-center text-xs font-sans">
          
          {/* Column 1: Yang Mengajukan */}
          <div className="flex flex-col justify-between h-44">
            <span style={{ color: "#000000" }} className="font-normal">
              Yang Mengajukan
            </span>
            
            <div style={{ borderColor: "#000000", backgroundColor: "#ffffff" }} className="my-1 border rounded p-1 mx-auto flex items-center justify-center w-24 h-14 select-none">
              <span style={{ color: "#475569" }} className="text-[8px] font-bold uppercase leading-tight tracking-wider">
                Materai<br />Rp. 10.000
              </span>
            </div>
            
            <div className="flex flex-col">
              <span style={{ color: "#000000" }} className="font-normal">
                ( <span className="font-bold underline">{pengajuan.namaMahasiswa}</span> )
              </span>
              <span style={{ color: "#334155" }} className="text-[10px] font-mono mt-0.5 font-bold">
                NIM: {pengajuan.nim}
              </span>
            </div>
          </div>

          {/* Column 2: Orang Tua / Wali */}
          <div className="flex flex-col justify-between h-44">
            <span style={{ color: "#000000" }} className="font-normal">
              Mengetahui
            </span>
            
            <div className="my-1 text-[10px] font-bold flex flex-col items-center justify-center">
              <span style={{ backgroundColor: "#ecfdf5", borderColor: "#a7f3d0", color: "#047857" }} className="px-2 py-0.5 border rounded text-[9px]">
                ✓ Disetujui Wali
              </span>
              <span style={{ color: "#94a3b8" }} className="text-[8px] font-mono mt-0.5">
                Autentikasi Digital
              </span>
            </div>
            
            <div className="flex flex-col">
              <span style={{ color: "#000000" }} className="font-normal">
                (.......................................)
              </span>
              <span style={{ color: "#334155" }} className="text-[10px] mt-0.5 font-bold">
                Orang Tua/Wali
              </span>
            </div>
          </div>

          {/* Column 3: Dekan FIR */}
          <div className="flex flex-col justify-between h-44">
            <span style={{ color: "#000000" }} className="font-normal">
              Mengetahui
            </span>
            
            <div className="my-1 flex flex-col items-center justify-center flex-1">
              {pengajuan.status === "DISETUJUI" ? (
                <div style={{ borderColor: "#059669", color: "#047857", backgroundColor: "#ecfdf5" }} className="border-2 font-black rounded px-2.5 py-1 rotate-[-5deg] text-[9px] uppercase tracking-widest select-none">
                  APPROVED UPPS
                </div>
              ) : pengajuan.status === "DITOLAK" ? (
                <div style={{ borderColor: "#e11d48", color: "#be123c", backgroundColor: "#fff1f2" }} className="border-2 font-black rounded px-2.5 py-1 rotate-[-5deg] text-[9px] uppercase tracking-widest select-none">
                  REJECTED UPPS
                </div>
              ) : (
                <span style={{ color: "#94a3b8" }} className="text-[9px] font-medium italic">
                  (Belum Diproses)
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <span style={{ color: "#000000" }} className="font-normal">
                ( <span className="font-bold underline">Siti Rahmawati, S.T.</span> )
              </span>
              <span style={{ color: "#334155" }} className="text-[10px] mt-0.5 font-bold">
                Dekan FIR
              </span>
            </div>
          </div>

        </div>

        {/* Catatan Footer */}
        <div style={{ color: "#000000" }} className="pt-4 text-[10px] leading-relaxed font-sans">
          <span className="font-bold block mb-0.5">Catatan:</span>
          1. Jika mundur matakuliah SKS tidak dihitung <br />
          2. Uang SKS tidak dikembalikan <br />
          3. Pastikan telah diketahui Dosen PA
        </div>
      </div>

    </div>
  );
}
