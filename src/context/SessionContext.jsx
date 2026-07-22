"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, pengajuanApi } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

const SessionContext = createContext(undefined);

export function SessionProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true saat pertama load untuk cek session
  const [pengajuans, setPengajuans] = useState([]);
  const [pengajuansLoading, setPengajuansLoading] = useState(false);
  const router = useRouter();

  // =====================================================
  // CEK SESSION YANG SUDAH ADA (saat app pertama dibuka)
  // Cookie httpOnly dikirim otomatis, tinggal hit /api/auth/me
  // =====================================================
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authApi.getMe();
        if (response.success) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        // 401 berarti belum login — ini normal, bukan error sebenarnya
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // =====================================================
  // FETCH PENGAJUAN (setelah user login)
  // =====================================================
  const fetchPengajuans = useCallback(async (params = {}) => {
    if (!currentUser) return;
    setPengajuansLoading(true);
    try {
      const response = await pengajuanApi.getAll(params);
      if (response.success) {
        setPengajuans(response.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data pengajuan:", error.message);
    } finally {
      setPengajuansLoading(false);
    }
  }, [currentUser]);

  // Auto-fetch pengajuan setiap kali user berubah (login/logout)
  useEffect(() => {
    if (currentUser) {
      fetchPengajuans();
    } else {
      setPengajuans([]);
    }
  }, [currentUser, fetchPengajuans]);

  // =====================================================
  // LOGIN – Redirect ke Google OAuth
  // (window.location.href ke /api/auth/google)
  // =====================================================
  const login = () => {
    setIsLoading(true);
    authApi.loginWithGoogle();
    // Halaman akan redirect ke Google, loading state akan reset saat kembali
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error.message);
    } finally {
      setCurrentUser(null);
      setPengajuans([]);
      router.push("/login");
    }
  };

  // =====================================================
  // SET USER SETELAH OAUTH CALLBACK
  // Dipanggil dari halaman yang menerima redirect dari backend
  // =====================================================
  const fetchAndSetUser = async () => {
    try {
      const response = await authApi.getMe();
      if (response.success) {
        setCurrentUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error.message);
      return null;
    }
  };

  // =====================================================
  // CREATE PENGAJUAN (Async/Await + Promise)
  // =====================================================
  const createPengajuan = async (formData) => {
    if (!currentUser || currentUser.role !== "mahasiswa") {
      throw new Error("Hanya mahasiswa yang dapat membuat pengajuan.");
    }

    const response = await pengajuanApi.create(formData);
    if (response.success) {
      // Tambahkan ke state lokal tanpa perlu refetch
      setPengajuans((prev) => [response.data, ...prev]);
      return response.data;
    }
    throw new Error(response.message || "Gagal membuat pengajuan.");
  };

  // =====================================================
  // UPDATE STATUS PENGAJUAN
  // =====================================================
  const updatePengajuanStatus = async (id, status, catatan = null) => {
    const response = await pengajuanApi.updateStatus(id, status, catatan);
    if (response.success) {
      // Update state lokal - match by idPublik ATAU _id untuk keamanan
      setPengajuans((prev) =>
        prev.map((item) =>
          item.idPublik === id || String(item._id) === String(id)
            ? { ...item, ...response.data }
            : item
        )
      );
      return response.data;
    }
    throw new Error(response.message || "Gagal update status.");
  };

  // =====================================================
  // BATALKAN PENGAJUAN (Mahasiswa)
  // =====================================================
  const cancelPengajuan = async (id) => {
    try {
      const result = await updatePengajuanStatus(id, "DIBATALKAN");
      return result;
    } catch (error) {
      console.error("Gagal membatalkan pengajuan:", error.message);
      throw error;
    }
  };

  // =====================================================
  // DEV LOGIN (Testing tanpa Google OAuth)
  // =====================================================
  const devLogin = async (role = "mahasiswa") => {
    setIsLoading(true);
    try {
      const response = await authApi.devLogin(role);
      if (response.success) {
        setCurrentUser(response.data);
        if (response.data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Dev login error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        isLoading,
        pengajuans,
        pengajuansLoading,
        login,
        devLogin,
        logout,
        createPengajuan,
        updatePengajuanStatus,
        cancelPengajuan,
        fetchPengajuans,
        fetchAndSetUser,
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
