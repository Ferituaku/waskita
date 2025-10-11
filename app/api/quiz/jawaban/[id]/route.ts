import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// UPDATE jawaban
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { teks_jawaban, is_correct } = await req.json();

    if (teks_jawaban.trim() === "") {
      return NextResponse.json(
        { message: "Teks jawaban cannot be empty" },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.query(
      "UPDATE jawaban SET teks_jawaban=?, is_correct=? WHERE id_jawaban=?",
      [teks_jawaban, is_correct ? 1 : 0, id]
    );
    return NextResponse.json({ message: "Jawaban diperbarui" });
  } catch (error) {
    console.error(`Failed to update answer:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE jawaban
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.query("DELETE FROM jawaban WHERE id_jawaban=?", [id]);
    return NextResponse.json({ message: "Jawaban dihapus" });
  } catch (error) {
    console.error(`Failed to delete answer:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
