"use client";

import React, { useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PengajuanCard from "@/components/pengajuan-card";
import { 
  FilePlus, 
  Clock, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  AlertCircle, 
  ArrowRight,
  PlusCircle,
  History,
  Sparkles
} from "lucide-react";

export default function StudentDashboard() {
  const { currentUser, pengajuans, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    } else if (!isLoading && currentUser && currentUser.role === "admin") {
      router.push("/admin");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || currentUser.role !== "mahasiswa") {
    return (
      <div className="flex-1 flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-madani" />
      </div>
    );
  }

  // Filter pengajuans belonging to the current student
  const studentSubmissions = pengajuans.filter((p) => p.nim === currentUser.nim);
  // ONLY show pending/active submissions on Dashboard to avoid clutter!
  const pendingSubmissions = studentSubmissions.filter((p) => p.status === "MENUNGGU");
  const approvedSubmissions = studentSubmissions.filter((p) => p.status === "DISETUJUI");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Banner Utama Clean Navy Universitas Paramadina */}
      <div className="bg-[#005493] text-white rounded-2xl p-6 sm:p-7 shadow-md border border-[#005493] relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-8 pointer-events-none select-none">
          <BookOpen className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-white/15 text-white font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded border border-white/10">
              FAKULTAS ILMU REKAYASA
            </span>
            <span className="text-xs font-mono text-slate-300">
              UNIVERSITAS PARAMADINA
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
            Portal Pelayanan Digital Pengunduran Mata Kuliah. Pantau status persetujuan berkas atau buat pengajuan baru secara transparan.
          </p>
        </div>
      </div>

      {/* Grid Utama: Kartu Layanan Pengajuan Baru (MENONJOL) & Ringkasan Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Kartu Khusus MENONJOL: Buat Pengajuan Baru */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#005493] to-[#163D6D] text-white rounded-2xl p-6 shadow-md border border-[#005493] flex flex-col justify-between space-y-5 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-300">
            <FilePlus className="w-40 h-40 text-white" />
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-xs">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Layanan Digital
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">
                Buat Pengajuan Baru
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed mt-1">
                Ingin mengundurkan mata kuliah semester ini? Klik tombol di bawah untuk mengisi formulir resmi.
              </p>
            </div>
          </div>

          <Link
            href="/pengajuan/baru"
            className="relative z-10 w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#005493] font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all transform group-hover:translate-y-[-1px] cursor-pointer"
          >
            <FilePlus className="w-4 h-4 text-[#005493]" />
            <span>Mulai Pengajuan Baru</span>
            <ArrowRight className="w-4 h-4 text-[#005493]" />
          </Link>
        </div>

        {/* Kartu Khusus 2: 3 Metrik Ringkas */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-semibold">Total Berkas</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-bold text-slate-800">{studentSubmissions.length} <span className="text-xs font-normal text-slate-400">Berkas</span></span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-semibold">Sedang Diproses</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-bold text-amber-600">{pendingSubmissions.length} <span className="text-xs font-normal text-slate-400">Berkas</span></span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-xs font-semibold">Disetujui UPPS</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-600">{approvedSubmissions.length} <span className="text-xs font-normal text-slate-400">Berkas</span></span>
          </div>

          {/* Batas Waktu Ringkas */}
          <div className="sm:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-2 text-slate-700 text-xs">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <p className="text-slate-600 leading-normal">
              <span className="font-bold text-slate-800">Batas Waktu Akademik:</span> Pengajuan disetujui paling lambat **Pertemuan Ke-2**.
            </p>
          </div>

        </div>

      </div>

      {/* HANYA MENAMPILKAN PENGAJUAN AKTIF / SEDANG DIPROSES */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Pengajuan Aktif (Sedang Diproses)
            </h2>
            <p className="text-xs text-slate-500">Berkas yang baru diajukan dan sedang menunggu verifikasi UPPS.</p>
          </div>

          <Link
            href="/riwayat"
            className="text-xs font-bold text-[#005493] hover:underline flex items-center gap-1"
          >
            <History className="w-3.5 h-3.5" />
            <span>Buka Seluruh Riwayat</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500 space-y-2 shadow-xs">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-slate-700">Tidak Ada Pengajuan Aktif</h3>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Saat ini Anda tidak memiliki berkas yang sedang menunggu persetujuan. Untuk melihat berkas yang sudah disetujui/ditolak, buka menu <Link href="/riwayat" className="text-primary-madani font-semibold underline">Riwayat Pengajuan</Link>.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingSubmissions.map((sub) => (
              <PengajuanCard key={sub.id} pengajuan={sub} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
