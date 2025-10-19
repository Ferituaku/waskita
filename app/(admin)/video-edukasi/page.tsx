"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image"; // <-- PERUBAHAN: Ditambahkan
import {
  Plus,
  Search,
  Youtube,
  Link2,
  Calendar,
  Pencil,
  Trash2,
  Loader2,
  Play,
  ExternalLink,
  Video,
} from "lucide-react";
import Header from "@/components/Header";
import SkeletonTable from "@/components/SkeletonTable";

interface VideoEdukasi {
  id: number;
  judul: string;
  link: string;
  tanggal_ditambahkan: string;
}

type ModalType = "add" | "edit" | "delete";

const VideoEdukasiPage: React.FC = () => {
  const [videos, setVideos] = useState<VideoEdukasi[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoEdukasi[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  // PERUBAHAN 1: Set state loading awal ke true
  const [pageLoading, setPageLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
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

  const [formData, setFormData] = useState({
    judul: "",
    link: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      // Tidak perlu setPageLoading(true) di sini lagi jika default-nya true
      const response = await fetch("/api/videos");
      const result = await response.json();

      if (result.success) {
        setVideos(result.data);
      } else {
        showToast("error", "Gagal mengambil data video");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      showToast("error", "Terjadi kesalahan saat mengambil data");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Extract YouTube Video ID
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Filter videos based on search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(
        (video) =>
          video.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.link.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, videos]);

  const entriesOptions = [5, 10, 20, 50];

  // Pagination
  const totalPages = Math.ceil(filteredVideos.length / entriesPerPage);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // Format date to Indonesian
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const showToast = (type: "success" | "error", message: string) => {
    // Simple toast notification
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
    setFormData({ judul: "", link: "" });
    setFormErrors({});
  };

  const openModal = (type: ModalType, data?: VideoEdukasi) => {
    if (type === "edit" && data) {
      setFormData({
        judul: data.judul,
        link: data.link,
      });
    } else {
      setFormData({ judul: "", link: "" });
    }
    setModal({ isOpen: true, type, data });
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.judul.trim()) {
      errors.judul = "Judul video harus diisi";
    }

    if (!formData.link.trim()) {
      errors.link = "Link YouTube harus diisi";
    } else if (!getYouTubeVideoId(formData.link)) {
      errors.link = "Link YouTube tidak valid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddVideo = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        showToast("success", "Video berhasil ditambahkan");
        await fetchVideos(); // Re-fetch data
        closeModal();
      } else {
        showToast("error", result.message || "Gagal menambahkan video");
      }
    } catch (error) {
      console.error("Error adding video:", error);
      showToast("error", "Terjadi kesalahan saat menambahkan video");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditVideo = async () => {
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      const response = await fetch("/api/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: modal.data?.id,
          ...formData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast("success", "Video berhasil diperbarui");
        await fetchVideos(); // Re-fetch data
        closeModal();
      } else {
        showToast("error", result.message || "Gagal memperbarui video");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      showToast("error", "Terjadi kesalahan saat memperbarui video");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteVideo = async () => {
    setSubmitLoading(true);
    try {
      const response = await fetch(`/api/videos?id=${modal.data?.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        showToast("success", "Video berhasil dihapus");
        await fetchVideos(); // Re-fetch data
        closeModal();
      } else {
        showToast("error", result.message || "Gagal menghapus video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      showToast("error", "Terjadi kesalahan saat menghapus video");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !submitLoading) {
      e.preventDefault();
      if (modal.type === "add") {
        handleAddVideo();
      } else if (modal.type === "edit") {
        handleEditVideo();
      }
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Kode loading screen di tengah halaman (yang Anda komentari)
  // bisa dihapus jika Anda sudah puas dengan skeleton table.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header title="Kelola Video Edukasi" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <button
                onClick={() => openModal("add")}
                className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
              >
                <Plus
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span>Tambah Video</span>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Youtube size={16} /> Thumbnail
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Judul Video
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Link2 size={16} /> Link
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} /> Tanggal
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* PERUBAHAN 2: Skeleton dinamis */}
              {pageLoading ? (
                <SkeletonTable rows={entriesPerPage} cols={6} />
              ) : (
                <tbody className="divide-y divide-gray-200">
                  {paginatedVideos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <Video size={32} className="text-red-400" />
                          </div>
                          <p className="text-gray-600 font-medium">
                            Tidak ada video ditemukan
                          </p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm
                              ? "Coba ubah kata kunci pencarian"
                              : "Mulai dengan menambahkan video edukasi"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedVideos.map((video, index) => (
                      <tr
                        key={video.id}
                        className="hover:bg-red-50 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {(currentPage - 1) * entriesPerPage + index + 1}
                        </td>
                        
                        {/* PERUBAHAN 3: Thumbnail asli YouTube */}
                        <td className="px-6 py-4">
                          {(() => {
                            const videoId = getYouTubeVideoId(video.link);
                            return (
                              <a
                                href={video.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative block w-32 h-20 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-200"
                              >
                                {videoId ? (
                                  <Image
                                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                    alt={`Thumbnail ${video.judul}`}
                                    fill
                                    sizes="128px"
                                    className="object-cover group-hover:scale-110 transition-transform duration-200"
                                  />
                                ) : (
                                  // Fallback jika ID tidak ditemukan
                                  <div className="w-full h-full bg-gradient-to-br from-red-400 via-red-400 to-red-500 flex flex-col items-center justify-center">
                                    <Youtube
                                      size={32}
                                      className="text-white mb-1"
                                    />
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <Play
                                    size={24}
                                    className="text-white"
                                    fill="white"
                                  />
                                </div>
                              </a>
                            );
                          })()}
                        </td>
                        
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-800">
                            {truncateText(video.judul, 60)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={video.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <span>Lihat Video</span>
                            <ExternalLink size={14} />
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(video.tanggal_ditambahkan)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModal("edit", video)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-150 hover:scale-110 active:scale-95"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => openModal("delete", video)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 hover:scale-110 active:scale-95"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
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

          {totalPages > 1 && (
            <div className="px-6 py-4 bg-red-50 border-t border-red-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-gray-600">
                  Menampilkan {(currentPage - 1) * entriesPerPage + 1} -{" "}
                  {Math.min(
                    currentPage * entriesPerPage,
                    filteredVideos.length
                  )}{" "}
                  dari {filteredVideos.length} video
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    Sebelumnya
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95 ${
                          currentPage === pageNum
                            ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                            : "text-gray-700 bg-white border border-red-200 hover:bg-red-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-red-100 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-900">
                {modal.type === "add" && "Tambah Video Edukasi Baru"}
                {modal.type === "edit" && "Edit Video Edukasi"}
                {modal.type === "delete" && "Konfirmasi Hapus"}
              </h3>
            </div>

            <div className="px-6 py-5">
              {modal.type === "delete" ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-red-600" />
                  </div>
                  <p className="text-gray-700 mb-2">
                    Apakah Anda yakin ingin menghapus video
                  </p>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    &quot;{modal.data?.judul}&quot;?
                  </p>
                  <p className="text-sm text-gray-500">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul Video
                    </label>
                    <input
                      type="text"
                      name="judul"
                      value={formData.judul}
                      onChange={handleInputChange}
                      onKeyPress={handleFormSubmit}
                      disabled={submitLoading}
                      className={`w-full px-4 py-3 border ${
                        formErrors.judul ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Masukkan judul video"
                    />
                    {formErrors.judul && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.judul}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Link YouTube
                    </label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      onKeyPress={handleFormSubmit}
                      disabled={submitLoading}
                      className={`w-full px-4 py-3 border ${
                        formErrors.link ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="https://www.youtube.com/watch?v=xxxxx"
                    />
                    {formErrors.link && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.link}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                    </p>
                  </div>

                  {formData.link && getYouTubeVideoId(formData.link) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preview
                      </label>
                      <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
                        {/* Preview juga bisa pakai thumbnail asli */}
                        <Image
                          src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                            formData.link
                          )}/mqdefault.jpg`}
                          alt="Video preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                          <Play
                            size={32}
                            className="text-white"
                            fill="white"
                          />
                          <p className="text-white text-sm mt-3 font-medium">
                            Video Valid
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-5 bg-red-50 border-t border-red-100 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitLoading}
                className="px-6 py-2.5 text-gray-700 font-semibold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={
                  modal.type === "delete"
                    ? handleDeleteVideo
                    : modal.type === "add"
                    ? handleAddVideo
                    : handleEditVideo
                }
                disabled={submitLoading}
                className={`px-6 py-2.5 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  modal.type === "delete"
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/30"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-500/30"
                }`}
              >
                {submitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {modal.type === "add" && "Tambah Video"}
                {modal.type === "edit" && "Simpan Perubahan"}
                {modal.type === "delete" && "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoEdukasiPage;