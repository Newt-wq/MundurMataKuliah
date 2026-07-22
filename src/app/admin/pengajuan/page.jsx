"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import { PROGRAM_STUDI, SEMESTER_TAHUN_AJARAN } from "@/lib/constants";
import { FileText, Search, Filter, AlertCircle, Eye, ArrowLeft, ArrowUpDown } from "lucide-react";

export default function AdminPengajuanListPage() {
  const { currentUser, pengajuans, isLoading } = useSession();
  const router = useRouter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [prodiFilter, setProdiFilter] = useState("SEMUA");
  const [semesterFilter, setSemesterFilter] = useState("SEMUA");
  
  // Sorting: newest (true) vs oldest (false)
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return (
      <div className="flex-1 flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-madani" />
      </div>
    );
  }

  // Apply filters
  const filtered = pengajuans.filter((p) => {
    const idStr = p.idPublik || p._id?.toString() || "";
    const matchesSearch = !searchQuery ||
      (p.namaMahasiswa || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nim || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      idStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "SEMUA" || p.status === statusFilter;
    const matchesProdi = prodiFilter === "SEMUA" || p.prodi === prodiFilter;
    const matchesSemester = semesterFilter === "SEMUA" || p.semester === semesterFilter;

    return matchesSearch && matchesStatus && matchesProdi && matchesSemester;
  });

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    return sortNewest ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-madani font-medium transition-colors mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dashboard Admin</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-madani" />
          <span>Kelola Semua Pengajuan</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar seluruh berkas pengunduran diri mata kuliah mahasiswa Fakultas Ilmu Rekayasa.
        </p>
      </div>

      {/* Advanced Filter and Control panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Query */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Cari NIM, Nama, atau ID Pengajuan..."
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

          {/* Sorting button toggler */}
          <button
            onClick={() => setSortNewest(!sortNewest)}
            type="button"
            className="flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded text-xs transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Urutkan: {sortNewest ? "Terbaru" : "Terlama"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
          {/* Filter Prodi */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
            <select
              value={prodiFilter}
              onChange={(e) => setProdiFilter(e.target.value)}
              className="w-full text-xs rounded border border-slate-300 pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani bg-white"
            >
              <option value="SEMUA">Semua Program Studi</option>
              {PROGRAM_STUDI.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
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
      </div>

      {/* Submissions Data Table */}
      {sorted.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">Hasil Kosong</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Tidak ada data pengajuan mundur matakuliah yang sesuai dengan filter atau kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-center w-12">No</th>
                  <th className="px-4 py-3">ID / Tanggal</th>
                  <th className="px-4 py-3">Mahasiswa</th>
                  <th className="px-4 py-3">Prodi & Semester</th>
                  <th className="px-4 py-3 text-center">SKS</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sorted.map((item, index) => {
                  const totalSks = item.daftarMatakuliah?.reduce((acc, curr) => acc + (Number(curr?.sks) || 0), 0) || 0;
                  return (
                    <tr key={item.idPublik || item._id} className="hover:bg-slate-50/50 transition-colors">
                      {/* No */}
                      <td className="px-4 py-3 text-center text-slate-500 font-medium">{index + 1}</td>
                      
                      {/* ID & Date */}
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-slate-800 block">{item.idPublik || item._id}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.tanggalPengajuan}</span>
                      </td>

                      {/* Student info */}
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        <span>{item.namaMahasiswa}</span>
                        <span className="text-[10px] text-slate-400 block font-mono font-normal">{item.nim}</span>
                      </td>

                      {/* Program Study & Semester */}
                      <td className="px-4 py-3 leading-relaxed">
                        <span>{item.prodi}</span>
                        <span className="text-[10px] text-slate-400 block">{item.semester}</span>
                      </td>

                      {/* SKS counter */}
                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {totalSks} SKS
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/pengajuan/${item.idPublik || item._id}`}
                          className="inline-flex items-center gap-1.5 bg-primary-madani hover:bg-primary-madani-dark text-white font-semibold py-1.5 px-3 rounded text-[11px] transition-colors cursor-pointer shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tinjau</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-slate-500 text-[10px] flex items-center justify-between">
            <span>Menampilkan {sorted.length} dari {filtered.length} berkas yang terfilter.</span>
            <span>Total Database: {pengajuans.length} Berkas</span>
          </div>
        </div>
      )}

    </div>
  );
}
