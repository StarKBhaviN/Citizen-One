import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/faq",
    "/contact",
    "/track-complaint",
    "/submit-complaint/confirmation",
  ];

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Handle static files and API routes separately
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token && !isPublicPath) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // If a token exists, determine the user's role via backend logic instead of useAuth()
  if (token && (pathname === "/login" || pathname === "/register")) {
    // Hypothetical logic to differentiate roles based on token, e.g., parsing a JWT.
    const userRole = extractRoleFromToken(token); // Example placeholder function
    if (userRole === "admin" || userRole === "officer" || userRole === "supervisor") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// Placeholder function for extracting the user's role from the token
// You can implement actual role extraction logic (e.g., JWT parsing)
function extractRoleFromToken(token) {
  // Decode the token and extract role (if applicable)
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Basic JWT decoding
    return payload.role;
  } catch (error) {
    return null; // Return null if token is invalid
  }
}
