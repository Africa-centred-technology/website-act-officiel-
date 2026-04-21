import { Suspense } from "react";
import FormationInscriptionShell from "@/components/formations/FormationInscriptionShell";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const slugReadable = slug.replace(/^\d+_/, "").replace(/_/g, " ");
  const title = slugReadable.charAt(0).toUpperCase() + slugReadable.slice(1);
  return {
    title: `Inscription — ${title} — ACT`,
    description: "Inscrivez-vous à cette formation proposée par Africa Centred Technology.",
  };
}

function InscriptionLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F4F0",
      }}
      aria-label="Chargement du formulaire d'inscription…"
    >
      <span style={{ opacity: 0.5, fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", color: "#1C1410" }}>
        Chargement…
      </span>
    </div>
  );
}

export default async function FormationInscriptionPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<InscriptionLoading />}>
      <FormationInscriptionShell slug={slug} />
    </Suspense>
  );
}
