export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  categoryColor: string;
  format: string;
  wordCount: string;
  keywords: string[];
  target: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  sections: {
    title?: string;
    content: string;
    list?: string[];
    code?: { lang: string; content: string };
    isConclusion?: boolean;
  }[];
};

export type Category = {
  label: string;
  value: string;
  image?: string;
  description?: string;
};

export const categories: Category[] = [
  { label: "Tous", value: "all" },
  { 
    label: "Tech Trends", 
    value: "tech-trends",
    image: "/blog/ideogram-v3.0_Donne_moi_une_image_simple_qui_passe_avec_ce_titr_L_Afrique_tech_en_2026_de_l_ex-0.jpg",
    description: "Analyses, tendances et décryptages sur la tech africaine",
  },
  { 
    label: "Cloud & Infra", 
    value: "cloud-infra",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Cloud_souverain_en_Afrique_le-0.jpg",
    description: "L'économie numérique mondiale est engagée dans une course à la puissance de calcul",
  },
  { 
    label: "Cybersecurity", 
    value: "cybersecurity",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Cybersécurité_2026_l_ère_d-0.jpg",
    description: "La cybersécurité en 2026 ne se résume plus à des « prédictions » annuelles",
  },
  { 
    label: "Data & IA", 
    value: "data-ia",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_IA_générative_en_entreprise-0.jpg",
    description: "L'intelligence artificielle générative et son impact mesurable sur les entreprises",
  },
  { 
    label: "Africa Focus", 
    value: "africa-focus",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Maroc_hub_numérique_de_l_Afr-0.jpg",
    description: "Hub numérique de l'Afrique : Stratégies et infrastructures numériques",
  },
  { 
    label: "Carrière & Skills", 
    value: "carriere-skills",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Les_10_compétences_tech_les_-0.jpg",
    description: "Le marché de l'emploi tech se transforme rapidement. L'IA ne remplace pas les développeurs",
  },
  { 
    label: "Code & Dev", 
    value: "code-dev",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Cybersécurité_2026_l_ère_d-0.jpg",
    description: "Tutoriels techniques et astuces pour les développeurs et administrateurs systèmes",
  },
  { 
    label: "Digital Strategy", 
    value: "digital-strategy",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_L_IA_en_entreprise_acheter_ou-0.jpg",
    description: "Acheter ou construire des solutions technologiques ? Stratégies d'adoption digitale",
  },
  { 
    label: "Veille Hebdo", 
    value: "veille-hebdo",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Veille_1_—_La_semaine_tech_-0.jpg",
    description: "L'Afrique tech : données de la semaine sur start-up, data centers et investissements",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "afrique-tech-2026-experimentation-maturite",
    title: "L'Afrique tech en 2026 : de l'expérimentation à la maturité",
    category: "Tech Trends",
    categoryColor: "#D35400",
    format: "Article de fond",
    wordCount: "~2 500",
    keywords: ["tech Afrique 2026", "startup africaines", "fintech Afrique", "IA Afrique", "transformation digitale Afrique"],
    target: "DSI, entrepreneurs, investisseurs",
    excerpt: "L'écosystème technologique africain entre dans une nouvelle ère en 2026. Après les corrections de 2023-2024 et la reprise solide de 2025, le continent ne cherche plus à prouver qu'il peut innover — il cherche à prouver qu'il peut scaler durablement.",
    date: "Mars 2026",
    readTime: "10 min",
    image: "/blog/ideogram-v3.0_Donne_moi_une_image_simple_qui_passe_avec_ce_titr_L_Afrique_tech_en_2026_de_l_ex-0.jpg",
    featured: true,
    sections: [
      {
        content: "L'écosystème technologique africain entre dans une nouvelle ère en 2026. Après les corrections de 2023-2024 et la reprise solide de 2025, le continent ne cherche plus à prouver qu'il peut innover — il cherche à prouver qu'il peut scaler durablement. Les startups africaines ont levé 3,42 milliards de dollars en 2025, un record historique. Mais derrière ces chiffres, c'est toute la structure du financement qui a changé : une part croissante de ces levées provient de dette structurée, de titrisation et de financement par créances, plutôt que d'equity venture classique. Un signe de maturité évident.",
      },
      {
        title: "1. La consolidation plutôt que l'expansion",
        content: "L'ère du « Pan-African expansion » où chaque startup recrutait un country manager par pays touche à sa fin. En 2026, les acteurs dominants dans les marchés de premier plan (Nigeria, Kenya, Afrique du Sud, Égypte) forment des oligopoles régionaux en acquérant agressivement leurs concurrents dans les marchés voisins. On observe une hausse de 72% des opérations de M&A en 2025, couplée à une augmentation de 42% des expansions.\n\nCe que cela signifie pour les entreprises africaines : les compétences en intégration post-acquisition, en harmonisation de systèmes IT et en gouvernance multi-pays deviennent des avantages compétitifs décisifs. C'est exactement le type d'accompagnement stratégique qu'un cabinet comme ACT peut fournir.",
      },
      {
        title: "2. L'IA passe du buzz à la production",
        content: "Selon KPMG, 26% des entreprises africaines prévoient d'allouer plus de 20% de leur budget tech à l'IA en 2026, tandis que la cybersécurité reste la priorité numéro un (45% des budgets). La nouveauté, c'est que l'IA ne se limite plus aux chatbots : les agents IA autonomes font leur entrée dans le service client, les RH et la fintech. Environ 69% des entreprises africaines redessinent déjà leurs stratégies autour de la technologie.\n\nMais attention au piège de l'adoption superficielle. Sans investissement massif dans l'énergie et les centres de données locaux, l'Afrique risque de rester un simple consommateur d'outils étrangers plutôt qu'un créateur de solutions. C'est précisément pourquoi la question des data centers souverains est si stratégique.",
      },
      {
        title: "3. La fintech se transforme",
        content: "La fintech africaine vit une mutation profonde. L'application standalone de fintech devient un vestige du passé : le succès en 2026 appartiendra aux entreprises « invisibles » qui construisent l'infrastructure technique pour des secteurs non-tech comme l'agriculture et la logistique.\n\nLa conformité réglementaire n'est plus un frein — c'est un avantage compétitif. Les régulateurs africains deviennent des partenaires actifs, exigeant des normes KYC, AML et de résilience opérationnelle de plus en plus strictes. Les solutions de RegTech qui automatisent la conformité deviennent incontournables pour scaler.",
      },
      {
        title: "4. Le talent, le vrai différenciateur",
        content: "Le marché de l'emploi tech africain se transforme avec l'arrivée d'outils RH dopés à l'IA. La demande explose pour des profils spécialisés en paiements, micro-prêts, gestion de produits digitaux et — fait notable — en semiconducteurs. Le Nigeria investit dans le design de puces fabless et les installations ATMP, un signal fort de la diversification industrielle du continent.",
      },
      {
        title: "Conclusion : ce que les entreprises doivent faire maintenant",
        content: "2026 n'est pas l'année des grandes promesses. C'est l'année de l'exécution pragmatique. Les entreprises africaines qui réussiront sont celles qui investiront dans trois piliers : une infrastructure de données solide, des compétences en IA appliquée, et une gouvernance technologique de qualité. Le potentiel est réel — mais il ne se convertira en valeur que pour ceux qui passent à l'action.",
        isConclusion: true,
      },
    ],
  },
  {
    slug: "agentic-ai-prochaine-revolution",
    title: "Agentic AI : la prochaine révolution technologique, expliquée simplement",
    category: "Tech Trends",
    categoryColor: "#D35400",
    format: "Article de fond",
    wordCount: "~2 200",
    keywords: ["agentic AI", "agents IA autonomes", "IA entreprise 2026", "automatisation intelligente"],
    target: "DSI, développeurs, entrepreneurs tech",
    excerpt: "Si 2024 a été l'année de l'IA générative, et 2025 celle de la désillusion partielle, 2026 est l'année où une nouvelle forme d'IA prend le relais : l'IA agentique — des systèmes capables d'agir de manière autonome pour accomplir des tâches complexes.",
    date: "Mars 2026",
    readTime: "9 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Agentic_AI_la_prochaine_révo-0.jpg",
    featured: true,
    sections: [
      {
        content: "Si 2024 a été l'année de l'IA générative, et 2025 celle de la désillusion partielle (Gartner a officiellement placé la GenAI dans son « trough of disillusionment »), 2026 est l'année où une nouvelle forme d'IA prend le relais : l'IA agentique — ou « Agentic AI ».\n\nQu'est-ce que l'IA agentique ? En termes simples, il s'agit de systèmes d'IA capables d'agir de manière autonome pour accomplir des tâches complexes, avec un minimum d'intervention humaine. Contrairement à un chatbot classique qui répond à une question, un agent IA peut planifier, exécuter une séquence d'actions, interagir avec des outils externes, et s'adapter en temps réel.",
      },
      {
        title: "1. D'où vient l'engouement ?",
        content: "Le rapport de Deloitte « State of AI in the Enterprise 2026 » révèle que les entreprises déploient déjà des agents autonomes dans des fonctions variées. Des exemples concrets émergent dans tous les secteurs :",
        list: [
          "Services financiers : des workflows agentiques capturent automatiquement les actions issues de visioconférences, rédigent des rappels et suivent leur exécution.",
          "Transport aérien : des agents IA gèrent les transactions courantes des clients (rebooking, réacheminement de bagages), libérant les agents humains pour les cas complexes.",
          "Service client : selon Cisco, 56% des interactions de support client impliqueront de l'IA agentique d'ici mi-2026.",
        ],
      },
      {
        title: "2. Comment ça fonctionne concrètement ?",
        content: "Un agent IA se distingue d'un modèle de langage classique par plusieurs caractéristiques clés. En pratique, imaginez un agent chargé de la gestion des commandes dans une entreprise e-commerce marocaine. Quand un client signale un problème de livraison, l'agent peut simultanément vérifier le statut dans le système logistique, contacter le transporteur via API, générer un bon de réexpédition, mettre à jour la base client, et envoyer un email personnalisé — le tout sans intervention humaine.",
        list: [
          "Planification : il décompose une tâche complexe en sous-tâches",
          "Utilisation d'outils : il peut appeler des API, interroger des bases de données, naviguer sur le web",
          "Mémoire : il conserve le contexte des interactions passées",
          "Autonomie : il prend des décisions intermédiaires sans validation humaine à chaque étape",
          "Boucle de feedback : il évalue ses propres résultats et s'ajuste",
        ],
      },
      {
        title: "3. Les limites actuelles",
        content: "Malgré l'enthousiasme, les défis sont réels :",
        list: [
          "Fiabilité : les agents peuvent « halluciner » des actions comme les LLM hallucinent des faits, avec des conséquences potentiellement graves quand ils agissent dans le monde réel.",
          "Sécurité : un agent avec des permissions d'utilisateur humain soulève des questions critiques d'identité et d'accès.",
          "Injection de prompt : des instructions malveillantes cachées dans les données traitées peuvent manipuler le comportement d'un agent.",
          "Gouvernance : qui est responsable quand un agent IA prend une mauvaise décision ?",
        ],
      },
      {
        title: "4. Opportunités pour l'Afrique",
        content: "L'IA agentique représente une opportunité majeure pour les entreprises africaines qui souffrent souvent d'un manque de main-d'œuvre qualifiée dans les fonctions de back-office. Un agent bien configuré peut gérer le support client multilingue (français, anglais, arabe, langues locales), automatiser les processus de conformité réglementaire, et optimiser des chaînes logistiques complexes opérant dans des environnements à infrastructure variable.",
      },
      {
        title: "Conclusion",
        content: "L'IA agentique n'est pas un concept futuriste — elle se déploie maintenant. Pour les entreprises africaines, c'est le moment d'évaluer quels processus métier sont candidats à l'automatisation agentique, d'investir dans la formation des équipes, et de mettre en place une gouvernance IA robuste. Ceux qui attendent risquent de se retrouver avec un fossé d'automatisation impossible à combler.",
        isConclusion: true,
      },
    ],
  },
  {
    slug: "cloud-souverain-afrique-maroc-hub",
    title: "Cloud souverain en Afrique : le Maroc s'impose comme hub stratégique du calcul",
    category: "Cloud & Infra",
    categoryColor: "#D35400",
    format: "Article de fond",
    wordCount: "~2 400",
    keywords: ["cloud souverain Afrique", "data center Maroc", "souveraineté numérique Afrique", "cloud Maroc 2026"],
    target: "DSI, décideurs IT, entrepreneurs",
    excerpt: "L'économie numérique mondiale est engagée dans une course à la puissance de calcul. Dans ce paysage dominé par les hyperscalers, le Maroc se distingue comme l'un des hubs émergents les plus structurés du continent — grâce à une convergence rare d'infrastructures, de géographie et d'énergie renouvelable.",
    date: "Mars 2026",
    readTime: "10 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Cloud_souverain_en_Afrique_le-0.jpg",
    sections: [
      {
        content: "L'économie numérique mondiale est engagée dans une course à la puissance de calcul. Cloud, intelligence artificielle, services financiers en ligne : tout repose sur une infrastructure souvent invisible mais vitale — les data centers. Dans ce paysage dominé par les hyperscalers américains et les investissements massifs en Asie, l'Afrique avance à un rythme soutenu mais part de loin.\n\nSelon le rapport « Data Centres in Africa 2026 » publié par l'Africa Data Centres Association (ADCA), le continent devrait tripler sa capacité d'ici la fin de la décennie. La charge informatique active atteint actuellement 360 MW, avec 238 MW en construction et 656 MW supplémentaires planifiés.",
      },
      {
        title: "1. Pourquoi la souveraineté des données est devenue critique",
        content: "Plus de 40 pays africains disposent désormais de lois sur la protection des données, et une quinzaine ont adopté une stratégie nationale d'IA. L'Union Africaine travaille à harmoniser les standards numériques à travers son cadre de politique des données, poussant vers un « marché unique numérique » continental.\n\nPour les entreprises, les enjeux sont concrets : un ERP qui centralise comptabilité, RH et gestion des stocks hébergé sur un cloud souverain local garantit non seulement la conformité aux régulations locales mais aussi une réduction de latence et une meilleure performance. Sans parler de la protection contre les lois extraterritoriales comme le CLOUD Act américain.",
      },
      {
        title: "2. Le Maroc, carrefour numérique et énergétique",
        content: "Dans cette recomposition, le Maroc se distingue comme l'un des hubs émergents les plus structurés du continent. Plusieurs signaux forts illustrent cette dynamique :",
        list: [
          "Datacenter de 500 MW : annoncé par la ministre de la Transition numérique, alimenté par des énergies renouvelables et s'inscrivant dans la feuille de route « Digital Morocco 2030 ».",
          "Méga Green Data Center « Igoudar » : lancé à Dakhla avec un institut dédié à l'IA et la transition énergétique, alimenté par des énergies propres.",
          "Université Mohammed VI Polytechnique : propose depuis janvier des services d'hébergement cloud aux structures publiques et privées.",
          "Opérateurs comme inwi et N+One : disposent de datacenters à Casablanca, Rabat, Marrakech et étendent leur couverture en Afrique subsaharienne.",
        ],
      },
      {
        title: "3. Les défis qui persistent",
        content: "Malgré ces avancées, des obstacles importants demeurent à l'échelle continentale :",
        list: [
          "Énergie : les pertes de transmission atteignent 25% dans certaines zones urbaines africaines.",
          "Taux d'occupation : hors Afrique du Sud, les taux d'occupation restent proches d'un tiers des capacités disponibles.",
          "Compétences : le manque de personnel qualifié en gestion d'infrastructures critiques et en IA reste un frein majeur.",
          "Connectivité : l'interconnexion inter-africaine doit encore progresser.",
        ],
      },
      {
        title: "4. Stratégie cloud pour les entreprises marocaines",
        content: "Pour les entreprises opérant au Maroc et en Afrique, la stratégie cloud en 2026 devrait combiner :",
        list: [
          "Cloud hybride : associer cloud souverain (données sensibles, applications critiques) et cloud public (workloads moins sensibles, scaling).",
          "Multi-cloud : éviter la dépendance à un seul fournisseur en adoptant des architectures portables (Kubernetes, Terraform).",
          "Data residency : cartographier précisément quelles données doivent rester sur le territoire.",
          "Edge computing : déployer des capacités de calcul en périphérie pour les applications à faible latence.",
        ],
      },
      {
        title: "Conclusion",
        content: "Le data center n'est plus un simple équipement technique. C'est un enjeu géopolitique, énergétique et économique. Le Maroc l'a compris et se positionne comme le pont numérique entre l'Europe et l'Afrique. Pour les entreprises de la région, c'est le moment de repenser leur stratégie cloud en intégrant la souveraineté des données comme un axe stratégique — pas comme une contrainte réglementaire.",
        isConclusion: true,
      },
    ],
  },
  {
    slug: "cybersecurite-2026-instabilite-permanente",
    title: "Cybersécurité 2026 : l'ère de l'instabilité permanente",
    category: "Cybersecurity",
    categoryColor: "#D35400",
    format: "Article de fond",
    wordCount: "~2 300",
    keywords: ["cybersécurité 2026", "Zero Trust", "IA cybersécurité", "menaces cyber Afrique"],
    target: "RSSI, DSI, consultants sécurité, développeurs",
    excerpt: "La cybersécurité en 2026 ne se résume plus à des « prédictions » annuelles. Le paradigme a changé : nous opérons dans un état d'instabilité permanente où les menaces s'adaptent en temps réel, les surfaces d'attaque ne cessent de croître, et l'IA est devenue une arme pour les deux camps.",
    date: "Mars 2026",
    readTime: "9 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Cybersécurité_2026_l_ère_d-0.jpg",
    sections: [
      {
        content: "La cybersécurité en 2026 ne se résume plus à des « prédictions » annuelles sur les nouvelles menaces. Le paradigme a changé fondamentalement : nous ne sommes plus dans un monde avec des périodes de calme entre les tempêtes. Nous opérons dans un état d'instabilité permanente où les menaces s'adaptent en temps réel, les surfaces d'attaque ne cessent de croître, et l'IA est devenue une arme pour les deux camps.\n\nLa surface d'attaque des entreprises a augmenté de plus de 67% depuis 2022 selon TechTarget. Cette expansion est alimentée par la migration cloud, les architectures hybrides, la prolifération des outils IA, et la généralisation du travail à distance.",
      },
      {
        title: "1. L'IA, arme à double tranchant",
        content: "Les attaquants ont pleinement adopté l'IA, créant des menaces plus sophistiquées et plus scalables. Les modèles de langage permettent des campagnes de phishing ultra-convaincantes, personnalisées à grande échelle. Les deepfakes vocaux et vidéo deviennent le vecteur principal d'ingénierie sociale pour accéder aux systèmes critiques.\n\nCôté défense, l'IA transforme les SOC (Security Operations Centers) avec de la détection d'anomalies par machine learning, de la réponse automatisée aux incidents, et du threat hunting prédictif.",
      },
      {
        title: "2. Zero Trust : du concept à la configuration",
        content: "Le modèle Zero Trust — « ne jamais faire confiance, toujours vérifier » — n'est plus une philosophie aspirationnelle. C'est devenu une exigence opérationnelle que la NSA a récemment formalisée en publiant ses « Zero Trust Implementation Guidelines » en janvier 2026.",
        list: [
          "L'identité remplace le réseau comme périmètre de sécurité principal. L'authentification continue, les passkeys et le MFA adaptatif deviennent la norme.",
          "Les identités non-humaines (comptes de service, tokens API, workload identities) dépassent largement les identités humaines en nombre.",
          "La micro-segmentation limite la propagation latérale en cas de compromission.",
          "Les organisations qui implémentent le Zero Trust assisté par IA rapportent 76% de brèches réussies en moins.",
        ],
      },
      {
        title: "3. La conformité comme avantage concurrentiel",
        content: "Les cadres réglementaires se renforcent partout. CMMC 2.0, NIST, NIS2, DORA en Europe, et en Afrique, la multiplication des lois sur la protection des données. Au Maroc, la loi 09-08 sur la protection des personnes physiques à l'égard du traitement des données à caractère personnel structure un cadre de plus en plus exigeant.\n\nLes assureurs cyber demandent désormais des preuves tangibles de préparation proactive et de plans de réponse aux incidents avant d'accorder des couvertures. La conformité n'est plus un coût — c'est un différenciateur commercial.",
      },
      {
        title: "4. Ce que doivent faire les entreprises africaines",
        content: "Les entreprises africaines, souvent en retard sur la maturité cyber, ont une opportunité unique : adopter directement les meilleures pratiques de 2026 sans porter le poids des systèmes legacy.",
        list: [
          "Implémenter une stratégie Zero Trust progressive en commençant par l'inventaire des identités et la mise en place de MFA partout.",
          "Déployer un SIEM moderne comme Wazuh (open-source) pour la détection et la corrélation d'événements de sécurité.",
          "Former les équipes : la sensibilisation ne suffit plus. Chaque collaborateur doit comprendre le phishing IA et les deepfakes.",
          "Préparer la cryptographie post-quantique : les données chiffrées aujourd'hui seront vulnérables demain si elles sont interceptées.",
        ],
      },
      {
        title: "Conclusion",
        content: "En 2026, la cybersécurité passe de la protection à la prédiction. Les entreprises qui intègrent le threat intelligence avec la visibilité sur leur surface d'attaque auront l'agilité nécessaire pour s'adapter plus vite que leurs adversaires. Celles qui ne le font pas feront face à des vulnérabilités qui se cumulent à chaque couche de leur écosystème numérique.",
        isConclusion: true,
      },
    ],
  },
  {
    slug: "ia-generative-entreprise-80-pourcent-sans-impact",
    title: "IA générative en entreprise : pourquoi 80% des organisations ne voient aucun impact mesurable",
    category: "Data & IA",
    categoryColor: "#D35400",
    format: "Article de fond",
    wordCount: "~2 000",
    keywords: ["IA générative entreprise", "ROI intelligence artificielle", "GenAI production", "IA Afrique entreprise"],
    target: "DSI, chefs de projet, consultants",
    excerpt: "Voici le paradoxe central de l'IA générative en 2026 : 88% des organisations utilisent l'IA dans au moins une fonction métier, mais plus de 80% ne rapportent aucun impact mesurable sur leur EBIT. Le ROI est réel — mais il se concentre dans les organisations qui déploient la GenAI au niveau système, pas individuel.",
    date: "Mars 2026",
    readTime: "8 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_IA_générative_en_entreprise-0.jpg",
    sections: [
      {
        content: "Voici le paradoxe central de l'IA générative en 2026 : 88% des organisations utilisent l'IA dans au moins une fonction métier, 71% utilisent régulièrement la GenAI, mais plus de 80% ne rapportent aucun impact mesurable sur leur EBIT. Le ROI moyen est de 3,70$ pour chaque dollar investi — mais ce rendement se concentre dans les organisations qui déploient la GenAI dans plusieurs fonctions métier, pas celles qui s'en tiennent aux pilotes isolés.",
      },
      {
        title: "1. Le problème : l'IA individuelle vs. l'IA d'entreprise",
        content: "Quand la GenAI est devenue largement accessible, beaucoup d'entreprises ont simplement mis Copilot ou ChatGPT à disposition de tous les employés. Le résultat ? Des gains de productivité incrémentaux et essentiellement immesurables : des emails légèrement mieux rédigés, des présentations un peu plus rapides à produire. Utile, mais loin des promesses transformationnelles.\n\nLe vrai changement se produit quand l'IA passe du niveau individuel au niveau système. Cela implique d'intégrer les LLM avec les données de l'entreprise, les workflows existants, et les règles métier spécifiques.",
      },
      {
        title: "2. Les 5 tendances qui redéfinissent l'IA d'entreprise",
        content: "Cinq grandes tendances structurent l'IA d'entreprise en 2026 :",
        list: [
          "Du one-model au multi-model. Les entreprises abandonnent l'approche « un seul modèle pour tout » au profit d'orchestrations sophistiquées combinant plusieurs modèles spécialisés.",
          "L'IA multimodale. En 2026, l'IA générative traite simultanément texte, images, vidéo, audio, données de capteurs et informations géospatiales.",
          "La mémoire d'entreprise. Selon BCG, 70% des échecs IA proviennent d'un manque de contexte et de problèmes de processus, pas de la qualité des modèles.",
          "Les modèles efficients. Des modèles efficaces conçus pour du hardware modeste — cruciale pour l'Afrique.",
          "L'IA souveraine. 66% des entreprises s'inquiètent de leur dépendance à des infrastructures et technologies IA étrangères.",
        ],
      },
      {
        title: "3. Comment passer du pilote à la production",
        content: "Le chemin vers un ROI mesurable de l'IA en entreprise passe par plusieurs étapes concrètes :",
        list: [
          "Auditer sa maturité data : 61% des entreprises admettent que leurs données ne sont pas prêtes pour la GenAI.",
          "Investir dans les pipelines de données : moderniser les flux, consolider les silos dans des data lakes/warehouses.",
          "Acheter plutôt que construire : les entreprises ont basculé d'un ratio 50/50 à 76% d'achat de solutions IA pré-construites.",
          "Former massivement : 48% des employés attribuent un rôle clé à la formation interne dans l'adoption de l'IA.",
          "Mesurer, mesurer, mesurer : définir des KPIs clairs avant de lancer un projet IA.",
        ],
      },
      {
        title: "Conclusion",
        content: "L'investissement mondial dans les solutions d'IA générative a plus que triplé entre 2024 et 2025, atteignant environ 37 milliards de dollars. Les organisations qui réussiront sont celles qui traiteront la GenAI non pas comme un projet IT, mais comme un système d'exploitation central de leur activité — avec la rigueur, la gouvernance et l'investissement humain que cela implique.",
        isConclusion: true,
      },
    ],
  },
  {
    slug: "maroc-hub-numerique-afrique-data-centers",
    title: "Maroc, hub numérique de l'Afrique : la stratégie des data centers décryptée",
    category: "Africa Focus",
    categoryColor: "#D35400",
    format: "Cas pratique",
    wordCount: "~1 800",
    keywords: ["data center Maroc", "Dakhla data center", "Digital Morocco 2030", "infrastructure numérique Maroc"],
    target: "Décideurs, entrepreneurs, investisseurs",
    excerpt: "En mars 2026, le Maroc n'est plus seulement un pays qui parle de transformation digitale — il la construit physiquement. Avec le lancement du méga Green Data Center « Igoudar » à Dakhla et l'annonce d'un datacenter de 500 MW alimenté en renouvelables, le Royaume accumule les signaux d'une stratégie numérique ambitieuse et cohérente.",
    date: "Mars 2026",
    readTime: "7 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Maroc_hub_numérique_de_l_Afr-0.jpg",
    sections: [
      {
        content: "En mars 2026, le Maroc n'est plus seulement un pays qui parle de transformation digitale — il la construit physiquement. Avec le lancement du méga Green Data Center « Igoudar » à Dakhla, l'ouverture des services cloud de l'Université Mohammed VI Polytechnique, et l'annonce d'un datacenter de 500 MW alimenté en renouvelables, le Royaume accumule les signaux d'une stratégie numérique ambitieuse et cohérente.",
      },
      {
        title: "1. Les atouts structurels du Maroc",
        content: "Le Maroc dispose d'une combinaison d'avantages difficile à répliquer :",
        list: [
          "Position géographique : à la croisée des flux Europe-Afrique, le Maroc est le point de passage naturel pour la connectivité intercontinentale.",
          "Énergie renouvelable : avec des objectifs ambitieux en solaire et éolien, le pays peut alimenter des data centers de manière durable.",
          "Maturité réglementaire : la loi 09-08, le cadre de la CNDP, et la stratégie « Digital Morocco 2030 » offrent une clarté juridique.",
          "Écosystème existant : des acteurs comme inwi (6 datacenters), N+One (leader national), et Maroc Datacenter structurent déjà le marché.",
        ],
      },
      {
        title: "2. Dakhla : le pari de l'énergie propre",
        content: "Le lancement du data center « Igoudar » à Dakhla, couplé à l'Institut « Jazari » dédié à l'IA et la transition énergétique, illustre une stratégie où infrastructure numérique et souveraineté énergétique avancent de concert. Dakhla, avec son potentiel éolien et solaire exceptionnel, offre un coût énergétique imbattable pour alimenter des serveurs 24/7.\n\nCe choix géographique est aussi un signal diplomatique et économique : en développant le Sahara marocain comme pôle d'innovation, le Royaume démontre que la périphérie peut devenir le centre quand on y investit dans les bonnes infrastructures.",
      },
      {
        title: "3. Le cloud hybride comme stratégie nationale",
        content: "La feuille de route « Digital Morocco 2030 » promeut un modèle de cloud hybride permettant de répondre à tous les besoins :",
        list: [
          "Données sensibles (gouvernement, santé, finance) → cloud souverain hébergé localement",
          "Applications standards (bureautique, CRM, collaboration) → cloud public (Azure, AWS, GCP)",
          "Charges IA (entraînement, inférence) → infrastructure spécialisée locale quand disponible",
        ],
      },
      {
        title: "Conclusion",
        content: "Le Maroc transforme progressivement sa vision numérique en réalité physique. Les data centers ne sont pas une fin en soi — ils sont le fondement sur lequel se construisent les services cloud, l'IA, et toute l'économie numérique. En se positionnant comme carrefour stratégique entre l'Europe et l'Afrique, le Maroc crée les conditions pour que la prochaine génération d'entreprises tech africaines naisse et scale depuis le continent.",
        isConclusion: true,
      },
    ],
  },
  {
    slug: "10-competences-tech-afrique-2026",
    title: "Les 10 compétences tech les plus demandées en Afrique en 2026",
    category: "Carrière & Skills",
    categoryColor: "#D35400",
    format: "Article pratique",
    wordCount: "~1 500",
    keywords: ["compétences tech Afrique 2026", "emploi développeur Afrique", "carrière tech", "skills tech demandés"],
    target: "Étudiants, développeurs juniors, personnes en reconversion",
    excerpt: "Le marché de l'emploi tech en Afrique se transforme rapidement. L'IA ne remplace pas les développeurs — elle change ce qu'on attend d'eux. Voici les 10 compétences les plus demandées en 2026, basées sur les tendances de recrutement et les besoins du marché.",
    date: "Mars 2026",
    readTime: "6 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Les_10_compétences_tech_les_-0.jpg",
    sections: [
      {
        content: "Le marché de l'emploi tech en Afrique se transforme rapidement. L'IA ne remplace pas les développeurs — elle change ce qu'on attend d'eux. Voici les 10 compétences les plus demandées en 2026, basées sur les tendances de recrutement et les besoins du marché.",
      },
      {
        title: "Le classement",
        content: "Ces compétences représentent les domaines à fort potentiel sur le marché africain en 2026 :",
        list: [
          "Cloud & DevOps (Kubernetes, Terraform, CI/CD) — Avec le boom des data centers africains, les profils capables de gérer des infrastructures cloud à l'échelle sont extrêmement recherchés.",
          "Cybersécurité (Zero Trust, SOC, Pentest) — 45% des budgets tech africains sont alloués à la cybersécurité. La demande dépasse massivement l'offre, créant des salaires premium.",
          "IA & Machine Learning (Python, PyTorch, MLOps) — Les entreprises cherchent des profils capables de mettre des modèles en production et de les maintenir.",
          "Développement Full Stack (React/Next.js + Django/Node.js) — La base reste indispensable. Les startups africaines en scaling cherchent des développeurs capables de livrer vite.",
          "Data Engineering (dbt, Airflow, Spark) — Les data engineers sont le chaînon manquant entre les données et les décisions.",
          "Prompt Engineering & IA appliquée — Savoir utiliser et orchestrer des modèles d'IA générative est devenu une compétence transversale valorisée dans tous les métiers.",
          "Développement Mobile (React Native, Flutter) — L'Afrique est mobile-first. Les applications natives et cross-platform restent un marché immense.",
          "ERP & Solutions métier (Odoo, SAP) — Les profils mixtes (technique + compréhension métier) sont rares et très demandés.",
          "Blockchain & Fintech — Avec la croissance des paiements numériques, de la DeFi et des MVNO, les développeurs spécialisés en fintech ont un marché naturel en Afrique.",
          "Gestion de produit tech (Product Management) — Savoir transformer un besoin métier en produit digital scalable est une compétence de plus en plus valorisée.",
        ],
      },
    ],
  },
  {
    slug: "tutoriel-siem-wazuh-30-minutes",
    title: "Tutoriel : Déployer un SIEM open-source avec Wazuh en 30 minutes",
    category: "Code & Dev",
    categoryColor: "#D35400",
    format: "Tutoriel technique",
    wordCount: "~2 000",
    keywords: ["Wazuh tutoriel", "SIEM open source", "installer Wazuh", "SOC open source", "cybersécurité tutoriel"],
    target: "Développeurs, admins systèmes, étudiants cybersécurité",
    excerpt: "Mettre en place un SOC peut sembler hors de portée pour les PME africaines. Mais avec Wazuh, une plateforme SIEM/XDR 100% open-source, vous pouvez déployer un système de détection et de réponse aux menaces en moins de 30 minutes.",
    date: "Mars 2026",
    readTime: "8 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Cybersécurité_2026_l_ère_d-0.jpg",
    sections: [
      {
        content: "Mettre en place un SOC (Security Operations Center) peut sembler hors de portée pour les PME africaines. Mais avec Wazuh, une plateforme SIEM/XDR 100% open-source, vous pouvez déployer un système de détection et de réponse aux menaces en moins de 30 minutes. Ce tutoriel vous guide pas à pas.",
      },
      {
        title: "Prérequis",
        content: "Avant de commencer, assurez-vous d'avoir :",
        list: [
          "Un serveur Linux (Ubuntu 22.04 LTS recommandé) avec minimum 4 Go de RAM et 2 vCPU",
          "Un accès root ou sudo",
          "Une connexion internet stable",
        ],
      },
      {
        title: "Étape 1 : Installer Wazuh avec le script automatisé",
        content: "Wazuh fournit un script d'installation tout-en-un qui déploie le manager, l'indexer et le dashboard. Le flag `-a` installe tous les composants sur une seule machine (idéal pour un lab ou une PME). L'installation prend environ 10-15 minutes.",
        code: {
          lang: "bash",
          content: `curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh
sudo bash wazuh-install.sh -a`,
        },
      },
      {
        title: "Étape 2 : Accéder au dashboard",
        content: "Ouvrez votre navigateur et accédez à `https://VOTRE_IP` (port 443). Connectez-vous avec les identifiants générés. Vous devriez voir le dashboard Wazuh avec les onglets Security Events, Integrity Monitoring, Vulnerabilities et Compliance.",
      },
      {
        title: "Étape 3 : Ajouter un agent",
        content: "Sur la machine à surveiller (Linux, Windows ou macOS), installez l'agent Wazuh. L'agent se connecte automatiquement au manager et commence à envoyer des événements de sécurité.",
        code: {
          lang: "bash",
          content: `# Sur Ubuntu/Debian
curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh
sudo WAZUH_MANAGER="IP_DU_SERVEUR" bash wazuh-install.sh -agent`,
        },
      },
      {
        title: "Étape 4 : Activer la détection de vulnérabilités",
        content: "Wazuh inclut plus de 3 000 règles prédéfinies couvrant la détection d'intrusion, le monitoring d'intégrité des fichiers, la détection de vulnérabilités et la conformité réglementaire.",
        code: {
          lang: "xml",
          content: `<!-- Dans /var/ossec/etc/ossec.conf sur le manager -->
<vulnerability-detector>
  <enabled>yes</enabled>
  <interval>5m</interval>
  <run_on_start>yes</run_on_start>
</vulnerability-detector>`,
        },
      },
      {
        title: "Étape 5 : Créer une alerte personnalisée",
        content: "Exemple : détecter les connexions SSH échouées répétées (brute force) :",
        code: {
          lang: "xml",
          content: `<rule id="100001" level="10">
  <if_matched_sid>5710</if_matched_sid>
  <same_source_ip />
  <frequency>5</frequency>
  <timeframe>120</timeframe>
  <description>Possible SSH brute force: 5+ échecs en 2 minutes</description>
</rule>`,
        },
      },
      {
        title: "Résultat",
        content: "En 30 minutes, vous disposez d'un SIEM fonctionnel qui surveille vos systèmes, détecte les vulnérabilités, et vous alerte en temps réel. C'est un premier pas solide vers une posture de sécurité professionnelle — sans budget prohibitif.",
      },
      {
        title: "Pour aller plus loin",
        content: "Continuez à renforcer votre posture de sécurité avec ces étapes :",
        list: [
          "Ajoutez des agents sur tous vos serveurs et postes critiques",
          "Configurez le monitoring d'intégrité des fichiers (FIM) pour détecter les modifications suspectes",
          "Intégrez Wazuh avec un SOAR (ex: Shuffle) pour automatiser les réponses",
          "Explorez les modules de conformité PCI-DSS et RGPD intégrés",
        ],
        isConclusion: true,
      },
    ],
  },
  {
    slug: "ia-entreprise-acheter-ou-construire-2026",
    title: "L'IA en entreprise : acheter ou construire ? Le dilemme de 2026",
    category: "Digital Strategy",
    categoryColor: "#D35400",
    format: "Analyse",
    wordCount: "~1 500",
    keywords: ["IA entreprise buy vs build", "stratégie IA", "adoption IA", "IA PME Afrique"],
    target: "DSI, CTO, dirigeants d'entreprise",
    excerpt: "Il y a deux ans, la sagesse conventionnelle disait que les grandes entreprises construiraient la plupart de leurs systèmes IA en interne. En 2026, les entreprises achètent désormais 76% de leurs solutions IA. Qu'est-ce qui a changé — et quelle est la bonne stratégie pour les entreprises africaines ?",
    date: "Mars 2026",
    readTime: "6 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_L_IA_en_entreprise_acheter_ou-0.jpg",
    sections: [
      {
        content: "Il y a deux ans, la sagesse conventionnelle disait que les grandes entreprises construiraient la plupart de leurs systèmes IA en interne, adaptés à leurs propres données. En 2026, la réalité est très différente : les entreprises achètent désormais 76% de leurs solutions IA, contre un ratio 50/50 en 2024. Qu'est-ce qui a changé ?",
      },
      {
        title: "Pourquoi le \"buy\" l'emporte",
        content: "Trois facteurs expliquent ce basculement :",
        list: [
          "La rapidité. Les produits IA pré-construits atteignent la production bien plus vite que les développements internes. Pour une PME marocaine ou une startup nigériane, attendre 6-12 mois n'est simplement pas viable.",
          "La complexité. Construire un système d'IA fiable en production requiert des compétences en ML engineering, MLOps, sécurité, et gouvernance que peu d'organisations possèdent en interne.",
          "La maturité des solutions. Des plateformes comme Claude Enterprise, ChatGPT Enterprise et Microsoft Copilot proposent des intégrations avec les bases de connaissances existantes.",
        ],
      },
      {
        title: "Quand construire malgré tout ?",
        content: "Le \"build\" reste pertinent dans certains cas spécifiques :",
        list: [
          "Quand les données sont hautement confidentielles et ne peuvent pas quitter l'infrastructure (secteur défense, certains usages médicaux)",
          "Quand l'avantage compétitif repose sur un modèle propriétaire (un algorithme de scoring crédit spécifique au marché africain, par exemple)",
          "Quand les solutions du marché ne couvrent pas le cas d'usage spécifique (langues locales, contextes réglementaires particuliers)",
        ],
      },
      {
        title: "L'approche hybride recommandée",
        content: "Pour la majorité des entreprises africaines, l'approche optimale en 2026 est hybride :",
        list: [
          "Acheter les solutions GenAI d'usage général (productivité, support client, génération de contenu)",
          "Personnaliser avec du RAG (Retrieval-Augmented Generation) en connectant les LLM achetés à ses propres données",
          "Construire uniquement les composants qui constituent un avantage concurrentiel différenciant",
        ],
      },
      {
        title: "Conclusion",
        content: "Le dilemme \"buy vs build\" n'est pas une question technologique — c'est une question stratégique. La bonne réponse dépend de votre secteur, de votre maturité data, et de votre positionnement concurrentiel. Ce qui est certain, c'est que rester en mode « évaluation » pendant que vos concurrents passent en production n'est plus une option viable.",
        isConclusion: true,
      },
    ],
  },
  {
    slug: "veille-hebdo-1-mars-2026",
    title: "Veille #1 — La semaine tech en 7 minutes | Mars 2026",
    category: "Veille Hebdo",
    categoryColor: "#D35400",
    format: "Veille hebdomadaire",
    wordCount: "~700",
    keywords: ["veille tech Afrique", "newsletter tech mars 2026", "actualité IA Afrique"],
    target: "Tous les lecteurs du blog",
    excerpt: "L'Afrique triple sa capacité en data centers, le paradoxe GenAI persiste malgré un taux d'adoption record, et les startups africaines lèvent 575M$ en janvier-février 2026. Votre dose d'info tech de la semaine, condensée en 7 minutes.",
    date: "Mars 2026",
    readTime: "7 min",
    image: "/blog/lucid-origin_Donne_moi_une_image_simple_qui_passe_avec_ce_titre_Veille_1_—_La_semaine_tech_-0.jpg",
    sections: [
      {
        title: "🔥 À la une",
        content: "L'Afrique triple sa capacité en data centers. Le rapport ADCA 2026 confirme que le continent passera de 360 MW actuels à 1,2 GW d'ici 2030. Le Maroc se positionne comme hub stratégique avec le lancement du Green Data Center de Dakhla et l'annonce d'un datacenter de 500 MW en renouvelables.",
      },
      {
        title: "🤖 IA & Data",
        content: "Les grandes nouvelles de l'IA cette semaine :",
        list: [
          "Deloitte publie « State of AI in the Enterprise 2026 » : 39% des entreprises ont de l'IA en production à grande échelle (contre 24% l'an dernier).",
          "Le paradoxe GenAI persiste : malgré 88% d'adoption, plus de 80% des entreprises ne voient aucun impact mesurable sur leur EBIT.",
          "IBM annonce l'ère des modèles efficients : en 2026, les modèles légers coexistent avec les modèles frontière. Bonne nouvelle pour l'Afrique.",
        ],
      },
      {
        title: "🔒 Cybersécurité",
        content: "Les actualités sécurité de la semaine :",
        list: [
          "NSA publie ses Zero Trust Implementation Guidelines (Phase 2) — Un framework détaillé pour implémenter le Zero Trust de manière progressive.",
          "Les deepfakes deviennent le vecteur n°1 d'ingénierie sociale pour accéder aux systèmes critiques.",
        ],
      },
      {
        title: "🌍 Africa Focus",
        content: "L'écosystème tech africain en bref :",
        list: [
          "Startups africaines : 575M$ levés en janvier-février 2026, en hausse de 26,5% par rapport à la même période en 2025.",
          "MTN au Mobile World Congress : expansion vers les services digitaux (gaming, musique), les data centers et le mobile money.",
          "Nigeria et semiconducteurs : le pays investit dans le design de puces fabless et les installations ATMP.",
        ],
      },
      {
        title: "💡 Ressource de la semaine",
        content: "Le rapport gratuit « Data Centres in Africa 2026 » par l'ADCA et Rising Advisory. Indispensable pour comprendre les dynamiques d'infrastructure sur le continent.",
        isConclusion: true,
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "all") return blogPosts;
  return blogPosts.filter((p) =>
    p.category.toLowerCase().replace(/[& ]/g, "-") === category ||
    p.category === category
  );
}
