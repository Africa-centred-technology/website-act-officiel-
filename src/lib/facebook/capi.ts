import { createHash } from "crypto";

const PIXEL_ID        = process.env.META_PIXEL_ID         ?? "1550173629800746";
const ACCESS_TOKEN    = process.env.FACEBOOK_CAPI_TOKEN;
const TEST_EVENT_CODE = process.env.FACEBOOK_CAPI_TEST_CODE ?? null;
const GRAPH_API_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function sha256Phone(phone: string): string {
  const normalized = phone.replace(/\D/g, "");
  return createHash("sha256").update(normalized).digest("hex");
}

export interface CAPIUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  clientIp?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface CAPIAttributionData {
  attributionShare?: string;
}

export interface CAPIEvent {
  eventName: string;
  eventId: string;
  sourceUrl?: string;
  userData: CAPIUserData;
  customData?: Record<string, unknown>;
  attributionData?: CAPIAttributionData;
}

export async function sendCAPIEvent(event: CAPIEvent): Promise<void> {
  if (!ACCESS_TOKEN) {
    console.warn("[CAPI] FACEBOOK_CAPI_TOKEN non défini — événement ignoré");
    return;
  }

  const ud: Record<string, string> = {};
  if (event.userData.email)           ud.em                  = sha256(event.userData.email);
  if (event.userData.phone)           ud.ph                  = sha256Phone(event.userData.phone);
  if (event.userData.firstName)       ud.fn                  = sha256(event.userData.firstName);
  if (event.userData.lastName)        ud.ln                  = sha256(event.userData.lastName);
  if (event.userData.clientIp)        ud.client_ip_address   = event.userData.clientIp;
  if (event.userData.clientUserAgent) ud.client_user_agent   = event.userData.clientUserAgent;
  if (event.userData.fbp)             ud.fbp                 = event.userData.fbp;
  if (event.userData.fbc)             ud.fbc                 = event.userData.fbc;

  const eventTime = Math.floor(Date.now() / 1000);

  const payload: Record<string, unknown> = {
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
    data: [
      {
        event_name:       event.eventName,
        event_time:       eventTime,
        event_id:         event.eventId,
        event_source_url: event.sourceUrl,
        action_source:    "website",
        user_data:        ud,
        ...(event.customData      ? { custom_data:      event.customData }                                                         : {}),
        ...(event.attributionData ? { attribution_data: { attribution_share: event.attributionData.attributionShare ?? "1.0" } }   : {}),
        original_event_data: { event_name: event.eventName, event_time: eventTime },
      },
    ],
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[CAPI] ${event.eventName} — ${res.status}: ${text}`);
  }
}

export function extractClientInfo(req: Request): {
  clientIp: string;
  clientUserAgent: string;
  fbp: string;
  fbc: string;
} {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";

  const ua = req.headers.get("user-agent") ?? "";

  const cookie = req.headers.get("cookie") ?? "";
  const fbp = cookie.match(/_fbp=([^;]+)/)?.[1] ?? "";
  const fbc = cookie.match(/_fbc=([^;]+)/)?.[1] ?? "";

  return { clientIp: ip, clientUserAgent: ua, fbp, fbc };
}
