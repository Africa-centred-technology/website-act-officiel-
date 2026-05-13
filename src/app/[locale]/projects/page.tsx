import RealisationsShell from "@/components/realisations/RealisationsShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.projects", path: "/projects" });
}

export default function ProjectsPage() {
  return <RealisationsShell />;
}
