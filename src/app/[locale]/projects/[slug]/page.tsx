import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECTS, getProject } from "@/lib/data/projects";
import ProjectDetailShell from "@/components/realisations/ProjectDetailShell";
import { buildDynamicPageMetadata } from "@/i18n/seo";

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
  const project = getProject(slug);
  if (!project) return { title: "Projet introuvable" };

  return buildDynamicPageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: `${project.title} — Réalisations ACT`,
    description: project.description,
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
