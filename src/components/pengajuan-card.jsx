import React from "react";
import StatusBadge from "./status-badge";
import Link from "next/link";
import { BookOpen, ArrowRight, Eye } from "lucide-react";

export default function PengajuanCard({ pengajuan }) {
  const reqId = pengajuan.idPublik || pengajuan.id || pengajuan._id;
  const totalSks = pengajuan.daftarMatakuliah?.reduce((acc, curr) => acc + (Number(curr?.sks) || 0), 0) || 0;
  const courseCount = pengajuan.daftarMatakuliah?.length || 0;
  
  // Show list summary: e.g. "Pemrograman Asinkron Node.js, +2 matakuliah lain"
  const mainCourse = pengajuan.daftarMatakuliah?.[0];
  const summaryText = courseCount > 1 
    ? `${mainCourse?.nama} (+${courseCount - 1} mata kuliah lainnya)`
    : mainCourse?.nama || "Tidak ada mata kuliah";

  const isApproved = pengajuan.status === "DISETUJUI";
  const isRejected = pengajuan.status === "DITOLAK";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              #{reqId}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Tanggal: {pengajuan.tanggalPengajuan}
            </span>
          </div>
          <StatusBadge status={pengajuan.status} />
        </div>

        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed flex items-start gap-1.5">
          <BookOpen className="w-4 h-4 text-primary-madani shrink-0 mt-0.5" />
          <span>{summaryText}</span>
        </h4>

        <div className="flex items-center justify-between text-xs text-slate-500 py-2 border-t border-b border-slate-100">
          <span className="font-semibold text-slate-700">Total SKS:</span>
          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
            {totalSks} SKS
          </span>
        </div>

        {/* Catatan Admin Dinamis */}
        {pengajuan.catatanAdmin && (
          <div className={`p-2.5 rounded-lg text-xs border leading-relaxed ${
            isApproved 
              ? "bg-emerald-50 text-emerald-900 border-emerald-200" 
              : isRejected 
              ? "bg-rose-50 text-rose-900 border-rose-200"
              : "bg-slate-50 text-slate-800 border-slate-200"
          }`}>
            <span className="font-bold">Catatan Admin UPPS:</span> "{pengajuan.catatanAdmin}"
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
        <Link
          href={`/pengajuan/${reqId}`}
          className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Lihat Form</span>
        </Link>
        <Link
          href={`/pengajuan/${reqId}/status`}
          className="flex-1 inline-flex items-center justify-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
        >
          <span>Lacak Status</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
