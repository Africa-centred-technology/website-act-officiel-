import { FORMATIONS } from "@/lib/data/formations";
import FormationDetailShell from "@/components/formations/FormationDetailShell";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return FORMATIONS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props) {
  const formation = FORMATIONS.find((f) => f.slug === params.slug);
  if (!formation) return { title: "Formation introuvable" };
  return {
    title: `${formation.title} — ACT Formations`,
    description: formation.accroche,
  };
}

export default function FormationPage({ params }: Props) {
  const formation = FORMATIONS.find((f) => f.slug === params.slug);
  if (!formation) notFound();
  return <FormationDetailShell formation={formation} />;
}
