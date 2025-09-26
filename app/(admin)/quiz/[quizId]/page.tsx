"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Pagination from "../../../../components/dashboard/Pagination";
import { ArrowLeft } from "lucide-react";

const mockQuizResults = [
  { id: 1, nama: "Budi Santoso", tanggal: "2025-09-14", nilai: 95 },
  { id: 2, nama: "Ani Lestari", tanggal: "2025-09-14", nilai: 88 },
  { id: 3, nama: "Candra Wijaya", tanggal: "2025-09-15", nilai: 100 },
  { id: 4, nama: "Dewi Anggraini", tanggal: "2025-09-15", nilai: 76 },
  { id: 5, nama: "Eko Prasetyo", tanggal: "2025-09-16", nilai: 92 },
  { id: 6, nama: "Fitri Handayani", tanggal: "2025-09-16", nilai: 85 },
  { id: 7, nama: "Gilang Ramadhan", tanggal: "2025-09-17", nilai: 98 },
];

const QuizDetailPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <Header title="Detail Hasil Quiz" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Hasil Kuis: QUIZ 1: Bahaya AIDS
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan daftar peserta yang telah menyelesaikan kuis.
              </p>
            </div>
            <Link href="/quiz" className="btn btn-ghost">
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-800 font-semibold border-b-2 border-gray-200">
                <tr>
                  <th scope="col" className="p-4 w-12 text-left">
                    No
                  </th>
                  <th scope="col" className="p-4">
                    Nama Peserta
                  </th>
                  <th scope="col" className="p-4">
                    Tanggal Mengerjakan
                  </th>
                  <th scope="col" className="p-4">
                    Nilai
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockQuizResults.map((result, index) => (
                  <tr
                    key={result.id}
                    className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="p-4 font-medium text-gray-800">
                      {result.nama}
                    </td>
                    <td className="p-4 text-gray-600">{result.tanggal}</td>
                    <td className="p-4 font-bold text-blue-600">
                      {result.nilai}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default QuizDetailPage;
