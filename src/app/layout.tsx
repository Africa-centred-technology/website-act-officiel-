import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Africa Centred Technology | Engineering the Future",
  description:
    "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.",
  keywords: ["IA", "Afrique", "Transformation digitale", "Ingénierie", "Innovation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="antialiased flex flex-col min-h-screen bg-[#0A1410] text-white overflow-x-hidden">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
