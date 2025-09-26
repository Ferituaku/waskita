import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET semua soal (atau filter pakai searchParams)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_judul = searchParams.get("id_judul");

  if (id_judul) {
    const [rows] = await pool.query("SELECT * FROM soal WHERE id_judul=?", [id_judul]);
    return NextResponse.json(rows);
  }

  const [rows] = await pool.query("SELECT * FROM soal");
  return NextResponse.json(rows);
}

// POST soal baru
export async function POST(req: Request) {
  const { id_judul, pertanyaan } = await req.json();
  const [result] = await pool.query(
    "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)",
    [id_judul, pertanyaan]
  );
  return NextResponse.json({ message: "Soal ditambahkan", result });
}
