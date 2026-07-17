"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import { FcGoogle } from "react-icons/fc";
import { Loader2, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { currentUser, login, isLoading } = useSession();
  const router = useRouter();

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
    // Halaman ini hanya untuk mahasiswa
    login("mahasiswa");
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border border-slate-200 rounded-xl shadow-lg">
        
        {/* Header Section with single landscape Paramadina logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/images/logo-paramadina.png"
              alt="Logo Universitas Paramadina"
              width={180}
              height={60}
              className="object-contain max-h-14 w-auto"
              priority
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Portal Mundur Mata Kuliah
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">
              Fakultas Ilmu Rekayasa &bull; Universitas Paramadina
            </p>
          </div>
        </div>

        {/* Info & Rules banner */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
          <p className="text-[11px] leading-relaxed text-slate-500">
            Gunakan akun email Google Institusional Universitas Paramadina untuk masuk ke layanan administrasi akademik.
          </p>
        </div>

        {/* Login Area */}
        <div className="space-y-4 pt-2">
          {/* Official Google Button style */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-3 px-4 rounded-lg text-sm transition-all shadow-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed hover:border-slate-400"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            ) : (
              <FcGoogle className="w-5 h-5 shrink-0" />
            )}
            <span>
              {isLoading ? "Menghubungkan Google..." : "Masuk dengan Google"}
            </span>
          </button>

          <p className="text-[10px] text-center text-slate-400">
            &bull; Layanan Terintegrasi Google Workspace Universitas Paramadina &bull;
          </p>
        </div>

        {/* Link ke halaman login admin */}
        <div className="border-t border-slate-100 pt-4 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-primary-madani transition-colors"
          >
            <BookOpen className="w-3 h-3" />
            <span>Login sebagai Admin UPPS</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
