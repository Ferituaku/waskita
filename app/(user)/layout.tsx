// import ChatBot from "@/components/chatbot";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/hooks/SidebarContext";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  // tambahan logic khusus user di sini jika perlu
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===== 1. SIDEBAR DITAMPILKAN DI SINI ===== */}
      <SidebarProvider>
        <Sidebar />

        <main className="flex-1 h-screen overflow-y-auto transition-all duration-300">
          {/* ===== 2. KONTEN HALAMAN AKAN DI-RENDER DI SINI ===== */}
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </main>
        
      </SidebarProvider>
    </div>
  );
}
