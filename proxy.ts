import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPage = pathname.startsWith("/admin/dashboard");
  const isProtectedApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/admin") {
    return NextResponse.redirect(
      new URL(session ? "/admin/dashboard" : "/admin/login", request.url)
    );
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isProtectedPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isProtectedApi && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
