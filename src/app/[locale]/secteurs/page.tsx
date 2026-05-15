import SecteursShell from "@/components/secteurs/SecteursShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.secteurs", path: "/secteurs" });
}

export default function SecteursPage() {
  return <SecteursShell />;
}
