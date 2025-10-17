"use client";

import Header from "@/components/Header";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Youtube, ExternalLink, Loader2 } from "lucide-react";

interface VideoEdukasi {
  id: number;
  judul: string;
  link: string;
  tanggal_ditambahkan: string;
}

const ApaItuWPAPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoEdukasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/videos');
        const result = await response.json();
        
        if (result.success) {
          setVideos(result.data);
        } else {
          setError("Gagal memuat video");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat video");
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle video click - open in new tab
  const handleVideoClick = (videoLink: string) => {
    window.open(videoLink, '_blank', 'noopener,noreferrer');
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <Header title="Apa Itu WPA?" />
      <div className="min-h-screen bg-slate-50 px-5 py-6 md:px-8 md:py-10">
        <section className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 px-6 py-6 md:px-10 md:py-10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <Image
                src="/stop-aids.jpg"
                alt="HIV/AIDS Awareness"
                width={600}
                height={400}
                className="rounded-xl object-cover w-full"
              />
            </div>

            <div className="md:col-span-2">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
                Apa Itu WPA (Warga Peduli AIDS)?
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Warga Peduli AIDS (WPA) adalah sekelompok anggota masyarakat
                yang secara sukarela dan sadar berperan aktif dalam upaya
                pencegahan dan penanggulangan HIV/AIDS di lingkungannya. Mereka
                menjadi ujung tombak dalam memberikan informasi yang benar,
                mengurangi stigma, dan memberikan dukungan kepada Orang dengan
                HIV/AIDS (ODHA).
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Keberadaan WPA sangat penting untuk membangun lingkungan yang
                kondusif dan suportif, di mana setiap orang dapat mengakses
                informasi, layanan tes, dan pengobatan tanpa rasa takut atau
                diskriminasi.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-6">
            Video Penjelasan Tentang WPA
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Memuat video...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Youtube size={32} className="text-red-400" />
                </div>
                <p className="text-slate-600 font-medium">Belum ada video tersedia</p>
                <p className="text-slate-400 text-sm">Video akan ditampilkan setelah ditambahkan</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video.link)}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
                    <Youtube size={64} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-3 right-3">
                      <ExternalLink size={20} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <p className="text-xs font-semibold text-red-600">Video Edukasi</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {video.judul}
                    </h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(video.tanggal_ditambahkan)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ApaItuWPAPage;