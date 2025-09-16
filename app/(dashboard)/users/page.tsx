// Fix: Replaced placeholder content with a functional user management page component.
"use client";

import React, { useState } from "react";
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

const mockUsers = [
  { id: 1, name: "Budi Santoso", email: "budi.s@example.com", role: "Admin" },
  { id: 2, name: "Ani Lestari", email: "ani.l@example.com", role: "User" },
  { id: 3, name: "Candra Wijaya", email: "candra.w@example.com", role: "User" },
  { id: 4, name: "Dewi Anggraini", email: "dewi.a@example.com", role: "User" },
  { id: 5, name: "Eko Prasetyo", email: "eko.p@example.com", role: "User" },
];

type ModalType = "add" | "edit" | "delete";

const UsersPage: React.FC = () => {
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

    const title =
      modal.type === "add" ? "Tambah Pengguna Baru" : "Edit Pengguna";
    const submitText = modal.type === "add" ? "Tambah" : "Simpan";

    switch (modal.type) {
      case "add":
      case "edit":
        return (
          <Modal isOpen={modal.isOpen} onClose={closeModal} title={title}>
            <form className="space-y-4">
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
                  defaultValue={modal.data?.name || ""}
                  className="mt-1 block w-full input input-bordered text-gray-400"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 "
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue={modal.data?.email || ""}
                  className="mt-1 block w-full input input-bordered text-gray-400"
                  placeholder="user@example.com"
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
                  defaultValue={modal.data?.role || "User"}
                  className="mt-1 block w-full select select-bordered text-gray-400"
                >
                  <option>Admin</option>
                  <option>User</option>
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
                  {submitText}
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
      <Header title="Manajemen Pengguna" />
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <button
              onClick={() =>
                setModal({ isOpen: true, type: "add", data: null })
              }
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
                {mockUsers.map((user, index) => (
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
                          onClick={() =>
                            setModal({ isOpen: true, type: "edit", data: user })
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
                              data: user,
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

          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {renderModalContent()}
    </>
  );
};

export default UsersPage;
