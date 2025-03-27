import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  // Add other protected routes here
]);

const isPublicRoutes = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  // Add other public routes here
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoutes(req)) {
    return; // Allow access to public routes
  }

  if (isProtectedRoutes(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
