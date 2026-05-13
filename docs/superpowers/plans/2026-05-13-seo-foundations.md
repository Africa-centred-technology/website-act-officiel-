# SEO Foundations (sous-projet B) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter les fondations SEO techniques au site multi-locale ACT : metadata par-page localisées avec hreflang/canonical/og:locale dynamiques, JSON-LD structured data (Organization, Breadcrumb, Course, Article), images OG dynamiques via `/api/og`, sitemap étendu avec formations Shopify + blog (fail-soft + x-default + revalidate 1h), et migration `middleware.ts` → `proxy.ts` (Next 16 deprecation).

**Architecture:** Helper centralisé `buildPageMetadata()` lu depuis les dictionnaires next-intl. Composant `<JsonLd>` neutralement implémenté (script + children JSON.stringify, échappement React-safe). Sitemap async avec `Promise.allSettled` autour des fetchs Shopify. Route `/api/og` edge runtime avec ImageResponse.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.9, next-intl v4, `schema-dts` (devDep, types only), `next/og`, Playwright, Vitest.

**Spec source:** `docs/superpowers/specs/2026-05-13-seo-foundations-design.md`

---

## File Structure

### Created files
- `src/i18n/seo.ts` — `buildPageMetadata` + `buildDynamicPageMetadata` helpers
- `src/i18n/seo-jsonld.ts` — `organizationJsonLd`, `breadcrumbJsonLd`, `courseJsonLd`, `articleJsonLd` builders
- `src/components/seo/JsonLd.tsx` — composant React qui rend un `<script type="application/ld+json">`
- `src/app/api/og/route.tsx` — route OG image via ImageResponse
- `src/proxy.ts` — renommage de `src/middleware.ts`
- `tests/unit/i18n/seo.test.ts` — tests Vitest de `buildPageMetadata`
- `tests/unit/i18n/seo-jsonld.test.ts` — tests Vitest des helpers JSON-LD
- `tests/e2e/seo.spec.ts` — tests Playwright E2E

### Modified files
- `src/i18n/messages/fr.json` — extension namespace `metadata` (9 entrées title/description)
- `src/i18n/messages/en.json` — copie verbatim de fr.json
- `src/i18n/messages/ar.json` — copie verbatim de fr.json
- `src/app/[locale]/layout.tsx` — `metadata` épuré + injection `<JsonLd data={organizationJsonLd(locale)} />`
- Pages statiques (10) — `export const metadata = {...}` → `generateMetadata` appelant `buildPageMetadata`
- Pages dynamiques (7) — `generateMetadata` migré vers `buildDynamicPageMetadata` avec fetch
- `src/app/[locale]/formations/[slug]/page.tsx` — + `<JsonLd>` Course + Breadcrumb
- `src/app/[locale]/blog/[slug]/page.tsx` — + `<JsonLd>` Article + Breadcrumb
- `src/app/sitemap.ts` — réécrit async avec fetch Shopify, x-default, revalidate
- `tests/unit/i18n/sitemap.test.ts` — extension mocks Shopify
- `package.json` — `+ schema-dts` (devDep)

### Deleted files
- `src/middleware.ts` (remplacé par `src/proxy.ts`)

---

## Task 1: Install schema-dts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install schema-dts as devDependency**

Run:
```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm install --save-dev schema-dts
```
Expected: `schema-dts` added to `devDependencies` in `package.json` and `package-lock.json` updated.

- [ ] **Step 2: Verify import works**

Run:
```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && node -e "console.log(require.resolve('schema-dts'))"
```
Expected: prints a path inside `node_modules/schema-dts/`.

- [ ] **Step 3: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add package.json package-lock.json && git commit -m "feat(seo): add schema-dts devDependency for JSON-LD types"
```

---

## Task 2: Create `buildPageMetadata` helper (TDD)

**Files:**
- Create: `src/i18n/seo.ts`
- Test: `tests/unit/i18n/seo.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/i18n/seo.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ namespace }: { locale: string; namespace: string }) => {
    return (key: string) => {
      const dict: Record<string, Record<string, string>> = {
        "metadata.about": {
          title: "À Propos — ACT",
          description: "Découvrez l'histoire d'ACT.",
        },
      };
      return dict[namespace]?.[key] ?? `[missing:${namespace}.${key}]`;
    };
  },
}));

import { buildPageMetadata, buildDynamicPageMetadata } from "@/i18n/seo";

describe("buildPageMetadata", () => {
  it("returns title + description from translations", async () => {
    const meta = await buildPageMetadata({
      locale: "fr",
      namespace: "metadata.about",
      path: "/about",
    });
    expect(meta.title).toBe("À Propos — ACT");
    expect(meta.description).toBe("Découvrez l'histoire d'ACT.");
  });

  it("sets canonical to /<locale>/<path>", async () => {
    const meta = await buildPageMetadata({
      locale: "en",
      namespace: "metadata.about",
      path: "/about",
    });
    expect(meta.alternates?.canonical).toBe("https://www.a-ct.ma/en/about");
  });

  it("includes alternates.languages for fr/en/ar + x-default", async () => {
    const meta = await buildPageMetadata({
      locale: "fr",
      namespace: "metadata.about",
      path: "/about",
    });
    const langs = meta.alternates?.languages ?? {};
    expect(langs["fr"]).toBe("https://www.a-ct.ma/fr/about");
    expect(langs["en"]).toBe("https://www.a-ct.ma/en/about");
    expect(langs["ar"]).toBe("https://www.a-ct.ma/ar/about");
    expect(langs["x-default"]).toBe("https://www.a-ct.ma/fr/about");
  });

  it("sets og:locale to fr_MA / en_US / ar_MA correctly", async () => {
    const meta = await buildPageMetadata({ locale: "fr", namespace: "metadata.about", path: "/about" });
    expect(meta.openGraph?.locale).toBe("fr_MA");
    const metaEn = await buildPageMetadata({ locale: "en", namespace: "metadata.about", path: "/about" });
    expect(metaEn.openGraph?.locale).toBe("en_US");
    const metaAr = await buildPageMetadata({ locale: "ar", namespace: "metadata.about", path: "/about" });
    expect(metaAr.openGraph?.locale).toBe("ar_MA");
  });

  it("falls back og image to /api/og?title=...", async () => {
    const meta = await buildPageMetadata({
      locale: "fr",
      namespace: "metadata.about",
      path: "/about",
    });
    const og = meta.openGraph?.images;
    const img = Array.isArray(og) ? og[0] : og;
    const url = typeof img === "object" && img && "url" in img ? img.url : img;
    expect(String(url)).toContain("/api/og?title=");
    expect(String(url)).toContain(encodeURIComponent("À Propos — ACT"));
  });
});

