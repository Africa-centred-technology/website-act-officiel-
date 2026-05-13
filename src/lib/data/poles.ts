import { Code, Users, GraduationCap, LucideIcon } from "lucide-react";

export interface Pole {
  id: string;       // utilisé comme clé i18n (poles.items.<id>.*)
  n: string;        // numéro affiché ("01"/"02"/"03")
  number: string;
  color: string;
  icon: LucideIcon;
  image: string;
  img: string;
  href: string;
}

export const POLES: Pole[] = [
  {
    id: "developpement-technologique",
    n: "01", number: "01",
    color: "#D35400",
    icon: Code,
    image: "/images/poles/pole-it.jpg",
    img: "/images/poles/pole-it.jpg",
    href: "/poles/developpement-technologique",
  },
  {
    id: "conseil-strategie-it",
    n: "02", number: "02",
    color: "#D35400",
    icon: Users,
    image: "/images/poles/pole-conseil.jpg",
    img: "/images/poles/pole-conseil.jpg",
    href: "/poles/conseil-strategie-it",
  },
  {
    id: "formation",
    n: "03", number: "03",
    color: "#D35400",
    icon: GraduationCap,
    image: "/images/poles/pole-formation.jpg",
    img: "/images/poles/pole-formation.jpg",
    href: "/poles/formation",
  },
];
