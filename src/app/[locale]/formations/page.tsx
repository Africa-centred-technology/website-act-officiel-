import { Suspense } from 'react';
import FormationLandpage from '@/components/formations/FormationLandpage';
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.formations", path: "/formations" });
}

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
    <Suspense fallback={<FormationsLoading />}>
      <FormationLandpage />
    </Suspense>
  );
}
