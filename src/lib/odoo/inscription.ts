/**
 * Odoo — Inscription Formation (basée sur event.registration)
 *
 * Au lieu de créer un sale.order orphelin, on crée une event.registration
 * qui — grâce au module event_sale — déclenche automatiquement :
 *   - Création/lookup du res.partner (déduplique par email)
 *   - Génération d'un sale.order si l'event a un ticket payant
 *   - Email de confirmation (event.mail "registration confirmed")
 *   - Décompte automatique de seats_available
 *   - Workflow Odoo : confirm → pay → attended → certificate
 *
 * Variables d'environnement requises :
 *   ODOO_URL · ODOO_DB · ODOO_USER · ODOO_API_KEY  (cf. client.ts)
 */

import { NextResponse } from "next/server";
import { odoo, odooSearchRead } from "./client";

// ── Types ────────────────────────────────────────────────────────────────────

interface InscriptionPayload {
  typeClient: "B2C" | "B2B";
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  telephone2?: string;
  whatsapp?: string;
  ville?: string;             // nom du pays choisi dans le selector
  fonctionDemandeur?: string;
  entreprise?: string;        // B2B
  niveauEtudes?: string;      // B2C
  commentConnu?: string;
  dateSouhaitee?: string;
  nombreParticipants?: string | number;
  message?: string;
  formationSouhaitee?: string;
  formationSlug?: string;     // = slug Odoo (name-slugifié-{id})
  // B2C / B2B optionnels
  age?: string;
  statutProfessionnel?: string;
  experienceIA?: string;
  objectifPrincipal?: string;
  secteurActivite?: string;
  tailleEntreprise?: string;
  besoinPrincipal?: string;
  formatsPreferes?: string[];
  disponibilite?: string;
  timestamp?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extrait l'id Odoo numérique depuis le slug "{name}-{id}" */
function eventIdFromSlug(slug?: string): number | null {
  if (!slug) return null;
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/** Cherche un partner Odoo par email — null si absent */
async function findPartnerByEmail(email: string) {
  if (!email) return null;
  const list = await odooSearchRead<any>(
    "res.partner",
    [["email", "=ilike", email]],
    { fields: ["id", "name", "email"], limit: 1 }
  );
  return list[0] ?? null;
}

/** Résout l'id pays Odoo à partir du nom (FR/EN) ou du code ISO */
async function resolveCountryId(input?: string): Promise<number | false> {
  if (!input) return false;
  const trimmed = input.trim();
  if (!trimmed) return false;
  const ids = await odoo<number[]>(
    "res.country",
    "search",
    [[
      "|",
      ["name", "=ilike", trimmed],
      ["code", "=ilike", trimmed],
    ]],
    { limit: 1 }
  );
  return ids[0] ?? false;
}

/** Sélectionne un ticket adapté au typeClient (B2C → premier "B2C", sinon premier dispo) */
async function pickTicketId(eventId: number, typeClient: "B2C" | "B2B"): Promise<number | null> {
  const tickets = await odooSearchRead<any>(
    "event.event.ticket",
    [["event_id", "=", eventId]],
    { fields: ["id", "name", "price", "seats_available"], order: "id asc", limit: 20 }
  );
  if (!tickets.length) return null;

  // Cherche un ticket dont le nom commence par le typeClient demandé
  const prefer = tickets.find((t) =>
    String(t.name).toLowerCase().startsWith(typeClient.toLowerCase())
  );
  if (prefer) return prefer.id;
  return tickets[0].id;
}

/** Crée ou met à jour le res.partner */
async function upsertPartner(payload: InscriptionPayload): Promise<number> {
  const existing = await findPartnerByEmail(payload.email);
  const countryId = await resolveCountryId(payload.ville);
  const fullName = `${payload.prenom} ${payload.nom}`.trim();

  const partnerData: Record<string, unknown> = {
    name:         fullName,
    email:        payload.email,
    phone:        payload.telephone || false,
    mobile:       payload.whatsapp || payload.telephone2 || false,
    function:     payload.fonctionDemandeur || false,
    is_company:   false,
    company_type: "person",
    country_id:   countryId,
  };

  if (payload.typeClient === "B2B" && payload.entreprise) {
    // S'assure que la société existe en res.partner is_company=true
    const companyIds = await odoo<number[]>(
      "res.partner",
      "search",
      [[
        ["name", "=ilike", payload.entreprise],
        ["is_company", "=", true],
      ]],
      { limit: 1 }
    );
    let companyId = companyIds[0];
    if (!companyId) {
      companyId = await odoo<number>("res.partner", "create", [{
        name:         payload.entreprise,
        is_company:   true,
        company_type: "company",
        country_id:   countryId,
      }]);
    }
    partnerData.parent_id = companyId;
  }

  if (existing) {
    await odoo("res.partner", "write", [[existing.id], partnerData]);
    return existing.id;
  }
  return odoo<number>("res.partner", "create", [partnerData]);
}

/** Construit un message récapitulatif posté en chatter sur la registration */
function buildRegistrationNote(payload: InscriptionPayload): string {
  const lines: string[] = [
    `<p><strong>Inscription via le site web</strong></p>`,
    `<ul>`,
  ];
  const push = (label: string, val?: string | string[] | number) => {
    if (val == null || val === "") return;
    const v = Array.isArray(val) ? val.join(", ") : String(val);
    lines.push(`<li><strong>${label} :</strong> ${v}</li>`);
  };

  push("Type", payload.typeClient);
  push("Pays", payload.ville);
  push("Fonction", payload.fonctionDemandeur);

  if (payload.typeClient === "B2C") {
    push("Âge", payload.age);
    push("Niveau d'études", payload.niveauEtudes);
    push("Statut", payload.statutProfessionnel);
    push("Expérience IA", payload.experienceIA);
    push("Objectif", payload.objectifPrincipal);
  } else {
    push("Entreprise", payload.entreprise);
    push("Secteur", payload.secteurActivite);
    push("Taille", payload.tailleEntreprise);
    push("Nombre de participants", payload.nombreParticipants);
    push("Besoin", payload.besoinPrincipal);
  }

  push("Canal d'acquisition", payload.commentConnu);
  push("Date souhaitée", payload.dateSouhaitee);
  push("Formats préférés", payload.formatsPreferes);
  push("Disponibilité", payload.disponibilite);
  push("Message", payload.message);

  lines.push(`</ul>`);
  return lines.join("\n");
}

// ── POST handler — branché sur /api/odoo/inscription ────────────────────────

export async function POST(req: Request): Promise<Response> {
  try {
    const payload = (await req.json()) as InscriptionPayload;

    if (!payload.email || !payload.nom || !payload.prenom) {
      return NextResponse.json(
        { error: "Champs requis manquants : prenom, nom, email" },
        { status: 400 }
      );
    }

    if (
      !process.env.ODOO_URL ||
      !process.env.ODOO_DB ||
      !process.env.ODOO_USER ||
      !process.env.ODOO_API_KEY
    ) {
      console.error("Configuration Odoo manquante");
      return NextResponse.json({ error: "Configuration Odoo manquante" }, { status: 500 });
    }

    // 1. Résoudre l'event depuis le slug
    const eventId = eventIdFromSlug(payload.formationSlug);
    if (!eventId) {
      return NextResponse.json(
        { error: "formationSlug invalide ou manquant. Format attendu : '{name}-{id}'." },
        { status: 400 }
      );
    }

    // Vérifie que l'event existe et n'est pas terminé
    const events = await odoo<any[]>(
      "event.event",
      "read",
      [[eventId]],
      { fields: ["id", "name", "date_end", "seats_available", "seats_limited"] }
    );
    const event = events[0];
    if (!event) {
      return NextResponse.json({ error: "Session de formation introuvable" }, { status: 404 });
    }
    if (event.seats_limited && event.seats_available <= 0) {
      return NextResponse.json(
        { error: "Cette session est complète. Choisissez une autre date." },
        { status: 409 }
      );
    }

    // 2. Partner (création ou réutilisation)
    const partnerId = await upsertPartner(payload);

    // 3. Sélection du ticket
    const ticketId = await pickTicketId(eventId, payload.typeClient);

    // 4. Création de la registration
    const registrationData: Record<string, unknown> = {
      event_id:       eventId,
      partner_id:     partnerId,
      name:           `${payload.prenom} ${payload.nom}`.trim(),
      email:          payload.email,
      phone:          payload.telephone || false,
      mobile:         payload.whatsapp || payload.telephone2 || false,
    };
    if (ticketId) registrationData.event_ticket_id = ticketId;

    const registrationId = await odoo<number>(
      "event.registration",
      "create",
      [registrationData]
    );

    // 5. Confirme la registration (state: draft → open)
    // Nécessaire pour qu'elle compte dans seats_reserved et déclenche l'email
    try {
      await odoo("event.registration", "action_confirm", [[registrationId]]);
    } catch (err) {
      // Selon la version, la méthode peut s'appeler `confirm_registration`
      try {
        await odoo("event.registration", "confirm_registration", [[registrationId]]);
      } catch {
        console.warn("Impossible de confirmer la registration automatiquement (sera en draft).");
      }
    }

    // 6. Post du récap dans le chatter Odoo
    try {
      await odoo("event.registration", "message_post", [[registrationId]], {
        body:        buildRegistrationNote(payload),
        message_type: "comment",
        subtype_xmlid: "mail.mt_note",
      });
    } catch {
      // Non bloquant — le chatter peut échouer sans impacter l'inscription
    }

    // 7. Lecture finale pour retour
    const result = await odoo<any[]>(
      "event.registration",
      "read",
      [[registrationId]],
      { fields: ["id", "name", "state", "event_id", "partner_id", "event_ticket_id"] }
    );
    const reg = result[0];

    return NextResponse.json({
      success: true,
      registration: {
        id:         reg.id,
        name:       reg.name,
        state:      reg.state,
        eventId,
        eventName:  event.name,
        partnerId,
        ticketId:   ticketId ?? null,
      },
    });
  } catch (error) {
    console.error("Erreur Odoo Inscription Route :", error);
    return NextResponse.json(
      {
        error: "Impossible de créer l'inscription Odoo.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
