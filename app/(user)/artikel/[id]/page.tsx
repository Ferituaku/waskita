"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header"; // Asumsi komponen ini ada

// --- Import untuk UI/UX Baru ---
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // dari Shadcn
import { Badge } from "@/components/ui/badge"; // dari Shadcn
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // dari Shadcn
import { Skeleton } from "@/components/ui/skeleton"; // dari Shadcn
import {
  ArrowLeft,
  CalendarDays,
  Newspaper,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// --- Tipe data tetap sama ---
interface Article {
  id: number;
  title: string;
  content: string; // Asumsi ini adalah HTML, bukan plain text
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// --- Varian Animasi untuk Framer Motion ---
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

// const transition = {
//   type: "spring",
//   stiffness: 260,
//   damping: 20,
// };

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchArticle = async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      setError(null); // Reset error state
      const response = await fetch(`/api/articles/${params.id}`);
      const result = await response.json();

      if (result.success) {
        setArticle(result.data);
      } else {
        setError(result.message || "Artikel tidak ditemukan");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat artikel. Silakan coba lagi.");
      console.error("Error fetching article:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageError = () => {
    console.error("Image failed to load:", article?.image_url);
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError || !article?.image_url) {
      return "/images/default-article.jpg";
    }
    return article.image_url;
  };

  if (loading) {
    return (
      <>
        <Header title="Memuat Artikel..." />
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
          {/* Skeleton untuk Tombol Kembali */}
          <Skeleton className="h-9 w-28 mb-6" />

          {/* Skeleton untuk Header Artikel */}
          <div className="mb-4 space-y-4">
            <Skeleton className="h-6 w-16" /> {/* Badge Kategori */}
            <Skeleton className="h-10 w-full" /> {/* Judul */}
            <Skeleton className="h-8 w-3/4" /> {/* Judul baris 2 (jika ada) */}
            <Skeleton className="h-5 w-64" /> {/* Metadata Tanggal */}
          </div>

          {/* Skeleton untuk Gambar */}
          <Skeleton className="relative w-full h-64 md:h-96 mb-8 rounded-lg" />

          {/* Skeleton untuk Konten */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header title="Error" />
        <motion.div
          className="p-4 md:p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Gagal Memuat Artikel</AlertTitle>
            <AlertDescription>
              {error || "Artikel yang Anda cari tidak dapat ditemukan."}
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
            <Button onClick={fetchArticle}>
              <RefreshCw className="mr-2 h-4 w-4" /> Coba Lagi
            </Button>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Header title="Detail Artikel" />

      {/* Container utama dengan animasi Framer Motion */}
      <motion.div
        className="p-4 md:p-6 max-w-5xl mx-auto"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Tombol Kembali (Shadcn + Framer Motion) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
        >
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="mb-4 group bg-slate-400/10 hover:bg-red-400/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Kembali
          </Button>
        </motion.div>
        {/* Header Artikel */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <Badge variant="destructive" className="text-sm mb-2 text-white">
            {article.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center text-gray-600 text-sm">
            <CalendarDays className="w-4 h-4 mr-2" />
            <span>Dipublikasikan pada {formatDate(article.created_at)}</span>
            {article.updated_at !== article.created_at && (
              <span className="ml-4 pl-4 border-l border-gray-300">
                Diperbarui {formatDate(article.updated_at)}
              </span>
            )}
          </div>
        </motion.div>
        {/* Gambar Artikel (dengan animasi) */}
        {article.image_url && (
          <motion.div
            className="relative w-full h-60 md:h-[350px] mb-8 rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
          >
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-400">Loading image...</span>
              </div>
            )}
            {/* <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority // Penting untuk LCP (Largest Contentful Paint)
            /> */}
            <Image
              src={getImageUrl()}
              alt={article.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 768px) 100vw, 896px"
              priority
              onLoad={() => setImageLoading(false)}
              onError={handleImageError}
              unoptimized
            />
          </motion.div>
        )}
        {/* Konten Artikel (Menggunakan Tailwind Typography / @tailwindcss/prose) */}
        <motion.article
          className="prose prose-lg md:prose-xl max-w-none
                   prose-red dark:prose-invert
                   prose-headings:font-bold prose-headings:text-gray-900
                   prose-p:text-gray-700
                   prose-a:text-red-600
                   prose-strong:text-gray-800 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4 } }}
          // dangerouslySetInnerHTML={{ __html: article.content }}
          // PENTING: Kode di atas berasumsi `article.content` adalah HTML yang aman (sanitized).
          // Jika ini adalah plain text, gunakan:
        />
        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
        {/* Aksi Artikel */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push("/beranda")} // Ganti dengan path artikel Anda
              className="bg-red-600 hover:bg-red-700 "
            >
              <Newspaper className="mr-2 h-4 w-4" />
              Lihat Artikel Lainnya
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
