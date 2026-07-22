"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { 
  step1Schema, 
  step2Schema, 
  step3Schema, 
  step4Schema, 
  pengajuanFormSchema
} from "@/lib/validations";
import { PROSEDUR_MUNDUR } from "@/lib/constants";
import MataKuliahTable from "./mata-kuliah-table";
import { ChevronRight, ChevronLeft, Send, CheckCircle, User, BookOpen, FileText, AlertTriangle } from "lucide-react";

export default function StepperForm() {
  const { currentUser, createPengajuan } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [konfirmasiReview, setKonfirmasiReview] = useState(false);

  // Smooth scroll to top on step change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const methods = useForm({
    resolver: zodResolver(
      step === 1 ? step1Schema :
      step === 2 ? step2Schema :
      step === 3 ? step3Schema :
      step === 4 ? step4Schema : 
      pengajuanFormSchema
    ),
    defaultValues: {
      namaMahasiswa: currentUser?.name || "",
      nim: currentUser?.nim || "",
      prodi: currentUser?.prodi || "",
      semester: currentUser?.semester || "",
      alamat: currentUser?.alamat || "",
      daftarMatakuliah: [{ kode: "", nama: "", sks: 3 }],
      alasan: "",
      setujuKetentuan: false,
      diketahuiPA: false
    },
    mode: "onChange",
  });

  const { register, trigger, getValues, handleSubmit, formState: { errors } } = methods;

  // Track the steps description
  const stepsList = [
    { title: "Ketentuan", desc: "Persetujuan Prosedur" },
    { title: "Data Diri", desc: "Autofill & Alamat" },
    { title: "Mata Kuliah", desc: "Pilih MK & SKS" },
    { title: "Alasan", desc: "Alasan Pengunduran" },
    { title: "Review", desc: "Konfirmasi Akhir" }
  ];

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ["setujuKetentuan"];
    } else if (step === 2) {
      fieldsToValidate = ["namaMahasiswa", "nim", "prodi", "semester", "alamat"];
    } else if (step === 3) {
      fieldsToValidate = ["daftarMatakuliah"];
    } else if (step === 4) {
      fieldsToValidate = ["alasan", "diketahuiPA"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    if (step !== 5) return;

    setIsSubmitting(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    try {
      const newRequest = createPengajuan(data);
      setIsSubmitting(false);
      // Redirect to status tracking page
      router.push(`/pengajuan/${newRequest.id}/status`);
    } catch (e) {
      setIsSubmitting(false);
      alert("Gagal mengirimkan pengajuan. Silakan coba lagi.");
    }
  };

  const values = getValues();
  const totalSks = values.daftarMatakuliah?.reduce((acc, curr) => acc + (Number(curr?.sks) || 0), 0) || 0;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Stepper Header Progress Indicator */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-5 sm:px-6">
        <div className="hidden sm:block relative">
          {/* Background connecting line */}
          <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
          
          {/* Active progress line */}
          <div 
            className="absolute top-4 left-[10%] h-[2px] bg-emerald-500 -translate-y-1/2 transition-all duration-300 z-0"
            style={{ 
              width: `${((step - 1) / (stepsList.length - 1)) * 80}%` 
            }}
          />

          {/* Stepper items row */}
          <div className="relative flex justify-between items-start w-full z-10">
            {stepsList.map((s, idx) => {
              const stepNum = idx + 1;
              const isCompleted = step > stepNum;
              const isActive = step === stepNum;

              return (
                <div key={s.title} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isActive
                        ? "bg-primary-madani text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : stepNum}
                  </div>

                  <div className="text-center mt-2 px-1 max-w-[120px]">
                    <p
                      className={`text-xs font-semibold leading-tight ${
                        isActive ? "text-primary-madani" : "text-slate-500"
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View Steps Progress */}
        <div className="sm:hidden flex justify-between items-center text-xs">
          <span className="font-semibold text-primary-madani">Langkah {step} dari {stepsList.length}</span>
          <span className="text-slate-500 font-medium">{stepsList[step - 1].title} ({stepsList[step - 1].desc})</span>
          <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary-madani h-1.5 transition-all duration-300"
              style={{ width: `${(step / stepsList.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 5) {
              handleSubmit(onSubmit)(e);
            }
          }}
          onKeyDown={(e) => {
            // Mencegah submit otomatis dengan tombol Enter di seluruh langkah form
            if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
              e.preventDefault();
            }
          }}
          className="w-full max-w-full overflow-hidden p-5 sm:p-6 min-h-[460px] flex flex-col justify-between space-y-6"
        >
          
          {/* STEP 1: LANDING & PROSEDUR */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300 min-h-[320px] w-full max-w-full overflow-hidden">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-slate-700">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-amber-800">PERHATIAN PENTING SEBELUM MENGAJUKAN:</h4>
                  <p>Pastikan Anda telah membaca dan memahami seluruh ketentuan mundur mata kuliah yang berlaku resmi di Universitas Paramadina.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Ketentuan Resmi Prosedur Mundur Mata Kuliah
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 pl-4 list-decimal">
                  {PROSEDUR_MUNDUR.map((rule, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("setujuKetentuan")}
                    className="mt-0.5 rounded border-slate-300 text-primary-madani focus:ring-primary-madani focus:outline-none w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs text-slate-600 select-none leading-relaxed">
                    <span className="font-bold text-slate-800">Saya memahami dan menyetujui ketentuan di atas.</span>
                    <p className="text-[10px] text-slate-400">Dengan mencentang ini, saya menyetujui bahwa SKS yang diundurkan tidak dihitung, uang SKS tidak dikembalikan, dan pengajuan ini telah diketahui Dosen PA.</p>
                  </div>
                </label>
                {errors.setujuKetentuan && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1.5">{errors.setujuKetentuan.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DATA DIRI */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300 min-h-[320px] w-full max-w-full overflow-hidden">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs leading-relaxed text-slate-600">
                Silakan periksa dan lengkapi Data Diri Anda secara manual di bawah ini.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Nama Mahasiswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    {...register("namaMahasiswa")}
                    className={`w-full text-xs rounded border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani ${
                      errors.namaMahasiswa ? "border-red-400 bg-red-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.namaMahasiswa && (
                    <p className="text-[11px] text-red-500 font-semibold">{errors.namaMahasiswa.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    NIM <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 120224001"
                    {...register("nim")}
                    className={`w-full text-xs rounded border p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-primary-madani ${
                      errors.nim ? "border-red-400 bg-red-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.nim && (
                    <p className="text-[11px] text-red-500 font-semibold">{errors.nim.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Program Studi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Teknik Informatika"
                    {...register("prodi")}
                    className={`w-full text-xs rounded border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani ${
                      errors.prodi ? "border-red-400 bg-red-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.prodi && (
                    <p className="text-[11px] text-red-500 font-semibold">{errors.prodi.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Semester / Tahun Ajaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Semester Ganjil 2025/2026"
                    {...register("semester")}
                    className={`w-full text-xs rounded border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani ${
                      errors.semester ? "border-red-400 bg-red-50/20" : "border-slate-300"
                    }`}
                  />
                  {errors.semester && (
                    <p className="text-[11px] text-red-500 font-semibold">{errors.semester.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Alamat Lengkap (Saat Ini) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Masukkan alamat lengkap, kelurahan, kecamatan, kota, dan kode pos"
                  {...register("alamat")}
                  className={`w-full text-xs rounded border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani resize-none ${
                    errors.alamat ? "border-red-400 bg-red-50/20" : "border-slate-300"
                  }`}
                />
                {errors.alamat && (
                  <p className="text-[11px] text-red-500 font-semibold">{errors.alamat.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: MATA KULIAH */}
          {step === 3 && (
            <div className="animate-in fade-in duration-300 min-h-[320px] w-full max-w-full overflow-hidden">
              <MataKuliahTable />
            </div>
          )}

          {/* STEP 4: ALASAN */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300 min-h-[320px] w-full max-w-full overflow-hidden">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Alasan Mundur Mata Kuliah <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Berikan alasan yang jelas dan objektif mengapa Anda mengundurkan diri dari mata kuliah ini..."
                  {...register("alasan")}
                  className={`w-full text-xs rounded border p-2.5 focus:outline-none focus:ring-1 focus:ring-primary-madani resize-none ${
                    errors.alasan ? "border-red-400 bg-red-50/20" : "border-slate-300"
                  }`}
                />
                {errors.alasan && (
                  <p className="text-[11px] text-red-500 font-semibold">{errors.alasan.message}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("diketahuiPA")}
                    className="mt-0.5 rounded border-slate-300 text-primary-madani focus:ring-primary-madani focus:outline-none w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs text-slate-600 select-none leading-relaxed">
                    <span className="font-bold text-slate-800">Saya memastikan telah berkonsultasi dan diketahui oleh Dosen PA.</span>
                    <p className="text-[10px] text-slate-400">Persetujuan tertulis / lisan dari Dosen Pembimbing Akademik wajib dikantongi mahasiswa sebelum mengajukan secara digital ke UPPS.</p>
                  </div>
                </label>
                {errors.diketahuiPA && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1.5">{errors.diketahuiPA.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW / SUBMIT */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-300 text-xs min-h-[320px] w-full max-w-full overflow-hidden">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 font-semibold">
                Silakan periksa kembali semua data di bawah sebelum melakukan submit akhir.
              </div>

              {/* Data Diri Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-primary-madani font-bold border-b border-slate-200 pb-1.5 uppercase tracking-wider text-[10px]">
                  <User className="w-4 h-4 shrink-0" />
                  <span>Informasi Pemohon</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex justify-between md:justify-start gap-2">
                    <span className="text-slate-500 w-32 shrink-0">Nama Lengkap:</span>
                    <span className="font-semibold text-slate-800">{values.namaMahasiswa}</span>
                  </div>
                  <div className="flex justify-between md:justify-start gap-2">
                    <span className="text-slate-500 w-32 shrink-0">NIM Mahasiswa:</span>
                    <span className="font-mono font-semibold text-slate-800">{values.nim}</span>
                  </div>
                  <div className="flex justify-between md:justify-start gap-2">
                    <span className="text-slate-500 w-32 shrink-0">Program Studi:</span>
                    <span className="font-semibold text-slate-800">{values.prodi}</span>
                  </div>
                  <div className="flex justify-between md:justify-start gap-2">
                    <span className="text-slate-500 w-32 shrink-0">Semester/TA:</span>
                    <span className="font-semibold text-slate-800">{values.semester}</span>
                  </div>
                  <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-1 md:gap-2">
                    <span className="text-slate-500 w-32 shrink-0">Alamat Lengkap:</span>
                    <span className="font-semibold text-slate-800 leading-relaxed md:flex-1">{values.alamat}</span>
                  </div>
                </div>
              </div>

              {/* Mata Kuliah Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-primary-madani font-bold border-b border-slate-200 pb-1.5 uppercase tracking-wider text-[10px]">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Daftar Mata Kuliah Diundurkan</span>
                </div>
                <div className="overflow-hidden border border-slate-200 rounded bg-white">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-100/60 font-semibold text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-center w-12">No</th>
                        <th className="px-3 py-2 text-left">Kode</th>
                        <th className="px-3 py-2 text-left">Nama Mata Kuliah</th>
                        <th className="px-3 py-2 text-center w-20">SKS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {values.daftarMatakuliah?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 text-center text-slate-500">{idx + 1}</td>
                          <td className="px-3 py-2 font-mono font-medium text-slate-700">{item.kode}</td>
                          <td className="px-3 py-2 text-slate-800">{item.nama}</td>
                          <td className="px-3 py-2 text-center font-semibold text-slate-800">{item.sks}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold text-slate-800">
                        <td colSpan={3} className="px-3 py-2 text-right">Total SKS Diundurkan:</td>
                        <td className="px-3 py-2 text-center text-primary-madani">{totalSks} SKS</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alasan Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5 text-primary-madani font-bold border-b border-slate-200 pb-1.5 uppercase tracking-wider text-[10px]">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Alasan Pengajuan & Konfirmasi</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">Alasan Pengunduran:</span>
                    <p className="bg-white p-2.5 rounded border border-slate-200 text-slate-800 leading-relaxed italic">
                      "{values.alasan}"
                    </p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-2 rounded flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-[10px]">Pengajuan telah disetujui/diketahui oleh Dosen Pembimbing Akademik (PA) terkait.</span>
                  </div>
                </div>
              </div>

              {/* Box Konfirmasi Akhir Manual */}
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg flex items-start gap-2.5 shadow-sm">
                <input
                  type="checkbox"
                  id="konfirmasiReviewCheck"
                  checked={konfirmasiReview}
                  onChange={(e) => setKonfirmasiReview(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400 text-primary-madani focus:ring-primary-madani w-4 h-4 cursor-pointer"
                />
                <label htmlFor="konfirmasiReviewCheck" className="text-xs text-amber-900 font-bold select-none cursor-pointer leading-relaxed">
                  Saya telah mereview seluruh berkas di atas dan mengonfirmasi bahwa data yang saya isikan sudah benar dan siap dikirimkan. <span className="text-rose-600">*</span>
                </label>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between items-center pt-5 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold py-2 px-4 rounded text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white font-semibold py-2 px-4 rounded text-xs transition-colors shadow-sm cursor-pointer"
              >
                <span>Lanjut</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!konfirmasiReview || isSubmitting}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded text-xs transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? <span>Mengirimkan...</span> : <span>Kirim Pengajuan</span>}
              </button>
            )}
          </div>

        </form>
      </FormProvider>
    </div>
  );
}
