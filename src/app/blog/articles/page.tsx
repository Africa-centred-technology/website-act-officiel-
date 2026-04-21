import { Suspense } from "react";
import BlogArticlesShell from "../../../components/blog/BlogArticlesShell";

export const metadata = {
  title: "Articles — Africa Centred Technology",
  description:
    "Tous les articles du blog ACT — explorez par rubrique les dernières analyses tech africaines, IA, cybersécurité, cloud et innovation digitale.",
};

function ArticlesLoading() {
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
      aria-label="Chargement des articles…"
    >
      <span style={{ opacity: 0.5, fontFamily: "Poppins, sans-serif", fontSize: "0.9rem" }}>
        Chargement…
      </span>
    </div>
  );
}

export default function BlogArticlesPage() {
  return (
    <Suspense fallback={<ArticlesLoading />}>
      <BlogArticlesShell />
    </Suspense>
  );
}
