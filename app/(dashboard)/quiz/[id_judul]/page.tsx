"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface SoalItem {
  id_soal: number;
  id_judul: number;
  pertanyaan: string;
}

type ModalType = "add" | "edit" | "delete";

const SoalPage: React.FC = () => {
  const params = useParams();
  const id_judul = params?.id_judul as string;

  const [soalList, setSoalList] = useState<SoalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: SoalItem | null;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  // fetch soal by id_judul
  const fetchSoal = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/soal?id_judul=${id_judul}`);
      const data = await res.json();
      setSoalList(data);
    } catch (err) {
      console.error("Gagal ambil data soal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoal();
  }, [id_judul]);

  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  // Tambah / Update soal
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pertanyaan = formData.get("pertanyaan") as string;

    if (modal.type === "add") {
      await fetch(`/api/quiz/soal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_judul, pertanyaan }),
      });
    } else if (modal.type === "edit" && modal.data) {
      await fetch(`/api/quiz/soal/${modal.data.id_soal}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pertanyaan }),
      });
    }

    closeModal();
    fetchSoal();
  };

  // Hapus soal
  const handleDelete = async () => {
    if (modal.data) {
      await fetch(`/api/quiz/soal/${modal.data.id_soal}`, {
        method: "DELETE",
      });
      closeModal();
      fetchSoal();
    }
  };

  // modal form
  const renderModalContent = () => {
    if (!modal.isOpen) return null;

    switch (modal.type) {
      case "add":
      case "edit":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title={modal.type === "add" ? "Tambah Soal" : "Edit Soal"}
          >
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label
                  htmlFor="pertanyaan"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pertanyaan
                </label>
                <input
                  type="text"
                  id="pertanyaan"
                  name="pertanyaan"
                  defaultValue={modal.data?.pertanyaan || ""}
                  className="mt-1 block w-full input input-bordered"
                  placeholder="Masukkan pertanyaan"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg"
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
              Apakah Anda yakin ingin menghapus soal
              <span className="font-bold text-gray-800">
                {` "${modal.data?.pertanyaan}"`}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Daftar Soal</h2>
          <div className="flex gap-2">
            <Link
              href="/quiz"
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-lg"
            >
              Kembali
            </Link>
            <button
              onClick={() => setModal({ isOpen: true, type: "add", data: null })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Tambah Soal
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs text-gray-800 font-semibold border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 w-12">No</th>
                  <th className="p-4">Pertanyaan</th>
                  <th className="p-4 w-40">Action</th>
                </tr>
              </thead>
              <tbody>
                {soalList.map((item, idx) => (
                  <tr key={item.id_soal} className="hover:bg-gray-50 border-b">
                    <td className="p-4">{idx + 1}</td>
                    <td className="p-4">{item.pertanyaan}</td>
                    <td className="p-4 flex gap-2">
  {/* Edit Soal */}
  <button
    onClick={() =>
      setModal({ isOpen: true, type: "edit", data: item })
    }
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-md text-xs flex items-center gap-1"
  >
    <Pencil size={14} /> Edit Soal
  </button>

  {/* Edit Jawaban */}
  <Link
    href={`/quiz/${id_judul}/${item.id_soal}/1`} // nanti id_jawaban diganti dari API
    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md text-xs flex items-center gap-1"
  >
    <Pencil size={14} /> Edit Jawaban
  </Link>

  {/* Hapus Soal */}
  <button
    onClick={() =>
      setModal({ isOpen: true, type: "delete", data: item })
    }
    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md text-xs flex items-center gap-1"
  >
    <Trash2 size={14} /> Hapus
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {renderModalContent()}
    </div>
  );
};

export default SoalPage;
