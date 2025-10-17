import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Video extends RowDataPacket {
  id: number;
  judul: string;
  link: string;
  tanggal_ditambahkan: string;
}

// GET - Fetch all videos
export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query<Video[]>(
      "SELECT * FROM video_edukasi ORDER BY tanggal_ditambahkan DESC"
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data video",
      },
      { status: 500 }
    );
  }
}

// POST - Add new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judul, link } = body;

    // Validation
    if (!judul || !link) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul dan link harus diisi",
        },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = link.match(youtubeRegex);
    if (!match || match[2].length !== 11) {
      return NextResponse.json(
        {
          success: false,
          message: "Link YouTube tidak valid",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO video_edukasi (judul, link) VALUES (?, ?)",
      [judul, link]
    );

    // Fetch the newly created video
    const [newVideo] = await db.query<Video[]>(
      "SELECT * FROM video_edukasi WHERE id = ?",
      [result.insertId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Video berhasil ditambahkan",
        data: newVideo[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan video",
      },
      { status: 500 }
    );
  }
}

// PUT - Update video
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, judul, link } = body;

    // Validation
    if (!id || !judul || !link) {
      return NextResponse.json(
        {
          success: false,
          message: "ID, judul, dan link harus diisi",
        },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = link.match(youtubeRegex);
    if (!match || match[2].length !== 11) {
      return NextResponse.json(
        {
          success: false,
          message: "Link YouTube tidak valid",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Check if video exists
    const [existingVideo] = await db.query<Video[]>(
      "SELECT * FROM video_edukasi WHERE id = ?",
      [id]
    );

    if (existingVideo.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Video tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await db.query<ResultSetHeader>(
      "UPDATE video_edukasi SET judul = ?, link = ? WHERE id = ?",
      [judul, link, id]
    );

    // Fetch the updated video
    const [updatedVideo] = await db.query<Video[]>(
      "SELECT * FROM video_edukasi WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Video berhasil diperbarui",
      data: updatedVideo[0],
    });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui video",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete video
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID video harus diisi",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Check if video exists
    const [existingVideo] = await db.query<Video[]>(
      "SELECT * FROM video_edukasi WHERE id = ?",
      [id]
    );

    if (existingVideo.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Video tidak ditemukan",
        },
        { status: 404 }
      );
    }

    await db.query<ResultSetHeader>(
      "DELETE FROM video_edukasi WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Video berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus video",
      },
      { status: 500 }
    );
  }
}