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
    question: "Qu'est-ce qu'une agence IA Maroc et que propose ACT ?",
    answer: "ACT est une agence IA Maroc spécialisée en intelligence artificielle et transformation digitale. Elle propose le développement d'applications web et mobile sur mesure, des agents IA autonomes, de l'automatisation intelligente des processus, des architectures cloud souveraines, de la data science et des systèmes géomatiques (SIG Afrique).",
  },
  {
    question: "Qu'est-ce que l'IA agentique et comment ACT l'applique-t-il en entreprise ?",
    answer: "L'IA agentique désigne des architectures où plusieurs agents IA autonomes coopèrent pour exécuter des workflows complexes. ACT déploie des agents IA entreprise capables d'automatiser des processus métier complets : collecte de données, analyse, coordination inter-services et déclenchement d'actions — sans remplacer l'humain, mais en démultipliant ses capacités.",
  },
  {
    question: "ACT accompagne-t-il le conseil en transformation digitale Maroc ?",
    answer: "Oui, le Pôle Conseil d'ACT est spécialisé dans le conseil transformation digitale Maroc et Afrique. Il accompagne les directions générales avec des audits de maturité digitale, des feuilles de route stratégiques sur 3 ans, des plans de conduite du changement et la cartographie BPMN des processus métiers.",
  },
  {
    question: "ACT propose-t-il une architecture cloud souverain adaptée à l'Afrique ?",
    answer: "Oui, ACT conçoit des architectures cloud souveraines alignées sur les réglementations africaines de localisation des données. Les solutions hybrides cloud/local garantissent la conformité réglementaire tout en optimisant les performances pour les entreprises au Maroc et en Afrique.",
  },
  {
    question: "Comment développer une application web au Maroc avec ACT ?",
    answer: "Vous pouvez contacter ACT via le formulaire sur https://www.a-ct.ma/fr/contact. ACT développe des applications web et mobile African-Ready, optimisées pour les réseaux africains avec mode hors-ligne intégré. Une réponse est apportée sous 48h ouvrées.",
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
