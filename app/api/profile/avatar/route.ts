import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { ResultSetHeader } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

interface JWTPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

async function getUserFromToken(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) return null;

    const decoded = jwt.verify(token.value, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const userFromToken = await getUserFromToken();

    if (!userFromToken) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Only JPEG, PNG, and GIF allowed" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File too large. Max size is 5MB" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileExt = path.extname(file.name);
    const fileName = `avatar-${userFromToken.id}-${timestamp}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const avatarUrl = `/uploads/avatars/${fileName}`;
    const db = await getDb();
    
    await db.query<ResultSetHeader>(
      "UPDATE users SET profile_picture = ? WHERE id = ?",
      [avatarUrl, userFromToken.id]
    );

    return NextResponse.json({
      message: "Avatar updated successfully",
      avatarUrl,
    });
  } catch (err) {
    console.error("Upload avatar error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}