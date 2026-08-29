import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  const isProtectedPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isApi || isProtectedPage) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await isValidSessionToken(token))) {
      if (isApi) {
        return NextResponse.json({ error: "No autorizado." }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
