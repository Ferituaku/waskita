import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_picture?: string;
  status?: string;
}

export async function GET(req: Request) {
  try {
    const db = await getDb();
    const [users] = await db.query<User[]>(
      "SELECT id, name, email, role, profile_picture, status FROM users ORDER BY id ASC"
    );

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Fetch users error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const [existing] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password, role, profile_picture) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role || "User", "/default-profile.jpg"]
    );

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Create user error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, email, role, password } = await req.json();

    if (!id || !name || !email) {
      return NextResponse.json(
        { message: "ID, name, and email are required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const [existing] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Email already used by another user" },
        { status: 400 }
      );
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?",
        [name, email, role || "User", hashedPassword, id]
      );
    } else {
      await db.query(
        "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
        [name, email, role || "User", id]
      );
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const [existing] = await db.query<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}