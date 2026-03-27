import { notFound } from "next/navigation";
import { SERVICES, getServiceBySlug } from "@/lib/data/services";
import PoleIngenieurieShell from "@/components/services/PoleIngenieurieShell";
import PoleConseilShell from "@/components/services/PoleConseilShell";
import PoleFormationShell from "@/components/services/PoleFormationShell";

/* Pré-génère toutes les pages au build */
export function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }));
}

/* Metadata dynamique par service */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = getServiceBySlug(slug);
  if (!svc) return {};
  return {
    title: `${svc.title.replace(/\n/g, " ")} — ACT`,
    description: svc.intro.slice(0, 155),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
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
