/* ══════════════════════════════════════════════════════
   DONNÉES PROJETS — source unique partagée entre
   la page liste /projects et les pages détail /projects/[slug]
   Text fields are now in i18n messages under projects.items.<id>
   ══════════════════════════════════════════════════════ */

export interface Project {
  id: string;    // utilisé comme clé i18n
  index: string; // "01"/"02"/...
  image: string;
  year: string;
  color: string; // accent couleur par projet
}

export const PROJECTS: Project[] = [
  {
    id: "rag",
    index: "01",
    image: "/realisationprojet/2025/systeme-rag-multi-sources.png",
    year: "2025",
    color: "#D35400",
  },
  {
    id: "cod",
    index: "02",
    image: "/realisationprojet/2025/cod-rescue-v2.png",
    year: "2025",
    color: "#F39C12",
  },
  {
    id: "sig",
    index: "03",
    image: "/realisationprojet/2026/green-sig-app.png",
    year: "2026",
    color: "#27AE60",
  },
  {
    id: "gam",
    index: "04",
    image: "/realisationprojet/2026/gam-genies-afrique-medias.png",
    year: "2026",
    color: "#8E44AD",
  },
];

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export const CATEGORIES = ["Tous", "IA", "E-commerce", "SIG", "Média"] as const;
