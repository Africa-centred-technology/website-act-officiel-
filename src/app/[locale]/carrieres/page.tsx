import CarrieresShell from "@/components/carrieres/CarrieresShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "carrieres.meta", path: "/carrieres" });
}

export default function CarrieresPage() {
  return <CarrieresShell />;
}
