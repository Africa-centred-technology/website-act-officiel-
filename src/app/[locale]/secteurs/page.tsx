import SecteursShell from "@/components/secteurs/SecteursShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.secteurs", path: "/secteurs" });
}

export default function SecteursPage() {
  return <SecteursShell />;
}
