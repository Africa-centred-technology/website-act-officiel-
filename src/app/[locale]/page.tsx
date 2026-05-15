import HomeShell from "@/components/home/Home";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.home", path: "" });
}

export default function Home() {
  return <HomeShell />;
}
