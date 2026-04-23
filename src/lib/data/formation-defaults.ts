/**
 * Valeurs par défaut partagées par TOUTES les formations.
 *
 * Ces contenus sont identiques pour chaque fiche formation — ils vivent dans
 * le code (pas dans Shopify) pour éviter de dupliquer la saisie par produit.
 *
 * Si une formation a besoin d'un contenu spécifique (témoignage métier, FAQ
 * sectorielle), on pourra plus tard ajouter un metafield `custom.X_override`
 * qui remplacerait la valeur par défaut.
 */

/* ── 1. Marquee (social proof défilant) ──────────────────── */
export const DEFAULT_MARQUEE_ITEMS: string[] = [
  "Formation certifiée Qualiopi",
  "+400 professionnels formés",
  "Note 4,9/5 sur 213 avis",
  "Finançable CPF & OPCO",
  "Partenaire OpenAI & Anthropic",
  "97% recommandent",
  "32 entreprises clientes",
];

/* ── 2. Trust stats du hero (4 chiffres) ─────────────────── */
export const DEFAULT_TRUST_STATS = [
  { value: "+400",     label: "Pros formés" },
  { value: "4,9/5",    label: "Satisfaction" },
  { value: "97%",      label: "Recommandent" },
  { value: "Qualiopi", label: "Certifiée" },
];

/* ── 3. Pain points (3 cards) ────────────────────────────── */
export const DEFAULT_PAIN_POINTS = [
  {
    num: "01",
    title: "Submergé par les outils ?",
    text: "ChatGPT, Claude, Gemini, Copilot... impossible de savoir par où commencer.",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
  },
  {
    num: "02",
    title: "Prompts qui ne marchent pas ?",
    text: "Vous testez, mais les réponses restent génériques. Plus de temps perdu que gagné.",
    image_url: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&q=80",
  },
  {
    num: "03",
    title: "Équipe qui décroche ?",
    text: "Certains adoptent, d'autres résistent. Pas de méthode commune, risque RGPD.",
    image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
  },
];

/* ── 4. Stats ROI de la section Value ────────────────────── */
export const DEFAULT_VALUE_ROI = {
  big_stat: "10h",
  big_stat_label: "récupérées / semaine",
  secondary: [
    { value: "×4",   label: "vitesse de rédaction" },
    { value: "-60%", label: "temps d'analyse" },
  ],
};

/* ── 5. Outils couverts (pills défilantes) ────────────────── */
export const DEFAULT_TOOLS_COVERED = {
  row1: [
    { name: "ChatGPT" },
    { name: "Claude" },
    { name: "Gemini", color: "gold" as const },
    { name: "Perplexity" },
    { name: "Copilot 365" },
    { name: "Notion AI", color: "gold" as const },
    { name: "Gamma" },
    { name: "Midjourney" },
    { name: "Freepik IA" },
    { name: "Luma", color: "gold" as const },
  ],
  row2: [
    { name: "Zapier" },
    { name: "Make", color: "gold" as const },
    { name: "n8n" },
    { name: "ElevenLabs" },
    { name: "Heygen" },
    { name: "Suno", color: "gold" as const },
    { name: "Canva IA" },
    { name: "GPTs sur-mesure" },
    { name: "RAG interne", color: "gold" as const },
    { name: "Agents Claude" },
  ],
};

