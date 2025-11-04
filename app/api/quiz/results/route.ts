import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { OkPacket, RowDataPacket } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface QuizResult extends RowDataPacket {
  id_hasil: number;
  id_judul: number;
  user_id: number;
  nama_peserta: string;
  nilai: number;
  grade: string;
  tanggal_pengerjaan: Date;
}

// Helper function to calculate grade based on score
function calculateGrade(nilai: number): string {
  if (nilai >= 80) return "A";
  if (nilai >= 65) return "B";
  if (nilai >= 50) return "C";
  if (nilai >= 35) return "D";
  return "E";
}

// Helper function to calculate score from correct answers
function calculateScore(totalQuestions: number, correctAnswers: number): number {
  if (totalQuestions === 0) return 0;
  const percentage = (correctAnswers / totalQuestions) * 100;
  return Math.round(percentage); // Rounded to nearest integer
}

// POST - Submit quiz result (for users taking quiz)
export async function POST(req: NextRequest) {
  try {
    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    let user: UserPayload;
    try {
      user = jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Only users with 'user' role can submit quiz results
    if (user.role !== "user") {
      return NextResponse.json(
        { message: "Forbidden - Admins cannot take quizzes" },
        { status: 403 }
      );
    }

    const { quizId, totalQuestions, correctAnswers } = await req.json();

    // Validation
    if (!quizId || totalQuestions === undefined || correctAnswers === undefined) {
      return NextResponse.json(
        { message: "Quiz ID, total questions, and correct answers are required" },
        { status: 400 }
      );
    }

    if (correctAnswers > totalQuestions || correctAnswers < 0 || totalQuestions <= 0) {
      return NextResponse.json(
        { message: "Invalid quiz data: correct answers cannot exceed total questions" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Check if quiz exists
    const [quizRows] = await db.query<RowDataPacket[]>(
      "SELECT id_judul FROM judul WHERE id_judul = ?",
      [quizId]
    );

    if (quizRows.length === 0) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Calculate score and grade
    const nilai = calculateScore(totalQuestions, correctAnswers);
    const grade = calculateGrade(nilai);

    // Check if user has already taken this quiz
    const [existingResults] = await db.query<QuizResult[]>(
      "SELECT id_hasil FROM hasil_kuis WHERE id_judul = ? AND user_id = ? ORDER BY tanggal_pengerjaan DESC LIMIT 1",
      [quizId, user.id]
    );

    // Insert the quiz result with grade
    const [result] = await db.query<OkPacket>(
      "INSERT INTO hasil_kuis (id_judul, user_id, nama_peserta, nilai) VALUES (?, ?, ?, ?)",
      [quizId, user.id, user.name || "Unknown User", nilai, grade]
    );

    // Update quiz registration count
    await db.query<OkPacket>(
      "UPDATE judul SET jumlah_registrasi = jumlah_registrasi + 1 WHERE id_judul = ?",
      [quizId]
    );

    return NextResponse.json(
      {
        message: "Quiz result saved successfully",
        data: {
          id_hasil: result.insertId,
          nilai: nilai,
          grade: grade,
          correctAnswers: correctAnswers,
          totalQuestions: totalQuestions,
          isRetake: existingResults.length > 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save quiz result:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET - Get all quiz results (admin only)
export async function GET(req: NextRequest) {
  try {
    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    let user: UserPayload;
    try {
      user = jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Only admins can view all quiz results
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const db = await getDb();

    const query = `
      SELECT 
        hk.id_hasil,
        hk.id_judul,
        hk.user_id,
        hk.nama_peserta,
        hk.nilai,
        hk.tanggal_pengerjaan,
        j.judul as quiz_title,
        u.email as user_email
      FROM 
        hasil_kuis hk
      INNER JOIN 
        judul j ON hk.id_judul = j.id_judul
      LEFT JOIN 
        users u ON hk.user_id = u.id
      ORDER BY 
        hk.tanggal_pengerjaan DESC
    `;

    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch all quiz results:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}