"use client";

import React, { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { KATALOG_MATA_KULIAH } from "@/lib/constants";
import { Plus, Trash2, AlertCircle } from "lucide-react";

export default function MataKuliahTable() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "daftarMatakuliah",
  });

  const watchFields = watch("daftarMatakuliah") || [];

  // Automatically calculate sum of SKS
  const totalSks = watchFields.reduce((acc: number, curr: { sks?: number | string }) => {
    const val = Number(curr?.sks) || 0;
    return acc + val;
  }, 0);

  // Auto-fill when a course is chosen from catalog
  const handleCatalogSelect = (index: number, selectedCode: string) => {
    if (!selectedCode) return;
    
    const course = KATALOG_MATA_KULIAH.find((c) => c.kode === selectedCode);
    if (course) {
      setValue(`daftarMatakuliah.${index}.kode`, course.kode);
      setValue(`daftarMatakuliah.${index}.nama`, course.nama);
      setValue(`daftarMatakuliah.${index}.sks`, course.sks);
    }
  };

  // Add initial row if empty
  useEffect(() => {
    if (fields.length === 0) {
      append({ kode: "", nama: "", sks: "" });
    }
  }, [fields.length, append]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Daftar Mata Kuliah yang Diundurkan
          </h3>
          <p className="text-xs text-slate-500">
            Pilih mata kuliah dari katalog untuk pengisian otomatis, atau isi secara manual.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append({ kode: "", nama: "", sks: 3 })}
          className="inline-flex items-center gap-1 bg-primary-madani hover:bg-primary-madani-dark text-white text-xs font-semibold py-1.5 px-3 rounded shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Baris</span>
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm min-h-[220px] w-full max-w-full">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-12 text-center">
                No
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">
                Pilih Mata Kuliah / Kode
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nama Mata Kuliah
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-24">
                SKS
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {fields.map((field, index) => {
              const rowErrors = (errors.daftarMatakuliah as any)?.[index];
              const currentKode = watchFields[index]?.kode || "";

              return (
                <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Row No */}
                  <td className="px-4 py-3 text-center text-slate-600 font-medium">
                    {index + 1}
                  </td>

                  {/* Code selection/manual input */}
                  <td className="px-4 py-3 space-y-1">
                    <select
                      onChange={(e) => handleCatalogSelect(index, e.target.value)}
                      value={KATALOG_MATA_KULIAH.some(c => c.kode === currentKode) ? currentKode : ""}
                      className="w-full text-xs rounded border border-slate-300 bg-white p-1.5 focus:outline-none focus:ring-1 focus:ring-primary-madani"
                    >
                      <option value="">-- Cari di Katalog --</option>
                      {KATALOG_MATA_KULIAH.map((c) => (
                        <option key={c.kode} value={c.kode}>
                          {c.kode} - {c.nama}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Kode MK (Manual)"
                      {...register(`daftarMatakuliah.${index}.kode` as const)}
                      className={`w-full text-xs rounded border p-1.5 focus:outline-none focus:ring-1 focus:ring-primary-madani ${
                        rowErrors?.kode ? "border-red-400 bg-red-50/20" : "border-slate-300"
                      }`}
                    />
                    {rowErrors?.kode && (
                      <span className="text-[10px] text-red-500 block">{rowErrors.kode.message}</span>
                    )}
                  </td>

                  {/* Course Name */}
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Nama Lengkap Mata Kuliah"
                      {...register(`daftarMatakuliah.${index}.nama` as const)}
                      className={`w-full text-xs rounded border p-1.5 focus:outline-none focus:ring-1 focus:ring-primary-madani ${
                        rowErrors?.nama ? "border-red-400 bg-red-50/20" : "border-slate-300"
                      }`}
                    />
                    {rowErrors?.nama && (
                      <span className="text-[10px] text-red-500 block">{rowErrors.nama.message}</span>
                    )}
                  </td>

                  {/* SKS */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      placeholder="SKS"
                      min={1}
                      max={6}
                      {...register(`daftarMatakuliah.${index}.sks` as const, { valueAsNumber: true })}
                      className={`w-full text-xs rounded border p-1.5 focus:outline-none focus:ring-1 focus:ring-primary-madani ${
                        rowErrors?.sks ? "border-red-400 bg-red-50/20" : "border-slate-300"
                      }`}
                    />
                    {rowErrors?.sks && (
                      <span className="text-[10px] text-red-500 block">{rowErrors.sks.message}</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className={`p-1.5 rounded transition-colors ${
                        fields.length === 1
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-400 hover:text-red-500 hover:bg-slate-100 cursor-pointer"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* Total SKS Row */}
            <tr className="bg-slate-50 font-semibold text-slate-800">
              <td colSpan={3} className="px-4 py-3 text-right">
                Total SKS yang Diundurkan:
              </td>
              <td colSpan={2} className="px-4 py-3 text-left">
                <span className="bg-primary-madani text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                  {totalSks} SKS
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {(errors.daftarMatakuliah as any)?.root && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium bg-red-50 p-2.5 rounded border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{(errors.daftarMatakuliah as any).root.message}</span>
        </div>
      )}

    </div>
  );
}
