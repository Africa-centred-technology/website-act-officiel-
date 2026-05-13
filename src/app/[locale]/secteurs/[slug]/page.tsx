import type { Metadata } from "next";
import SecteurDetailShell from "@/components/secteurs/SecteurDetailShell";
import { secteurs } from "@/lib/secteurs-data";
import { notFound } from "next/navigation";
import { buildDynamicPageMetadata } from "@/i18n/seo";

export function generateStaticParams() {
  return secteurs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const secteur = secteurs.find((s) => s.slug === slug);
  if (!secteur) return { title: "Secteur introuvable — ACT" };

  return buildDynamicPageMetadata({
    locale,
    path: `/secteurs/${slug}`,
    title: `${secteur.label} — Secteurs ACT`,
    description: secteur.description.slice(0, 155),
  });
}

export default async function SecteurPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const secteur = secteurs.find((s) => s.slug === slug);
  if (!secteur) notFound();
  return <SecteurDetailShell secteur={secteur} />;
}
