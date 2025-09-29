import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// UPDATE jawaban
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
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
      [teks_jawaban, is_correct ? 1 : 0, params.id]
    );
    return NextResponse.json({ message: "Jawaban diperbarui" });
  } catch (error) {
    console.error(`Failed to update answer with id ${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE jawaban
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    await db.query("DELETE FROM jawaban WHERE id_jawaban=?", [params.id]);
    return NextResponse.json({ message: "Jawaban dihapus" });
  } catch (error) {
    console.error(`Failed to delete answer with id ${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
