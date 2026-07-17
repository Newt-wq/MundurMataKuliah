"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Pengajuan, Role, PengajuanStatus } from "../types";
import { MOCK_USERS, MOCK_PENGAJUAN_INIT } from "../lib/mock-data";
import { useRouter } from "next/navigation";

interface SessionContextType {
  currentUser: User | null;
  isLoading: boolean;
  pengajuans: Pengajuan[];
  login: (role: Role) => Promise<void>;
  logout: () => void;
  createPengajuan: (
    alamat: string,
    alasan: string,
    daftarMatakuliah: Array<{ kode: string; nama: string; sks: number }>
  ) => Pengajuan;
  updatePengajuanStatus: (id: string, status: PengajuanStatus, catatan?: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pengajuans, setPengajuans] = useState<Pengajuan[]>(MOCK_PENGAJUAN_INIT);
  const router = useRouter();

  // Load session from localStorage if exists (just to make refreshes friendly, though in-memory React state is requested, localStorage makes dev much nicer!)
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
  const savePengajuans = (newPengajuans: Pengajuan[]) => {
    setPengajuans(newPengajuans);
    localStorage.setItem("mock_pengajuans", JSON.stringify(newPengajuans));
  };

  const login = async (role: Role) => {
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

  const createPengajuan = (
    alamat: string,
    alasan: string,
    daftarMatakuliah: Array<{ kode: string; nama: string; sks: number }>
  ) => {
    if (!currentUser || currentUser.role !== "mahasiswa") {
      throw new Error("Hanya mahasiswa yang dapat membuat pengajuan.");
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const newId = `REQ-${yyyy}-${String(pengajuans.length + 1).padStart(3, "0")}`;

    const newPengajuan: Pengajuan = {
      id: newId,
      nim: currentUser.nim,
      namaMahasiswa: currentUser.name,
      prodi: currentUser.prodi,
      semester: currentUser.semester,
      alamat,
      alasan,
      tanggalPengajuan: formattedDate,
      daftarMatakuliah,
      status: "MENUNGGU",
      updatedAt: today.toISOString()
    };

    const updated = [newPengajuan, ...pengajuans];
    savePengajuans(updated);
    return newPengajuan;
  };

  const updatePengajuanStatus = (id: string, status: PengajuanStatus, catatan?: string) => {
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

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        isLoading,
        pengajuans,
        login,
        logout,
        createPengajuan,
        updatePengajuanStatus
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
