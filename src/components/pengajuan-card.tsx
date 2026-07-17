import React from "react";
import { Pengajuan } from "../types";
import StatusBadge from "./status-badge";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, Eye } from "lucide-react";

interface PengajuanCardProps {
  pengajuan: Pengajuan;
}

export default function PengajuanCard({ pengajuan }: PengajuanCardProps) {
  const totalSks = pengajuan.daftarMatakuliah.reduce((acc, curr) => acc + curr.sks, 0);
  const courseCount = pengajuan.daftarMatakuliah.length;
  
  // Show list summary: e.g. "Pemrograman Asinkron Node.js, +2 matakuliah lain"
  const mainCourse = pengajuan.daftarMatakuliah[0];
  const summaryText = courseCount > 1 
    ? `${mainCourse.nama} (+${courseCount - 1} mata kuliah lainnya)`
    : mainCourse?.nama || "Tidak ada mata kuliah";

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {pengajuan.id}
            </span>
            <span className="text-xs text-slate-500 block mt-1 font-medium">
              Oleh: {pengajuan.namaMahasiswa} ({pengajuan.nim})
            </span>
          </div>
          <StatusBadge status={pengajuan.status} />
        </div>

        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{summaryText}</span>
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 py-3 border-t border-b border-slate-100 my-3">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-700">Total SKS:</span>
            <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-md font-bold">
              {totalSks} SKS
            </span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{pengajuan.tanggalPengajuan}</span>
          </div>
        </div>

        {pengajuan.catatanAdmin && (
          <div className="bg-rose-50/50 text-rose-800 p-2.5 rounded text-xs border border-rose-100/50 mb-3 leading-relaxed">
            <span className="font-semibold">Catatan Admin:</span> "{pengajuan.catatanAdmin}"
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={`/pengajuan/${pengajuan.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-primary-madani border border-slate-200 font-medium py-1.5 px-3 rounded text-xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Form</span>
          </Link>
          <Link
            href={`/pengajuan/${pengajuan.id}/status`}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white font-medium py-1.5 px-3 rounded text-xs transition-colors cursor-pointer shadow-sm"
          >
            <span>Lacak Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
