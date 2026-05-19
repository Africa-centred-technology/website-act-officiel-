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
  name: "Agence IA Maroc — Conseil & Transformation Digitale Afrique | ACT",
  description:
    "ACT, agence IA Maroc, accompagne les entreprises dans leur transformation digitale et leurs projets d'intelligence artificielle. IA agentique, data science, agent IA entreprise. Basés à Casablanca.",
  url: "https://www.a-ct.ma/fr",
  keywords: "agence IA Maroc, intelligence artificielle Maroc, transformation digitale Afrique, IA agentique, agent IA entreprise, formation IA Maroc",
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
