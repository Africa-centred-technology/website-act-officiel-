/**
 * Odoo — Events fetcher (formations = événements)
 *
 * Mappe `event.event` Odoo → mêmes types que ShopifyFormationCard / ShopifyFormationDetail
 * de manière à ce que les composants front (FormationsShell, FormationDetailShell, etc.)
 * basculent du backend Shopify au backend Odoo sans aucun changement de signature.
 *
 * Pourquoi `event.event` et pas `product.template` :
 *  - Sessions datées natives (date_begin / date_end)
 *  - Plusieurs sessions du même type (event.type)
 *  - Capacité native (seats_max / seats_available)
 *  - Inscriptions natives (event.registration)
 *  - Emails automatiques (event.mail) : confirmation, J-7, J-1, J+30
 *
 * Custom fields utilisés (créés par scripts/odoo-provision-events.mjs) :
 *   x_niveau              Selection
 *   x_format_pedagogique  Selection
 *   x_accroche            Text
 *   x_objectifs           Text(JSON)
 *   x_programme           Text(JSON)
 *   x_livrables           Text(JSON)
 *   x_methode             Text
 *   x_prerequis           Text
 *   x_public_cible        Text(JSON)
 */

import { odoo, odooSearchRead } from "./client";

// ── Types miroirs Shopify ────────────────────────────────────────────────────

export interface OdooFormationCard {
  id: string;             // slug stable (= event id préfixé)
  slug: string;
  title: string;
  secteur: string;
  categorie: string;
  niveau: string;
  duree: string;
  format: string;
  parcours?: string;
  prix: string;
  accroche: string;
  imageUrl?: string;
  odooId: number;
  /** Champs spécifiques events (optionnels — utilisables côté front pour afficher la session) */
  dateBegin?: string;
  dateEnd?: string;
  seatsAvailable?: number;
  seatsMax?: number;
  isOnline?: boolean;
}

export interface OdooFormationDetail extends OdooFormationCard {
  publicCible: string;
  prerequis: string[];      // ← liste, plus String
  outils: string[];         // ← nouveau (issu de x_outils)
  objectifs: string[];
  programme: { module: string; details: string[]; duree?: string }[];
  livrables: string[];
  methode: string;
  images?: string[];
  descriptionHtml?: string;
  /** Statut du badge LinkedIn associé : non | en_cours | disponible */
  badgeLinkedin?: "non" | "en_cours" | "disponible";
  /** Heures de production interne ACT (visible admin, pas affiché côté apprenant) */
  dureeProduction?: number;
}

// ── Helpers de parsing ───────────────────────────────────────────────────────

const NIVEAU_LABELS: Record<string, string> = {
  debutant:        "Débutant",
  intermediaire:   "Intermédiaire",
  avance:          "Avancé",
};

const FORMAT_LABELS: Record<string, string> = {
  presentiel:  "Présentiel",
  distanciel:  "Distanciel synchrone",
  hybride:     "Hybride",
};

function readScalar(v: unknown): string {
  if (v == null || v === false) return "";
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v) && v.length === 2 && typeof v[1] === "string") return v[1].trim();
  return String(v);
}

function readJsonField<T>(raw: unknown, fallback: T): T {
  if (raw == null || raw === false) return fallback;
  if (typeof raw === "object") return raw as T;
  if (typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    if (Array.isArray(fallback)) {
      return trimmed.split("\n").map((l) => l.trim()).filter(Boolean) as unknown as T;
    }
    return trimmed as unknown as T;
  }
}

function parseObjectifs(raw: unknown): string[] {
  const parsed = readJsonField<unknown>(raw, []);
  const list = Array.isArray(parsed) ? parsed : (parsed as { objectifs?: unknown[] })?.objectifs ?? [];
  return Array.isArray(list)
    ? list.filter((o) => typeof o === "string" && o.trim()).map((o) => (o as string).trim())
    : [];
}

function parsePublicCible(raw: unknown): string {
  const parsed = readJsonField<unknown>(raw, "");
  if (typeof parsed === "string") return parsed.trim();
  if (Array.isArray(parsed)) {
    return parsed.map((s) => String(s).trim()).filter(Boolean).join(",");
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as { metiers?: unknown[]; public_cible?: unknown[] };
    const list = obj.metiers ?? obj.public_cible ?? [];
    if (Array.isArray(list)) return list.map((s) => String(s).trim()).filter(Boolean).join(",");
  }
  return "";
}

function parseLivrables(raw: unknown): string[] {
  const parsed = readJsonField<unknown>(raw, []);
  const list = Array.isArray(parsed) ? parsed : (parsed as { livrables?: unknown[] })?.livrables ?? [];
  return Array.isArray(list)
    ? list.filter((l) => typeof l === "string" && l.trim()).map((l) => (l as string).trim())
    : [];
}

