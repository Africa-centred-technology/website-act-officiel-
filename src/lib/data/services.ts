/* ══════════════════════════════════════════════════════
   ACT — Services Data (source unique de vérité)
   Mise à jour : fidèle à Présentation_ACT.docx
   ══════════════════════════════════════════════════════ */

export interface Service {
  slug: string;
  n: string;
  poleN: "I" | "II" | "III";
  accent: string;
  bg: string;
  icon: string;          // SVG path (viewBox 0 0 24 24)
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
    n: "01", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 20% 60%, #0D2040 0%, #050C18 55%, #030810 100%)",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    video: "https://cdn.pixabay.com/video/2019/05/06/23355-334950213_large.mp4",
    heroImage: "/images/services/Ingéneurie_logicielle.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 02 ─────────────────────────────────────────────── */
  {
    slug: "automatisation-ia",
    n: "02", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 90% at 80% 40%, #0A1F0D 0%, #050C18 55%, #030810 100%)",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2",
    video: "https://cdn.pixabay.com/video/2023/07/24/173103-848555583_large.mp4",
    heroImage: "/images/services/Agentic_AI.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 03 ─────────────────────────────────────────────── */
  {
    slug: "architecture-infrastructure",
    n: "03", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 85% 70% at 60% 80%, #150A2A 0%, #050C18 55%, #030810 100%)",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    video: "https://cdn.pixabay.com/video/2024/11/05/240062_large.mp4",
    heroImage: "/images/services/architerture.png",
    subImages: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 04 ─────────────────────────────────────────────── */
  {
    slug: "data-intelligence-artificielle",
    n: "04", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 30% 20%, #071A1A 0%, #050C18 55%, #030810 100%)",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    video: "https://cdn.pixabay.com/video/2020/01/30/31772-388253161_large.mp4",
    heroImage: "/images/services/big-data-and-et-artificial-intelligence.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 05 ─────────────────────────────────────────────── */
  {
    slug: "geomatique-sig",
    n: "05", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 80% 80% at 70% 70%, #1A1205 0%, #050C18 55%, #030810 100%)",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    video: "https://cdn.pixabay.com/video/2017/07/23/10854-226632941_large.mp4",
    heroImage: "/images/services/sig.jpg",
    subImages: [
      "/images/services/sig-1.jpg",
      "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 06 ─────────────────────────────────────────────── */
  {
    slug: "conseil-strategique",
    n: "06", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 85% 75% at 40% 50%, #1A1708 0%, #050C18 55%, #030810 100%)",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
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
    n: "07", poleN: "II", accent: GOLD,
    bg: "radial-gradient(ellipse 80% 80% at 75% 30%, #080F1A 0%, #050C18 55%, #030810 100%)",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    video: "https://cdn.pixabay.com/video/2024/03/01/202560-918431383_large.mp4",
    heroImage: "/images/poles/pole-conseil.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    ],
  },

  /* ── 09 ─────────────────────────────────────────────── */
  {
    slug: "catalogue-formations",
    n: "09", poleN: "III", accent: "#16a34a",
    bg: "radial-gradient(ellipse 90% 70% at 75% 25%, #0A1505 0%, #050C18 55%, #030810 100%)",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    video: "https://cdn.pixabay.com/video/2024/07/21/222279_large.mp4",
    heroImage: "/images/poles/pole-formation.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

export const POLE_I  = SERVICES.filter(s => s.poleN === "I");
export const POLE_II = SERVICES.filter(s => s.poleN === "II");
export const POLE_III = SERVICES.filter(s => s.poleN === "III");

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find(s => s.slug === slug);
}
