import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// UPDATE soal
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { pertanyaan } = await req.json();

    if (!pertanyaan || pertanyaan.trim() === "") {
      return NextResponse.json(
        { message: "Pertanyaan is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.query("UPDATE soal SET pertanyaan=? WHERE id_soal=?", [
      pertanyaan,
      id,
    ]);
    return NextResponse.json({ message: "Soal diperbarui" });
  } catch (error) {
    console.error(`Failed to update question:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE soal
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    // With ON DELETE CASCADE, related answers are also deleted automatically.
    await db.query("DELETE FROM soal WHERE id_soal=?", [id]);
    return NextResponse.json({ message: "Soal dihapus" });
  } catch (error) {
    console.error(`Failed to delete question:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
