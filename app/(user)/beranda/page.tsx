"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ExternalLink,
  BookOpen,
  Video,
  Clock,
  AlertCircle,
  FileText,
  Play,
} from "lucide-react";
import Header from "@/components/Header";
import TabFilter from "@/components/dashboard/TabFilter";
import Pagination from "@/components/dashboard/Pagination";
import ChatBot from "@/components/chatbot";

// TIPE DATA
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

type FeedItem = {
  type: "article" | "video";
  date: Date;
  data: Article | VideoEdukasi;
};

// --- KOMPONEN BANTU ---

const ArticleCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-pulse">
    <div className="relative h-48 w-full bg-slate-200"></div>
    <div className="p-5">
      <div className="h-4 bg-slate-200 rounded-full w-1/3 mb-3"></div>
      <div className="h-6 bg-slate-300 rounded-md w-full mb-3"></div>
      <div className="h-6 bg-slate-300 rounded-md w-3/4 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded-full w-1/4"></div>
        <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  </div>
);

const LoadingScreen: React.FC<{ itemsPerPage: number }> = ({
  itemsPerPage,
}) => (
  <div className="p-4 md:p-8">
    <div className="mb-5 animate-pulse">
      <div className="h-8 bg-slate-300 rounded-md w-1/3 mb-3"></div>
      <div className="h-5 bg-slate-200 rounded-md w-1/2"></div>
    </div>
    <div className="flex space-x-2 mb-8">
      <div className="h-10 bg-slate-200 rounded-lg w-24"></div>
      <div className="h-10 bg-slate-200 rounded-lg w-24"></div>
      <div className="h-10 bg-slate-200 rounded-lg w-24"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {Array(itemsPerPage)
        .fill(0)
        .map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
    </div>
  </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 md:p-8">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  </div>
);

const EmptyState: React.FC<{ tab: string }> = ({ tab }) => {
  const messages: Record<string, string> = {
    Semua: "Belum ada artikel atau video yang tersedia.",
    Artikel: "Belum ada artikel yang dipublikasikan.",
    "Video Edukasi": "Belum ada video edukasi yang ditambahkan.",
  };
  return (
    <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {tab === "Artikel" ? (
          <FileText size={32} className="text-red-400" />
        ) : (
          <Video size={32} className="text-red-400" />
        )}
      </div>
      <p className="text-gray-600 font-medium text-lg">{messages[tab]}</p>
      <p className="text-gray-400 text-sm mt-1">Silakan cek kembali nanti.</p>
    </div>
  );
};

// --- KOMPONEN KARTU KONTEN ---
const ArticleCardComponent: React.FC<{
  article: Article;
  onClick: () => void;
}> = ({ article, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const imageUrl = imgError
    ? "/images/default-article.jpg"
    : article.image_url || "/images/default-article.jpg";
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 w-full bg-gray-100">
        {/* Loading skeleton */}
        {imgLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <Image
          src={imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
          unoptimized
          onLoad={() => setImgLoading(false)}
          onError={(e) => {
            console.error("Image error:", article.id, imageUrl);
            setImgError(true);
            setImgLoading(false);
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
            <BookOpen size={14} />
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 h-10 group-hover:text-red-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 h-10 mb-4">
          {article.content.replace(/<[^>]+>/g, "").substring(0, 100)}...
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Clock size={14} />
            {formatDate(article.created_at)}
          </p>
          <span className="text-sm font-semibold text-red-600 group-hover:underline">
            Baca Selengkapnya
          </span>
        </div>
      </div>
    </div>
  );
};

// ⭐ FIXED: VideoCard dengan proper thumbnail handling
const VideoCardComponent: React.FC<{
  video: VideoEdukasi;
  onClick: () => void;
}> = ({ video, onClick }) => {
  const videoId = getYouTubeVideoId(video.link);
  // ⭐ YouTube thumbnail atau fallback
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : "/images/default-video.jpg"; // ⭐ FIXED: Proper path

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={thumbnailUrl}
          alt={video.judul}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized // ⭐ Allow YouTube thumbnails
          onError={(e) => {
            // ⭐ FIXED: Proper fallback path
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/images/default-video.jpg";
          }}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play size={48} className="text-white" fill="white" />
        </div>
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
            <Video size={14} />
            Video Edukasi
          </span>
        </div>
        <div className="absolute top-3 right-3 p-1.5 bg-black/30 rounded-full">
          <ExternalLink size={16} className="text-white" />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 h-14 group-hover:text-red-600 transition-colors">
          {video.judul}
        </h3>
        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-4">
          <Clock size={14} />
          {formatDate(video.tanggal_ditambahkan)}
        </p>
      </div>
    </div>
  );
};

// --- FUNGSI HELPER ---

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
};

const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// --- KOMPONEN UTAMA ---

const BerandaPage: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoEdukasi[]>([]);
  const [combinedFeed, setCombinedFeed] = useState<FeedItem[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;

  // Fetch articles and videos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch articles
        const articlesResponse = await fetch("/api/articles");
        const articlesResult = await articlesResponse.json();

        if (articlesResult.success) {
          console.log("📋 Articles loaded:", articlesResult.data.length);
          // ⭐ Debug first article image
          if (articlesResult.data[0]) {
            console.log(
              "🖼️ First article image:",
              articlesResult.data[0].image_url
            );
          }
          setArticles(articlesResult.data);
        } else {
          throw new Error("Gagal memuat artikel");
        }

        // Fetch videos
        const videosResponse = await fetch("/api/videos");
        const videosResult = await videosResponse.json();

        if (videosResult.success) {
          console.log("🎥 Videos loaded:", videosResult.data.length);
          setVideos(videosResult.data);
        } else {
          throw new Error("Gagal memuat video");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat data"
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Combine feeds
  useEffect(() => {
    const articleFeed: FeedItem[] = articles.map((article) => ({
      type: "article",
      date: new Date(article.created_at),
      data: article,
    }));

    const videoFeed: FeedItem[] = videos.map((video) => ({
      type: "video",
      date: new Date(video.tanggal_ditambahkan),
      data: video,
    }));

    const combined = [...articleFeed, ...videoFeed].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    setCombinedFeed(combined);
  }, [articles, videos]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleArticleClick = (articleId: number) => {
    router.push(`/artikel/${articleId}`);
  };

  const handleVideoClick = (videoLink: string) => {
    window.open(videoLink, "_blank", "noopener,noreferrer");
  };

  const { paginatedItems, totalPages } = useMemo(() => {
    let dataToPaginate: FeedItem[] | Article[] | VideoEdukasi[] = [];

    if (activeTab === "Artikel") {
      dataToPaginate = articles;
    } else if (activeTab === "Video Edukasi") {
      dataToPaginate = videos;
    } else {
      dataToPaginate = combinedFeed;
    }

    const total = Math.ceil(dataToPaginate.length / itemsPerPage);
    const paginated = dataToPaginate.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    if (activeTab === "Artikel") {
      return {
        paginatedItems: (paginated as Article[]).map((article) => ({
          type: "article" as const,
          date: new Date(article.created_at),
          data: article,
        })),
        totalPages: total,
      };
    }

    if (activeTab === "Video Edukasi") {
      return {
        paginatedItems: (paginated as VideoEdukasi[]).map((video) => ({
          type: "video" as const,
          date: new Date(video.tanggal_ditambahkan),
          data: video,
        })),
        totalPages: total,
      };
    }

    return {
      paginatedItems: paginated as FeedItem[],
      totalPages: total,
    };
  }, [activeTab, articles, videos, combinedFeed, currentPage, itemsPerPage]);

  // --- RENDER ---

  if (loading) {
    return (
      <>
        <Header title="Beranda" />
        <ChatBot />
        <LoadingScreen itemsPerPage={itemsPerPage} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Beranda" />
        <ChatBot />
        <ErrorDisplay message={error} />
      </>
    );
  }

  return (
    <>
      <Header title="Beranda" />
      <ChatBot />
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <section className="mb-5 p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang di Beranda WASKITA
          </h2>
          <p className="text-gray-600">
            Jelajahi materi edukasi, artikel, dan video terbaru untuk menambah
            wawasan Anda.
          </p>
        </section>

        <div className="mb-8">
          <TabFilter
            tabs={["Semua", "Artikel", "Video Edukasi"]}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        <section>
          {paginatedItems.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginatedItems.map((item) => {
                  if (item.type === "article") {
                    const article = item.data as Article;
                    return (
                      <ArticleCardComponent
                        key={`article-${article.id}`}
                        article={article}
                        onClick={() => handleArticleClick(article.id)}
                      />
                    );
                  }
                  if (item.type === "video") {
                    const video = item.data as VideoEdukasi;
                    return (
                      <VideoCardComponent
                        key={`video-${video.id}`}
                        video={video}
                        onClick={() => handleVideoClick(video.link)}
                      />
                    );
                  }
                  return null;
                })}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default BerandaPage;
