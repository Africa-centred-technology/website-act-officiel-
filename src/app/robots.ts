import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Default ────────────────────────────────────────────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },

      // ── OpenAI (ChatGPT / GPT-4o search) ───────────────────────────────────
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ChatGPT-User",  allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },

      // ── Anthropic (Claude) ──────────────────────────────────────────────────
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "anthropic-ai",  allow: "/" },
      { userAgent: "Claude-Web",    allow: "/" },

      // ── Perplexity ──────────────────────────────────────────────────────────
      { userAgent: "PerplexityBot", allow: "/" },

      // ── Google (AI Overviews / Gemini) ──────────────────────────────────────
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot",       allow: "/" },

      // ── Meta (Llama / Meta AI) ──────────────────────────────────────────────
      { userAgent: "FacebookBot",  allow: "/" },

      // ── Microsoft (Copilot / Bing AI) ───────────────────────────────────────
      { userAgent: "Bingbot",      allow: "/" },

      // ── Cohere ─────────────────────────────────────────────────────────────
      { userAgent: "cohere-ai",    allow: "/" },

      // ── Common Crawl (base d'entraînement de nombreux LLMs) ────────────────
      { userAgent: "CCBot",        allow: "/" },

      // ── You.com ────────────────────────────────────────────────────────────
      { userAgent: "YouBot",       allow: "/" },
    ],
    sitemap: "https://www.a-ct.ma/sitemap.xml",
  };
}
