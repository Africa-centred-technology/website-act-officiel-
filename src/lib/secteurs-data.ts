export type Secteur = {
  slug: string;
  icon: string;       // emoji
  color: string;      // hex accent color
  image: string;      // unsplash URL
  chiffreValue?: string; // structural value (e.g. "+30%"), label is in i18n
};

export const secteurs: Secteur[] = [
  {
    slug: "industrie",
    icon: "⚙️",
    color: "#E67E22",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "+30%",
  },
  {
    slug: "telecoms-medias",
    icon: "📡",
    color: "#3498DB",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "+25%",
  },
  {
    slug: "finance",
    icon: "💰",
    color: "#F39C12",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "70%",
  },
  {
    slug: "ecommerce",
    icon: "🛒",
    color: "#9B59B6",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "+50%",
  },
  {
    slug: "sante",
    icon: "🏥",
    color: "#E84393",
    image:
      "https://images.unsplash.com/photo-1580281657527-47a7d9c1d09b?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "+40%",
  },
  {
    slug: "immobilier",
    icon: "🏢",
    color: "#34495E",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "+25%",
  },
  {
    slug: "education",
    icon: "🎓",
    color: "#2980B9",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "+35%",
  },
];
