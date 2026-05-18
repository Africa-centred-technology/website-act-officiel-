import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest): NextResponse {
  // Redirect non-www to www (canonical domain)
  const host = req.headers.get("host") ?? "";
  if (host === "a-ct.ma") {
    const url = req.nextUrl.clone();
    url.host = "www.a-ct.ma";
    return NextResponse.redirect(url, { status: 301 });
  }

  const res = intlMiddleware(req) as NextResponse;

  // Inject CSRF token cookie if absent (double-submit cookie pattern)
  if (!req.cookies.has("act_csrf")) {
    res.cookies.set("act_csrf", crypto.randomUUID(), {
      sameSite: "strict",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