/* ── 6. Audience fallback (4 profils génériques) ─────────── */
export const DEFAULT_AUDIENCE_CARDS = [
  { icon: "01", title: "Dirigeants\n& CODIR",         img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80" },
  { icon: "02", title: "Managers\n& chefs de projet", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" },
  { icon: "03", title: "Marketing\n& communication",  img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
  { icon: "04", title: "Consultants\n& freelances",   img: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80" },
];

/* ── 7. Témoignages (3 cards) ────────────────────────────── */
export const DEFAULT_TESTIMONIALS = [
  {
    quote: "J'ai divisé par trois le temps passé sur mes comptes-rendus hebdo. Rentabilisé en 10 jours.",
    name: "Samira Bennani",
    role: "Directrice Marketing · Casablanca",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    rating: 5,
  },
  {
    quote: "Zéro blabla, du concret dès la première heure. Je repars avec mes propres prompts qui tournent.",
    name: "Youssef Kabbaj",
    role: "Consultant stratégie · Rabat",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
  },
  {
    quote: "Formé 18 personnes en intra. +22% de productivité mesurés sur le pôle six mois plus tard.",
    name: "Fatima Ouali",
    role: "DRH · Groupe industriel · Tanger",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
    rating: 5,
  },
];

/* ── 8. Pricing (3 formules par défaut) ──────────────────── */
export interface PricingPlan {
  name: string;
  title: string;
  description: string;
  amount: string;
  currency?: string;
  old_price?: string;
  features: string[];
  cta_label: string;
  cta_type: "inscription" | "contact" | "external";
  cta_url?: string;
  featured: boolean;
  badge?: string;
}

export function getDefaultPricingPlans(productPrice?: string): PricingPlan[] {
  return [
    {
      name: "Formule 01",
      title: "Essentiel",
      description: "En distanciel live · petit groupe · idéal pour découvrir.",
      amount: "3 200",
      currency: "MAD HT",
      old_price: "Prix public 4 200 MAD",
      features: [
        "2 jours · 14h de live",
        "Jusqu'à 12 participants",
        "Tous les templates & prompts",
        "Agent GPT personnalisé",
        "Certification ACT",
        "Accès replay 6 mois",
      ],
      cta_label: "Réserver ma place",
      cta_type: "inscription",
      featured: false,
    },
    {
      name: "Formule 02",
      title: "Pro · Présentiel",
      description: "À Casablanca · 2 jours en présentiel · coaching individuel inclus.",
      amount: productPrice || "4 900",
      currency: "MAD HT",
      old_price: "Prix public 6 500 MAD · -25%",
      features: [
        "Tout ce qui est dans Essentiel",
        "Formation en présentiel · Casablanca",
        "1h de coaching 1-to-1 post-formation",
        "Audit de vos tâches (avant J1)",
        "Suivi privé Slack · 30 jours",
        "Session Q&R live à J+30",
        "Déjeuners inclus",
      ],
      cta_label: "Réserver · -25%",
      cta_type: "inscription",
      featured: true,
      badge: "★ Le plus choisi",
    },
    {
      name: "Formule 03",
      title: "Intra · Équipe",
      description: "Dans vos locaux · sur-mesure · à partir de 6 personnes.",
      amount: "Sur devis",
      old_price: "Réponse sous 24h",
      features: [
        "Programme sur-mesure · votre secteur",
        "Vos cas métier réels en atelier",
        "Audit IA des process avant démarrage",
        "Formation de formateurs en option",
        "Rapport de recommandations post-formation",
        "Suivi 90 jours inclus",
      ],
      cta_label: "Demander un devis",
      cta_type: "contact",
      featured: false,
    },
  ];
}

/* ── 9. FAQ (6 Q/R par défaut) ───────────────────────────── */
export interface FaqItem {
  question: string;
  answer: string;
}

export function getDefaultFaqItems(prerequis?: string): FaqItem[] {
  return [
    {
      question: "Je suis débutant total. Est-ce que je vais suivre ?",
      answer: `Oui — ${prerequis || "aucun prérequis n'est demandé"}. 60% de nos stagiaires découvrent ChatGPT le jour 1. Dès le jour 2, ils construisent leur propre agent GPT.`,
    },
    {
      question: "Combien de temps avant de voir un retour sur investissement ?",
      answer: "En moyenne, nos stagiaires récupèrent 10h par semaine dès la première semaine. Le prix de la formule Pro est rentabilisé en moins de deux semaines.",
    },
    {
      question: "Est-ce que c'est finançable par mon OPCO / CPF ?",
      answer: "Oui. ACT est organisme Qualiopi. Nous préparons le dossier avec vous et vos OPCO / le CPF. Délai moyen : 7 à 15 jours.",
    },
    {
      question: "Et si je ne peux pas venir à Casablanca ?",
      answer: "La formule Essentiel se déroule 100% en distanciel, en live avec le formateur et un petit groupe (max 12).",
    },
    {
      question: "Et le RGPD / les données sensibles ?",
      answer: "Un module complet est dédié à l'usage éthique et conforme : RGPD, IA Act, paramètres confidentialité des outils, alternatives on-premise.",
    },
    {
      question: "Si je ne suis pas satisfait ?",
      answer: "Garantie satisfait ou remboursé à la fin du jour 1. Si à la pause déjeuner, la formation ne correspond pas à vos attentes, nous vous remboursons intégralement.",
    },
  ];
}

/* ── 10. Mid CTA (bannière intermédiaire) ────────────────── */
export const DEFAULT_MID_CTA = {
  eyebrow: "Offre de lancement",
  title_prefix: "Session en cours ·",
  title_highlight: "5 places",
  title_suffix: "restantes.",
  text: "Si vous hésitez, la meilleure chose à faire : bloquer un appel découverte gratuit de 15 minutes.",
  cta_primary: { label: "Voir les tarifs", url: "#pricing" },
  cta_ghost:   { label: "Appel découverte · 15 min", url: "/contact" },
  cta_dark:    { label: "Je m'inscris", type: "inscription" as const },
};

/* ── 11. Final CTA (fermeture page) ──────────────────────── */
export const DEFAULT_FINAL_CTA = {
  eyebrow: "5 places restantes",
  title_line1: "Votre équipe sera formée",
  title_line2: "à l'IA. ",
  title_highlight: "Avec vous",
  title_suffix: ", ou sans vous.",
  text: "Chaque semaine sans formation = 10h de productivité perdues à chaque membre de votre équipe.",
  primary_label: "Je réserve ma place maintenant",
  ghost_label: "Planifier un appel 15 min",
  guarantee: "Garantie satisfait ou remboursé · Qualiopi · CPF / OPCO",
};

/* ── 12. Places session (product card) ───────────────────── */
export const DEFAULT_PLACES_SESSION = {
  inscrits: 7,
  total: 12,
  restantes: 5,
};

export const DEFAULT_PRIX_BARRE = "6 500 MAD HT";
