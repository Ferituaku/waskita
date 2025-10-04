import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export interface UserPayload {
  id: number;
  email: string;
  name?: string;
  role: "admin" | "user";
}

/**
 * Fungsi untuk mendapatkan user dari token (Server Component)
 */
export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Fungsi untuk cek apakah user adalah admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Fungsi untuk cek apakah user adalah user biasa
 */
export async function isRegularUser(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "user";
}

/**
 * Fungsi untuk require authentication (redirect jika tidak login)
 * Gunakan di Server Component
 */
export async function requireAuth(
  requiredRole?: "admin" | "user"
): Promise<UserPayload> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized - No user found");
  }

  if (requiredRole && user.role !== requiredRole) {
    throw new Error(`Unauthorized - Required role: ${requiredRole}`);
  }

  return user;
}