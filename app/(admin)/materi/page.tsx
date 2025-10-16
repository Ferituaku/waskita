"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Pagination from "../../../components/dashboard/Pagination";
import Modal from "@/components/Modal";
import ChatBot from "@/components/chatbot";
import {
  Plus,
  Search,
  FileImage,
  AlignJustify,
  Layers,
  Wrench,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

interface MateriItem {
  id: number;
  title: string;
  content: string;
  category: "HIV" | "AIDS";
  file_type: "text" | "pdf";
  file_url?: string;
  image_url: string;
}

type ModalType = "add" | "edit" | "delete" | "cover";

const MateriPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [materials, setMaterials] = useState<MateriItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: MateriItem | null;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "HIV" as "HIV" | "AIDS",
    file_type: "text" as "text" | "pdf",
    file: null as File | null,
    coverFile: null as File | null,
  });

  // Fetch materials from API
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/articles");
      const result = await response.json();
      if (result.success) {
        setMaterials(result.data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
    setFormData({
      title: "",
      content: "",
      category: "HIV",
      file_type: "text",
      file: null,
      coverFile: null,
    });
  };

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = modal.data?.image_url || "/default-image.jpg";
      let pdfContent = formData.content;
      let pdfUrl = null;

      // Upload cover image jika ada
      if (formData.coverFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", formData.coverFile);
        imageFormData.append("type", "image");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          alert("Gagal upload gambar: " + uploadResult.error);
          setLoading(false);
          return;
        }
      }

      // Upload PDF jika tipe file adalah PDF
      if (formData.file_type === "pdf" && formData.file) {
        const pdfFormData = new FormData();
        pdfFormData.append("file", formData.file);
        pdfFormData.append("type", "pdf");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: pdfFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
          pdfUrl = uploadResult.url;
          pdfContent = `PDF: ${formData.file.name}`;
        } else {
          alert("Gagal upload PDF: " + uploadResult.error);
          setLoading(false);
          return;
        }
      }

      const payload = {
        title: formData.title,
        content: pdfContent,
        category: formData.category,
        file_type: formData.file_type,
        image_url: imageUrl,
        file_url: pdfUrl,
      };

      const url =
        modal.type === "edit"
          ? `/api/articles/${modal.data?.id}`
          : "/api/articles";
      const method = modal.type === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.loading("Menyimpan data...", { position: "top-right" });
        toast.success(
          `Materi berhasil ${
            modal.type === "edit" ? "diperbarui" : "ditambahkan"
          }!`,
          { position: "top-right" }
        );
        fetchMaterials();
        closeModal();
      } else {
        alert(result.error || "Gagal menyimpan materi");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!modal.data) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/articles/${modal.data.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Materi berhasil dihapus", { position: "top-right" });
        fetchMaterials();
        closeModal();
      } else {
        alert(result.error || "Gagal menghapus materi");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Gagal menghapus materi", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  // Open modal for edit
  const openEditModal = (item: MateriItem) => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      file_type: item.file_type,
      file: null,
      coverFile: null,
    });
    setModal({ isOpen: true, type: "edit", data: item });
  };

  // Filter materials based on search
  const filteredMaterials = materials.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="max-h-[70vh] overflow-y-auto px-1">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as "HIV" | "AIDS",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="HIV">HIV</option>
                      <option value="AIDS">AIDS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Tipe Konten
                    </label>
                    <select
                      value={formData.file_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          file_type: e.target.value as "text" | "pdf",
                          file: null,
                          content:
                            e.target.value === "pdf" ? "" : formData.content,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="text">📝 Tulis Manual</option>
                      <option value="pdf">📄 Upload PDF</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Judul Materi
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Masukkan judul materi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Upload Cover/Gambar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coverFile: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  {formData.coverFile && (
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {formData.coverFile.name}
                    </p>
                  )}
                </div>

                {formData.file_type === "text" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Konten Materi
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                      placeholder="Tulis konten materi di sini..."
                      rows={12}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Upload File PDF
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          file: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      required={modal.type === "add"}
                    />
                    {formData.file && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                          <span className="text-xl">📄</span>
                          {formData.file.name}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
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
              <span className="font-semibold">{modal.data?.title}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Upload file baru
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coverFile: e.target.files?.[0] || null,
                    })
                  }
                  className="file-input file-input-bordered border-2 border-gray-500 file-input-primary text-gray-600 w-full mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
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
                &quot;{modal.data?.title}&quot;
              </span>
              ?<br />
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-3 py-2 bg-red-600 hover:bg-red-400 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Menghapus..." : "Ya, Hapus"}
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
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
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
                  placeholder="Cari materi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 border text-gray-500 border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            {loading && materials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Loading data...
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data ditemukan
              </div>
            ) : (
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
                    <th scope="col" className="p-4 w-32">
                      <div className="flex items-center gap-2">
                        <Layers size={16} /> Kategori
                      </div>
                    </th>
                    <th scope="col" className="p-4 w-32">
                      <div className="flex items-center gap-2">
                        <FileText size={16} /> Tipe
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
                  {filteredMaterials.map((item, index) => (
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
                            setModal({
                              isOpen: true,
                              type: "cover",
                              data: item,
                            })
                          }
                          className="relative group bg-gray-200 rounded-md w-24 h-16 flex items-center justify-center text-gray-500 text-xs font-medium hover:bg-gray-300 transition-colors"
                        >
                          Cover
                          <span className="absolute items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil size={16} className="text-gray-700" />
                          </span>
                        </button>
                      </td>
                      <td className="p-4 font-medium text-gray-800 max-w-sm">
                        {item.title}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.category === "HIV"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600 text-xs">
                          {item.file_type === "pdf" ? "📄 PDF" : "📝 Text"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
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
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredMaterials.length / 10)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {renderModalContent()}
      <ChatBot />
    </>
  );
};

export default MateriPage;
