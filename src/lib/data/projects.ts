/* ══════════════════════════════════════════════════════
   DONNÉES PROJETS — source unique partagée entre
   la page liste /projects et les pages détail /projects/[slug]
   ══════════════════════════════════════════════════════ */

export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  categoryFull: string;
  tagline: string;
  description: string;
  descriptionLong: string;
  image: string;
  tags: string[];
  client: string;
  year: string;
  duration: string;
  results: { label: string; value: string }[];
  challenges: string[];
  approach: string;
  color: string; // accent couleur par projet
}

export const PROJECTS: Project[] = [
  {
    id: "rag",
    index: "01",
    title: "Système RAG Multi-sources",
    category: "IA",
    categoryFull: "Intelligence Artificielle",
    tagline: "Chatbot multimodal pour environnements à faible connectivité",
    description:
      "Chatbot multimodal capable de répondre à partir de documents, images, audio et vidéo grâce à un pipeline RAG et embeddings multimodaux.",
    descriptionLong: `Le Système RAG Multi-sources est une solution d'intelligence artificielle de pointe conçue pour transformer la manière dont les organisations africaines accèdent à leur base de connaissances. Contrairement aux chatbots traditionnels limités au texte, ce système ingère et indexe de manière transparente des documents PDF, des images, des fichiers audio et des vidéos dans un espace vectoriel unifié.

Le cœur du système repose sur un pipeline RAG (Retrieval-Augmented Generation) optimisé pour des environnements à connectivité variable. Grâce à pgvector, les embeddings multimodaux sont stockés localement, permettant des recherches sémantiques ultra-rapides même en mode hors-ligne partiel.

L'interface Streamlit permet aux équipes non-techniques de soumettre des questions en langage naturel et d'obtenir des réponses contextualisées avec les sources exactes citées — document, page, horodatage audio ou segment vidéo.`,
    image: "/realisationprojet/2025/systeme-rag-multi-sources.png",
    tags: ["RAG", "OpenAI GPT-5", "pgvector", "Streamlit", "Python", "FastAPI"],
    client: "ACT Lab",
    year: "2025",
    duration: "6 mois",
    results: [
      { label: "Recherche multimodale", value: "4 types de médias" },
      { label: "Indexation vectorielle", value: "< 50 ms / requête" },
      { label: "Pipeline robuste", value: "99.2% uptime" },
      { label: "Base documentaire", value: "10 000+ documents" },
    ],
    challenges: [
      "Indexation cohérente de médias hétérogènes (PDF, audio, vidéo, images)",
      "Performance de recherche en environnement à faible bande passante",
      "Précision des réponses avec citation des sources exactes",
    ],
    approach: `Notre approche s'est articulée en trois phases : d'abord la conception d'un schéma vectoriel unifié capable d'accueillir tous les types de médias, ensuite l'optimisation du pipeline RAG pour minimiser les appels API coûteux via un cache intelligent, et enfin la mise en place d'un système de scoring qui hiérarchise les sources par pertinence contextuelle.`,
    color: "#D35400",
  },
  {
    id: "cod",
    index: "02",
    title: "CODRescue",
    category: "E-commerce",
    categoryFull: "E-commerce & Logistique",
    tagline: "Gestion e-commerce avec dashboards temps réel",
    description:
      "Système de gestion e-commerce pour la préparation de commandes, logistique et supervision avec dashboards temps réel.",
    descriptionLong: `CODRescue est une plateforme de gestion opérationnelle e-commerce conçue pour les marchés africains où le paiement à la livraison (Cash On Delivery) domine. Le système adresse les défis spécifiques de la logistique last-mile : taux de retour élevés, dispersion géographique des livreurs, difficulté de suivi en temps réel.

La plateforme centralise l'ensemble du flux de commandes depuis la réception jusqu'à la livraison finale. Les superviseurs disposent de dashboards temps réel montrant l'état exact de chaque commande, la position des livreurs et les KPIs opérationnels clés (taux de livraison, temps moyen, retours).

Une couche d'IA assistée analyse les patterns de commandes pour prédire les zones de forte demande, optimiser les tournées de livraison et signaler proactivement les commandes à risque d'échec avant même la tentative de livraison.`,
    image: "/realisationprojet/2025/CODRescue-v2.png",
    tags: ["Django", "Tailwind", "PostgreSQL", "IA assistée", "Celery", "Redis"],
    client: "CODRescue",
    year: "2025",
    duration: "8 mois",
    results: [
      { label: "Process optimisés", value: "−40% temps de traitement" },
      { label: "Suivi logistique", value: "Temps réel GPS" },
      { label: "KPI temps réel", value: "15 métriques clés" },
      { label: "Taux de livraison", value: "+28% de succès" },
    ],
    challenges: [
      "Suivi GPS en temps réel sur des zones avec couverture réseau partielle",
      "Gestion des retours et réconciliation financière automatique",
      "Scalabilité pour gérer des pics de commandes (promotions, événements)",
    ],
    approach: `Nous avons adopté une architecture événementielle avec Celery/Redis pour le traitement asynchrone des mises à jour de position, garantissant une interface toujours réactive même sous forte charge. La couche IA repose sur des modèles de classification entraînés sur l'historique des commandes du client pour prédire les risques d'échec de livraison avec 84% de précision.`,
    color: "#F39C12",
  },
  {
    id: "sig",
    index: "03",
    title: "GreenSIG V1",
    category: "SIG",
    categoryFull: "Systèmes d'Information Géographique",
    tagline: "Cartographie interactive des espaces verts urbains",
    description:
      "Plateforme SIG de gestion des espaces verts avec cartographie interactive, planification et suivi des interventions.",
    descriptionLong: `GreenSIG V1 est une plateforme web de gestion des espaces verts urbains conçue pour les collectivités et sociétés d'aménagement paysager africaines. Elle répond à un besoin crucial : remplacer les feuilles de papier et tableurs Excel par un système géospatial centralisé et accessible depuis le terrain.

La cartographie interactive repose sur Leaflet.js avec des tuiles OpenStreetMap, permettant une visualisation précise de chaque espace vert (surface, type de végétation, état sanitaire). Les équipes terrain accèdent à l'application depuis leurs téléphones pour enregistrer les interventions avec géolocalisation automatique.

Le module de planification permet aux responsables de créer des programmes d'entretien récurrents, d'assigner des équipes par zone géographique et de suivre l'avancement en temps réel. Des alertes automatiques signalent les espaces dont l'entretien est en retard ou dont l'état nécessite une intervention urgente.`,
    image: "/realisationprojet/2026/GreenSIGapp.png",
    tags: ["React", "TypeScript", "Leaflet", "Tailwind", "Django", "GeoJSON"],
    client: "GreenSIG",
    year: "2026",
    duration: "5 mois",
    results: [
      { label: "Cartographie centralisée", value: "500+ espaces verts" },
      { label: "Gestion des équipes", value: "12 équipes terrain" },
      { label: "Inventaire optimisé", value: "−60% temps admin" },
      { label: "Couverture géographique", value: "3 villes pilotes" },
    ],
    challenges: [
      "Mode hors-ligne pour la saisie terrain en zone sans réseau",
      "Synchronisation des données géospatiales sans conflits",
      "Interface utilisable sur des téléphones d'entrée de gamme",
    ],
    approach: `La contrainte majeure était la résilience terrain : nous avons implémenté un Service Worker avec IndexedDB pour le stockage local des données et des tuiles cartographiques. La synchronisation différée garantit que les équipes peuvent travailler toute une journée hors-ligne et réconcilier les données au retour en zone de couverture.`,
    color: "#27AE60",
  },
  {
    id: "gam",
    index: "04",
    title: "GAM — Génies Afrique Médias",
    category: "Média",
    categoryFull: "Média & Éditorial",
    tagline: "Web TV panafricaine en architecture headless",
    description:
      "Plateforme média digitale panafricaine (Web TV + contenus éditoriaux) en architecture headless.",
    descriptionLong: `GAM (Génies Afrique Médias) est une plateforme média digitale panafricaine développée pour AFRITECK INSTITUT, combinant Web TV, articles éditoriaux et podcasts dans une expérience multimédia unifiée. L'ambition : devenir la référence du contenu tech et innovation en Afrique francophone.

L'architecture headless découple totalement le CMS éditorial (Django + Wagtail) du frontend de présentation (Next.js), permettant à l'équipe éditoriale de gérer les contenus sans aucune contrainte technique tout en offrant aux visiteurs des performances dignes des grands médias internationaux.

La Web TV intègre un player vidéo optimisé pour les connexions africaines avec adaptive bitrate streaming. Le système SEO est configuré spécifiquement pour Google News avec les balises structured data adéquates, les sitemaps dynamiques et les flux RSS — résultat : indexation sous 24h après publication.`,
    image: "/realisationprojet/2026/GAM-Genies-Afrique-Medias.png",
    tags: ["Next.js", "Django", "Wagtail", "PWA", "TypeScript", "Cloudinary"],
    client: "AFRITECK INSTITUT",
    year: "2026",
    duration: "7 mois",
    results: [
      { label: "CMS éditorial", value: "Interface no-code" },
      { label: "Web TV", value: "Adaptive streaming" },
      { label: "SEO Google News", value: "Indexation < 24h" },
      { label: "Couverture", value: "15 pays africains" },
    ],
    challenges: [
      "Streaming vidéo adaptatif pour des connexions 2G/3G africaines",
      "Workflow éditorial multi-auteurs avec validation avant publication",
      "Conformité Google News et référencement international",
    ],
    approach: `L'architecture headless était non-négociable pour la performance : Next.js en ISR (Incremental Static Regeneration) permet de servir les articles depuis le CDN tout en maintenant des contenus frais. Cloudinary gère l'optimisation automatique des images et vidéos selon le device et la connexion détectée.`,
    color: "#8E44AD",
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export const CATEGORIES = ["Tous", "IA", "E-commerce", "SIG", "Média"] as const;
