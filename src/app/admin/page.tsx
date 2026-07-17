"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import { ShieldAlert, Users, Clock, CheckCircle2, AlertTriangle, ArrowRight, Eye, Calendar } from "lucide-react";

export default function AdminDashboard() {
  const { currentUser, pengajuans, isLoading } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

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

  // Calculate Metrics
  const totalRequests = pengajuans.length;
  const pendingRequests = pengajuans.filter((p) => p.status === "MENUNGGU");
  const approvedRequests = pengajuans.filter((p) => p.status === "DISETUJUI");
  const rejectedRequests = pengajuans.filter((p) => p.status === "DITOLAK");

  // Get recent 4 pending items
  const recentPending = pendingRequests.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="bg-amber-600 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
            Panel Administrator
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Layanan peninjauan berkas digitalisasi pengajuan mundur mata kuliah Fakultas Ilmu Rekayasa. Gunakan panel ini untuk memeriksa data mahasiswa dan memberikan ACC/Tolak.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-5 flex items-center pr-8 pointer-events-none">
          <ShieldAlert className="w-48 h-48" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Total */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Total Pengajuan</span>
            <span className="text-lg font-bold text-slate-850">{totalRequests} Berkas</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Menunggu ACC</span>
            <span className="text-lg font-bold text-slate-850">{pendingRequests.length} Berkas</span>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Disetujui</span>
            <span className="text-lg font-bold text-slate-850">{approvedRequests.length} Berkas</span>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Ditolak</span>
            <span className="text-lg font-bold text-slate-850">{rejectedRequests.length} Berkas</span>
          </div>
        </div>

      </div>

      {/* Grid: Pending Actions List vs Info Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Actions list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Menunggu Peninjauan Segera ({pendingRequests.length})
            </h3>
            <Link
              href="/admin/pengajuan"
              className="text-xs text-primary-madani font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Semua Berkas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentPending.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold">Kerja Bagus! Tidak ada pengajuan baru yang tertunda.</p>
              <p className="text-[10px] text-slate-400 mt-1">Semua permohonan mundur matakuliah mahasiswa telah diproses.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100 overflow-hidden">
              {recentPending.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/50 flex items-center justify-between gap-4 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{item.id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{item.tanggalPengajuan}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      {item.namaMahasiswa} ({item.nim}) - {item.prodi}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      Mata kuliah: {item.daftarMatakuliah.map(c => `${c.nama} (${c.sks} SKS)`).join(", ")}
                    </p>
                  </div>
                  
                  <Link
                    href={`/admin/pengajuan/${item.id}`}
                    className="inline-flex items-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white font-semibold py-1.5 px-3 rounded text-[11px] transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Tinjau</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info/Warning block */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Kalender & Ketentuan FIR
          </h3>
          
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4 text-xs">
            <div className="flex gap-2.5 items-start">
              <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Pertemuan Ke-2 Akademik:</span>
                <p className="text-slate-500 leading-relaxed mt-0.5">
                  Berdasarkan kalender akademik Universitas Paramadina, tenggat pengajuan mundur semester Ganjil 2025/2026 adalah **14 September 2025**.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-[11px] text-slate-600 leading-relaxed border border-slate-100">
              <span className="font-bold text-slate-700 block mb-0.5">Aturan Penolakan Admin:</span>
              Jika pengajuan dikirimkan lewat dari tanggal tersebut, admin UPPS **wajib menolak** berkas pengajuan tersebut dan memberikan alasan tertulis yang jelas.
            </div>

            <Link
              href="/admin/pengajuan"
              className="w-full inline-flex items-center justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded text-xs transition-colors cursor-pointer text-center"
            >
              Kelola Semua Pengajuan
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
