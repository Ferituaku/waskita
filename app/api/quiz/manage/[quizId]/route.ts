import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { BatchUpdatePayload } from "@/types/quiz";
import type { Pool, PoolConnection, OkPacket } from "mysql2/promise";

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
    throw error;
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

      // STEP 1: Deletions first for data integrity
      if (answers_to_delete && answers_to_delete.length > 0) {
        await conn.query("DELETE FROM jawaban WHERE id_jawaban IN (?)", [
          answers_to_delete,
        ]);
      }
      
      if (questions_to_delete && questions_to_delete.length > 0) {
        // ON DELETE CASCADE in schema handles deleting related answers automatically
        await conn.query("DELETE FROM soal WHERE id_soal IN (?)", [
          questions_to_delete,
        ]);
      }

      // STEP 2: Updates
      if (questions_to_update && questions_to_update.length > 0) {
        for (const question of questions_to_update) {
          await conn.query("UPDATE soal SET pertanyaan=? WHERE id_soal=?", [
            question.pertanyaan,
            question.id_soal,
          ]);
        }
      }

      if (answers_to_update && answers_to_update.length > 0) {
        for (const answer of answers_to_update) {
          await conn.query(
            "UPDATE jawaban SET teks_jawaban=?, is_correct=? WHERE id_jawaban=?",
            [answer.teks_jawaban, answer.is_correct ? 1 : 0, answer.id_jawaban]
          );
        }
      }

      // STEP 3: Additions - Process new questions and their answers
      const processedAnswers = new Set(); // Track jawaban yang sudah diproses

      if (questions_to_add && questions_to_add.length > 0) {
        for (const question of questions_to_add) {
          // Insert the new question and get its actual new ID from the DB
          const [result] = await conn.query<OkPacket>(
            "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)",
            [quizId, question.pertanyaan]
          );
          const newQuestionId = result.insertId;

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
            // Mark this answer as processed to avoid duplicate insertion
            processedAnswers.add(answer);
          }
        }
      }

      // STEP 4: Additions - Process new answers for EXISTING questions only
      // Skip answers that were already processed in STEP 3
      if (answers_to_add && answers_to_add.length > 0) {
        const answersForExistingQuestions = answers_to_add.filter(
          (a) => !processedAnswers.has(a)
        );

        for (const answer of answersForExistingQuestions) {
          await conn.query(
            "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)",
            [answer.id_soal, answer.teks_jawaban, answer.is_correct ? 1 : 0]
          );
        }
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