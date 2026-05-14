import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Africa Centred Technology | Engineering the Future",
  description:
    "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.",
  keywords: ["IA", "Afrique", "Transformation digitale", "Ingénierie", "Innovation", "Formation IA Maroc", "Conseil digital"],
  icons: {
    icon: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
  verification: {
    google: "iRIaR0ZtvBgQSDQPwMV4eOL0-Gajr88p6_t-qKfiSno",
  },
  metadataBase: new URL("https://www.a-ct.ma"),
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "https://www.a-ct.ma",
    siteName: "Africa Centred Technology",
    title: "Africa Centred Technology | Engineering the Future",
    description: "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.",
    images: [{ url: "/logo/logo.png", width: 1200, height: 630, alt: "ACT - Africa Centred Technology" }],
  },
};

// The [locale]/layout.tsx owns the <html>/<body> shell and all providers.
// This root layout is a required pass-through for next-intl's App Router setup.
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
