import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db"; 
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    const db = await getDb();

    // cek apakah user sudah ada
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user"]
    );

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
