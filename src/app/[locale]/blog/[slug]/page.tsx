import { notFound } from "next/navigation";
import { fetchShopifyBlogPostByHandle, fetchShopifyBlogPosts } from "@/lib/shopify/blog";
import BlogPostShell from "@/components/blog/BlogPostShell";
import type { Metadata } from "next";
import { buildDynamicPageMetadata } from "@/i18n/seo";

/* ── Static params : générés depuis Shopify ── */
export async function generateStaticParams() {
  try {
    const posts = await fetchShopifyBlogPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

/* ── SEO ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const post = await fetchShopifyBlogPostByHandle(slug).catch(() => null);

  const title = post?.title ?? "Article ACT";
  const description = post?.excerpt ?? "Lisez cet article sur le blog ACT.";

  return buildDynamicPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description,
    ogImage: post?.image
      ? post.image
      : `/api/og?title=${encodeURIComponent(title)}&subtitle=Article`,
  });
}

/* ── Page ── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  const post = await fetchShopifyBlogPostByHandle(slug).catch(() => null);
  if (!post) notFound();

  return <BlogPostShell post={post} />;
}
