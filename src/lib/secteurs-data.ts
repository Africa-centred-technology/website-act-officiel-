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
      "Dans un environnement industriel de plus en plus compétitif, les entreprises doivent accélérer leur transformation pour gagner en performance, en qualité et en agilité. ACT accompagne les acteurs industriels dans la digitalisation de leurs opérations en intégrant des technologies intelligentes qui optimisent les processus, renforcent la prise de décision et améliorent durablement la productivité.",
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
    chiffre: { value: "+30%", label: "de gain potentiel en productivité" },
  },
  {
    slug: "telecoms-medias",
    label: "Télécommunications & Médias",
    tagline: "Accélérer la création de valeur dans l’économie numérique",
    description:
      "Au cœur de l’économie digitale, les télécommunications et les médias jouent un rôle clé dans la connectivité, la diffusion de contenus et la création de nouveaux usages. ACT accompagne les opérateurs, les régulateurs et les acteurs des médias dans la valorisation de leurs infrastructures et de leurs données, en développant des services innovants, des expériences personnalisées et des modèles économiques durables.",
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
    chiffre: { value: "+25%", label: "de revenus générés via les services digitaux" },
  },
 
  {
    slug: "finance",
    label: "Finance & FinTech",
    tagline: "Réinventer les services financiers à l’ère digitale",
    description:
      "Le secteur financier connaît une transformation accélérée sous l’effet des technologies digitales, des nouveaux usages et des exigences réglementaires. ACT accompagne les institutions financières, banques et fintechs dans la conception de solutions innovantes, sécurisées et centrées sur l’utilisateur, afin d’améliorer l’accès aux services, optimiser les opérations et renforcer la gestion des risques",
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
    tagline: "Créer des expériences d’achat performantes et scalables",
    description:
      "Le e-commerce redéfinit les standards du commerce en combinant expérience client, data et performance opérationnelle. ACT accompagne les acteurs du retail dans la conception et l’optimisation de plateformes digitales à forte valeur ajoutée, en intégrant des solutions innovantes pour maximiser les ventes, fluidifier les parcours d’achat et améliorer l’efficacité logistique.",
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
    chiffre: { value: "+50%", label: "d’augmentation potentielle du taux de conversion"},
  },

  {
  slug: "sante",
  label: "Santé & MedTech",
  tagline: "Transformer les systèmes de santé par le digital",
  description:
    "Le secteur de la santé connaît une تحول profonde portée par les technologies digitales, la data et l’intelligence artificielle. ACT accompagne les établissements de santé, les organismes publics et les acteurs MedTech dans la modernisation de leurs systèmes, l’amélioration des parcours patients et l’optimisation des performances opérationnelles, tout en garantissant la sécurité et la conformité des données.",
  icon: "🏥",
  color: "#E84393",
  image:
    "https://images.unsplash.com/photo-1580281657527-47a7d9c1d09b?auto=format&fit=crop&w=2400&q=80",
  services: [
    "Digitalisation des parcours patients & dossiers médicaux",
    "Systèmes d’information hospitaliers (SIH)",
    "Analyse de données de santé & aide à la décision",
    "Solutions de télémédecine & suivi à distance",
    "Sécurité, conformité & gestion des données sensibles",
  ],
  chiffre: { value: "+40%", label: "d’amélioration de l’efficacité des processus de soins" },
},
{
  slug: "immobilier",
  label: "Immobilier & PropTech",
  tagline: "Optimiser les décisions immobilières par la donnée",
  description:
    "Le secteur immobilier évolue vers un modèle piloté par la donnée, où chaque décision d’investissement, de gestion ou de valorisation repose sur des analyses précises et en temps réel. ACT accompagne les promoteurs, investisseurs et gestionnaires d’actifs dans la digitalisation de leurs processus, l’optimisation de leurs portefeuilles et l’amélioration de la performance des actifs immobiliers.",
  icon: "🏢",
  color: "#34495E",
  image:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=80",
  services: [
    "Analyse de données immobilières & aide à l’investissement",
    "Plateformes de gestion de biens (Property Management)",
    "Modélisation des prix & prévision des tendances",
    "Digitalisation des transactions & parcours client",
    "Tableaux de bord de performance des actifs",
  ],
  chiffre: { value: "+25%", label: "d’optimisation de la rentabilité des actifs" },
},
{
  slug: "education",
  label: "Éducation & EdTech",
  tagline: "Accélérer la transformation éducative par le digital",
  description:
    "L’éducation est le principal levier de développement des sociétés. Dans un monde en mutation rapide, les technologies digitales offrent des opportunités inédites pour transformer les systèmes éducatifs, améliorer l’accès au savoir et développer les compétences du futur. ACT accompagne les institutions éducatives, les organismes de formation et les acteurs EdTech dans la conception et le déploiement de solutions innovantes, centrées sur l’apprenant et alignées sur les enjeux du XXIe siècle.",
  icon: "🎓",
  color: "#2980B9",
  image:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2400&q=80",
  services: [
    "Plateformes d’apprentissage en ligne (LMS) & blended learning",
    "Digitalisation des parcours étudiants & gestion administrative",
    "Outils pédagogiques innovants & réalité augmentée",
    "Analyse de données d’apprentissage & IA pour la personnalisation",
    "Formation des enseignants aux outils numériques",
  ],
  chiffre: { value: "+35%", label: "d’amélioration de l’engagement des apprenants" },
}
];
