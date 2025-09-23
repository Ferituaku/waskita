"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

// Definisikan tipe data untuk kejelasan
interface AnswerOption {
  id: number;
  text: string;
}

interface Question {
  id: number;
  questionText: string;
  options: AnswerOption[];
  correctAnswerId: number | null;
}

// Mock data awal untuk memulai (belum terintgrasi db dari backend)
const mockQuestions: Question[] = [
  {
    id: 1,
    questionText: "Apa kepanjangan dari HIV?",
    options: [
      { id: 1, text: "Human Immunodeficiency Virus" },
      { id: 2, text: "Human Infection Virus" },
      { id: 3, text: "Hepatitis Infection Virus" },
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
];
interface PageProps {
  params: {
    quizId: string;
  };
}
export default function QuizEditPage({ params }: PageProps) {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(
    mockQuestions[0]?.id || null
  );

  const activeQuestion = questions.find((q) => q.id === activeQuestionId);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      questionText: "",
      options: [],
      correctAnswerId: null,
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  const updateQuestion = (updatedQuestion: Partial<Question>) => {
    setQuestions(
      questions.map((q) =>
        q.id === activeQuestionId ? { ...q, ...updatedQuestion } : q
      )
    );
  };

  const handleAddOption = () => {
    if (!activeQuestion) return;
    const newOption: AnswerOption = { id: Date.now(), text: "" };
    updateQuestion({ options: [...activeQuestion.options, newOption] });
  };

  const handleDeleteOption = (optionId: number) => {
    if (!activeQuestion) return;
    const updatedOptions = activeQuestion.options.filter(
      (opt) => opt.id !== optionId
    );
    updateQuestion({ options: updatedOptions });
  };

  const handleOptionTextChange = (optionId: number, text: string) => {
    if (!activeQuestion) return;
    const updatedOptions = activeQuestion.options.map((opt) =>
      opt.id === optionId ? { ...opt, text } : opt
    );
    updateQuestion({ options: updatedOptions });
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", questions);
    //implementasiin logika handle simpan dia punya perubahan disini, e.g., API call
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Halaman */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/quiz"
            className="btn  btn-circle hover:text-gray-500 hover:bg-gray-300 text-gray-700 font-medium py-2 px-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Kelola Soal</h2>
            <p className="text-sm text-gray-500">
              QUIZ {params.quizId}: Bahaya AIDS
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveChanges}
          className="btn bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
        >
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
                  key={question.id}
                  onClick={() => setActiveQuestionId(question.id)}
                  className={`w-full text-left p-3 rounded-md font-medium transition-colors duration-200 ${
                    activeQuestionId === question.id
                      ? "bg-red-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Soal {index + 1}
                </button>
              ))}
              <button
                onClick={handleAddQuestion}
                className="btn text-gray-700 bg-yellow-200 w-full mt-4 col-span-1 flex items-center justify-center gap-1 rounded-lg hover:bg-yellow-300 transition-colors duration-200"
              >
                <span>
                  <Plus size={20} className="mr-2" />
                </span>
                Tambah Soal Baru
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
                      className="textarea border-1 border-gray-800  rounded-lg p-1 textarea-bordered w-full text-gray-700"
                      placeholder="Contoh: Apa itu HIV?"
                      value={activeQuestion.questionText}
                      onChange={(e) =>
                        updateQuestion({ questionText: e.target.value })
                      }
                    />
                  </div>
                  {/* Form Pilihan Jawaban */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pilihan Jawaban (Pilih yang benar)
                    </label>
                    <div className="space-y-3">
                      {activeQuestion.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="radio"
                            name={`question-${activeQuestion.id}`}
                            className="radio radio-gray-900"
                            checked={
                              activeQuestion.correctAnswerId === option.id
                            }
                            onChange={() =>
                              updateQuestion({ correctAnswerId: option.id })
                            }
                          />
                          <input
                            type="text"
                            className="input input-bordered text-gray-600 flex-1"
                            placeholder={`Pilihan ${option.id}`}
                            value={option.text}
                            onChange={(e) =>
                              handleOptionTextChange(option.id, e.target.value)
                            }
                          />
                          <button
                            onClick={() => handleDeleteOption(option.id)}
                            className="btn btn-ghost btn-square text-gray-400 hover:text-red-500 hover:bg-red-50"
                            aria-label="Hapus pilihan"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddOption}
                      className="btn text-gray-700 bg-yellow-200 w-full mt-4 col-span-1 flex items-center justify-center gap-1 rounded-lg hover:bg-yellow-300 transition-colors duration-200"
                    >
                      <span>
                        <Plus size={20} className="mr-2" />
                      </span>
                      Tambah Soal Baru
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">
                  Pilih soal untuk diedit atau buat soal baru.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
