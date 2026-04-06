import FormationDetailShell from "@/components/formations/FormationDetailShell";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  // Le titre sera affiché une fois la page chargée côté client
  return {
    title: `Formation — ACT`,
    description: "Découvrez cette formation en Intelligence Artificielle proposée par ACT.",
  };
}

export default async function FormationPage({ params }: Props) {
  const { slug } = await params;
  // La page passe juste le slug au composant client qui fetche Shopify
  return <FormationDetailShell slug={slug} />;
}
