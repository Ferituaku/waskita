import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET semua soal (atau filter pakai searchParams)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_judul = searchParams.get("id_judul");

  try {
    const db = await getDb();
    if (id_judul) {
      const [rows] = await db.query("SELECT * FROM soal WHERE id_judul=?", [
        id_judul,
      ]);
      return NextResponse.json(rows);
    }

    const [rows] = await db.query("SELECT * FROM soal");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST soal baru
export async function POST(req: Request) {
  try {
    const { id_judul, pertanyaan } = await req.json();

    if (!id_judul || !pertanyaan || pertanyaan.trim() === "") {
      return NextResponse.json(
        { message: "id_judul and pertanyaan are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const [result] = await db.query(
      "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)",
      [id_judul, pertanyaan]
    );
    return NextResponse.json(
      { message: "Soal ditambahkan", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create question:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
