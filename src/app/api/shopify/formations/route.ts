import { NextResponse } from "next/server";
import { fetchShopifyFormations } from "@/lib/shopify/formations";

/**
 * GET /api/shopify/formations
 * Récupère les formations exclusivement depuis Shopify.
 * Renvoie une erreur 502 si Shopify est indisponible.
 */
export async function GET() {
  try {
    const formations = await fetchShopifyFormations();
    return NextResponse.json({ formations });
  } catch (error) {
    console.error("[/api/shopify/formations] Shopify fetch failed:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les formations depuis Shopify.", formations: [] },
      { status: 502 }
    );
  }
}
