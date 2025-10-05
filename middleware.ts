import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "secretkey"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ⛔ Lewati middleware untuk halaman publik
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("/favicon") ||
    pathname.includes("/logo")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // 🔒 Jika tidak ada token → redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verifikasi token menggunakan jose (Edge Runtime compatible)
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    // 🔴 ADMIN ROUTES - Hanya admin yang bisa akses
    const adminRoutes = ["/materi", "/profile", "/quiz", "/users", "/video-edukasi"];
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

    if (isAdminRoute && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 🔵 USER ROUTES - Hanya user biasa yang bisa akses
    const userRoutes = ["/apa-itu-wpa", "/beranda", "/quiz-user"];
    const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

    if (isUserRoute && userRole !== "user") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Invalid token:", err);
    // Token tidak valid, hapus cookie dan redirect ke login
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    // 🔴 Admin routes
    "/materi/:path*",
    "/profile/:path*",
    "/quiz/:path*",
    "/users/:path*",
    "/video-edukasi/:path*",
    
    // 🔵 User routes
    "/apa-itu-wpa/:path*",
    "/beranda/:path*",
    "/quiz-user/:path*",
  ],
};