import AboutShell from "@/components/about/AboutShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.about", path: "/about" });
}

export default function AboutPage() {
  return <AboutShell />;
}
