import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Create the intl middleware for locale detection
const intlMiddleware = createMiddleware(routing);

// Define role-based route access
const ROLE_ROUTES: Record<string, string[]> = {
  // Routes only accessible by super_admin
  super_admin: ["/admin/settings/backup"],
  // Routes accessible by admin and above
  admin: ["/admin/settings", "/admin/candidates", "/admin/blog/new", "/admin/blog/[id]/edit", "/admin/schedule/settings"],
  // Routes accessible by all authenticated users (editor and above)
  editor: ["/admin/blog", "/admin/dashboard", "/admin/profile", "/admin/inquiries", "/admin/page-views", "/admin/candidate-notes", "/admin/schedule"],
};

// Role hierarchy (higher index = higher privileges)
const ROLE_HIERARCHY = ["viewer", "editor", "admin", "super_admin"];

function getRoleLevel(role: string): number {
  const index = ROLE_HIERARCHY.indexOf(role);
  return index === -1 ? 0 : index;
}

function hasAccess(userRole: string, requiredRole: string): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}

function getRequiredRole(pathname: string): string | null {
  // Check from highest privilege to lowest
  for (const role of [...ROLE_HIERARCHY].reverse()) {
    const routes = ROLE_ROUTES[role];
    if (routes?.some((route) => pathname.startsWith(route.replace("[id]", "")))) {
      return role;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin dashboard redirect ──
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // ── Admin routes: authentication + RBAC ──
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access
    const userRole = (token.role as string) || "viewer";
    const requiredRole = getRequiredRole(pathname);

    if (requiredRole && !hasAccess(userRole, requiredRole)) {
      const dashboardUrl = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  // ── Admin API routes: authentication + role checks ──
  if (pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (token.role as string) || "viewer";

    // Settings backup API requires super_admin
    if (pathname.includes("/settings/backup") && !hasAccess(userRole, "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Settings modification requires admin
    if (pathname.startsWith("/api/admin/settings") && !hasAccess(userRole, "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  }

  // ── Non-locale routes: pass through (API, login, auth) ──
  if (pathname.startsWith("/api") || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // ── Public routes: locale detection & routing ──
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Admin routes
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    // Public routes — match everything except static files and Next.js internals
    "/((?!api|_next|images|uploads|favicon\\.ico|icon\\.png|apple-icon\\.png|.*\\..*).*)",
  ],
};
