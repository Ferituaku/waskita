import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// UPDATE soal
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { pertanyaan } = await req.json();
  await pool.query("UPDATE soal SET pertanyaan=? WHERE id_soal=?", [
    pertanyaan,
    params.id,
  ]);
  return NextResponse.json({ message: "Soal diperbarui" });
}

// DELETE soal
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM soal WHERE id_soal=?", [params.id]);
  return NextResponse.json({ message: "Soal dihapus" });
}