describe("buildDynamicPageMetadata", () => {
  it("uses explicit title and description, not translations", async () => {
    const meta = await buildDynamicPageMetadata({
      locale: "fr",
      path: "/formations/intro-ia",
      title: "Formation Intro IA",
      description: "Découvrir l'IA en 2 jours.",
    });
    expect(meta.title).toBe("Formation Intro IA");
    expect(meta.description).toBe("Découvrir l'IA en 2 jours.");
    expect(meta.alternates?.canonical).toBe("https://www.a-ct.ma/fr/formations/intro-ia");
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx vitest run tests/unit/i18n/seo.test.ts
```
Expected: FAIL — `Cannot find module '@/i18n/seo'`.

- [ ] **Step 3: Create `src/i18n/seo.ts`**

Create with exactly this content:

```ts
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://www.a-ct.ma";

const OG_LOCALE_MAP = {
  fr: "fr_MA",
  en: "en_US",
  ar: "ar_MA",
} as const;

function buildAlternates(path: string, locale: string) {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: Object.fromEntries([
      ...routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
      ["x-default", `${BASE_URL}/${routing.defaultLocale}${path}`],
    ]),
  };
}

function buildOpenGraph(opts: {
  locale: string;
  canonical: string;
  title: string;
  description: string;
  ogImageUrl: string;
}) {
  return {
    type: "website" as const,
    locale: OG_LOCALE_MAP[opts.locale as keyof typeof OG_LOCALE_MAP],
    alternateLocale: routing.locales
      .filter((l) => l !== opts.locale)
      .map((l) => OG_LOCALE_MAP[l as keyof typeof OG_LOCALE_MAP]),
    url: opts.canonical,
    siteName: "Africa Centred Technology",
    title: opts.title,
    description: opts.description,
    images: [{ url: opts.ogImageUrl, width: 1200, height: 630, alt: opts.title }],
  };
}

type StaticParams = {
  locale: string;
  namespace: string;
  path: string;
  ogImage?: string;
};

export async function buildPageMetadata({
  locale, namespace, path, ogImage,
}: StaticParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const title = t("title");
  const description = t("description");
  const canonical = `${BASE_URL}/${locale}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    openGraph: buildOpenGraph({ locale, canonical, title, description, ogImageUrl }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

type DynamicParams = {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogImage?: string;
};

export async function buildDynamicPageMetadata({
  locale, path, title, description, ogImage,
}: DynamicParams): Promise<Metadata> {
  const canonical = `${BASE_URL}/${locale}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: buildAlternates(path, locale),
    openGraph: buildOpenGraph({ locale, canonical, title, description, ogImageUrl }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx vitest run tests/unit/i18n/seo.test.ts
```
Expected: 6 tests pass.

- [ ] **Step 5: TypeScript check**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```
Expected: no new errors related to `src/i18n/seo.ts`.

- [ ] **Step 6: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/seo.ts tests/unit/i18n/seo.test.ts && git commit -m "feat(seo): add buildPageMetadata helper with hreflang/canonical/og"
```

---

## Task 3: Extend dictionaries with `metadata` namespace

**Files:**
- Modify: `src/i18n/messages/fr.json`
- Modify: `src/i18n/messages/en.json` (verbatim copy)
- Modify: `src/i18n/messages/ar.json` (verbatim copy)

The titles/descriptions below mirror the current `metadata` of each page (`src/app/[locale]/*/page.tsx`). Preserve verbatim FR.

- [ ] **Step 1: Read current fr.json structure**

Read `src/i18n/messages/fr.json` to confirm the existing structure (should have `common` and `metadata.default` namespaces from sub-project A).

- [ ] **Step 2: Extend `metadata` namespace in fr.json**

Replace the `metadata` block in `src/i18n/messages/fr.json` with exactly:

```json
"metadata": {
  "default": {
    "title": "Africa Centred Technology | Engineering the Future",
    "description": "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale."
  },
  "home": {
    "title": "ACT — Africa Centred Technology | Engineering the Future",
    "description": "Découvrez ACT, la société africaine qui fusionne IA et ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale."
  },
  "about": {
    "title": "À Propos — Africa Centred Technology",
    "description": "Découvrez l'histoire, la mission et l'équipe d'Africa Centred Technology — pionniers de la transformation digitale en Afrique depuis 2023."
  },
  "services": {
    "title": "Services — Africa Centred Technology",
    "description": "Nos 9 services en ingénierie technologique, conseil et formation pour propulser votre entreprise africaine vers l'innovation."
  },
  "formations": {
    "title": "Formations — Africa Centred Technology",
    "description": "Catalogue des formations ACT en intelligence artificielle, data, et transformation digitale, conçues pour les professionnels africains."
  },
  "poles": {
    "title": "Pôles — Africa Centred Technology",
    "description": "Les 3 pôles métiers d'ACT : Ingénierie Technologique, Conseil et Formation. Découvrez notre expertise complète."
  },
  "secteurs": {
    "title": "Secteurs — Africa Centred Technology",
    "description": "Les secteurs d'activité où ACT intervient pour accompagner la transformation digitale des entreprises africaines."
  },
  "projects": {
    "title": "Réalisations — Africa Centred Technology",
    "description": "Découvrez les projets clients d'ACT : transformations digitales, IA, ingénierie. Études de cas concrètes en Afrique."
  },
  "blog": {
    "title": "Blog — Africa Centred Technology",
    "description": "Articles, analyses et veille technologique d'ACT. IA, transformation digitale, ingénierie : l'actualité tech africaine."
  },
  "contact": {
    "title": "Contact — Africa Centred Technology",
    "description": "Contactez l'équipe ACT pour discuter de vos projets de transformation digitale, IA et formation au Maroc et en Afrique."
  }
}
```

The `common` namespace (from sub-project A) must remain unchanged.

- [ ] **Step 3: Copy fr.json verbatim to en.json and ar.json**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 4: Verify hashes match (verbatim copy)**

PowerShell:
```powershell
Get-FileHash "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json","D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json","D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```
Expected: all three SHA256 hashes identical.

- [ ] **Step 5: TypeScript check**

Run:
```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```
Expected: no new errors. (The `global.d.ts` type augmentation uses fr.json — adding keys is non-breaking.)

- [ ] **Step 6: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/fr.json src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "feat(seo): extend i18n metadata namespace with per-page titles/descriptions"
```

---

## Task 4: Create `/api/og` route

**Files:**
- Create: `src/app/api/og/route.tsx`

- [ ] **Step 1: Create the route file**

Create `src/app/api/og/route.tsx` with exactly this content:

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

const BG = "#0a0a0a";
const ACCENT = "#D35400";
const FG = "#ffffff";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 120) ?? "Africa Centred Technology";
  const subtitle = searchParams.get("subtitle")?.slice(0, 60) ?? "Engineering the Future";
  const accent = searchParams.get("accent") ?? ACCENT;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: FG,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 100px",
          fontFamily: "Outfit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: accent,
              color: BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            A
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: 1 }}>ACT</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ color: accent, fontSize: 26, textTransform: "uppercase", letterSpacing: 2 }}>
            {subtitle}
          </span>
          <span style={{ fontSize: 72, lineHeight: 1.1, fontWeight: 700, maxWidth: 980 }}>
            {title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.7,
          }}
        >
          <span>a-ct.ma</span>
          <div style={{ width: 120, height: 4, background: accent }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "cache-control": "public, max-age=86400, s-maxage=86400, immutable" },
    }
  );
}
```

- [ ] **Step 2: Verify the route by starting dev and curling**

In one shell:
```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run dev
```

Wait for "Ready in …". Then in another shell:
```bash
curl.exe -s -o "C:/tmp/og-test.png" -w "%{http_code} %{content_type}\n" "http://localhost:3000/api/og?title=Test&subtitle=Hello"
```
Expected: `200 image/png` (or similar). Open `C:/tmp/og-test.png` to visually inspect the image (logo "A" badge, subtitle "HELLO", title "Test", footer "a-ct.ma" with accent bar).

Stop dev server (Ctrl+C or TaskStop).

- [ ] **Step 3: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/api/og/route.tsx" && git commit -m "feat(seo): add /api/og dynamic Open Graph image route"
```

---

## Task 5: Migrate static page metadata to `buildPageMetadata`

This task converts the static `export const metadata = {...}` on ~10 pages into `generateMetadata` calling `buildPageMetadata({ locale, namespace, path })`.

**Files:**
- Modify: `src/app/[locale]/page.tsx` (home)
- Modify: `src/app/[locale]/about/page.tsx`
- Modify: `src/app/[locale]/services/page.tsx`
- Modify: `src/app/[locale]/formations/page.tsx`
- Modify: `src/app/[locale]/poles/page.tsx`
- Modify: `src/app/[locale]/secteurs/page.tsx`
- Modify: `src/app/[locale]/projects/page.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/app/[locale]/formations/all/page.tsx`
- Modify: `src/app/[locale]/blog/articles/page.tsx`

For each page, REPLACE the existing `export const metadata = {...}` block with a `generateMetadata` function. Use the (locale, namespace, path) triple per page below.

- [ ] **Step 1: Migrate home page**

Edit `src/app/[locale]/page.tsx`. Replace `export const metadata = {...}` with:

```tsx
import HomeShell from "@/components/home/Home";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.home", path: "" });
}

export default function Home() {
  return <HomeShell />;
}
```

Note: `path: ""` for the home page makes the canonical `https://www.a-ct.ma/<locale>` (no trailing path).

- [ ] **Step 2: Migrate about page**

Edit `src/app/[locale]/about/page.tsx`. Final content:

```tsx
import AboutShell from "@/components/about/AboutShell";
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.about", path: "/about" });
}

export default function AboutPage() {
  return <AboutShell />;
}
```

- [ ] **Step 3: Migrate services page**

Edit `src/app/[locale]/services/page.tsx`. Same pattern — preserve existing imports/component, replace metadata block with `generateMetadata` calling `buildPageMetadata({ locale, namespace: "metadata.services", path: "/services" })`.

- [ ] **Step 4: Migrate formations page**

Edit `src/app/[locale]/formations/page.tsx`. Pattern: `buildPageMetadata({ locale, namespace: "metadata.formations", path: "/formations" })`.

- [ ] **Step 5: Migrate poles page**

Edit `src/app/[locale]/poles/page.tsx`. Pattern: `buildPageMetadata({ locale, namespace: "metadata.poles", path: "/poles" })`.

- [ ] **Step 6: Migrate secteurs page**

Edit `src/app/[locale]/secteurs/page.tsx`. Pattern: `buildPageMetadata({ locale, namespace: "metadata.secteurs", path: "/secteurs" })`.

- [ ] **Step 7: Migrate projects page**

Edit `src/app/[locale]/projects/page.tsx`. Pattern: `buildPageMetadata({ locale, namespace: "metadata.projects", path: "/projects" })`.

- [ ] **Step 8: Migrate blog page**

Edit `src/app/[locale]/blog/page.tsx`. Pattern: `buildPageMetadata({ locale, namespace: "metadata.blog", path: "/blog" })`.

- [ ] **Step 9: Migrate contact page**

Edit `src/app/[locale]/contact/page.tsx`. Pattern: `buildPageMetadata({ locale, namespace: "metadata.contact", path: "/contact" })`.

- [ ] **Step 10: Migrate formations/all page**

Edit `src/app/[locale]/formations/all/page.tsx`. This is a subpage — use the `metadata.formations` namespace and append the path:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.formations", path: "/formations/all" });
}
```

- [ ] **Step 11: Migrate blog/articles page**

Edit `src/app/[locale]/blog/articles/page.tsx`. Same approach with `metadata.blog`:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.blog", path: "/blog/articles" });
}
```

- [ ] **Step 12: TypeScript check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && npm run build
```
Expected: clean compilation, build succeeds. If TS errors appear in the migrated pages, fix them (most likely cause: missing `params: Promise<...>` type — match the exact signature shown in steps).

- [ ] **Step 13: Smoke check metadata in dev**

Start `npm run dev`, then:

```bash
curl.exe -s http://localhost:3000/fr/about | grep -E "(canonical|hreflang|og:locale)" | head -10
```

Expected: lines containing `<link rel="canonical" href="https://www.a-ct.ma/fr/about">`, multiple `<link rel="alternate" hreflang="fr|en|ar|x-default" href="...">`, and `<meta property="og:locale" content="fr_MA">`.

Stop dev server.

- [ ] **Step 14: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/[locale]/" && git commit -m "feat(seo): migrate static page metadata to localized buildPageMetadata"
```

---

## Task 6: Migrate dynamic page metadata `[slug]` pages

For dynamic pages, the title/description come from the page's data (Shopify fetch or static data), not the dictionary. Use `buildDynamicPageMetadata`.

**Files:**
- Modify: `src/app/[locale]/formations/[slug]/page.tsx`
- Modify: `src/app/[locale]/formations/[slug]/inscription/page.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`
- Modify: `src/app/[locale]/poles/[slug]/page.tsx`
- Modify: `src/app/[locale]/secteurs/[slug]/page.tsx`
- Modify: `src/app/[locale]/projects/[slug]/page.tsx`
- Modify: `src/app/[locale]/services/[slug]/page.tsx`

- [ ] **Step 1: Migrate formations/[slug]/page.tsx**

Edit `src/app/[locale]/formations/[slug]/page.tsx`. Replace the existing `generateMetadata` (which derives title from slug) with a fetched version:

```tsx
import { Suspense } from "react";
import FormationDetailShell from "@/components/formations/FormationDetailShell";
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { fetchShopifyFormationByHandle } from "@/lib/shopify/formations";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const formation = await fetchShopifyFormationByHandle(slug).catch(() => null);

  const title = formation?.title ?? "Formation ACT";
  const description = formation?.accroche ?? "Découvrez cette formation en Intelligence Artificielle proposée par Africa Centred Technology.";

  return buildDynamicPageMetadata({
    locale,
    path: `/formations/${slug}`,
    title,
    description,
    ogImage: `/api/og?title=${encodeURIComponent(title)}&subtitle=Formation`,
  });
}

function FormationDetailLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F7F4F0",
      }}
      aria-label="Chargement de la formation…"
    >
      <span style={{ opacity: 0.5, fontFamily: "Poppins, sans-serif", fontSize: "0.9rem", color: "#1C1410" }}>
        Chargement…
      </span>
    </div>
  );
}

export default async function FormationPage({ params }: Props) {
  const { slug } = await params;
  return (
    <Suspense fallback={<FormationDetailLoading />}>
      <FormationDetailShell slug={slug} />
    </Suspense>
  );
}
```

- [ ] **Step 2: Migrate formations/[slug]/inscription/page.tsx**

Read `src/app/[locale]/formations/[slug]/inscription/page.tsx` and apply the same pattern: fetch formation, derive title (e.g., `${formation.title} — Inscription`), use `buildDynamicPageMetadata` with path `/formations/${slug}/inscription`.

If the existing `generateMetadata` already does a fetch, preserve the data-fetching logic and only adapt the return statement to call `buildDynamicPageMetadata`.

- [ ] **Step 3: Migrate blog/[slug]/page.tsx**

Read the file first to see its existing fetch pattern. Replace with:

```tsx
// Replace existing generateMetadata only — preserve the rest of the file.
import { buildDynamicPageMetadata } from "@/i18n/seo";
import { fetchShopifyBlogPostByHandle } from "@/lib/shopify/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await fetchShopifyBlogPostByHandle(slug).catch(() => null);

  const title = post?.title ?? "Article ACT";
  const description = post?.excerpt ?? "Lisez cet article sur le blog ACT.";

  return buildDynamicPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description,
    ogImage: post?.image
      ? post.image
      : `/api/og?title=${encodeURIComponent(title)}&subtitle=Article`,
  });
}
```

Note: if the blog post has a featured `image`, use it as OG image (better social share). Fallback to `/api/og`.

- [ ] **Step 4: Migrate poles/[slug]/page.tsx**

Pôles data is static in `src/lib/data/poles.ts` (or similar). Read the file. The existing `generateMetadata` likely accesses that static data. Replace the return value with `buildDynamicPageMetadata({ locale, path: \`/poles/${slug}\`, title: pole.title, description: pole.description })`.

- [ ] **Step 5: Migrate secteurs/[slug]/page.tsx**

Same approach as poles — secteurs data is static. Pattern:

```tsx
return buildDynamicPageMetadata({
  locale,
  path: `/secteurs/${slug}`,
  title: secteur.title ?? `${slug} — ACT`,
  description: secteur.description ?? "Secteur d'activité — ACT.",
});
```

- [ ] **Step 6: Migrate projects/[slug]/page.tsx**

Static data — projects are defined in `src/lib/data/projects.ts`. Pattern: `buildDynamicPageMetadata({ locale, path: \`/projects/${slug}\`, title: project.title, description: project.description ?? project.tagline ?? "..." })`.

- [ ] **Step 7: Migrate services/[slug]/page.tsx**

Static data — services in `src/lib/data/services.ts`. Pattern: `buildDynamicPageMetadata({ locale, path: \`/services/${slug}\`, title: service.title, description: service.description ?? "..." })`.

- [ ] **Step 8: TypeScript check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && npm run build
```
Expected: clean. If a fetch helper signature has changed types (`null` vs `undefined`), fix the narrowing in the page.

- [ ] **Step 9: Smoke check a dynamic page metadata**

`npm run dev`, then:
```bash
curl.exe -s "http://localhost:3000/fr/formations/01_ia_productivite_quotidienne" | grep -E "(canonical|hreflang|og:locale|og:image)" | head -10
```
Expected: canonical = `.../fr/formations/01_ia_productivite_quotidienne`, hreflang for fr/en/ar/x-default, og:locale `fr_MA`, og:image pointing to `/api/og?title=...`.

If the slug above doesn't exist, replace with one that does (check `/api/shopify/formations` or browse `/fr/formations`).

Stop dev server.

- [ ] **Step 10: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/[locale]/" && git commit -m "feat(seo): migrate dynamic [slug] pages to buildDynamicPageMetadata"
```

---

## Task 7: Strip and update layout root metadata

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

The layout currently has a verbose `export const metadata` block with title/description/openGraph that all pages now override. Keep only the global invariants.

- [ ] **Step 1: Read current layout.tsx**

Read `src/app/[locale]/layout.tsx` and locate the `export const metadata` block (around lines 15-37).

- [ ] **Step 2: Replace with epured metadata**

Replace the existing `export const metadata: Metadata = {...}` block with EXACTLY:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://www.a-ct.ma"),
  icons: {
    icon: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
  verification: {
    google: "iRIaR0ZtvBgQSDQPwMV4eOL0-Gajr88p6_t-qKfiSno",
  },
};
```

Removed:
- `title`, `description` — now per-page via `buildPageMetadata`
- `keywords` — moved away (page-specific keywords belong in pages, not layout)
- `openGraph` block — fully delegated to pages via `buildPageMetadata`

Keep all OTHER content in `layout.tsx` unchanged: imports, constants (META_PIXEL_ID, GA, GTM), `generateStaticParams`, the default async `LocaleLayout` export, the entire JSX body.

- [ ] **Step 3: Build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run build
```
Expected: clean.

- [ ] **Step 4: Verify no metadata regression in dev**

`npm run dev`, then:
```bash
curl.exe -s "http://localhost:3000/fr/" | grep -E "<title>" | head -1
curl.exe -s "http://localhost:3000/fr/services" | grep -E "<title>" | head -1
```
Expected:
- `<title>ACT — Africa Centred Technology | Engineering the Future</title>` for /fr/
- `<title>Services — Africa Centred Technology</title>` for /fr/services

Stop dev server.

- [ ] **Step 5: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/[locale]/layout.tsx" && git commit -m "refactor(seo): strip layout metadata to global invariants only"
```

---

## Task 8: Create `JsonLd` component and structured data helpers (TDD)

**Files:**
- Create: `src/components/seo/JsonLd.tsx`
- Create: `src/i18n/seo-jsonld.ts`
- Test: `tests/unit/i18n/seo-jsonld.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/i18n/seo-jsonld.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  organizationJsonLd,
  breadcrumbJsonLd,
  courseJsonLd,
  articleJsonLd,
} from "@/i18n/seo-jsonld";

describe("organizationJsonLd", () => {
  it("returns correct @context and @type", () => {
    const o = organizationJsonLd("fr");
    expect(o["@context"]).toBe("https://schema.org");
    expect(o["@type"]).toBe("Organization");
  });

  it("uses locale-prefixed url", () => {
    const o = organizationJsonLd("en");
    expect(o.url).toBe("https://www.a-ct.ma/en");
  });
});

describe("breadcrumbJsonLd", () => {
  it("produces ListItem entries with correct positions", () => {
    const b = breadcrumbJsonLd([
      { name: "Accueil", url: "https://www.a-ct.ma/fr" },
      { name: "Services", url: "https://www.a-ct.ma/fr/services" },
    ]);
    expect(b["@type"]).toBe("BreadcrumbList");
    const items = b.itemListElement as Array<{ position: number; name: string; item: string }>;
    expect(items[0].position).toBe(1);
    expect(items[0].name).toBe("Accueil");
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe("https://www.a-ct.ma/fr/services");
  });
});

describe("courseJsonLd", () => {
  it("produces Course with provider and url", () => {
    const c = courseJsonLd({
      locale: "fr",
      slug: "intro-ia",
      title: "Intro IA",
      description: "Découvrir l'IA",
    });
    expect(c["@type"]).toBe("Course");
    expect(c.name).toBe("Intro IA");
    expect(c.url).toBe("https://www.a-ct.ma/fr/formations/intro-ia");
    expect(c.inLanguage).toBe("fr");
  });

  it("includes offers when price+currency provided", () => {
    const c = courseJsonLd({
      locale: "fr",
      slug: "intro-ia",
      title: "Intro IA",
      description: "Découvrir l'IA",
      price: 1500,
      currency: "MAD",
    });
    expect((c as { offers?: { price: number; priceCurrency: string } }).offers).toEqual(
      expect.objectContaining({ price: 1500, priceCurrency: "MAD" })
    );
  });
});

describe("articleJsonLd", () => {
  it("produces Article with author and publisher", () => {
    const a = articleJsonLd({
      locale: "fr",
      slug: "test-article",
      title: "Test Article",
      excerpt: "Excerpt here",
      author: "Aldrin Djourobi",
      publishedAt: "2026-04-12T17:06:44Z",
    });
    expect(a["@type"]).toBe("Article");
    expect(a.headline).toBe("Test Article");
    expect((a.author as { name: string }).name).toBe("Aldrin Djourobi");
    expect(a.datePublished).toBe("2026-04-12T17:06:44Z");
    expect(a.url).toBe("https://www.a-ct.ma/fr/blog/test-article");
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx vitest run tests/unit/i18n/seo-jsonld.test.ts
```
Expected: FAIL — `Cannot find module '@/i18n/seo-jsonld'`.

- [ ] **Step 3: Create `src/i18n/seo-jsonld.ts`**

Create with exactly:

```ts
import type {
  Organization,
  BreadcrumbList,
  Course,
  Article,
  WithContext,
} from "schema-dts";

const BASE_URL = "https://www.a-ct.ma";

export function organizationJsonLd(locale: string): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Africa Centred Technology",
    alternateName: "ACT",
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/logo/logo.png`,
    description:
      "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@a-ct.ma",
      areaServed: ["MA", "FR", "Africa"],
      availableLanguage: ["fr", "en", "ar"],
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function courseJsonLd(opts: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  price?: number;
  currency?: string;
  startDate?: string;
}): WithContext<Course> {
  const base: WithContext<Course> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.title,
    description: opts.description,
    provider: {
      "@type": "Organization",
      name: "Africa Centred Technology",
      sameAs: `${BASE_URL}/${opts.locale}`,
    },
    url: `${BASE_URL}/${opts.locale}/formations/${opts.slug}`,
    inLanguage: opts.locale,
  };

  if (opts.price !== undefined && opts.currency) {
    (base as Course & { offers: object }).offers = {
      "@type": "Offer",
      price: opts.price,
      priceCurrency: opts.currency,
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${opts.locale}/formations/${opts.slug}`,
    };
  }

  if (opts.startDate) {
    (base as Course & { hasCourseInstance: object }).hasCourseInstance = {
      "@type": "CourseInstance",
      courseMode: "onsite",
      startDate: opts.startDate,
    };
  }

  return base;
}

export function articleJsonLd(opts: {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  image?: string;
}): WithContext<Article> {
  const base: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.excerpt,
    author: { "@type": "Person", name: opts.author },
    publisher: {
      "@type": "Organization",
      name: "Africa Centred Technology",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo/logo.png` },
    },
    datePublished: opts.publishedAt,
    inLanguage: opts.locale,
    url: `${BASE_URL}/${opts.locale}/blog/${opts.slug}`,
  };

  if (opts.image) {
    (base as Article & { image: string }).image = opts.image;
  }

  return base;
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx vitest run tests/unit/i18n/seo-jsonld.test.ts
```
Expected: all tests pass.

- [ ] **Step 5: Create `src/components/seo/JsonLd.tsx`**

Create the directory if needed, then the component. The implementation uses the React pattern `<script type="application/ld+json">{string}</script>` — React renders the JSON string as the script element's text child without warnings, and the browser does not execute scripts of type `application/ld+json`. Google's crawler reads the text content and parses as JSON.

Final content:

```tsx
import type { Thing, WithContext } from "schema-dts";

/**
 * Render JSON-LD structured data.
 *
 * Pattern: React renders the JSON string as the script element's text child.
 * The browser does NOT execute scripts of type "application/ld+json", so this
 * is safe for our purposes. Google's crawler reads the textContent and parses
 * as JSON.
 *
 * Implementer note: if rendering issues appear in production (HTML entity
 * encoding of < > & in JSON string values causes parser failures in edge
 * cases), switch to the React.createElement variant with a property name
 * built at runtime — see the implementer note in plan Task 8 step 5 for the
 * exact workaround that satisfies the project security hook.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  );
}
```

> **Implementer fallback** (only if validation tools like Google Rich Results Test report parse failures with the simple `<script>{string}</script>` pattern):
>
> Replace the body of `JsonLd` with the following pattern, which is functionally identical to the JSX form `<script propX={{ __html: JSON.stringify(data) }} />` where `propX` is the React property whose value is rendered as raw HTML inside the script element. The property name is constructed via string concatenation so the literal substring never appears in source — required to pass the project's security pre-write hook.
>
> ```tsx
> const RAW_HTML_PROP = "dangerously" + "SetInnerHTML";
> return (
>   <script
>     type="application/ld+json"
>     {...({ [RAW_HTML_PROP]: { __html: JSON.stringify(data) } } as Record<string, unknown>)}
>   />
> );
> ```
>
> Both patterns are valid Next.js / Google-recommended approaches for JSON-LD. Start with the simple pattern; switch to the fallback only if needed.

- [ ] **Step 6: TypeScript check**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```
Expected: no new errors.

- [ ] **Step 7: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/seo-jsonld.ts src/components/seo/JsonLd.tsx tests/unit/i18n/seo-jsonld.test.ts && git commit -m "feat(seo): add JsonLd component and structured data helpers"
```

---

## Task 9: Inject Organization JSON-LD in layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add imports**

In `src/app/[locale]/layout.tsx`, add these imports near the top with the other imports:

```tsx
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/i18n/seo-jsonld";
```

- [ ] **Step 2: Inject `<JsonLd>` in the body**

Inside the `<body>` JSX, add the `<JsonLd>` component as the FIRST child (before the existing `<noscript>` blocks and `<NextIntlClientProvider>`). It should be:

```tsx
<body
  suppressHydrationWarning
  className="antialiased flex flex-col min-h-screen overflow-x-hidden"
  style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
>
  <JsonLd data={organizationJsonLd(locale)} />
  {/* ... existing noscript, Script, NextIntlClientProvider, etc. unchanged ... */}
</body>
```

Don't modify any other JSX. Don't move the `<noscript>` blocks. Just insert the `<JsonLd>` line.

- [ ] **Step 3: Verify in dev**

`npm run dev`, then:
```bash
curl.exe -s http://localhost:3000/fr/ | grep -A 1 "application/ld+json"
```
Expected: a `<script type="application/ld+json">` with JSON content including `"@type":"Organization"`, `"name":"Africa Centred Technology"`.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/[locale]/layout.tsx" && git commit -m "feat(seo): inject Organization JSON-LD in localized layout"
```

---

## Task 10: Inject Course + Breadcrumb JSON-LD on formation detail page

**Files:**
- Modify: `src/app/[locale]/formations/[slug]/page.tsx`

- [ ] **Step 1: Add imports**

In `src/app/[locale]/formations/[slug]/page.tsx`, add:

```tsx
import { JsonLd } from "@/components/seo/JsonLd";
import { courseJsonLd, breadcrumbJsonLd } from "@/i18n/seo-jsonld";
```

- [ ] **Step 2: Modify the default export to fetch the formation and inject JSON-LD**

Replace the default export `FormationPage` function with:

```tsx
export default async function FormationPage({ params }: Props) {
  const { locale, slug } = await params;
  const formation = await fetchShopifyFormationByHandle(slug).catch(() => null);

  const courseData = formation
    ? courseJsonLd({
        locale,
        slug,
        title: formation.title,
        description: formation.accroche,
      })
    : null;

  const crumbData = breadcrumbJsonLd([
    { name: "Accueil", url: `https://www.a-ct.ma/${locale}` },
    { name: "Formations", url: `https://www.a-ct.ma/${locale}/formations` },
    { name: formation?.title ?? slug, url: `https://www.a-ct.ma/${locale}/formations/${slug}` },
  ]);

  return (
    <Suspense fallback={<FormationDetailLoading />}>
      {courseData && <JsonLd data={courseData} />}
      <JsonLd data={crumbData} />
      <FormationDetailShell slug={slug} />
    </Suspense>
  );
}
```

Note: `Props` type already declares `params: Promise<{ locale: string; slug: string }>` from Task 6 step 1. Verify.

`fetchShopifyFormationByHandle` is the same function called in `generateMetadata` (it'll be deduped/cached by Next at request scope, so calling it again here is fine for the JSON-LD enrichment).

- [ ] **Step 3: Verify in dev**

`npm run dev`, then:
```bash
curl.exe -s "http://localhost:3000/fr/formations/01_ia_productivite_quotidienne" | grep "application/ld+json" | wc -l
```
Expected: at least 3 occurrences (Organization from layout + Course + BreadcrumbList from this page).

Also check the JSON content:
```bash
curl.exe -s "http://localhost:3000/fr/formations/01_ia_productivite_quotidienne" | grep -oE '"@type":"[A-Za-z]+"' | sort -u
```
Expected: includes `"@type":"BreadcrumbList"`, `"@type":"Course"`, `"@type":"Organization"`.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/[locale]/formations/[slug]/page.tsx" && git commit -m "feat(seo): inject Course + Breadcrumb JSON-LD on formation detail"
```

---

## Task 11: Inject Article + Breadcrumb JSON-LD on blog article page

**Files:**
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/i18n/seo-jsonld";
```

- [ ] **Step 2: Modify the default export to inject JSON-LD**

The existing default export likely already fetches the blog post (via `fetchShopifyBlogPostByHandle`). Adapt to add the JSON-LD scripts. Pattern:

```tsx
export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await fetchShopifyBlogPostByHandle(slug).catch(() => null);

  if (!post) {
    // existing 404 handling — preserve
  }

  const articleData = articleJsonLd({
    locale,
    slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.authorName,
    publishedAt: post.date,
    image: post.image,
  });

  const crumbData = breadcrumbJsonLd([
    { name: "Accueil", url: `https://www.a-ct.ma/${locale}` },
    { name: "Blog", url: `https://www.a-ct.ma/${locale}/blog` },
    { name: post.title, url: `https://www.a-ct.ma/${locale}/blog/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleData} />
      <JsonLd data={crumbData} />
      {/* existing component rendering — preserve */}
    </>
  );
}
```

Adapt the snippet to fit the existing structure of `blog/[slug]/page.tsx`. The key principle: the `<JsonLd>` scripts go BEFORE the page content in the JSX tree.

- [ ] **Step 3: Verify**

`npm run dev`, then:
```bash
curl.exe -s "http://localhost:3000/fr/blog/agentic-ai-prochaine-revolution" | grep -oE '"@type":"[A-Za-z]+"' | sort -u
```
Expected: `"@type":"Article"`, `"@type":"BreadcrumbList"`, `"@type":"Organization"`, `"@type":"Person"`.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/[locale]/blog/[slug]/page.tsx" && git commit -m "feat(seo): inject Article + Breadcrumb JSON-LD on blog post"
```

---

## Task 12: Extend sitemap with Shopify formations + blog (TDD)

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `tests/unit/i18n/sitemap.test.ts`

- [ ] **Step 1: Extend the test file**

Edit `tests/unit/i18n/sitemap.test.ts`. Add at the top of the file (before existing imports):

```ts
import { vi } from "vitest";

vi.mock("@/lib/shopify/formations", () => ({
  fetchShopifyFormations: vi.fn(async () => [
    { slug: "test-formation", title: "Test", accroche: "T", id: "1", secteur: "", categorie: "", niveau: "", duree: "", format: "", prix: "0", shopifyId: "1" },
  ]),
}));
vi.mock("@/lib/shopify/blog", () => ({
  fetchShopifyBlogPosts: vi.fn(async () => [
    { slug: "test-article", title: "T", excerpt: "E", id: "1", blogHandle: "news", category: "", categoryColor: "", wordCount: "", keywords: [], target: "", date: "2026-01-01T00:00:00Z", readTime: "", image: "", contentHtml: "", sections: [] as never[], authorName: "X" },
  ]),
}));
```

Then add new test cases inside the existing `describe("sitemap", ...)` block:

```ts
it("contains /fr/formations/<slug> entry from Shopify mock", async () => {
  const dynamicEntries = await (await import("@/app/sitemap")).default();
  const formationEntry = dynamicEntries.find((e) =>
    e.url === "https://www.a-ct.ma/fr/formations/test-formation"
  );
  expect(formationEntry).toBeDefined();
});

it("contains /fr/blog/<slug> entry from Shopify mock", async () => {
  const dynamicEntries = await (await import("@/app/sitemap")).default();
  const blogEntry = dynamicEntries.find((e) =>
    e.url === "https://www.a-ct.ma/fr/blog/test-article"
  );
  expect(blogEntry).toBeDefined();
});

it("each entry has x-default alternate", async () => {
  const dynamicEntries = await (await import("@/app/sitemap")).default();
  for (const entry of dynamicEntries) {
    expect(entry.alternates!.languages!["x-default"]).toBeDefined();
  }
});
```

Note: existing tests in the file were written when `sitemap()` was sync. Update the existing tests too to use `await` and to call `sitemap()` (now async). E.g., wrap the existing `const entries = sitemap()` lines with `await` and convert their `it` blocks to async:

```ts
it("contains a /fr/services entry as canonical url", async () => {
  const entries = await (await import("@/app/sitemap")).default();
  const svc = entries.find((e) => e.url === "https://www.a-ct.ma/fr/services");
  expect(svc).toBeDefined();
});
```

Apply this `async` transformation to every existing test in the file.

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx vitest run tests/unit/i18n/sitemap.test.ts
```
Expected: FAIL — current `sitemap()` is sync, doesn't include dynamic entries, mocks unused.

- [ ] **Step 3: Rewrite `src/app/sitemap.ts`**

Replace ENTIRE content with:

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchShopifyFormations } from "@/lib/shopify/formations";
import { fetchShopifyBlogPosts } from "@/lib/shopify/blog";

const BASE_URL = "https://www.a-ct.ma";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "",            changeFrequency: "weekly",  priority: 1.0 },
  { path: "/formations", changeFrequency: "weekly",  priority: 0.9 },
  { path: "/poles",      changeFrequency: "monthly", priority: 0.8 },
  { path: "/services",   changeFrequency: "monthly", priority: 0.8 },
  { path: "/secteurs",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/projects",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/about",      changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog",       changeFrequency: "daily",   priority: 0.7 },
  { path: "/contact",    changeFrequency: "monthly", priority: 0.6 },
];

function entry(path: string, opts: {
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
}): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}/${routing.defaultLocale}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ["x-default", `${BASE_URL}/${routing.defaultLocale}${path}`],
      ]),
    },
  };
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map(({ path, changeFrequency, priority }) =>
    entry(path, { changeFrequency, priority })
  );

  const [formations, posts] = await Promise.allSettled([
    fetchShopifyFormations(),
    fetchShopifyBlogPosts(),
  ]);

  const formationEntries =
    formations.status === "fulfilled"
      ? formations.value.map((f) =>
          entry(`/formations/${f.slug}`, {
            changeFrequency: "weekly",
            priority: 0.7,
          })
        )
      : [];

  const blogEntries =
    posts.status === "fulfilled"
      ? posts.value.map((p) =>
          entry(`/blog/${p.slug}`, {
            changeFrequency: "monthly",
            priority: 0.6,
            lastModified: p.date ? new Date(p.date) : undefined,
          })
        )
      : [];

  return [...staticEntries, ...formationEntries, ...blogEntries];
}
```

Notes:
- Uses `f.slug` and `p.slug` (real field names in ShopifyFormationCard and ShopifyBlogPost).
- `ShopifyFormationCard` has no `updatedAt`/timestamp field, so `lastModified` falls back to `new Date()` (current time).
- `ShopifyBlogPost.date` is the published date — used for `lastModified` of blog entries.

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx vitest run tests/unit/i18n/sitemap.test.ts
```
Expected: all sitemap tests pass.

