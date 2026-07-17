"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/context/SessionContext";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, FileText, History, LayoutDashboard, Info, User } from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // If not logged in, don't show the navigation bar
  if (!currentUser) return null;

  const isStudent = currentUser.role === "mahasiswa";

  const studentLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/prosedur", label: "Prosedur", icon: Info },
    { href: "/pengajuan/baru", label: "Ajukan Baru", icon: FileText },
    { href: "/riwayat", label: "Riwayat", icon: History },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard Admin", icon: LayoutDashboard },
    { href: "/admin/pengajuan", label: "Daftar Pengajuan", icon: FileText },
  ];

  const links = isStudent ? studentLinks : adminLinks;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-primary-madani border-b border-primary-madani-dark text-white shadow-md sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
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
                    // Fallback to text UP if image fails
                    (e.target as HTMLElement).style.display = "none";
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement("span");
                      fallback.className = "text-primary-madani font-bold text-lg";
                      fallback.innerText = "PARAMADINA";
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-madani-dark text-white shadow-inner"
                      : "text-slate-100 hover:bg-primary-madani-dark hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Profile & Logout Action */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-white block max-w-[150px] truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-300 block">
                {currentUser.role === "admin" ? "Admin UPPS FIR" : currentUser.nim}
              </span>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-primary-madani-dark border border-slate-400 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>

            <button
              onClick={logout}
              title="Keluar dari Sistem"
              className="flex items-center space-x-1 text-slate-200 hover:text-red-400 font-medium text-sm transition-colors cursor-pointer border border-transparent hover:border-red-400/20 px-2 py-1.5 rounded"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-primary-madani-dark focus:outline-none cursor-pointer"
            >
              <span className="sr-only">Buka Menu</span>
              {isOpen ? <X className="block h-6 h-6" /> : <Menu className="block h-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-primary-madani-dark border-t border-primary-madani px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-primary-madani text-white"
                    : "text-slate-200 hover:bg-primary-madani hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <hr className="border-slate-600 my-2" />

          {/* Mobile User Profile */}
          <div className="px-3 py-2 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-primary-madani flex items-center justify-center text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[200px]">{currentUser.name}</p>
              <p className="text-xs text-slate-300">
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
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-base font-medium text-red-300 hover:bg-red-950/20 hover:text-red-400 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      )}
    </nav>
  );
}
