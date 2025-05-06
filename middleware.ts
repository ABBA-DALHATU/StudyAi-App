import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply to /auth routes
  if (request.nextUrl.pathname.startsWith("/auth")) {
    const response = NextResponse.next();

    // Add headers to force dynamic behavior
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("x-middleware-cache", "no-cache");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"],
};
