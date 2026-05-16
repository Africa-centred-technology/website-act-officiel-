import HomeShell from "@/components/home/Home";
import { buildPageMetadata } from "@/i18n/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.home", path: "" });
}

const HOME_WEBPAGE_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Africa Centred Technology — IA & Ingénierie Logicielle au Maroc",
  description:
    "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.",
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
