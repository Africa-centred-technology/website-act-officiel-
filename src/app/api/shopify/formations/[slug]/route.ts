import { NextResponse } from "next/server";
import { fetchShopifyFormationByHandle } from "@/lib/shopify/formations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const formation = await fetchShopifyFormationByHandle(slug);

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
