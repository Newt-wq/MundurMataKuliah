"use client";

import React, { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { Check, X, AlertCircle } from "lucide-react";

export default function ApprovalActions({ pengajuan, onSuccess }) {
  const { updatePengajuanStatus } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleApprove = async () => {
    if (window.confirm("Apakah Anda yakin ingin menyetujui pengajuan mundur mata kuliah ini?")) {
      setIsSubmitting(true);
      try {
        const reqId = pengajuan.idPublik || pengajuan._id;
        await updatePengajuanStatus(reqId, "DISETUJUI", "ACC UPPS. Berkas dan ketentuan memenuhi syarat.");
        if (onSuccess) onSuccess();
      } catch (error) {
        alert(`Gagal menyetujui: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setErrorText("Alasan penolakan wajib diisi.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const reqId = pengajuan.idPublik || pengajuan._id;
      await updatePengajuanStatus(reqId, "DITOLAK", rejectReason.trim());
      setShowRejectModal(false);
      setRejectReason("");
      setErrorText("");
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrorText(`Gagal menolak: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pengajuan.status !== "MENUNGGU") {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Pengajuan ini telah diproses pada tanggal{" "}
          <span className="font-semibold text-slate-700">
            {new Date(pengajuan.updatedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold text-slate-800">
              Tindakan Persetujuan Admin UPPS
            </h4>
            <p className="text-xs text-slate-500">
              Tinjau seluruh data pengajuan sebelum memberikan keputusan.
            </p>
          </div>

          <div className="flex w-full sm:w-auto gap-3">
            <button
              onClick={() => {
                setErrorText("");
                setShowRejectModal(true);
              }}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Tolak</span>
            </button>
            <button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? <span>Memproses...</span> : <span>Setujui (ACC)</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal Backdrop Overlay */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
              <h3 className="text-sm font-bold tracking-wide">
                Konfirmasi Penolakan Pengajuan
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Alasan Penolakan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (e.target.value.trim()) setErrorText("");
                  }}
                  placeholder="Contoh: Pengajuan ditolak karena SKS minimal semester ini tidak terpenuhi atau melewati batas tanggal pertemuan ke-2."
                  className="w-full text-xs rounded border border-slate-300 p-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani resize-none"
                />
                {errorText && (
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorText}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  disabled={isSubmitting}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Mengirim..." : "Tolak Pengajuan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
