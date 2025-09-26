"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          setArticle(result.data);
        } else {
          setError("Artikel tidak ditemukan");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat artikel");
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Header title="Detail Artikel" />
        <div className="p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Header title="Detail Artikel" />
        <div className="p-4 md:p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || "Artikel tidak ditemukan"}
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Kembali
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Detail Artikel" />
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>

        {/* Article Header */}
        <div className="mb-6">
          <span className="inline-block bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            {article.category}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center text-gray-600 text-sm">
            <span>Dipublikasikan pada {formatDate(article.created_at)}</span>
            {article.updated_at !== article.created_at && (
              <span className="ml-4">
                • Diperbarui pada {formatDate(article.updated_at)}
              </span>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {article.image_url && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
          />
        </article>

        {/* Article Actions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/beranda')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
            >
              Lihat Artikel Lainnya
            </button>
            
            <button
              onClick={() => window.print()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded transition-colors"
            >
              Cetak Artikel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}