import { Code, Users, GraduationCap, LucideIcon } from "lucide-react";

export interface Pole {
  id: string;
  n: string;
  number: string;
  title: string;
  titleWithBreaks: string;
  tagline: string;
  tag: string;
  description: string;
  desc: string;
  color: string;
  icon: LucideIcon;
  image: string;
  img: string;
  href: string;
  stats: {
    left: string;
    leftLabel: string;
    right: string;
    rightLabel: string;
  };
}

export const POLES: Pole[] = [
  {
    id: "developpement-technologique",
    n: "01",
    number: "01",
    title: "Développement Technologique",
    titleWithBreaks: "Pôle\nDéveloppement\nTechnologique",
    tagline: "L'excellence technique au service de vos ambitions",
    tag: "Ingénierie",
    description: "Conception et déploiement de solutions technologiques sur mesure qui transforment vos idées en produits concrets.",
    desc: "Solutions sur mesure, plateformes robustes et développement logiciel adapté aux enjeux de chaque client.",
    color: "#D35400",
    icon: Code,
    image: "/images/poles/pole-it.jpg",
    img: "/images/poles/pole-it.jpg",
    href: "/poles/developpement-technologique",
    stats: { left: "Sur-mesure", leftLabel: "Ingénierie", right: "Performance", rightLabel: "Robustesse" }
  },
  {
    id: "conseil-strategie-it",
    n: "02",
    number: "02",
    title: "Conseil & Stratégie IT",
    titleWithBreaks: "Pôle\nConseil",
    tagline: "Votre partenaire stratégique pour la transformation digitale",
    tag: "Stratégie IT",
    description: "Accompagnement stratégique et opérationnel dans votre transformation numérique, de l'audit au pilotage de projets.",
    desc: "Accompagnement stratégique, audit technologique et transformation globale pour accélérer votre croissance.",
    color: "#D35400",
    icon: Users,
    image: "/images/poles/pole-conseil.jpg",
    img: "/images/poles/pole-conseil.jpg",
    href: "/poles/conseil-strategie-it",
    stats: { left: "Audit 360°", leftLabel: "Diagnostic", right: "Stratégie", rightLabel: "Accompagnement" }
  },
  {
    id: "formation",
    n: "03",
    number: "03",
    title: "Formation & Développement",
    titleWithBreaks: "Pôle\nFormation",
    tagline: "Former les talents qui construiront l'Afrique de demain",
    tag: "Transmission",
    description: "Démocratisation de l'accès aux compétences technologiques via formations certifiantes, ateliers et bootcamps.",
    desc: "Montée en compétences, ateliers spécialisés et parcours de formation pour développer les talents.",
    color: "#D35400",
    icon: GraduationCap,
    image: "/images/poles/pole-formation.jpg",
    img: "/images/poles/pole-formation.jpg",
    href: "/poles/formation",
    stats: { left: "Certifiant", leftLabel: "Parcours", right: "Innovation", rightLabel: "Impact Local" }
  },
];
