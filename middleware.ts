import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin Dashboard and all Admin APIs
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isVercel = process.env.VERCEL === "1";
    const host = request.headers.get("host") || "";
    const isLocalhost =
      host.startsWith("localhost") ||
      host.startsWith("127.0.0.1") ||
      host.startsWith("[::1]");

    // In production, deployed to Vercel, or accessed remotely:
    if (!isDevelopment || isVercel || !isLocalhost) {
      // Return strict 404 to hide admin dashboard and prevent write operations
      return new NextResponse("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
