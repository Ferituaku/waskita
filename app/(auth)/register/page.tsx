"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
// 1. Impor toast dari react-toastify
import { toast } from "react-toastify";
// 2. Impor CSS jika belum di-load di layout utama
import "react-toastify/dist/ReactToastify.css";

const Logo = () => (
  <div className="flex justify-center mb-8">
    <Image
      src="/logo-waskitabystophiva.png"
      alt="Waskita Logo"
      width={300}
      height={50}
      priority
    />
  </div>
);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // Ganti alert dengan toast.error
      toast.error("Password tidak cocok!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "user", // default role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Ganti alert dengan toast.error
        toast.error(data.message || "Gagal mendaftar!");
        return;
      }

      // Ganti alert dengan toast.success
      toast.success(
        "Registrasi berhasil! Anda akan diarahkan ke halaman login."
      );

      // Beri sedikit jeda agar user bisa melihat notifikasi sebelum redirect
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Jeda 2 detik
    } catch (err) {
      console.error("❌ Error:", err);
      // Ganti alert dengan toast.error
      toast.error("Terjadi kesalahan pada server!");
    }
  };

  return (
    <>
      {/* ToastContainer tidak perlu diletakkan di sini jika sudah ada di layout.tsx.
        Menempatkannya di layout utama adalah praktik terbaik.
      */}
      {/* <ToastContainer /> */}

      <Logo />
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama Lengkap */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="name"
          >
            Nama Lengkap
          </label>
          <input
            id="name"
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Masukkan password Anda"
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Konfirmasi Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Ulangi password Anda"
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Tombol Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            BUAT AKUN
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Sudah memiliki akun?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-primary-hover"
        >
          Masuk
        </Link>
      </p>
    </>
  );
}
