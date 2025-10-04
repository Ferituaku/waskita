import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const db = await getDb();
    const query = `
      SELECT 
        id_hasil as id, 
        nama_peserta as nama, 
        tanggal_pengerjaan as tanggal, 
        nilai 
      FROM 
        hasil_kuis 
      WHERE 
        id_judul = ? 
      ORDER BY 
        nilai DESC, tanggal_pengerjaan DESC;
    `;
    const [rows] = await db.query(query, [params.quizId]);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(`Failed to fetch results for quiz ${params.quizId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
