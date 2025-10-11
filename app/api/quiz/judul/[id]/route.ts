import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { OkPacket, RowDataPacket } from "mysql2";

interface Judul extends RowDataPacket {
  id_judul: number;
  judul: string;
  tanggal_terbuat: Date;
  jumlah_registrasi: number;
  cover?: string;
}

// GET judul by ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    const [rows] = await db.query<Judul[]>(
      "SELECT * FROM judul WHERE id_judul=?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error(`Failed to fetch quiz with id:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE judul
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { judul, jumlah_registrasi, cover } = await req.json();

    if (!judul || judul.trim() === "") {
      return NextResponse.json(
        { message: "Judul is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    await db.query<OkPacket>(
      "UPDATE judul SET judul=?, jumlah_registrasi=?, cover=? WHERE id_judul=?",
      [judul, jumlah_registrasi, cover, id]
    );
    return NextResponse.json({ message: "Judul diperbarui" });
  } catch (error) {
    console.error(`Failed to update quiz:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE judul
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.query<OkPacket>("DELETE FROM judul WHERE id_judul=?", [id]);
    return NextResponse.json({ message: "Judul dihapus" });
  } catch (error) {
    console.error(`Failed to delete quiz:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
