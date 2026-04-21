import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Sortie "standalone" : produit .next/standalone/server.js, idéal pour Docker
  // (image finale ~150 Mo au lieu de ~1 Go avec tout node_modules)
  output: "standalone",
  typescript: { ignoreBuildErrors: false },
  // Ancre Turbopack sur ce répertoire et non sur le workspace root (D:\bun.lock)
  // Évite le conflit multi-lockfile : bun.lock à D:\ résolvait Next.js 16.x
  // alors que ce projet installe une version différente.
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
};

export default nextConfig;
