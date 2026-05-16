import { NextResponse } from "next/server";

/**
 * Double-submit cookie CSRF validation.
 * The middleware sets `act_csrf` as a readable (non-HttpOnly) cookie.
 * Client JS reads it and sends it as `X-CSRF-Token` header.
 * This function checks that both values match.
 *
 * Returns a 403 NextResponse if invalid, or null if valid.
 */
export function validateCsrf(req: Request): NextResponse | null {
  const headerToken = req.headers.get("X-CSRF-Token");
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)act_csrf=([^;]+)/);
  const cookieToken = cookieMatch?.[1];

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return NextResponse.json(
      { error: "Token CSRF invalide. Rechargez la page et réessayez." },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Client-side helper — call from browser JS to get the CSRF token.
 * Usage: const token = getCsrfToken();
 *        headers: { "X-CSRF-Token": token }
 */
export function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)act_csrf=([^;]+)/);
  return match?.[1] ?? "";
}
