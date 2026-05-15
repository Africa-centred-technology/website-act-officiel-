import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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

// Root layout — owns <html> and <body>.
// [locale]/layout.tsx owns providers, Header, analytics scripts.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Preload LCP hero image (home page) */}
        <link rel="preload" as="image" href="/logo/logo_continent.png" fetchPriority="high" />
        {/* Preload Futura to eliminate FOUT on service pages */}
        <link rel="preload" as="font" href="/fonts/futura-medium.woff" type="font/woff" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 3 font families used via CSS variables — display=block avoids swap CLS */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=block"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased flex flex-col min-h-screen overflow-x-hidden"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        {children}
      </body>
    </html>
  );
}
