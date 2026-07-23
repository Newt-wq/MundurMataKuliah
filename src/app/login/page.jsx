"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import { FcGoogle } from "react-icons/fc";
import { Loader2, Info, CheckCircle2, XCircle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Inner component — menggunakan useSearchParams, wajib dibungkus Suspense
function LoginPageInner() {
  const { currentUser, login, isLoading } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginError, setLoginError] = useState(null);

  // Deteksi error dari redirect backend (query param ?error=...)
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "domain_not_allowed") {
      setLoginError(
        "Akses ditolak! Akun Google Anda tidak terdaftar sebagai civitas akademika Universitas Paramadina. Pastikan Anda menggunakan email @students.paramadina.ac.id atau @paramadina.ac.id."
      );
    } else if (error === "auth_failed") {
      setLoginError(
        "Login gagal! Terjadi kesalahan saat proses autentikasi Google. Silakan coba lagi."
      );
    }
  }, [searchParams]);

  // If already logged in, redirect away
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [currentUser, router]);

  const handleGoogleLogin = () => {
    login("mahasiswa");
  };


  return (
    <div className="flex-1 flex justify-center items-center py-10 px-4 sm:px-6 bg-white min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 grid grid-cols-1 md:grid-cols-2 min-h-[500px]">

        {/* Left Column: Campus Building Banner */}
        <div className="relative hidden md:flex flex-col justify-end p-8 text-white overflow-hidden bg-slate-900">
          <Image
            src="/images/GedungKampus.png"
            alt="Gedung Universitas Paramadina"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 space-y-1.5">
            <span className="text-emerald-400 font-extrabold text-[11px] uppercase tracking-widest block">
              SELAMAT DATANG
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              Pengajuan Mundur Mata Kuliah
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Fakultas Ilmu Rekayasa &bull; Universitas Paramadina
            </p>
          </div>
        </div>

        {/* Right Column: Clean Layout + Info & Syarat Mundur Mata Kuliah */}
        <div className="p-7 sm:p-10 flex flex-col justify-between space-y-5 bg-white my-auto">

          {/* Header Logo & Subtitle */}
          <div className="space-y-3.5 text-center">
            <div className="flex justify-center">
              <img
                src="/images/logo-paramadina.png"
                alt="Logo Universitas Paramadina"
                className="object-contain max-h-14 w-auto"
              />
            </div>

            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-xs mx-auto">
              Silakan masuk untuk melanjutkan ke akun Anda.
            </p>
          </div>

          {/* Error Alert Popup — Muncul saat login gagal (domain tidak diizinkan) */}
          {loginError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-rose-800 mb-0.5">Login Gagal</p>
                <p className="text-[11px] text-rose-700 leading-relaxed">{loginError}</p>
              </div>
              <button
                onClick={() => setLoginError(null)}
                className="shrink-0 text-rose-400 hover:text-rose-600 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Enriched Info Callout: Syarat & Ketentuan Pengajuan */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#005493]">
              <Info className="w-4 h-4 text-[#005493] shrink-0" />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                Ketentuan & Syarat Mundur Matakuliah
              </span>
            </div>

            <ul className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Batas akhir permohonan dilakukan <strong className="text-slate-800">sebelum Pertemuan Ke-2</strong> perkuliahan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Telah berkonsultasi &amp; disetujui oleh <strong className="text-slate-800">Dosen PA &amp; Orang Tua/Wali</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Wajib menggunakan akun email resmi <strong className="text-[#005493]">@students.paramadina.ac.id</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Minimal GSuite Google Button matching screenshot */}
          <div className="space-y-2.5">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-[#005493] font-bold py-3.5 px-5 rounded-2xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#005493]" />
              ) : (
                <FcGoogle className="w-5 h-5 shrink-0" />
              )}
              <span>
                {isLoading ? "Menghubungkan..." : "Masuk dengan Google (GSuite Paramadina)"}
              </span>
            </button>


          </div>

          {/* Footer branding */}
          <div className="text-center border-t border-slate-100 pt-3">
            <span className="text-[10px] text-slate-400 font-medium">
              &bull; Layanan Terintegrasi FIR Universitas Paramadina &bull;
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

// Export utama — membungkus LoginPageInner dengan Suspense (wajib untuk useSearchParams)
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#005493]" />
      </div>
    }>
      <LoginPageInner />
    </Suspense>
  );
}
