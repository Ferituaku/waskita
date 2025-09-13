"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Pagination from "../../../components/dashboard/Pagination";
import Modal from "@/components/Modal";
import {
  Plus,
  Search,
  FileImage,
  AlignJustify,
  Layers,
  Wrench,
  Pencil,
  Trash2,
} from "lucide-react";

const mockData = [
  {
    id: 1,
    judul:
      "Peer Education: Pendekatan Inovatif dalam Meningkatkan Kesadaran Remaja tentang HIV AIDS",
    tipe: "Artikel",
  },
  {
    id: 2,
    judul: "Concanamycin A (CMA) Terobosan dalam Upaya Penyembuhan HIV AIDS",
    tipe: "Artikel",
  },
  {
    id: 3,
    judul: "ARV: Kontrak Hidup Seorang Ibu dengan HIV",
    tipe: "Artikel",
  },
  {
    id: 4,
    judul: "Cara Mudah Untuk Cegah Penularan HIV AIDS dengan Metode ABCDE",
    tipe: "Artikel",
  },
  { id: 5, judul: "Pergaulan Bebas dan HIV AIDS", tipe: "PPT" },
];

type ModalType = "add" | "edit" | "delete" | "cover";

const MateriPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: any;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  const renderModalContent = () => {
    if (!modal.isOpen) return null;

    switch (modal.type) {
      case "add":
      case "edit":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title={modal.type === "add" ? "Tambah Materi Baru" : "Edit Materi"}
          >
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="judul"
                  className="block text-sm font-medium text-gray-900"
                >
                  Judul
                </label>
                <input
                  type="text"
                  id="judul"
                  defaultValue={modal.data?.judul || ""}
                  className="mt-1 block w-full text-gray-600 input input-bordered"
                  placeholder="Masukkan judul materi"
                />
              </div>
              <div>
                <label
                  htmlFor="tipe"
                  className="block text-sm font-medium text-gray-900"
                >
                  Tipe
                </label>
                <select
                  id="tipe"
                  defaultValue={modal.data?.tipe || "Artikel"}
                  className="mt-1 block w-full text-gray-600 select select-bordered"
                >
                  <option>Artikel</option>
                  <option>PPT</option>
                  <option>Video</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  Simpan
                </button>
              </div>
            </form>
          </Modal>
        );
      case "cover":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title="Ganti Cover Materi"
          >
            <p className="text-sm text-gray-500 mb-4">
              Mengganti cover untuk:{" "}
              <span className="font-semibold">{modal.data?.judul}</span>
            </p>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="cover-file"
                  className="block text-sm font-medium text-gray-900"
                >
                  Upload file baru
                </label>
                <input
                  type="file"
                  id="cover-file"
                  className="file-input file-input-bordered file-input-primary w-full mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload
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
              Apakah Anda yakin ingin menghapus materi{" "}
              <span className="font-bold text-gray-800">
                "{modal.data?.judul}"
              </span>
              ?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="btn bg-red-600 hover:bg-red-400 text-white py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
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
      <Header title="Materi" />
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
                <button className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md">
                  10
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-900">
              <thead className="text-xs text-gray-800 font-semibold border-b-2 border-gray-200">
                <tr>
                  <th scope="col" className="p-4 w-12 text-left">
                    No
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <FileImage size={16} /> Cover
                    </div>
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <AlignJustify size={16} /> Judul
                    </div>
                  </th>
                  <th scope="col" className="p-4 w-40">
                    <div className="flex items-center gap-2">
                      <Layers size={16} /> Tipe
                    </div>
                  </th>
                  <th scope="col" className="p-4 w-48">
                    <div className="flex items-center gap-2">
                      <Wrench size={16} /> Action
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          setModal({ isOpen: true, type: "cover", data: item })
                        }
                        className="bg-gray-200 rounded-md w-24 h-16 flex items-center justify-center text-gray-500 text-xs font-medium hover:bg-gray-300 hover:text-gray-600 transition-colors"
                      >
                        Cover
                      </button>
                    </td>
                    <td className="p-4 font-medium text-gray-800 max-w-sm">
                      {item.judul}
                    </td>
                    <td className="p-4">{item.tipe}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Render Modals */}
      {renderModalContent()}
    </>
  );
};

export default MateriPage;
