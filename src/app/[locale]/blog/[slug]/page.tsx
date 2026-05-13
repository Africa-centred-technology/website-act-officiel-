import { notFound } from "next/navigation";
import { fetchShopifyBlogPostByHandle, fetchShopifyBlogPosts } from "@/lib/shopify/blog";
import BlogPostShell from "@/components/blog/BlogPostShell";
import type { Metadata } from "next";
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/i18n/seo-jsonld";

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
  const { locale, slug } = await params;

  const post = await fetchShopifyBlogPostByHandle(slug).catch(() => null);
  if (!post) notFound();

  const articleData = articleJsonLd({
    locale,
    slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.authorName,
    publishedAt: post.date,
    image: post.image || undefined,
  });

  const crumbData = breadcrumbJsonLd([
    { name: "Accueil", url: `https://www.a-ct.ma/${locale}` },
    { name: "Blog", url: `https://www.a-ct.ma/${locale}/blog` },
    { name: post.title, url: `https://www.a-ct.ma/${locale}/blog/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleData} />
      <JsonLd data={crumbData} />
      <BlogPostShell post={post} />
    </>
  );
}
