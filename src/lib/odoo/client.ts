/**
 * Odoo JSON-RPC client — base shared by all Odoo modules.
 *
 * Convention :
 *  - SERVER ONLY (jamais importé côté client / browser)
 *  - Cache du UID en mémoire process — réinitialisé à chaque cold start
 *  - Toutes les méthodes Odoo passent par `odoo(model, method, args, kwargs)`
 *
 * Variables d'environnement requises :
 *   ODOO_URL=https://act.odoo.com
 *   ODOO_DB=act
 *   ODOO_USER=api@a-ct.ma
 *   ODOO_API_KEY=xxxxxxxxxxxxxx
 */

const ODOO_URL     = process.env.ODOO_URL!;
const ODOO_DB      = process.env.ODOO_DB!;
const ODOO_USER    = process.env.ODOO_USER!;
const ODOO_API_KEY = process.env.ODOO_API_KEY!;

let cachedUid: number | null = null;

interface OdooJsonRpcResponse<T> {
  jsonrpc: "2.0";
  id?: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: { name?: string; debug?: string; arguments?: unknown[] };
  };
}

async function jsonRpc<T>(service: string, method: string, args: unknown[]): Promise<T> {
  if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_API_KEY) {
    throw new Error(
      "Configuration Odoo manquante (ODOO_URL · ODOO_DB · ODOO_USER · ODOO_API_KEY)"
    );
  }

  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
    }),
    // Pas de cache côté Next : la mise en cache est gérée par les fetchers métier
    cache: "no-store",
  });

  const data = (await res.json()) as OdooJsonRpcResponse<T>;
  if (data.error) {
    const debug = data.error.data?.debug ? `\n${data.error.data.debug}` : "";
    throw new Error(`Odoo error: ${data.error.message}${debug}`);
  }
  return data.result as T;
}

async function authenticate(): Promise<number> {
  if (cachedUid) return cachedUid;
  const uid = await jsonRpc<number | false>("common", "authenticate", [
    ODOO_DB,
    ODOO_USER,
    ODOO_API_KEY,
    {},
  ]);
  if (!uid) {
    throw new Error("Authentification Odoo échouée — vérifiez ODOO_USER / ODOO_API_KEY");
  }
  cachedUid = uid;
  return uid;
}

/**
 * Helper haut niveau — équivaut à `execute_kw` du XML-RPC Odoo.
 *
 * @example
 *   const ids = await odoo<number[]>("product.template", "search", [[["sale_ok", "=", true]]], { limit: 50 });
 *   const products = await odoo<any[]>("product.template", "read", [ids], { fields: ["name", "list_price"] });
 */
export async function odoo<T = unknown>(
  model: string,
  method: string,
  posArgs: unknown[] = [],
  kwArgs: Record<string, unknown> = {}
): Promise<T> {
  const uid = await authenticate();
  return jsonRpc<T>("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_API_KEY,
    model,
    method,
    posArgs,
    kwArgs,
  ]);
}

/** Sucre syntaxique pour `search_read` qui combine search + read en un seul appel. */
export async function odooSearchRead<T = Record<string, unknown>>(
  model: string,
  domain: unknown[] = [],
  options: { fields?: string[]; limit?: number; offset?: number; order?: string } = {}
): Promise<T[]> {
  return odoo<T[]>(model, "search_read", [domain], {
    fields: options.fields,
    limit: options.limit,
    offset: options.offset,
    order: options.order,
  });
}

/** Force le rafraîchissement du UID en cache (rare — utilisé après rotation de l'API key) */
export function resetOdooCache() {
  cachedUid = null;
}
