import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";
  const isAuthenticated = token.length > 0;

  const { pathname } = req.nextUrl;

  // ✅ Protect all /home and subroutes
  if (pathname.startsWith("/home") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Block login/signup pages for authenticated users
  const publicRoutes = ["/", "/signup", "/signin"];
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // ✅ Block access to OAuth/auth routes if already logged in
  const protectedAuthRoutes = [
    "/api/auth/github",
    "/api/auth/signup",
    "/api/auth/signin",
  ];
  if (protectedAuthRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signup",
    "/signin",
    "/home:path*",
    "/home/:path*",
    "/api/auth/github",
    "/api/auth/signup",
    "/api/auth/signin",
  ],
};
