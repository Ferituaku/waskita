"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Check,
  X,
  ChevronRight,
  Home,
  RotateCcw,
  Award,
  BookOpen,
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
      const judulRes = await fetch(`/api/quiz/judul/${quizId}`);
      if (!judulRes.ok) throw new Error("Kuis tidak ditemukan.");
      const judulData: Judul = await judulRes.json();

      const soalRes = await fetch(`/api/quiz/soal?id_judul=${quizId}`);
      if (!soalRes.ok) throw new Error("Gagal memuat soal kuis.");
      const soalData: Soal[] = await soalRes.json();

      if (soalData.length === 0) {
        throw new Error("Kuis ini belum memiliki soal.");
      }

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

  // Submit score effect
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

  const getOptionClass = (optionId: number) => {
    if (!isAnswered || !currentQuestion) {
      return "border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 bg-white";
    }
    if (optionId === currentQuestion.correctAnswerId) {
      return "border-green-500 bg-green-50";
    }
    if (optionId === selectedAnswer && optionId !== currentQuestion.correctAnswerId) {
      return "border-red-500 bg-red-50";
    }
    return "border-gray-200 bg-gray-50 opacity-60";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-green-600" };
    if (score >= 75) return { label: "Very Good", color: "text-blue-600" };
    if (score >= 60) return { label: "Good", color: "text-indigo-600" };
    return { label: "Keep Practicing", color: "text-gray-600" };
  };

  if (loading || quizId === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/quiz-user"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

  // START SCREEN - Professional White
  if (gameState === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {quizData.title}
            </h1>
            <p className="text-gray-600">
              Uji pengetahuan Anda dengan {totalQuestions} pertanyaan
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                <p className="text-sm text-gray-600 mt-1">Pertanyaan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">~{totalQuestions * 0.5}</p>
                <p className="text-sm text-gray-600 mt-1">Menit</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100</p>
                <p className="text-sm text-gray-600 mt-1">Poin Max</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition-all duration-200 mb-4 flex items-center justify-center gap-2"
          >
            Mulai Kuis
            <ChevronRight className="w-5 h-5" />
          </button>

          <Link
            href="/quiz-user"
            className="block text-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Kembali
          </Link>
        </div>
      </div>
    );
  }

  // FINISH SCREEN - Professional Results
  if (gameState === "finished") {
    const displayNilai =
      finalScore ?? Math.round((correctAnswers / totalQuestions) * 100);
    const scoreLevel = getScoreLevel(displayNilai);
    const percentage = (correctAnswers / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
              <Award className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${scoreLevel.color}`}>
              {scoreLevel.label}
            </h2>
            <p className="text-gray-600">Quiz telah selesai</p>
          </div>

          {/* Score Display */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6">
            <div className="text-center mb-6">
              <p className="text-sm font-medium text-gray-600 mb-2">Nilai Anda</p>
              <p className="text-7xl font-bold text-gray-900">{displayNilai}</p>
              <p className="text-gray-600 mt-2">dari 100</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Benar</p>
                <p className="text-3xl font-bold text-green-600">{correctAnswers}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Salah</p>
                <p className="text-3xl font-bold text-red-600">
                  {totalQuestions - correctAnswers}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 py-3 px-4 rounded-lg mb-4">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="font-medium text-sm">Menyimpan hasil...</span>
            </div>
          )}

          {hasSubmitted && (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 px-4 rounded-lg mb-4 border border-green-200">
              <Check className="w-4 h-4" />
              <span className="font-medium text-sm">Hasil tersimpan</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleRestartQuiz}
              className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Coba Lagi
            </button>
            <Link
              href="/quiz-user"
              className="flex-1 bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Soal tidak dapat dimuat.</p>
      </div>
    );
  }

  // PLAYING SCREEN - Clean & Professional
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
            </span>
          </div>
          <Link
            href="/quiz-user"
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Keluar</span>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
        {/* Question */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            {currentQuestion.questionText}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={isAnswered}
              className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200 disabled:cursor-not-allowed ${getOptionClass(
                option.id
              )}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-900">
                  {optionLabels[index]}
                </div>
                <span className="flex-1 text-gray-900 font-medium">
                  {option.text}
                </span>
                {isAnswered && option.id === currentQuestion.correctAnswerId && (
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                )}
                {isAnswered &&
                  option.id === selectedAnswer &&
                  option.id !== currentQuestion.correctAnswerId && (
                    <X className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* Next Button */}
        {isAnswered && (
          <div className="flex justify-end mt-auto">
            <button
              onClick={handleNextQuestion}
              className="bg-gray-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {currentQuestionIndex < totalQuestions - 1 ? "Selanjutnya" : "Selesai"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 