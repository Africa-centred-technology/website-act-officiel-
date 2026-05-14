import { Suspense } from 'react';
import FormationsShell from '@/components/formations/FormationsShell';
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.formations", path: "/formations/all" });
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
      aria-label="Chargement du catalogue…"
    >
      <span style={{ opacity: 0.5, fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', color: '#1C1410' }}>
        Chargement…
      </span>
    </div>
  );
}

export default function FormationsAllPage() {
  return (
    <Suspense fallback={<FormationsLoading />}>
      <FormationsShell />
    </Suspense>
  );
}
