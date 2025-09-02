"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Menggunakan Image component dari Next.js untuk optimasi

// Pastikan Anda sudah meletakkan logo di folder /public/images/
import LogoWaskita from "@/public/images/logo-waskita.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ username, password, rememberMe });
    // Logika untuk login nanti ditambahkan di sini
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* --- Logo --- */}
      <div className="flex justify-center mb-8">
        <Image
          src="/logo-waskitabystophiva.png"
          alt="Waskita Logo"
          width={300} // Sesuaikan lebar logo
          height={50} // Sesuaikan tinggi logo
          priority
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* --- Input Username --- */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* --- Input Password --- */}
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
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* --- Baris Opsi: Ingatkan Saya & Link Registrasi --- */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-900">
              Ingatkan Saya
            </label>
          </div>

          <div>
            <span className="text-gray-600">Belum memiliki akun? </span>
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Registrasi
            </Link>
          </div>
        </div>

        {/* --- Tombol Masuk --- */}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
