import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// UPDATE judul
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { judul, jumlah_registrasi, cover } = await req.json();
  await pool.query(
    "UPDATE judul SET judul=?, jumlah_registrasi=?, cover=? WHERE id_judul=?",
    [judul, jumlah_registrasi, cover, params.id]
  );
  return NextResponse.json({ message: "Judul diperbarui" });
}

// DELETE judul
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM judul WHERE id_judul=?", [params.id]);
  return NextResponse.json({ message: "Judul dihapus" });
}
