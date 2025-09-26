"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  mockJudul,
  mockSoal,
  mockJawaban,
  type Soal,
  type Jawaban,
} from "@/lib/mock-data";

export default function QuizEditPage({
  params,
}: {
  params: { quizId: string };
}) {
  const quizId = parseInt(params.quizId, 10);
  const quizInfo = mockJudul.find((j) => j.id_judul === quizId);

  // Initialize state with data from the centralized mock file
  const [questions, setQuestions] = useState<Soal[]>(
    mockSoal.filter((s) => s.id_judul === quizId)
  );
  const [answers, setAnswers] = useState<Jawaban[]>(mockJawaban);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(
    questions.length > 0 ? questions[0].id_soal : null
  );

  const activeQuestion = questions.find((q) => q.id_soal === activeQuestionId);
  const activeQuestionAnswers = answers.filter(
    (a) => a.id_soal === activeQuestionId
  );

  const handleAddQuestion = () => {
    const newQuestion: Soal = {
      id_soal: Date.now(), // Unique ID for new question
      id_judul: quizId,
      pertanyaan: "",
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    setActiveQuestionId(newQuestion.id_soal);
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
      id_jawaban: Date.now(), // Unique ID for new answer
      id_soal: activeQuestionId,
      teks_jawaban: "",
      is_correct: activeQuestionAnswers.length === 0, // Make first answer correct by default
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

  const handleSaveChanges = () => {
    // Filter out answers for questions that might have been deleted but are still in the answers state
    const relevantAnswers = answers.filter((a) =>
      questions.some((q) => q.id_soal === a.id_soal)
    );
    console.log("Saving changes for quiz:", quizInfo);
    console.log("Questions:", questions);
    console.log("Answers:", relevantAnswers);
    // In a real app, this would be an API call, e.g.,
    // await fetch(`/api/quizzes/${quizId}`, { method: 'PUT', body: JSON.stringify({ questions, answers }) });
    alert("Perubahan disimpan (lihat console log)!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Halaman */}
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
        <button onClick={handleSaveChanges} className="btn btn-info text-white">
          Simpan Perubahan
        </button>
      </header>

      {/* Kontainer Utama */}
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kolom Kiri: Daftar Soal */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
              {questions.map((question, index) => (
                <button
                  key={question.id_soal}
                  onClick={() => setActiveQuestionId(question.id_soal)}
                  className={`w-full text-left p-3 rounded-md font-medium transition-colors duration-200 ${
                    activeQuestionId === question.id_soal
                      ? "bg-red-100 text-gray-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Soal {index + 1}
                </button>
              ))}
              <button
                onClick={handleAddQuestion}
                className="w-full mt-4 rounded-3xl py-2 px-4 bg-red-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-red-700"
              >
                <Plus size={16} className="mr-2" /> Tambah Soal Baru
              </button>
            </div>
          </aside>

          {/* Kolom Kanan: Editor Soal */}
          <section className="md:col-span-3">
            {activeQuestion ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  {/* Form Pertanyaan */}
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
                      className="textarea text-gray-400 w-full text-base focus:ring-2 focus:ring-red-500"
                      placeholder="Contoh: Apa itu HIV?"
                      value={activeQuestion.pertanyaan}
                      onChange={(e) => handleQuestionTextChange(e.target.value)}
                    />
                  </div>
                  {/* Form Pilihan Jawaban */}
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
                            checked={option.is_correct}
                            onChange={() =>
                              handleSetCorrectAnswer(option.id_jawaban)
                            }
                          />
                          <input
                            type="text"
                            className="input input-bordered text-gray-400 flex-1 focus:ring-2 focus:ring-red-500"
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
                            className="btn btn-square text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors"
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
                      className="btn btn-ghost btn-sm text-red-600 mt-4 hover:bg-red-50 transition-colors"
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
                  Tidak Ada Soal
                </h3>
                <p className="text-gray-500 mt-2">
                  Kuis ini belum memiliki soal. Silakan tambahkan soal baru
                  untuk memulai.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
