"use client";

import MaterialCard from "@/components/dashboard/MaterialCard";
import Pagination from "@/components/dashboard/Pagination";
import TabFilter from "@/components/dashboard/TabFilter";
import Header from "@/components/Header";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  created_at: string;
}

const BerandaPage: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 3;
  
  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles');
        const result = await response.json();
        
        if (result.success) {
          setArticles(result.data);
          setFilteredArticles(result.data);
        } else {
          setError("Gagal memuat artikel");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat artikel");
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles by category
  useEffect(() => {
    if (activeTab === "Semua") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === activeTab));
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeTab, articles]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle article click - navigate to article detail
  const handleArticleClick = (articleId: number) => {
    router.push(`/artikel/${articleId}`);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedMaterials = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Convert Article to MaterialCard props
  const convertToMaterialProps = (article: Article) => ({
    category: article.category,
    title: article.title,
    imageUrl: article.image_url || "/default-image.jpg", // fallback image
    onClick: () => handleArticleClick(article.id)
  });

  if (loading) {
    return (
      <>
        <Header title="Beranda" />
        <div className="p-4 md:p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Beranda" />
        <div className="p-4 md:p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Beranda" />
      <div className="p-4 md:p-8">
        <section className="mb-5">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Materi Terbaru
          </h2>
          <p className="text-gray-600">
            Jelajahi materi edukasi, artikel, dan video terbaru dari WASKITA.
          </p>
        </section>

        <TabFilter 
          tabs={["Semua", "Edukasi", "Artikel", "Video"]} 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === "Semua" 
                ? "Belum ada artikel tersedia" 
                : `Belum ada artikel dalam kategori ${activeTab}`
              }
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedMaterials.map((article) => (
                <MaterialCard 
                  key={article.id} 
                  {...convertToMaterialProps(article)} 
                />
              ))}
            </section>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BerandaPage;