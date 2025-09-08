"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpenText,
  ClipboardCheck,
  Youtube,
  RefreshCw,
  LogOut,
} from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/apa-itu-wpa", label: "Apa itu WPA", icon: RefreshCw },
  { href: "/materi", label: "Materi", icon: BookOpenText },
  { href: "/quiz", label: "Quiz", icon: ClipboardCheck },
  { href: "/video-edukasi", label: "Video Edukasi", icon: Youtube },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-[#5C110E] text-white w-72 flex-shrink-0 flex-col min-h-screen hidden md:flex">
      <div className="p-2 border-b border-white/20">
        <div className="flex justify-center">
          <Image
            src="/logo-waskitabystophiva(putih).png"
            alt="Waskita Logo"
            width={180}
            height={60}
            priority
          />
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-black/25 text-white"
                  : "text-gray-200 hover:bg-red-950/80 hover:text-white"
              }`}
            >
              <Icon className="w-6 h-6 mr-4" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-6 mt-auto border-t border-white/20">
        <Link
          href="/login" // Or a logout endpoint
          className="flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-200 hover:bg-red-950/80 hover:text-white"
        >
          <LogOut className="w-6 h-6 mr-4" />
          <span className="font-medium">Keluar</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
