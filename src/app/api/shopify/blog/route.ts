import { NextResponse } from "next/server";
import { fetchShopifyBlogPosts } from "@/lib/shopify/blog";

export async function GET() {
  try {
    const posts = await fetchShopifyBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[/api/shopify/blog] fetch failed:", error);
    return NextResponse.json({ error: "Impossible de récupérer les articles." }, { status: 502 });
  }
}
