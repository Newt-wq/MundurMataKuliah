"use client";

import React, { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { WA_HOTLINE_DISPLAY, WA_HOTLINE_NUMBER, createWaHotlineUrl } from "@/lib/constants";
import { MessageSquare, X, Send, Headphones, ExternalLink, ShieldCheck } from "lucide-react";

export default function WhatsappHotline() {
  const { currentUser } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const userName = currentUser.name || "Mahasiswa";
  const userNim = currentUser.nim ? `(NIM: ${currentUser.nim})` : "";

  // Template pesan bantuan cepat
  const quickTemplates = [
    {
      label: "Tanya Status Pengajuan",
      desc: "Cek progres berkas administrasi Anda",
      message: `Halo Admin UPPS FIR Paramadina, saya ${userName} ${userNim} ingin menanyakan status pengajuan mundur mata kuliah saya.`
    },
    {
      label: "Konsultasi Tenggat Pertemuan Ke-2",
      desc: "Tanya batas waktu & ketentuan SKS",
      message: `Halo Admin UPPS FIR, saya ${userName} ingin berkonsultasi mengenai batas waktu pertemuan ke-2 dan syarat pengunduran mata kuliah.`
    },
    {
      label: "Bantuan Kendala Pengisian",
      desc: "Kesulitan teknis saat buat formulir",
      message: `Halo Admin UPPS FIR, saya ${userName} mengalami kendala saat mengisi formulir pengajuan di portal.`
    }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end print:hidden">

      {/* Popover Box Hotline */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">

          {/* Header Popover - Theme WhatsApp Emerald / FIR Navy */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-inner font-black text-sm">
                  FIR
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  <span>Hotline UPPS FIR</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span>Universitas Paramadina</span>
                  <span>•</span>
                  <span className="text-emerald-200 font-medium">Online</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Tutup hotline"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Popover */}
          <div className="p-4 space-y-3 bg-slate-50/50">

            {/* Info Message Box */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pusat Bantuan & Layanan Cepat</span>
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Hubungi Admin UPPS FIR secara langsung melalui WhatsApp hotline di <span className="font-bold font-mono">{WA_HOTLINE_DISPLAY}</span>.
              </p>
            </div>

            {/* Quick Template Buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Pilih Topik Pertanyaan:
              </span>

              {quickTemplates.map((t, idx) => (
                <a
                  key={idx}
                  href={createWaHotlineUrl(t.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl p-2.5 transition-all flex items-center justify-between group cursor-pointer block"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {t.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{t.desc}</p>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 ml-2" />
                </a>
              ))}
            </div>

            {/* Direct Open WhatsApp Button */}
            <a
              href={createWaHotlineUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer mt-1"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.595-1.152 4.205 4.316-1.133 1.58 1.002z" />
              </svg>
              <span>Chat WhatsApp Langsung</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

          </div>

          {/* Footer popover */}
          <div className="bg-slate-100 px-4 py-2 text-center text-[10px] text-slate-400 border-t border-slate-200">
            Jam Layanan: Senin - Jumat, 08.00 - 16.00 WIB
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
        title="WhatsApp Hotline UPPS FIR"
      >
        {/* Pulsing indicator dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-white"></span>
        </span>

        {/* WhatsApp Icon (Menggunakan gambar /images/whatsapp.png jika ada, atau fallback ke ikon SVG) */}
        <img
          src="/images/WhatsApp.png"
          alt="WhatsApp Hotline"
          className="w-6 h-6 object-contain"
          onError={(e) => {
            // Fallback ke SVG jika file /images/whatsapp.png belum ditaruh
            e.target.style.display = "none";
            const parent = e.target.parentElement;
            if (parent && !parent.querySelector("svg.wa-fallback-svg")) {
              const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              svg.setAttribute("class", "w-6 h-6 fill-current wa-fallback-svg");
              svg.setAttribute("viewBox", "0 0 24 24");
              svg.innerHTML = '<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.999 1.595-1.152 4.205 4.316-1.133 1.58 1.002z"/>';
              parent.appendChild(svg);
            }
          }}
        />

        <span className="hidden sm:inline font-bold text-xs tracking-tight">
          Hotline UPPS
        </span>
      </button>

    </div>
  );
}
