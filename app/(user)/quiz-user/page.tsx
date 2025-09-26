"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { ClipboardCheck, ArrowRight } from "lucide-react";

const mockQuizzes = [
  { id: 1, title: "QUIZ 1: Bahaya AIDS", questionCount: 4 },
  { id: 2, title: "QUIZ 2: Pencegahan AIDS", questionCount: 8 },
  { id: 3, title: "QUIZ 3: Apa itu AIDS", questionCount: 12 },
  { id: 4, title: "QUIZ 4: Mengenal AIDS", questionCount: 10 },
  { id: 5, title: "QUIZ 5: Ciri-Ciri AIDS", questionCount: 15 },
];

const QuizListPage: React.FC = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <Link
              href={`/quiz-user/${quiz.id}`}
              key={quiz.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <ClipboardCheck className="w-6 h-6 text-red-800" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-hover transition-colors duration-200 mb-2">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {quiz.questionCount} Soal
                </p>
              </div>
              <div className="bg-gray-50 p-4 mt-auto border-t border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-gray-500">
                  Kerjakan Kuis
                </span>
                <ArrowRight className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuizListPage;
