import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/connectors",
  "/transforms",
  "/sync",
  "/compliance",
  "/settings",
  "/onboarding",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  // Check for Supabase auth cookie
  // Supabase stores auth tokens in cookies named sb-{ref}-auth-token
  const authCookie = request.cookies.getAll().find(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  // Also check for the newer Supabase cookie format
  const authCookie2 = request.cookies.get("sb-ddevkorgiutduydelhgv-auth-token");
  const authCookie3 = request.cookies.get("sb-ddevkorgiutduydelhgv-auth-token.0");

  if (!authCookie && !authCookie2 && !authCookie3) {
    // No auth cookie found — redirect to login
    // But don't redirect if this is an API/internal request
    if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add security headers to protected routes
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/connectors/:path*",
    "/transforms/:path*",
    "/sync/:path*",
    "/compliance/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
  ],
};

