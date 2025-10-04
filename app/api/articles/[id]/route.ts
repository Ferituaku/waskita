import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

// GET - Ambil artikel berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const db = await getDb();
    const [rows]: any = await db.query(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// PUT - Update artikel berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const { title, content, category, image_url } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json({ success: false, error: 'Title, content, and category are required' }, { status: 400 });
    }

    const db = await getDb();

    // Cek apakah artikel dengan ID tersebut ada
    const [existingArticle]: any = await db.query(
      'SELECT id FROM articles WHERE id = ?',
      [id]
    );

    if (existingArticle.length === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Update artikel
    const [result]: any = await db.query(
      `UPDATE articles 
       SET title = ?, content = ?, category = ?, image_url = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, content, category, image_url || '/default-image.jpg', id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
    }

    // Ambil data artikel yang sudah diupdate
    const [updatedArticle]: any = await db.query(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle[0]
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE - Hapus artikel berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const db = await getDb();

    // Cek apakah artikel dengan ID tersebut ada
    const [existingArticle]: any = await db.query(
      'SELECT id, title FROM articles WHERE id = ?',
      [id]
    );

    if (existingArticle.length === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Hapus artikel
    const [result]: any = await db.query(
      'DELETE FROM articles WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
      data: { id: parseInt(id), title: existingArticle[0].title }
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}

// PATCH - Update sebagian field artikel (partial update)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const updateData = await request.json();
    
    // Cek apakah ada field yang akan diupdate
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    const db = await getDb();

    // Cek apakah artikel dengan ID tersebut ada
    const [existingArticle]: any = await db.query(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );

    if (existingArticle.length === 0) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Buat query update dinamis
    const allowedFields = ['title', 'content', 'category', 'image_url'];
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    // Tambahkan updated_at dan id ke values
    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    const updateQuery = `UPDATE articles SET ${updateFields.join(', ')} WHERE id = ?`;
    
    const [result]: any = await db.query(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
    }

    // Ambil data artikel yang sudah diupdate
    const [updatedArticle]: any = await db.query(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle[0]
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}