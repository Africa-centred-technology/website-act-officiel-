export type Secteur = {
  slug: string;
  icon: string;       // emoji
  color: string;      // hex accent color
  image: string;      // chemin local (public/)
  chiffreValue?: string; // structural value (e.g. "+30%"), label is in i18n
};

export const secteurs: Secteur[] = [
  {
    slug: "industrie",
    icon: "⚙️",
    color: "#E67E22",
    image: "/images/secteur/industrie.png",
    chiffreValue: "+30%",
  },
  {
    slug: "telecoms-medias",
    icon: "📡",
    color: "#3498DB",
    image: "/images/secteur/telecoms-medias.png",
    chiffreValue: "+25%",
  },
  {
    slug: "finance",
    icon: "💰",
    color: "#F39C12",
    image: "/images/secteur/finance.jpg",
    chiffreValue: "70%",
  },
  {
    slug: "ecommerce",
    icon: "🛒",
    color: "#9B59B6",
    image: "/images/secteur/ecommerce.jpg",
    chiffreValue: "+50%",
  },
  {
    slug: "sante",
    icon: "🏥",
    color: "#E84393",
    image: "/images/secteur/sante.jpg",
    chiffreValue: "+40%",
  },
  {
    slug: "immobilier",
    icon: "🏢",
    color: "#34495E",
    image: "/images/secteur/immobilier.png",
    chiffreValue: "+25%",
  },
  {
    slug: "education",
    icon: "🎓",
    color: "#2980B9",
    image: "/images/secteur/education.jpg",
    chiffreValue: "+35%",
  },
];
