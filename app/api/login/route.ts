import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Query user dari database
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verifikasi password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Buat JWT dengan role
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name || user.nama, // sesuaikan dengan kolom di DB
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" } // Diperpanjang jadi 24 jam
    );

    const res = NextResponse.json({
      message: "Login berhasil",
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.nama,
      },
    });

    // Simpan token di cookie dengan HttpOnly
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 jam
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}