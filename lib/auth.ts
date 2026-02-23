import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "dhi_admin_session";
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

export function generateSessionToken(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return Buffer.from(`${ADMIN_SECRET}:${timestamp}:${random}`).toString(
    "base64"
  );
}

export function validateSessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [secret] = decoded.split(":");
    return secret === ADMIN_SECRET;
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  if (!validateSessionToken(token)) return null;
  return { authenticated: true };
}

export async function requireAdminAuth() {
  const session = await getAdminSession();
  if (!session) {
    return false;
  }
  return true;
}

export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return validateSessionToken(token);
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