/** Parser générique pour des listes de strings stockées comme JSON ou texte (1 par ligne). */
function parseStringList(raw: unknown): string[] {
  const parsed = readJsonField<unknown>(raw, []);
  if (Array.isArray(parsed)) {
    return parsed.filter((s) => typeof s === "string" && s.trim()).map((s) => (s as string).trim());
  }
  if (typeof parsed === "string") {
    return parsed.split("\n").map((l) => l.trim()).filter(Boolean);
  }
  return [];
}

function parseProgramme(raw: unknown): { module: string; details: string[]; duree?: string }[] {
  const parsed = readJsonField<unknown>(raw, []);
  const list = Array.isArray(parsed) ? parsed : (parsed as { programme?: unknown[] })?.programme ?? [];
  if (!Array.isArray(list)) return [];
  return list
    .map((item: any) => ({
      module: item.module || item.titre || item.title || "",
      details: Array.isArray(item.details)
        ? item.details.filter((d: unknown) => typeof d === "string" && d)
        : Array.isArray(item.contenu)
        ? item.contenu.filter((d: unknown) => typeof d === "string" && d)
        : typeof item.details === "string"
        ? item.details.split("\n").filter(Boolean)
        : [],
      duree: item.duree || item.duration || undefined,
    }))
    .filter((m) => m.module);
}

function buildEventImageUrl(eventId: number): string {
  const base = process.env.ODOO_URL ?? "";
  return `${base}/web/image/event.event/${eventId}/cover_properties`;
}

