"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROSEDUR_MUNDUR, EMAIL_UPPS } from "@/lib/constants";
import { BookOpen, AlertCircle, ShieldAlert, ArrowRight, HelpCircle, Mail } from "lucide-react";

export default function ProsedurPage() {
  const { currentUser, isLoading } = useSession();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-madani" />
          <span>Prosedur Pengunduran Diri Mata Kuliah</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Fakultas Ilmu Rekayasa (FIR) &bull; Universitas Paramadina
        </p>
      </div>

      {/* Rules list card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-4">
          <h3 className="text-sm font-bold tracking-wide uppercase">
            Ketentuan & Kebijakan Akademik
          </h3>
        </div>
        
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 gap-4">
            {PROSEDUR_MUNDUR.map((rule, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-600 items-start">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-primary-madani font-bold flex items-center justify-center shrink-0 border border-slate-200">
                  {idx + 1}
                </span>
                <p className="flex-1 pt-0.5">{rule}</p>
              </div>
            ))}
          </div>

          {/* Info callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-slate-700">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-800">Biaya Kuliah (Disclaimer):</span>
              <p className="text-slate-600">
                Segala bentuk pembayaran biaya kuliah yang sudah disetorkan untuk mata kuliah yang diundurkan **tidak dapat dikembalikan atau dijadikan deposit** untuk semester berikutnya.
              </p>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex gap-3 text-slate-700">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-rose-800">Dampak Beban SKS:</span>
              <p className="text-slate-600">
                SKS mata kuliah yang diundurkan **tidak dihitung** dalam batas beban SKS semester berjalan, dan Anda harus mengulang mata kuliah tersebut di semester mendatang.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-primary-madani border border-slate-200 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hubungi UPPS FIR</h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Ada kendala berkas? Kirim aduan ke email resmi sekretariat:{" "}
              <a href={`mailto:${EMAIL_UPPS}`} className="text-primary-madani font-semibold hover:underline">
                {EMAIL_UPPS}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation & Form Link */}
      {currentUser.role === "mahasiswa" && (
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="rounded border-slate-300 text-primary-madani focus:ring-primary-madani focus:outline-none w-5 h-5 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700 select-none">
              Saya memahami ketentuan di atas dan siap mengajukan.
            </span>
          </label>

          <Link
            href="/pengajuan/baru"
            onClick={(e) => {
              if (!isChecked) {
                e.preventDefault();
                alert("Silakan centang persetujuan memahami ketentuan terlebih dahulu.");
              }
            }}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 font-bold py-2.5 px-6 rounded text-xs transition-all shadow-sm ${
              isChecked
                ? "bg-primary-madani hover:bg-primary-madani-dark text-white cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            <span>Ajukan Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
}
