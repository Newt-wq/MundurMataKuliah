"use client";

import React, { useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PengajuanCard from "@/components/pengajuan-card";
import { FilePlus, BookOpen, AlertCircle, Clock, Calendar, CheckSquare } from "lucide-react";

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
  const pendingSubmissions = studentSubmissions.filter((p) => p.status === "MENUNGGU");
  const processedSubmissions = studentSubmissions.filter((p) => p.status !== "MENUNGGU");

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-primary-madani text-white rounded-xl p-6 shadow-md border border-primary-madani-dark relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-amber-500 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
            Portal Akademik FIR
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            Layanan digitalisasi permohonan mundur mata kuliah Fakultas Ilmu Rekayasa, Universitas Paramadina. Pantau status pengajuan atau ajukan permohonan baru.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <BookOpen className="w-48 h-48" />
        </div>
      </div>

      {/* Deadline Notice Callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-slate-700">
        <div className="flex items-start sm:items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-800">Peringatan Batas Waktu Akademik:</span>
            <p className="text-slate-600">Pengunduran mata kuliah paling lambat disetujui pada **Pertemuan Ke-2** perkuliahan semester berjalan.</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto self-stretch sm:self-center">
          <Link
            href="/prosedur"
            className="flex-1 sm:flex-initial text-center bg-white hover:bg-slate-50 border border-amber-200 text-amber-800 font-semibold px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
          >
            Pelajari Prosedur
          </Link>
          <Link
            href="/pengajuan/baru"
            className="flex-1 sm:flex-initial text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            Ajukan Sekarang
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary-madani">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-semibold block">Total Pengajuan</span>
            <span className="text-lg font-bold text-slate-800">{studentSubmissions.length} Berkas</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-semibold block">Menunggu Review</span>
            <span className="text-lg font-bold text-slate-800">{pendingSubmissions.length} Berkas</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-500 text-xs font-semibold block">Tahun Akademik</span>
            <span className="text-sm font-bold text-slate-800">{currentUser.semester || "Semester Berjalan"}</span>
          </div>
        </div>
      </div>

      {/* Active Submissions section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Pengajuan Aktif / Diproses
          </h3>
          {studentSubmissions.length > 0 && (
            <Link href="/riwayat" className="text-xs text-primary-madani font-semibold hover:underline">
              Lihat Semua Riwayat
            </Link>
          )}
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-500">
            <FilePlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium">Tidak ada pengajuan aktif yang sedang menunggu persetujuan.</p>
            <Link
              href="/pengajuan/baru"
              className="inline-flex items-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white font-semibold text-xs py-2 px-4 rounded mt-4 shadow transition-colors cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Buat Pengajuan Baru</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingSubmissions.map((sub) => (
              <PengajuanCard key={sub.id} pengajuan={sub} />
            ))}
          </div>
        )}
      </div>

      {/* Processed Submissions section */}
      {processedSubmissions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Riwayat Keputusan Terakhir
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedSubmissions.slice(0, 3).map((sub) => (
              <PengajuanCard key={sub.id} pengajuan={sub} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
