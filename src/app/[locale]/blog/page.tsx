import { Suspense } from "react";
import BlogShell from "@/components/blog/BlogShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.blog", path: "/blog" });
}

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
