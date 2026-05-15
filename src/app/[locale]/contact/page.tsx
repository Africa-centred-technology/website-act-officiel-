import ContactShell from "@/components/contact/ContactShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return await buildPageMetadata({ locale, namespace: "metadata.contact", path: "/contact" });
}

export default function ContactPage() {
  return <ContactShell />;
}
