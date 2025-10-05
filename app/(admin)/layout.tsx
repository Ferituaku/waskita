import React from "react";
import Sidebar from "../../components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children, // <-- {children} adalah properti ajaibnya
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== 1. SIDEBAR DITAMPILKAN DI SINI ===== */}
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto">
        {/* ===== 2. KONTEN HALAMAN AKAN DI-RENDER DI SINI ===== */}
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </main>
    </div>
  );
}
