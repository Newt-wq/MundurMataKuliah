import React from "react";
import { PengajuanStatus } from "../types";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: PengajuanStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgClass = "";
  let textClass = "";
  let icon = null;
  let text = "";

  switch (status) {
    case "MENUNGGU":
      bgClass = "bg-amber-50 border-amber-200 text-amber-800";
      textClass = "text-amber-800";
      icon = <Clock className="w-3.5 h-3.5 mr-1" />;
      text = "Menunggu Persetujuan";
      break;
    case "DISETUJUI":
      bgClass = "bg-emerald-50 border-emerald-200 text-emerald-800";
      textClass = "text-emerald-800";
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      text = "Disetujui";
      break;
    case "DITOLAK":
      bgClass = "bg-rose-50 border-rose-200 text-rose-800";
      textClass = "text-rose-800";
      icon = <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      text = "Ditolak";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${bgClass}`}
    >
      {icon}
      <span>{text}</span>
    </span>
  );
}
