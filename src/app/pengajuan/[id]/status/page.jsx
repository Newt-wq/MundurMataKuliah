"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createWaHotlineUrl, WA_HOTLINE_DISPLAY } from "@/lib/constants";
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, HelpCircle, Ban, FileText, MessageSquare } from "lucide-react";

export default function TrackingStatusPage() {
  const { id } = useParams();
  const { currentUser, pengajuans, cancelPengajuan, fetchPengajuans, isLoading } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || !isClient) {
    return (
      <div className="flex-1 flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-madani" />
      </div>
    );
  }

  const pengajuan = pengajuans.find((p) => p.id === id || p.idPublik === id || p._id === id);

  if (!pengajuan) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-5 text-center my-12 max-w-md mx-auto">
        <h4 className="font-bold">Pengajuan Tidak Ditemukan</h4>
        <Link href="/" className="text-xs underline mt-2 block">Kembali ke Dashboard</Link>
      </div>
    );
  }

  // Verifikasi hak akses: hanya pemilik pengajuan (berdasarkan userId/nim) atau admin yang dapat melihat
  const ownerId = typeof pengajuan.userId === "object" ? pengajuan.userId?._id : pengajuan.userId;
  const isOwner =
    !ownerId ||
    String(ownerId) === String(currentUser.id) ||
    String(ownerId) === String(currentUser._id) ||
    (currentUser.nim && pengajuan.nim === currentUser.nim);

  if (currentUser.role === "mahasiswa" && !isOwner) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-5 text-center my-12 max-w-md mx-auto">
        <h4 className="font-bold">Akses Ditolak</h4>
        <Link href="/" className="text-xs underline mt-2 block">Kembali ke Dashboard</Link>
      </div>
    );
  }

  const reqId = pengajuan.idPublik || pengajuan.id || pengajuan._id;
  const isPending = pengajuan.status === "MENUNGGU";
  const isApproved = pengajuan.status === "DISETUJUI";
  const isRejected = pengajuan.status === "DITOLAK";
  const isCanceled = pengajuan.status === "DIBATALKAN";

  const handleCancel = async () => {
    if (!confirm(`Apakah Anda yakin ingin membatalkan pengajuan #${reqId}? Tindakan ini tidak dapat dibatalkan.`)) return;
    setIsCanceling(true);
    try {
      await cancelPengajuan(reqId);
      await fetchPengajuans(); // refresh data
      alert(`Pengajuan #${reqId} berhasil dibatalkan.`);
    } catch (error) {
      alert(`Gagal membatalkan: ${error.message}`);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title & Action Header (Sangat Clean) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-3">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-madani font-medium transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>Lacak Status Pengajuan</span>
            <span className="font-mono text-slate-400 text-sm font-normal">#{reqId}</span>
          </h1>
          <p className="text-xs text-slate-500">
            Pantau progres review berkas administrasi mundur mata kuliah Anda oleh UPPS.
          </p>
        </div>

        {/* Clean Header Action */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/pengajuan/${reqId}`}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2 px-3.5 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="w-4 h-4 text-primary-madani" />
            <span>Lihat Form Cetak</span>
          </Link>
        </div>
      </div>

      {/* Main Status Timeline Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-8 space-y-8">
        
        {/* Progress Timeline Stepper */}
        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
          
          {/* Step 1: Diajukan */}
          <div className="relative">
            <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Pengajuan Tersubmit</h4>
                <span className="text-[10px] font-mono text-slate-400">{pengajuan.tanggalPengajuan}</span>
              </div>
              <p className="text-xs text-slate-500">
                Formulir telah sukses dibuat dan dikirimkan ke sistem administrasi FIR UPPS.
              </p>
            </div>
          </div>

          {/* Step 2: Menunggu Review Admin UPPS */}
          <div className="relative">
            <div className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shadow-xs ${
              isCanceled ? "bg-slate-300" :
              isPending ? "bg-amber-500 animate-pulse" : "bg-emerald-600"
            }`}>
              {isPending ? <Clock className="w-3.5 h-3.5" /> : 
               isCanceled ? <Ban className="w-3.5 h-3.5" /> :
               <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Pemeriksaan Berkas UPPS FIR</h4>
                {isPending && (
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Sedang Diproses
                  </span>
                )}
                {isCanceled && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Dibatalkan
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isCanceled ? "Pemeriksaan dihentikan karena pengajuan dibatalkan oleh mahasiswa." : "Tim Admin UPPS FIR meninjau kesesuaian SKS dan validitas syarat pengunduran kuliah."}
              </p>
            </div>
          </div>

          {/* Step 3: Keputusan Akhir */}
          <div className="relative">
            <div className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shadow-xs ${
              isPending || isCanceled ? "bg-slate-200" :
              isApproved ? "bg-emerald-600" : "bg-rose-600"
            }`}>
              {!isPending && !isCanceled && isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
               !isPending && !isCanceled && isRejected ? <AlertTriangle className="w-3.5 h-3.5" /> :
               <Clock className="w-3.5 h-3.5 text-slate-400" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${
                  isPending || isCanceled ? "text-slate-400" :
                  isApproved ? "text-emerald-700" : "text-rose-700"
                }`}>
                  {isCanceled ? "Pengajuan Dibatalkan" :
                   isPending ? "Keputusan Akhir" :
                   isApproved ? "Disetujui (ACC)" : "Ditolak"}
                </h4>
                {!isPending && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-full uppercase tracking-wider ${
                    isApproved ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                    isRejected ? "bg-rose-50 text-rose-800 border-rose-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {pengajuan.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isCanceled ? "Berkas ini telah dibatalkan secara resmi oleh Anda." :
                 isPending ? "Tahap akhir keputusan pengajuan mundur mata kuliah." :
                 isApproved ? "Pengajuan Anda telah disetujui. SKS mata kuliah dibatalkan secara formal." :
                 "Pengajuan ditolak. Silakan baca alasan penolakan dari admin di bawah."}
              </p>
            </div>
          </div>

        </div>

        {/* Admin Feedback Box */}
        {pengajuan.catatanAdmin && (
          <div className={`p-4 rounded-xl border text-xs space-y-1.5 leading-relaxed ${
            isApproved 
              ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}>
            <span className="font-bold uppercase tracking-wider text-[10px]">Tanggapan UPPS FIR:</span>
            <p className="font-medium italic">"{pengajuan.catatanAdmin}"</p>
          </div>
        )}

      </div>

      {/* Opsional: Kartu Aksi Pembatalan Berkas Sederhana & Rapi (Hanya muncul jika status MENUNGGU) */}
      {isPending && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-slate-400" />
              <span>Opsi Pembatalan Berkas</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Jika terjadi kesalahan data atau Anda berubah pikiran, Anda dapat membatalkan berkas ini sebelum diverifikasi UPPS.
            </p>
          </div>
          <button
            onClick={handleCancel}
            disabled={isCanceling}
            className="w-full sm:w-auto shrink-0 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-semibold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCanceling ? "Membatalkan..." : "Batalkan Pengajuan"}
          </button>
        </div>
      )}

      {/* Helper Info Footer Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Informasi Alur Selanjutnya</span>
        </h4>
        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
          {isPending && (
            <li>Silakan tunggu proses verifikasi berkas oleh admin UPPS FIR (1-2 hari kerja).</li>
          )}
          {isApproved && (
            <>
              <li>Unduh berkas PDF formulir Anda dengan mengeklik tombol <Link href={`/pengajuan/${reqId}`} className="text-primary-madani font-semibold underline">Lihat Form</Link>.</li>
              <li>Periksa portal akademik (KRS online) Anda secara berkala untuk memastikan mata kuliah tersebut telah dinonaktifkan.</li>
            </>
          )}
          {isRejected && (
            <>
              <li>Silakan baca alasan penolakan di atas dengan teliti.</li>
              <li>Jika ada kesalahan input, Anda dapat berkoordinasi dengan Dosen PA atau mengajukan formulir baru jika masih berada dalam tenggat waktu pertemuan ke-2.</li>
            </>
          )}
          <li>
            Untuk pertanyaan mendesak, silakan hubungi <a href="mailto:fir@paramadina.ac.id" className="text-primary-madani font-semibold underline">fir@paramadina.ac.id</a> atau via{" "}
            <a
              href={createWaHotlineUrl(`Halo Admin UPPS FIR, saya ingin menanyakan pengajuan #${reqId}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Hotline UPPS ({WA_HOTLINE_DISPLAY})</span>
            </a>
          </li>
        </ul>
      </div>

    </div>
  );
}
