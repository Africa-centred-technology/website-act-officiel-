import { Suspense } from "react";
import BlogArticlesShell from "../../../../components/blog/BlogArticlesShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.blog", path: "/blog/articles" });
}

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
