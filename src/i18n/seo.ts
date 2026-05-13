import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://www.a-ct.ma";

const OG_LOCALE_MAP = {
  fr: "fr_MA",
  en: "en_US",
  ar: "ar_MA",
} as const;

function buildAlternates(path: string, locale: string) {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: Object.fromEntries([
      ...routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
      ["x-default", `${BASE_URL}/${routing.defaultLocale}${path}`],
    ]),
  };
}

function buildOpenGraph(opts: {
  locale: string;
  canonical: string;
  title: string;
  description: string;
  ogImageUrl: string;
}) {
  return {
    type: "website" as const,
    locale: OG_LOCALE_MAP[opts.locale as keyof typeof OG_LOCALE_MAP],
    alternateLocale: routing.locales
      .filter((l) => l !== opts.locale)
      .map((l) => OG_LOCALE_MAP[l as keyof typeof OG_LOCALE_MAP]),
    url: opts.canonical,
    siteName: "Africa Centred Technology",
    title: opts.title,
    description: opts.description,
    images: [{ url: opts.ogImageUrl, width: 1200, height: 630, alt: opts.title }],
  };
}

type StaticParams = {
  locale: string;
  namespace: string;
  path: string;
  ogImage?: string;
};

export async function buildPageMetadata({
  locale, namespace, path, ogImage,
}: StaticParams): Promise<Metadata> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (await getTranslations({ locale, namespace } as any)) as (key: string) => string;
  const title = t("title");
  const description = t("description");
  const canonical = `${BASE_URL}/${locale}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    openGraph: buildOpenGraph({ locale, canonical, title, description, ogImageUrl }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

type DynamicParams = {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogImage?: string;
};

export async function buildDynamicPageMetadata({
  locale, path, title, description, ogImage,
}: DynamicParams): Promise<Metadata> {
  const canonical = `${BASE_URL}/${locale}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    openGraph: buildOpenGraph({ locale, canonical, title, description, ogImageUrl }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
