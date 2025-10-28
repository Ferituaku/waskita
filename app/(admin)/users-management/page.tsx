"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Mail,
  Pencil,
  Trash2,
  ShieldCheck,
  Loader2,
  UserPlus,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react";
import Header from "@/components/Header";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
}

type ModalType = "add" | "edit" | "delete";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const itemsPerPage = 10;

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: UserItem | null;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        alert(data.message || "Gagal memuat data pengguna");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
    setFormData({ name: "", email: "", password: "", role: "User" });
    setFormErrors({});
    setShowPassword(false);
  };

  const openModal = (type: ModalType, data?: UserItem) => {
    if (type === "edit" && data) {
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        role: data.role,
      });
    } else {
      setFormData({ name: "", email: "", password: "", role: "User" });
    }
    setModal({ isOpen: true, type, data });
    setFormErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nama harus diisi";
    }

    if (!formData.email.trim()) {
      errors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (modal.type === "add" && !formData.password) {
      errors.password = "Password harus diisi";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Add User
  const handleAddUser = async () => {
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pengguna berhasil ditambahkan!");
        closeModal();
        fetchUsers();
      } else {
        alert(data.message || "Gagal menambahkan pengguna");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Terjadi kesalahan saat menambahkan pengguna");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Edit User
  const handleEditUser = async () => {
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: modal.data?.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pengguna berhasil diupdate!");
        closeModal();
        fetchUsers();
      } else {
        alert(data.message || "Gagal mengupdate pengguna");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Terjadi kesalahan saat mengupdate pengguna");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!modal.data?.id) return;

    try {
      setSubmitLoading(true);
      const response = await fetch(`/api/users?id=${modal.data.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pengguna berhasil dihapus!");
        closeModal();
        fetchUsers();
      } else {
        alert(data.message || "Gagal menghapus pengguna");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus pengguna");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFormSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !submitLoading) {
      e.preventDefault();
      if (modal.type === "add") {
        handleAddUser();
      } else if (modal.type === "edit") {
        handleEditUser();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header title="Data Pengguna" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <button
                onClick={() => openModal("add")}
                className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
              >
                <UserPlus
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span>Tambah Pengguna</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:w-80">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-slate-700 placeholder-slate-400 shadow-sm transition-all"
                  />
                </div>
                {/* Role Filter */}
                <div className="relative">
                  <Filter
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="pl-11 pr-10 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-slate-700 shadow-sm appearance-none cursor-pointer hover:border-slate-400 transition-all"
                  >
                    <option value="all">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User size={16} /> Nama Lengkap
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail size={16} /> Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} /> Role
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <User size={32} className="text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">
                          Tidak ada pengguna ditemukan
                        </p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm || roleFilter !== "all"
                            ? "Coba ubah filter pencarian Anda"
                            : "Mulai dengan menambahkan pengguna baru"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${
                            user.role === "Admin"
                              ? "bg-gradient-to-r from-purple-100 to-red-100 text-purple-700 border border-purple-200"
                              : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.role === "Admin"
                                ? "bg-purple-500"
                                : "bg-green-500"
                            }`}
                          />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModal("edit", user)}
                            className="p-2 text-blue-600 hover:bg-red-50 rounded-lg transition-colors duration-150 hover:scale-110 active:scale-95 active:bg-blue-400"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => openModal("delete", user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 hover:scale-110 active:scale-95 active:bg-red-400"
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
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-slate-600">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}{" "}
                  dari {filteredUsers.length} pengguna
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
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
                            : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
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
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-red-50">
              <h3 className="text-xl font-bold text-slate-900">
                {modal.type === "add" && "Tambah Pengguna Baru"}
                {modal.type === "edit" && "Edit Pengguna"}
                {modal.type === "delete" && "Konfirmasi Hapus"}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5">
              {modal.type === "delete" ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={32} className="text-red-600" />
                  </div>
                  <p className="text-slate-700 mb-2">
                    Apakah Anda yakin ingin menghapus pengguna
                  </p>
                  <p className="text-lg font-bold text-slate-900 mb-2">
                    &quot;{modal.data?.name}&quot;?
                  </p>
                  <p className="text-sm text-slate-500">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onKeyPress={handleFormSubmit}
                      disabled={submitLoading}
                      className={`w-full px-4 py-3 border ${
                        formErrors.name ? "border-red-500" : "border-slate-300"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onKeyPress={handleFormSubmit}
                      disabled={submitLoading}
                      className={`w-full px-4 py-3 border ${
                        formErrors.email ? "border-red-500" : "border-slate-300"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder="user@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password {modal.type === "edit" && "(opsional)"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyPress={handleFormSubmit}
                        disabled={submitLoading}
                        className={`w-full px-4 py-3 pr-12 border ${
                          formErrors.password
                            ? "border-red-500"
                            : "border-slate-300"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        placeholder={
                          modal.type === "edit"
                            ? "Kosongkan jika tidak ingin mengubah"
                            : "Masukkan password"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={submitLoading}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={submitLoading}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 bg-white cursor-pointer appearance-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitLoading}
                className="px-6 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={
                  modal.type === "delete"
                    ? handleDeleteUser
                    : modal.type === "add"
                    ? handleAddUser
                    : handleEditUser
                }
                disabled={submitLoading}
                className={`px-6 py-2.5 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  modal.type === "delete"
                    ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-orange-500/30"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/30"
                }`}
              >
                {submitLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {modal.type === "add" && "Tambah Pengguna"}
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

export default UsersPage;
