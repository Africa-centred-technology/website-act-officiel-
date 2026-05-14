import type { Metadata } from "next";
import { Lora, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const META_PIXEL_ID = "1550173629800746";

const GA_MEASUREMENT_IDS = ["G-5T0CM1FR5Q", "G-R21NYV01M2"];
const GTM_ID = "GTM-KD4MFQXX";


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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" suppressHydrationWarning className={`${lora.variable} ${poppins.variable}`}>
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className="antialiased flex flex-col min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_IDS[0]}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${GA_MEASUREMENT_IDS.map((id) => `gtag('config', '${id}');`).join("\n            ")}
          `}
        </Script>
        <ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
  return children;
}
