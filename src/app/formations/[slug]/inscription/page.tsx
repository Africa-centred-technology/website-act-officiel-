import FormationInscriptionShell from "@/components/formations/FormationInscriptionShell";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `Inscription Formation — ACT`,
    description: "Inscrivez-vous à cette formation proposée par Africa Centred Technology.",
  };
}

export default async function FormationInscriptionPage({ params }: Props) {
  const { slug } = await params;
  return <FormationInscriptionShell slug={slug} />;
}