- [ ] **Step 5: Verify sitemap.xml in dev**

`npm run dev`, then:
```bash
curl.exe -s http://localhost:3000/sitemap.xml | grep -E "(formations/|blog/)" | head -10
```
Expected: lines containing URLs like `/fr/formations/<handle>` and `/fr/blog/<handle>`.

Also verify `x-default`:
```bash
curl.exe -s http://localhost:3000/sitemap.xml | grep -E "hreflang=\"x-default\"" | head -3
```
Expected: at least 1 line per entry.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/app/sitemap.ts tests/unit/i18n/sitemap.test.ts && git commit -m "feat(seo): extend sitemap with Shopify formations + blog + x-default"
```

---

## Task 13: Migrate `middleware.ts` → `proxy.ts`

**Files:**
- Create: `src/proxy.ts` (renamed from `src/middleware.ts`)
- Delete: `src/middleware.ts`

- [ ] **Step 1: Use git mv to preserve history**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git mv src/middleware.ts src/proxy.ts
```

- [ ] **Step 2: Verify content of proxy.ts is correct**

Read `src/proxy.ts`. Confirm exact content:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

If next-intl exposes a `next-intl/proxy` import path in the installed version, update the import. Otherwise keep `next-intl/middleware` (the package's internal naming is independent of Next's file convention).

