import { buildPageMetadata } from "@/i18n/seo";
import PrivacyShell from "@/components/legal/PrivacyShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({
    locale,
    namespace: "legal.privacy.meta",
    path: "/privacy",
  });
}

export default function PrivacyPage() {
  return <PrivacyShell />;
}