function buildSlug(node: any): string {
  const stub = (node.name ?? `event-${node.id}`)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${stub}-${node.id}`;
}

function parseSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

function formatDateRange(dateBegin: string | false, dateEnd: string | false): string {
  if (!dateBegin || !dateEnd) return "";
  try {
    const begin = new Date(dateBegin);
    const end   = new Date(dateEnd);
    const sameDay = begin.toDateString() === end.toDateString();
    const dateFmt: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
    if (sameDay) {
      const hoursDiff = (end.getTime() - begin.getTime()) / 3600000;
      return `${begin.toLocaleDateString("fr-FR", dateFmt)} · ${Math.round(hoursDiff)}h`;
    }
    return `du ${begin.toLocaleDateString("fr-FR", dateFmt)} au ${end.toLocaleDateString("fr-FR", dateFmt)}`;
  } catch {
    return "";
  }
}

// ── Champs lus côté Odoo ─────────────────────────────────────────────────────

const CARD_FIELDS = [
  "id", "name", "event_type_id",
  "date_begin", "date_end", "date_tz",
  "seats_limited", "seats_max", "seats_reserved", "seats_available",
  "is_online", "is_published",
  "tag_ids",
  "x_niveau", "x_format_pedagogique", "x_accroche",
];

const DETAIL_FIELDS = [
  ...CARD_FIELDS,
  "description", "address_id",
  "x_methode", "x_prerequis", "x_public_cible",
  "x_objectifs", "x_programme", "x_livrables",
  "x_outils", "x_duree_production", "x_badge_linkedin",
];

// ── Tickets pour le prix ─────────────────────────────────────────────────────

interface OdooTicket {
  id: number;
  name: string;
  price: number;
  seats_max: number;
  seats_available: number;
}

async function fetchTicketsForEvents(eventIds: number[]): Promise<Map<number, OdooTicket[]>> {
  const map = new Map<number, OdooTicket[]>();
  if (!eventIds.length) return map;

  const tickets = await odooSearchRead<any>(
    "event.event.ticket",
    [["event_id", "in", eventIds]],
    { fields: ["id", "name", "price", "seats_max", "seats_available", "event_id"], limit: 500 }
  );
  for (const t of tickets) {
    const eid = Array.isArray(t.event_id) ? t.event_id[0] : t.event_id;
    if (!eid) continue;
    if (!map.has(eid)) map.set(eid, []);
    map.get(eid)!.push({
      id:               t.id,
      name:             t.name,
      price:            typeof t.price === "number" ? t.price : parseFloat(t.price ?? "0"),
      seats_max:        t.seats_max ?? 0,
      seats_available:  t.seats_available ?? 0,
    });
  }
  return map;
}

function formatPriceFromTickets(tickets: OdooTicket[] | undefined): string {
  if (!tickets || tickets.length === 0) return "Nous consulter";
  const prices = tickets.map((t) => t.price).filter((p) => p > 0);
  if (prices.length === 0) return "Gratuit";
  const min = Math.min(...prices);
  return `${Math.round(min)} dhs`;
}

// ── Mapping ──────────────────────────────────────────────────────────────────

function mapCard(node: any, tickets?: OdooTicket[]): OdooFormationCard {
  const slug = buildSlug(node);

  return {
    odooId:    node.id,
    id:        slug,
    slug,
    title:     node.name ?? "",
    secteur:   readScalar(node.event_type_id) || "Formation",
    categorie: readScalar(node.event_type_id),
    niveau:    NIVEAU_LABELS[readScalar(node.x_niveau)] || readScalar(node.x_niveau),
    duree:     formatDateRange(node.date_begin, node.date_end),
    format:    FORMAT_LABELS[readScalar(node.x_format_pedagogique)] || (node.is_online ? "Distanciel" : "Présentiel"),
    parcours:  undefined,
    prix:      formatPriceFromTickets(tickets),
    accroche:  readScalar(node.x_accroche) || "",
    imageUrl:  buildEventImageUrl(node.id),
    dateBegin: node.date_begin || undefined,
    dateEnd:   node.date_end || undefined,
    seatsMax:       node.seats_limited ? node.seats_max : undefined,
    seatsAvailable: node.seats_limited ? node.seats_available : undefined,
    isOnline:  Boolean(node.is_online),
  };
}

function mapDetail(node: any, tickets?: OdooTicket[]): OdooFormationDetail {
  const base = mapCard(node, tickets);
  const badge = readScalar(node.x_badge_linkedin);
  return {
    ...base,
    publicCible:     parsePublicCible(node.x_public_cible),
    prerequis:       parseStringList(node.x_prerequis),
    outils:          parseStringList(node.x_outils),
    methode:         readScalar(node.x_methode),
    objectifs:       parseObjectifs(node.x_objectifs),
    programme:       parseProgramme(node.x_programme),
    livrables:       parseLivrables(node.x_livrables),
    images:          [buildEventImageUrl(node.id)],
    descriptionHtml: typeof node.description === "string" ? node.description : "",
    badgeLinkedin:   (badge === "non" || badge === "en_cours" || badge === "disponible") ? badge : undefined,
    dureeProduction: typeof node.x_duree_production === "number" ? node.x_duree_production : undefined,
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Liste les sessions de formation publiées et à venir.
 *
 * @param options.onlyPublished   filtre is_published=true (défaut true)
 * @param options.onlyUpcoming    filtre date_begin >= now (défaut true)
 * @param options.includeFinished inclure les sessions passées (défaut false)
 */
export async function fetchOdooFormations(
  options: { onlyPublished?: boolean; onlyUpcoming?: boolean; includeFinished?: boolean } = {}
): Promise<OdooFormationCard[]> {
  const { onlyPublished = true, onlyUpcoming = true, includeFinished = false } = options;

  const domain: unknown[] = [];
  if (onlyPublished) domain.push(["is_published", "=", true]);
  if (onlyUpcoming && !includeFinished) {
    domain.push(["date_end", ">=", new Date().toISOString().slice(0, 19).replace("T", " ")]);
  }

  const events = await odooSearchRead<any>(
    "event.event",
    domain,
    { fields: CARD_FIELDS, limit: 250, order: "date_begin asc" }
  );

  const ticketsByEvent = await fetchTicketsForEvents(events.map((e) => e.id));
  return events.map((e) => mapCard(e, ticketsByEvent.get(e.id)));
}

/**
 * Récupère une session par son slug (= name slugifié + "-" + odoo id).
 * Si plusieurs sessions partagent le même nom, le suffixe id assure l'unicité.
 */
export async function fetchOdooFormationBySlug(slug: string): Promise<OdooFormationDetail | null> {
  const id = parseSlug(slug);
  if (!id) return null;

  const events = await odoo<any[]>(
    "event.event",
    "read",
    [[id]],
    { fields: DETAIL_FIELDS }
  );
  if (!events.length) return null;

  const ticketsByEvent = await fetchTicketsForEvents([id]);
  return mapDetail(events[0], ticketsByEvent.get(id));
}

/**
 * Récupère toutes les sessions futures d'un même event.type
 * (utile pour proposer "Autres sessions de cette formation" sur la page détail)
 */
export async function fetchSessionsByType(typeId: number): Promise<OdooFormationCard[]> {
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const events = await odooSearchRead<any>(
    "event.event",
    [["event_type_id", "=", typeId], ["date_end", ">=", now], ["is_published", "=", true]],
    { fields: CARD_FIELDS, order: "date_begin asc", limit: 20 }
  );
  const tickets = await fetchTicketsForEvents(events.map((e) => e.id));
  return events.map((e) => mapCard(e, tickets.get(e.id)));
}