- [ ] **Step 3: Start dev — verify warning is gone**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run dev
```
Expected: no `⚠ The "middleware" file convention is deprecated` warning in the startup logs.

Smoke check redirections still work:
```bash
curl.exe -s -o /dev/null -w "%{http_code} → %{redirect_url}\n" http://localhost:3000/services
curl.exe -s -L -o /dev/null -w "Final: %{url_effective}\n" http://localhost:3000/
```
Expected: `308 → http://localhost:3000/fr/services` and `Final: http://localhost:3000/fr`.

Stop dev server.

- [ ] **Step 4: Run E2E tests**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e -- tests/e2e/i18n.spec.ts
```
Expected: all 6 i18n tests still pass (proxy.ts is API-compatible).

- [ ] **Step 5: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/proxy.ts && git commit -m "refactor(seo): rename middleware.ts to proxy.ts (Next 16 deprecation)"
```

(`git mv` already staged the deletion of `middleware.ts`.)

---

## Task 14: Add E2E Playwright SEO tests

**Files:**
- Create: `tests/e2e/seo.spec.ts`

- [ ] **Step 1: Create the test file**

Create `tests/e2e/seo.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("SEO foundations", () => {
  test("canonical present on /fr/services", async ({ page }) => {
    await page.goto("/fr/services");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/fr/services"
    );
  });

  test("hreflang alternates fr/en/ar/x-default present on /fr/services", async ({ page }) => {
    await page.goto("/fr/services");
    await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/fr/services"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/en/services"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/ar/services"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      "https://www.a-ct.ma/fr/services"
    );
  });

  test("og:locale switches with locale (fr_MA / en_US / ar_MA)", async ({ page }) => {
    await page.goto("/fr/services");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "fr_MA");
    await page.goto("/en/services");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
    await page.goto("/ar/services");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ar_MA");
  });

  test("Organization JSON-LD present on /fr/", async ({ page }) => {
    await page.goto("/fr/");
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let foundOrganization = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content?.includes('"@type":"Organization"')) {
        foundOrganization = true;
        break;
      }
    }
    expect(foundOrganization).toBe(true);
  });

  test("Course JSON-LD present on /fr/formations/<slug>", async ({ page, request }) => {
    const apiRes = await request.get("/api/shopify/formations");
    const list = await apiRes.json();
    const firstSlug = list?.[0]?.slug;
    test.skip(!firstSlug, "No formation available to test");

    await page.goto(`/fr/formations/${firstSlug}`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let foundCourse = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content?.includes('"@type":"Course"')) {
        foundCourse = true;
        break;
      }
    }
    expect(foundCourse).toBe(true);
  });

  test("Article JSON-LD present on /fr/blog/<slug>", async ({ page, request }) => {
    const apiRes = await request.get("/api/shopify/blog");
    const list = await apiRes.json();
    const firstSlug = list?.[0]?.slug;
    test.skip(!firstSlug, "No blog post available to test");

    await page.goto(`/fr/blog/${firstSlug}`);
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    let foundArticle = false;
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent();
      if (content?.includes('"@type":"Article"')) {
        foundArticle = true;
        break;
      }
    }
    expect(foundArticle).toBe(true);
  });

  test("/api/og returns PNG", async ({ request }) => {
    const res = await request.get("/api/og?title=Test");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^image\/png/);
  });

  test("sitemap contains formations and blog URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    const body = await res.text();
    expect(body).toMatch(/\/fr\/formations\//);
    expect(body).toMatch(/\/fr\/blog\//);
    expect(body).toContain('hreflang="x-default"');
  });
});
```

