import { NextResponse } from "next/server";
import {
  fetchShopifyBlogPosts,
  fetchShopifyBlogPostByHandle,
} from "@/lib/shopify/blog";
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

/** GET /api/shopify/blog?locale=<fr|en> */
export async function GET(req: Request) {
  const locale = readLocale(req.url);
  try {
    const posts = await fetchShopifyBlogPosts(locale);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[/api/shopify/blog] fetch failed:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les articles." },
      { status: 502 }
    );
  }
}

/** GET /api/shopify/blog/[handle]?locale=<fr|en> */
export async function getByHandle(
  req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const locale = readLocale(req.url);
  try {
    const post = await fetchShopifyBlogPostByHandle(handle, locale);
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
