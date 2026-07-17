"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import { FcGoogle } from "react-icons/fc";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const { currentUser, login, isLoading } = useSession();
  const router = useRouter();

  // If already logged in, redirect to appropriate page
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [currentUser, router]);

  const handleAdminLogin = () => {
    login("admin");
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 border border-slate-200 rounded-xl shadow-lg">

        {/* Back to student login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-primary-madani transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Login Mahasiswa</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-amber-600" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Portal Admin UPPS
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">
              Unit Pengelola Program Studi &bull; FIR
            </p>
          </div>
        </div>

        {/* Admin disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900">
          <p className="text-[11px] leading-relaxed font-medium">
            Halaman ini hanya untuk staf UPPS Fakultas Ilmu Rekayasa. Gunakan akun Google resmi yang telah terdaftar sebagai admin.
          </p>
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/logo-paramadina.png"
            alt="Logo Universitas Paramadina"
            width={140}
            height={45}
            className="object-contain max-h-10 w-auto opacity-70"
            priority
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>

        {/* Admin Login Button */}
        <div className="space-y-3">
          <button
            onClick={handleAdminLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-amber-50 text-slate-700 border border-amber-300 font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed hover:border-amber-400"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            ) : (
              <FcGoogle className="w-5 h-5 shrink-0" />
            )}
            <span>
              {isLoading ? "Menghubungkan..." : "Masuk sebagai Admin"}
            </span>
          </button>

          <p className="text-[10px] text-center text-slate-400">
            &bull; Akses terbatas &bull; Hanya staf UPPS FIR yang berwenang &bull;
          </p>
        </div>

      </div>
    </div>
  );
}
