import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET semua judul with question count
export async function GET() {
  try {
    const db = await getDb();
    const query = `
      SELECT 
        j.*, 
        COUNT(s.id_soal) AS questionCount
      FROM 
        judul j
      LEFT JOIN 
        soal s ON j.id_judul = s.id_judul
      GROUP BY 
        j.id_judul
      ORDER BY 
        j.tanggal_terbuat DESC;
    `;
    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch quiz titles:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST judul baru
export async function POST(req: Request) {
  try {
    const { judul, jumlah_registrasi, cover } = await req.json();

    if (!judul || judul.trim() === "") {
      return NextResponse.json(
        { message: "Judul is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const [result] = await db.query(
      "INSERT INTO judul (judul, jumlah_registrasi, cover) VALUES (?, ?, ?)",
      [judul, jumlah_registrasi || 0, cover || null]
    );
    return NextResponse.json(
      { message: "Judul ditambahkan", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create quiz title:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
