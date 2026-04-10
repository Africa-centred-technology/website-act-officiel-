import { NextResponse } from "next/server";

const DOMAIN       = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_SECRET = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const CLIENT_ID    = process.env.SHOPIFY_CLIENT_ID;
const RESEND_KEY   = process.env.RESEND_API_KEY;

// ── Auth (même pattern que inscription/route.ts) ──────────────────────────────
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAdminToken(): Promise<string> {
  if (ADMIN_SECRET?.startsWith("shpat_") || ADMIN_SECRET?.startsWith("shpua_")) {
    return ADMIN_SECRET;
  }
  if (!CLIENT_ID || !ADMIN_SECRET) throw new Error("Config OAuth Shopify manquante");
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
  if (!res.ok || !data.access_token) throw new Error("OAuth Shopify échoué");
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + ((data.expires_in || 86399) - 300) * 1000;
  return cachedToken!;
}

// ── Labels ────────────────────────────────────────────────────────────────────
const POLE_LABELS: Record<string, string> = {
  I:   "Ingénierie Technologique",
  II:  "Conseil",
  III: "Formation",
};

const POLE_ACCENT: Record<string, string> = {
  I:   "#D35400",
  II:  "#F39C12",
  III: "#16a34a",
};

const SERVICE_LABELS: Record<string, string> = {
  "ingenierie-logicielle":          "Ingénierie Logicielle",
  "automatisation-ia":              "Automatisation Intelligente (IA Agentique)",
  "architecture-infrastructure":    "Architecture & Infrastructure",
  "data-intelligence-artificielle": "Data, IA & Big Data",
  "geomatique-sig":                 "Géomatique & SIG",
  "conseil-strategique":            "Conseil Stratégique & Transformation",
  "conseil-operationnel":           "Conseil Opérationnel & Métier",
  "catalogue-formations":           "Catalogue de Formations",
};

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, phone, pole, service, message } =
      body as Record<string, string>;

    // Validation minimale
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants (nom, email, message)" },
        { status: 400 }
      );
    }

    if (!DOMAIN || !ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Configuration Shopify manquante" },
        { status: 500 }
      );
    }

    const adminToken  = await getAdminToken();
    const poleLabel   = POLE_LABELS[pole]    ?? "Non précisé";
    const accentColor = POLE_ACCENT[pole]    ?? "#D35400";
    const serviceLabel = SERVICE_LABELS[service] ?? service ?? "Non précisé";

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName  = nameParts.slice(1).join(" ") || "-";

    // Tags Shopify : Lead + Contact-Site + Pôle + service
    const shopifyTags = ["Lead", "Contact-Site", pole && `Pôle-${pole}`, service]
      .filter(Boolean)
      .join(", ");

    // ── 1. Créer un Customer Shopify ──────────────────────────────────────────
    const customerPayload: Record<string, any> = {
      customer: {
        first_name: firstName,
        last_name:  lastName,
        email,
        tags: shopifyTags,
        // La note sert de CRM léger visible dans la fiche client
        note: [
          "Demande de contact — site web ACT",
          `Pôle: ${poleLabel}`,
          `Service: ${serviceLabel}`,
          `Entreprise: ${company || "N/A"}`,
          `Message: ${message}`,
        ].join("\n"),
      },
    };

    // Le téléphone Shopify doit être en format E.164 (+212...)
    // On l'inclut seulement si fourni pour éviter les erreurs de validation
    if (phone) customerPayload.customer.phone = phone;

    const customerRes = await fetch(
      `https://${DOMAIN}/admin/api/2024-01/customers.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify(customerPayload),
      }
    );

    const customerJson = await customerRes.json();
    const customerId: string | undefined =
      customerJson?.customer?.id?.toString();

    if (!customerRes.ok) {
      // Un client avec cet email existe déjà → non fatal, on continue
      console.warn("Shopify customer warning:", customerJson?.errors ?? customerJson);
    }

    // ── 2. Draft Order = ticket lead dans Shopify Admin ───────────────────────
    const draftNote = [
      "Source: Site Web — Formulaire Contact",
      `Pôle: ${poleLabel}`,
      `Service: ${serviceLabel}`,
      `Entreprise: ${company || "N/A"}`,
      `Message: ${message}`,
    ].join("\n");

    const draftMutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder { id name }
          userErrors { field message }
        }
      }
    `;

    const draftInput: Record<string, any> = {
      note: draftNote,
      tags: ["Contact", "Lead", pole && `Pôle ${pole}`, service].filter(Boolean),
      email,
      billingAddress: {
        firstName,
        lastName,
        phone:   phone   || "",
        company: company || "",
      },
      lineItems: [
        {
          title: `Lead Contact — ${poleLabel}${service ? ` / ${serviceLabel}` : ""}`,
          originalUnitPrice: "0.00",
          quantity: 1,
        },
      ],
    };

    // Lier au Customer créé si possible
    if (customerId) {
      draftInput.customerId = `gid://shopify/Customer/${customerId}`;
    }

    const draftRes = await fetch(
      `https://${DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({ query: draftMutation, variables: { input: draftInput } }),
      }
    );

    const draftJson  = await draftRes.json();
    const draftOrder = draftJson?.data?.draftOrderCreate?.draftOrder;

    if (draftJson.errors || draftJson?.data?.draftOrderCreate?.userErrors?.length) {
      console.error(
        "Draft order errors:",
        draftJson.errors ?? draftJson.data.draftOrderCreate.userErrors
      );
    }

    // ── 3. Email interne via Resend ───────────────────────────────────────────
    if (RESEND_KEY) {
      const dateStr = new Date().toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long",
        year: "numeric", hour: "2-digit", minute: "2-digit",
      });

      const html = `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0a0f1e;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.06)">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,${accentColor},${accentColor}99);padding:24px 32px">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.75)">Africa Centred Technology</p>
            <h1 style="margin:0;font-size:20px;font-weight:800">🔔 Nouveau lead contact</h1>
          </div>

          <!-- Body -->
          <div style="padding:32px">

            <!-- Identité -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr>
                <td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);width:130px">Nom</td>
                <td style="padding:7px 0;color:#fff;font-weight:600">${name}</td>
              </tr>
              <tr>
                <td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4)">Email</td>
                <td style="padding:7px 0"><a href="mailto:${email}" style="color:${accentColor};text-decoration:none">${email}</a></td>
              </tr>
              ${phone ? `<tr><td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4)">Téléphone</td><td style="padding:7px 0;color:#fff">${phone}</td></tr>` : ""}
              ${company ? `<tr><td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4)">Entreprise</td><td style="padding:7px 0;color:#fff">${company}</td></tr>` : ""}
            </table>

            <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:24px"></div>

            <!-- Domaine -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr>
                <td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);width:130px">Pôle</td>
                <td style="padding:7px 0;font-weight:700;color:${accentColor}">${poleLabel}</td>
              </tr>
              ${service ? `<tr><td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4)">Service</td><td style="padding:7px 0;color:rgba(255,255,255,0.85)">${serviceLabel}</td></tr>` : ""}
            </table>

            <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:24px"></div>

            <!-- Message -->
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4)">Message</p>
            <p style="margin:0;color:rgba(255,255,255,0.82);line-height:1.8;white-space:pre-line">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>

            <!-- Ref Shopify -->
            ${draftOrder ? `
            <div style="margin-top:28px;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45)">
                Lead Shopify créé :
                <strong style="color:#fff;margin-left:6px">${draftOrder.name}</strong>
              </p>
            </div>` : ""}
          </div>

          <!-- Footer -->
          <div style="padding:14px 32px;background:rgba(255,255,255,0.02);font-size:11px;color:rgba(255,255,255,0.2);text-align:center">
            ${dateStr}
          </div>
        </div>
      `;

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_KEY}`,
        },
        body: JSON.stringify({
          from: "ACT Website <noreply@a-ct.ma>",
          to: ["sohaib.baroud@a-ct.ma", "aldrin.djourobi@a-ct.ma"],
          reply_to: email,
          subject: `🔔 Lead ${poleLabel}${service ? ` — ${serviceLabel}` : ""} · ${name}`,
          html,
        }),
      });

      if (!emailRes.ok) {
        console.error("Resend error:", await emailRes.json());
      }
    }

    return NextResponse.json({ success: true, draftOrder: draftOrder ?? null });

  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
