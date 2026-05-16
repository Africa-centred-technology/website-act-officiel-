const SESSION_KEY      = "act_session_id";
const CONSENT_KEY      = "act_cookie_consent";
const CONSENT_DATE_KEY = "act_consent_date";
const USER_PROFILE_KEY = "act_user_profile";

const CONSENT_EXPIRY_MS = 180 * 24 * 60 * 60 * 1000; // 6 mois

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export interface UserProfile {
  name?:    string;
  email?:   string;
  phone?:   string;
  company?: string;
  locale?:  string;
  updatedAt?: string;
}

/* ── UUID helper ─────────────────────────────────────────────────────────── */

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/* ── Consentement ────────────────────────────────────────────────────────── */

/**
 * Vérifie si le consentement doit être re-demandé :
 *  - Jamais accordé
 *  - Expiré (> 6 mois)
 *  - Session ID absent alors que le consentement existe (cache vidé partiellement)
 */
export function needsConsent(): boolean {
  if (typeof window === "undefined") return false;

  const consent     = localStorage.getItem(CONSENT_KEY) as "granted" | "denied" | null;
  const consentDate = localStorage.getItem(CONSENT_DATE_KEY);
  const sessionId   = localStorage.getItem(SESSION_KEY);

  // Jamais répondu
  if (!consent) return true;

  // Consentement expiré
  if (consentDate) {
    const age = Date.now() - parseInt(consentDate, 10);
    if (age > CONSENT_EXPIRY_MS) {
      clearConsent();
      return true;
    }
  } else {
    // Ancien consent sans date → on le re-demande une fois pour migrer
    clearConsent();
    return true;
  }

  // Session ID absent alors que consent = "granted" (localStorage vidé partiellement)
  if (consent === "granted" && !sessionId) return true;

  return false;
}

/** Efface consentement + session + profil (expiration ou re-demande). */
export function clearConsent(): void {
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem(CONSENT_DATE_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
}

/** Retourne le choix actuel ("granted" | "denied" | null). */
export function getConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY) as "granted" | "denied" | null;
}

/* ── Session ─────────────────────────────────────────────────────────────── */

/**
 * Retourne le session ID si le consentement est accordé, sinon null.
 */
export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  if (localStorage.getItem(CONSENT_KEY) !== "granted") return null;
  return localStorage.getItem(SESSION_KEY);
}

/**
 * Crée ou récupère la session, enregistre la date de consentement,
 * et envoie le user_id à GA4.
 */
export function startSession(): string {
  const existing  = localStorage.getItem(SESSION_KEY);
  const sessionId = existing ?? uuid();

  localStorage.setItem(SESSION_KEY,      sessionId);
  localStorage.setItem(CONSENT_KEY,      "granted");
  localStorage.setItem(CONSENT_DATE_KEY, String(Date.now()));

  window.gtag?.("set", { user_id: sessionId });
  return sessionId;
}

/**
 * Enregistre un refus avec timestamp (pour savoir quand re-demander).
 * Supprime session + profil utilisateur (cookie fonctionnel non autorisé).
 */
export function declineConsent(): void {
  localStorage.setItem(CONSENT_KEY,      "denied");
  localStorage.setItem(CONSENT_DATE_KEY, String(Date.now()));
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
}

/* ── Profil utilisateur ──────────────────────────────────────────────────── */

/**
 * Retourne le profil stocké en localStorage.
 * Disponible même sans consentement (données saisies volontairement).
 */
export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

/**
 * Sauvegarde ou met à jour le profil utilisateur (cookie fonctionnel).
 * Nécessite le consentement "granted" — ignoré si refusé.
 */
export function setUserProfile(data: Partial<UserProfile>): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(CONSENT_KEY) !== "granted") return;
  const existing = getUserProfile() ?? {};
  const merged: UserProfile = {
    ...existing,
    ...Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined && v !== "")
    ),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(merged));

  // Sync avec GA4 si session active
  const sessionId = getSessionId();
  if (sessionId && window.gtag) {
    window.gtag("set", "user_properties", {
      display_name: merged.name,
    });
  }
}

/**
 * Associe un nom + email à la session GA4 active.
 * Appeler après soumission réussie d'un formulaire.
 */
export function identifyUser(opts: { name: string; email?: string; source: string }) {
  const sessionId = getSessionId();
  if (!sessionId || !window.gtag) return;

  window.gtag("set", "user_properties", { display_name: opts.name });
  window.gtag("event", "user_identified", {
    method:     opts.source,
    session_id: sessionId,
  });

  // Persiste dans le profil local
  setUserProfile({ name: opts.name, email: opts.email });
}

/**
 * Renvoie le nombre de jours avant expiration du consentement (ou null).
 */
export function consentDaysLeft(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CONSENT_DATE_KEY);
  if (!raw) return null;
  const elapsed = Date.now() - parseInt(raw, 10);
  const left    = Math.ceil((CONSENT_EXPIRY_MS - elapsed) / (1000 * 60 * 60 * 24));
  return left > 0 ? left : 0;
}
