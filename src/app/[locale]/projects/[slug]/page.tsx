import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS, getProject } from "@/lib/data/projects";
import ProjectDetailShell from "@/components/realisations/ProjectDetailShell";
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { getDataMessages } from "@/i18n/data-i18n";

/* ── Génération statique des routes ─────────────────── */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

/* ── Métadonnées dynamiques ──────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const msg = await getDataMessages();
  const i18n = msg.projects.items[slug];
  return buildDynamicPageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: i18n?.title ? `${i18n.title} — Réalisations ACT` : `${slug} — Réalisations ACT`,
    description: (i18n?.description ?? "Découvrez ce projet ACT.").slice(0, 155),
  });
}

/* ── Page ─────────────────────────────────────────────── */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectDetailShell project={project} />;
}
