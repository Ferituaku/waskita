import MaterialCard from "@/components/dashboard/MaterialCard";
import Pagination from "@/components/dashboard/Pagination";
import TabFilter from "@/components/dashboard/TabFilter";
import Header from "@/components/Header";
import React from "react";

const BerandaPage: React.FC = () => {
  // Mock data for materials
  const materials = [
    {
      category: "Edukasi",
      title: "Memahami HIV/AIDS: Penyebab, Gejala, dan Pencegahan",
      imageUrl: "/tangan.jpg",
    },
    {
      category: "Artikel",
      title: "Mengurangi Stigma: Peran Masyarakat dalam Mendukung ODHA",
      imageUrl: "/hivaids.jpg",
    },
    {
      category: "Video",
      title: "Kisah Inspiratif: Hidup Berkualitas dengan HIV",
      imageUrl: "/hivaids.jpg",
    },
    {
      category: "Edukasi",
      title: "Pentingnya Tes HIV Dini dan Teratur",
      imageUrl: "/tangan.jpg",
    },
    {
      category: "Artikel",
      title: "Mitos dan Fakta seputar Penularan HIV",
      imageUrl: "/tangan.jpg",
    },
    {
      category: "Video",
      title: "Wawancara dengan Aktivis Peduli AIDS",
      imageUrl: "/tangan.jpg",
    },
    {
      category: "Artikel",
      title: "Mitos dan Fakta seputar Penularan HIV",
      imageUrl: "/tangan.jpg",
    },
    {
      category: "Artikel",
      title: "Mitos dan Fakta seputar Penularan HIV",
      imageUrl: "/tangan.jpg",
    },
    {
      category: "Artikel",
      title: "Mitos dan Fakta seputar Penularan HIV",
      imageUrl: "/tangan.jpg",
    },
  ];

  return (
    <>
      <Header title="Beranda" />
      <div className="p-4 md:p-8">
        <section className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Materi Terbaru
          </h2>
          <p className="text-gray-600">
            Jelajahi materi edukasi, artikel, dan video terbaru dari WASKITA.
          </p>
        </section>

        <TabFilter tabs={["Semua", "Edukasi", "Artikel", "Video"]} />

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {materials.map((material, index) => (
            <MaterialCard key={index} {...material} />
          ))}
        </section>

        <Pagination />
      </div>
    </>
  );
};

export default BerandaPage;
