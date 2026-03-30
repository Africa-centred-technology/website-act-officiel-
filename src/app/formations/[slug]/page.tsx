import { FORMATIONS } from "@/lib/data/formations";
import FormationDetailShell from "@/components/formations/FormationDetailShell";
import { notFound } from "next/navigation";
import { getFormationBySlug, mapShopifyProductToFormation } from "@/lib/data/shopify";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Optionnel: On peut aussi récupérer les slugs depuis Shopify ici
  return FORMATIONS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  // Essayer Shopify d'abord
  const shopifyProduct = await getFormationBySlug(slug);
  if (shopifyProduct) {
    return {
      title: `${shopifyProduct.title} — ACT Formations`,
      description: shopifyProduct.accroche?.value || shopifyProduct.title,
    };
  }

  // Fallback statique
  const formation = FORMATIONS.find((f) => f.slug === slug);
  if (!formation) return { title: "Formation introuvable" };
  return {
    title: `${formation.title} — ACT Formations`,
    description: formation.accroche,
  };
}

export default async function FormationPage({ params }: Props) {
  const { slug } = await params;
  
  // 1. Essayer de récupérer depuis Shopify
  const shopifyProduct = await getFormationBySlug(slug);
  
  if (shopifyProduct) {
    const formation = mapShopifyProductToFormation(shopifyProduct);
    
    // Enrichir avec les données statiques pour les champs manquants (programme, objectifs, etc.)
    const staticData = FORMATIONS.find(f => f.slug === slug);
    if (staticData) {
      formation.objectifs = formation.objectifs.length > 0 ? formation.objectifs : staticData.objectifs;
      formation.programme = formation.programme.length > 0 ? formation.programme : staticData.programme;
      formation.livrables = formation.livrables.length > 0 ? formation.livrables : staticData.livrables;
    }
    
    return <FormationDetailShell formation={formation} />;
  }

  // 2. Fallback sur les données statiques
  const formation = FORMATIONS.find((f) => f.slug === slug);
  if (!formation) notFound();
  
  return <FormationDetailShell formation={formation} />;
}
