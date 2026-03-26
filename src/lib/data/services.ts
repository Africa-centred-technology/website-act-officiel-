/* ══════════════════════════════════════════════════════
   ACT — Services Data (source unique de vérité)
   Mise à jour : fidèle à Présentation_ACT.docx
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
  /** Image principale (hero / intro section) */
  heroImage: string;
  /** Images des sous-services (une par sub, peut en avoir moins) */
  subImages: string[];
}

const ORANGE = "#D35400";
const GOLD   = "#F39C12";

export const SERVICES: Service[] = [
  /* ── 01 ─────────────────────────────────────────────── */
  {
    slug: "ingenierie-logicielle",
    n: "01", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 20% 60%, #0D2040 0%, #050C18 55%, #030810 100%)",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "Ingénierie Logicielle\n& Développement de Solutions\nMétiers & Mobiles",
    tagline: "Des applications qui parlent africain",
    intro: "La transformation digitale et la généralisation du mobile redéfinissent la manière dont les organisations interagissent avec leurs clients et leurs équipes. Pourtant, beaucoup utilisent encore des outils génériques inadaptés à leurs réalités opérationnelles. ACT conçoit des solutions sur mesure en analysant les processus métiers réels, afin de livrer des plateformes performantes, évolutives et alignées sur les contextes africains.",
    subs: [
      {
        title: "Applications Web & Mobiles « African-Ready »",
        desc: "Applications web et mobiles modernes alliant performance, fiabilité et excellence UX. Approche mobile-first avec développement natif Android/iOS et solutions hybrides. Interfaces ergonomiques optimisées pour les réseaux africains, mode hors-ligne intégré.",
      },
      {
        title: "Logiciels Métiers Spécifiques",
        desc: "Solutions sur mesure pour les entreprises et institutions africaines : SIRH conformes OHADA, logiciels de comptabilité, CRM, gestion de projets et de stocks. Chaque solution naît d'une analyse approfondie des processus métiers réels de l'organisation.",
      },
    ],
    benefits: [
      "Efficacité opérationnelle améliorée",
      "Gestion des processus métiers simplifiée",
      "Expérience utilisateur renforcée",
      "Indépendance des systèmes génériques",
      "Plateformes digitales évolutives et performantes",
    ],
    deliverables: [
      "Application livrée & documentée",
      "Formation des équipes techniques",
      "Maintenance & support 12 mois",
      "Tableau de bord de performance",
    ],
    video: "https://cdn.pixabay.com/video/2019/05/06/23355-334950213_large.mp4",
    heroImage: "/images/poles/pole-it.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 02 ─────────────────────────────────────────────── */
  {
    slug: "automatisation-ia",
    n: "02", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 90% at 80% 40%, #0A1F0D 0%, #050C18 55%, #030810 100%)",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    title: "Automatisation\nIntelligente (IA Agentique)",
    tagline: "L'IA qui travaille avec vous",
    intro: "Les organisations gèrent des processus de plus en plus complexes reposant sur des tâches manuelles, des échanges fragmentés et des outils qui ne communiquent pas. Les solutions d'automatisation traditionnelles peinent à gérer des workflows à plusieurs étapes et sources d'information. ACT déploie des architectures d'agents IA qui collaborent pour transformer ces processus manuels en workflows intelligents — sans remplacer l'humain, mais en démultipliant ses capacités.",
    subs: [
      {
        title: "Architectures Multi-Agents",
        desc: "Plusieurs agents IA spécialisés coopèrent pour exécuter un processus métier complet : collecte de données, analyse d'informations, coordination entre services, génération de rapports et déclenchement d'actions automatisées. Gestion de workflows complexes à plusieurs étapes et sources.",
      },
      {
        title: "Traitement Hybride Digital / Papier",
        desc: "Automatisation des flux mixtes grâce à la numérisation, l'OCR et l'extraction automatique d'informations. Formulaires, factures, contrats et dossiers administratifs sont analysés automatiquement et intégrés dans vos workflows numériques sans rupture de chaîne.",
      },
      {
        title: "IA de Soutien (Augmentation Humaine)",
        desc: "L'IA analyse, synthétise et recommande — l'humain supervise et décide. Un assistant avancé qui identifie les tendances, génère des synthèses et prépare l'information pour la prise de décision, sans jamais retirer le professionnel du centre du processus.",
      },
    ],
    benefits: [
      "Traitement des processus accéléré",
      "Tâches manuelles répétitives réduites",
      "Qualité et fiabilité des données améliorées",
      "Coordination inter-services renforcée",
      "Capacité de prise de décision augmentée",
    ],
    deliverables: [
      "Cartographie des processus automatisables",
      "Agents déployés & testés",
      "Tableau de bord de monitoring",
      "Guide de gouvernance IA",
    ],
    video: "https://cdn.pixabay.com/video/2023/07/24/173103-848555583_large.mp4",
    heroImage: "/images/poles/pole-it.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 03 ─────────────────────────────────────────────── */
  {
    slug: "architecture-infrastructure",
    n: "03", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 85% 70% at 60% 80%, #150A2A 0%, #050C18 55%, #030810 100%)",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    title: "Architecture\n& Infrastructure",
    tagline: "Les fondations de votre croissance",
    intro: "Sans fondations solides, vos applications deviennent rapidement difficiles à faire évoluer, coûteuses à maintenir et incapables de suivre la croissance de l'organisation. ACT conçoit des architectures modernes, évolutives et sécurisées combinant architecture logicielle, cloud souverain adapté au contexte africain et conseil stratégique en systèmes d'information — pour transformer la technologie en véritable levier de performance.",
    subs: [
      {
        title: "Architecture Logicielle Évolutive",
        desc: "Architectures basées sur les standards modernes : microservices, event-driven, API-first. Des systèmes modulaires et flexibles qui s'étendent progressivement — de l'administration locale au système national — sans reconstruction majeure. Protège l'investissement technologique tout en préparant la croissance future.",
      },
      {
        title: "Solutions Cloud Souveraines",
        desc: "Adoption cloud alignée sur les réglementations africaines de localisation des données. Architectures hybrides cloud/local pour la conformité réglementaire, migration sans interruption de service. Choix des fournisseurs adapté aux réalités et exigences sectorielles du continent.",
      },
      {
        title: "IT Consulting & Solution Design",
        desc: "Conseil indépendant et orienté résultats : analyses comparatives de solutions, études de faisabilité technique et financière, évaluations TCO sur cycle de vie, recommandations stratégiques. Pour des décisions technologiques éclairées, sans conflit d'intérêt.",
      },
    ],
    benefits: [
      "Investissement technologique protégé",
      "Scalabilité native dès la conception",
      "Conformité réglementaire africaine assurée",
      "Coûts opérationnels maîtrisés",
    ],
    deliverables: [
      "Schéma d'architecture validé",
      "Plan de migration détaillé",
      "Rapport TCO 5 ans",
      "Documentation technique complète",
    ],
    video: "https://cdn.pixabay.com/video/2024/11/05/240062_large.mp4",
    heroImage: "/images/poles/pole-it.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 04 ─────────────────────────────────────────────── */
  {
    slug: "data-intelligence-artificielle",
    n: "04", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 30% 20%, #071A1A 0%, #050C18 55%, #030810 100%)",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Data, Intelligence\nArtificielle & Big Data",
    tagline: "Vos données au service de votre mission",
    intro: "L'Afrique génère chaque jour des volumes considérables de données — transactions mobiles, données agricoles, informations de santé, flux logistiques. Pourtant, une grande partie reste inexploitable, dispersée dans des systèmes cloisonnés ou stockée dans des formats incompatibles. ACT accompagne les organisations dans la mise en place d'écosystèmes data complets couvrant l'ensemble du cycle de vie de la donnée : de la collecte à la valorisation en passant par le déploiement de modèles IA.",
    subs: [
      {
        title: "Data Science & Machine Learning",
        desc: "Modèles analytiques et prédictifs entraînés sur des données africaines, conçus par des équipes africaines : prévision de demande, détection de fraude, segmentation des populations, analyse de l'absentéisme scolaire, prédiction des pannes industrielles. Des résultats pertinents et adaptés aux réalités locales.",
      },
      {
        title: "Data Engineering",
        desc: "Infrastructure technique de collecte et d'exploitation des données : pipelines automatisés, data warehouses, data lakes, systèmes de contrôle qualité, intégration multi-sources (systèmes métiers, capteurs, formulaires, APIs). La base indispensable à toute stratégie data ou IA.",
      },
      {
        title: "Big Data",
        desc: "Architectures Big Data pour les organisations gérant de très grands volumes de données. Déploiement de plateformes basées sur des technologies open source (Hadoop, Spark, Kafka, Elasticsearch) qui traitent et analysent à grande échelle tout en optimisant les coûts d'infrastructure.",
      },
      {
        title: "Intelligence Artificielle",
        desc: "Solutions IA appliquées aux domaines critiques africains : santé (aide au diagnostic), agriculture (recommandations agronomiques), éducation (analyse des performances), finance (détection de fraude, analyse de risque). Chaque solution est conçue selon des principes d'IA responsable : transparence, équité et supervision humaine.",
      },
      {
        title: "Gouvernance de l'IA",
        desc: "Cadres de gouvernance pour une IA maîtrisée : définition des politiques d'usage, mise en place de comités d'éthique, audit et documentation des systèmes IA, formation des dirigeants et équipes à la culture data & IA. Passer d'une gestion intuitive à une gestion pilotée par les données.",
      },
    ],
    benefits: [
      "Données transformées en levier stratégique",
      "Qualité et rapidité de prise de décision améliorées",
      "Opérations optimisées et marchés anticipés",
      "Inefficacités des systèmes fragmentés réduites",
      "Services innovants basés sur la donnée développés",
    ],
    deliverables: [
      "Modèles IA déployés & validés",
      "Pipelines de données automatisés",
      "Dashboard analytics temps réel",
      "Charte IA & gouvernance",
    ],
    video: "https://cdn.pixabay.com/video/2020/01/30/31772-388253161_large.mp4",
    heroImage: "/images/poles/pole-it.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 05 ─────────────────────────────────────────────── */
  {
    slug: "geomatique-sig",
    n: "05", pole: "Ingénierie Technologique", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 80% at 70% 70%, #1A1205 0%, #050C18 55%, #030810 100%)",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    title: "Géomatique\n& Systèmes d'Information\nGéographique",
    tagline: "Connaître son territoire pour le développer",
    intro: "On ne peut pas développer ce qu'on ne connaît pas. De nombreuses institutions africaines prennent encore des décisions d'aménagement, de gestion des ressources ou de planification d'infrastructures avec des informations géographiques incomplètes ou obsolètes. ACT combine technologies de cartographie, SIG et analyse spatiale pour transformer les données géographiques en outils d'aide à la décision — à partir d'imagerie satellitaire, de relevés terrain, de drones et de bases de données géospatiales ouvertes.",
    subs: [
      {
        title: "Cartographie Numérique",
        desc: "Cartes numériques multi-échelles produites à partir d'imagerie satellitaire haute résolution, LiDAR, GPS et drones. Livrées en formats standards (GeoJSON, Shapefile, GeoTIFF). Processus de mise à jour continue — indispensable dans des territoires africains en mutation rapide où les cartes obsolètes coûtent des millions.",
      },
      {
        title: "Systèmes d'Information Géographique (SIG)",
        desc: "Plateformes décisionnelles centralisant, visualisant et analysant les données territoriales croisées avec des données socio-économiques, démographiques, environnementales et infrastructurelles. Aide à répondre aux questions stratégiques : où construire, quelles zones sont à risque, quels territoires ont le meilleur potentiel agricole ou économique.",
      },
    ],
    benefits: [
      "Planification territoriale améliorée",
      "Dynamiques spatiales mieux comprises",
      "Investissements en infrastructures optimisés",
      "Risques environnementaux et climatiques anticipés",
      "Qualité des décisions publiques et stratégiques renforcée",
    ],
    deliverables: [
      "Cartographie numérique haute résolution",
      "Plateforme SIG opérationnelle",
      "Formation des équipes SIG",
      "Protocole de mise à jour des données",
    ],
    video: "https://cdn.pixabay.com/video/2017/07/23/10854-226632941_large.mp4",
    heroImage: "/images/poles/pole-it.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 06 ─────────────────────────────────────────────── */
  {
    slug: "conseil-strategique",
    n: "06", pole: "Conseil & Formation", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 85% 75% at 40% 50%, #1A1708 0%, #050C18 55%, #030810 100%)",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Conseil Stratégique\n& Transformation",
    tagline: "La stratégie avant l'outil",
    intro: "Beaucoup d'organisations africaines cherchent d'abord un logiciel — sans avoir défini pourquoi elles en ont besoin, ce qu'elles veulent changer, ni quel modèle elles visent. Cette approche conduit à des investissements coûteux, mal adoptés et rapidement abandonnés. ACT inverse cette logique : la vision stratégique précède toujours le choix technologique. Ce n'est qu'à l'issue d'un diagnostic de fond que les orientations technologiques sont définies — jamais l'inverse.",
    subs: [
      {
        title: "Conseil Digital & Growth",
        desc: "Audit rigoureux de maturité digitale : analyse des systèmes en place, identification des angles morts et opportunités inexploitées par rapport aux meilleures pratiques sectorielles. Co-construction d'une feuille de route digitale structurée sur mesure — pas un document théorique, mais un véritable outil de pilotage avec jalons, KPIs et indicateurs de succès.",
      },
      {
        title: "Conseil en Digital Transformation Services",
        desc: "Accompagnement complet à la conduite du changement : communication interne, formation des managers, animation de groupes pilotes, gestion des résistances et suivi de l'adoption. Pilotage de projets de transformation de bout en bout avec instances de gouvernance, gestion des risques et tableaux de bord de suivi partagés avec les équipes dirigeantes.",
      },
    ],
    benefits: [
      "Vision stratégique claire avant tout investissement",
      "Transformation digitale adoptée durablement",
      "Investissements technologiques rentabilisés",
      "Pilotage éclairé par des données fiables",
    ],
    deliverables: [
      "Rapport d'audit de maturité digitale",
      "Feuille de route stratégique 3 ans",
      "Plan de conduite du changement",
      "Tableau de bord KPIs",
    ],
    video: "https://cdn.pixabay.com/video/2022/10/31/137265-766326232_large.mp4",
    heroImage: "/images/poles/pole-conseil.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 07 ─────────────────────────────────────────────── */
  {
    slug: "conseil-operationnel",
    n: "07", pole: "Conseil & Formation", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 80% 80% at 75% 30%, #080F1A 0%, #050C18 55%, #030810 100%)",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    title: "Conseil Opérationnel\n& Métier",
    tagline: "Comprendre avant de numériser",
    intro: "Entre la stratégie digitale et le déploiement d'une solution technologique existe un espace critique trop souvent ignoré : l'espace opérationnel. C'est là que vivent les processus métiers réels, les flux d'information et les règles non écrites qui régissent le fonctionnement quotidien. Un processus inefficace numérisé reste un processus inefficace — simplement plus rapide et plus coûteux. ACT optimise l'opérationnel avant de choisir la technologie, en partant du terrain, pas d'une présentation PowerPoint.",
    subs: [
      {
        title: "Business Analysis",
        desc: "Analyse terrain : entretiens avec les équipes opérationnelles, observation des pratiques réelles (pas celles des organigrammes). Cartographie des processus avec outils structurés (BPMN, analyse de flux, chaîne de valeur), identification des inefficacités, redondances et goulots d'étranglement. Cahiers des charges fonctionnels directement exploitables par les équipes techniques.",
      },
      {
        title: "Conseil Opérationnel",
        desc: "Optimisation des processus métiers avant toute numérisation : reconstruction des flux, alignement stratégie–opération–technologie, accompagnement à la mise en œuvre et mesure de l'impact. La technologie amplifie les processus efficaces ; ACT s'assure qu'ils le sont avant de les numériser.",
      },
      {
        title: "Consulting",
        desc: "Expertise opérationnelle transversale : analyse des processus métiers, optimisation de la performance, alignement stratégie–opération–technologie, accompagnement à la mise en œuvre. Des résultats concrets et mesurables sur le terrain, pas des slides.",
      },
    ],
    benefits: [
      "Processus métiers optimisés avant numérisation",
      "Besoins réels identifiés par l'analyse terrain",
      "ROI concret et mesurable",
      "Adoption des outils facilitée",
    ],
    deliverables: [
      "Cartographie BPMN des processus",
      "Cahier des charges fonctionnel",
      "Plan d'optimisation priorisé",
      "Rapport ROI 6 mois",
    ],
    video: "https://cdn.pixabay.com/video/2024/03/01/202560-918431383_large.mp4",
    heroImage: "/images/poles/pole-conseil.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 08 ─────────────────────────────────────────────── */
  {
    slug: "formation-competences",
    n: "08", pole: "Conseil & Formation", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 90% 70% at 25% 75%, #051A0A 0%, #050C18 55%, #030810 100%)",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    title: "Formation\n& Développement\ndes Compétences",
    tagline: "La souveraineté passe par les talents africains",
    intro: "Les meilleurs systèmes tombent en désuétude si personne ne peut les maintenir. La formation n'est pas un service accessoire chez ACT — c'est une condition existentielle de la souveraineté technologique africaine. Il ne s'agit pas d'enseigner à utiliser des outils, mais de former des experts capables de concevoir, d'adapter, d'innover et de transmettre à leur tour. Chaque programme est construit sur un diagnostic préalable des besoins réels, illustré d'exemples africains concrets, avec apprentissage par la pratique sur des données et problématiques issues du secteur de l'organisation.",
    subs: [
      {
        title: "Formation sur Mesure (Présentiel)",
        desc: "Format privilégié d'ACT pour les programmes de transformation : immersion totale, échanges riches, feedback immédiat et dynamique collective. Les équipes développent un langage commun et une culture partagée qui perdure bien au-delà de la formation. Formateurs locaux et internationaux pour un équilibre entre expertise globale et connaissance des réalités africaines.",
      },
      {
        title: "Formation en Ligne",
        desc: "Conçue pour les contraintes africaines : modules légers, smartphone-first, consultables hors-ligne (15–30 min). Plateforme avec forums, sessions live et projets en groupe pour recréer une dynamique communautaire à distance. Les apprenants font partie d'une communauté apprenante africaine — jamais seuls face à leurs écrans.",
      },
      {
        title: "Modèle Intégré Conseil & Formation",
        desc: "La formation se fait pendant la mission, pas avant ou après. Les experts ACT travaillent aux côtés des équipes client, expliquent leurs choix, partagent leurs méthodes, documentent leurs décisions. Résultat : l'organisation obtient une solution qui fonctionne ET ses équipes savent la maintenir et la faire évoluer. Former pour ne plus être indispensable — la marque d'un partenaire de développement authentique.",
      },
    ],
    benefits: [
      "Équipes autonomes et souveraines",
      "Savoir-faire ancré dans les réalités africaines",
      "Souveraineté technologique progressive",
      "Écosystème numérique local renforcé",
    ],
    deliverables: [
      "Parcours de formation personnalisé",
      "Supports pédagogiques complets",
      "Évaluations & certifications",
      "Communauté apprenante activée",
    ],
    video: "https://cdn.pixabay.com/video/2024/07/21/222279_large.mp4",
    heroImage: "/images/poles/pole-formation.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const POLE_I  = SERVICES.filter(s => s.poleN === "I");
export const POLE_II = SERVICES.filter(s => s.poleN === "II");

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug);
}