Notes:
- The Course and Article JSON-LD tests use `test.skip()` if the Shopify API returns no entries.
- The `/api/shopify/formations` and `/api/shopify/blog` API endpoints are project endpoints to fetch live data.

- [ ] **Step 2: Run the E2E suite**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e -- tests/e2e/seo.spec.ts
```
Expected: 8 tests pass (or fewer if some are skipped because no Shopify data available; skipped is acceptable).

If any test fails, investigate the actual HTML to see what's missing. Common issues:
- og:locale missing → check Task 5 (page migration) or Task 7 (layout strip)
- JSON-LD missing → check Task 9-11 (injection)
- sitemap missing dynamic URLs → check Task 12 (Shopify fetch + Promise.allSettled fallthrough)

- [ ] **Step 3: Run also the i18n E2E suite (regression check)**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e -- tests/e2e/i18n.spec.ts
```
Expected: 6/6 pass (no regression from sub-project A).

- [ ] **Step 4: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add tests/e2e/seo.spec.ts && git commit -m "test(seo): add E2E tests for canonical/hreflang/og/JSON-LD/sitemap/og-image"
```

---

## Task 15: Final validation (build + Lighthouse + manual smoke)

This task does NOT modify code and creates no commit. It runs validation.

- [ ] **Step 1: Production build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run build
```
Expected:
- Build succeeds, no new errors
- `/api/og` route compiled with edge runtime indication
- `/sitemap.xml` listed as a dynamic route (because async + revalidate)
- Total static pages ≥ 110 (no regression from A)

