// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Suspense } from "react";
import "./globals.css";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "WASKITA - Edukasi HIV/AIDS",
  description:
    "Wadah Sinau Kita - Platform edukasi mengenai HIV/AIDS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased bg-slate-50 text-slate-800`}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
