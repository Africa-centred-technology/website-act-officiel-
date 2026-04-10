import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie "standalone" : produit .next/standalone/server.js, idéal pour Docker
  // (image finale ~150 Mo au lieu de ~1 Go avec tout node_modules)
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
      { protocol: "https", hostname: "media.licdn.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
};

export default nextConfig;
