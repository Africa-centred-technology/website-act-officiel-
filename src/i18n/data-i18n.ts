import { useMessages } from "next-intl";
import { getMessages } from "next-intl/server";

export type PoleI18n = {
  title: string;
  titleWithBreaks: string;
  tagline: string;
  tag: string;
  description: string;
  desc: string;
  stats: { left: string; leftLabel: string; right: string; rightLabel: string };
};

export type ServiceSubI18n = { title: string; desc: string };

export type ServiceI18n = {
  pole: string;
  title: string;
  tagline: string;
  intro: string;
  subs: ServiceSubI18n[];
  benefits: string[];
  deliverables: string[];
};

export type ProjectResultI18n = { label: string; value: string };

export type ProjectI18n = {
  title: string;
  category: string;
  categoryFull: string;
  tagline: string;
  description: string;
  descriptionLong: string;
  tags: string[];
  client: string;
  duration: string;
  results: ProjectResultI18n[];
  challenges: string[];
  approach: string;
};

export type SecteurI18n = {
  label: string;
  tagline: string;
  description: string;
  services: string[];
  chiffre?: { label: string };
};

export type FormationsDefaultsI18n = {
  marquee: string[];
  trustStats: Array<{ value: string; label: string }>;
  painPoints: Array<{ num: string; title: string; text: string }>;
  valueRoi: {
    bigStat: string;
    bigStatLabel: string;
    secondary: Array<{ value: string; label: string }>;
  };
  audienceCards: Array<{ icon: string; title: string }>;
  testimonials: Array<{ quote: string; name: string; role: string }>;
  pricingPlans: Array<{
    name: string;
    title: string;
    description: string;
    features: string[];
    ctaLabel: string;
    badge?: string;
  }>;
  faqItems: Array<{ question: string; answer: string }>;
  midCta: {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    text: string;
    ctaPrimary: { label: string; url: string };
    ctaGhost: { label: string; url: string };
    ctaDark: { label: string };
  };
  finalCta: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleHighlight: string;
    titleSuffix: string;
    text: string;
    primaryLabel: string;
    ghostLabel: string;
  };
  prixBarre: string;
};

export type DataMessages = {
  poles:      { items: Record<string, PoleI18n> };
  services:   { items: Record<string, ServiceI18n> };
  projects:   { items: Record<string, ProjectI18n> };
  secteurs:   { items: Record<string, SecteurI18n> };
  formations: { defaults: FormationsDefaultsI18n };
};

export function useDataMessages(): DataMessages {
  return useMessages() as unknown as DataMessages;
}

export async function getDataMessages(): Promise<DataMessages> {
  return (await getMessages()) as unknown as DataMessages;
}
