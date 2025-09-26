"use client";

import { useState } from 'react'

interface Article {
  id?: number
  title: string
  content: string
  category: string
  imageUrl?: string
}

export default function ArticleForm() {
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
    category: 'Artikel'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Artikel berhasil dibuat!')
        setArticle({ title: '', content: '', category: 'Artikel' })
      }
    } catch (error) {
      alert('Error creating article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Judul artikel"
        value={article.title}
        onChange={(e) => setArticle({...article, title: e.target.value})}
        className="w-full p-2 border rounded"
        required
      />
      
      <select
        value={article.category}
        onChange={(e) => setArticle({...article, category: e.target.value})}
        className="w-full p-2 border rounded"
      >
        <option value="Artikel">Artikel</option>
        <option value="Edukasi">Edukasi</option>
        <option value="Video">Video</option>
      </select>
      
      <textarea
        placeholder="Konten artikel"
        value={article.content}
        onChange={(e) => setArticle({...article, content: e.target.value})}
        className="w-full p-2 border rounded h-32"
        required
      />
      
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : 'Simpan Artikel'}
      </button>
    </form>
  )
}