"use client";

import MaterialCard from "@/components/dashboard/MaterialCard";
import Pagination from "@/components/dashboard/Pagination";
import TabFilter from "@/components/dashboard/TabFilter";
import Header from "@/components/Header";
import React, { useState } from "react";

const BerandaPage: React.FC = () => {
  // Mock data for materials
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
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
  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const paginatedMaterials = materials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {paginatedMaterials.map((material, index) => (
            <MaterialCard key={index} {...material} />
          ))}
        </section>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default BerandaPage;
