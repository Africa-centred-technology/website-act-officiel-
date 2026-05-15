import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const BASE_URL = "https://www.a-ct.ma";
const LOCALES = ["fr", "en", "ar"] as const;

const OG_LOCALE: Record<string, string> = {
  fr: "fr_MA",
  en: "en_US",
  ar: "ar_MA",
};

function buildOpenGraph(opts: {
  canonical: string;
  title: string;
  description: string;
  ogImageUrl: string;
  locale?: string;
}) {
  return {
    type: "website" as const,
    locale: OG_LOCALE[opts.locale ?? "fr"] ?? "fr_MA",
    url: opts.canonical,
    siteName: "Africa Centred Technology",
    title: opts.title,
    description: opts.description,
    images: [{ url: opts.ogImageUrl, width: 1200, height: 630, alt: opts.title }],
  };
}

function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${BASE_URL}/${loc}${path}`;
  }
  languages["x-default"] = `${BASE_URL}/fr${path}`;
  return languages;
}

type StaticPageMetadata = {
  locale?: string;
  /** next-intl namespace whose `title` and `description` keys are used.
   *  E.g. "metadata.about" → messages[locale].metadata.about.{title,description} */
  namespace?: string;
  title?: string;
  description?: string;
  path: string;
  ogImage?: string;
};

export async function buildPageMetadata({
  locale,
  namespace,
  title: titleProp,
  description: descProp,
  path,
  ogImage,
}: StaticPageMetadata): Promise<Metadata> {
  let title = titleProp ?? "";
  let description = descProp ?? "";

  if (namespace) {
    const t = await getTranslations({ locale: locale ?? "fr", namespace });
    title = t("title");
    description = t("description");
  }

  const resolvedLocale = locale ?? "fr";
  const canonical = `${BASE_URL}/${resolvedLocale}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical, languages: buildAlternates(path) },
    openGraph: buildOpenGraph({ canonical, title, description, ogImageUrl, locale }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

type DynamicPageMetadata = {
  locale?: string;
  path: string;
  title: string;
  description: string;
  ogImage?: string;
};

export function buildDynamicPageMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
}: DynamicPageMetadata): Metadata {
  const resolvedLocale = locale ?? "fr";
  const canonical = `${BASE_URL}/${resolvedLocale}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical, languages: buildAlternates(path) },
    openGraph: buildOpenGraph({ canonical, title, description, ogImageUrl, locale }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
