"use client";
import React from "react";
import { FileUp, FileText, Video } from "lucide-react";
import { ShortcutCard } from "@/components/dashboard/shortcut-card";
import Header from "@/components/Header";

export default function AdminDashboardPage() {
  return (
    <>
      {/* Header */}
      <Header title="Dashboard" />
      <div className="min-h-screen bg-slate-50 px-5 py-6 md:px-8 md:py-10">
        {/* Quick Actions */}
        <section aria-labelledby="quick-actions-title" className="space-y-4">
          <h2
            id="quick-actions-title"
            className="text-2xl font-semibold text-gray-800"
          >
            Selamat Datang, Admin!
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ShortcutCard
              title="Unggah Materi"
              description="Tambah materi baru, atur kategori, dan kelola dokumen/berkas."
              href="/materi"
              icon={FileUp}
            />
            <ShortcutCard
              title="Buat Quiz"
              description="Rancang pertanyaan, atur tingkat kesulitan, dan publikasikan."
              href="/quiz"
              icon={FileText}
            />
            <ShortcutCard
              title="Video Edukasi"
              description="Sematkan tautan video edukasi dan kelola playlist."
              href="/video-edukasi"
              icon={Video}
            />
          </div>
        </section>
      </div>
    </>
  );
}
