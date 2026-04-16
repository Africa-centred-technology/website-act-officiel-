import { NextResponse } from "next/server";
import { getAdminToken, shopifyAdminUrl, shopifyAdminRestUrl } from "@/lib/api/shopify-admin";

const RESEND_KEY = process.env.RESEND_API_KEY;

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

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants (nom, email, message)" },
        { status: 400 }
      );
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminSecret = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!domain || !adminSecret) {
      return NextResponse.json(
        { error: "Configuration Shopify manquante" },
        { status: 500 }
      );
    }

    const adminToken   = await getAdminToken();
    const poleLabel    = POLE_LABELS[pole]     ?? "Non précisé";
    const accentColor  = POLE_ACCENT[pole]     ?? "#D35400";
    const serviceLabel = SERVICE_LABELS[service] ?? service ?? "Non précisé";

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName  = nameParts.slice(1).join(" ") || "-";

    const shopifyTags = ["Lead", "Contact-Site", pole && `Pôle-${pole}`, service]
      .filter(Boolean)
      .join(", ");

    // ── 1. Créer un Customer Shopify ──────────────────────────────────────────
    const customerPayload: Record<string, unknown> = {
      customer: {
        first_name: firstName,
        last_name:  lastName,
        email,
        tags: shopifyTags,
        note: [
          "Demande de contact — site web ACT",
          `Pôle: ${poleLabel}`,
          `Service: ${serviceLabel}`,
          `Entreprise: ${company || "N/A"}`,
          `Message: ${message}`,
        ].join("\n"),
      },
    };

    if (phone) (customerPayload.customer as Record<string, unknown>).phone = phone;

    const customerRes = await fetch(shopifyAdminRestUrl("customers.json"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify(customerPayload),
    });

    const customerJson = await customerRes.json();
    const customerId: string | undefined =
      customerJson?.customer?.id?.toString();

    if (!customerRes.ok) {
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

    const draftInput: Record<string, unknown> = {
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

    if (customerId) {
      draftInput.customerId = `gid://shopify/Customer/${customerId}`;
    }

    const draftRes = await fetch(shopifyAdminUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: `
          mutation draftOrderCreate($input: DraftOrderInput!) {
            draftOrderCreate(input: $input) {
              draftOrder { id name }
              userErrors { field message }
            }
          }
        `,
        variables: { input: draftInput },
      }),
    });

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
          <div style="background:linear-gradient(135deg,${accentColor},${accentColor}99);padding:24px 32px">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.75)">Africa Centred Technology</p>
            <h1 style="margin:0;font-size:20px;font-weight:800">🔔 Nouveau lead contact</h1>
          </div>
          <div style="padding:32px">
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
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr>
                <td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);width:130px">Pôle</td>
                <td style="padding:7px 0;font-weight:700;color:${accentColor}">${poleLabel}</td>
              </tr>
              ${service ? `<tr><td style="padding:7px 0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4)">Service</td><td style="padding:7px 0;color:rgba(255,255,255,0.85)">${serviceLabel}</td></tr>` : ""}
            </table>
            <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:24px"></div>
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4)">Message</p>
            <p style="margin:0;color:rgba(255,255,255,0.82);line-height:1.8;white-space:pre-line">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            ${draftOrder ? `
            <div style="margin-top:28px;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45)">
                Lead Shopify créé :
                <strong style="color:#fff;margin-left:6px">${draftOrder.name}</strong>
              </p>
            </div>` : ""}
          </div>
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