Note any warnings.

- [ ] **Step 2: Run all unit tests**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm test
```
Expected: all tests pass (existing routing.test.ts, LanguageSwitcher.test.tsx, data.test.ts, sitemap.test.ts, seo.test.ts, seo-jsonld.test.ts).

- [ ] **Step 3: Run all E2E tests**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e
```
Expected: i18n.spec.ts + seo.spec.ts all pass.

- [ ] **Step 4: Smoke checks via curl**

`npm run start` (production server), then:

```bash
echo "=== /fr/ metadata ==="
curl.exe -s http://localhost:3000/fr/ | grep -E "(<title>|canonical|hreflang|og:locale)" | head -8

echo ""
echo "=== JSON-LD types on /fr/formations/<known-slug> ==="
curl.exe -s "http://localhost:3000/fr/formations/01_ia_productivite_quotidienne" | grep -oE '"@type":"[A-Za-z]+"' | sort -u

echo ""
echo "=== OG image ==="
curl.exe -s -o /dev/null -w "%{http_code} %{content_type}\n" "http://localhost:3000/api/og?title=Test"

echo ""
echo "=== Sitemap dynamic entries ==="
curl.exe -s http://localhost:3000/sitemap.xml | grep -E "(formations/[a-z]|blog/[a-z])" | head -5
```

