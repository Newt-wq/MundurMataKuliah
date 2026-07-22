"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  LogOut, 
  History, 
  LayoutDashboard, 
  Info, 
  ShieldCheck, 
  ChevronDown,
  CheckCircle2
} from "lucide-react";

export default function Navbar() {
  const { currentUser, logout, login } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If not logged in, don't show navigation bar
  if (!currentUser) return null;

  const isStudent = currentUser.role === "mahasiswa";

  const studentLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/prosedur", label: "Prosedur", icon: Info },
    { href: "/riwayat", label: "Riwayat Pengajuan", icon: History },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard Admin", icon: LayoutDashboard },
    { href: "/admin/pengajuan", label: "Daftar Pengajuan", icon: ShieldCheck },
  ];

  const isAdminRoute = pathname.startsWith("/admin");
  const links = isAdminRoute ? adminLinks : studentLinks;

  const toggleMenu = () => setIsOpen(!isOpen);

  // Get User Initials (e.g. "Budi Santoso" -> "BS")
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-[#005493] border-b border-slate-800 text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand Group */}
          <div className="flex items-center space-x-3">
            <Link href={isStudent ? "/" : "/admin"} className="flex items-center">
              <div className="relative h-10 flex items-center">
                <Image
                  src="/images/image.png"
                  alt="Logo Paramadina"
                  width={130}
                  height={40}
                  className="object-contain max-h-10 w-auto"
                  priority
                  onError={(e) => {
                    e.target.style.display = "none";
                    const parent = e.target.parentElement;
                    if (parent) {
                      const fallback = document.createElement("span");
                      fallback.className = "text-white font-black text-lg tracking-wider";
                      fallback.innerText = "PARAMADINA";
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white font-bold backdrop-blur-md shadow-inner border border-white/10"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-300" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Clean Modern Desktop User Profile & Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-1.5 rounded-full transition-all cursor-pointer backdrop-blur-md shadow-xs group"
            >
              {/* Avatar Circle with Initials */}
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(currentUser.name)}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#005493]" />
              </div>

              <div className="text-left leading-none">
                <span className="text-xs font-bold text-white block max-w-[130px] truncate transition-colors">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-slate-300 font-mono">
                  {currentUser.role === "admin" ? "Admin UPPS" : currentUser.nim}
                </span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                showProfileMenu ? "rotate-180 text-white" : ""
              }`} />
            </button>

            {/* Dropdown Popover: Info Pengguna & Tombol Logout */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                
                {/* Popover Header Info */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#005493] text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                      {getInitials(currentUser.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{currentUser.email || `${currentUser.nim}@paramadina.ac.id`}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-[9px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{currentUser.role === "admin" ? "Admin UPPS FIR" : "Mahasiswa Aktif FIR"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popover Footer: Tombol Keluar (Logout) */}
                <div className="p-2 bg-white">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none cursor-pointer"
            >
              <span className="sr-only">Buka Menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-[#005493] border-t border-white/10 px-3 pt-2 pb-4 space-y-2 sm:px-3 shadow-xl">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-white/15 text-white font-bold"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 text-slate-300" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <hr className="border-white/10 my-3" />

          {/* Mobile User Profile */}
          <div className="px-3 py-2 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {getInitials(currentUser.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-300 font-mono">
                {currentUser.role === "admin" ? "Admin UPPS FIR" : currentUser.nim}
              </p>
            </div>
          </div>

          {/* Mobile Logout */}
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-300 hover:bg-rose-950/30 hover:text-rose-200 cursor-pointer transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      )}
    </nav>
  );
}
