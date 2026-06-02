import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASE_STUDIES } from "@/lib/data/case-studies";
import CaseStudyDetailShell from "@/components/cas-etudes/CaseStudyDetailShell";
import { buildDynamicPageMetadata } from "@/i18n/seo";

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.id === slug);
  if (!cs) return {};
  return buildDynamicPageMetadata({
    locale,
    path: `/cas-etudes/${slug}`,
    title: `Étude de cas — ACT`,
    description: "Découvrez comment ACT a résolu ce défi client avec une solution technologique sur mesure.",
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.id === slug);
  if (!cs) notFound();

  return <CaseStudyDetailShell caseStudy={cs} />;
}
