import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface QuizResultWithUser extends RowDataPacket {
  id: number;
  nama: string;
  email: string;
  tanggal: Date;
  nilai: number;
  user_id: number;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
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
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Only admins can view quiz results
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const db = await getDb();

    // Updated query to join with users table for complete user information
    const query = `
      SELECT 
        hk.id_hasil as id,
        COALESCE(u.name, hk.nama_peserta) as nama,
        u.email as email,
        hk.tanggal_pengerjaan as tanggal,
        hk.nilai,
        hk.user_id
      FROM 
        hasil_kuis hk
      LEFT JOIN 
        users u ON hk.user_id = u.id
      WHERE 
        hk.id_judul = ?
      ORDER BY 
        hk.nilai DESC, hk.tanggal_pengerjaan DESC
    `;

    const [rows] = await db.query<QuizResultWithUser[]>(query, [params.quizId]);

    // Transform the data to include user status
    const resultsWithStatus = rows.map((row) => ({
      id: row.id,
      nama: row.nama,
      email: row.email || "Email tidak tersedia",
      tanggal: row.tanggal,
      nilai: row.nilai,
      isRegisteredUser: !!row.user_id,
    }));

    return NextResponse.json(resultsWithStatus);
  } catch (error) {
    console.error(`Failed to fetch results for quiz ${params.quizId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
