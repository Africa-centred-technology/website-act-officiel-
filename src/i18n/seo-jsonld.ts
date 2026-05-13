import type {
  Organization,
  BreadcrumbList,
  Course,
  Article,
  WithContext,
} from "schema-dts";

const BASE_URL = "https://www.a-ct.ma";

export function organizationJsonLd(locale: string): WithContext<Organization> {
  return {
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
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function courseJsonLd(opts: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  price?: number;
  currency?: string;
  startDate?: string;
}): WithContext<Course> {
  const base: WithContext<Course> & {
    offers?: object;
    hasCourseInstance?: object;
  } = {
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
}): WithContext<Article> {
  const base: WithContext<Article> & { image?: string } = {
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

  return base;
}
