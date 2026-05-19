import { Suspense } from 'react';
import FormationLandpage from '@/components/formations/FormationLandpage';
import { buildPageMetadata } from "@/i18n/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/i18n/seo-jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.formations", path: "/formations" });
}

const FORMATIONS_FAQ = faqJsonLd([
  {
    question: "Où trouver une formation IA Maroc de qualité ?",
    answer: "ACT propose des formations IA Maroc conçues par des experts du continent à partir de cas réels. Le catalogue couvre l'intelligence artificielle, l'IA agentique, la data science, le machine learning et le cloud computing — disponibles en présentiel à Casablanca et en ligne.",
  },
  {
    question: "ACT propose-t-il une formation data science Maroc ?",
    answer: "Oui, ACT propose des formations data science Maroc couvrant l'intégralité du cycle de vie de la donnée : Data Engineering, Machine Learning, Big Data et déploiement de modèles IA. Les programmes sont alignés sur les certifications AWS, Azure, GCP et les standards Data Science.",
  },
  {
    question: "Existe-t-il une formation machine learning à Casablanca ?",
    answer: "Oui, ACT organise des formations machine learning à Casablanca en présentiel ainsi qu'en format hybride. Les sessions couvrent les algorithmes fondamentaux, l'entraînement de modèles sur données africaines et le déploiement en production.",
  },
  {
    question: "ACT forme-t-il les équipes d'entreprises à l'automatisation intelligente ?",
    answer: "Oui, ACT propose des programmes de formation sur mesure en automatisation intelligente IA pour les équipes techniques et opérationnelles d'entreprises au Maroc et en Afrique. Formats intra-entreprise, parcours personnalisés et ateliers pratiques sur agents IA.",
  },
  {
    question: "Comment s'inscrire à une formation IA Maroc avec ACT ?",
    answer: "L'inscription se fait directement sur le catalogue : https://www.a-ct.ma/fr/formations. Pour un programme sur mesure ou une formation data science Maroc en intra-entreprise, contactez ACT à contact@a-ct.ma. Réponse sous 48h.",
  },
]);

function FormationsLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F7F4F0',
      }}
      aria-label="Chargement des formations…"
    >
      <span style={{ opacity: 0.5, fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', color: '#1C1410' }}>
        Chargement…
      </span>
    </div>
  );
}

export default function FormationsPage() {
  return (
    <>
      <JsonLd data={FORMATIONS_FAQ} />
      <Suspense fallback={<FormationsLoading />}>
        <FormationLandpage />
      </Suspense>
    </>
  );
}
