import { Suspense } from "react";
import FormationInscriptionShell from "@/components/formations/FormationInscriptionShell";
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { fetchShopifyFormationByHandle } from "@/lib/shopify/formations";
import type { Locale } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const formation = await fetchShopifyFormationByHandle(slug, locale as Locale).catch(() => null);

  const formationTitle = formation?.title ?? "Formation ACT";
  const title = `${formationTitle} — Inscription`;
  const description = formation?.accroche ?? "Inscrivez-vous à cette formation proposée par Africa Centred Technology.";

  return buildDynamicPageMetadata({
    locale,
    path: `/formations/${slug}/inscription`,
    title,
    description,
    ogImage: `/api/og?title=${encodeURIComponent(title)}&subtitle=Inscription`,
  });
}

function InscriptionLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F4F0",
      }}
      aria-label="Chargement du formulaire d'inscription…"
    >
      <span style={{ opacity: 0.5, fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", color: "#1C1410" }}>
        Chargement…
      </span>
    </div>
  );
}

export default async function FormationInscriptionPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<InscriptionLoading />}>
      <FormationInscriptionShell slug={slug} />
    </Suspense>
  );
}
