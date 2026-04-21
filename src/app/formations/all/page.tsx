import { Suspense } from 'react';
import FormationsShell from '@/components/formations/FormationsShell';

export const metadata = {
  title: 'Toutes nos Formations | ACT',
  description: 'Explorez le catalogue complet de nos formations en Intelligence Artificielle et transformation digitale.',
};

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
