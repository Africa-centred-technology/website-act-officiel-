import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/* ── Content-Security-Policy ─────────────────────────────────────────────
   'unsafe-inline' est requis pour :
     • Scripts inline Next.js (__NEXT_DATA__, theme init, GTM/GA/Pixel)
     • Styles inline générés par Framer Motion à l'exécution
   Les domaines sont limités au strict nécessaire (Shopify, Google, Facebook).
   ─────────────────────────────────────────────────────────────────────── */
const CSP = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    "https://connect.facebook.net",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://ssl.google-analytics.com",
  ].join(" "),
  [
    "style-src 'self' 'unsafe-inline'",
    "https://fonts.googleapis.com",
  ].join(" "),
  [
    "img-src 'self' data: blob:",
    "https://images.unsplash.com",
    "https://res.cloudinary.com",
    "https://media.licdn.com",
    "https://cdn.pixabay.com",
    "https://cdn.shopify.com",
    "https://www.facebook.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ].join(" "),
  "font-src 'self' https://fonts.gstatic.com",
  [
    "media-src 'self'",
    "https://cdn.pixabay.com",
    "https://videos.pexels.com",
  ].join(" "),
  [
    "connect-src 'self'",
    "https://act-formation.myshopify.com",
    "https://api.resend.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://region1.analytics.google.com",
    "https://www.facebook.com",
    "https://connect.facebook.net",
  ].join(" "),
  "frame-src https://www.googletagmanager.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy",            value: CSP },
  { key: "X-Content-Type-Options",             value: "nosniff" },
  { key: "X-Frame-Options",                    value: "DENY" },
  { key: "Referrer-Policy",                    value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",                 value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security",          value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/llms.txt", destination: "/geo/llms.txt" },
      { source: "/llms-full.txt", destination: "/geo/llms-full.txt" },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "media.licdn.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
    // Shopify CDN pre-sizes images at 1400px — no need to generate larger breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600,
  },
};

export default withNextIntl(nextConfig);
