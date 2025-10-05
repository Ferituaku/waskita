"use client";
import Header from "@/components/Header";
import VideoCard from "@/components/dashboard/VideoCard";
import Image from "next/image";

const ApaItuWPAPage: React.FC = () => {
  return (
    <>
      <Header title="Apa Itu WPA?" />
      {/* Menggunakan warna dari sistem Tailwind untuk konsistensi */}
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
              {/* 1. Terapkan font-display untuk judul utama */}
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
                {" "}
                Apa Itu WPA (Warga Peduli AIDS)?
              </h2>
              {/* 2. Sedikit menggelapkan warna teks untuk kontras yang lebih baik */}
              <p className="text-slate-600 leading-relaxed">
                {" "}
                Warga Peduli AIDS (WPA) adalah sekelompok anggota masyarakat
                yang secara sukarela dan sadar berperan aktif dalam upaya
                pencegahan dan penanggulangan HIV/AIDS di lingkungannya. Mereka
                menjadi ujung tombak dalam memberikan informasi yang benar,
                mengurangi stigma, dan memberikan dukungan kepada Orang dengan
                HIV/AIDS (ODHA).
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                {" "}
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
            {" "}
            Video Penjelasan Tentang WPA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <VideoCard
              thumbnailUrl="/hiv-awareness.png"
              title="Understanding the Role of WPA in Society"
            />
            <VideoCard
              thumbnailUrl="/hiv-awareness.png"
              title="Steps to Becoming a WPA"
            />
            <VideoCard
              thumbnailUrl="/hiv-awareness.png"
              title="Inspirational Stories from WPAs"
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ApaItuWPAPage;
