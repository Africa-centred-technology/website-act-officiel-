import { NextResponse } from "next/server";
import { getAdminToken, shopifyAdminRestUrl } from "@/lib/api/shopify-admin";
import { routing, type Locale } from "@/i18n/routing";

const DEFAULT_BROCHURE_URL = process.env.DEFAULT_BROCHURE_URL ?? "";

interface BrochurePayload {
  name: string;
  email: string;
  company?: string;
  formationSlug: string;
  formationTitle: string;
  brochureUrl?: string;
  locale?: string;
}

function safeLocale(raw: unknown): Locale {
  if (typeof raw === "string" && (routing.locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return routing.defaultLocale;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BrochurePayload>;
    const { name, email, company, formationSlug, formationTitle, brochureUrl } = body;
    const locale = safeLocale(body.locale);

    if (!name || !email || !formationSlug || !formationTitle) {
      return NextResponse.json(
        { error: "Champs requis manquants (nom, email, formation)" },
        { status: 400 }
      );
    }

    const finalBrochureUrl = brochureUrl || DEFAULT_BROCHURE_URL;
    if (!finalBrochureUrl) {
      return NextResponse.json(
        { error: "Brochure non disponible pour cette formation" },
        { status: 404 }
      );
    }

    // ── Capture du lead dans Shopify (best effort, non-bloquant) ───────────
    try {
      const adminToken = await getAdminToken();
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName  = nameParts.slice(1).join(" ") || "-";

      const tags = ["Lead", "Brochure", `Formation:${formationSlug}`, `lang:${locale}`].join(", ");
      const note = [
        `Lead brochure — ${formationTitle}`,
        `Slug: ${formationSlug}`,
        `Entreprise: ${company || "N/A"}`,
        `Locale: ${locale}`,
        `Date: ${new Date().toISOString()}`,
      ].join("\n");

      await fetch(shopifyAdminRestUrl("customers.json"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({
          customer: {
            first_name: firstName,
            last_name:  lastName,
            email,
            tags,
            note,
          },
        }),
      });
    } catch (err) {
      console.warn("[brochure] Capture Shopify échouée (non-bloquant) :", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({ success: true, brochureUrl: finalBrochureUrl });

  } catch (error) {
    console.error("Brochure API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
