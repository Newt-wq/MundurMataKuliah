"use client";

import React from "react";
import { useSession } from "@/context/SessionContext";

export default function Footer() {
  const { currentUser } = useSession();

  if (!currentUser) return null;

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-center gap-1.5 text-[11px] text-slate-400">
        <span>
          © {new Date().getFullYear()} Fakultas Ilmu Rekayasa · Universitas Paramadina
        </span>
      </div>
    </footer>
  );
}
