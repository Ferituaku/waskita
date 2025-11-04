import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface BatchUpdatePayload {
  questions_to_add: Array<{
    id_soal: number;
    id_judul: number;
    pertanyaan: string;
  }>;
  questions_to_update: Array<{
    id_soal: number;
    id_judul: number;
    pertanyaan: string;
  }>;
  questions_to_delete: number[];
  answers_to_add: Array<{
    id_jawaban: number;
    id_soal: number;
    teks_jawaban: string;
    is_correct: boolean;
  }>;
  answers_to_update: Array<{
    id_jawaban: number;
    id_soal: number;
    teks_jawaban: string;
    is_correct: boolean;
  }>;
  answers_to_delete: number[];
}

// PUT - Batch update quiz questions and answers
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const connection = await (await getDb()).getConnection();
  
  try {
    const { id: quizId } = await params;
    const payload: BatchUpdatePayload = await req.json();

    console.log("📦 Batch update payload:", payload);

    // Validasi quiz exists
    const [quizRows] = await connection.query<RowDataPacket[]>(
      "SELECT id_judul FROM judul WHERE id_judul = ?",
      [quizId]
    );

    if (quizRows.length === 0) {
      connection.release();
      return NextResponse.json(
        { message: "Quiz tidak ditemukan" },
        { status: 404 }
      );
    }

    // Start transaction
    await connection.beginTransaction();

    const idMapping: { [key: number]: number } = {}; // Map temp ID to real ID

    try {
      // 1. DELETE questions (CASCADE will delete related answers)
      if (payload.questions_to_delete.length > 0) {
        await connection.query(
          `DELETE FROM soal WHERE id_soal IN (${payload.questions_to_delete.join(",")})`,
          []
        );
        console.log("✅ Deleted questions:", payload.questions_to_delete);
      }

      // 2. ADD new questions
      for (const q of payload.questions_to_add) {
        if (!q.pertanyaan.trim()) continue;

        const [result] = await connection.query<ResultSetHeader>(
          "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)",
          [quizId, q.pertanyaan.trim()]
        );
        
        idMapping[q.id_soal] = result.insertId; // Map temp ID to real ID
        console.log(`✅ Added question: ${q.id_soal} -> ${result.insertId}`);
      }

      // 3. UPDATE existing questions
      for (const q of payload.questions_to_update) {
        if (!q.pertanyaan.trim()) continue;

        await connection.query(
          "UPDATE soal SET pertanyaan = ? WHERE id_soal = ?",
          [q.pertanyaan.trim(), q.id_soal]
        );
        console.log(`✅ Updated question: ${q.id_soal}`);
      }

      // 4. DELETE answers
      if (payload.answers_to_delete.length > 0) {
        await connection.query(
          `DELETE FROM jawaban WHERE id_jawaban IN (${payload.answers_to_delete.join(",")})`,
          []
        );
        console.log("✅ Deleted answers:", payload.answers_to_delete);
      }

      // 5. ADD new answers (map temp question IDs to real IDs)
      for (const a of payload.answers_to_add) {
        if (!a.teks_jawaban.trim()) continue;

        // Get the real question ID (might be mapped from temp ID)
        const realQuestionId = idMapping[a.id_soal] || a.id_soal;

        await connection.query(
          "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)",
          [realQuestionId, a.teks_jawaban.trim(), a.is_correct ? 1 : 0]
        );
        console.log(`✅ Added answer for question: ${realQuestionId}`);
      }

      // 6. UPDATE existing answers
      for (const a of payload.answers_to_update) {
        if (!a.teks_jawaban.trim()) continue;

        await connection.query(
          "UPDATE jawaban SET teks_jawaban = ?, is_correct = ? WHERE id_jawaban = ?",
          [a.teks_jawaban.trim(), a.is_correct ? 1 : 0, a.id_jawaban]
        );
        console.log(`✅ Updated answer: ${a.id_jawaban}`);
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      console.log("✅ Batch update successful!");

      return NextResponse.json(
        {
          message: "Perubahan berhasil disimpan!",
          idMapping, // Return ID mapping for frontend
        },
        { status: 200 }
      );
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    if (connection) connection.release();
    
    console.error("❌ Batch update failed:", error);
    return NextResponse.json(
      {
        message: "Gagal menyimpan perubahan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}