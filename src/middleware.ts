import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  // Add other protected routes here
]);

const isPublicRoutes = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  // Add other public routes here
]);

// Go back to the original Clerk middleware implementation
export default clerkMiddleware((auth, req) => {
  if (isPublicRoutes(req)) {
    return; // Allow access to public routes
  }

  if (isProtectedRoutes(req)) {
    auth.protect();
  }

  // For auth callback routes, ensure they're treated as dynamic
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    const headers = new Headers();
    headers.set("Cache-Control", "no-store, must-revalidate");
    headers.set("x-middleware-cache", "no-cache");

    return NextResponse.next({
      headers,
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Explicitly include auth callback routes
    "/auth/callback(.*)",
  ],
};
