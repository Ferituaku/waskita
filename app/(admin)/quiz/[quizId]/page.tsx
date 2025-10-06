"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Pagination from "@/components/dashboard/Pagination";
import SkeletonTable from "@/components/SkeletonTable";
import { ArrowLeft } from "lucide-react";
import type { Judul, QuizResult } from "@/types/quiz";

const QuizDetailPage: React.FC = () => {
  const [quizInfo, setQuizInfo] = useState<Judul | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const params = useParams();
  const quizId = params.quizId as string;

  useEffect(() => {
    if (!quizId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [infoRes, resultsRes] = await Promise.all([
          fetch(`/api/quiz/judul/${quizId}`),
          fetch(`/api/quiz/results/${quizId}`),
        ]);

        if (!infoRes.ok) throw new Error(`Gagal memuat detail kuis`);
        const infoData: Judul = await infoRes.json();
        setQuizInfo(infoData);

        if (!resultsRes.ok) throw new Error(`Gagal memuat hasil kuis`);
        const resultsData: QuizResult[] = await resultsRes.json();
        setResults(resultsData);
      } catch (err) {
        let message = "Terjadi kesalahan";
        if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  // Pagination logic
  const totalPages = Math.ceil(results.length / entriesPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <>
      <Header title="Detail Hasil Quiz" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {loading
                  ? "Memuat..."
                  : `Hasil Kuis: ${quizInfo?.judul || "Tidak Ditemukan"}`}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan daftar peserta yang telah menyelesaikan kuis.
              </p>
            </div>
            <Link
              href="/quiz"
              className="btn text-gray-500 hover:text-gray-700 bg-red-200 hover:bg-red-700 p-2 px-4 rounded-lg flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
          </div>

          {error && (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
              {error}
            </div>
          )}

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
              {loading ? (
                <SkeletonTable rows={entriesPerPage} cols={4} />
              ) : (
                <tbody>
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((result, index) => (
                      <tr
                        key={result.id}
                        className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                      >
                        <td className="p-4 font-medium text-gray-900">
                          {(currentPage - 1) * entriesPerPage + index + 1}
                        </td>
                        <td className="p-4 font-medium text-gray-800">
                          {result.nama}
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(result.tanggal).toLocaleDateString("id-ID")}
                        </td>
                        <td className="p-4 font-bold text-blue-600">
                          {result.nilai}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-400"
                      >
                        Belum ada hasil untuk kuis ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>

          {!loading && !error && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default QuizDetailPage;
