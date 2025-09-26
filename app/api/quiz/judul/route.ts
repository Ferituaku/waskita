import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET semua judul
export async function GET() {
  const [rows] = await pool.query("SELECT * FROM judul");
  return NextResponse.json(rows);
}

// POST judul baru
export async function POST(req: Request) {
  const { judul, jumlah_registrasi, cover } = await req.json();
  const [result] = await pool.query(
    "INSERT INTO judul (judul, jumlah_registrasi, cover) VALUES (?, ?, ?)",
    [judul, jumlah_registrasi || 0, cover || null]
  );
  return NextResponse.json({ message: "Judul ditambahkan", result });
}
