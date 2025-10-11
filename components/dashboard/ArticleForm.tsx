"use client";

import { useState } from "react";

interface Article {
  id?: number;
  title: string;
  content: string;
  category: "HIV" | "AIDS";
  file_type: "text" | "pdf";
  file_url?: string;
  imageUrl?: string;
}

interface ApiResponse {
  success: boolean;
  data?: Article;
  error?: string;
}

export default function ArticleForm() {
  const [article, setArticle] = useState<Article>({
    title: "",
    content: "",
    category: "HIV",
    file_type: "text",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let content = article.content;

      // Jika tipe file adalah PDF dan ada file yang dipilih
      if (article.file_type === "pdf" && pdfFile) {
        // Dalam implementasi nyata, upload file ke server/storage
        // dan dapatkan URL-nya. Untuk sekarang, kita simpan nama file
        content = `PDF File: ${pdfFile.name}`;
      }

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...article,
          content,
        }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        alert("Artikel berhasil dibuat!");
        setArticle({
          title: "",
          content: "",
          category: "HIV",
          file_type: "text",
        });
        setPdfFile(null);
      } else {
        alert(result.error || "Gagal membuat artikel");
      }
    } catch (error) {
      console.error("Failed to submit article:", error);
      alert("Error: Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Judul Artikel
        </label>
        <input
          type="text"
          placeholder="Masukkan judul artikel"
          value={article.title}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <select
          value={article.category}
          onChange={(e) =>
            setArticle({
              ...article,
              category: e.target.value as "HIV" | "AIDS",
            })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="HIV">HIV</option>
          <option value="AIDS">AIDS</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipe Konten
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="file_type"
              value="text"
              checked={article.file_type === "text"}
              onChange={(e) => {
                setArticle({
                  ...article,
                  file_type: e.target.value as "text" | "pdf",
                });
                setPdfFile(null);
              }}
              className="w-4 h-4 text-blue-600"
            />
            <span>📝 Tulis Manual</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="file_type"
              value="pdf"
              checked={article.file_type === "pdf"}
              onChange={(e) => {
                setArticle({
                  ...article,
                  file_type: e.target.value as "text" | "pdf",
                  content: "",
                });
              }}
              className="w-4 h-4 text-blue-600"
            />
            <span>📄 Upload PDF</span>
          </label>
        </div>
      </div>

      {article.file_type === "text" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konten Artikel
          </label>
          <textarea
            placeholder="Tulis konten artikel di sini..."
            value={article.content}
            onChange={(e) =>
              setArticle({ ...article, content: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File PDF
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {pdfFile && (
            <p className="text-sm text-gray-600 mt-2">
              File terpilih: {pdfFile.name}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        {loading ? "Menyimpan..." : "Simpan Artikel"}
      </button>
    </form>
  );
}