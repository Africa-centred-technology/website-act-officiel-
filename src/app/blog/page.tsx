import { Suspense } from "react";
import BlogShell from "@/components/blog/BlogShell";

export const metadata = {
  title: "Blog — Africa Centred Technology",
  description:
    "Analyses, tendances et décryptages sur la tech africaine, l'IA, la cybersécurité, le cloud et l'innovation digitale. Insights publiés par les experts d'ACT.",
  keywords: [
    "blog tech Afrique",
    "IA Afrique",
    "cybersécurité Afrique",
    "cloud souverain",
    "startups africaines",
    "transformation digitale",
  ],
};

function BlogLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary, #0A1410)",
        color: "#fff",
      }}
      aria-label="Chargement du blog…"
    >
      <span style={{ opacity: 0.4, fontFamily: "Poppins, sans-serif", fontSize: "0.9rem" }}>
        Chargement…
      </span>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogShell />
    </Suspense>
  );
}
