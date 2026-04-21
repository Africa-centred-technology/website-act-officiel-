import { Suspense } from 'react';
import FormationLandpage from '@/components/formations/FormationLandpage';

export const metadata = {
  title: 'Nos Formations | ACT',
  description: 'Découvrez notre catalogue de formations en Intelligence Artificielle et transformation digitale.',
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
