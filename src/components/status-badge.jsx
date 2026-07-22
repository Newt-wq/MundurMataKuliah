import React from "react";
import { Clock, CheckCircle2, XCircle, Ban } from "lucide-react";

export default function StatusBadge({ status }) {
  let bgClass = "";
  let icon = null;
  let text = "";

  switch (status) {
    case "MENUNGGU":
      bgClass = "bg-amber-100/90 border-amber-300 text-amber-900 font-bold";
      icon = <Clock className="w-3.5 h-3.5 mr-1 text-amber-700" />;
      text = "Menunggu Persetujuan";
      break;
    case "DISETUJUI":
      bgClass = "bg-emerald-100 border-emerald-300 text-emerald-900 font-bold shadow-xs";
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-700" />;
      text = "Disetujui UPPS";
      break;
    case "DITOLAK":
      bgClass = "bg-rose-100 border-rose-300 text-rose-900 font-bold shadow-xs";
      icon = <XCircle className="w-3.5 h-3.5 mr-1 text-rose-700" />;
      text = "Ditolak UPPS";
      break;
    case "DIBATALKAN":
      bgClass = "bg-slate-100 border-slate-300 text-slate-600 font-medium";
      icon = <Ban className="w-3.5 h-3.5 mr-1 text-slate-500" />;
      text = "Dibatalkan Pemohon";
      break;
    default:
      bgClass = "bg-slate-50 border-slate-200 text-slate-700";
      text = status || "Unknown";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${bgClass}`}
    >
      {icon}
      <span>{text}</span>
    </span>
  );
}
