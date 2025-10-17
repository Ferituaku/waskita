import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  profile_picture?: string;
  phone_number?: string;
  status?: string;
}

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

export async function GET() {
  try {
    const userFromToken = await getUserFromToken();

    if (!userFromToken) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const db = await getDb();
    const [users] = await db.query<User[]>(
      "SELECT id, name, email, role, profile_picture, phone_number, status FROM users WHERE id = ?",
      [userFromToken.id]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (err) {
    console.error("Fetch profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userFromToken = await getUserFromToken();

    if (!userFromToken) {
      return NextResponse.json(
        { message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const userId = userFromToken.id;
    const { name, email, currentPassword, newPassword } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const [existing] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email already used by another user" },
        { status: 400 }
      );
    }

    if (newPassword && newPassword.trim() !== "") {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Current password is required to change password" },
          { status: 400 }
        );
      }

      const [currentUser] = await db.query<User[]>(
        "SELECT password FROM users WHERE id = ?",
        [userId]
      );

      if (currentUser.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser[0].password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query(
        "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
        [name, email, hashedPassword, userId]
      );

      const newToken = jwt.sign(
        { id: userId, email, name, role: userFromToken.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      const response = NextResponse.json({
        message: "Profile and password updated successfully",
      });

      response.cookies.set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "lax",
      });

      return response;
    }

    await db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, userId]
    );

    const newToken = jwt.sign(
      { id: userId, email, name, role: userFromToken.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      message: "Profile updated successfully",
    });

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}