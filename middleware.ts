import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "secretkey"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes("/favicon") ||
    pathname.includes("/logo")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userRole = payload.role as string;

        // Redirect ke dashboard sesuai role
        if (userRole === "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
          return NextResponse.redirect(new URL("/apa-itu-wpa", req.url));
        }
      } catch {
        // Token invalid, hapus dan biarkan akses login
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/unauthorized")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    const userRoutes = [
      "/quiz-user",
      "/apa-itu-wpa",
      "/beranda",
      "/user/profile/edit",
    ];
    const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

    if (isUserRoute) {
      if (userRole !== "user") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    const adminRoutes = [
      "/materi",
      "/admin/profile/edit",
      "/quiz",
      "/users-management",
      "/video-edukasi",
    ];
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAdminRoute) {
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

   
    if (pathname === "/") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/beranda", req.url));
      }
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
