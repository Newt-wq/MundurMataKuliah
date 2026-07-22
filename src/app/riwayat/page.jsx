"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PengajuanCard from "@/components/pengajuan-card";
import { SEMESTER_TAHUN_AJARAN } from "@/lib/constants";
import { History, Search, Filter, AlertCircle, FilePlus } from "lucide-react";

export default function RiwayatPage() {
  const { currentUser, pengajuans, isLoading } = useSession();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [semesterFilter, setSemesterFilter] = useState("SEMUA");

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

  // Backend sudah memfilter berdasarkan userId user yang login,
  // jadi tidak perlu filter ulang by NIM di frontend
  const studentSubmissions = pengajuans;

  // Apply filters
  const filteredSubmissions = studentSubmissions.filter((p) => {
    const matchesSearch = !searchQuery || p.daftarMatakuliah?.some((mk) =>
      mk.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mk.kode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesStatus = statusFilter === "SEMUA" || p.status === statusFilter;
    const matchesSemester = semesterFilter === "SEMUA" || p.semester === semesterFilter;

    return matchesSearch && matchesStatus && matchesSemester;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-2">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-primary-madani" />
            <span>Riwayat Pengajuan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh riwayat berkas pengunduran mata kuliah yang telah Anda ajukan.
          </p>
        </div>
        
        {studentSubmissions.length > 0 && (
          <Link
            href="/pengajuan/baru"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white font-semibold text-xs py-2 px-4 rounded shadow-sm transition-colors cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Buat Baru</span>
          </Link>
        )}
      </div>

      {/* Filter and Search Form Control bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari Kode atau Nama Mata Kuliah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded border border-slate-300 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani"
          />
        </div>

        {/* Filter Status */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs rounded border border-slate-300 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani bg-white"
          >
            <option value="SEMUA">Semua Status</option>
            <option value="MENUNGGU">Menunggu</option>
            <option value="DISETUJUI">Disetujui</option>
            <option value="DITOLAK">Ditolak</option>
          </select>
        </div>

        {/* Filter Semester */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full text-xs rounded border border-slate-300 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani bg-white"
          >
            <option value="SEMUA">Semua Semester</option>
            {SEMESTER_TAHUN_AJARAN.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List Results */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">Tidak Ada Hasil</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {studentSubmissions.length === 0 
              ? "Anda belum pernah membuat pengajuan mundur mata kuliah."
              : "Tidak ada pengajuan yang cocok dengan pencarian atau filter Anda."}
          </p>
          {studentSubmissions.length === 0 && (
            <Link
              href="/pengajuan/baru"
              className="inline-flex items-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white font-semibold text-xs py-2 px-4 rounded mt-4 shadow transition-colors cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Buat Pengajuan Pertama</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubmissions.map((sub) => (
            <PengajuanCard key={sub.idPublik || sub._id} pengajuan={sub} />
          ))}
        </div>
      )}

    </div>
  );
}
