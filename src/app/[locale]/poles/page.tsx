import PolesIndexShell from "@/components/poles/PolesIndexShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.poles", path: "/poles" });
}

export default function PolesPage() {
  return <PolesIndexShell />;
}
