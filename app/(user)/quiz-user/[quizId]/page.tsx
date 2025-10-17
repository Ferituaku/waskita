"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Check, X, Triangle, Square, Circle, Star } from "lucide-react";
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

// Updated props interface to handle Promise params
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
  const [finalScore, setFinalScore] = useState<{
    nilai: number;
    grade: string;
  } | null>(null);

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

  // Updated effect to handle score submission with totalQuestions and correctAnswers
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

          // Store the calculated score and grade from backend
          if (data.data) {
            setFinalScore({
              nilai: data.data.nilai,
              grade: data.data.grade,
            });
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
    if (optionId === currentQuestion.correctAnswerId) return "bg-green-600";
    if (
      optionId === selectedAnswer &&
      optionId !== currentQuestion.correctAnswerId
    )
      return "bg-red-700 opacity-70";
    return "bg-gray-500 opacity-50";
  };

  if (loading || quizId === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <span className="loading loading-spinner loading-lg text-red-800"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Terjadi Kesalahan
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/quiz-user"
            className="btn btn-primary bg-red-800 text-white hover:bg-red-900"
          >
            Kembali ke Daftar Kuis
          </Link>
        </div>
      </div>
    );
  }

  if (!quizData) return null;

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
    // Use backend calculated score if available, otherwise calculate locally as fallback
    const displayNilai =
      finalScore?.nilai ?? Math.round((correctAnswers / totalQuestions) * 100);
    const displayGrade =
      finalScore?.grade ??
      (() => {
        if (displayNilai >= 80) return "A";
        if (displayNilai >= 65) return "B";
        if (displayNilai >= 50) return "C";
        if (displayNilai >= 35) return "D";
        return "E";
      })();

    const getGradeColor = (grade: string) => {
      switch (grade) {
        case "A":
          return "text-green-600";
        case "B":
          return "text-blue-600";
        case "C":
          return "text-yellow-600";
        case "D":
          return "text-orange-600";
        case "E":
          return "text-red-600";
        default:
          return "text-gray-600";
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kuis Selesai!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Kerja bagus telah menyelesaikan kuis.
          </p>

          <div className="bg-red-50 p-6 rounded-lg mb-4">
            <p className="text-xl text-gray-700 mb-2">Hasil Anda</p>

            {/* Correct Answers Display */}
            <div className="mb-4 p-4 bg-white rounded-lg">
              <p className="text-lg text-gray-600">Jawaban Benar</p>
              <p className="text-4xl font-bold text-gray-800">
                {correctAnswers}{" "}
                <span className="text-2xl text-gray-500">
                  / {totalQuestions}
                </span>
              </p>
            </div>

            {/* Score Display */}
            <div className="mb-4 p-4 bg-white rounded-lg">
              <p className="text-lg text-gray-600">Nilai</p>
              <p className="text-5xl font-bold text-red-800">{displayNilai}</p>
            </div>

            {/* Grade Display */}
            <div className="p-4 bg-white rounded-lg">
              <p className="text-lg text-gray-600">Grade</p>
              <p
                className={`text-6xl font-bold ${getGradeColor(displayGrade)}`}
              >
                {displayGrade}
              </p>
            </div>
          </div>

          {isSubmitting && (
            <div className="mb-4 text-gray-600">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Menyimpan skor...
            </div>
          )}

          {hasSubmitted && (
            <div className="mb-4 text-green-600 font-semibold">
              ✓ Skor berhasil disimpan
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full bg-red-800 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 hover:bg-red-900"
            >
              Coba Lagi
            </button>
            <Link
              href="/quiz-user"
              className="w-full flex items-center justify-center bg-white border border-red-800 text-red-800 font-bold py-3 px-6 rounded-full transition-colors duration-300 hover:bg-red-50"
            >
              Kembali ke Daftar Kuis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <p className="text-gray-600">Soal tidak dapat dimuat.</p>
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
          <X size={20} />{" "}
          <span className="hidden sm:inline text-red-700">Keluar</span>
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
