"use client";

import Header from "@/components/Header";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  Users,
  Heart,
  Target,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Shield,
  BookOpen,
} from "lucide-react";
import ChatBot from "@/components/chatbot";

interface VideoEdukasi {
  id: number;
  judul: string;
  link: string;
  tanggal_ditambahkan: string;
}

// Helper function to get color classes - prevents Tailwind purging issues
const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
    red: { bg: "bg-red-100", icon: "text-red-600", text: "text-red-600" },
    blue: { bg: "bg-blue-100", icon: "text-blue-600", text: "text-blue-600" },
    green: {
      bg: "bg-green-100",
      icon: "text-green-600",
      text: "text-green-600",
    },
    pink: { bg: "bg-pink-100", icon: "text-pink-600", text: "text-pink-600" },
    purple: {
      bg: "bg-purple-100",
      icon: "text-purple-600",
      text: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-100",
      icon: "text-orange-600",
      text: "text-orange-600",
    },
  };
  return colorMap[color] || colorMap.red;
};

const ApaItuWPAPage: React.FC = () => {
  // const [videos, setVideos] = useState<VideoEdukasi[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // Fetch videos from API
  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("/api/videos");
  //       const result = await response.json();

  //       if (result.success) {
  //         setVideos(result.data);
  //       } else {
  //         setError("Gagal memuat video");
  //       }
  //     } catch (err) {
  //       setError("Terjadi kesalahan saat memuat video");
  //       console.error("Error fetching videos:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchVideos();
  // }, []);

  // Handle video click - open in new tab
  // const handleVideoClick = (videoLink: string) => {
  //   window.open(videoLink, "_blank", "noopener,noreferrer");
  // };

  // Format date
  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   const options: Intl.DateTimeFormatOptions = {
  //     day: "2-digit",
  //     month: "long",
  //     year: "numeric",
  //   };
  //   return date.toLocaleDateString("id-ID", options);
  // };

  // Peran WPA data
  const peranWPA = [
    {
      icon: BookOpen,
      color: "red",
      title: "Edukasi & KIE",
      desc: "Memberikan informasi yang benar tentang HIV/AIDS, cara pencegahan, dan penanganan melalui berbagai media termasuk website WASKITA",
    },
    {
      icon: Users,
      color: "blue",
      title: "Pemberdayaan Masyarakat",
      desc: "Menggerakkan masyarakat untuk peduli dan aktif dalam pencegahan HIV/AIDS di lingkungan sekitar",
    },
    {
      icon: Shield,
      color: "green",
      title: "Mengurangi Stigma",
      desc: "Menghilangkan stigma dan diskriminasi terhadap ODHA melalui pendekatan yang humanis",
    },
    {
      icon: Heart,
      color: "pink",
      title: "Dukungan ODHA",
      desc: "Memberikan dukungan moral dan sosial kepada Orang dengan HIV/AIDS agar tetap semangat menjalani pengobatan",
    },
    {
      icon: Target,
      color: "purple",
      title: "Konseling HIV/AIDS",
      desc: "Menyediakan layanan konseling untuk masyarakat yang membutuhkan informasi atau dukungan terkait HIV/AIDS",
    },
    {
      icon: TrendingUp,
      color: "orange",
      title: "Monitoring & Evaluasi",
      desc: "Memantau perkembangan kasus dan efektivitas program pencegahan di wilayah Tembalang",
    },
  ];

  return (
    <>
      <Header title="Apa Itu WPA?" />
      <ChatBot />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white scroll-smooth ">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-800 via-red-900 to-red-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-5 py-16 md:py-24 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4.5">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  <Award className="w-4 h-4" />
                  <span>Program TERAS WASKITA 2025</span>
                </div>
                <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Warga Peduli AIDS
                  <span className="block text-red-100 mt-1">(WPA)</span>
                </h1>

                <p className="text-lg md:text-xl text-red-50 leading-relaxed">
                  Relawan masyarakat yang berperan aktif dalam pencegahan dan
                  penanggulangan HIV/AIDS di Kelurahan Tembalang, Semarang
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group">
                    Bergabung Jadi WPA
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a
                    className="bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/30 inline-block"
                    href="#tentang-wpa"
                  >
                    Pelajari Lebih Lanjut
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <Image
                    src="/stop-aids.jpg"
                    alt="HIV/AIDS Awareness"
                    width={600}
                    height={400}
                    className="rounded-2xl object-cover w-full shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 -mt-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 rounded-xl p-3">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">64%</div>
                  <div className="text-slate-600 font-medium mt-1">
                    ODHIV di Tembalang
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Tertinggi di wilayah Puskesmas Bulusan
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-xl p-3">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">
                    3 Tahun
                  </div>
                  <div className="text-slate-600 font-medium mt-1">
                    Roadmap Program
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    2025-2027: WPA hingga Kecamatan Tangguh
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-xl p-3">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">2023</div>
                  <div className="text-slate-600 font-medium mt-1">
                    CSO Award UNAIDS
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Penghargaan untuk STOPHIVA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-5 py-14 md:px-8 md:py-16 space-y-10">
          {/* Tentang WPA Section */}
          <section
            id="tentang-wpa"
            className="bg-white rounded-3xl shadow-lg ring-1 ring-black/5 overflow-hidden mb-16"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 rounded-xl p-3">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Apa Itu WPA?
                </h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-slate-700 leading-relaxed text-lg">
                  <strong className="text-red-600">
                    Warga Peduli AIDS (WPA)
                  </strong>{" "}
                  adalah sekelompok anggota masyarakat yang secara sukarela dan
                  sadar berperan aktif dalam upaya pencegahan dan penanggulangan
                  HIV/AIDS di lingkungannya. Mereka menjadi ujung tombak dalam
                  memberikan informasi yang benar, mengurangi stigma, dan
                  memberikan dukungan kepada Orang dengan HIV/AIDS (ODHA).
                </p>

                <p className="text-slate-700 leading-relaxed text-lg mt-6">
                  Keberadaan WPA sangat penting untuk membangun lingkungan yang
                  kondusif dan suportif, di mana setiap orang dapat mengakses
                  informasi, layanan tes, dan pengobatan tanpa rasa takut atau
                  diskriminasi.
                </p>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 mt-8 border border-red-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <Lightbulb className="w-7 h-7 text-red-600" />
                    Program TERAS WASKITA
                  </h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    <strong>TERAS WASKITA</strong> adalah program inisiasi yang
                    bertujuan untuk membentuk dan memperkuat WPA di Kelurahan
                    Tembalang melalui literasi digital berbasis website WASKITA
                    (Wadah Sinau Kita).
                  </p>
                  <p className="text-slate-600 leading-relaxed italic">
                    &quot;Tembalang Responsif dan Antisipatif HIV AIDS Berbasis
                    Literasi Digital Website Wadah Sinau Kita oleh Warga Peduli
                    AIDS&quot;
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Peran & Tugas WPA */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Peran & Tugas WPA
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                WPA memiliki peran strategis dalam pencegahan dan penanggulangan
                HIV/AIDS di masyarakat
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {peranWPA.map((item, index) => {
                const colors = getColorClasses(item.color);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className={`${colors.bg} rounded-xl p-3 w-fit mb-4`}>
                      <item.icon className={`w-8 h-8 ${colors.icon}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Roadmap 3 Tahun */}
          <section className="bg-gradient-to-br from-rose-900 to-red-800 rounded-3xl shadow-2xl overflow-hidden text-white">
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Roadmap Program</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Perjalanan 3 Tahun TERAS WASKITA
                </h2>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                  Program yang berkelanjutan untuk mewujudkan Tembalang
                  responsif dan antisipatif terhadap HIV/AIDS
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    year: "2025",
                    phase: "Fase 1",
                    title: "Pembentukan WPA",
                    points: [
                      "Inisiasi WPA melalui FGD",
                      "Penerbitan SK Lurah",
                      "Pelatihan & ToT",
                      "Launching website WASKITA",
                    ],
                  },
                  {
                    year: "2026",
                    phase: "Fase 2",
                    title: "Kelurahan Tangguh HIV",
                    points: [
                      "Optimalisasi program WPA",
                      "Perluasan jangkauan edukasi",
                      "Penguatan kemitraan",
                      "Evaluasi & improvement",
                    ],
                  },
                  {
                    year: "2027",
                    phase: "Fase 3",
                    title: "Kecamatan Tangguh HIV",
                    points: [
                      "Replikasi model ke kecamatan",
                      "Pembentukan WPA di kelurahan lain",
                      "Scaling up program",
                      "Sustainability planning",
                    ],
                  },
                ].map((phase, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="text-yellow-300 font-bold text-sm mb-2">
                      {phase.phase}
                    </div>
                    <div className="text-4xl font-bold mb-2">{phase.year}</div>
                    <h3 className="text-xl font-bold mb-4 text-white">
                      {phase.title}
                    </h3>
                    <ul className="space-y-2">
                      {phase.points.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-slate-300"
                        >
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Fitur Website WASKITA */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Fitur Website WASKITA
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Platform digital yang dikelola oleh WPA untuk mendukung upaya
                pencegahan HIV/AIDS
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Materi Edukasi",
                  desc: "Poster, PPT, dan infografis tentang HIV/AIDS yang dibuat oleh WPA",
                  features: [
                    "Download gratis",
                    "Update berkala",
                    "Bahasa Indonesia",
                  ],
                },
                {
                  title: "Video Edukatif",
                  desc: "Konten video pembelajaran yang diproduksi oleh WPA",
                  features: [
                    "Tutorial pencegahan",
                    "Testimoni ODHA",
                    "Tips hidup sehat",
                  ],
                },
                {
                  title: "Layanan Konseling",
                  desc: "Konsultasi online dengan konselor terlatih",
                  features: ["Privat & aman", "Gratis", "Responsif"],
                },
                {
                  title: "Kuis Interaktif",
                  desc: "Test pengetahuan tentang HIV/AIDS",
                  features: ["Gamifikasi", "Sertifikat", "Leaderboard"],
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg ring-1 ring-black/5 p-8 hover:shadow-xl transition-all"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((feat, i) => (
                      <span
                        key={i}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Video Section */}
          {/* <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Video Penjelasan Tentang WPA
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Pelajari lebih lanjut tentang peran WPA melalui video edukatif
                berikut
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2
                    size={48}
                    className="animate-spin text-red-600 mx-auto mb-4"
                  />
                  <p className="text-slate-600 font-medium">Memuat video...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-700 font-bold">!</span>
                </div>
                <div>
                  <div className="font-semibold">Gagal memuat video</div>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-lg ring-1 ring-black/5">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Youtube size={40} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold text-lg mb-2">
                      Belum ada video tersedia
                    </p>
                    <p className="text-slate-500">
                      Video edukasi akan segera ditambahkan oleh tim WPA
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(video.link)}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group ring-1 ring-black/5"
                  >
                    <div className="relative h-52 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all"></div>
                      <Youtube
                        size={72}
                        className="text-white/90 group-hover:scale-110 transition-transform relative z-10"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={18} className="text-red-600" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                          <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                            Video Edukasi
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                        {video.judul}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(video.tanggal_ditambahkan)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section> */}

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-red-600 via-red-500 to-rose-600 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative p-8 md:p-16 text-center text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Mari Bergabung Menjadi WPA!
                </h2>
                <p className="text-lg md:text-xl text-red-50 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Jadilah bagian dari perubahan positif di Kelurahan Tembalang.
                  Bersama kita cegah dan tanggulangi HIV/AIDS!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-red-50 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 group text-lg">
                    Daftar Sekarang
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/30 text-lg">
                    Hubungi Kami
                  </button>
                </div>

                <div className="mt-12 pt-8 border-t border-white/20">
                  <p className="text-sm text-red-100 mb-3">Didukung oleh:</p>
                  <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium">
                    <span>STOPHIVA FKM Undip</span>
                    <span>•</span>
                    <span>Puskesmas Bulusan</span>
                    <span>•</span>
                    <span>Dinkes Kota Semarang</span>
                    <span>•</span>
                    <span>UNAIDS</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ApaItuWPAPage;
