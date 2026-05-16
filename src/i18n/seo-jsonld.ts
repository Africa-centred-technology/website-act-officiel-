import type {
  Organization,
  BreadcrumbList,
  Course,
  Article,
  FAQPage,
  WebSite,
  WithContext,
} from "schema-dts";

const BASE_URL = "https://www.a-ct.ma";

export function websiteJsonLd(locale?: string): WithContext<WebSite> {
  const searchAction = {
    "@type": "SearchAction",
    target: `${BASE_URL}/${locale ?? "fr"}/formations?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  };
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Africa Centred Technology",
    alternateName: "ACT",
    url: BASE_URL,
    inLanguage: locale ?? "fr",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    potentialAction: searchAction as any,
  };
}

export function organizationJsonLd(locale?: string): WithContext<Organization> {
  const localePath = locale ? `/${locale}` : "/fr";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Africa Centred Technology",
    alternateName: "ACT",
    url: `${BASE_URL}${localePath}`,
    logo: `${BASE_URL}/logo/logo.png`,
    description:
      "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.",
    sameAs: [
      "https://www.linkedin.com/company/africa-centred-technology",
      "https://www.facebook.com/africacentredtechnology",
      "https://www.instagram.com/africa_centred_technology",
      "https://www.youtube.com/@africacentredtechnology",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@a-ct.ma",
      areaServed: ["MA", "FR", "Africa"],
      availableLanguage: ["fr"],
    },
  };
}

export function faqJsonLd(
  faqs: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
  locale?: string;
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
      sameAs: BASE_URL,
    },
    url: `${BASE_URL}/${opts.locale ?? "fr"}/formations/${opts.slug}`,
    inLanguage: opts.locale ?? "fr",
  };

  if (opts.price !== undefined && opts.currency) {
    base.offers = {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: opts.currency,
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/formations/${opts.slug}`,
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
  locale?: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  image?: string;
}): WithContext<Article> {
  const base: WithContext<Article> & { image?: string; speakable?: object } = {
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
    inLanguage: opts.locale ?? "fr",
    url: `${BASE_URL}/${opts.locale ?? "fr"}/blog/${opts.slug}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".article-excerpt"],
    },
  };

  if (opts.image) {
    base.image = opts.image;
  }

  return base;
}
