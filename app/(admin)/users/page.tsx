"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Pagination from "../../../components/dashboard/Pagination";
import Modal from "../../../components/Modal";
import {
  Plus,
  Search,
  User,
  Mail,
  Wrench,
  Pencil,
  Trash2,
  ShieldCheck,
} from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: ModalType | null;
    data?: UserItem | null;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

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

  // Filter users based on search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const closeModal = () => {
    setModal({ isOpen: false, type: null, data: null });
    setFormData({ name: "", email: "", password: "", role: "User" });
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
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Add User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
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
    }
  };

  // Handle Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert("Nama dan email harus diisi!");
      return;
    }

    try {
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
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!modal.data?.id) return;

    try {
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
    }
  };

  const renderModalContent = () => {
    if (!modal.isOpen) return null;

    switch (modal.type) {
      case "add":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title="Tambah Pengguna Baru"
          >
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full input input-bordered text-gray-800"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full input input-bordered text-gray-800"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full input input-bordered text-gray-800"
                  placeholder="Masukkan password"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full select select-bordered text-gray-800"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Tambah
                </button>
              </div>
            </form>
          </Modal>
        );

      case "edit":
        return (
          <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title="Edit Pengguna"
          >
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full input input-bordered text-gray-800"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full input input-bordered text-gray-800"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Baru (opsional)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full input input-bordered text-gray-800"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full select select-bordered text-gray-800"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
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
              Apakah Anda yakin ingin menghapus pengguna{" "}
              <span className="font-bold text-gray-800">
                "{modal.data?.name}"
              </span>
              ?<br />
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-6">
              <button
                type="button"
                onClick={closeModal}
                className="btn text-gray-500 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="btn bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors"
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

  if (loading) {
    return (
      <>
        <Header title="Manajemen Pengguna" />
        <div className="p-6 flex items-center justify-center">
          <div className="text-gray-600">Memuat data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Manajemen Pengguna" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button
              onClick={() => openModal("add")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <Plus size={20} />
              <span>Tambah Pengguna</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-2 border text-gray-500 border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
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
                      <User size={16} /> Nama Lengkap
                    </div>
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} /> Email
                    </div>
                  </th>
                  <th scope="col" className="p-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} /> Role
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Tidak ada data pengguna
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b last:border-b-0 hover:bg-gray-50 align-middle"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "Admin"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openModal("edit", user)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md flex items-center gap-1.5 text-xs transition-colors"
                          >
                            <Pencil size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => openModal("delete", user)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md flex items-center gap-1.5 text-xs transition-colors"
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
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / 10)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {renderModalContent()}
    </>
  );
};

export default UsersPage;