import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: false },
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
  },
  async redirects() {
    const ROUTES = [
      "about",
      "blog",
      "contact",
      "formations",
      "poles",
      "projects",
      "secteurs",
      "services",
    ];
    return [
      ...ROUTES.map((r) => ({
        source: `/${r}`,
        destination: `/fr/${r}`,
        permanent: true,
      })),
      ...ROUTES.map((r) => ({
        source: `/${r}/:path*`,
        destination: `/fr/${r}/:path*`,
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
