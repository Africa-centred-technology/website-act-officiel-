import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/lib/blog-data";
import { fetchShopifyBlogPostByHandle } from "@/lib/shopify/blog";
import BlogPostShell from "@/components/blog/BlogPostShell";
import type { Metadata } from "next";

/* ── Static params : articles statiques + Shopify fusionnés ── */
export async function generateStaticParams() {
  // On génère au moins les slugs statiques ; les slugs Shopify sont résolus dynamiquement
  return blogPosts.map((post) => ({ slug: post.slug }));
}

/* ── SEO ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Shopify en priorité
  const shopifyPost = await fetchShopifyBlogPostByHandle(slug).catch(() => null);
  const post = shopifyPost ?? getPostBySlug(slug);

  if (!post) return { title: "Article introuvable — ACT" };

  return {
    title: `${post.title} — Africa Centred Technology`,
    description: post.excerpt,
    keywords: post.keywords,
  };
}

/* ── Page ── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Cherche dans Shopify
  const shopifyPost = await fetchShopifyBlogPostByHandle(slug).catch(() => null);
  if (shopifyPost) return <BlogPostShell post={shopifyPost} />;

  // 2. Fallback sur les données statiques
  const staticPost = getPostBySlug(slug);
  if (!staticPost) notFound();

  return <BlogPostShell post={staticPost} />;
}
