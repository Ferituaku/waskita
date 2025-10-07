//app/(user)/quiz-user/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { ClipboardCheck, ArrowRight, AlertTriangle } from "lucide-react";
import type { Judul } from "@/types/quiz";

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md animate-pulse">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 p-3 rounded-full w-12 h-12"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="bg-gray-100 p-4 mt-auto border-t border-gray-200">
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const QuizListPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Judul[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/quiz/judul");
        if (!res.ok) throw new Error("Gagal memuat daftar kuis.");
        const data: Judul[] = await res.json();
        setQuizzes(data);
      } catch (err) {
        let message = "Gagal memuat daftar kuis.";
        if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <>
      <Header title="Quiz" />
      <div className="p-4 md:p-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Daftar Kuis Tersedia
          </h2>
          <p className="text-gray-600">
            Uji pemahaman Anda tentang HIV/AIDS melalui kuis interaktif berikut.
          </p>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-4">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <p className="font-bold">Terjadi Kesalahan</p>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Link
                  href={`/quiz-user/${quiz.id_judul}`}
                  key={quiz.id_judul}
                  className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <ClipboardCheck className="w-6 h-6 text-red-800" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-200 mb-2">
                      {quiz.judul}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {quiz.questionCount} Soal
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 mt-auto border-t border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-red-600">
                      Kerjakan Kuis
                    </span>
                    <ArrowRight className="w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">
                Saat ini belum ada kuis yang tersedia.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default QuizListPage;
