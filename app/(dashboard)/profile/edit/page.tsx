// Fix: Replaced placeholder content with a functional profile edit page component.
"use client";

import React from "react";
import Header from "../../../../components/Header";
import { User, Mail, Lock, Camera } from "lucide-react";
import Image from "next/image";

const ProfileEditPage: React.FC = () => {
  // Mock user data
  const user = {
    name: "Nama Pengguna",
    username: "pengguna_keren",
    email: "user@example.com",
    avatarUrl: "https://i.pravatar.cc/150",
  };

  return (
    <>
      <Header title="Edit Profil" />
      <div className="p-2 md:p-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Informasi Akun
          </h2>

          {/* Profile Picture Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <Image
                src={user.avatarUrl}
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-gray-500 text-white p-2 rounded-full hover:bg-gray-400 transition-colors">
                <Camera size={16} />
                <span className="sr-only">Change profile picture</span>
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              {/* Full Name */}
              <div className="form-control w-full ">
                <label className="label" htmlFor="fullName">
                  <span className="label-text">Nama Lengkap</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    className="input input-bordered w-full pl-10"
                    defaultValue={user.name}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="form-control w-full">
                <label className="label" htmlFor="username">
                  <span className="label-text">Username</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                    @
                  </span>
                  <input
                    id="username"
                    type="text"
                    placeholder="Masukkan username Anda"
                    className="input input-bordered w-full pl-8"
                    defaultValue={user.username}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-control w-full text-gray-600">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="input input-bordered w-full pl-10"
                  defaultValue={user.email}
                  disabled // Typically email is not easily changed
                />
              </div>
            </div>

            <hr className="my-8" />

            <h3 className="text-xl font-bold text-gray-800">Ubah Password</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              {/* New Password */}
              <div className="form-control w-full">
                <label className="label" htmlFor="newPassword">
                  <span className="label-text">Password Baru</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Masukkan password baru"
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control w-full">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text">Konfirmasi Password Baru</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi password baru"
                    className="input input-bordered w-full pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" className="btn btn-ghost">
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileEditPage;
