"use client";

import React, { useEffect } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import StepperForm from "@/components/stepper-form";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BaruPengajuanPage() {
  const { currentUser, isLoading } = useSession();
  const router = useRouter();

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

  return (
    <div className="max-w-3xl mx-auto space-y-6 w-full min-w-0">
      
      {/* Back button and page title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-2">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-primary-madani font-medium transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 animate-in fade-in slide-in-from-left duration-200">
            <FileText className="w-6 h-6 text-primary-madani" />
            <span>Formulir Mundur Mata Kuliah</span>
          </h1>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs text-slate-500 font-semibold block">Layanan Digital</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-100 rounded-full">
            Autofill Aktif (Akun Google)
          </span>
        </div>
      </div>

      {/* Multi-step form wizard */}
      <StepperForm />

    </div>
  );
}
