import React from "react";
import Sidebar from "../../components/Sidebar";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "@/hooks/SidebarContext";

export default function DashboardLayout({
  children, // <-- {children} adalah properti ajaibnya
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== 1. SIDEBAR DITAMPILKAN DI SINI ===== */}
      <SidebarProvider>
        <Sidebar />

        <main
          className="flex-1 h-screen overflow-y-auto
            transition-all duration-300"
        >
          {/* ===== 2. KONTEN HALAMAN AKAN DI-RENDER DI SINI ===== */}
          <Toaster position="top-right" reverseOrder={false} />
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
