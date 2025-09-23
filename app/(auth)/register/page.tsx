"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Logo = () => (
  <div className="flex justify-center mb-8">
    <Image
      src="/logo-waskitabystophiva.png"
      alt="Waskita Logo"
      width={300} // Sesuaikan lebar logo
      height={50} // Sesuaikan tinggi logo
      priority
    />
  </div>
);

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log({ fullName, username, password });
    // On successful registration, navigate to login
    // router.push('/login');
  };

  return (
    <>
      <Logo />
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* nama lengkap */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="fullName"
          >
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        {/* username dan password */}
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
            placeholder="Masukkan nama lengkap Anda"
            className="block w-full text-black px-4 py-3 border border-gray-300 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
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
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            {" "}
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
