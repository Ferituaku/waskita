import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logout berhasil",
    });

    // Hapus cookie token
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expired immediately
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("❌ Logout error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}