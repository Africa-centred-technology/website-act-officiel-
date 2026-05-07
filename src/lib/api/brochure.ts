import { NextResponse } from "next/server";
import { getAdminToken, shopifyAdminRestUrl } from "@/lib/api/shopify-admin";

const DEFAULT_BROCHURE_URL = process.env.DEFAULT_BROCHURE_URL ?? "";

interface BrochurePayload {
  name: string;
  email: string;
  company?: string;
  formationSlug: string;
  formationTitle: string;
  brochureUrl?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BrochurePayload>;
    const { name, email, company, formationSlug, formationTitle, brochureUrl } = body;

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

      const tags = ["Lead", "Brochure", `Formation:${formationSlug}`].join(", ");
      const note = [
        `Lead brochure — ${formationTitle}`,
        `Slug: ${formationSlug}`,
        `Entreprise: ${company || "N/A"}`,
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

    // ── Retourne l'URL pour download direct côté client ────────────────────
    return NextResponse.json({ success: true, brochureUrl: finalBrochureUrl });

  } catch (error) {
    console.error("Brochure API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
