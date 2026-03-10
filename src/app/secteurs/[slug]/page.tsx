import SecteurDetailShell from "@/components/secteurs/SecteurDetailShell";
import { secteurs } from "@/lib/secteurs-data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return secteurs.map((s) => ({ slug: s.slug }));
}

export default async function SecteurPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const secteur = secteurs.find((s) => s.slug === slug);
  if (!secteur) notFound();
  return <SecteurDetailShell secteur={secteur} />;
}
