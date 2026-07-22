"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS, MOCK_PENGAJUAN_INIT } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

const SessionContext = createContext(undefined);

export function SessionProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pengajuans, setPengajuans] = useState(MOCK_PENGAJUAN_INIT);
  const router = useRouter();

  // Load session from localStorage if exists
  useEffect(() => {
    const savedUser = localStorage.getItem("mock_session_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved session", e);
      }
    }
    const savedPengajuans = localStorage.getItem("mock_pengajuans");
    if (savedPengajuans) {
      try {
        setPengajuans(JSON.parse(savedPengajuans));
      } catch (e) {
        console.error("Failed to parse saved applications", e);
      }
    }
  }, []);

  // Synchronize pengajuans to localStorage for demo persistence
  const savePengajuans = (newPengajuans) => {
    setPengajuans(newPengajuans);
    localStorage.setItem("mock_pengajuans", JSON.stringify(newPengajuans));
  };

  const login = async (role) => {
    setIsLoading(true);
    // Simulate 1.5 seconds Google OAuth loading
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const user = role === "mahasiswa" ? MOCK_USERS.mahasiswa : MOCK_USERS.admin;
    setCurrentUser(user);
    localStorage.setItem("mock_session_user", JSON.stringify(user));
    setIsLoading(false);

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("mock_session_user");
    router.push("/login");
  };

  const createPengajuan = (formData) => {
    if (!currentUser || currentUser.role !== "mahasiswa") {
      throw new Error("Hanya mahasiswa yang dapat membuat pengajuan.");
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const newId = `REQ-${yyyy}-${String(pengajuans.length + 1).padStart(3, "0")}`;

    const newPengajuan = {
      id: newId,
      nim: formData.nim || currentUser.nim,
      namaMahasiswa: formData.namaMahasiswa || currentUser.name,
      prodi: formData.prodi || currentUser.prodi,
      semester: formData.semester || currentUser.semester,
      alamat: formData.alamat || "",
      alasan: formData.alasan || "",
      tanggalPengajuan: formattedDate,
      daftarMatakuliah: formData.daftarMatakuliah || [],
      status: "MENUNGGU",
      updatedAt: today.toISOString()
    };

    const updated = [newPengajuan, ...pengajuans];
    savePengajuans(updated);
    return newPengajuan;
  };

  const updatePengajuanStatus = (id, status, catatan) => {
    const updated = pengajuans.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status,
          catatanAdmin: catatan || item.catatanAdmin,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    savePengajuans(updated);
  };

  const cancelPengajuan = (id) => {
    const updated = pengajuans.map((item) => {
      if (item.id === id && item.status === "MENUNGGU") {
        return {
          ...item,
          status: "DIBATALKAN",
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    savePengajuans(updated);
  };

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        isLoading,
        pengajuans,
        login,
        logout,
        createPengajuan,
        updatePengajuanStatus,
        cancelPengajuan
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
