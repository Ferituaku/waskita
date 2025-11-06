// app/api/soal/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// GET semua soal
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_judul = searchParams.get("id_judul");

  try {
    const db = await getDb();
    
    if (id_judul) {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM soal WHERE id_judul = ?", 
        [id_judul]
      );
      return NextResponse.json(rows);
    }

    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM soal");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { 
        message: "Gagal mengambil data soal",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// POST soal baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_judul, pertanyaan } = body;

    // Validasi input
    if (!id_judul) {
      return NextResponse.json(
        { message: "id_judul wajib diisi" },
        { status: 400 }
      );
    }

    if (!pertanyaan || typeof pertanyaan !== 'string' || pertanyaan.trim() === "") {
      return NextResponse.json(
        { message: "Pertanyaan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Cek apakah id_judul exists di tabel judul
    const [judulRows] = await db.query<RowDataPacket[]>(
      "SELECT id_judul FROM judul WHERE id_judul = ?",
      [id_judul]
    );

    if (judulRows.length === 0) {
      return NextResponse.json(
        { message: "id_judul tidak ditemukan" },
        { status: 404 }
      );
    }

    // Insert soal baru
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)",
      [id_judul, pertanyaan.trim()]
    );

    return NextResponse.json(
      { 
        message: "Soal berhasil ditambahkan",
        id_soal: result.insertId, // ← sesuai dengan struktur tabel
        data: {
          id_soal: result.insertId,
          id_judul,
          pertanyaan: pertanyaan.trim()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create question:", error);
    
    // Handle foreign key constraint error
    if (error instanceof Error && error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        { message: "id_judul tidak valid atau tidak ditemukan" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Gagal menambahkan soal",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}