import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// UPDATE jawaban
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { teks_jawaban, is_correct } = await req.json();
  await pool.query(
    "UPDATE jawaban SET teks_jawaban=?, is_correct=? WHERE id_jawaban=?",
    [teks_jawaban, is_correct, params.id]
  );
  return NextResponse.json({ message: "Jawaban diperbarui" });
}

// DELETE jawaban
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM jawaban WHERE id_jawaban=?", [params.id]);
  return NextResponse.json({ message: "Jawaban dihapus" });
}
