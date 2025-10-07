import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { BatchUpdatePayload } from "@/types/quiz";
import type { Pool, PoolConnection } from "mysql2/promise";

// Helper to run operations in a transaction
async function runInTransaction(
  db: Pool,
  operations: (conn: PoolConnection) => Promise<void>
) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await operations(connection);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error; // Re-throw the error to be caught by the outer handler
  } finally {
    connection.release();
  }
}

// Batch update questions and answers for a quiz
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { quizId } = await params;

  try {
    const db = await getDb();
    const body: BatchUpdatePayload = await req.json();

    await runInTransaction(db, async (conn) => {
      const {
        questions_to_add,
        questions_to_update,
        questions_to_delete,
        answers_to_add,
        answers_to_update,
        answers_to_delete,
      } = body;

      // Deletions first for data integrity
      if (answers_to_delete.length > 0) {
        await conn.query("DELETE FROM jawaban WHERE id_jawaban IN (?)", [
          answers_to_delete,
        ]);
      }
      if (questions_to_delete.length > 0) {
        // ON DELETE CASCADE in schema handles deleting related answers automatically
        await conn.query("DELETE FROM soal WHERE id_soal IN (?)", [
          questions_to_delete,
        ]);
      }

      // Updates
      for (const question of questions_to_update) {
        await conn.query("UPDATE soal SET pertanyaan=? WHERE id_soal=?", [
          question.pertanyaan,
          question.id_soal,
        ]);
      }
      for (const answer of answers_to_update) {
        await conn.query(
          "UPDATE jawaban SET teks_jawaban=?, is_correct=? WHERE id_jawaban=?",
          [answer.teks_jawaban, answer.is_correct ? 1 : 0, answer.id_jawaban]
        );
      }

      // Additions: Process new questions and their related answers
      for (const question of questions_to_add) {
        // Insert the new question and get its actual new ID from the DB
        const [result] = await conn.query(
          "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)",
          [quizId, question.pertanyaan]
        );
        const newQuestionId = (result as any).insertId;

        // Find answers that belong to this new question by matching the temporary ID
        const relatedAnswers = answers_to_add.filter(
          (a) => a.id_soal === question.id_soal
        );

        // Insert these answers using the new, real question ID
        for (const answer of relatedAnswers) {
          await conn.query(
            "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)",
            [newQuestionId, answer.teks_jawaban, answer.is_correct ? 1 : 0]
          );
        }
      }

      // Additions: Process new answers that belong to EXISTING questions
      const answersForExistingQuestions = answers_to_add.filter(
        (a) => typeof a.id_soal === "number" && a.id_soal < 1_000_000_000
      );
      for (const answer of answersForExistingQuestions) {
        await conn.query(
          "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)",
          [answer.id_soal, answer.teks_jawaban, answer.is_correct ? 1 : 0]
        );
      }
    });

    return NextResponse.json({ message: "Kuis berhasil diperbarui" });
  } catch (error) {
    console.error(`Failed to manage quiz with id ${quizId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
