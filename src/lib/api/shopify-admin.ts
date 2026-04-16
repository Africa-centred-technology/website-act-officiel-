/**
 * Utilitaire partagé pour l'authentification Shopify Admin.
 *
 * Deux stratégies supportées :
 *  - Token permanent (shpat_ / shpua_) : retourné tel quel
 *  - OAuth client credentials : jeton 24h mis en cache (marge -5 min)
 *
 * Le cache est partagé par tous les modules qui importent ce fichier,
 * ce qui évite de multiplier les appels OAuth.
 */

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_SECRET = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getAdminToken(): Promise<string> {
  if (ADMIN_SECRET?.startsWith("shpat_") || ADMIN_SECRET?.startsWith("shpua_")) {
    return ADMIN_SECRET;
  }
  if (!CLIENT_ID || !ADMIN_SECRET) {
    throw new Error("Config OAuth Shopify manquante (CLIENT_ID / ADMIN_SECRET).");
  }
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: ADMIN_SECRET,
    }).toString(),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error("OAuth Shopify échoué.");

  cachedToken = data.access_token as string;
  tokenExpiresAt = Date.now() + ((data.expires_in || 86399) - 300) * 1000;
  return cachedToken;
}

/** URL de base de l'API Admin Shopify (GraphQL) */
export const shopifyAdminUrl = () =>
  `https://${DOMAIN}/admin/api/2024-01/graphql.json`;

/** URL de base de l'API REST Admin Shopify */
export const shopifyAdminRestUrl = (path: string) =>
  `https://${DOMAIN}/admin/api/2024-01/${path}`;
