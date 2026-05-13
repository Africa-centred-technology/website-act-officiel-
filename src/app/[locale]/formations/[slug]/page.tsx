import { Suspense } from "react";
import FormationDetailShell from "@/components/formations/FormationDetailShell";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  // Slug formatté pour le titre : "01_ia_productivite_quotidienne" → lisible
  const slugReadable = slug.replace(/^\d+_/, "").replace(/_/g, " ");
  const title = slugReadable.charAt(0).toUpperCase() + slugReadable.slice(1);
  return {
    title: `${title} — Formation ACT`,
    description: "Découvrez cette formation en Intelligence Artificielle proposée par Africa Centred Technology.",
  };
}

function FormationDetailLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F4F0",
      }}
      aria-label="Chargement de la formation…"
    >
      <span style={{ opacity: 0.5, fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", color: "#1C1410" }}>
        Chargement…
      </span>
    </div>
  );
}

export default async function FormationPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<FormationDetailLoading />}>
      <FormationDetailShell slug={slug} />
    </Suspense>
  );
}
