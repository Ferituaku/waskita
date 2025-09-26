"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, Triangle, Square, Circle, Star } from "lucide-react";

// Mock data for the quiz - in a real app, nanti nya di-fetch dari backend
const quizData = {
  id: 1,
  title: "QUIZ 1: Bahaya AIDS",
  questions: [
    {
      id: 1,
      questionText: "Apa kepanjangan dari HIV?",
      options: [
        { id: 1, text: "Human Immunodeficiency Virus" },
        { id: 2, text: "Human Infection Virus" },
        { id: 3, text: "Hepatitis Infection Virus" },
        { id: 4, text: "Highly Infectious Virus" },
      ],
      correctAnswerId: 1,
    },
    {
      id: 2,
      questionText: "Bagaimana cara penularan HIV yang paling umum?",
      options: [
        { id: 1, text: "Melalui udara" },
        { id: 2, text: "Berjabat tangan" },
        { id: 3, text: "Hubungan seksual tanpa pengaman" },
        { id: 4, text: "Gigitan nyamuk" },
      ],
      correctAnswerId: 3,
    },
    {
      id: 3,
      questionText:
        "Tes HIV apa yang paling umum digunakan untuk deteksi awal?",
      options: [
        { id: 1, text: "Tes PCR" },
        { id: 2, text: "Tes Antibodi (ELISA)" },
        { id: 3, text: "Tes Kultur Virus" },
        { id: 4, text: "Tes Darah Lengkap" },
      ],
      correctAnswerId: 2,
    },
    {
      id: 4,
      questionText: "Apa nama terapi obat untuk menekan perkembangan HIV?",
      options: [
        { id: 1, text: "Kemoterapi" },
        { id: 2, text: "Antibiotik" },
        { id: 3, text: "Terapi Antiretroviral (ART)" },
        { id: 4, text: "Vaksinasi" },
      ],
      correctAnswerId: 3,
    },
  ],
};

const colors = [
  "bg-red-500 hover:bg-red-600",
  "bg-blue-500 hover:bg-blue-600",
  "bg-yellow-500 hover:bg-yellow-600",
  "bg-green-500 hover:bg-green-600",
];

const icons = [
  <Triangle key="triangle" className="w-8 h-8" />,
  <Square key="square" className="w-8 h-8" />,
  <Circle key="circle" className="w-8 h-8" />,
  <Star key="star" className="w-8 h-8" />,
];

type GameState = "start" | "playing" | "finished";

export default function UserQuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const totalQuestions = quizData.questions.length;
  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleStartQuiz = () => {
    setGameState("playing");
  };

  const handleRestartQuiz = () => {
    setGameState("start");
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const handleSelectAnswer = (optionId: number) => {
    if (isAnswered) return;

    setSelectedAnswer(optionId);
    setIsAnswered(true);

    if (optionId === currentQuestion.correctAnswerId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setGameState("finished");
    }
  };

  const getButtonClass = (optionId: number) => {
    if (!isAnswered) {
      return colors[optionId % 4];
    }

    if (optionId === currentQuestion.correctAnswerId) {
      return "bg-green-600"; // Always show correct answer in green
    }

    if (
      optionId === selectedAnswer &&
      optionId !== currentQuestion.correctAnswerId
    ) {
      return "bg-red-700 opacity-70"; // Show selected incorrect answer in red
    }

    return "bg-gray-500 opacity-50"; // Other options
  };

  // UI for Start Screen
  if (gameState === "start") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {quizData.title}
          </h1>
          <p className="text-gray-600 mb-8">{totalQuestions} Soal</p>
          <button
            onClick={handleStartQuiz}
            className="w-full bg-red-800 text-white font-bold py-4 px-8 rounded-full text-xl transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Mulai Kuis
          </button>
          <Link
            href="/quiz-user"
            className="inline-block mt-6 text-gray-500 hover:text-primary"
          >
            Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  // UI for Finish Screen
  if (gameState === "finished") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kuis Selesai!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Kerja bagus telah menyelesaikan kuis.
          </p>
          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <p className="text-xl text-gray-700">Skor Akhir Anda</p>
            <p className="text-6xl font-bold text-red-800 my-2">
              {score}{" "}
              <span className="text-3xl text-gray-500">/ {totalQuestions}</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full bg-red-800  text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 hover:bg-red-900"
            >
              Coba Lagi
            </button>
            <Link
              href="/quiz"
              className="w-full flex items-center justify-center bg-white border border-red-800 text-red-800 font-bold py-3 px-6 rounded-full transition-colors duration-300 hover:bg-red-50"
            >
              Kembali ke Daftar Kuis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // UI for Playing Screen
  return (
    <div className="min-h-screen bg-red-100 text-white flex flex-col p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <p className="font-bold text-lg text-gray-600">
          Soal {currentQuestionIndex + 1}{" "}
          <span className="text-gray-400">dari {totalQuestions}</span>
        </p>
        <Link
          href="/quiz-user"
          className="flex items-center text-red-700 gap-2 py-2 px-3 rounded-lg hover:bg-white/40 transition-colors"
        >
          <X size={20} /> <span className="hidden sm:inline text-red-700">Keluar</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl text-center mb-8 bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl md:text-4xl font-bold">
            {currentQuestion.questionText}
          </h2>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={isAnswered}
              className={`p-4 rounded-lg text-white font-semibold text-lg flex items-center justify-between transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass(
                option.id
              )}`}
            >
              <div className="flex items-center gap-4">
                {icons[index % 4]}
                <span>{option.text}</span>
              </div>
              {isAnswered && (
                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                  {option.id === currentQuestion.correctAnswerId ? (
                    <Check size={20} />
                  ) : (
                    option.id === selectedAnswer && <X size={20} />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-24 mt-8 flex items-center justify-end">
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="bg-white text-gray-800 font-bold py-3 px-12 rounded-lg text-xl transition-transform hover:scale-105 shadow-2xl"
          >
            {currentQuestionIndex < totalQuestions - 1
              ? "Lanjut"
              : "Lihat Hasil"}
          </button>
        )}
      </footer>
    </div>
  );
}
