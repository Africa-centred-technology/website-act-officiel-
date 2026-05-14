/**
 * Default formation page assets — structural (images / URLs / numbers).
 */

/* ── Pain point images (mapped by index) ── */
export const DEFAULT_PAIN_POINT_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
  "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
];

/* ── Audience card images (mapped by index) ── */
export const DEFAULT_AUDIENCE_CARD_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80",
];

/* ── Testimonial avatars (mapped by index) ── */
export const DEFAULT_TESTIMONIAL_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
];

/* ── Testimonial ratings (structural numbers) ── */
export const DEFAULT_TESTIMONIAL_RATINGS: number[] = [5, 5, 5];

/* ── Tools covered (brand names + accent colour — structural UI data) ── */
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

/* ── Pricing plan structural config (amounts/CTA types/featured flags) ── */
export interface PricingPlanStructural {
  amount: string;
  currency?: string;
  old_price?: string;
  cta_type: "inscription" | "contact" | "external";
  cta_url?: string;
  featured: boolean;
}

export function getDefaultPricingPlanStructural(): PricingPlanStructural[] {
  return [
    {
      amount: "Sur devis",
      currency: "MAD HT",
      cta_type: "inscription",
      featured: true,
    },
    {
      amount: "Sur devis",
      old_price: "Réponse sous 24h",
      cta_type: "contact",
      featured: false,
    },
    {
      amount: "Sur devis",
      old_price: "Réponse sous 24h",
      cta_type: "contact",
      featured: false,
    },
  ];
}

/* ── Places / session capacity (numeric structural) ── */
export const DEFAULT_PLACES_SESSION = {
  inscrits: 7,
  total: 12,
  restantes: 5,
};

/* ── Mid CTA structural links ── */
export const DEFAULT_MID_CTA_STRUCTURAL = {
  cta_primary_url: "#pricing",
  cta_ghost_url: "/contact",
  cta_dark_type: "inscription" as const,
};
