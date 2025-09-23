"use client";

import React, { useState } from "react";
import Header from "../../../components/Header";
import Pagination from "../../../components/dashboard/Pagination";
import Modal from "../../../components/Modal";
import {
  Plus,
  Search,
  Youtube,
  Link2,
  Calendar,
  Wrench,
  Pencil,
  Trash2,
} from "lucide-react";
interface VideoEdukasi {
  id: number;
  judul: string;
  link: string;
  tanggalDitambahkan: string;
}

const mockVideoData: VideoEdukasi[] = [
  {
    id: 1,
    judul: "Memahami HIV & AIDS dalam 5 Menit",
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tanggalDitambahkan: "2025-09-16",
  },
  {
    id: 2,
    judul: "Pencegahan adalah Kunci Utama Melawan AIDS",
    link: "https://www.youtube.com/watch?v=tILGAq24Jqs",
    tanggalDitambahkan: "2025-09-15",
  },
  {
    id: 3,
    judul: "Hidup Sehat dan Berkualitas dengan HIV",
    link: "https://www.youtube.com/watch?v=ghijkl67890",
    tanggalDitambahkan: "2025-09-14",
  },
];

type ModalType = "add" | "edit" | "delete";

const VideoEdukasiPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: VideoEdukasi | null;
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
            title={
              modal.type === "add"
                ? "Tambah Video Edukasi Baru"
                : "Edit Video Edukasi"
            }
          >
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="judul"
                  className="block text-sm font-medium text-gray-700"
                >
                  Judul Video
                </label>
                <input
                  type="text"
                  id="judul"
                  defaultValue={modal.data?.judul || ""}
                  className="mt-1 border-1 rounded-md block w-full input input-bordered text-gray-300 focus:text-gray-500"
                  placeholder="Masukkan judul video"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="link"
                  className="block text-sm font-medium text-gray-700"
                >
                  Link YouTube
                </label>
                <input
                  type="url"
                  id="link"
                  defaultValue={modal.data?.link || ""}
                  className="mt-1 block border-1 rounded-md w-full input input-bordered text-gray-300 focus:text-gray-500"
                  placeholder="https://www.youtube.com/watch?v=xxxx"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Pastikan link valid, contoh:
                  https://www.youtube.com/watch?v=xxxx
                </p>
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
      case "delete":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title="Konfirmasi Hapus"
          >
            <p className="text-sm text-gray-600">
              {`Apakah Anda yakin ingin menghapus video `}
              <span className="font-bold text-gray-800">
                {`"${modal.data?.judul}"`} {/* Perbaikan di sini */}
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
      <Header title="Video Edukasi" />
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
                <label htmlFor="entries-per-page" className="whitespace-nowrap">
                  Entries per Page:
                </label>
                <select
                  id="entries-per-page"
                  className="select select-sm select-bordered text-white p-1 bg-red-600 hover:bg-red-700 rounded-xl w-13 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  defaultValue={10}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
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
                      <Youtube size={16} /> Thumbnail
                    </div>
                  </th>
                  <th scope="col" className="p-4">
                    Judul Video
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <Link2 size={16} /> Link YouTube
                    </div>
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> Tanggal Ditambahkan
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
                {mockVideoData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <div className="bg-gray-200 rounded-md w-28 h-16 flex items-center justify-center text-gray-500 text-xs font-medium">
                        Thumbnail
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800 max-w-sm">
                      {item.judul}
                    </td>
                    <td className="p-4">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block max-w-xs"
                      >
                        {item.link}
                      </a>
                    </td>
                    <td className="p-4">{item.tanggalDitambahkan}</td>
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

export default VideoEdukasiPage;
