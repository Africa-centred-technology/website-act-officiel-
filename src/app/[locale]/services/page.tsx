import ServicesShellClient from "@/components/services/ServicesShellClient";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.services", path: "/services" });
}

export default function ServicesPage() {
  return <ServicesShellClient />;
}
