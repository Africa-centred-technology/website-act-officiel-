const SESSION_KEY = "act_session_id";
const CONSENT_KEY = "act_cookie_consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Generate a UUID v4 using the browser crypto API. */
function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Returns the current session ID if the user has accepted cookies.
 * Returns null if consent not granted or running server-side.
 */
export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  if (localStorage.getItem(CONSENT_KEY) !== "granted") return null;
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Creates a session ID, stores it, and registers it in GA4 as user_id.
 * Called by CookieBanner on acceptance.
 */
export function startSession(): string {
  const existing = localStorage.getItem(SESSION_KEY);
  const sessionId = existing ?? uuid();
  if (!existing) localStorage.setItem(SESSION_KEY, sessionId);
  window.gtag?.("set", { user_id: sessionId });
  return sessionId;
}

/**
 * Associates a real name + email with the current GA4 session.
 * Should be called after successful form submission.
 */
export function identifyUser(opts: { name: string; email?: string; source: string }) {
  const sessionId = getSessionId();
  if (!sessionId || !window.gtag) return;

  window.gtag("set", "user_properties", {
    display_name: opts.name,
  });

  window.gtag("event", "user_identified", {
    method: opts.source,
    session_id: sessionId,
  });
}
