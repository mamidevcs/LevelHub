import { NextResponse } from "next/server";

const adminPaths = ["/admin", "/api/admin"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("role")?.value;

  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (role !== "admin") {
      if (pathname.startsWith("/api/admin")) {
        return new NextResponse(
          JSON.stringify({ error: "Yetkisiz erişim" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      } else {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
