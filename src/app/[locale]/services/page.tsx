import ServicesShellClient from "@/components/services/ServicesShellClient";
import { buildPageMetadata } from "@/i18n/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/i18n/seo-jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.services", path: "/services" });
}

const SERVICES_FAQ = faqJsonLd([
  {
    question: "Quels services d'ingénierie logicielle propose ACT ?",
    answer: "ACT développe des applications web, mobile et d'entreprise sur mesure, des agents IA autonomes, des architectures cloud (AWS, Azure, GCP), des pipelines de données et des systèmes géomatiques (SIG, cartographie, télédétection).",
  },
  {
    question: "ACT développe-t-il des agents IA autonomes ?",
    answer: "Oui, ACT est spécialisé dans l'IA Agentique : conception et déploiement d'agents IA autonomes capables d'exécuter des workflows complexes, d'automatiser des processus métier (RPA) et d'orchestrer des actions multi-systèmes.",
  },
  {
    question: "ACT accompagne-t-il la transformation digitale des entreprises ?",
    answer: "Oui, le Pôle Conseil d'ACT accompagne les directions générales avec des feuilles de route IA, des audits digitaux, des stratégies de transformation et la conduite du changement pour les entreprises africaines et internationales.",
  },
  {
    question: "ACT intervient-il hors du Maroc ?",
    answer: "Oui, ACT est basé au Maroc et intervient sur l'ensemble du continent africain ainsi qu'en Europe francophone (France, Belgique, Suisse).",
  },
  {
    question: "Comment obtenir un devis pour un projet avec ACT ?",
    answer: "Vous pouvez contacter ACT via le formulaire en ligne sur https://www.a-ct.ma/fr/contact ou par email à contact@a-ct.ma. Une réponse est apportée sous 48h ouvrées.",
  },
]);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={SERVICES_FAQ} />
      <ServicesShellClient />
    </>
  );
}
