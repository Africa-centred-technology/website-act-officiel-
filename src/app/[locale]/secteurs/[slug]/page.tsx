import type { Metadata } from "next";
import SecteurDetailShell from "@/components/secteurs/SecteurDetailShell";
import { secteurs } from "@/lib/secteurs-data";
import { notFound } from "next/navigation";
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { getDataMessages } from "@/i18n/data-i18n";

export function generateStaticParams() {
  return secteurs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const secteurExists = secteurs.find((s) => s.slug === slug);
  if (!secteurExists) return { title: "Secteur introuvable — ACT" };

  const msg = await getDataMessages();
  const i18n = msg.secteurs.items[slug];

  return buildDynamicPageMetadata({
    locale,
    path: `/secteurs/${slug}`,
    title: i18n?.label ? `${i18n.label} — Secteurs ACT` : `${slug} — ACT`,
    description: (i18n?.description ?? "Secteur d'activité — ACT.").slice(0, 155),
  });
}

export default async function SecteurPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const secteur = secteurs.find((s) => s.slug === slug);
  if (!secteur) notFound();
  return <SecteurDetailShell secteur={secteur} />;
}
