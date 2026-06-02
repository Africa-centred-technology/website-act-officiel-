export interface CaseStudy {
  id: string;
  color: string;
  pole: "I" | "II" | "III";
  image: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  { id: "ecommerce-logistique", color: "#9B59B6", pole: "I",   image: "/images/secteur/ecommerce.jpg" },
  { id: "ia-documentaire",      color: "#D35400", pole: "I",   image: "/images/secteur/Finance.jpg" },
  { id: "sig-collectivite",     color: "#27AE60", pole: "I",   image: "/images/secteur/Industrie.png" },
  { id: "formation-ia",         color: "#2980B9", pole: "III", image: "/images/secteur/education.jpg" },
  { id: "bi-reporting",         color: "#F39C12", pole: "II",  image: "/images/secteur/Sante.jpg" },
  { id: "media-panafricain",    color: "#8E44AD", pole: "I",   image: "/images/secteur/Telecoms-medias.png" },
];
