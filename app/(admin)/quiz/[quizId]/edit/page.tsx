"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { Judul, Soal, Jawaban, BatchUpdatePayload } from "@/types/quiz";

// Helper to check if an ID is temporary (for new items)
const isTempId = (id: number) => id > 1_000_000_000;

export default function QuizEditPage({
  params,
}: {
  params: { quizId: string };
}) {
  const quizId = parseInt(params.quizId, 10);

  const [quizInfo, setQuizInfo] = useState<Judul | null>(null);
  const [questions, setQuestions] = useState<Soal[]>([]);
  const [answers, setAnswers] = useState<Jawaban[]>([]);

  // Store initial state to compare for changes
  const [initialQuestions, setInitialQuestions] = useState<Soal[]>([]);
  const [initialAnswers, setInitialAnswers] = useState<Jawaban[]>([]);

  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    const newQuestion: Soal = {
      id_soal: Date.now(),
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
    const newOption: Jawaban = {
      id_jawaban: Date.now(),
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
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/quiz" className="btn btn-ghost btn-circle">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Kelola Soal</h2>
            <p className="text-sm text-gray-500">
              {quizInfo?.judul || `Kuis ${quizId}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveChanges}
          className="btn bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 p-2 rounded-xl"
          disabled={saving}
        >
          {saving && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
              {questions.map((question, index) => (
                <div
                  key={question.id_soal}
                  className="flex items-center gap-1 group"
                >
                  <button
                    onClick={() => setActiveQuestionId(question.id_soal)}
                    className={`flex-grow text-left p-3 rounded-md font-medium transition-colors duration-200 ${
                      activeQuestionId === question.id_soal
                        ? "bg-red-100 text-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Soal {index + 1}
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id_soal)}
                    className="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-100 transition-opacity"
                    aria-label="Hapus soal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddQuestion}
                className="w-full mt-4 rounded-3xl py-2 px-4 bg-red-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-red-700"
              >
                <Plus size={16} className="mr-2" /> Tambah Soal Baru
              </button>
            </div>
          </aside>

          <section className="md:col-span-3">
            {activeQuestion ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="questionText"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Tulis Pertanyaan
                    </label>
                    <textarea
                      id="questionText"
                      rows={4}
                      className="textarea textarea-bordered w-full text-base text-gray-700 focus:ring-2 focus:ring-red-500"
                      placeholder="Contoh: Apa itu HIV?"
                      value={activeQuestion.pertanyaan}
                      onChange={(e) => handleQuestionTextChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pilihan Jawaban (Pilih yang benar)
                    </label>
                    <div className="space-y-3">
                      {activeQuestionAnswers.map((option) => (
                        <div
                          key={option.id_jawaban}
                          className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <input
                            type="radio"
                            name={`question-${activeQuestion.id_soal}`}
                            className="radio accent-red-600"
                            checked={!!option.is_correct}
                            onChange={() =>
                              handleSetCorrectAnswer(option.id_jawaban)
                            }
                          />
                          <input
                            type="text"
                            className="input input-bordered text-gray-700 flex-1 focus:ring-2 focus:ring-red-500"
                            placeholder={`Pilihan Jawaban`}
                            value={option.teks_jawaban}
                            onChange={(e) =>
                              handleOptionTextChange(
                                option.id_jawaban,
                                e.target.value
                              )
                            }
                          />
                          <button
                            onClick={() =>
                              handleDeleteOption(option.id_jawaban)
                            }
                            className="btn btn-square btn-ghost text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors"
                            aria-label="Hapus pilihan"
                            type="button"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddOption}
                      className="btn bg-blue-300 p-2 rounded-xl btn-sm text-black mt-4 hover:bg-blue-500 transition-colors"
                      type="button"
                    >
                      <Plus size={16} className="mr-1" /> Tambah Pilihan Jawaban
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-64 text-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  {questions.length > 0 ? "Pilih Soal" : "Tidak Ada Soal"}
                </h3>
                <p className="text-gray-500 mt-2">
                  {questions.length > 0
                    ? "Pilih soal dari daftar di sebelah kiri untuk mulai mengedit."
                    : "Kuis ini belum memiliki soal. Silakan tambahkan soal baru untuk memulai."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
