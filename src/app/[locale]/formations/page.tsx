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
    question: "Quelles formations propose ACT ?",
    answer: "ACT propose des formations en Intelligence Artificielle, Data Science, Cloud Computing, Développement Logiciel et Automatisation, disponibles en présentiel, à distance et en format blended.",
  },
  {
    question: "Les formations ACT sont-elles certifiantes ?",
    answer: "Oui, les formations ACT délivrent des attestations de complétion reconnues par l'industrie et sont alignées sur les certifications professionnelles AWS, Azure, GCP et les standards Data Science.",
  },
  {
    question: "ACT forme-t-il les équipes d'entreprises (B2B) ?",
    answer: "Oui, ACT propose des programmes de formation sur mesure pour les équipes techniques et opérationnelles d'entreprises au Maroc et en Afrique subsaharienne, avec des formats intra-entreprise et des parcours personnalisés.",
  },
  {
    question: "Quel est le niveau requis pour suivre une formation ACT ?",
    answer: "ACT propose des formations pour tous niveaux, du débutant à l'expert. Chaque programme précise les prérequis. Certains bootcamps intensifs nécessitent une expérience technique préalable.",
  },
  {
    question: "Comment s'inscrire à une formation ACT ?",
    answer: "L'inscription se fait directement sur le catalogue de formations à l'adresse https://www.a-ct.ma/fr/formations, ou en contactant ACT par email à contact@a-ct.ma pour un programme sur mesure.",
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
