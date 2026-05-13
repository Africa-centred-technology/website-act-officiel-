import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/data/services";
import PoleIngenieurieShell from "@/components/services/PoleIngenieurieShell";
import PoleConseilShell from "@/components/services/PoleConseilShell";
import PoleFormationShell from "@/components/services/PoleFormationShell";
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { getDataMessages } from "@/i18n/data-i18n";

/* Pré-génère toutes les pages au build */
export function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }));
}

/* Metadata dynamique par service */
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const msg = await getDataMessages();
  const i18n = msg.services.items[slug];
  const title = i18n?.title?.replace(/\n/g, " ") ?? `${slug} — ACT`;
  const description = (i18n?.intro ?? "Service ACT — découvrez notre expertise.").slice(0, 155);
  return buildDynamicPageMetadata({
    locale,
    path: `/services/${slug}`,
    title,
    description,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);

  if (!svc) notFound();

  // Routage vers le composant spécifique selon le pôle
  if (svc.poleN === "I") {
    return <PoleIngenieurieShell svc={svc} />;
  } else if (svc.poleN === "II") {
    return <PoleConseilShell svc={svc} />;
  } else if (svc.poleN === "III") {
    return <PoleFormationShell svc={svc} />;
  }

  // Fallback (ne devrait jamais arriver)
  notFound();
}
