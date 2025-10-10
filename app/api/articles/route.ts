import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { OkPacket, RowDataPacket } from "mysql2";

interface Article extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  category: string;
  image_url: string;
}

// GET - Ambil semua artikel dari database
export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<Article[]>(
      "SELECT * FROM articles ORDER BY created_at DESC"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 }
    );
  }
}

// POST - Tambah artikel baru ke database
export async function POST(request: NextRequest) {
  try {
    const { title, content, category, image_url } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const [result] = await db.query<OkPacket>(
      `INSERT INTO articles (title, content, category, image_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [title, content, category, image_url || "/default-image.jpg"]
    );

    return NextResponse.json(
      {
        success: true,
        data: { id: result.insertId, title, content, category, image_url },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create article" },
      { status: 500 }
    );
  }
}

// PUT - Update artikel berdasarkan ID
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Article ID is required" },
        { status: 400 }
      );
    }

    const { title, content, category, image_url } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Cek apakah artikel dengan ID tersebut ada
    const [existingArticle] = await db.query<Article[]>(
      "SELECT id FROM articles WHERE id = ?",
      [id]
    );

    if (existingArticle.length === 0) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    // Update artikel
    const [result] = await db.query<OkPacket>(
      `UPDATE articles 
       SET title = ?, content = ?, category = ?, image_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, content, category, image_url || "/default-image.jpg", id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update article" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      data: { id: parseInt(id), title, content, category, image_url },
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus artikel berdasarkan ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Article ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Cek apakah artikel dengan ID tersebut ada
    const [existingArticle] = await db.query<Article[]>(
      "SELECT id FROM articles WHERE id = ?",
      [id]
    );

    if (existingArticle.length === 0) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    // Hapus artikel
    const [result] = await db.query<OkPacket>(
      "DELETE FROM articles WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to delete article" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}