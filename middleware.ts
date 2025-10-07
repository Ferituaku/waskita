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

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    // 🔵 USER ROUTES - Cek dulu yang paling spesifik
    const userRoutes = ["/quiz-user", "/apa-itu-wpa", "/beranda"];
    const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

    if (isUserRoute) {
      if (userRole !== "user") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    // 🔴 ADMIN ROUTES
    const adminRoutes = ["/materi", "/profile", "/quiz", "/users", "/video-edukasi"];
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

    if (isAdminRoute) {
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();

  } catch (err) {
    console.error("❌ Invalid token:", err);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: [
    "/materi/:path*",
    "/profile/:path*",
    "/quiz/:path*",
    "/users/:path*",
    "/video-edukasi/:path*",
    "/apa-itu-wpa/:path*",
    "/beranda/:path*",
    "/quiz-user/:path*",
  ],
};
