"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Check,
  X,
  Triangle,
  Square,
  Circle,
  Star,
  Trophy,
  Target,
  Zap,
  Heart,
} from "lucide-react";
import type { Judul, Soal, Jawaban } from "@/types/quiz";

// Define the structure for the quiz data used by the component
interface QuizData {
  id: number;
  title: string;
  questions: {
    id: number;
    questionText: string;
    options: { id: number; text: string }[];
    correctAnswerId: number;
  }[];
}

const colors = [
  "bg-red-500 hover:bg-red-600",
  "bg-teal-500 hover:bg-teal-600",
  "bg-rose-500 hover:bg-rose-600",
  "bg-cyan-500 hover:bg-cyan-600",
];

const icons = [
  <Triangle key="triangle" className="w-7 h-7" />,
  <Square key="square" className="w-7 h-7" />,
  <Circle key="circle" className="w-7 h-7" />,
  <Star key="star" className="w-7 h-7" />,
];

type GameState = "start" | "playing" | "finished";

interface UserQuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default function UserQuizPage({ params }: UserQuizPageProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const [quizId, setQuizId] = useState<number | null>(null);

  // Unwrap params Promise
  useEffect(() => {
    params.then((resolvedParams) => {
      setQuizId(parseInt(resolvedParams.quizId, 10));
    });
  }, [params]);

  const fetchAndStructureQuizData = useCallback(async () => {
    if (quizId === null) return;

    setLoading(true);
    setError(null);
    try {
      // 1. Fetch quiz title
      const judulRes = await fetch(`/api/quiz/judul/${quizId}`);
      if (!judulRes.ok) throw new Error("Kuis tidak ditemukan.");
      const judulData: Judul = await judulRes.json();

      // 2. Fetch questions for the quiz
      const soalRes = await fetch(`/api/quiz/soal?id_judul=${quizId}`);
      if (!soalRes.ok) throw new Error("Gagal memuat soal kuis.");
      const soalData: Soal[] = await soalRes.json();

      if (soalData.length === 0) {
        throw new Error("Kuis ini belum memiliki soal.");
      }

      // 3. Fetch answers for all questions in parallel
      const jawabanPromises = soalData.map((soal) =>
        fetch(`/api/quiz/jawaban?id_soal=${soal.id_soal}`).then((res) => {
          if (!res.ok)
            throw new Error(
              `Gagal memuat jawaban untuk soal ID ${soal.id_soal}`
            );
          return res.json();
        })
      );
      const jawabanArrays: Jawaban[][] = await Promise.all(jawabanPromises);

      // 4. Structure the data
      const structuredQuestions = soalData.map((soal, index) => {
        const options = jawabanArrays[index];
        const correctOption = options.find((opt) => opt.is_correct);
        if (!correctOption) {
          console.warn(
            `Soal "${soal.pertanyaan}" tidak memiliki jawaban yang benar.`
          );
        }

        return {
          id: soal.id_soal,
          questionText: soal.pertanyaan,
          options: options.map((opt) => ({
            id: opt.id_jawaban,
            text: opt.teks_jawaban,
          })),
          correctAnswerId: correctOption?.id_jawaban || options[0]?.id_jawaban,
        };
      });

      setQuizData({
        id: judulData.id_judul,
        title: judulData.judul,
        questions: structuredQuestions,
      });
    } catch (err) {
      let message = "Terjadi kesalahan";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchAndStructureQuizData();
  }, [fetchAndStructureQuizData]);

  // Submit score effect - NO GRADE
  useEffect(() => {
    const submitScore = async () => {
      if (
        gameState === "finished" &&
        !isSubmitting &&
        !hasSubmitted &&
        quizData
      ) {
        setIsSubmitting(true);
        try {
          const res = await fetch("/api/quiz/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              quizId: quizData.id,
              totalQuestions: quizData.questions.length,
              correctAnswers: correctAnswers,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Gagal menyimpan skor.");
          }

          const data = await res.json();
          setHasSubmitted(true);

          // Store only the nilai (score)
          if (data.data) {
            setFinalScore(data.data.nilai);
          }

          if (data.data?.isRetake) {
            toast.success("Skor berhasil disimpan! (Percobaan ulang)");
          } else {
            toast.success("Skor berhasil disimpan!");
          }
        } catch (err) {
          let message = "Gagal menyimpan skor.";
          if (err instanceof Error) {
            message = err.message;
          }
          toast.error(message);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
    submitScore();
  }, [gameState, correctAnswers, quizData, isSubmitting, hasSubmitted]);

  const totalQuestions = quizData?.questions.length || 0;
  const currentQuestion = quizData?.questions[currentQuestionIndex];

  const handleStartQuiz = () => {
    setGameState("playing");
    setHasSubmitted(false);
    setFinalScore(null);
  };

  const handleRestartQuiz = () => {
    setGameState("start");
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setHasSubmitted(false);
    setFinalScore(null);
  };

  const handleSelectAnswer = (optionId: number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(optionId);
    setIsAnswered(true);

    if (optionId === currentQuestion.correctAnswerId) {
      setCorrectAnswers((prev) => prev + 1);
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
    if (!isAnswered || !currentQuestion) {
      return colors[optionId % 4];
    }
    if (optionId === currentQuestion.correctAnswerId) return "bg-teal-600";
    if (
      optionId === selectedAnswer &&
      optionId !== currentQuestion.correctAnswerId
    )
      return "bg-red-700 opacity-70";
    return "bg-gray-500 opacity-50";
  };

  // Get score category and styling - HIV/Health Theme
  const getScoreDetails = (score: number) => {
    if (score >= 90)
      return {
        label: "Luar Biasa!",
        color: "text-teal-700",
        bgColor: "bg-teal-50",
        borderColor: "border-teal-300",
        icon: <Heart className="w-16 h-16 text-teal-600" />,
      };
    if (score >= 75)
      return {
        label: "Sangat Baik!",
        color: "text-cyan-700",
        bgColor: "bg-cyan-50",
        borderColor: "border-cyan-300",
        icon: <Trophy className="w-16 h-16 text-cyan-600" />,
      };
    if (score >= 60)
      return {
        label: "Baik!",
        color: "text-rose-700",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-300",
        icon: <Target className="w-16 h-16 text-rose-600" />,
      };
    return {
      label: "Terus Berlatih!",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      icon: <Zap className="w-16 h-16 text-red-600" />,
    };
  };

  if (loading || quizId === null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 overflow-hidden">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart className="w-8 h-8 text-red-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
          Memuat kuis...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-rose-100 p-4 text-center overflow-hidden">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border-2 border-red-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Oops! Ada Masalah
          </h1>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <Link
            href="/quiz-user"
            className="inline-block bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-4 px-8 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

  // START SCREEN - HIV Health Theme
  if (gameState === "start") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4 text-center overflow-hidden">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-red-200 transform hover:scale-105 transition-all duration-300">
          {/* Red Ribbon / Heart Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <Heart className="w-14 h-14 text-white fill-white" />
          </div>

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
            {quizData.title}
          </h1>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-red-100 px-6 py-3 rounded-full border-2 border-red-300">
              <p className="text-red-700 font-bold text-lg">
                {totalQuestions} Soal
              </p>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-5 px-8 rounded-full text-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-rose-300 mb-6"
          >
            💪 Mulai Kuis Sekarang!
          </button>

          <Link
            href="/quiz-user"
            className="inline-block text-gray-500 hover:text-red-600 font-semibold transition-colors duration-300"
          >
            ← Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  // FINISH SCREEN - HIV Health Theme (NO GRADE)
  if (gameState === "finished") {
    const displayNilai =
      finalScore ?? Math.round((correctAnswers / totalQuestions) * 100);
    const scoreDetails = getScoreDetails(displayNilai);
    const percentage = (correctAnswers / totalQuestions) * 100;

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4 text-center overflow-hidden">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-3xl border-2 border-red-200 max-h-[95vh] overflow-y-auto">
          {/* Icon */}
          <div className="mb-4 animate-bounce">{scoreDetails.icon}</div>

          <h1 className={`text-4xl font-extrabold mb-2 ${scoreDetails.color}`}>
            {scoreDetails.label}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Kamu telah menyelesaikan kuis dengan baik!
          </p>

          {/* Score Display - Large and Prominent */}
          <div
            className={`${scoreDetails.bgColor} border-4 ${scoreDetails.borderColor} p-6 rounded-3xl mb-5 transform hover:scale-105 transition-all duration-300`}
          >
            <p className="text-base font-semibold text-gray-600 mb-2">
              Nilai Akhir
            </p>
            <div className="relative">
              <p className={`text-7xl font-extrabold ${scoreDetails.color} mb-3`}>
                {displayNilai}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-rose-500 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Correct Answers */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white p-3 rounded-xl shadow-md">
                <p className="text-xs text-gray-600 mb-1">Jawaban Benar</p>
                <p className="text-2xl font-bold text-teal-600">
                  {correctAnswers}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl shadow-md">
                <p className="text-xs text-gray-600 mb-1">Total Soal</p>
                <p className="text-2xl font-bold text-red-600">
                  {totalQuestions}
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {isSubmitting && (
            <div className="mb-4 flex items-center justify-center gap-3 text-gray-600 bg-gray-100 py-2 px-4 rounded-full">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
              <span className="font-semibold text-sm">Menyimpan skor...</span>
            </div>
          )}

          {hasSubmitted && (
            <div className="mb-4 flex items-center justify-center gap-2 text-teal-600 bg-teal-50 py-2 px-4 rounded-full border-2 border-teal-200">
              <Check className="w-4 h-4" />
              <span className="font-bold text-sm">Skor berhasil disimpan!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={handleRestartQuiz}
              className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Coba Lagi
            </button>
            <Link
              href="/quiz-user"
              className="flex-1 flex items-center justify-center bg-white border-2 border-red-600 text-red-600 font-bold py-3 px-6 rounded-full transition-all duration-300 hover:bg-red-50 hover:scale-105 gap-2"
            >
              ← Kembali ke Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-rose-50 p-4 text-center overflow-hidden">
        <p className="text-gray-600 text-lg">Soal tidak dapat dimuat.</p>
      </div>
    );
  }

  // PLAYING SCREEN - HIV Health Theme
  return (
    <div className="h-screen bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 text-white flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full border-2 border-white/30">
          <p className="font-bold text-base">
            Soal {currentQuestionIndex + 1}{" "}
            <span className="text-white/70">dari {totalQuestions}</span>
          </p>
        </div>
        <Link
          href="/quiz-user"
          className="flex items-center gap-2 bg-white/20 backdrop-blur-lg px-3 py-2 rounded-full hover:bg-white/30 transition-all duration-300 border-2 border-white/30"
        >
          <X size={18} />
          <span className="hidden sm:inline font-semibold text-sm">
            Keluar
          </span>
        </Link>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-4">
        <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-lg">
          <div
            className="bg-gradient-to-r from-white to-teal-200 h-2.5 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-w-4xl text-center mb-6 bg-white text-gray-800 p-6 rounded-3xl shadow-2xl border-4 border-white/50 transform hover:scale-105 transition-all duration-300">
          <h2 className="text-2xl md:text-4xl font-bold leading-tight">
            {currentQuestion.questionText}
          </h2>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[45vh] px-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl text-white font-bold text-lg flex items-center justify-between transition-all duration-300 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 ${getButtonClass(
                option.id
              )}`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-lg">
                  {icons[index % 4]}
                </div>
                <span className="text-left">{option.text}</span>
              </div>
              {isAnswered && (
                <div className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-lg">
                  {option.id === currentQuestion.correctAnswerId ? (
                    <Check size={20} className="animate-bounce" />
                  ) : (
                    option.id === selectedAnswer && (
                      <X size={20} className="animate-pulse" />
                    )
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="h-20 flex items-center justify-end">
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="bg-white text-gray-800 font-bold py-3 px-12 rounded-full text-xl transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            {currentQuestionIndex < totalQuestions - 1
              ? "Lanjut →"
              : "Selesai 💪"}
          </button>
        )}
      </footer>
    </div>
  );
}