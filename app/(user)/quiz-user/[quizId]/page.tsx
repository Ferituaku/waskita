"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  ChevronRight,
  Home,
  RotateCcw,
  Award,
  BookOpen,
  Trophy,
  Target,
  Zap,
  Clock,
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

// ⭐ Confetti Component untuk celebration
const Confetti: React.FC = () => {
  const confettiPieces = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
            backgroundColor: [
              "#ef4444",
              "#f59e0b",
              "#10b981",
              "#3b82f6",
              "#8b5cf6",
              "#ec4899",
            ][Math.floor(Math.random() * 6)],
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 360],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

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
  const [showConfetti, setShowConfetti] = useState(false);

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
            // ⭐ Show confetti for good scores
            if (data.data.nilai >= 70) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 4000);
            }
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
    setShowConfetti(false);
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
      return "border-gray-200 hover:border-red-400 hover:bg-red-50/50 bg-white hover:shadow-md";
    }
    if (optionId === currentQuestion.correctAnswerId) {
      return "border-green-500 bg-linear-to-r from-green-50 to-emerald-50 shadow-lg shadow-green-100";
    }
    if (
      optionId === selectedAnswer &&
      optionId !== currentQuestion.correctAnswerId
    ) {
      return "border-red-500 bg-linear-to-r from-red-50 to-rose-50 shadow-lg shadow-red-100";
    }
    return "border-gray-200 bg-gray-50 opacity-60";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90)
      return {
        label: "Luar Biasa!",
        color: "text-green-600",
        linear: "from-green-400 to-emerald-500",
        icon: Trophy,
      };
    if (score >= 75)
      return {
        label: "Sangat Baik!",
        color: "text-blue-600",
        linear: "from-blue-400 to-cyan-500",
        icon: Award,
      };
    if (score >= 60)
      return {
        label: "Bagus!",
        color: "text-indigo-600",
        linear: "from-indigo-400 to-purple-500",
        icon: Target,
      };
    return {
      label: "Tetap Semangat!",
      color: "text-gray-600",
      linear: "from-gray-400 to-slate-500",
      icon: Zap,
    };
  };

  // ⭐ LOADING SCREEN dengan animasi
  if (loading || quizId === null) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 px-4">
        <motion.div
          key="loading-spinner"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full"></div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-base text-gray-600 font-medium"
        >
          Memuat kuis...
        </motion.p>
      </div>
    );
  }

  // ⭐ ERROR SCREEN dengan animasi
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-linear-to-br from-red-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <X className="w-10 h-10 text-red-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Ada Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/quiz-user"
            className="inline-flex items-center gap-2 bg-linear-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!quizData) return null;

  // ⭐ START SCREEN - Enhanced dengan animasi
  if (gameState === "start") {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -30, rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 max-w-2xl w-full"
        >
          {/* Icon dengan animasi pulse */}
          <motion.div
            key="icon-container"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-red-900 to-red-500 rounded-2xl mb-4 shadow-lg shadow-red-200"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-linear-to-r from-gray-900 via-red-800 to-orange-700 bg-clip-text text-transparent mb-3"
            >
              {quizData.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              Siap menguji pengetahuan Anda?
            </motion.p>
          </motion.div>

          {/* Stats Cards dengan stagger animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-linear-to-br from-gray-50 to-red-50 rounded-2xl p-6 mb-8 shadow-inner"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                {
                  value: totalQuestions,
                  label: "Pertanyaan",
                  icon: BookOpen,
                  delay: 0.6,
                },
                {
                  value: `~${totalQuestions * 0.5}`,
                  label: "Menit",
                  icon: Clock,
                  delay: 0.7,
                },
                {
                  value: "100",
                  label: "Poin Max",
                  icon: Trophy,
                  delay: 0.8,
                },
              ].map((stat, index) => (
                <motion.div
                  key={`stat-${index}`}
                  initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: stat.delay, type: "spring" }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <stat.icon className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartQuiz}
              className="w-full bg-linear-to-r from-red-900 via-red-900 to-[#5C110E] text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-200 mb-4 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Mulai Kuis Sekarang
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-rose-500 to-red-800"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>

            <Link
              href="/quiz-user"
              className="block text-center text-gray-600 hover:text-gray-900 font-medium transition-colors hover:underline"
            >
              ← Kembali ke Daftar Kuis
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ⭐ FINISH SCREEN - Enhanced dengan confetti dan animasi
  if (gameState === "finished") {
    const displayNilai =
      finalScore ?? Math.round((correctAnswers / totalQuestions) * 100);
    const scoreLevel = getScoreLevel(displayNilai);
    const percentage = (correctAnswers / totalQuestions) * 100;
    const ScoreIcon = scoreLevel.icon;

    return (
      <>
        {showConfetti && <Confetti />}
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
          <motion.div
            key="finish-screen"
            initial={{ opacity: 0, scale: 0.9, y: 30, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-10 max-w-2xl w-full"
          >
            {/* Animated Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`inline-flex items-center justify-center w-24 h-24 bg-linear-to-br ${scoreLevel.linear} rounded-3xl mb-4 shadow-2xl`}
              >
                <ScoreIcon className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-3xl font-bold mb-2 ${scoreLevel.color}`}
              >
                {scoreLevel.label}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600"
              >
                Kuis telah selesai! 🎉
              </motion.p>
            </motion.div>

            {/* Score Display dengan counter animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-linear-to-br from-red-50 via-white to-rose-50 rounded-3xl p-8 mb-6 shadow-inner border border-gray-100"
            >
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                  Nilai Anda
                </p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className={`text-8xl font-black bg-linear-to-br ${scoreLevel.linear} bg-clip-text text-transparent`}
                >
                  {displayNilai}
                </motion.p>
                <p className="text-gray-500 mt-2 font-medium">dari 100 poin</p>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full bg-linear-to-r ${scoreLevel.linear} shadow-lg`}
                ></motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all duration-200 border border-green-100"
                >
                  <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1 font-medium">
                    Jawaban Benar
                  </p>
                  <p className="text-4xl font-bold text-green-600">
                    {correctAnswers}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all duration-200 border border-red-100"
                >
                  <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1 font-medium">
                    Jawaban Salah
                  </p>
                  <p className="text-4xl font-bold text-red-600">
                    {totalQuestions - correctAnswers}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Status Messages */}
            <AnimatePresence>
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-3 text-indigo-600 bg-indigo-50 py-3 px-4 rounded-xl mb-4 border border-indigo-200"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full"
                  />
                  <span className="font-semibold text-sm">
                    Menyimpan hasil Anda...
                  </span>
                </motion.div>
              )}

              {hasSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center gap-3 text-green-600 bg-green-50 py-3 px-4 rounded-xl mb-4 border border-green-200 shadow-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                  <span className="font-semibold text-sm">
                    Hasil berhasil tersimpan!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRestartQuiz}
                className="flex-1 bg-linear-to-r from-red-800 to-red-900 text-white font-semibold py-4 rounded-xl hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Coba Lagi
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1"
              >
                <Link
                  href="/quiz-user"
                  className="bg-white border-2 border-gray-200 text-gray-900 font-semibold py-4 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Beranda
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Soal tidak dapat dimuat.</p>
      </div>
    );
  }

  // ⭐ PLAYING SCREEN - Enhanced dengan animasi smooth
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-gray-50 flex flex-col">
      {/* Header dengan glassmorphism */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="border-b border-gray-200/50 bg-white/80 backdrop-blur-lg sticky top-0 z-10 shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="bg-linear-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-red-200">
              {currentQuestionIndex + 1} / {totalQuestions}
            </div>
            <span className="text-sm font-medium text-gray-600 hidden sm:block">
              {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
              Selesai
            </span>
          </motion.div>

          <Link
            href="/quiz-user"
            className="text-gray-600 hover:text-red-600 transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline font-medium">Keluar</span>
          </Link>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-1.5 bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 shadow-lg shadow-red-200/50"
          ></motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
        {/* Question dengan slide animation */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-10 h-10 bg-linear-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-red-200">
                {currentQuestionIndex + 1}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight flex-1">
                {currentQuestion.questionText}
              </h2>
            </div>
          </motion.div>
        </motion.div>

        {/* Options dengan stagger animation */}
        <motion.div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isAnswered ? { scale: 1.02, x: 8 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={isAnswered}
              className={`w-full p-5 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 disabled:cursor-not-allowed relative overflow-hidden group ${getOptionClass(
                option.id
              )}`}
            >
              {/* Hover effect background */}
              {!isAnswered && (
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId={`hover-${option.id}`}
                />
              )}

              <div className="flex items-center gap-4 relative z-10">
                <motion.div
                  whileHover={!isAnswered ? { rotate: 5 } : {}}
                  className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                    !isAnswered
                      ? "bg-gray-100 text-gray-700 group-hover:bg-red-100 group-hover:text-red-600"
                      : option.id === currentQuestion.correctAnswerId
                      ? "bg-green-500 text-white shadow-lg shadow-green-200"
                      : option.id === selectedAnswer
                      ? "bg-red-500 text-white shadow-lg shadow-red-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {optionLabels[index]}
                </motion.div>

                <span className="flex-1 text-gray-900 font-medium text-base md:text-lg">
                  {option.text}
                </span>

                {/* Answer indicators dengan animasi */}
                <AnimatePresence>
                  {isAnswered &&
                    option.id === currentQuestion.correctAnswerId && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200"
                      >
                        <Check className="w-6 h-6 text-white" />
                      </motion.div>
                    )}

                  {isAnswered &&
                    option.id === selectedAnswer &&
                    option.id !== currentQuestion.correctAnswerId && (
                      <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-200"
                      >
                        <X className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Next Button dengan animasi slide-up */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex justify-end mt-auto"
            >
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextQuestion}
                className="bg-linear-to-r from-red-600 to-orange-600 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-red-300 transition-all duration-300 flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {currentQuestionIndex < totalQuestions - 1
                    ? "Lanjut"
                    : "Lihat Hasil"}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-orange-600 to-red-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
