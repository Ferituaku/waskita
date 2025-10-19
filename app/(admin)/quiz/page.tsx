//app/(admin)/quiz/page.tsx:
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Pagination from "@/components/dashboard/Pagination";
import Modal from "@/components/Modal";
import SkeletonTable from "@/components/SkeletonTable";
import { Judul } from "@/types/quiz";

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

type ModalType = "add" | "edit" | "delete";

const QuizPage: React.FC = () => {
  const [quizList, setQuizList] = useState<Judul[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: Judul;
  }>({
    isOpen: false,
    type: null,
    data: undefined,
  });

  // const router = useRouter();

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const entriesOptions = [5, 10, 20, 50];

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz/judul");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setQuizList(data);
    } catch (err) {
      console.error("Gagal ambil data kuis:", err);
      toast.error("Gagal mengambil daftar kuis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const closeModal = () =>
    setModal({ isOpen: false, type: null, data: undefined });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const judul = formData.get("judul") as string;

    const promise =
      modal.type === "add"
        ? fetch("/api/quiz/judul", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judul }),
          })
        : fetch(`/api/quiz/judul/${modal.data?.id_judul}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judul }),
          });

    toast.promise(promise, {
      loading: "Menyimpan...",
      success: (res) => {
        if (!res.ok) throw new Error("Gagal menyimpan.");
        closeModal();
        fetchQuiz(); // Re-fetch server-side props, updating the list
        return modal.type === "add"
          ? "Kuis berhasil dibuat!"
          : "Kuis berhasil diperbarui!";
      },
      error: "Gagal menyimpan kuis.",
    });
  };

  const handleDelete = async () => {
    if (modal.data) {
      const promise = fetch(`/api/quiz/judul/${modal.data.id_judul}`, {
        method: "DELETE",
      });

      toast.promise(promise, {
        loading: "Menghapus...",
        success: (res) => {
          if (!res.ok) throw new Error("Gagal menghapus.");
          closeModal();
          fetchQuiz(); // Update the list after deletion
          return "Kuis berhasil dihapus!";
        },
        error: "Gagal menghapus kuis.",
      });
    }
  };

  const filteredQuizList = useMemo(() => {
    return quizList.filter((quiz) =>
      quiz.judul.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [quizList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuizList.length / entriesPerPage);
  const paginatedQuiz = filteredQuizList.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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
                  className="text-gray-700 mt-1 block w-full input input-bordered"
                  placeholder="Masukkan judul kuis"
                  required
                />
              </div>
              {modal.type === "edit" && (
                <div className="pt-2">
                  <Link
                    href={`/quiz/${modal.data?.id_judul}/edit`}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <Wrench size={16} /> Kelola Soal & Jawaban
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
                &quot;{modal.data?.judul}&quot;
              </span>
              ? Tindakan ini tidak dapat diurungkan.
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
                className="btn bg-red-600 hover:bg-red-800 text-white py-2 px-3 rounded-lg"
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

  return (
    <>
      <Header title="Kelola Quiz" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button
              onClick={() =>
                setModal({ isOpen: true, type: "add", data: undefined })
              }
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span>Tambah Data</span>
            </button>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari judul video..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-700 placeholder-gray-400 shadow-sm transition-all"
                />
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-red-300 shadow-sm">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Per Halaman:
                </span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-sm font-medium text-red-600 bg-red-100 border border-red-300 rounded-lg px-3 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {entriesOptions.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      className="bg-white text-black"
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

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
                  <th scope="col" className="p-4 w-48">
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
              {loading ? (
                <SkeletonTable rows={5} cols={4} />
              ) : (
                <tbody>
                  {paginatedQuiz.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-400"
                      >
                        {searchQuery
                          ? `Tidak ada kuis dengan judul "${searchQuery}".`
                          : "Tidak ada data kuis."}
                      </td>
                    </tr>
                  ) : (
                    paginatedQuiz.map((item, index) => (
                      <tr
                        key={item.id_judul}
                        className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                      >
                        <td className="p-4 font-medium text-gray-900">
                          {(currentPage - 1) * entriesPerPage + index + 1}
                        </td>
                        <td className="p-4 font-medium text-gray-800 max-w-sm truncate">
                          {item.judul}
                        </td>
                        <td className="p-4">
                          {formatDate(item.tanggal_terbuat)}
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
                                setModal({
                                  isOpen: true,
                                  type: "edit",
                                  data: item,
                                })
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
                              className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-3 rounded-md flex items-center gap-1.5 text-xs transition-colors"
                            >
                              <Trash2 size={14} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          </div>

          {!loading && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {renderModalContent()}
    </>
  );
};

export default QuizPage;
