import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET semua jawaban (atau filter pakai id_soal)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_soal = searchParams.get("id_soal");

  try {
    const db = await getDb();
    if (id_soal) {
      const [rows] = await db.query("SELECT * FROM jawaban WHERE id_soal=?", [
        id_soal,
      ]);
      return NextResponse.json(rows);
    }
    const [rows] = await db.query("SELECT * FROM jawaban");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch answers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST jawaban baru
export async function POST(req: Request) {
  try {
    const { id_soal, teks_jawaban, is_correct } = await req.json();

    // Perbaikan: cek null/undefined secara spesifik, bukan falsy values
    if (id_soal === null || id_soal === undefined || !teks_jawaban || teks_jawaban.trim() === "") {
      return NextResponse.json(
        { message: "id_soal and teks_jawaban are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const [result] = await db.query(
      "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)",
      [id_soal, teks_jawaban, is_correct ? 1 : 0]
    );
    return NextResponse.json(
      { message: "Jawaban ditambahkan", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create answer:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
