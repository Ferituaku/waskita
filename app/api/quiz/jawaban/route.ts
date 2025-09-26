import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET semua jawaban (atau filter pakai id_soal)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_soal = searchParams.get("id_soal");

  if (id_soal) {
    const [rows] = await pool.query("SELECT * FROM jawaban WHERE id_soal=?", [id_soal]);
    return NextResponse.json(rows);
  }

  const [rows] = await pool.query("SELECT * FROM jawaban");
  return NextResponse.json(rows);
}

// POST jawaban baru
export async function POST(req: Request) {
  const { id_soal, teks_jawaban, is_correct } = await req.json();
  const [result] = await pool.query(
    "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)",
    [id_soal, teks_jawaban, is_correct || 0]
  );
  return NextResponse.json({ message: "Jawaban ditambahkan", result });
}
