"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { Loader2 } from "lucide-react";

/**
 * Halaman OAuth Callback
 *
 * Backend akan redirect ke halaman ini setelah Google OAuth berhasil.
 * Tugas halaman ini:
 * 1. Ambil data user dari backend (cookie sudah di-set oleh backend)
 * 2. Redirect ke dashboard yang sesuai berdasarkan role
 */
export default function AuthCallbackPage() {
  const { fetchAndSetUser } = useSession();
  const router = useRouter();
  const hasFetched = useRef(false); // Cegah double fetch karena StrictMode

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const handleCallback = async () => {
      try {
        const user = await fetchAndSetUser();
        if (user) {
          if (user.role === "admin") {
            router.replace("/admin");
          } else {
            router.replace("/");
          }
        } else {
          router.replace("/login?error=session_not_found");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        router.replace("/login?error=auth_failed");
      }
    };

    handleCallback();
  }, [fetchAndSetUser, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#005493]" />
      <p className="text-slate-600 font-medium text-sm">
        Memverifikasi akun Google Anda...
      </p>
    </div>
  );
}
