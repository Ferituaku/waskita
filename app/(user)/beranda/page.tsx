"use client";

import MaterialCard from "@/components/dashboard/MaterialCard";
import Pagination from "@/components/dashboard/Pagination";
import TabFilter from "@/components/dashboard/TabFilter";
import Header from "@/components/Header";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Youtube, ExternalLink } from "lucide-react";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  created_at: string;
}

interface VideoEdukasi {
  id: number;
  judul: string;
  link: string;
  tanggal_ditambahkan: string;
}

const BerandaPage: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoEdukasi[]>([]);
  const [currentArticlePage, setCurrentArticlePage] = useState(1);
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 3;
  
  // Fetch articles and videos from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch articles
        const articlesResponse = await fetch('/api/articles');
        const articlesResult = await articlesResponse.json();
        
        // Fetch videos
        const videosResponse = await fetch('/api/videos');
        const videosResult = await videosResponse.json();
        
        if (articlesResult.success) {
          // Filter only articles (category: "Artikel")
          const filteredArticles = articlesResult.data.filter(
            (article: Article) => article.category === "Artikel"
          );
          setArticles(filteredArticles);
          console.log('Articles loaded:', filteredArticles);
        } else {
          setError("Gagal memuat artikel");
        }

        if (videosResult.success) {
          setVideos(videosResult.data);
          console.log('Videos loaded:', videosResult.data);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data");
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentArticlePage(1);
    setCurrentVideoPage(1);
  };

  // Handle article click - navigate to article detail
  const handleArticleClick = (articleId: number) => {
    router.push(`/artikel/${articleId}`);
  };

  // Handle video click - open in new tab
  const handleVideoClick = (videoLink: string) => {
    window.open(videoLink, '_blank', 'noopener,noreferrer');
  };

  // Calculate pagination for articles
  const totalArticlePages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice(
    (currentArticlePage - 1) * itemsPerPage,
    currentArticlePage * itemsPerPage
  );

  // Calculate pagination for videos
  const totalVideoPages = Math.ceil(videos.length / itemsPerPage);
  const paginatedVideos = videos.slice(
    (currentVideoPage - 1) * itemsPerPage,
    currentVideoPage * itemsPerPage
  );

  // Convert Article to MaterialCard props
  const convertToMaterialProps = (article: Article) => ({
    category: article.category,
    title: article.title,
    imageUrl: article.image_url || "/default-image.jpg",
    onClick: () => handleArticleClick(article.id)
  });

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

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

  // Determine what to show based on active tab
  const showArticles = activeTab === "Semua" || activeTab === "Artikel";
  const showVideos = activeTab === "Semua" || activeTab === "Video Edukasi";

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
          tabs={["Semua", "Artikel", "Video Edukasi"]} 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Section Artikel */}
        {showArticles && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Artikel</h3>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada artikel tersedia</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {paginatedArticles.map((article) => (
                    <MaterialCard 
                      key={article.id} 
                      {...convertToMaterialProps(article)} 
                    />
                  ))}
                </div>

                {totalArticlePages > 1 && (
                  <Pagination
                    currentPage={currentArticlePage}
                    totalPages={totalArticlePages}
                    onPageChange={setCurrentArticlePage}
                  />
                )}
              </>
            )}
          </section>
        )}

        {/* Section Video Edukasi */}
        {showVideos && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Video Edukasi</h3>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada video tersedia</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {paginatedVideos.map((video) => (
                    <div 
                      key={video.id}
                      onClick={() => handleVideoClick(video.link)}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
                        <Youtube size={64} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 right-3">
                          <ExternalLink size={20} className="text-white opacity-70" />
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-2">
                          <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                            Video Edukasi
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {video.judul}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(video.tanggal_ditambahkan)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {totalVideoPages > 1 && (
                  <Pagination
                    currentPage={currentVideoPage}
                    totalPages={totalVideoPages}
                    onPageChange={setCurrentVideoPage}
                  />
                )}
              </>
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default BerandaPage;