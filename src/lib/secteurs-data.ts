export type Secteur = {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  icon: string; // emoji
  color: string; // hex accent color
  image: string; // unsplash URL
  services: string[]; // bullet services ACT
  chiffre?: { value: string; label: string };
};

export const secteurs: Secteur[] = [
  {
    slug: "industrie",
    label: "Industrie",
    tagline: "Moderniser pour mieux compétir",
    description:
      "L'industrialisation de l'Afrique représente l'un des défis les plus décisifs du XXIe siècle. ACT accompagne les entreprises industrielles africaines dans leur transformation digitale avec une conviction forte : la technologie n'est pas là pour remplacer les travailleurs africains, mais pour les rendre plus efficaces, plus qualifiés et plus compétitifs sur les marchés mondiaux.",
    icon: "⚙️",
    color: "#E67E22",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=2400&q=80",
    services: [
      "Automatisation des lignes de production",
      "IoT & maintenance prédictive",
      "Digitalisation de la chaîne logistique",
      "Systèmes de traçabilité & suivi temps réel",
      "Optimisation des flux de production",
    ],
    chiffre: { value: "2.5B", label: "d'habitants en Afrique d'ici 2050" },
  },
  {
    slug: "telecoms-medias",
    label: "Télécommunications & Médias",
    tagline: "L'épine dorsale du digital africain",
    description:
      "Les télécommunications ont été le premier grand succès de la transformation digitale africaine. ACT accompagne les opérateurs télécoms, les régulateurs et les acteurs des médias numériques dans l'exploitation pleine de ce potentiel, de la fintech mobile aux plateformes de contenus en ligne.",
    icon: "📡",
    color: "#3498DB",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=80",
    services: [
      "Plateformes de services à valeur ajoutée",
      "Monétisation intelligente des données",
      "Algorithmes de segmentation & personnalisation",
      "Transition numérique des médias africains",
      "Modèles économiques digitaux (abonnement, publicité programmatique)",
    ],
    chiffre: { value: "#1", label: "succès de la transformation digitale africaine" },
  },
  {
    slug: "agriculture",
    label: "Agriculture & Géomatique",
    tagline: "Connaître son territoire pour mieux le développer",
    description:
      "On ne peut pas développer ce qu'on ne connaît pas. ACT a développé une expertise en géomatique et en Systèmes d'Information Géographique (SIG) spécifiquement adaptée aux besoins et aux contraintes du contexte africain, pour une agriculture intelligente et une gestion territoriale précise.",
    icon: "🌍",
    color: "#27AE60",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80",
    services: [
      "Cartographies numériques par données satellitaires",
      "SIG pour planification urbaine & rurale",
      "Suivi satellitaire des ressources naturelles",
      "Agriculture de précision & estimation des rendements",
      "Formation des agents publics aux outils SIG",
    ],
    chiffre: { value: "SIG", label: "Systèmes d'Information Géographique adaptés à l'Afrique" },
  },
  {
    slug: "finance",
    label: "Finance & FinTech",
    tagline: "Inclure chaque africain dans l'économie numérique",
    description:
      "Le secteur financier africain est en pleine mutation, porté par l'essor du mobile money et de la fintech. ACT accompagne les institutions financières, banques et fintechs dans le développement de solutions numériques innovantes adaptées aux réalités africaines.",
    icon: "💰",
    color: "#F39C12",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2400&q=80",
    services: [
      "Développement de plateformes fintech",
      "Solutions de mobile banking & paiement",
      "Systèmes de scoring & gestion du risque",
      "Conformité réglementaire & sécurité des données",
      "Intégration API bancaires & interopérabilité",
    ],
    chiffre: {
      value: "70%",
      label: "des africains sans accès aux services bancaires traditionnels",
    },
  },
  {
    slug: "ecommerce",
    label: "E-commerce & Retail",
    tagline: "Connecter les marchés africains au monde digital",
    description:
      "L'e-commerce africain connaît une croissance exponentielle. ACT accompagne les entreprises du commerce dans leur transition numérique, de la boutique en ligne à la logistique connectée, en construisant des expériences d'achat adaptées aux spécificités du marché africain.",
    icon: "🛒",
    color: "#9B59B6",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2400&q=80",
    services: [
      "Développement de plateformes e-commerce",
      "Solutions de paiement mobile & multi-canal",
      "Systèmes de gestion des stocks & logistique",
      "Outils de marketing digital & personnalisation",
      "Applications mobiles commerce (iOS & Android)",
    ],
    chiffre: { value: "×3", label: "croissance prévue du e-commerce africain d'ici 2030" },
  },
  {
    slug: "gestion-urbaine",
    label: "Gestion Urbaine & Smart City",
    tagline: "Construire les villes africaines de demain",
    description:
      "L'urbanisation rapide de l'Afrique représente à la fois un défi et une opportunité extraordinaire. ACT accompagne les municipalités et les acteurs de l'aménagement urbain dans la conception et le déploiement de solutions smart city adaptées aux contextes africains.",
    icon: "🏙️",
    color: "#1ABC9C",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2400&q=80",
    services: [
      "Systèmes de gestion urbaine intégrés",
      "Plateformes de mobilité & transport intelligent",
      "Gestion des infrastructures (eau, énergie, déchets)",
      "Cartographie urbaine & modélisation de l'expansion",
      "Tableaux de bord décisionnels pour élus",
    ],
    chiffre: { value: "60%", label: "des africains vivront en ville d'ici 2050" },
  },
  {
    slug: "secteur-public",
    label: "Secteur Public",
    tagline: "Construire l'État africain du XXIe siècle",
    description:
      "La transformation digitale des États africains n'est pas seulement un enjeu d'efficacité administrative. C'est un enjeu de légitimité, de gouvernance et de développement économique. ACT accompagne les ministères, agences publiques et institutions gouvernementales africaines dans leur transformation numérique.",
    icon: "🏛️",
    color: "#E74C3C",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=2400&q=80",
    services: [
      "Systèmes intégrés de gestion publique",
      "E-gouvernement & services citoyens en ligne",
      "Gouvernance numérique & cadres réglementaires",
      "Formation des agents publics au digital",
      "Ouverture des données gouvernementales (Open Data)",
    ],
    chiffre: { value: "100%", label: "des services publics peuvent être digitalisés" },
  },
];
