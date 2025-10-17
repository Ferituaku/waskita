import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, OkPacket } from "mysql2/promise";
import { getDb } from "@/lib/db";

// Interface untuk data artikel
interface Article extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  category: "HIV" | "AIDS";
  file_type: "text" | "pdf";
  file_url?: string;
  image_url: string;
}

// Tipe untuk parameter dinamis dari URL
// Ini adalah bagian kunci untuk membantu TypeScript
type RouteParams = {
  params: {
    id: string;
  };
};

// GET - Ambil artikel berdasarkan ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const db = await getDb();
    // ... sisa kode GET ...
    const [rows] = await db.query<Article[]>(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 }
    );
  }
}

// PUT - Update artikel berdasarkan ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    // ... sisa kode PUT ...
    const { title, content, category, image_url, file_type, file_url } =
      await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    if (category !== "HIV" && category !== "AIDS") {
      return NextResponse.json(
        { success: false, error: "Category must be HIV or AIDS" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const [result] = await db.query<OkPacket>(
      `UPDATE articles 
       SET title = ?, content = ?, category = ?, image_url = ?, file_type = ?, file_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        content,
        category,
        image_url || "/default-image.jpg",
        file_type || "text",
        file_url || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    const [updatedRows] = await db.query<Article[]>(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      data: updatedRows[0],
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
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    // ... sisa kode DELETE ...
    const db = await getDb();

    const [existingArticle] = await db.query<Article[]>(
      "SELECT id, title FROM articles WHERE id = ?",
      [id]
    );

    if (existingArticle.length === 0) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    await db.query<OkPacket>("DELETE FROM articles WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
      data: { id: parseInt(id), title: existingArticle[0].title },
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}

// PATCH - Update sebagian field artikel
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    // ... sisa kode PATCH ...
    const updateData = await request.json();

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    // ... (sisanya sama, tidak perlu diubah) ...
    const db = await getDb();

    const allowedFields = [
      "title",
      "content",
      "category",
      "image_url",
      "file_type",
      "file_url",
    ];
    const setClauses: string[] = [];
    const queryValues: unknown[] = [];

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        queryValues.push(updateData[key]);
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    setClauses.push("updated_at = NOW()");
    queryValues.push(id);

    const updateQuery = `UPDATE articles SET ${setClauses.join(
      ", "
    )} WHERE id = ?`;

    await db.query<OkPacket>(updateQuery, queryValues);

    const [updatedArticle] = await db.query<Article[]>(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle[0],
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update article" },
      { status: 500 }
    );
  }
}
