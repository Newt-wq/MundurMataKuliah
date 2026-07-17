"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, FileText, HelpCircle, Mail } from "lucide-react";

export default function TrackingStatusPage() {
  const { id } = useParams();
  const { currentUser, pengajuans, isLoading } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

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

  const pengajuan = pengajuans.find((p) => p.id === id);

  if (!pengajuan) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-5 text-center my-12 max-w-md mx-auto">
        <h4 className="font-bold">Pengajuan Tidak Ditemukan</h4>
        <Link href="/" className="text-xs underline mt-2 block">Kembali ke Dashboard</Link>
      </div>
    );
  }

  // Redirect if student attempts to read another student's submission
  if (currentUser.role === "mahasiswa" && pengajuan.nim !== currentUser.nim) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-5 text-center my-12 max-w-md mx-auto">
        <h4 className="font-bold">Akses Ditolak</h4>
        <Link href="/" className="text-xs underline mt-2 block">Kembali ke Dashboard</Link>
      </div>
    );
  }

  const isPending = pengajuan.status === "MENUNGGU";
  const isApproved = pengajuan.status === "DISETUJUI";
  const isRejected = pengajuan.status === "DITOLAK";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-madani font-medium transition-colors mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dashboard</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span>Lacak Status Pengajuan</span>
          <span className="font-mono text-slate-400 text-sm font-normal">#{pengajuan.id}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Pantau progres review berkas administrasi mundur mata kuliah Anda oleh UPPS.
        </p>
      </div>

      {/* Main Status Timeline Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Progress Timeline Stepper */}
        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
          
          {/* Step 1: Diajukan */}
          <div className="relative">
            {/* Step dot */}
            <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-sm">
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
            {/* Step dot */}
            <div className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm ${
              isPending 
                ? "bg-amber-500 animate-pulse" 
                : "bg-emerald-600"
            }`}>
              {isPending ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">Pemeriksaan Berkas UPPS FIR</h4>
                {isPending && (
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold border border-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Sedang Diproses
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Tim Admin UPPS FIR meninjau kesesuaian SKS dan validitas syarat pengunduran kuliah.
              </p>
            </div>
          </div>

          {/* Step 3: Keputusan Akhir */}
          <div className="relative">
            {/* Step dot */}
            <div className={`absolute -left-[27px] top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm ${
              isPending ? "bg-slate-200" :
              isApproved ? "bg-emerald-600" : "bg-rose-600"
            }`}>
              {!isPending && isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
               !isPending && isRejected ? <AlertTriangle className="w-3.5 h-3.5" /> :
               <Clock className="w-3.5 h-3.5 text-slate-400" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${
                  isPending ? "text-slate-400" :
                  isApproved ? "text-emerald-700" : "text-rose-700"
                }`}>
                  {isPending ? "Keputusan Akhir" :
                   isApproved ? "Disetujui (ACC)" : "Ditolak"}
                </h4>
                {!isPending && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider ${
                    isApproved ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-rose-50 text-rose-800 border-rose-100"
                  }`}>
                    {pengajuan.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isPending ? "Tahap akhir keputusan pengajuan mundur mata kuliah." :
                 isApproved ? "Pengajuan Anda telah disetujui. SKS mata kuliah dibatalkan secara formal." :
                 "Pengajuan ditolak. Silakan baca alasan penolakan dari admin di bawah."}
              </p>
            </div>
          </div>

        </div>

        {/* Admin Feedback Box */}
        {!isPending && (
          <div className={`p-4 rounded-lg border text-xs space-y-1.5 leading-relaxed ${
            isApproved 
              ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}>
            <span className="font-bold uppercase tracking-wider text-[10px]">Tanggapan UPPS FIR:</span>
            <p className="font-medium italic">"{pengajuan.catatanAdmin || "Tidak ada catatan."}"</p>
          </div>
        )}

      </div>

      {/* Helper Info Footer Cards */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Langkah Selanjutnya?</span>
        </h4>
        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
          {isPending && (
            <li>Silakan tunggu proses verifikasi berkas oleh admin UPPS FIR. Umumnya memakan waktu 1-2 hari kerja.</li>
          )}
          {isApproved && (
            <>
              <li>Unduh berkas PDF formulir Anda dengan mengeklik tombol <Link href={`/pengajuan/${pengajuan.id}`} className="text-primary-madani font-semibold underline">Lihat Form</Link>.</li>
              <li>Periksa portal akademik (KRS online) Anda secara berkala untuk memastikan mata kuliah tersebut telah dinonaktifkan.</li>
            </>
          )}
          {isRejected && (
            <>
              <li>Silakan baca alasan penolakan di atas dengan teliti.</li>
              <li>Jika ada kesalahan input, Anda dapat berkoordinasi dengan Dosen PA atau mengajukan formulir baru jika masih berada dalam tenggat waktu pertemuan ke-2.</li>
            </>
          )}
          <li>Untuk pertanyaan mendesak, silakan hubungi <a href="mailto:fir@paramadina.ac.id" className="text-primary-madani font-semibold underline">fir@paramadina.ac.id</a>.</li>
        </ul>
      </div>

    </div>
  );
}
