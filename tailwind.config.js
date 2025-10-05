// tailwind.config.js
const { heroUI } = require("@heroui/theme");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. Definisikan palet warna semantik untuk brand Anda
      colors: {
        brand: {
          light: "#FEE2E2", // Lighter shade
          DEFAULT: "#DC2626", // Warna utama dari tema waskita Anda
          focus: "#B91C1C",   // Warna saat focus/hover
          dark: "#991B1B",    // Darker shade
        },
        accent: {
          DEFAULT: "#3b82f6",
          hover: "#2563EB",
        },
        // Warna untuk status atau feedback UI
        feedback: {
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#0ea5e9",
        },
      },
      // 2. Definisikan font family agar konsisten
      fontFamily: {
        // Font utama untuk paragraf dan teks umum
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        // Font khusus untuk judul agar lebih menonjol
        display: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      },
      // 3. Tambahkan keyframes dan animasi kustom
      keyframes: {
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out",
      },
    },
  },
  plugins: [
    // Plugin HeroUI sudah cukup untuk mengaktifkan semua komponennya
    heroUI(),
  ],
};