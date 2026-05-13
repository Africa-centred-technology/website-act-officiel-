import { Metadata } from "next";
import PolesIndexShell from "@/components/poles/PolesIndexShell";

export const metadata: Metadata = {
  title: "Nos Pôles d'Excellence | Africa Centred Technology",
  description: "Découvrez les trois pôles d'ACT : Développement Technologique, Conseil & Stratégie IT, et Formation. Des solutions complètes pour votre transformation digitale.",
  keywords: ["pôles ACT", "développement technologique", "conseil IT", "formation technologique", "transformation digitale", "Afrique"],
};

export default function PolesPage() {
  return <PolesIndexShell />;
}
