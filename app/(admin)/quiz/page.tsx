"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Pagination from "@/components/dashboard/Pagination";
import Modal from "@/components/Modal";
import {
  Plus,
  Search,
  AlignJustify,
  Users,
  Wrench,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { mockJudul } from "../../../lib/mock-data";

type ModalType = "add" | "edit" | "delete" | "cover";

interface QuizItem {
  id_judul: number;
  judul: string;
  jumlah_registrasi: number;
  cover?: string | null;
}

const QuizPage: React.FC = () => {
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: any;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  // Fetch data dari backend
  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/judul");
      const data = await res.json();
      setQuizList(data);
    } catch (err) {
      console.error("Gagal ambil data kuis:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const closeModal = () =>
    setModal({ isOpen: false, type: null, data: null });

  // Tambah / Update
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const judul = formData.get("judul") as string;

    if (modal.type === "add") {
      await fetch("/api/quiz/judul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, jumlah_registrasi: 0, cover: null }),
      });
    } else if (modal.type === "edit" && modal.data) {
      await fetch(`/api/quiz/judul/${modal.data.id_judul}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          jumlah_registrasi: modal.data.jumlah_registrasi,
          cover: modal.data.cover,
        }),
      });
    }

    closeModal();
    fetchQuiz();
  };

  // Delete
  const handleDelete = async () => {
    if (modal.data) {
      await fetch(`/api/quiz/judul/${modal.data.id_judul}`, {
        method: "DELETE",
      });
      closeModal();
      fetchQuiz();
    }
  };

  const renderModalContent = () => {
    if (!modal.isOpen) return null;

    switch (modal.type) {
      case "add":
      case "edit":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title={modal.type === "add" ? "Tambah Kuis Baru" : "Edit Kuis"}
          >
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label
                  htmlFor="judul"
                  className="block text-sm font-medium text-gray-700"
                >
                  Judul Kuis
                </label>
                <input
                  type="text"
                  id="judul"
                  name="judul"
                  defaultValue={modal.data?.judul || ""}
                  className="text-gray-400 mt-1 block w-full input input-bordered"
                  placeholder="Masukkan judul kuis"
                  required
                />
              </div>
              {modal.type === "edit" && (
                <div className="pt-2">
                  <Link
                    href={`/quiz/${modal.data?.id_judul}/edit`}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-48 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    Kelola Soal & Jawaban
                  </Link>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          </Modal>
        );
      case "delete":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title="Konfirmasi Hapus"
          >
            <p className="text-sm text-gray-600">
              Apakah Anda yakin ingin menghapus kuis{" "}
              <span className="font-bold text-gray-800">
                "{modal.data?.judul}"
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg"
              >
                Ya, Hapus
              </button>
            </div>
          </Modal>
        );
      default:
        return null;
    }
  };
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const entriesOptions = [5, 10, 20, 50];

  return (
    <>
      <Header title="Quiz" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button
              onClick={() =>
                setModal({ isOpen: true, type: "add", data: null })
              }
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Tambah Data</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Jelajahi Halaman..."
                  className="pl-12 pr-4 py-2 border text-gray-500 border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Entries per Page:</span>
                <select
                  className="bg-red-600 text-white font-semibold py-1 px-1 rounded-md focus:outline-none"
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                >
                  {entriesOptions.map((opt) => (
                    <option key={opt} value={opt} className="text-black">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-800 font-semibold border-b-2 border-gray-200">
                <tr>
                  <th scope="col" className="p-4 w-12 text-left">
                    No
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <AlignJustify size={16} /> Judul
                    </div>
                  </th>
                  <th scope="col" className="p-4 w-40">
                    <div className="flex items-center gap-2">
                      <Users size={16} /> Tanggal Terbuat
                    </div>
                  </th>
                  <th scope="col" className="p-4 w-60">
                    <div className="flex items-center gap-2">
                      <Wrench size={16} /> Action
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockJudul.map((item, index) => (
                <thead>
                  <tr
                    key={item.id_judul}
                    className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="p-4 font-medium text-gray-800 max-w-sm">
                      {item.judul}
                    </td>
                    <td className="p-4">
                      {item.tanggal_terbuat instanceof Date
                        ? item.tanggal_terbuat.toLocaleDateString()
                        : item.tanggal_terbuat}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/quiz/${item.id_judul}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-md flex items-center gap-1.5 text-xs transition-colors"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() =>
                            setModal({ isOpen: true, type: "edit", data: item })
                          }
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md flex items-center gap-1.5 text-xs transition-colors"
                        >
                          <Pencil size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() =>
                            setModal({
                              isOpen: true,
                              type: "delete",
                              data: item,
                            })
                          }
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md flex items-center gap-1.5 text-xs transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {quizList.map((item, index) => (
                    <tr
                      key={item.id_judul}
                      className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="p-4">{item.judul}</td>
                      <td className="p-4">{item.jumlah_registrasi}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/quiz/${item.id_judul}`}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded-md text-xs"
                          >
                            <Eye size={14} />Edit Soal
                          </Link>
                          <button
                            onClick={() =>
                              setModal({
                                isOpen: true,
                                type: "edit",
                                data: item,
                              })
                            }
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md text-xs"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() =>
                              setModal({
                                isOpen: true,
                                type: "delete",
                                data: item,
                              })
                            }
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md text-xs"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Render Modals */}
      {renderModalContent()}
    </>
  );
};

export default QuizPage;
