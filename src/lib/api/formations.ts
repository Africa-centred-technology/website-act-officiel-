import { NextResponse } from "next/server";
import {
  fetchShopifyFormations,
  fetchShopifyFormationByHandle,
} from "@/lib/shopify/formations";
import { routing, type Locale } from "@/i18n/routing";

function readLocale(url: string): Locale {
  try {
    const param = new URL(url).searchParams.get("locale");
    if (param && (routing.locales as readonly string[]).includes(param)) {
      return param as Locale;
    }
  } catch {
    // malformed URL — fall through to default
  }
  return routing.defaultLocale;
}

/** GET /api/shopify/formations?locale=<fr|en|ar> */
export async function GET(req: Request) {
  const locale = readLocale(req.url);
  try {
    const formations = await fetchShopifyFormations(locale);
    return NextResponse.json({ formations });
  } catch (error) {
    console.error("[/api/shopify/formations] Shopify fetch failed:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les formations depuis Shopify.", formations: [] },
      { status: 502 }
    );
  }
}

/** GET /api/shopify/formations/[slug]?locale=<fr|en|ar> */
export async function getBySlug(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = readLocale(req.url);
  try {
    const formation = await fetchShopifyFormationByHandle(slug, locale);
    if (!formation) {
      return NextResponse.json(
        { error: "Formation introuvable sur Shopify." },
        { status: 404 }
      );
    }
    return NextResponse.json({ formation });
  } catch (error) {
    console.error(`[/api/shopify/formations/${slug}] Shopify fetch failed:`, error);
    return NextResponse.json(
      { error: "Impossible de récupérer la formation depuis Shopify." },
      { status: 502 }
    );
  }
}
