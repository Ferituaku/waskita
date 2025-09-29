import { NextResponse } from "next/server";

// Mock data as there's no results table in the schema
const mockResults = [
  { id: 1, nama: "Budi Santoso", tanggal: "2025-09-14", nilai: 95 },
  { id: 2, nama: "Ani Lestari", tanggal: "2025-09-14", nilai: 88 },
  { id: 3, nama: "Candra Wijaya", tanggal: "2025-09-15", nilai: 100 },
  { id: 4, nama: "Dewi Anggraini", tanggal: "2025-09-15", nilai: 76 },
  { id: 5, nama: "Eko Prasetyo", tanggal: "2025-09-16", nilai: 92 },
  { id: 6, nama: "Fitri Handayani", tanggal: "2025-09-16", nilai: 85 },
  { id: 7, nama: "Gilang Ramadhan", tanggal: "2025-09-17", nilai: 98 },
  { id: 8, nama: "Hesti Purwanti", tanggal: "2025-09-18", nilai: 70 },
  { id: 9, nama: "Indra Kusuma", tanggal: "2025-09-18", nilai: 81 },
  { id: 10, nama: "Joko Susilo", tanggal: "2025-09-19", nilai: 93 },
];

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    // In a real application, you would query the database based on quizId.
    // For now, we return the mock data regardless of the ID.
    console.log(`Fetching results for quizId: ${params.quizId}`);
    return NextResponse.json(mockResults);
  } catch (error) {
    console.error(`Failed to fetch results for quiz ${params.quizId}:`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
