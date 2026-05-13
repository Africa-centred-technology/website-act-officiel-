import { Metadata } from "next";
import { notFound } from "next/navigation";
import PoleDeveloppementShell from "@/components/poles/PoleDeveloppementShell";
import PoleConseilShell from "@/components/poles/PoleConseilShell";
import FormationLandpage from "@/components/formations/FormationLandpage";

const poles = {
  "developpement-technologique": {
    component: PoleDeveloppementShell,
    title: "Pôle Développement Technologique | ACT",
    description: "Solutions technologiques sur mesure : développement web, mobile, cloud et DevOps. Transformez vos idées en produits performants.",
  },
  "conseil-strategie-it": {
    component: PoleConseilShell,
    title: "Pôle Conseil & Stratégie IT | ACT",
    description: "Accompagnement stratégique pour votre transformation digitale : audit IT, stratégie digitale et pilotage de projets.",
  },
  "formation": {
    component: FormationLandpage,
    title: "Pôle Formation & Développement | ACT",
    description: "Formations certifiantes, bootcamps intensifs et mentorat pour développer les compétences tech de demain en Afrique.",
  },
};

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pole = poles[params.slug as keyof typeof poles];

  if (!pole) {
    return {
      title: "Pôle Non Trouvé | ACT",
    };
  }

  return {
    title: pole.title,
    description: pole.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(poles).map((slug) => ({
    slug,
  }));
}

export default async function PolePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pole = poles[params.slug as keyof typeof poles];

  if (!pole) {
    notFound();
  }

  const Component = pole.component;
  return <Component />;
}
