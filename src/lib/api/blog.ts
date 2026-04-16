import { NextResponse } from "next/server";
import {
  fetchShopifyBlogPosts,
  fetchShopifyBlogPostByHandle,
} from "@/lib/shopify/blog";

/** GET /api/shopify/blog */
export async function GET() {
  try {
    const posts = await fetchShopifyBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[/api/shopify/blog] fetch failed:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les articles." },
      { status: 502 }
    );
  }
}

/** GET /api/shopify/blog/[handle] */
export async function getByHandle(
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
    return NextResponse.json(
      { error: "Impossible de récupérer l'article." },
      { status: 502 }
    );
  }
}
