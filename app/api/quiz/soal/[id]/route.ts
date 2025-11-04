import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// UPDATE soal
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { pertanyaan } = await req.json();

    console.log("📝 Update request:", { id, pertanyaan });

    // Validasi input
    if (!pertanyaan || typeof pertanyaan !== "string" || pertanyaan.trim() === "") {
      return NextResponse.json(
        { message: "Pertanyaan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Cek apakah soal exists
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id_soal FROM soal WHERE id_soal = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Soal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update soal
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE soal SET pertanyaan = ? WHERE id_soal = ?",
      [pertanyaan.trim(), id]
    );

    console.log("✅ Update result:", result);

    return NextResponse.json({
      message: "Soal berhasil diperbarui",
      data: {
        id_soal: parseInt(id),
        pertanyaan: pertanyaan.trim(),
        affectedRows: result.affectedRows,
      },
    });
  } catch (error) {
    console.error("❌ Failed to update question:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    
    return NextResponse.json(
      {
        message: "Gagal memperbarui soal",
        error: error instanceof Error ? error.message : "Unknown error",
      },
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

    console.log("🗑️ Delete request for id:", id);

    const db = await getDb();

    // Cek apakah soal exists
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id_soal FROM soal WHERE id_soal = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Soal tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete soal (jawaban akan terhapus otomatis karena ON DELETE CASCADE)
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM soal WHERE id_soal = ?",
      [id]
    );

    console.log("✅ Delete result:", result);

    return NextResponse.json({
      message: "Soal berhasil dihapus",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("❌ Failed to delete question:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    
    return NextResponse.json(
      {
        message: "Gagal menghapus soal",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}