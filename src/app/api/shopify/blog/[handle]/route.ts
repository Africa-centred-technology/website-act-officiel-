import { NextResponse } from "next/server";
import { fetchShopifyBlogPostByHandle } from "@/lib/shopify/blog";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;

  try {
    const post = await fetchShopifyBlogPostByHandle(handle);
    if (!post) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error(`[/api/shopify/blog/${handle}] fetch failed:`, error);
    return NextResponse.json({ error: "Impossible de récupérer l'article." }, { status: 502 });
  }
}
