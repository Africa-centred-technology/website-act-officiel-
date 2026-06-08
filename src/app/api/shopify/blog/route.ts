import { NextResponse } from "next/server";
import { fetchShopifyBlogPosts } from "@/lib/shopify/blog";
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
