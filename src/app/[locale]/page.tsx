import HomeShell from "@/components/home/Home";
import { buildPageMetadata } from "@/i18n/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import type { WebPage, WithContext } from "schema-dts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.home", path: "" });
}

const HOME_WEBPAGE_LD: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ACT — Conseil IA & Transformation Digitale au Maroc",
  description:
    "ACT accompagne les entreprises marocaines et africaines dans leur transformation digitale, leurs projets IA et leur montée en compétences. Basés à Casablanca.",
  url: "https://www.a-ct.ma/fr",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".hero-tagline", ".hero-subtitle"],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.a-ct.ma/fr" },
    ],
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={HOME_WEBPAGE_LD} />
      <HomeShell />
    </>
  );
}
