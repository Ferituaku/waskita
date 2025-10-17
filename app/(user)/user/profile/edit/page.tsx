"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../../../components/Header";
import { User, Mail, Lock, Camera, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_picture?: string;
  phone_number?: string;
  status?: string;
}

const ProfileEditPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile (otomatis dari JWT cookie)
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setFormData({
          name: data.user.name,
          email: data.user.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(data.message || "Gagal memuat profil");
        // Redirect to login if unauthorized
        if (response.status === 401) {
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Terjadi kesalahan saat memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!formData.name || !formData.email) {
      alert("Nama dan email harus diisi!");
      return;
    }

    // Validasi password jika ingin ganti
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        alert("Password saat ini harus diisi untuk mengubah password!");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        alert("Password baru dan konfirmasi password tidak cocok!");
        return;
      }

      if (formData.newPassword.length < 6) {
        alert("Password baru minimal 6 karakter!");
        return;
      }
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profil berhasil diperbarui!");
        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // Refresh profile data
        fetchProfile();
      } else {
        alert(data.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat memperbarui profil");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Hanya file JPEG, PNG, dan GIF yang diperbolehkan!");
      return;
    }

    // Validasi file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 5MB.");
      return;
    }

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Avatar berhasil diupdate!");
        // Refresh profile to get new avatar
        fetchProfile();
      } else {
        alert(data.message || "Gagal upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Terjadi kesalahan saat upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Edit Profil" />
        <div className="p-6 flex items-center justify-center">
          <div className="text-gray-600">Memuat profil...</div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header title="Edit Profil" />
        <div className="p-6 flex items-center justify-center">
          <div className="text-gray-600">Gagal memuat profil</div>
        </div>
      </>
    );
  }

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
                src={
                  user.profile_picture &&
                  user.profile_picture !== "/default-profile.jpg"
                    ? user.profile_picture
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&size=100&background=random`
                }
                alt="User Avatar"
                width="100"
                height="100"
                className="rounded-full object-cover w-24 h-24"
              />
              <input
                type="file"
                id="avatar-upload"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                title="Klik untuk upload avatar"
              >
                {uploadingAvatar ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Camera size={16} />
                )}
                <span className="sr-only">Change profile picture</span>
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {user.role}
              </span>
              {uploadingAvatar && (
                <p className="text-sm text-gray-500 mt-1">
                  Uploading avatar...
                </p>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              {/* Full Name */}
              <div className="form-control w-full">
                <label className="label" htmlFor="name">
                  <span className="label-text font-medium">Nama Lengkap</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    className="input input-bordered w-full pl-10 text-gray-800"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-control w-full">
                <label className="label" htmlFor="email">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="input input-bordered w-full pl-10 text-gray-800"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="my-8" />

            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Ubah Password
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Kosongkan jika tidak ingin mengubah password
            </p>

            {/* Current Password */}
            <div className="form-control w-full text-gray-600">
              <label className="label" htmlFor="currentPassword">
                <span className="label-text font-medium">
                  Password Saat Ini
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Masukkan password saat ini"
                  className="input input-bordered w-full pl-10 pr-10 text-gray-800"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              {/* New Password */}
              <div className="form-control w-full">
                <label className="label" htmlFor="newPassword">
                  <span className="label-text font-medium">Password Baru</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Masukkan password baru"
                    className="input input-bordered w-full pl-10 pr-10 text-gray-800"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control w-full">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text font-medium">
                    Konfirmasi Password Baru
                  </span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password baru"
                    className="input input-bordered w-full pl-10 pr-10 text-gray-800"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2 rounded-lg transition-colors"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileEditPage;
