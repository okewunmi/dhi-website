import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard and sub-routes (not the login page itself)
  if (
    pathname.startsWith("/admin/") &&
    pathname !== "/admin" &&
    !pathname.startsWith("/api/")
  ) {
    const adminCookie = request.cookies.get("dhi_admin_session");
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
