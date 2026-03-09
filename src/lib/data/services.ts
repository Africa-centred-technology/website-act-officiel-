/* ══════════════════════════════════════════════════════
   ACT — Services Data (source unique de vérité)
   ══════════════════════════════════════════════════════ */

export interface ServiceSub {
  title: string;
  desc: string;
}

export interface Service {
  slug: string;
  n: string;
  pole: string;
  poleN: "I" | "II";
  accent: string;
  bg: string;
  icon: string;          // SVG path (viewBox 0 0 24 24)
  title: string;         // peut contenir \n
  tagline: string;
  intro: string;
  subs: ServiceSub[];
  benefits: string[];
  deliverables: string[];
  video: string;
}

const ORANGE = "#D35400";
const GOLD   = "#F39C12";

export const SERVICES: Service[] = [
  {
    slug: "ingenierie-logicielle",
    n: "01", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 20% 60%, #0D2040 0%, #050C18 55%, #030810 100%)",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "Ingénierie Logicielle\n& Solutions Métiers",
    tagline: "Des applications qui parlent africain",
    intro: "Les organisations africaines perdent en compétitivité avec des outils génériques inadaptés à leurs réalités. ACT conçoit des solutions sur mesure, pensées pour les contraintes du continent — connectivité limitée, diversité linguistique, processus hybrides papier/digital.",
    subs: [
      {
        title: "Applications Web & Mobile « African-Ready »",
        desc: "Mobile-first, natif Android/iOS et hybride. Performance optimisée pour les réseaux africains, UX taillée pour l'adoption locale. Progressive Web App, mode hors-ligne intégré.",
      },
      {
        title: "Logiciels Métiers Spécifiques",
        desc: "ERP, SIRH conformes OHADA, CRM, gestion de projets et de stocks — construits à partir des processus réels de chaque organisation, sans surcoût de configuration inutile.",
      },
    ],
    benefits: ["Efficacité opérationnelle", "Adoption rapide", "ROI mesurable", "Plateformes évolutives"],
    deliverables: ["Application livrée & documentée", "Formation des équipes techniques", "Maintenance & support 12 mois", "Tableau de bord de performance"],
    video: "https://cdn.pixabay.com/video/2019/05/06/23355-334950213_large.mp4",
  },
  {
    slug: "automatisation-ia",
    n: "02", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 90% at 80% 40%, #0A1F0D 0%, #050C18 55%, #030810 100%)",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    title: "Automatisation\nIntelligente (IA Agentique)",
    tagline: "L'IA qui travaille avec vous",
    intro: "Les processus manuels fragmentés génèrent délais et erreurs. ACT déploie des architectures d'agents IA qui collaborent pour transformer vos workflows en machines intelligentes — sans remplacer l'humain, mais en démultipliant ses capacités.",
    subs: [
      {
        title: "Architectures Multi-Agents",
        desc: "Plusieurs agents spécialisés coopèrent : collecte, analyse, coordination, rapports et actions automatisées en chaîne. Orchestration robuste, tolérance aux pannes.",
      },
      {
        title: "Traitement Hybride Digital / Papier",
        desc: "Numérisation, OCR, extraction automatique — les documents papier deviennent des données intégrées dans vos systèmes. Gestion des flux mixtes sans rupture de chaîne.",
      },
      {
        title: "IA de Soutien (Augmentation Humaine)",
        desc: "L'IA synthétise et recommande, l'humain décide. Un duo complémentaire qui démultiplie les capacités des équipes sans les déshumaniser.",
      },
    ],
    benefits: ["Processus accéléré ×5", "Erreurs humaines réduites", "Décisions renforcées", "Coordination fluide"],
    deliverables: ["Cartographie des processus automatisables", "Agents déployés & testés", "Tableau de bord de monitoring", "Guide de gouvernance IA"],
    video: "https://cdn.pixabay.com/video/2023/07/24/173103-848555583_large.mp4",
  },
  {
    slug: "architecture-infrastructure",
    n: "03", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 85% 70% at 60% 80%, #150A2A 0%, #050C18 55%, #030810 100%)",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    title: "Architecture\n& Infrastructure",
    tagline: "Les fondations de votre croissance",
    intro: "Sans fondations solides, vos applications deviennent des dettes techniques coûteuses. ACT conçoit des architectures évolutives et des clouds souverains adaptés aux réglementations africaines, pour que vos systèmes grandissent avec votre organisation.",
    subs: [
      {
        title: "Architecture Logicielle Évolutive",
        desc: "Microservices, event-driven, API-first — des systèmes qui s'étendent de l'administration locale au système national sans reconstruction majeure.",
      },
      {
        title: "Solutions Cloud Souveraines",
        desc: "Adoption cloud alignée sur les réglementations de localisation des données. Hybride cloud/local, migration sans interruption de service.",
      },
      {
        title: "IT Consulting & Solution Design",
        desc: "Conseil indépendant : analyses comparatives, études de faisabilité, TCO sur 5 ans — pour des décisions technologiques éclairées, sans conflit d'intérêt.",
      },
    ],
    benefits: ["Investissement protégé", "Scalabilité native", "Conformité assurée", "Coûts maîtrisés"],
    deliverables: ["Schéma d'architecture validé", "Plan de migration détaillé", "Rapport TCO 5 ans", "Documentation technique complète"],
    video: "https://cdn.pixabay.com/video/2024/11/05/240062_large.mp4",
  },
  {
    slug: "data-intelligence-artificielle",
    n: "04", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 30% 20%, #071A1A 0%, #050C18 55%, #030810 100%)",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Data, Intelligence\nArtificielle & Big Data",
    tagline: "Vos données au service de votre mission",
    intro: "L'Afrique génère des volumes colossaux de données non exploitées. ACT les transforme en actifs stratégiques — avec des modèles entraînés sur des données africaines, par des équipes africaines, pour des problématiques africaines.",
    subs: [
      {
        title: "Data Science & Machine Learning",
        desc: "Modèles prédictifs calibrés pour l'Afrique : prévision de demande, détection de fraude, segmentation, maintenance prédictive — avec métriques d'équité.",
      },
      {
        title: "Data Engineering",
        desc: "Pipelines automatisés, data warehouses, data lakes et systèmes de qualité — l'infrastructure invisible qui rend l'IA opérationnelle à grande échelle.",
      },
      {
        title: "IA Responsable & AI Governance",
        desc: "Solutions IA explicables, équitables et contrôlables. Politique d'IA, comités d'éthique, formation des dirigeants pour une IA maîtrisée.",
      },
    ],
    benefits: ["Décisions data-driven", "Modèles contextualisés", "Gouvernance intégrée", "Big Data opérable"],
    deliverables: ["Modèles IA déployés & validés", "Pipelines de données automatisés", "Dashboard analytics temps réel", "Charte IA & gouvernance"],
    video: "https://cdn.pixabay.com/video/2020/01/30/31772-388253161_large.mp4",
  },
  {
    slug: "geomatique-sig",
    n: "05", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 80% at 70% 70%, #1A1205 0%, #050C18 55%, #030810 100%)",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    title: "Géomatique\n& Systèmes d'Information\nGéographique",
    tagline: "Connaître son territoire pour le développer",
    intro: "On ne développe pas ce qu'on ne connaît pas. ACT produit des cartographies précises et construit des SIG décisionnels qui transforment la donnée spatiale en politique publique — pour les États, les collectivités et les organisations de développement.",
    subs: [
      {
        title: "Cartographie Numérique",
        desc: "Imagerie satellitaire, LiDAR, GPS et drones. Mise à jour continue — indispensable dans des territoires africains en mutation rapide, où les cartes obsolètes coûtent des millions.",
      },
      {
        title: "Systèmes d'Information Géographique",
        desc: "Plateformes décisionnelles croisant données territoriales et socio-économiques : urbanisme, ressources naturelles, politiques publiques, plans d'urgence.",
      },
    ],
    benefits: ["Décisions d'aménagement éclairées", "Autonomie géomatique", "Données actualisées", "Appui aux politiques"],
    deliverables: ["Cartographie numérique haute résolution", "Plateforme SIG opérationnelle", "Formation équipes SIG", "Protocole de mise à jour"],
    video: "https://cdn.pixabay.com/video/2017/07/23/10854-226632941_large.mp4",
  },
  {
    slug: "conseil-strategique",
    n: "06", pole: "Conseil & Formation", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 85% 75% at 40% 50%, #1A1708 0%, #050C18 55%, #030810 100%)",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Conseil Stratégique\n& Transformation",
    tagline: "La stratégie avant l'outil",
    intro: "Beaucoup d'organisations achètent un logiciel avant de savoir pourquoi. ACT inverse cette logique — la vision stratégique précède toujours le choix technologique. Une transformation réussie se pilote, elle ne s'improvise pas.",
    subs: [
      {
        title: "Conseil Digital & Growth",
        desc: "Audit de maturité digitale, diagnostic des systèmes en place, feuille de route co-construite avec jalons et KPIs actionnables. Vous savez où vous en êtes et où vous allez.",
      },
      {
        title: "Digital Transformation Services",
        desc: "Conduite du changement de bout en bout : communication, formation des managers, instances de gouvernance, mesure d'impact. La technologie n'est qu'un levier.",
      },
      {
        title: "Développement Territorial & Ville Intelligente",
        desc: "Territoires intelligents africains — amélioration des services publics en tenant compte des réalités locales, pas des modèles importés inadaptés.",
      },
    ],
    benefits: ["Stratégie claire", "Transformation réussie", "Investissements rentabilisés", "Territoires efficaces"],
    deliverables: ["Rapport d'audit de maturité digitale", "Feuille de route stratégique 3 ans", "Plan de conduite du changement", "Tableau de bord KPIs"],
    video: "https://cdn.pixabay.com/video/2022/10/31/137265-766326232_large.mp4",
  },
  {
    slug: "conseil-operationnel",
    n: "07", pole: "Conseil & Formation", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 80% 80% at 75% 30%, #080F1A 0%, #050C18 55%, #030810 100%)",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    title: "Conseil Opérationnel\n& Métier",
    tagline: "Comprendre avant de numériser",
    intro: "Un processus inefficace numérisé reste inefficace — simplement plus rapide et plus coûteux. ACT optimise l'opérationnel avant de choisir la technologie, en partant du terrain, pas d'une présentation PowerPoint.",
    subs: [
      {
        title: "Business Analysis",
        desc: "Cartographie terrain BPMN, identification des goulots d'étranglement, cahiers des charges fonctionnels directement exploitables par les équipes techniques.",
      },
      {
        title: "Conseil Opérationnel",
        desc: "Optimisation des processus, alignement stratégie–opération–technologie, accompagnement à la mise en œuvre et mesure ROI. Des résultats concrets, pas des slides.",
      },
    ],
    benefits: ["Processus optimisés", "Besoins réels identifiés", "ROI concret", "Adoption facilitée"],
    deliverables: ["Cartographie BPMN des processus", "Cahier des charges fonctionnel", "Plan d'optimisation priorisé", "Rapport ROI 6 mois"],
    video: "https://cdn.pixabay.com/video/2024/03/01/202560-918431383_large.mp4",
  },
  {
    slug: "formation-competences",
    n: "08", pole: "Conseil & Formation", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 90% 70% at 25% 75%, #051A0A 0%, #050C18 55%, #030810 100%)",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    title: "Formation\n& Développement\ndes Compétences",
    tagline: "La souveraineté passe par les talents africains",
    intro: "Les meilleurs systèmes tombent en désuétude si personne ne peut les maintenir. La formation n'est pas un accessoire chez ACT — c'est une condition de la souveraineté technologique africaine. Pas de dépendance externe permanente.",
    subs: [
      {
        title: "Formation sur Mesure (Présentiel)",
        desc: "Programmes construits sur diagnostic, illustrés d'exemples africains concrets, avec apprentissage par la pratique sur données réelles de l'organisation.",
      },
      {
        title: "Formation en Ligne",
        desc: "Modules légers, smartphone-first, consultables hors-ligne (15–30 min). Communauté apprenante avec forums et sessions live. Accessible depuis n'importe quel réseau.",
      },
      {
        title: "Modèle Intégré Conseil & Formation",
        desc: "La formation se fait pendant la mission — l'organisation devient progressivement autonome, sans dépendance externe permanente. La vraie souveraineté.",
      },
    ],
    benefits: ["Équipes autonomes", "Savoir-faire ancré", "Souveraineté progressive", "Écosystème renforcé"],
    deliverables: ["Parcours de formation personnalisé", "Supports pédagogiques complets", "Évaluations & certifications", "Communauté apprenante activée"],
    video: "https://cdn.pixabay.com/video/2024/07/21/222279_large.mp4",
  },
];

export const POLE_I  = SERVICES.filter(s => s.poleN === "I");
export const POLE_II = SERVICES.filter(s => s.poleN === "II");

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug);
}
