"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Pagination from "@/components/dashboard/Pagination";
import SkeletonTable from "@/components/SkeletonTable";
import { ArrowLeft, User, Mail, Award, TrendingUp, Users } from "lucide-react";
import type { Judul } from "@/types/quiz";

// Enhanced QuizResult interface to include user data
interface QuizResultWithUser {
  id: number;
  nama: string;
  email?: string;
  tanggal: string;
  nilai: number;
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

  // Helper: Get best score per user (for statistics only)
  const getBestScoresPerUser = () => {
    const userBestScores = new Map<string, number>();
    
    results.forEach((result) => {
      const userKey = result.email || `guest_${result.nama}`;
      const currentBest = userBestScores.get(userKey) || 0;
      
      if (result.nilai > currentBest) {
        userBestScores.set(userKey, result.nilai);
      }
    });
    
    return Array.from(userBestScores.values());
  };

  // Calculate statistics ONLY from best scores per user
  const calculateStats = () => {
    if (results.length === 0) return null;

    const bestScores = getBestScoresPerUser();
    const uniqueUsers = bestScores.length;
    
    const average = bestScores.reduce((a, b) => a + b, 0) / bestScores.length;
    const highest = Math.max(...bestScores);
    const lowest = Math.min(...bestScores);
    
    const registeredUsers = results.filter((r) => r.isRegisteredUser).length;

    // Calculate score ranges from BEST scores only
    const scoreRanges = {
      excellent: bestScores.filter((score) => score >= 90).length, // 90-100
      good: bestScores.filter((score) => score >= 75 && score < 90).length, // 75-89
      average: bestScores.filter((score) => score >= 60 && score < 75).length, // 60-74
      poor: bestScores.filter((score) => score < 60).length, // <60
    };

    return {
      totalParticipants: results.length, // Total semua percobaan
      uniqueUsers, // Total unique users
      averageScore: average.toFixed(1),
      highestScore: highest,
      lowestScore: lowest,
      registeredUsers,
      guestUsers: results.length - registeredUsers,
      scoreRanges,
    };
  };

  const stats = calculateStats();

  // Pagination logic (tampilkan SEMUA percobaan)
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

  // Get score styling based on value
  const getScoreStyle = (score: number) => {
    if (score >= 90)
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    if (score >= 75)
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    if (score >= 60)
      return "bg-gradient-to-r from-yellow-500 to-orange-400 text-white";
    return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Sangat Baik", color: "text-green-600" };
    if (score >= 75) return { text: "Baik", color: "text-blue-600" };
    if (score >= 60) return { text: "Cukup", color: "text-yellow-600" };
    return { text: "Perlu Perbaikan", color: "text-red-600" };
  };

  return (
    <>
      <Header title="Detail Hasil Quiz" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {loading
                  ? "Memuat..."
                  : quizInfo?.judul || "Tidak Ditemukan"}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Award size={18} className="text-indigo-500" />
                Hasil Peserta Kuis
              </p>
            </div>
            <Link
              href="/quiz"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Kembali</span>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Attempts */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <Users size={32} className="opacity-80" />
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <p className="text-xs font-semibold">Total</p>
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">
                {stats.totalParticipants}
              </p>
              <p className="text-blue-100 text-sm">Percobaan ({stats.uniqueUsers} user)</p>
            </div>

            {/* Average Score */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp size={32} className="opacity-80" />
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <p className="text-xs font-semibold">Rata-rata</p>
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">{stats.averageScore}</p>
              <p className="text-purple-100 text-sm">Nilai Terbaik User</p>
            </div>

            {/* Highest Score */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <Award size={32} className="opacity-80" />
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <p className="text-xs font-semibold">Tertinggi</p>
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">{stats.highestScore}</p>
              <p className="text-green-100 text-sm">Nilai Maksimal</p>
            </div>

            {/* Lowest Score */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <Award size={32} className="opacity-80" />
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <p className="text-xs font-semibold">Terendah</p>
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">{stats.lowestScore}</p>
              <p className="text-orange-100 text-sm">Nilai Minimal</p>
            </div>
          </div>
        )}

        {/* Score Distribution (Based on BEST scores only) */}
        {!loading && stats && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Award className="text-indigo-600" />
              Distribusi Nilai
            </h2>
            <p className="text-sm text-gray-500 mb-6">Berdasarkan nilai terbaik setiap user</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Excellent */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {stats.scoreRanges.excellent}
                  </div>
                  <div className="text-sm font-semibold text-green-700 mb-1">
                    Sangat Baik
                  </div>
                  <div className="text-xs text-green-600">Nilai 90-100</div>
                </div>
              </div>

              {/* Good */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stats.scoreRanges.good}
                  </div>
                  <div className="text-sm font-semibold text-blue-700 mb-1">
                    Baik
                  </div>
                  <div className="text-xs text-blue-600">Nilai 75-89</div>
                </div>
              </div>

              {/* Average */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    {stats.scoreRanges.average}
                  </div>
                  <div className="text-sm font-semibold text-yellow-700 mb-1">
                    Cukup
                  </div>
                  <div className="text-xs text-yellow-600">Nilai 60-74</div>
                </div>
              </div>

              {/* Poor */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {stats.scoreRanges.poor}
                  </div>
                  <div className="text-sm font-semibold text-red-700 mb-1">
                    Perlu Perbaikan
                  </div>
                  <div className="text-xs text-red-600">Nilai &lt; 60</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table (Show ALL attempts) */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {error && (
            <div className="m-6 text-center text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User size={16} /> Nama Peserta
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail size={16} /> Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nilai
                  </th>
                </tr>
              </thead>
              {loading ? (
                <SkeletonTable rows={entriesPerPage} cols={6} />
              ) : (
                <tbody className="divide-y divide-gray-100">
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((result, index) => {
                      const badge = getScoreBadge(result.nilai);
                      return (
                        <tr
                          key={result.id}
                          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {(currentPage - 1) * entriesPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {result.nama}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              {result.email || (
                                <span className="text-gray-400 italic">
                                  Tidak tersedia
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                result.isRegisteredUser
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-gray-100 text-gray-600 border border-gray-200"
                              }`}
                            >
                              {result.isRegisteredUser ? "Terdaftar" : "Tamu"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(result.tanggal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className={`${getScoreStyle(
                                  result.nilai
                                )} px-6 py-2 rounded-xl font-bold text-lg shadow-lg`}
                              >
                                {result.nilai}
                              </div>
                              <span
                                className={`text-xs font-semibold ${badge.color}`}
                              >
                                {badge.text}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Award size={48} className="text-gray-300" />
                          <p className="text-lg">
                            Belum ada hasil untuk kuis ini.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>

          {!loading && !error && totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizDetailPage;