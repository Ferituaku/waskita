import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WASKITA - Edukasi HIV/AIDS",
  description:
    "Wadah Sadar Kesehatan Tembalang - Platform edukasi mengenai HIV/AIDS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <Toaster position="top-center" reverseOrder={false} />
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
