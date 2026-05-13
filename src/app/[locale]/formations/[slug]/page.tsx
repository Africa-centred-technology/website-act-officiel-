import { Suspense } from "react";
import FormationDetailShell from "@/components/formations/FormationDetailShell";
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { fetchShopifyFormationByHandle } from "@/lib/shopify/formations";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const formation = await fetchShopifyFormationByHandle(slug).catch(() => null);

  const title = formation?.title ?? "Formation ACT";
  const description = formation?.accroche ?? "Découvrez cette formation en Intelligence Artificielle proposée par Africa Centred Technology.";

  return buildDynamicPageMetadata({
    locale,
    path: `/formations/${slug}`,
    title,
    description,
    ogImage: `/api/og?title=${encodeURIComponent(title)}&subtitle=Formation`,
  });
}

function FormationDetailLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F4F0",
      }}
      aria-label="Chargement de la formation…"
    >
      <span style={{ opacity: 0.5, fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", color: "#1C1410" }}>
        Chargement…
      </span>
    </div>
  );
}

export default async function FormationPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<FormationDetailLoading />}>
      <FormationDetailShell slug={slug} />
    </Suspense>
  );
}
