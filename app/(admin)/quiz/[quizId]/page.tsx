"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Pagination from "@/components/dashboard/Pagination";
import SkeletonTable from "@/components/SkeletonTable";
import { ArrowLeft, User, Mail } from "lucide-react";
import type { Judul } from "@/types/quiz";

// Enhanced QuizResult interface to include user data and grade
interface QuizResultWithUser {
  id: number;
  nama: string;
  email?: string;
  tanggal: string;
  nilai: number;
  grade: string;
  isRegisteredUser: boolean;
}

const QuizDetailPage: React.FC = () => {
  const [quizInfo, setQuizInfo] = useState<Judul | null>(null);
  const [results, setResults] = useState<QuizResultWithUser[]>([]);
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

        if (!resultsRes.ok) {
          const errorData = await resultsRes.json();
          throw new Error(errorData.message || `Gagal memuat hasil kuis`);
        }
        const resultsData: QuizResultWithUser[] = await resultsRes.json();
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

  // Calculate statistics with grade distribution
  const calculateStats = () => {
    if (results.length === 0) return null;

    const scores = results.map((r) => r.nilai);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const registeredUsers = results.filter((r) => r.isRegisteredUser).length;

    // Calculate grade distribution
    const gradeCount = {
      A: results.filter((r) => r.grade === "A").length,
      B: results.filter((r) => r.grade === "B").length,
      C: results.filter((r) => r.grade === "C").length,
      D: results.filter((r) => r.grade === "D").length,
      E: results.filter((r) => r.grade === "E").length,
    };

    return {
      totalParticipants: results.length,
      averageScore: average.toFixed(1),
      highestScore: highest,
      lowestScore: lowest,
      registeredUsers,
      guestUsers: results.length - registeredUsers,
      gradeDistribution: gradeCount,
    };
  };

  const stats = calculateStats();

  // Pagination logic
  const totalPages = Math.ceil(results.length / entriesPerPage);
  const paginatedResults = results.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Format date to Indonesian locale
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get grade styling
  const getGradeStyle = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-green-600 bg-green-100";
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      case "D":
        return "text-orange-600 bg-orange-100";
      case "E":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <>
      <Header title="Detail Hasil Quiz" />
      <div className="p-6">
        {/* Quiz Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
              className="btn text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 p-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Kembali</span>
            </Link>
          </div>

          {/* Statistics Cards */}
          {!loading && stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-semibold">
                    Total Peserta
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {stats.totalParticipants}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-semibold">
                    Rata-rata
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {stats.averageScore}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold">
                    Nilai Tertinggi
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    {stats.highestScore}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-semibold">
                    Nilai Terendah
                  </p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {stats.lowestScore}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-600 font-semibold">
                    User Terdaftar
                  </p>
                  <p className="text-2xl font-bold text-indigo-800">
                    {stats.registeredUsers}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold">
                    User Tamu
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.guestUsers}
                  </p>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Distribusi Grade
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  <div className="bg-white p-3 rounded-lg text-center border-2 border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Grade A</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.gradeDistribution.A}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center border-2 border-blue-200">
                    <p className="text-xs text-gray-600 mb-1">Grade B</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.gradeDistribution.B}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center border-2 border-yellow-200">
                    <p className="text-xs text-gray-600 mb-1">Grade C</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.gradeDistribution.C}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center border-2 border-orange-200">
                    <p className="text-xs text-gray-600 mb-1">Grade D</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.gradeDistribution.D}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center border-2 border-red-200">
                    <p className="text-xs text-gray-600 mb-1">Grade E</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.gradeDistribution.E}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg mb-4">
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
                    <div className="flex items-center gap-2">
                      <User size={16} /> Nama Peserta
                    </div>
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} /> Email
                    </div>
                  </th>
                  <th scope="col" className="p-4">
                    Status
                  </th>
                  <th scope="col" className="p-4">
                    Tanggal Mengerjakan
                  </th>
                  <th scope="col" className="p-4">
                    Nilai
                  </th>
                  <th scope="col" className="p-4">
                    Grade
                  </th>
                </tr>
              </thead>
              {loading ? (
                <SkeletonTable rows={entriesPerPage} cols={7} />
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
                          {result.email || (
                            <span className="text-gray-400 italic">
                              Tidak tersedia
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              result.isRegisteredUser
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {result.isRegisteredUser ? "Terdaftar" : "Tamu"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {formatDate(result.tanggal)}
                        </td>
                        <td className="p-4 font-bold text-blue-600">
                          {result.nilai}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-sm font-bold rounded-lg ${getGradeStyle(
                              result.grade
                            )}`}
                          >
                            {result.grade || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
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

          {!loading && !error && totalPages > 1 && (
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