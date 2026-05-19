import { buildPageMetadata } from "@/i18n/seo";
import TermsShell from "@/components/legal/TermsShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({
    locale,
    namespace: "legal.terms.meta",
    path: "/terms",
  });
}

export default function TermsPage() {
  return <TermsShell />;
}
