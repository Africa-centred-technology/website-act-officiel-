import { FORMATIONS } from "@/lib/data/formations";
import FormationDetailShell from "@/components/formations/FormationDetailShell";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FORMATIONS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const formation = FORMATIONS.find((f) => f.slug === slug);
  if (!formation) return { title: "Formation introuvable" };
  return {
    title: `${formation.title} — ACT Formations`,
    description: formation.accroche,
  };
}

export default async function FormationPage({ params }: Props) {
  const { slug } = await params;
  const formation = FORMATIONS.find((f) => f.slug === slug);
  if (!formation) notFound();
  return <FormationDetailShell formation={formation} />;
}
