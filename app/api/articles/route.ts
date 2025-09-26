import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db';

// GET - Ambil semua artikel dari database
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
  }
}

// POST - Tambah artikel baru ke database
export async function POST(request: NextRequest) {
  try {
    const { title, content, category, image_url } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json({ success: false, error: 'Title, content, and category are required' }, { status: 400 });
    }

    const [result]: any = await db.query(
      `INSERT INTO articles (title, content, category, image_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [title, content, category, image_url || '/default-image.jpg']
    );

    return NextResponse.json({
      success: true,
      data: { id: result.insertId, title, content, category, image_url }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 });
  }
}
