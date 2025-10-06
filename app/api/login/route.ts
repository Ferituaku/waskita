import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

interface User extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  nama: string; // jaga-jaga jika ada kolom 'nama'
  password?: string;
  role: "admin" | "user";
}

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
    const [rows] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const user = rows[0];
    if (!user.password) {
      return NextResponse.json(
        { message: "Konfigurasi akun tidak valid" },
        { status: 500 }
      );
    }

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
        name: user.name || user.nama,
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
