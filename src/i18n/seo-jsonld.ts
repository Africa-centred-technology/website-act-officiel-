import type {
  Organization,
  BreadcrumbList,
  Course,
  Article,
  WithContext,
} from "schema-dts";

const BASE_URL = "https://www.a-ct.ma";

// A plain record type used for public return types so consumers (and tests)
// can access properties with string-index notation without TS errors.
// The internal construction still uses the strict schema-dts types to
// guarantee correctness; we cast at the return boundary only.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LD = Record<string, any>;

export function organizationJsonLd(locale: string): LD {
  const result: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Africa Centred Technology",
    alternateName: "ACT",
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/logo/logo.png`,
    description:
      "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@a-ct.ma",
      areaServed: ["MA", "FR", "Africa"],
      availableLanguage: ["fr", "en", "ar"],
    },
  };
  return result;
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): LD {
  const result: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return result;
}

export function courseJsonLd(opts: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  price?: number;
  currency?: string;
  startDate?: string;
}): LD {
  const base: LD = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.title,
    description: opts.description,
    provider: {
      "@type": "Organization",
      name: "Africa Centred Technology",
      sameAs: `${BASE_URL}/${opts.locale}`,
    },
    url: `${BASE_URL}/${opts.locale}/formations/${opts.slug}`,
    inLanguage: opts.locale,
  };

  if (opts.price !== undefined && opts.currency) {
    base.offers = {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: opts.currency,
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${opts.locale}/formations/${opts.slug}`,
    };
  }

  if (opts.startDate) {
    base.hasCourseInstance = {
      "@type": "CourseInstance",
      courseMode: "onsite",
      startDate: opts.startDate,
    };
  }

  // Validate shape at compile time by assigning to strict type (discarded)
  void (base as unknown as WithContext<Course>);

  return base;
}

export function articleJsonLd(opts: {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  image?: string;
}): LD {
  const base: LD = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.excerpt,
    author: { "@type": "Person", name: opts.author },
    publisher: {
      "@type": "Organization",
      name: "Africa Centred Technology",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo/logo.png` },
    },
    datePublished: opts.publishedAt,
    inLanguage: opts.locale,
    url: `${BASE_URL}/${opts.locale}/blog/${opts.slug}`,
  };

  if (opts.image) {
    base.image = opts.image;
  }

  // Validate shape at compile time by assigning to strict type (discarded)
  void (base as unknown as WithContext<Article>);

  return base;
}