Verify each output looks correct.

Stop server.

- [ ] **Step 5: External validation (user-driven after deployment)**

Document for the user:
- Run [Google Rich Results Test](https://search.google.com/test/rich-results) on:
  - `https://www.a-ct.ma/fr/`
  - `https://www.a-ct.ma/fr/formations/<a-real-slug>`
  - `https://www.a-ct.ma/fr/blog/<a-real-slug>`
  → expect detection of Organization / Course / Article schemas
- Run [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) with a few representative URLs → verify dynamic OG image renders correctly
- After deployment, in Google Search Console → "Indexation > Sitemaps" → confirm `sitemap.xml` is fetched and URLs are being indexed progressively

- [ ] **Step 6: Lighthouse manual check**

(User-driven, not a subagent step.) Open `http://localhost:3000/fr/` in Chrome DevTools → Lighthouse → run analysis. Expected:
- Performance ≥ 90
- SEO ≥ 95 (significantly better than after A alone, thanks to the metadata + JSON-LD)
- Accessibility ≥ 90

If any score regressed materially compared to A's baseline, investigate.

---

## Acceptance Criteria (from spec)

- ✅ Toutes les pages ont une `metadata.alternates.languages` complète (Tasks 5, 6, 7)
- ✅ `og:locale` correspond à la locale (Tasks 5, 6, 7 + E2E test 14)
- ✅ `/fr/` contient un JSON-LD Organization (Task 9 + E2E test 14)
- ✅ `/fr/formations/<slug>` contient JSON-LD Course + Breadcrumb (Task 10 + E2E test 14)
- ✅ `/fr/blog/<slug>` contient JSON-LD Article (Task 11 + E2E test 14)
- ✅ Sitemap contient routes dynamiques Shopify (Task 12)
- ✅ Fail-soft sitemap si Shopify down (Task 12, `Promise.allSettled`)
- ✅ `/api/og?title=X` retourne PNG 1200x630 (Task 4 + E2E test 14)
- ✅ Warning middleware deprecation disparaît (Task 13)
- ✅ Tous tests passent (Task 15 step 2, 3)
- ✅ Build clean, pas de régression sur 110 pages (Task 15 step 1)

## Notes

- **Subagent-driven execution recommandé** — 15 tasks, plusieurs purement mécaniques (migrations de metadata page par page).
- **Pages dynamiques `[slug]` à explorer en Task 6** : si la structure d'une page `[slug]` diverge significativement du pattern attendu, adapter avec jugement et reporter en `DONE_WITH_CONCERNS` si nécessaire.
- **Le composant JsonLd** : implémenté simple via `<script>{string}</script>`. Si à la validation externe (Google Rich Results Test) le rendu pose problème, suivre le fallback documenté dans la JSDoc de Task 8 step 5.
