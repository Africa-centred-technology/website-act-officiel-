
export interface Module {
  module: string;
  details: string[];
}

export interface Formation {
  id: string;
  slug: string;
  title: string;
  secteur: string;
  categorie: string;
  niveau: string;
  duree: string;
  format: string;
  parcours?: string;
  accroche: string;
  publicCible: string;
  prerequis: string;
  objectifs: string[];
  programme: Module[];
  livrables: string[];
  methode: string;
}

export const FORMATIONS: Formation[] = [
  {
    "id": "01_ia_productivite_quotidienne",
    "slug": "ia-productivite-quotidienne",
    "title": "Intégrer l'IA dans sa pratique professionnelle",
    "secteur": "Transversal — tous métiers",
    "categorie": "Intelligence artificielle",
    "niveau": "Initiation",
    "duree": "1 journée (7h)",
    "format": "Présentiel ou distanciel",
    "accroche": "L'IA est déjà dans vos outils. La vraie question n'est plus de savoir si vous devez l'utiliser, mais comment en tirer un avantage réel — sans perdre du temps à tâtonner.",
    "publicCible": "Tout professionnel souhaitant intégrer concrètement les outils d'IA dans son quotidien de travail, quel que soit son secteur ou son niveau technique.",
    "prerequis": "Aucun prérequis technique. Une curiosité pour les outils numériques suffit.",
    "objectifs": [
      "Comprendre ce que l'IA générative peut — et ne peut pas — faire dans un contexte professionnel",
      "Identifier les cas d'usage pertinents dans son propre métier",
      "Utiliser les principaux outils IA disponibles (ChatGPT, Claude, Copilot, Gemini…)",
      "Rédiger des instructions efficaces pour obtenir des résultats exploitables",
      "Évaluer et valider les sorties de l'IA avec un regard critique",
      "Construire une routine de travail intégrant l'IA de manière durable"
    ],
    "programme": [
      {
        "module": "Module 1 — Comprendre l'IA générative (1h)",
        "details": [
          "Qu'est-ce que l'IA générative ? Démystifier sans simplifier",
          "Les grands modèles de langage : comment fonctionnent-ils réellement ?",
          "Ce que l'IA fait bien, ce qu'elle fait mal, ce qu'elle invente",
          "Panorama des outils disponibles en 2024–2025"
        ]
      },
      {
        "module": "Module 2 — Identifier ses propres cas d'usage (1h30)",
        "details": [
          "Cartographie des tâches chronophages dans son quotidien professionnel",
          "Quelles tâches déléguer à l'IA, lesquelles garder pour soi",
          "Exercice : audit de ses activités hebdomadaires et potentiel IA"
        ]
      },
      {
        "module": "Module 3 — Prendre en main les outils essentiels (2h)",
        "details": [
          "Prise en main guidée de ChatGPT, Claude et Microsoft Copilot",
          "Rédaction, résumé, reformulation, traduction, analyse de documents",
          "Traitement d'emails, comptes-rendus, rapports, présentations",
          "Atelier pratique sur les fichiers réels des participants"
        ]
      },
      {
        "module": "Module 4 — Formuler des instructions efficaces (1h30)",
        "details": [
          "Principes de base du prompt engineering appliqué au quotidien",
          "Structure d'une bonne instruction : contexte, rôle, tâche, format",
          "Exercices progressifs : du prompt basique au prompt structuré",
          "Les erreurs classiques et comment les éviter"
        ]
      },
      {
        "module": "Module 5 — Construire sa routine IA (1h)",
        "details": [
          "Plan d'action individuel : 3 usages à intégrer dès la semaine suivante",
          "Évaluer la qualité d'une réponse IA avant de l'utiliser",
          "Limites légales et éthiques à connaître",
          "Ressources pour continuer à progresser"
        ]
      }
    ],
    "livrables": [
      "Un plan d'intégration personnalisé (3 usages concrets dans votre métier)",
      "Une bibliothèque de prompts prêts à l'emploi selon votre profil",
      "Un accès aux ressources et outils présentés pendant la formation",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation 100% pratique. Chaque concept est immédiatement suivi d'un exercice sur poste. Les participants travaillent sur leurs propres documents et cas réels tout au long de la journée."
  },
  {
    "id": "02_prompt_engineering",
    "slug": "prompt-engineering",
    "title": "Maîtriser le Prompt Engineering",
    "secteur": "Transversal — tous métiers",
    "categorie": "Intelligence artificielle",
    "niveau": "Intermédiaire",
    "duree": "1 journée (7h)",
    "format": "Présentiel ou distanciel",
    "accroche": "Le vrai pouvoir n'est pas dans l'IA. Il est dans la question. Savoir formuler une instruction précise, c'est la compétence qui sépare ceux qui obtiennent des résultats médiocres de ceux qui obtiennent des résultats exploitables — avec le même outil.",
    "publicCible": "Professionnels utilisant déjà l'IA au quotidien et souhaitant passer du niveau \"ça marche parfois\" au niveau \"je sais exactement comment obtenir ce que je veux\".",
    "prerequis": "Avoir déjà utilisé un outil d'IA générative (ChatGPT, Claude, Gemini ou autre) au moins occasionnellement.",
    "objectifs": [
      "Comprendre pourquoi la formulation d'une instruction détermine la qualité du résultat",
      "Appliquer les techniques de prompt engineering les plus efficaces",
      "Construire des prompts complexes, structurés et réutilisables",
      "Créer des templates de prompts adaptés à son métier",
      "Automatiser des séquences d'instructions pour des tâches récurrentes",
      "Évaluer et itérer sur ses prompts pour améliorer progressivement les résultats"
    ],
    "programme": [
      {
        "module": "Module 1 — Pourquoi la formulation compte (45min)",
        "details": [
          "Comment le modèle interprète une instruction",
          "Le lien entre ambiguïté du prompt et variabilité du résultat",
          "Démo : même tâche, trois formulations différentes, trois résultats radicalement différents"
        ]
      },
      {
        "module": "Module 2 — Les fondamentaux du prompt engineering (1h30)",
        "details": [
          "Les composantes d'un prompt efficace : rôle, contexte, tâche, contraintes, format",
          "Techniques de base : zero-shot, few-shot, chain-of-thought",
          "Instructions négatives : dire à l'IA ce qu'elle ne doit pas faire",
          "Atelier : transformer 10 prompts faibles en prompts performants"
        ]
      },
      {
        "module": "Module 3 — Techniques avancées (2h)",
        "details": [
          "Prompts en chaîne : décomposer une tâche complexe en étapes",
          "Personas et rôles : faire jouer un rôle à l'IA pour des résultats spécialisés",
          "Prompts conditionnels et arborescents",
          "Itération et affinement : dialoguer avec l'IA pour converger vers le résultat souhaité",
          "Atelier : construire une séquence de prompts pour un cas complexe de son métier"
        ]
      },
      {
        "module": "Module 4 — Construire sa bibliothèque de prompts (1h30)",
        "details": [
          "Structure d'un template de prompt réutilisable",
          "Organisation et documentation de sa bibliothèque personnelle",
          "Partage et standardisation en équipe",
          "Atelier : chaque participant construit 5 templates pour ses cas d'usage réels"
        ]
      },
      {
        "module": "Module 5 — Limites, biais et vigilance (1h)",
        "details": [
          "Les hallucinations : comprendre pourquoi elles arrivent et comment les détecter",
          "Les biais des modèles et leur impact sur les résultats",
          "Quand ne pas faire confiance à l'IA même avec un bon prompt",
          "Bonnes pratiques de validation des sorties"
        ]
      },
      {
        "module": "Module 6 — Mise en pratique finale (1h15)",
        "details": [
          "Défi en binômes : résoudre un cas métier réel avec uniquement du prompt engineering",
          "Présentation et critique croisée des résultats",
          "Synthèse et plan d'action individuel"
        ]
      }
    ],
    "livrables": [
      "Une bibliothèque personnelle de 5 à 10 templates de prompts prêts à l'emploi",
      "Un guide de référence des techniques couvertes pendant la formation",
      "Un système d'organisation et de documentation de ses prompts",
      "Une attestation de participation ACT"
    ],
    "methode": "Alternance entre démonstrations en direct et ateliers pratiques. Les participants travaillent sur leurs propres cas métier tout au long de la journée. Chaque technique est d'abord montrée, puis immédiatement appliquée."
  },
  {
    "id": "03_ia_ethique_responsabilite",
    "slug": "ia-ethique-responsabilite",
    "title": "IA, Biais et Responsabilité",
    "secteur": "Transversal — tous métiers",
    "categorie": "Intelligence artificielle",
    "niveau": "Initiation à intermédiaire",
    "duree": "2h30 — 3h (demi-journée)",
    "format": "Présentiel ou distanciel",
    "accroche": "L'enthousiasme autour de l'IA est légitime. Mais adopter un outil sans comprendre ses limites, ses biais et ses implications, c'est naviguer sans carte. Cette formation donne les repères que personne ne vous a encore donnés.",
    "publicCible": "Tout professionnel souhaitant avoir une vision lucide et éclairée de l'IA — ses possibilités réelles, ses risques concrets, et ses enjeux éthiques dans un contexte professionnel.",
    "prerequis": "Aucun prérequis technique.",
    "objectifs": [
      "Distinguer les promesses réelles de l'IA de ses limites effectives",
      "Identifier les principaux risques liés à l'usage professionnel de l'IA",
      "Reconnaître les biais algorithmiques et leurs conséquences pratiques",
      "Situer les enjeux juridiques et réglementaires actuels (RGPD, AI Act…)",
      "Adopter une posture critique et responsable dans ses usages quotidiens",
      "Participer à l'élaboration d'une politique d'usage de l'IA dans son organisation"
    ],
    "programme": [
      {
        "module": "Module 1 — Ce que l'IA est vraiment (45min)",
        "details": [
          "Derrière le mot \"intelligence\" : ce que les modèles font réellement",
          "Hallucinations, confabulations et fausses certitudes : comprendre le phénomène",
          "La différence entre comprendre et prédire",
          "Démo en direct : l'IA qui invente avec assurance"
        ]
      },
      {
        "module": "Module 2 — Les biais au cœur des modèles (45min)",
        "details": [
          "D'où viennent les biais : données d'entraînement, choix de conception, renforcement",
          "Biais de genre, de culture, de langue : exemples concrets et documentés",
          "Impact des biais dans des décisions professionnelles réelles (recrutement, crédit, santé)",
          "Comment détecter un biais dans une réponse IA"
        ]
      },
      {
        "module": "Module 3 — Enjeux juridiques et réglementaires (30min)",
        "details": [
          "RGPD et données personnelles : ce qui est interdit, ce qui est toléré",
          "L'AI Act européen : les grandes obligations à connaître",
          "Propriété intellectuelle : à qui appartient ce que produit l'IA ?",
          "Responsabilité en cas d'erreur : qui répond de quoi ?"
        ]
      },
      {
        "module": "Module 4 — Construire un usage responsable (30min)",
        "details": [
          "Les bonnes pratiques à adopter immédiatement",
          "Ce qu'il ne faut jamais confier à une IA sans vérification",
          "Vers une charte d'usage de l'IA en organisation : éléments clés",
          "Discussion collective : nos propres pratiques, nos propres risques"
        ]
      }
    ],
    "livrables": [
      "Un guide de référence sur les risques et bonnes pratiques",
      "Une checklist de vigilance avant d'utiliser une sortie IA en contexte professionnel",
      "Les bases pour initier une politique d'usage responsable dans son organisation",
      "Une attestation de participation ACT"
    ],
    "methode": "Format conférence-atelier avec échanges nourris. Exemples concrets et cas réels tout au long de la session. Discussion collective encouragée pour ancrer les apprentissages dans le quotidien des participants."
  },
  {
    "id": "04_automatisation_no_code",
    "slug": "automatisation-no-code",
    "title": "Automatisation intelligente avec l'IA",
    "secteur": "Transversal — tous métiers",
    "categorie": "Intelligence artificielle",
    "niveau": "Intermédiaire",
    "duree": "2 journées (14h)",
    "format": "Présentiel ou distanciel",
    "accroche": "Automatiser n'est pas paresser — c'est choisir où mettre son intelligence. Vos tâches répétitives consomment un temps précieux que l'IA peut récupérer pour vous. Sans écrire une seule ligne de code.",
    "publicCible": "Professionnels souhaitant automatiser des tâches récurrentes et construire des flux de travail intelligents, sans compétences en développement.",
    "prerequis": "Être à l'aise avec les outils numériques du quotidien (email, tableur, outils cloud). Avoir une première expérience avec l'IA générative est un plus.",
    "objectifs": [
      "Identifier les processus de son activité automatisables avec l'IA",
      "Concevoir et déployer des workflows automatisés avec des outils no-code",
      "Connecter des applications entre elles sans développement technique",
      "Intégrer l'IA générative dans ses automatisations pour des traitements intelligents",
      "Tester, déboguer et maintenir ses automatisations de manière autonome",
      "Évaluer le retour sur investissement d'une automatisation"
    ],
    "programme": [
      {
        "module": "Jour 1 — Concevoir et construire ses premiers workflows",
        "details": []
      },
      {
        "module": "Module 1 — La logique de l'automatisation (1h)",
        "details": [
          "Qu'est-ce qu'un workflow automatisé ?",
          "Identifier les processus à fort potentiel d'automatisation",
          "Les outils du marché : Make, n8n, Zapier — comparaison et choix selon les usages",
          "La notion de déclencheur, d'action et de condition"
        ]
      },
      {
        "module": "Module 2 — Prise en main de l'outil (2h)",
        "details": [
          "Interface et logique de Make (outil principal de la formation)",
          "Créer son premier scénario : connecter deux applications",
          "Déclencheurs : email, formulaire, agenda, webhook",
          "Actions : créer, modifier, envoyer, notifier",
          "Atelier guidé : automatisation d'un processus simple pas-à-pas"
        ]
      },
      {
        "module": "Module 3 — Travailler avec les données (2h)",
        "details": [
          "Manipuler et transformer des données dans un workflow",
          "Conditions, filtres et branchements",
          "Itérations : traiter une liste d'éléments automatiquement",
          "Gestion des erreurs et des cas limites",
          "Atelier : automatisation d'un traitement de données récurrent"
        ]
      },
      {
        "module": "Module 4 — Cas pratiques métier (2h)",
        "details": [
          "Automatiser le traitement des emails entrants",
          "Générer des rapports automatiques depuis un tableur",
          "Synchroniser des informations entre plusieurs outils",
          "Atelier : chaque participant choisit un cas de son propre métier"
        ]
      },
      {
        "module": "Jour 2 — Intégrer l'IA dans ses automatisations",
        "details": []
      },
      {
        "module": "Module 5 — Connecter l'IA à ses workflows (2h)",
        "details": [
          "Intégrer ChatGPT / Claude dans un scénario Make",
          "Traitement intelligent de texte : résumé, classification, extraction d'informations",
          "Génération automatique de contenu structuré",
          "Atelier : workflow avec analyse IA d'un document entrant"
        ]
      },
      {
        "module": "Module 6 — Automatisations avancées (2h)",
        "details": [
          "Workflows multi-étapes avec logique conditionnelle complexe",
          "Traitement de fichiers : PDF, tableurs, images",
          "Notifications intelligentes et alertes contextuelles",
          "Atelier : construire un workflow complet de bout en bout"
        ]
      },
      {
        "module": "Module 7 — De la maquette au déploiement (1h30)",
        "details": [
          "Tester et valider un workflow avant mise en production",
          "Surveiller l'exécution et gérer les erreurs",
          "Documentation et maintenance d'une automatisation",
          "Bonnes pratiques de sécurité et de confidentialité des données"
        ]
      },
      {
        "module": "Module 8 — Plan d'action individuel (30min)",
        "details": [
          "Chaque participant identifie 3 automatisations à déployer dans les 30 jours",
          "Priorisation selon l'impact et la faisabilité",
          "Ressources pour continuer à progresser de manière autonome"
        ]
      }
    ],
    "livrables": [
      "2 à 3 workflows fonctionnels construits pendant la formation sur vos propres cas",
      "Un guide de référence des patterns d'automatisation les plus utiles",
      "Un accès aux templates partagés pendant la formation",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation entièrement pratique. Chaque concept est immédiatement mis en application. Les participants construisent leurs automatisations sur leurs propres outils et cas réels dès le premier jour."
  },
  {
    "id": "05_ia_pour_enseignants",
    "slug": "ia-pour-enseignants",
    "title": "L'IA comme outil pédagogique",
    "secteur": "Éducation & Formation",
    "categorie": "Intelligence artificielle",
    "niveau": "Initiation à intermédiaire",
    "duree": "2 journées (14h)",
    "format": "Présentiel ou hybride",
    "accroche": "L'IA est déjà dans la salle de classe — dans les mains des étudiants. La vraie question n'est pas d'interdire ou d'ignorer, mais de comprendre, d'encadrer et d'en faire un levier pédagogique réel. Cette formation est conçue par des formateurs, pour des formateurs.",
    "publicCible": "Enseignants, formateurs, coordinateurs pédagogiques de tout niveau (primaire, secondaire, supérieur, formation professionnelle) souhaitant intégrer l'IA de manière réfléchie et efficace dans leur pratique.",
    "prerequis": "Aucun prérequis technique. Une expérience d'enseignement ou de formation est nécessaire.",
    "objectifs": [
      "Comprendre comment les étudiants utilisent réellement l'IA et quels risques cela pose",
      "Utiliser l'IA pour concevoir des séquences pédagogiques plus efficacement",
      "Générer des exercices, évaluations et supports de cours adaptés avec l'IA",
      "Repenser ses méthodes d'évaluation à l'ère de l'IA",
      "Accompagner ses apprenants vers un usage éthique et critique de l'IA",
      "Construire une politique d'usage de l'IA adaptée à son contexte d'enseignement"
    ],
    "programme": [
      {
        "module": "Jour 1 — Comprendre et s'approprier l'IA en contexte pédagogique",
        "details": []
      },
      {
        "module": "Module 1 — L'IA dans la salle de classe : état des lieux (1h30)",
        "details": [
          "Ce que font réellement les étudiants avec l'IA (et depuis quand)",
          "Les usages détournés : tricherie, paraphrase, génération de devoirs",
          "Les usages légitimes et constructifs à reconnaître et encourager",
          "Comment repositionner l'enseignant face à l'IA : du transmetteur au guide"
        ]
      },
      {
        "module": "Module 2 — L'IA comme assistant de conception pédagogique (2h)",
        "details": [
          "Générer des plans de cours et séquences pédagogiques",
          "Produire des supports de cours, fiches de synthèse, glossaires",
          "Adapter un contenu à différents niveaux ou profils d'apprenants",
          "Créer des scénarios pédagogiques différenciés",
          "Atelier : chaque participant conçoit une séquence pédagogique avec l'IA"
        ]
      },
      {
        "module": "Module 3 — Concevoir des exercices et évaluations avec l'IA (2h)",
        "details": [
          "Générer des batteries d'exercices variés et progressifs",
          "Créer des QCM, études de cas, mises en situation",
          "Personnaliser les exercices selon les profils d'apprenants",
          "Générer des corrigés détaillés et des rubriques d'évaluation",
          "Atelier : production d'une évaluation complète sur un sujet choisi"
        ]
      },
      {
        "module": "Jour 2 — Repenser l'évaluation et accompagner les apprenants",
        "details": []
      },
      {
        "module": "Module 4 — Évaluer à l'ère de l'IA (2h)",
        "details": [
          "Pourquoi les évaluations traditionnelles sont fragilisées par l'IA",
          "Concevoir des évaluations IA-résistantes : oral, processus, portfolio, création",
          "L'évaluation de la capacité à utiliser l'IA de manière critique",
          "Détection des contenus générés par IA : outils, limites et posture éthique",
          "Atelier : repenser une évaluation existante pour l'adapter au contexte IA"
        ]
      },
      {
        "module": "Module 5 — Enseigner avec et sur l'IA (1h30)",
        "details": [
          "Intégrer l'IA comme objet d'apprentissage dans ses cours",
          "Activités pédagogiques exploitant l'IA : débat, analyse critique, co-création",
          "Développer l'esprit critique des apprenants face aux sorties IA",
          "Exemples d'activités réussies dans différents contextes disciplinaires"
        ]
      },
      {
        "module": "Module 6 — Construire sa politique d'usage (1h)",
        "details": [
          "Rédiger une charte d'usage de l'IA pour sa classe ou son établissement",
          "Communiquer clairement les règles aux apprenants et aux parents",
          "Dialogue avec la direction et les collègues : comment embarquer l'institution",
          "Les ressources institutionnelles et réglementaires à connaître"
        ]
      },
      {
        "module": "Module 7 — Plan d'action et mise en réseau (1h)",
        "details": [
          "Chaque participant définit 3 changements concrets à intégrer dès la prochaine session",
          "Construction d'un réseau de pairs pour continuer à partager les pratiques",
          "Ressources pour rester informé des évolutions"
        ]
      }
    ],
    "livrables": [
      "Un module de cours ou une séquence pédagogique conçue pendant la formation",
      "Une banque d'exercices et d'évaluations générée pendant la formation",
      "Un modèle de charte d'usage de l'IA adapté à son contexte",
      "Un guide de prompts spécialisés pour l'enseignement",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation par l'exemple et la pratique. Chaque participant travaille sur sa propre discipline et ses propres contenus. Échanges de pratiques entre pairs encouragés tout au long des deux jours."
  },
  {
    "id": "06_transformation_ia_etablissement",
    "slug": "transformation-ia-etablissement",
    "title": "Conduire la transformation IA d'un établissement",
    "secteur": "Éducation & Formation",
    "categorie": "Intelligence artificielle",
    "niveau": "Intermédiaire à avancé",
    "duree": "1 journée (7h)",
    "format": "Présentiel",
    "accroche": "La transformation IA d'un établissement ne se décrète pas — elle se pilote. Entre l'enthousiasme des uns, la résistance des autres et l'évolution constante des outils, le vrai enjeu est de construire une vision claire et une démarche qui tienne dans le temps.",
    "publicCible": "Directeurs, directeurs pédagogiques, responsables qualité et coordinateurs d'établissements scolaires, universités, grandes écoles et organismes de formation souhaitant définir et piloter une stratégie d'intégration de l'IA.",
    "prerequis": "Exercer une fonction de responsabilité dans un établissement d'enseignement ou de formation. Une première sensibilisation aux outils IA est un plus mais pas obligatoire.",
    "objectifs": [
      "Réaliser un diagnostic de la maturité IA de son établissement",
      "Définir une vision et une feuille de route réaliste pour l'intégration de l'IA",
      "Identifier les leviers de mobilisation des équipes enseignantes",
      "Construire une politique d'usage de l'IA adaptée à son contexte",
      "Anticiper les risques et gérer les résistances au changement",
      "Inscrire la démarche dans une logique d'amélioration continue"
    ],
    "programme": [
      {
        "module": "Module 1 — Diagnostic : où en est mon établissement ? (1h30)",
        "details": [
          "Grille de maturité IA pour les établissements d'enseignement",
          "Évaluer les usages existants (enseignants, étudiants, administratif)",
          "Cartographier les ressources disponibles et les freins actuels",
          "Identifier les alliés et les résistances dans son institution",
          "Atelier : chaque participant réalise le diagnostic de son établissement"
        ]
      },
      {
        "module": "Module 2 — Construire une vision et une stratégie (1h30)",
        "details": [
          "Définir les objectifs de la transformation IA pour son contexte spécifique",
          "Les différents modèles d'intégration : de la sensibilisation à l'immersion totale",
          "Construire une feuille de route échelonnée et réaliste",
          "Aligner la stratégie IA avec le projet pédagogique de l'établissement",
          "Atelier : rédiger les grandes lignes de sa feuille de route"
        ]
      },
      {
        "module": "Module 3 — Mobiliser les équipes (1h30)",
        "details": [
          "Comprendre les ressorts de la résistance au changement chez les enseignants",
          "Les stratégies d'accompagnement qui fonctionnent : formation, pairs référents, expérimentation",
          "Communiquer la vision sans imposer : comment convaincre sans brusquer",
          "Créer une dynamique collective autour de l'IA",
          "Table ronde : partage d'expériences entre participants"
        ]
      },
      {
        "module": "Module 4 — Politique d'usage et gouvernance (1h30)",
        "details": [
          "Élaborer une charte d'usage de l'IA pour son établissement",
          "Questions clés : que permettre, qu'encadrer, qu'interdire ?",
          "Gestion des données : RGPD et protection des données des apprenants",
          "Suivi, évaluation et ajustement de la politique dans le temps",
          "Atelier : rédaction des grandes lignes de la charte de son établissement"
        ]
      },
      {
        "module": "Module 5 — Plan d'action et prochaines étapes (1h)",
        "details": [
          "Synthèse des travaux de la journée",
          "Présentation des plans d'action individuels",
          "Identification des ressources et partenaires pour avancer",
          "Définition des indicateurs de suivi de la transformation"
        ]
      }
    ],
    "livrables": [
      "Un diagnostic de maturité IA de son établissement",
      "Les grandes lignes d'une feuille de route personnalisée",
      "Un modèle de charte d'usage de l'IA pour établissement",
      "Un réseau de pairs ayant les mêmes enjeux",
      "Une attestation de participation ACT"
    ],
    "methode": "Journée stratégique alternant apports structurés, ateliers individuels et échanges entre pairs. Les participants travaillent sur leur propre établissement tout au long de la journée et repartent avec des livrables concrets et personnalisés."
  },
  {
    "id": "07_ia_sante",
    "slug": "ia-sante",
    "title": "IA et Pratiques de Santé",
    "secteur": "Santé",
    "categorie": "Intelligence artificielle",
    "niveau": "Initiation à intermédiaire",
    "duree": "1 journée (7h)",
    "format": "Présentiel ou distanciel",
    "accroche": "L'IA transforme la médecine à une vitesse que peu d'acteurs du secteur anticipent. Entre les outils qui allègent la charge administrative, ceux qui assistent le diagnostic, et les questions éthiques que tout cela soulève — les professionnels de santé ont besoin de repères clairs, pas de promesses floues.",
    "publicCible": "Médecins, infirmiers, pharmaciens, administrateurs hospitaliers, responsables qualité et tout professionnel du secteur santé souhaitant comprendre les usages réels de l'IA dans leur domaine et commencer à l'intégrer dans leur pratique.",
    "prerequis": "Aucun prérequis technique. Une expérience professionnelle dans le secteur de la santé est nécessaire.",
    "objectifs": [
      "Situer les applications réelles de l'IA dans le secteur de la santé",
      "Identifier les usages pertinents pour sa propre pratique professionnelle",
      "Utiliser les outils IA disponibles pour réduire la charge administrative",
      "Évaluer les risques éthiques et réglementaires liés à l'usage de l'IA en santé",
      "Adopter une posture critique et informée face aux outils IA présentés comme médicaux",
      "Participer à la réflexion sur l'intégration responsable de l'IA dans son établissement"
    ],
    "programme": [
      {
        "module": "Module 1 — L'IA en santé : réalité vs promesses (1h30)",
        "details": [
          "Panorama des applications existantes : imagerie médicale, aide au diagnostic, biologie, drug discovery",
          "Ce qui est déjà déployé, ce qui est encore expérimental, ce qui relève du marketing",
          "Études de cas concrets : succès documentés et échecs instructifs",
          "Le rôle irremplaçable du professionnel de santé face à l'IA"
        ]
      },
      {
        "module": "Module 2 — Alléger la charge administrative avec l'IA (2h)",
        "details": [
          "Rédaction assistée : comptes-rendus, lettres de sortie, ordonnances types",
          "Résumé automatique de dossiers patients et d'historiques médicaux",
          "Gestion des emails, planification et coordination interne",
          "Documentation réglementaire et rapports qualité",
          "Atelier pratique : utiliser l'IA pour ses propres documents administratifs"
        ]
      },
      {
        "module": "Module 3 — IA et relation patient (1h)",
        "details": [
          "Chatbots médicaux : ce qu'ils peuvent faire et ce qu'ils ne peuvent pas",
          "L'IA comme outil d'éducation thérapeutique du patient",
          "Risques de déshumanisation et maintien du lien de confiance",
          "La communication autour de l'IA avec les patients : comment l'aborder"
        ]
      },
      {
        "module": "Module 4 — Éthique, responsabilité et réglementation (1h30)",
        "details": [
          "Qui est responsable en cas d'erreur d'un outil IA médical ?",
          "Confidentialité et protection des données de santé (RGPD, réglementation nationale)",
          "Les biais des algorithmes médicaux et leurs conséquences concrètes",
          "Le marquage CE et la certification des dispositifs médicaux intégrant l'IA",
          "Ce qu'il ne faut jamais déléguer à une IA dans un contexte de soin"
        ]
      },
      {
        "module": "Module 5 — Construire une pratique responsable (1h)",
        "details": [
          "Les outils IA fiables à connaître dans son domaine de spécialité",
          "Critères d'évaluation d'un outil IA avant de l'adopter",
          "Initier une réflexion collective dans son équipe ou son établissement",
          "Ressources et veille pour rester informé des évolutions"
        ]
      }
    ],
    "livrables": [
      "Un panorama structuré des applications IA pertinentes pour sa spécialité",
      "Une checklist d'évaluation des outils IA en santé",
      "Un guide des bonnes pratiques et des points de vigilance réglementaires",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation équilibrée entre apports factuels, analyses de cas réels et discussions entre professionnels. Le parti pris est la lucidité : ni techno-enthousiasme ni rejet, mais une approche fondée sur les preuves et le bon sens clinique."
  },
  {
    "id": "08_ia_marketing_communication",
    "slug": "ia-marketing-communication",
    "title": "L'IA au service du Marketing et de la Communication",
    "secteur": "Commerce & Marketing",
    "categorie": "Intelligence artificielle",
    "niveau": "Initiation à intermédiaire",
    "duree": "2 journées (14h)",
    "format": "Présentiel ou distanciel",
    "accroche": "Produire plus de contenu, cibler plus précisément, analyser plus rapidement — sans augmenter les équipes ni les budgets. L'IA redessine les possibilités du marketing. Cette formation transforme la théorie en pratique, sur vos propres projets.",
    "publicCible": "Responsables marketing, chargés de communication, community managers, directeurs commerciaux, créateurs de contenu et toute personne impliquée dans la production de contenu ou la gestion de la relation client.",
    "prerequis": "Exercer une fonction en lien avec le marketing, la communication ou la vente. Aucun prérequis technique.",
    "objectifs": [
      "Utiliser l'IA pour produire du contenu marketing de qualité à grande échelle",
      "Automatiser la création de posts, newsletters, scripts vidéo et fiches produits",
      "Exploiter l'IA pour analyser des données marketing et en tirer des insights actionnables",
      "Personnaliser la communication à grande échelle grâce à l'IA",
      "Intégrer les outils IA dans un workflow marketing cohérent et efficace",
      "Garder le contrôle éditorial et la cohérence de marque malgré l'automatisation"
    ],
    "programme": [
      {
        "module": "Jour 1 — Créer du contenu avec l'IA",
        "details": []
      },
      {
        "module": "Module 1 — L'IA dans l'écosystème marketing (1h)",
        "details": [
          "Panorama des outils IA pour le marketing : texte, image, vidéo, audio",
          "Ce que l'IA change dans la production de contenu",
          "Les risques à éviter : contenu générique, perte de voix de marque, problèmes légaux"
        ]
      },
      {
        "module": "Module 2 — Production de contenu texte avec l'IA (2h)",
        "details": [
          "Rédiger des posts réseaux sociaux adaptés à chaque plateforme",
          "Créer des newsletters engageantes et personnalisées",
          "Produire des fiches produits, landing pages et pages web",
          "Rédiger des scripts pour vidéos, podcasts et présentations",
          "Adapter le ton et le style à son identité de marque",
          "Atelier : production de contenu pour ses propres canaux"
        ]
      },
      {
        "module": "Module 3 — Création visuelle assistée par l'IA (2h)",
        "details": [
          "Les outils de génération d'images : Midjourney, DALL-E, Adobe Firefly",
          "Créer des visuels cohérents avec son identité graphique",
          "Générer des déclinaisons pour différents formats et plateformes",
          "Limites légales et droits d'auteur dans la création visuelle IA",
          "Atelier : création de visuels pour une campagne réelle"
        ]
      },
      {
        "module": "Module 4 — Construire un calendrier éditorial avec l'IA (1h)",
        "details": [
          "Générer des idées de contenu en volume avec l'IA",
          "Structurer un plan éditorial mensuel ou trimestriel",
          "Adapter les contenus à la saisonnalité et aux actualités",
          "Atelier : construction du calendrier éditorial du mois suivant"
        ]
      },
      {
        "module": "Jour 2 — Analyser, personnaliser et automatiser",
        "details": []
      },
      {
        "module": "Module 5 — Analyse marketing avec l'IA (2h)",
        "details": [
          "Analyser des données clients et de performance avec l'IA",
          "Interpréter des rapports analytics et en extraire des insights",
          "Veille concurrentielle et analyse des tendances assistées par l'IA",
          "Segmentation client augmentée : identifier les profils à fort potentiel",
          "Atelier : analyse de ses propres données marketing"
        ]
      },
      {
        "module": "Module 6 — Personnalisation à grande échelle (1h30)",
        "details": [
          "Personnaliser les emails et les communications selon le profil client",
          "Adapter les messages selon le parcours d'achat",
          "A/B testing assisté par l'IA",
          "Recommandations de contenu personnalisées"
        ]
      },
      {
        "module": "Module 7 — Automatiser son workflow marketing (1h30)",
        "details": [
          "Connecter les outils IA à son CRM et ses plateformes marketing",
          "Automatiser la publication, la modération et les réponses de premier niveau",
          "Mettre en place des flux de nurturing intelligents",
          "Atelier : conception d'un mini-workflow automatisé"
        ]
      },
      {
        "module": "Module 8 — Maintenir la cohérence de marque (1h)",
        "details": [
          "Définir et encoder sa voix de marque pour l'IA",
          "Créer un guide de style pour ses prompts marketing",
          "Processus de validation éditoriale dans un workflow IA",
          "Plan d'action : intégrer l'IA dans ses processus marketing dès la semaine suivante"
        ]
      }
    ],
    "livrables": [
      "Un mois de contenu produit pendant la formation (posts, newsletter, visuels)",
      "Un calendrier éditorial prêt à l'emploi",
      "Une bibliothèque de prompts marketing adaptés à sa marque",
      "Un guide de style IA pour maintenir la cohérence de sa communication",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation orientée production. Les participants créent du contenu réel pour leurs propres marques et projets tout au long des deux jours. Chaque outil est démontré puis immédiatement mis en pratique."
  },
  {
    "id": "09_ia_ecommerce",
    "slug": "ia-ecommerce",
    "title": "Optimiser son activité e-commerce avec l'IA",
    "secteur": "Commerce & Marketing",
    "categorie": "Intelligence artificielle",
    "niveau": "Intermédiaire",
    "duree": "1 journée (7h)",
    "format": "Présentiel ou distanciel",
    "accroche": "Le e-commerce est l'un des secteurs où l'IA produit les effets les plus mesurables et les plus rapides. De la fiche produit à la relation client, en passant par la logistique et la personnalisation — chaque maillon de la chaîne peut être augmenté. Cette formation montre comment, concrètement.",
    "publicCible": "Entrepreneurs e-commerce, responsables boutiques en ligne, chefs de produit digital, responsables acquisition et toute personne gérant ou développant une activité de vente en ligne.",
    "prerequis": "Gérer ou être impliqué dans une activité e-commerce. Aucun prérequis technique en développement.",
    "objectifs": [
      "Identifier les leviers IA les plus impactants pour son activité e-commerce",
      "Optimiser ses fiches produits et son contenu de vente avec l'IA",
      "Améliorer l'expérience client grâce à la personnalisation et aux chatbots",
      "Analyser ses données de vente et identifier des opportunités avec l'IA",
      "Automatiser des tâches clés de son activité (service client, gestion des avis, reporting)",
      "Construire une stratégie d'adoption de l'IA adaptée à la taille et aux ressources de son activité"
    ],
    "programme": [
      {
        "module": "Module 1 — L'IA dans le e-commerce : cartographie des opportunités (1h)",
        "details": [
          "Panorama des applications IA dans le commerce en ligne",
          "Les cas d'usage à fort ROI pour les PME et les structures indépendantes",
          "Ce qui est accessible sans budget et sans équipe technique",
          "Les erreurs classiques à éviter lors de l'adoption de l'IA en e-commerce"
        ]
      },
      {
        "module": "Module 2 — Optimiser le contenu produit avec l'IA (1h30)",
        "details": [
          "Générer des fiches produits convaincantes, optimisées SEO",
          "Adapter les descriptions à différents canaux (site, marketplace, réseaux)",
          "Produire des visuels produits avec l'IA : studio virtuel, mises en scène",
          "Rédiger des emails de vente, relances panier et confirmations de commande",
          "Atelier : refonte de fiches produits réelles avec l'IA"
        ]
      },
      {
        "module": "Module 3 — Personnalisation et expérience client (1h30)",
        "details": [
          "Comment l'IA analyse le comportement d'achat pour personnaliser l'expérience",
          "Recommandations de produits intelligentes : outils et intégration",
          "Segmentation dynamique de sa base client",
          "Chatbots e-commerce : ce qu'ils font bien, leurs limites, comment les configurer",
          "Atelier : configuration d'un chatbot simple de service client"
        ]
      },
      {
        "module": "Module 4 — Analyser et piloter avec l'IA (1h30)",
        "details": [
          "Analyser ses ventes et identifier des patterns avec l'IA",
          "Prévision de la demande et gestion des stocks augmentée",
          "Analyse des avis clients : extraire des insights actionnables automatiquement",
          "Surveillance concurrentielle assistée par l'IA",
          "Atelier : analyse de ses propres données de vente"
        ]
      },
      {
        "module": "Module 5 — Automatiser les opérations courantes (1h)",
        "details": [
          "Traitement automatisé des demandes client fréquentes",
          "Génération de rapports de performance",
          "Alertes intelligentes et tableaux de bord automatisés",
          "Traduction et adaptation multilingue du contenu",
          "Plan d'action : les 3 automatisations à mettre en place en priorité"
        ]
      },
      {
        "module": "Module 6 — Construire sa roadmap IA e-commerce (30min)",
        "details": [
          "Prioriser ses investissements IA selon son stade de développement",
          "Les ressources gratuites ou à faible coût pour démarrer",
          "Indicateurs pour mesurer l'impact réel de l'IA sur son activité"
        ]
      }
    ],
    "livrables": [
      "Des fiches produits réécrites et optimisées pendant la formation",
      "Un chatbot de premier niveau configuré pour son activité",
      "Un tableau de bord d'analyse de ses données de vente",
      "Une roadmap IA personnalisée pour son activité e-commerce",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation ancrée dans la réalité opérationnelle du e-commerce. Chaque participant travaille sur son propre catalogue et ses propres données. Forte composante pratique avec des résultats concrets et utilisables dès le lendemain."
  },
  {
    "id": "11_piloter_transformation_ia",
    "slug": "piloter-transformation-ia",
    "title": "Piloter la transformation IA de son organisation",
    "secteur": "RH & Management",
    "categorie": "Intelligence artificielle",
    "niveau": "Intermédiaire à avancé",
    "duree": "1 journée (7h)",
    "format": "Présentiel",
    "accroche": "L'IA ne se déploie pas comme un logiciel. Elle transforme les métiers, les processus, les équilibres de pouvoir et les compétences. Les managers qui comprennent cela prennent de meilleures décisions — sur quoi investir, quoi ne pas déléguer à la machine, et comment emmener leurs équipes dans cette transition sans les perdre en route.",
    "publicCible": "Directeurs généraux, directeurs de département, managers intermédiaires et tout cadre ayant la responsabilité de décisions stratégiques ou opérationnelles dans une organisation souhaitant intégrer l'IA de manière réfléchie et efficace.",
    "prerequis": "Exercer une fonction d'encadrement ou de direction. Aucun prérequis technique.",
    "objectifs": [
      "Comprendre les mécanismes réels de l'IA pour décider avec discernement",
      "Évaluer le potentiel IA de son organisation et identifier les priorités d'action",
      "Construire une feuille de route de transformation IA réaliste et pilotable",
      "Gérer le changement humain que l'adoption de l'IA implique",
      "Poser les bases d'une gouvernance de l'IA dans son organisation",
      "Identifier les compétences à développer et les profils à recruter"
    ],
    "programme": [
      {
        "module": "Module 1 — Ce que tout dirigeant doit comprendre sur l'IA (1h30)",
        "details": [
          "Les grandes familles de l'IA : ce qui est utile maintenant vs ce qui est futur",
          "Comment fonctionnent les modèles d'IA sans entrer dans la technique",
          "Ce que l'IA peut vraiment faire pour une organisation comme la vôtre",
          "Les 5 erreurs classiques des dirigeants face à l'IA : surestimer, sous-estimer, déléguer trop vite, ne pas gouverner, ignorer l'humain"
        ]
      },
      {
        "module": "Module 2 — Évaluer le potentiel IA de son organisation (1h30)",
        "details": [
          "Grille d'analyse : quels processus, quelles fonctions, quelles décisions sont candidates à l'IA ?",
          "Évaluer la maturité data de son organisation",
          "Estimer les gains potentiels et les coûts réels",
          "Identifier les quick wins vs les chantiers de fond",
          "Atelier : diagnostic IA de son propre périmètre de responsabilité"
        ]
      },
      {
        "module": "Module 3 — Construire et piloter une feuille de route IA (1h30)",
        "details": [
          "Les composantes d'une feuille de route IA réaliste",
          "Prioriser les initiatives selon l'impact et la faisabilité",
          "Construire le business case pour convaincre la direction ou les actionnaires",
          "Indicateurs de suivi et jalons de la transformation",
          "Atelier : esquisse de la feuille de route pour son organisation"
        ]
      },
      {
        "module": "Module 4 — Conduire le changement humain (1h)",
        "details": [
          "Pourquoi la résistance des équipes est légitime et comment la travailler",
          "Communication transparente sur les intentions et les impacts",
          "Les compétences qui gagnent de la valeur avec l'IA, celles qui en perdent",
          "Reskilling et upskilling : comment anticiper et accompagner",
          "Maintenir la motivation et l'engagement dans une organisation qui change"
        ]
      },
      {
        "module": "Module 5 — Gouvernance et risques (1h)",
        "details": [
          "Les questions de gouvernance que tout dirigeant doit trancher",
          "Responsabilité des décisions prises avec l'aide de l'IA",
          "Sécurité des données et gestion des risques",
          "Construction d'une politique d'usage de l'IA en organisation",
          "Les prestataires IA : comment évaluer, contractualiser et surveiller"
        ]
      },
      {
        "module": "Module 6 — Plan d'action et engagement (30min)",
        "details": [
          "Chaque participant définit ses 3 priorités d'action des 90 prochains jours",
          "Présentation et feedback croisé entre participants",
          "Ressources et réseaux pour continuer à progresser"
        ]
      }
    ],
    "livrables": [
      "Un diagnostic IA de son organisation",
      "Les grandes lignes d'une feuille de route personnalisée à 6 mois",
      "Un modèle de business case IA pour convaincre ses parties prenantes",
      "Une checklist de gouvernance de l'IA en organisation",
      "Une attestation de participation ACT"
    ],
    "methode": "Journée stratégique sans jargon technique. Alternance entre apports de cadrage, études de cas d'organisations ayant réussi ou échoué leur transformation IA, et ateliers individuels. Les participants travaillent sur leur propre organisation et repartent avec des livrables directement exploitables."
  },
  {
    "id": "12_ia_finance",
    "slug": "ia-finance",
    "title": "L'IA appliquée à la Finance et au Contrôle de Gestion",
    "secteur": "Finance & Comptabilité",
    "categorie": "Intelligence artificielle",
    "niveau": "Intermédiaire",
    "duree": "1 journée (7h)",
    "format": "Présentiel ou distanciel",
    "accroche": "Les données financières n'ont jamais été aussi disponibles — et pourtant les délais de clôture ne raccourcissent pas, les anomalies passent encore entre les mailles, et les prévisions restent des exercices laborieux. L'IA ne remplace pas le jugement financier : elle l'accélère et le libère des tâches qui ne méritent pas son attention.",
    "publicCible": "Directeurs financiers, contrôleurs de gestion, comptables, auditeurs internes, responsables trésorerie et tout professionnel du chiffre souhaitant intégrer l'IA dans ses pratiques d'analyse et de reporting.",
    "prerequis": "Exercer une fonction financière ou comptable. Maîtrise de base d'Excel ou d'un outil de reporting. Aucun prérequis en programmation.",
    "objectifs": [
      "Identifier les tâches financières à fort potentiel d'automatisation ou d'augmentation par l'IA",
      "Utiliser l'IA pour accélérer ses analyses et son reporting",
      "Détecter des anomalies et signaux faibles dans les données financières avec l'IA",
      "Produire des prévisions financières augmentées par l'IA",
      "Automatiser la production de rapports et de tableaux de bord",
      "Évaluer les risques et les enjeux réglementaires liés à l'IA en finance"
    ],
    "programme": [
      {
        "module": "Module 1 — L'IA en finance : ce qui est possible maintenant (1h)",
        "details": [
          "Applications réelles de l'IA dans la finance d'entreprise",
          "Ce que l'IA fait mieux que les humains, et ce qu'elle ne fait pas",
          "Panorama des outils disponibles : généralistes et spécialisés finance",
          "Cas concrets d'entreprises ayant intégré l'IA dans leur fonction financière"
        ]
      },
      {
        "module": "Module 2 — Analyser et interpréter les données financières avec l'IA (2h)",
        "details": [
          "Charger et analyser des jeux de données financières avec l'IA",
          "Poser des questions en langage naturel sur ses données (ChatGPT Advanced Data Analysis, etc.)",
          "Identifier des tendances, des écarts et des patterns inhabituels",
          "Comparer des performances réelles vs budgets avec assistance IA",
          "Atelier : analyse d'un jeu de données financières réelles ou simulées"
        ]
      },
      {
        "module": "Module 3 — Détection d'anomalies et contrôle interne (1h30)",
        "details": [
          "Comment l'IA détecte les anomalies que l'œil humain manque",
          "Applications pratiques : doublons, fraudes, erreurs de saisie, dépassements",
          "Intégrer une logique de détection automatique dans ses processus de contrôle",
          "Limites et faux positifs : comment calibrer et valider",
          "Atelier : paramétrer une détection d'anomalies sur un extrait comptable"
        ]
      },
      {
        "module": "Module 4 — Automatiser le reporting et les présentations financières (1h30)",
        "details": [
          "Générer des commentaires d'analyse financière automatiquement",
          "Produire des rapports de gestion narratifs à partir de données brutes",
          "Créer des tableaux de bord dynamiques sans développeur",
          "Préparer des présentations financières destinées à la direction avec l'IA",
          "Atelier : génération d'un rapport de gestion complet en temps réel"
        ]
      },
      {
        "module": "Module 5 — Prévisions et modélisation financière augmentées (1h)",
        "details": [
          "Améliorer ses modèles de prévision avec l'assistance IA",
          "Scénarios et simulations : explorer rapidement les hypothèses alternatives",
          "Prévision de trésorerie assistée par IA",
          "Atelier : construction d'un modèle de prévision simplifié avec assistance IA"
        ]
      }
    ],
    "livrables": [
      "Un rapport de gestion généré automatiquement à partir de ses propres données",
      "Un modèle de détection d'anomalies applicable à son contexte",
      "Un tableau de bord financier automatisé",
      "Un guide des outils IA utiles pour la finance selon son contexte",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation ancrée dans la réalité opérationnelle des équipes financières. Travail sur des données réelles ou anonymisées apportées par les participants. Chaque outil présenté est immédiatement mis en pratique sur un cas concret."
  },
  {
    "id": "13_developpement_assiste_ia",
    "slug": "developpement-assiste-ia",
    "title": "Développement assisté par l'IA",
    "secteur": "IT & Technique",
    "categorie": "Intelligence artificielle",
    "niveau": "Intermédiaire",
    "duree": "2 journées (14h)",
    "format": "Présentiel ou distanciel",
    "accroche": "Un développeur qui maîtrise les outils IA ne produit pas le même code qu'un développeur qui ne les maîtrise pas. La différence n'est pas dans la qualité — elle est dans la vitesse, la capacité à explorer, et le temps libéré pour ce qui demande vraiment de l'intelligence. Cette formation ne remplace pas le développeur. Elle le rend plus redoutable.",
    "publicCible": "Développeurs, ingénieurs logiciels, tech leads, DevOps et toute personne écrivant du code régulièrement souhaitant intégrer les outils d'assistance IA dans son workflow de développement.",
    "prerequis": "Expérience en développement logiciel dans au moins un langage (Python, JavaScript, Java, PHP ou autre). Être à l'aise avec un éditeur de code et un terminal.",
    "objectifs": [
      "Utiliser GitHub Copilot et les outils IA équivalents de manière efficace et critique",
      "Accélérer la génération de code tout en maintenant la qualité et la lisibilité",
      "Exploiter l'IA pour la documentation, les tests et la revue de code",
      "Utiliser l'IA pour comprendre et modifier du code existant (legacy, refactoring)",
      "Intégrer les outils IA dans son workflow et son environnement de développement",
      "Identifier les limites des outils IA et adopter une posture critique face au code généré"
    ],
    "programme": [
      {
        "module": "Jour 1 — Intégrer l'IA dans son workflow de développement",
        "details": []
      },
      {
        "module": "Module 1 — Panorama des outils IA pour les développeurs (1h)",
        "details": [
          "GitHub Copilot, Cursor, Claude, ChatGPT, Gemini : comparatif et cas d'usage",
          "Les modèles de langage et le code : comment ils génèrent, pourquoi ils se trompent",
          "Intégration dans VSCode, JetBrains et autres IDEs",
          "Configuration et personnalisation de son environnement"
        ]
      },
      {
        "module": "Module 2 — Génération de code efficace (2h)",
        "details": [
          "Techniques de prompting spécifiques au code",
          "Complétion de code vs génération à partir de descriptions",
          "Générer des fonctions, des classes, des modules complets",
          "Travailler avec plusieurs fichiers et maintenir le contexte",
          "Atelier : développement d'un mini-projet guidé par l'IA"
        ]
      },
      {
        "module": "Module 3 — Documentation et commentaires automatisés (1h)",
        "details": [
          "Générer de la documentation technique à partir du code",
          "Écrire des README, des docstrings et des commentaires avec l'IA",
          "Maintenir la documentation à jour dans un projet existant",
          "Atelier : documentation d'un module de code existant"
        ]
      },
      {
        "module": "Module 4 — Génération et automatisation des tests (2h)",
        "details": [
          "Générer des tests unitaires avec l'IA",
          "Tests d'intégration et scénarios de bout en bout assistés par l'IA",
          "Identifier les cas limites et les edge cases avec l'IA",
          "Revue et amélioration de la couverture de tests existants",
          "Atelier : écriture d'une suite de tests complète avec l'IA"
        ]
      },
      {
        "module": "Jour 2 — Cas d'usage avancés et posture critique",
        "details": []
      },
      {
        "module": "Module 5 — Refactoring et compréhension de code legacy (2h)",
        "details": [
          "Utiliser l'IA pour comprendre rapidement un code inconnu",
          "Refactoring assisté : améliorer la lisibilité et la performance",
          "Identifier les bugs et les vulnérabilités avec l'IA",
          "Migration et modernisation de code existant",
          "Atelier : refactoring d'un module legacy réel"
        ]
      },
      {
        "module": "Module 6 — Débogage et résolution de problèmes (1h30)",
        "details": [
          "Déboguer avec l'IA : stratégies et limites",
          "Analyser les stack traces et les logs avec l'IA",
          "Expliquer et résoudre les erreurs complexes",
          "Atelier : débogage d'un ensemble de bugs préparés"
        ]
      },
      {
        "module": "Module 7 — Limites, risques et bonnes pratiques (1h30)",
        "details": [
          "Quand ne pas faire confiance au code généré par l'IA",
          "Sécurité : les vulnérabilités que l'IA peut introduire sans le signaler",
          "Propriété intellectuelle et licences dans le code généré",
          "Construire un workflow de validation du code IA avant mise en production",
          "Les bonnes pratiques de l'équipe qui intègre l'IA dans son processus"
        ]
      },
      {
        "module": "Module 8 — Construire son workflow IA de développement (1h)",
        "details": [
          "Assembler un environnement de développement augmenté par l'IA",
          "Définir ses règles d'usage en équipe",
          "Mesurer le gain de productivité réel",
          "Plan d'action individuel et ressources pour progresser"
        ]
      }
    ],
    "livrables": [
      "Un mini-projet développé intégralement avec l'assistance IA pendant la formation",
      "Une configuration d'environnement de développement augmenté par l'IA",
      "Un guide des meilleures pratiques d'usage des outils IA pour développeurs",
      "Une checklist de validation du code généré par l'IA avant mise en production",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation technique 100% pratique. Les participants codent pendant les deux jours sur des cas réels ou proches de leur activité quotidienne. Chaque concept est immédiatement appliqué."
  },
  {
    "id": "14_de_idee_au_projet_ia",
    "slug": "de-idee-au-projet-ia",
    "title": "De l'idée au projet IA en entreprise",
    "secteur": "IT & Technique",
    "categorie": "Intelligence artificielle",
    "niveau": "Avancé",
    "duree": "3 journées (21h)",
    "format": "Présentiel",
    "accroche": "Des projets IA bien intentionnés échouent chaque jour — non pas par manque de technologie, mais par manque de méthode. Comment cadrer le bon problème, choisir la bonne approche, constituer la bonne équipe, mesurer les bons indicateurs, et éviter les pièges qui font déraper les budgets et les délais. Cette formation donne la méthode que les projets IA réussis ont en commun.",
    "publicCible": "Chefs de projet, product managers, architectes solutions, directeurs techniques, DSI et tout professionnel ayant la charge de concevoir, piloter ou évaluer un projet intégrant de l'IA dans un contexte organisationnel réel.",
    "prerequis": "Expérience dans la gestion de projets IT ou digitaux. Des notions de base en data ou en développement sont un plus mais pas obligatoires.",
    "objectifs": [
      "Identifier et cadrer un problème métier pertinent pour une solution IA",
      "Choisir la bonne approche IA selon le contexte et les contraintes",
      "Concevoir l'architecture fonctionnelle d'une solution IA",
      "Construire et piloter un projet IA avec une méthode adaptée",
      "Évaluer et sélectionner des prestataires ou des solutions IA du marché",
      "Mettre en place la gouvernance et le suivi nécessaires au déploiement durable"
    ],
    "programme": [
      {
        "module": "Jour 1 — Cadrer et concevoir son projet IA",
        "details": []
      },
      {
        "module": "Module 1 — Identifier le bon problème (2h)",
        "details": [
          "Pourquoi la plupart des projets IA échouent dès la phase de cadrage",
          "Du symptôme au problème réel : techniques de cadrage de problème",
          "Les questions à se poser avant de penser à la solution",
          "Quel type d'IA pour quel type de problème : classification, génération, prédiction, recommandation, automatisation",
          "Atelier : cadrage d'un problème métier réel en groupes"
        ]
      },
      {
        "module": "Module 2 — Évaluer la faisabilité (2h)",
        "details": [
          "Les conditions nécessaires à un projet IA : données, compétences, infrastructure",
          "Audit des données disponibles : qualité, volumétrie, accessibilité",
          "Estimation de la complexité technique et du risque projet",
          "Build vs Buy : construire sa propre solution ou intégrer une solution existante ?",
          "Atelier : grille de faisabilité appliquée aux cas des participants"
        ]
      },
      {
        "module": "Module 3 — Concevoir la solution (3h)",
        "details": [
          "Architecture fonctionnelle d'une solution IA : composantes clés",
          "Les briques technologiques à connaître : LLM, RAG, fine-tuning, agents, ML classique",
          "Concevoir l'interface humain-machine d'une solution IA",
          "Définir les métriques de succès dès la conception",
          "Atelier : conception de l'architecture fonctionnelle de son projet"
        ]
      },
      {
        "module": "Jour 2 — Construire et piloter",
        "details": []
      },
      {
        "module": "Module 4 — Méthode projet adaptée à l'IA (2h)",
        "details": [
          "Pourquoi les méthodes projet classiques ne suffisent pas pour l'IA",
          "L'approche itérative et expérimentale dans les projets IA",
          "Construire un MVP IA : définir le périmètre minimal viable",
          "Gestion des incertitudes et des résultats non déterministes",
          "Jalons et points de décision spécifiques aux projets IA"
        ]
      },
      {
        "module": "Module 5 — Données : collecter, préparer, maintenir (2h)",
        "details": [
          "Stratégie de collecte et d'enrichissement des données",
          "Nettoyage et préparation des données : enjeux pratiques",
          "Annotation et labellisation : quand c'est nécessaire, comment l'organiser",
          "Gouvernance des données dans un projet IA",
          "Atelier : plan de préparation des données pour son projet"
        ]
      },
      {
        "module": "Module 6 — Évaluer et sélectionner une solution ou un prestataire IA (2h)",
        "details": [
          "Grille d'évaluation des solutions IA du marché",
          "Comment lire une démo IA sans se faire impressionner à tort",
          "Contractualiser avec un prestataire IA : clauses clés, indicateurs de performance",
          "Intégration d'une solution IA dans un système d'information existant",
          "Atelier : évaluation comparative de deux solutions IA sur un cas type"
        ]
      },
      {
        "module": "Jour 3 — Déployer, mesurer et pérenniser",
        "details": []
      },
      {
        "module": "Module 7 — Déploiement et conduite du changement (2h)",
        "details": [
          "Stratégies de déploiement : pilote, déploiement progressif, big bang",
          "Former et accompagner les utilisateurs finaux d'une solution IA",
          "Gérer les résistances et les peurs liées à l'IA",
          "Communiquer sur le projet en interne et en externe"
        ]
      },
      {
        "module": "Module 8 — Mesurer l'impact réel (2h)",
        "details": [
          "Définir des indicateurs pertinents : performance technique vs valeur métier",
          "Mettre en place un dispositif de suivi post-déploiement",
          "Détecter les dérives du modèle et maintenir la qualité dans le temps",
          "Boucle d'amélioration continue d'une solution IA"
        ]
      },
      {
        "module": "Module 9 — Gouvernance et responsabilité (2h)",
        "details": [
          "Qui décide quoi dans un projet IA : rôles et responsabilités",
          "Gestion des risques spécifiques à l'IA : biais, opacité, dépendance",
          "Réglementation applicable : RGPD, AI Act, responsabilité en cas d'incident",
          "Construire un comité de gouvernance IA pour son organisation",
          "Présentation finale : chaque équipe présente son projet complet"
        ]
      }
    ],
    "livrables": [
      "Un dossier de projet IA complet : cadrage, faisabilité, architecture, plan de déploiement",
      "Une grille d'évaluation des prestataires et solutions IA",
      "Un modèle de tableau de bord de suivi de projet IA",
      "Un guide de gouvernance adapté à son contexte organisationnel",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation intensive sur 3 jours organisée en mode projet. Les participants travaillent en groupes sur des cas réels tout au long de la formation et présentent un dossier projet complet en fin de parcours. Alternance entre apports méthodologiques, études de cas et ateliers de production."
  },
  {
    "id": "15_ia_etudiants_jeunes_professionnels",
    "slug": "ia-etudiants-jeunes-professionnels",
    "title": "L'IA pour les étudiants et jeunes professionnels",
    "secteur": "Jeunes & Étudiants",
    "categorie": "Intelligence artificielle",
    "niveau": "Initiation",
    "duree": "1 journée (7h)",
    "format": "Présentiel ou distanciel",
    "accroche": "Dans dix ans, tous les métiers auront été transformés par l'IA. Ceux qui savent l'utiliser auront une longueur d'avance — pas parce qu'ils seront remplacés plus tard, mais parce qu'ils auront compris comment travailler autrement, plus intelligemment, plus vite. Cette journée donne les bases pour ne pas subir cette transformation, mais en tirer parti dès maintenant.",
    "publicCible": "Étudiants de l'enseignement supérieur (bac+1 à bac+5), jeunes diplômés, stagiaires et jeunes professionnels en début de carrière, toutes filières confondues.",
    "prerequis": "Aucun prérequis. Apporter son ordinateur.",
    "objectifs": [
      "Comprendre ce qu'est l'IA générative et comment elle fonctionne réellement",
      "Utiliser les principaux outils IA pour ses études et ses premières expériences professionnelles",
      "Formuler des instructions efficaces pour obtenir des résultats de qualité",
      "Utiliser l'IA de manière honnête et responsable dans un contexte académique",
      "Identifier les métiers et compétences valorisés à l'ère de l'IA",
      "Construire une pratique personnelle de l'IA adaptée à son parcours"
    ],
    "programme": [
      {
        "module": "Module 1 — L'IA pour de vrai : au-delà des fantasmes et des peurs (1h)",
        "details": [
          "Ce que l'IA peut faire et ce qu'elle ne peut pas faire",
          "L'IA hallucine : pourquoi, et comment ne pas se faire avoir",
          "Les modèles d'IA les plus utilisés : ChatGPT, Claude, Gemini, Copilot",
          "Ce que les entreprises attendent vraiment des jeunes sur l'IA"
        ]
      },
      {
        "module": "Module 2 — L'IA pour réussir ses études (1h30)",
        "details": [
          "Recherche documentaire et synthèse avec l'IA",
          "Comprendre un cours difficile : faire expliquer, reformuler, illustrer",
          "Préparer ses examens : quiz, flashcards, résumés générés avec l'IA",
          "Structurer et améliorer ses écrits académiques avec l'IA",
          "La ligne rouge : ce qui est légitime, ce qui est triche",
          "Atelier : chaque participant choisit un défi académique concret à résoudre avec l'IA"
        ]
      },
      {
        "module": "Module 3 — Formuler des instructions qui marchent (1h30)",
        "details": [
          "Pourquoi la même question peut donner des résultats très différents",
          "Les bases du prompt : contexte, rôle, tâche, format",
          "Exemples concrets pour les usages étudiants et professionnels",
          "Atelier : 10 prompts à construire et améliorer en temps réel"
        ]
      },
      {
        "module": "Module 4 — L'IA pour préparer sa vie professionnelle (1h30)",
        "details": [
          "CV, lettre de motivation et préparation d'entretien avec l'IA",
          "Construire sa présence en ligne avec l'aide de l'IA",
          "Créer un portfolio, un projet ou une présentation avec l'IA",
          "L'IA comme outil de veille et de montée en compétences",
          "Atelier : chaque participant améliore son CV ou prépare un entretien avec l'IA"
        ]
      },
      {
        "module": "Module 5 — Les métiers et compétences à l'ère de l'IA (30min)",
        "details": [
          "Quels métiers l'IA va transformer — et comment",
          "Les compétences qui gagnent de la valeur : esprit critique, créativité, relationnel",
          "Les nouvelles compétences techniques accessibles sans être développeur",
          "Ressources pour continuer à apprendre gratuitement"
        ]
      },
      {
        "module": "Module 6 — Construire sa routine IA (30min)",
        "details": [
          "Un plan d'action réaliste : 3 usages à intégrer dans les 30 prochains jours",
          "Les outils gratuits à connaître absolument",
          "Comment rester à jour dans un domaine qui évolue très vite"
        ]
      }
    ],
    "livrables": [
      "Un CV ou une lettre de motivation retravaillés pendant la formation",
      "Une bibliothèque de prompts utiles pour les études et la vie professionnelle",
      "Une liste de ressources gratuites pour continuer à progresser",
      "Une attestation de participation ACT"
    ],
    "methode": "Journée dynamique et interactive, conçue pour des profils jeunes et curieux. Alternance entre démonstrations, défis en groupe et exercices individuels. L'accent est mis sur la pratique immédiate avec des cas concrets issus du quotidien étudiant et professionnel."
  },
  {
    "id": "16_claude_code_debutant",
    "slug": "claude-code-debutant",
    "title": "Claude Code — Niveau Débutant : Prendre en main l'assistant IA pour développeurs",
    "secteur": "IT & Technique",
    "categorie": "Intelligence artificielle",
    "niveau": "Débutant",
    "duree": "1 journée (7h)",
    "format": "Présentiel ou distanciel",
    "parcours": "Claude Code — 1/3",
    "accroche": "Claude Code n'est pas un chatbot dans lequel on colle du code. C'est un agent qui lit votre projet, comprend votre codebase, exécute des commandes, gère vos fichiers et interagit avec vos outils de développement — directement depuis votre terminal ou votre éditeur. Cette journée pose les fondations pour ne pas passer à côté de ce que l'outil peut vraiment faire.",
    "publicCible": "Développeurs, étudiants en informatique, chefs de projet techniques et toute personne écrivant ou supervisant du code, souhaitant intégrer Claude Code dans son environnement de développement pour la première fois.",
    "prerequis": "- Maîtrise d'au moins un langage de programmation - Être à l'aise avec un terminal et les commandes de base - Avoir un compte Anthropic (Claude Pro ou Max) ou un accès API",
    "objectifs": [
      "Installer et configurer Claude Code dans ses différents environnements (terminal, VS Code, JetBrains)",
      "Comprendre comment Claude Code interagit avec un projet réel",
      "Déléguer ses premières tâches de développement à Claude Code",
      "Utiliser les commandes essentielles et naviguer dans l'interface",
      "Configurer son projet pour optimiser les interactions avec Claude Code via CLAUDE.md",
      "Évaluer et valider le code produit par l'agent avant de l'intégrer"
    ],
    "programme": [
      {
        "module": "Module 1 — Comprendre Claude Code avant de l'utiliser (1h)",
        "details": [
          "Ce qu'est Claude Code : un agent, pas une simple autocomplétion",
          "Comment Claude Code lit et comprend un projet : exploration de la codebase, contexte multi-fichiers",
          "Les environnements disponibles : CLI terminal, VS Code, JetBrains, interface web (claude.ai/code)",
          "Les modèles disponibles : Sonnet 4.6, Opus 4.6, Haiku 4.5 — quand utiliser lequel",
          "Les permissions : ce que Claude Code peut faire, ce qu'il demande avant d'agir"
        ]
      },
      {
        "module": "Module 2 — Installation et configuration (1h)",
        "details": [
          "Installation via npm et alternatives (Homebrew, WinGet)",
          "Configuration sur Windows (avec Git for Windows), macOS et Linux",
          "Intégration dans VS Code : extension, palette de commandes, onglet dédié",
          "Intégration dans JetBrains : plugin, diff interactif",
          "Premier lancement et authentification",
          "Atelier guidé : chacun configure son environnement et lance Claude Code sur un projet existant"
        ]
      },
      {
        "module": "Module 3 — Les premières interactions (1h30)",
        "details": [
          "Décrire une tâche en langage naturel : bonnes pratiques de formulation",
          "Demander une explication de code, un audit, une refactorisation simple",
          "Naviguer dans les réponses : accepter, rejeter, modifier les suggestions",
          "Les commandes essentielles : `/help`, `/model`, `/clear`, `/rewind`",
          "Comprendre les diffs proposés avant de les accepter",
          "Atelier : 5 tâches progressives sur un projet réel (comprendre, modifier, corriger)"
        ]
      },
      {
        "module": "Module 4 — Configurer son projet avec CLAUDE.md (1h)",
        "details": [
          "Qu'est-ce que CLAUDE.md et pourquoi c'est essentiel",
          "Ce qu'on y met : conventions de code, architecture du projet, contexte métier, instructions permanentes",
          "Rédiger un CLAUDE.md efficace pour son propre projet",
          "Comment Claude Code exploite ce fichier à chaque nouvelle session",
          "Atelier : chaque participant rédige le CLAUDE.md de son projet"
        ]
      },
      {
        "module": "Module 5 — Déléguer ses premières tâches concrètes (2h)",
        "details": [
          "Générer du code nouveau à partir d'une description en langage naturel",
          "Corriger un bug à partir d'un message d'erreur ou d'un symptôme",
          "Écrire des tests pour du code existant",
          "Générer de la documentation et des commentaires",
          "Explorer et comprendre rapidement un code inconnu",
          "Atelier : chaque participant choisit 3 tâches de son quotidien et les réalise avec Claude Code"
        ]
      },
      {
        "module": "Module 6 — Valider et garder le contrôle (30min)",
        "details": [
          "Pourquoi ne jamais accepter sans relire : les erreurs classiques des agents",
          "Comment lire un diff efficacement",
          "Les signaux d'alerte dans le code généré",
          "Construire son propre réflexe de validation avant intégration"
        ]
      }
    ],
    "livrables": [
      "Claude Code installé et configuré dans son environnement de développement",
      "Un fichier CLAUDE.md rédigé pour son propre projet",
      "Un guide de référence des commandes et bonnes pratiques essentielles",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation 100% pratique. Chaque participant travaille sur son propre projet ou sur un projet fourni. Démonstrations en direct suivies d'ateliers immédiats. Pas de slides — on est dans le terminal et l'éditeur du début à la fin."
  },
  {
    "id": "18_claude_code_perfectionnement",
    "slug": "claude-code-perfectionnement",
    "title": "Claude Code — Perfectionnement : Construire des agents et architectures IA pour le développement",
    "secteur": "IT & Technique",
    "categorie": "Intelligence artificielle",
    "niveau": "Avancé",
    "duree": "2 journées (14h)",
    "format": "Présentiel",
    "parcours": "Claude Code — 3/3",
    "accroche": "À ce niveau, Claude Code n'est plus seulement un outil dans votre workflow — il devient la fondation sur laquelle vous construisez vos propres agents, vos propres pipelines autonomes, et vos propres expériences de développement augmenté. Cette formation s'adresse à ceux qui veulent non plus utiliser Claude Code, mais le dépasser.",
    "publicCible": "Développeurs seniors, architectes logiciels, tech leads et ingénieurs IA souhaitant exploiter Claude Code à son niveau maximal : construction d'agents personnalisés, intégration API avancée, architectures multi-agents et déploiement en production.",
    "prerequis": "- Avoir suivi le niveau Intermédiaire ou disposer d'une expérience avancée avec Claude Code et l'API Anthropic - Maîtrise solide de Python ou JavaScript/TypeScript - Expérience en architecture logicielle et en déploiement",
    "objectifs": [
      "Utiliser l'Agent SDK (anciennement Claude Code SDK) pour construire ses propres agents de développement",
      "Concevoir des architectures multi-agents avec des subagents spécialisés",
      "Intégrer l'API Anthropic directement dans ses workflows de développement",
      "Construire et déployer des serveurs MCP personnalisés",
      "Mettre en place une gouvernance et une sécurité robustes pour des agents autonomes en production",
      "Mesurer et optimiser les performances de ses agents dans le temps"
    ],
    "programme": [
      {
        "module": "Jour 1 — Construire ses propres agents avec l'Agent SDK",
        "details": []
      },
      {
        "module": "Module 1 — Architecture des agents de développement (1h30)",
        "details": [
          "De Claude Code à l'Agent SDK : comprendre les couches d'abstraction",
          "Les composantes d'un agent : outils, contexte, permissions, boucles d'action",
          "Patterns d'architecture d'agents : réactif, planificateur, multi-étapes",
          "Quand construire son propre agent vs utiliser Claude Code directement",
          "Étude de cas : architecture d'agents de développement réels (compliance financière, cybersécurité, revue de code automatisée)"
        ]
      },
      {
        "module": "Module 2 — Construire avec l'Agent SDK (2h30)",
        "details": [
          "Installation et configuration de l'Agent SDK",
          "Créer son premier agent personnalisé : structure de base, gestion du contexte",
          "Implémenter des outils personnalisés pour son agent",
          "Gestion des permissions et des confirmations humaines",
          "Context management : garder les sessions longues efficaces sans exploser le context window",
          "Atelier : construction d'un agent de développement personnalisé pour un cas métier réel"
        ]
      },
      {
        "module": "Module 3 — Architectures multi-agents avec subagents (2h)",
        "details": [
          "Le pattern subagent : déléguer des tâches spécialisées en parallèle",
          "Concevoir l'orchestration entre un agent principal et ses subagents",
          "Cas d'usage : agent principal qui orchestre un subagent backend + un subagent frontend + un subagent tests",
          "Synchronisation, communication et gestion des conflits entre subagents",
          "Background tasks : lancer des processus longs sans bloquer l'orchestrateur",
          "Atelier : implémentation d'une architecture multi-agents sur un projet de développement"
        ]
      },
      {
        "module": "Jour 2 — MCP avancé, production et gouvernance",
        "details": []
      },
      {
        "module": "Module 4 — Construire ses propres serveurs MCP (2h30)",
        "details": [
          "Architecture d'un serveur MCP : ressources, outils, prompts",
          "Construire un serveur MCP en Python ou TypeScript",
          "Exposer ses propres données et outils internes à Claude Code",
          "Authentification et sécurisation d'un serveur MCP",
          "Déploiement d'un serveur MCP : local, self-hosted, cloud",
          "Atelier : chaque participant construit et déploie un serveur MCP connecté à un système interne réel"
        ]
      },
      {
        "module": "Module 5 — Intégration API Anthropic avancée (1h30)",
        "details": [
          "Utiliser l'API Anthropic directement pour construire des workflows de développement",
          "Extended thinking : quand et comment l'activer pour des tâches de raisonnement complexes",
          "Gestion du context window sur des projets de grande taille",
          "Streaming et gestion des réponses longues",
          "Optimisation des coûts : choisir le bon modèle selon la tâche (Haiku vs Sonnet vs Opus)"
        ]
      },
      {
        "module": "Module 6 — Sécurité, gouvernance et production (1h30)",
        "details": [
          "Les risques spécifiques aux agents autonomes en production",
          "Prompt injection et attaques sur les agents : comprendre et se défendre",
          "Concevoir un système de permissions granulaires pour ses agents",
          "Audit trail : tracer et inspecter les actions d'un agent en production",
          "Construire des points de contrôle humain dans des workflows autonomes",
          "Conformité et réglementation pour les systèmes IA en production (AI Act, RGPD)"
        ]
      },
      {
        "module": "Module 7 — Mesurer, optimiser et faire évoluer (1h)",
        "details": [
          "Métriques de performance pour les agents de développement",
          "Le Claude Code Analytics API : exploiter les données d'usage en production",
          "Détecter les dérives de comportement et les régressions dans le temps",
          "Stratégies d'amélioration continue : CLAUDE.md, fine-tuning de prompts système, mise à jour des outils",
          "Construire une roadmap d'évolution pour ses agents"
        ]
      },
      {
        "module": "Module 8 — Présentation des projets (1h30)",
        "details": [
          "Chaque participant ou équipe présente l'agent ou l'architecture construite pendant la formation",
          "Revue par les pairs : points forts, risques identifiés, pistes d'amélioration",
          "Discussion collective sur les cas d'usage les plus prometteurs dans chaque contexte",
          "Plan d'action individuel pour déployer en production dans les 30 jours"
        ]
      }
    ],
    "livrables": [
      "Un agent de développement personnalisé fonctionnel, construit pendant la formation",
      "Un serveur MCP déployé et connecté à un système réel",
      "Un guide d'architecture pour les systèmes multi-agents",
      "Un référentiel de sécurité et de gouvernance pour les agents en production",
      "Une attestation de participation ACT"
    ],
    "methode": "Formation de haut niveau orientée production. Les participants travaillent en mode projet sur 2 jours intensifs. Pas de cas fictifs — chacun construit quelque chose qu'il pourra déployer dans son contexte réel dès la semaine suivante. Échanges techniques entre pairs encouragés tout au long de la formation."
  }
];

export function getFormationBySlug(slug: string): Formation | undefined {
  return FORMATIONS.find(f => f.slug === slug);
}
