"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Save, CheckCircle2 } from "lucide-react";
import type { Judul, Soal, Jawaban, BatchUpdatePayload } from "@/types/quiz";

// Helper to check if an ID is temporary (for new items)
const isTempId = (id: number) => id > 1_000_000_000;

export default function QuizEditPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const resolvedParams = use(params);
  const quizId = parseInt(resolvedParams.quizId, 10);

  const [quizInfo, setQuizInfo] = useState<Judul | null>(null);
  const [questions, setQuestions] = useState<Soal[]>([]);
  const [answers, setAnswers] = useState<Jawaban[]>([]);

  // Store initial state to compare for changes
  const [initialQuestions, setInitialQuestions] = useState<Soal[]>([]);
  const [initialAnswers, setInitialAnswers] = useState<Jawaban[]>([]);

  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tempIdCounter, setTempIdCounter] = useState(0); // Counter for generating unique temp IDs

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [judulRes, soalRes] = await Promise.all([
        fetch(`/api/quiz/judul/${quizId}`),
        fetch(`/api/quiz/soal?id_judul=${quizId}`),
      ]);

      if (!judulRes.ok || !soalRes.ok)
        throw new Error("Gagal memuat data kuis.");

      const judulData = await judulRes.json();
      const soalData = await soalRes.json();

      setQuizInfo(judulData);
      setQuestions(soalData);
      setInitialQuestions(JSON.parse(JSON.stringify(soalData))); // Deep copy

      if (soalData.length > 0) {
        setActiveQuestionId(soalData[0].id_soal);
        const jawabanPromises = soalData.map((s: Soal) =>
          fetch(`/api/quiz/jawaban?id_soal=${s.id_soal}`).then((res) =>
            res.json()
          )
        );
        const jawabanDataArrays = await Promise.all(jawabanPromises);
        const allJawaban = jawabanDataArrays.flat();
        setAnswers(allJawaban);
        setInitialAnswers(JSON.parse(JSON.stringify(allJawaban))); // Deep copy
      } else {
        setAnswers([]);
        setInitialAnswers([]);
      }
    } catch (error) {
      let message = "Terjadi kesalahan";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeQuestion = questions.find((q) => q.id_soal === activeQuestionId);
  const activeQuestionAnswers = answers.filter(
    (a) => a.id_soal === activeQuestionId
  );

  const handleAddQuestion = () => {
    const newId = 1_000_000_000 + tempIdCounter;
    setTempIdCounter((prev) => prev + 1);

    const newQuestion: Soal = {
      id_soal: newId,
      id_judul: quizId,
      pertanyaan: "",
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestionId(newQuestion.id_soal);
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (!window.confirm("Yakin ingin menghapus soal ini beserta jawabannya?"))
      return;

    setQuestions(questions.filter((q) => q.id_soal !== questionId));
    setAnswers(answers.filter((a) => a.id_soal !== questionId));

    if (activeQuestionId === questionId) {
      setActiveQuestionId(
        questions.length > 1
          ? questions.filter((q) => q.id_soal !== questionId)[0].id_soal
          : null
      );
    }
  };

  const handleQuestionTextChange = (text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id_soal === activeQuestionId ? { ...q, pertanyaan: text } : q
      )
    );
  };

  const handleAddOption = () => {
    if (!activeQuestionId) return;

    const newId = 1_000_000_000 + tempIdCounter;
    setTempIdCounter((prev) => prev + 1);

    const newOption: Jawaban = {
      id_jawaban: newId,
      id_soal: activeQuestionId,
      teks_jawaban: "",
      is_correct: activeQuestionAnswers.length === 0,
    };
    setAnswers([...answers, newOption]);
  };

  const handleDeleteOption = (optionId: number) => {
    setAnswers(answers.filter((ans) => ans.id_jawaban !== optionId));
  };

  const handleOptionTextChange = (optionId: number, text: string) => {
    setAnswers(
      answers.map((ans) =>
        ans.id_jawaban === optionId ? { ...ans, teks_jawaban: text } : ans
      )
    );
  };

  const handleSetCorrectAnswer = (optionId: number) => {
    setAnswers(
      answers.map((ans) => {
        if (ans.id_soal === activeQuestionId) {
          return { ...ans, is_correct: ans.id_jawaban === optionId };
        }
        return ans;
      })
    );
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    const questions_to_add = questions.filter((q) => isTempId(q.id_soal));
    const questions_to_update = questions.filter(
      (q) =>
        !isTempId(q.id_soal) &&
        JSON.stringify(q) !==
          JSON.stringify(
            initialQuestions.find((iq) => iq.id_soal === q.id_soal)
          )
    );
    const questions_to_delete = initialQuestions
      .filter((iq) => !questions.some((q) => q.id_soal === iq.id_soal))
      .map((q) => q.id_soal);

    // 2. Identify new, updated, and deleted answers
    const answers_to_add = answers
      .filter((a) => isTempId(a.id_jawaban))
      .map(({ ...rest }) => rest);
    const answers_to_update = answers.filter(
      (a) =>
        !isTempId(a.id_jawaban) &&
        JSON.stringify(a) !==
          JSON.stringify(
            initialAnswers.find((ia) => ia.id_jawaban === a.id_jawaban)
          )
    );
    const answers_to_delete = initialAnswers
      .filter((ia) => !answers.some((a) => a.id_jawaban === ia.id_jawaban))
      .map((a) => a.id_jawaban);

    const payload: BatchUpdatePayload = {
      questions_to_add,
      questions_to_update,
      questions_to_delete,
      answers_to_add,
      answers_to_update,
      answers_to_delete,
    };

    try {
      const res = await fetch(`/api/quiz/manage/${quizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menyimpan perubahan.");
      }

      toast.success("Perubahan berhasil disimpan!");
      // Refresh data from server to get new IDs and confirm changes
      await fetchData();
    } catch (error) {
      let message = "Gagal menyimpan perubahan.";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm sm:text-base text-gray-600 font-medium text-center">
          Memuat data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header with Glass Effect - Responsive */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/quiz"
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-gray-700" />
              </Link>
              <div className="flex-1">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Kelola Soal
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate max-w-[200px] sm:max-w-none">
                  {quizInfo?.judul || `Kuis ${quizId}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveChanges}
              className="group relative px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={saving}
            >
              <span className="flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Menyimpan...</span>
                    <span className="sm:hidden">Simpan...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="hidden sm:inline">Simpan Perubahan</span>
                    <span className="sm:hidden">Simpan</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Enhanced Sidebar - Responsive */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Daftar Soal
                </h3>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                  {questions.length}
                </span>
              </div>

              <div className="space-y-2 max-h-[200px] sm:max-h-[300px] lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {questions.map((question, index) => (
                  <div key={question.id_soal} className="group relative">
                    <button
                      onClick={() => setActiveQuestionId(question.id_soal)}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-between ${
                        activeQuestionId === question.id_soal
                          ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 shadow-sm border border-red-100"
                          : "text-gray-700 hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-bold ${
                            activeQuestionId === question.id_soal
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs sm:text-sm">
                          Soal {index + 1}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id_soal)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                      aria-label="Hapus soal"
                    >
                      <Trash2 size={14} className="sm:w-[14px] sm:h-[14px]" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddQuestion}
                className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Tambah Soal</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            </div>
          </aside>

          {/* Enhanced Main Content - Responsive */}
          <section className="lg:col-span-9">
            {activeQuestion ? (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="space-y-6 sm:space-y-8">
                  {/* Question Section - Responsive */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-red-600 to-rose-600 rounded-full"></div>
                      <label
                        htmlFor="questionText"
                        className="text-sm sm:text-base font-bold text-gray-800"
                      >
                        Pertanyaan
                      </label>
                    </div>
                    <textarea
                      id="questionText"
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all duration-200 resize-none"
                      placeholder="Contoh: Apa yang dimaksud dengan HIV/AIDS?"
                      value={activeQuestion.pertanyaan}
                      onChange={(e) => handleQuestionTextChange(e.target.value)}
                    />
                  </div>

                  {/* Divider - Responsive */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 sm:px-4 bg-white text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Pilihan Jawaban
                      </span>
                    </div>
                  </div>

                  {/* Options Section - Responsive */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
                        <label className="text-sm sm:text-base font-bold text-gray-800">
                          Opsi Jawaban
                        </label>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit">
                        Pilih jawaban yang benar
                      </span>
                    </div>

                    <div className="space-y-3">
                      {activeQuestionAnswers.map((option, idx) => (
                        <div
                          key={option.id_jawaban}
                          className={`group relative rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                            option.is_correct
                              ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-300 shadow-md ring-2 ring-emerald-100"
                              : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-stretch">
                            {/* Left Section: Radio + Badge */}
                            <div
                              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 border-r-2 ${
                                option.is_correct
                                  ? "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              {/* Radio Button Container */}
                              <label
                                htmlFor={`option-${option.id_jawaban}`}
                                className="relative flex items-center justify-center cursor-pointer group/radio"
                              >
                                <input
                                  type="radio"
                                  id={`option-${option.id_jawaban}`}
                                  name={`question-${activeQuestion.id_soal}`}
                                  className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 border-2 border-gray-400 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-all hover:border-emerald-500"
                                  checked={!!option.is_correct}
                                  onChange={() =>
                                    handleSetCorrectAnswer(option.id_jawaban)
                                  }
                                />
                                {option.is_correct && (
                                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-600 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                                    <CheckCircle2
                                      size={10}
                                      className="sm:w-3 sm:h-3 text-white"
                                    />
                                  </div>
                                )}
                              </label>

                              {/* Option Letter Badge */}
                              <div
                                className={`flex items-center justify-center min-w-[28px] sm:min-w-[36px] h-8 sm:h-9 px-1.5 sm:px-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                                  option.is_correct
                                    ? "bg-gradient-to-br from-emerald-600 to-green-600 text-white shadow-sm"
                                    : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700"
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}
                              </div>
                            </div>

                            {/* Middle Section: Input Field */}
                            <div className="flex-1 p-2 sm:p-3">
                              <input
                                type="text"
                                className={`w-full px-2 sm:px-3 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none text-sm md:text-base ${
                                  option.is_correct
                                    ? "bg-white border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 text-gray-800 font-medium"
                                    : "bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-gray-700"
                                }`}
                                placeholder={`Pilihan ${String.fromCharCode(
                                  65 + idx
                                )}...`}
                                value={option.teks_jawaban}
                                onChange={(e) =>
                                  handleOptionTextChange(
                                    option.id_jawaban,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Right Section: Delete Button */}
                            <div className="flex items-center px-1 sm:px-2">
                              <button
                                onClick={() =>
                                  handleDeleteOption(option.id_jawaban)
                                }
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 md:hover:scale-110 active:scale-95"
                                aria-label="Hapus pilihan"
                                type="button"
                              >
                                <Trash2
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                            </div>
                          </div>

                          {/* Correct Answer Indicator Badge */}
                          {option.is_correct && (
                            <div className="absolute top-0 right-0 px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[10px] sm:text-xs font-bold rounded-bl-lg rounded-tr-xl shadow-sm animate-in slide-in-from-right duration-300">
                              ✓ Benar
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Option Button - Responsive */}
                    <button
                      onClick={handleAddOption}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-300 text-blue-700 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-sm"
                      type="button"
                    >
                      <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="hidden sm:inline">
                        Tambah Pilihan Jawaban
                      </span>
                      <span className="sm:hidden">Tambah Pilihan</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[400px] sm:min-h-[500px]">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <Plus size={28} className="sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  {questions.length > 0 ? "Pilih Soal" : "Belum Ada Soal"}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md px-4">
                  {questions.length > 0
                    ? "Pilih soal dari daftar di sebelah kiri untuk mulai mengedit."
                    : "Kuis ini belum memiliki soal. Klik tombol 'Tambah Soal' untuk memulai membuat kuis."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
