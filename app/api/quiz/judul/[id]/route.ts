
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET judul by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const [rows] = await db.query("SELECT * FROM judul WHERE id_judul=?", [params.id]);
    const results = rows as any[];
    if (results.length === 0) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(results[0]);
  } catch (error) {
    console.error(`Failed to fetch quiz with id ${params.id}:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE judul
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { judul, jumlah_registrasi, cover } = await req.json();

    if (!judul || judul.trim() === "") {
      return NextResponse.json({ message: "Judul is required" }, { status: 400 });
    }

    const db = await getDb();
    await db.query(
      "UPDATE judul SET judul=?, jumlah_registrasi=?, cover=? WHERE id_judul=?",
      [judul, jumlah_registrasi, cover, params.id]
    );
    return NextResponse.json({ message: "Judul diperbarui" });
  } catch (error) {
    console.error(`Failed to update quiz with id ${params.id}:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE judul
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    // With ON DELETE CASCADE in the schema, we only need to delete from the parent table.
    await db.query("DELETE FROM judul WHERE id_judul=?", [params.id]);
    return NextResponse.json({ message: "Judul dihapus" });
  } catch (error) {
    console.error(`Failed to delete quiz with id ${params.id}:`, error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
