import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
