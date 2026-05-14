import type { Metadata } from "next";

const BASE_URL = "https://www.a-ct.ma";

function buildOpenGraph(opts: {
  canonical: string;
  title: string;
  description: string;
  ogImageUrl: string;
}) {
  return {
    type: "website" as const,
    locale: "fr_MA",
    url: opts.canonical,
    siteName: "Africa Centred Technology",
    title: opts.title,
    description: opts.description,
    images: [{ url: opts.ogImageUrl, width: 1200, height: 630, alt: opts.title }],
  };
}

type StaticPageMetadata = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  ogImage,
}: StaticPageMetadata): Metadata {
  const canonical = `${BASE_URL}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: buildOpenGraph({ canonical, title, description, ogImageUrl }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

type DynamicPageMetadata = {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
};

export function buildDynamicPageMetadata({
  path,
  title,
  description,
  ogImage,
}: DynamicPageMetadata): Metadata {
  const canonical = `${BASE_URL}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: buildOpenGraph({ canonical, title, description, ogImageUrl }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
