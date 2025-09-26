"use client";
import Header from "@/components/Header";
import VideoCard from "@/components/dashboard/VideoCard";
import Image from "next/image";

const ApaItuWPAPage: React.FC = () => {
  return (
    <>
      <Header title="Apa Itu WPA?" />
      <div className="p-4 md:p-8 bg-[#eeeeee] min-h-screen">
        <section className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <Image
                src="/stop-aids.jpg"
                alt="HIV/AIDS Awareness"
                width={600}
                height={400}
                className="rounded-lg  object-cover w-full"
              />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Apa Itu WPA (Warga Peduli AIDS)?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Warga Peduli AIDS (WPA) adalah sekelompok anggota masyarakat
                yang secara sukarela dan sadar berperan aktif dalam upaya
                pencegahan dan penanggulangan HIV/AIDS di lingkungannya. Mereka
                menjadi ujung tombak dalam memberikan informasi yang benar,
                mengurangi stigma, dan memberikan dukungan kepada Orang dengan
                HIV/AIDS (ODHA).
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Keberadaan WPA sangat penting untuk membangun lingkungan yang
                kondusif dan suportif, di mana setiap orang dapat mengakses
                informasi, layanan tes, dan pengobatan tanpa rasa takut atau
                diskriminasi.
              </p>
            </div>
          </div>
        </section>
        <section>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            Video Penjelasan Tentang WPA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <VideoCard
              thumbnailUrl="/hiv-awareness.png"
              title="Memahami Peran WPA di Masyarakat"
            />
            <VideoCard
              thumbnailUrl="/hiv-awareness.png"
              title="Langkah-langkah Menjadi WPA"
            />
            <VideoCard
              thumbnailUrl="/hiv-awareness.png"
              title="Kisah Inspiratif dari WPA"
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ApaItuWPAPage;
