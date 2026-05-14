# i18n Architecture (sous-projet A) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place l'infrastructure i18n Next.js (next-intl) servant le site sous `/fr/...`, `/en/...`, `/ar/...` avec redirections 308 depuis les anciennes URLs racine, sans aucune régression visuelle pour un visiteur FR.

**Architecture:** Next.js 16 App Router, segment dynamique `[locale]` enveloppant toutes les pages, middleware `next-intl` pour la détection Accept-Language + cookie `NEXT_LOCALE`, dictionnaires JSON par locale (FR rempli, EN/AR = copie verbatim de FR). Layout localisé pose `<html lang dir>`. RTL activé pour `ar`. Switcher de langue dans le Header. Sitemap réécrit avec `alternates.languages`.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Tailwind v4, `next-intl` (latest), Playwright, Vitest.

**Spec source:** `docs/superpowers/specs/2026-05-13-i18n-architecture-design.md`

---

## File Structure

### Created files
- `src/i18n/routing.ts` — config locales + helpers de routage
- `src/i18n/navigation.ts` — réexports typés de `Link`, `usePathname`, `useRouter`
- `src/i18n/request.ts` — config next-intl pour Server Components
- `src/i18n/messages/fr.json` — dictionnaire FR (initialement squelette minimal)
- `src/i18n/messages/en.json` — copie verbatim de `fr.json`
- `src/i18n/messages/ar.json` — copie verbatim de `fr.json`
- `src/middleware.ts` — middleware Next.js qui appelle `next-intl`
- `src/global.d.ts` — augment du module `next-intl` pour types `Messages`
- `src/app/[locale]/layout.tsx` — layout localisé (héberge `<html lang dir>` + provider)
- `src/app/[locale]/page.tsx` — home migrée
- `src/app/[locale]/{about,formations,poles,services,secteurs,projects,blog,contact}/page.tsx` — toutes les pages migrées
- `src/app/[locale]/formations/[slug]/page.tsx` — détail formation migré
- `src/components/layout/LanguageSwitcher.tsx` — composant client de switch
- `src/hooks/useDirection.ts` — hook retournant `1` ou `-1` selon LTR/RTL
- `tests/i18n/routing.test.ts` — Vitest unit
- `tests/i18n/LanguageSwitcher.test.tsx` — Vitest unit
- `tests/i18n/sitemap.test.ts` — Vitest unit
- `tests/e2e/i18n.spec.ts` — Playwright E2E

### Modified files
- `src/app/layout.tsx` — réduit à un passe-plat minimal
- `src/app/sitemap.ts` — réécrit pour générer les 3 locales avec `alternates.languages`
- `src/app/robots.ts` — inchangé (vérification seulement)
- `next.config.ts` — ajout `redirects()` 308 pour anciennes URLs + plugin next-intl
- `src/components/layout/Header.tsx` — intégration `LanguageSwitcher` + migration `next/link`
- 36 autres fichiers `src/components/**/*.tsx` — migration des imports `next/link` → `@/i18n/navigation`
- `package.json` — ajout dépendance `next-intl`
- `package-lock.json` / `bun.lock` — auto-géré

### Files audited (no changes guaranteed, depend on findings)
- Composants Tailwind avec utilities directionnelles (`ml-*`, `pl-*`, `text-left`, etc.) → remplacement par utilities logiques (`ms-*`, `ps-*`, `text-start`).

---

## Task 1: Install next-intl & wire the Next.js plugin

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Install next-intl**

Run:
```bash
cd D:/server/website-act-officiel-
npm install next-intl
```
Expected: dependency `next-intl` ajoutée dans `package.json`, `npm install` se termine sans erreur.

- [ ] **Step 2: Wire next-intl plugin in next.config.ts**

Edit `next.config.ts`. Wrap export with `createNextIntlPlugin`. Final content:

```ts
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
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Verify build still passes (sanity)**

Run:
```bash
npm run build
```
Expected: ⚠ Le build va échouer car `src/i18n/request.ts` n'existe pas encore — c'est attendu. Le but de ce step est de confirmer que le **plugin** est bien chargé (le message d'erreur doit mentionner `./src/i18n/request.ts`).

> Si le build échoue avec une autre erreur (syntaxe, import), corriger avant de continuer.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json next.config.ts
git commit -m "feat(i18n): install next-intl and wire plugin"
```

---

## Task 2: Create routing config and typed navigation helpers

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Test: `tests/i18n/routing.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/i18n/routing.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("routing config", () => {
  it("exposes fr, en, ar as locales", () => {
    expect(routing.locales).toEqual(["fr", "en", "ar"]);
  });

  it("uses fr as defaultLocale", () => {
    expect(routing.defaultLocale).toBe("fr");
  });

  it("prefixes all locales (localePrefix='always')", () => {
    expect(routing.localePrefix).toBe("always");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run tests/i18n/routing.test.ts
```
Expected: FAIL — `Cannot find module '@/i18n/routing'`.

- [ ] **Step 3: Create routing.ts**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en", "ar"],
  defaultLocale: "fr",
  localePrefix: "always",
  localeDetection: true,
  localeCookie: { name: "NEXT_LOCALE", maxAge: 60 * 60 * 24 * 365 },
});

export type Locale = (typeof routing.locales)[number];
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run tests/i18n/routing.test.ts
```
Expected: PASS — 3 tests.

- [ ] **Step 5: Create navigation helpers**

Create `src/i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 6: Verify TypeScript compiles cleanly**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS (no errors). Si des erreurs apparaissent dans des fichiers non liés, les ignorer — on s'intéresse uniquement à `src/i18n/*`.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/routing.ts src/i18n/navigation.ts tests/i18n/routing.test.ts
git commit -m "feat(i18n): add routing config and typed navigation helpers"
```

---

## Task 3: Create request.ts and bootstrap dictionaries

**Files:**
- Create: `src/i18n/request.ts`
- Create: `src/i18n/messages/fr.json`
- Create: `src/i18n/messages/en.json`
- Create: `src/i18n/messages/ar.json`
- Create: `src/global.d.ts`

- [ ] **Step 1: Create minimal fr.json with placeholder structure**

Create `src/i18n/messages/fr.json`. On commence avec un squelette minimal — les vraies clés UI seront ajoutées dans les sous-projets B/C :

```json
{
  "common": {
    "lang": {
      "fr": "Français",
      "en": "English",
      "ar": "العربية"
    }
  },
  "metadata": {
    "default": {
      "title": "Africa Centred Technology | Engineering the Future",
      "description": "ACT fusionne l'intelligence artificielle et l'ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale."
    }
  }
}
```

- [ ] **Step 2: Copy fr.json to en.json and ar.json verbatim**

Run PowerShell:
```powershell
Copy-Item "src\i18n\messages\fr.json" "src\i18n\messages\en.json"
Copy-Item "src\i18n\messages\fr.json" "src\i18n\messages\ar.json"
```
Expected: `src/i18n/messages/en.json` et `ar.json` ont le même contenu que `fr.json`.

- [ ] **Step 3: Create request.ts**

Create `src/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create global.d.ts with type augmentation**

Create `src/global.d.ts`:

```ts
import type messages from "./i18n/messages/fr.json";

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
    Locale: "fr" | "en" | "ar";
  }
}
```

- [ ] **Step 5: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/request.ts src/i18n/messages/fr.json src/i18n/messages/en.json src/i18n/messages/ar.json src/global.d.ts
git commit -m "feat(i18n): bootstrap dictionaries and request config"
```

---

## Task 4: Add middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware.ts**

Create `src/middleware.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(i18n): add middleware for locale routing"
```

> ⚠ À ce stade, le middleware existe mais il va tenter de rediriger vers `/fr` qui n'existe pas encore (les pages sont à la racine). On ne lance pas `npm run dev` ici — on attend que la migration App Router (Task 5-7) soit complète.

---

## Task 5: Create the localized layout

**Files:**
- Create: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Read the current root layout**

Lire `src/app/layout.tsx` pour récupérer son contenu (head, GTM, Meta Pixel, fonts, ThemeProvider, Header).

- [ ] **Step 2: Create the localized layout**

Create `src/app/[locale]/layout.tsx`. **Important** : on copie verbatim le contenu de `src/app/layout.tsx` mais on remplace `<html lang="fr" data-theme="dark">` par une version locale-aware. **Toutes les balises Script/noscript GTM/Meta Pixel et les liens fonts sont préservés tels quels.**

```tsx
import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import Header from "@/components/layout/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@300;400;500;600;700;800;900&family=Geist:wght@100..900&family=Instrument+Serif:ital@0;1&family=Lora:ital,wght@0,400..700;1,400..700&family=Outfit:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
      <body
        suppressHydrationWarning
        className="antialiased flex flex-col min-h-screen overflow-x-hidden"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
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
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Header />
            <main className="flex-grow">{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

> Note l'ajout de `Cairo` dans la chaîne de fonts Google. C'est la police arabe par défaut. Toutes les autres fonts existantes sont conservées.

- [ ] **Step 3: Commit (le build est encore cassé — c'est attendu)**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat(i18n): add localized layout with dir/lang and Cairo font"
```

---

## Task 6: Reduce root layout to passthrough

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace content with minimal passthrough**

Remplacer **tout** le contenu de `src/app/layout.tsx` par :

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "refactor(i18n): reduce root layout to passthrough"
```

---

## Task 7: Migrate all pages under [locale]/

Cette tâche fait beaucoup de déplacements mécaniques. Aucun changement de code interne aux pages — uniquement des déplacements de fichiers. Les pages restent identiques (mêmes imports `next/link`, mêmes Shells, etc.) ; la migration des imports `next/link` est dans une tâche ultérieure dédiée.

**Files (déplacements) :**
- `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- `src/app/about/` → `src/app/[locale]/about/`
- `src/app/blog/` → `src/app/[locale]/blog/`
- `src/app/contact/` → `src/app/[locale]/contact/`
- `src/app/formations/` → `src/app/[locale]/formations/`
- `src/app/poles/` → `src/app/[locale]/poles/`
- `src/app/projects/` → `src/app/[locale]/projects/`
- `src/app/secteurs/` → `src/app/[locale]/secteurs/`
- `src/app/services/` → `src/app/[locale]/services/`

> **Conservés à la racine** : `src/app/api/`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/globals.css`, `src/app/layout.tsx` (déjà réduit), `src/app/[locale]/layout.tsx` (déjà créé).

- [ ] **Step 1: Move the home page**

PowerShell:
```powershell
Move-Item "src\app\page.tsx" "src\app\[locale]\page.tsx"
```
Expected: `src/app/page.tsx` n'existe plus, `src/app/[locale]/page.tsx` existe.

- [ ] **Step 2: Move all sub-route directories**

PowerShell:
```powershell
$routes = @("about", "blog", "contact", "formations", "poles", "projects", "secteurs", "services")
foreach ($r in $routes) {
  Move-Item "src\app\$r" "src\app\[locale]\$r"
}
```
Expected: chaque dossier déplacé.

- [ ] **Step 3: Verify the structure**

Run:
```bash
ls src/app/
ls "src/app/[locale]/"
```
Expected — racine `src/app/` :
```
[locale]
api
globals.css
layout.tsx
robots.ts
sitemap.ts
```
Expected — `src/app/[locale]/` :
```
about
blog
contact
formations
layout.tsx
page.tsx
poles
projects
secteurs
services
```

- [ ] **Step 4: Add `import 'server-only'` guard and setRequestLocale to each page** (skipped — couvert par layout)

Note : `setRequestLocale(locale)` est déjà appelé dans `[locale]/layout.tsx`, ce qui suffit pour activer le rendu statique des Server Components des pages enfants.

- [ ] **Step 5: Try to build**

Run:
```bash
npm run build
```
Expected — il est probable que le build échoue ou émette des warnings :
- ⚠ Certaines pages utilisent `import Link from 'next/link'` — toujours OK techniquement, mais ne préserve pas la locale. Sera corrigé en Task 11.
- ⚠ Sitemap actuel pointe vers d'anciennes URLs. Sera corrigé en Task 13.
- ❌ Si build échoue avec une erreur de type (route conflict, etc.) — diagnostiquer avant de continuer.

Si le build passe (même avec warnings), continuer. Si ❌, fix avant commit.

- [ ] **Step 6: Commit**

```bash
git add src/app/
git commit -m "refactor(i18n): migrate all pages under [locale] segment"
```

---

## Task 8: Smoke-test dev server with FR locale

But : valider visuellement que `/fr/...` rend exactement comme l'ancien `/...` AVANT de toucher au reste. C'est le checkpoint critique.

- [ ] **Step 1: Launch dev server**

Run:
```bash
npm run dev
```
Expected : serveur démarre sur `http://localhost:3000`.

- [ ] **Step 2: Smoke test in browser**

Ouvrir les URLs suivantes dans le navigateur et vérifier :

| URL | Comportement attendu |
|---|---|
| `http://localhost:3000/` | Redirige vers `http://localhost:3000/fr` (ou détecte navigator language) |
| `http://localhost:3000/fr` | Rend la home (parcours 7 salles) **identique à avant** |
| `http://localhost:3000/fr/services` | Rend la page services |
| `http://localhost:3000/fr/formations` | Rend le catalogue Shopify |
| `http://localhost:3000/en` | Rend la home (contenu FR car copie verbatim — c'est attendu) |
| `http://localhost:3000/ar` | Rend la home avec `<html dir="rtl">` (vérifier dans devtools) |

Vérifier dans devtools :
- `/fr/*` : `<html lang="fr" dir="ltr">`
- `/en/*` : `<html lang="en" dir="ltr">`
- `/ar/*` : `<html lang="ar" dir="rtl">`

**Critère bloquant** : si `/fr/` ne ressemble pas à l'ancien site, arrêter et diagnostiquer. Sinon, continuer.

- [ ] **Step 3: Stop the dev server (Ctrl+C)**

- [ ] **Step 4: No commit needed (no file changes)**

---

## Task 9: Add legacy URL 301 redirects in next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add redirects() to next.config.ts**

Modifier `next.config.ts` pour ajouter un `redirects()`. Final state du nextConfig object :

```ts
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
```

- [ ] **Step 2: Verify behavior in dev**

Run:
```bash
npm run dev
```
Then in another shell (PowerShell) :
```powershell
curl.exe -I http://localhost:3000/services
curl.exe -I http://localhost:3000/formations/intro-ia
```
Expected: statut `HTTP/1.1 308 Permanent Redirect`, en-tête `location: /fr/services` (ou `/fr/formations/intro-ia`).

Arrêter le dev server (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat(i18n): add 308 redirects from legacy URLs to /fr"
```

---

## Task 10: Rewrite sitemap.ts to include all locales (TDD)

**Files:**
- Modify: `src/app/sitemap.ts`
- Test: `tests/i18n/sitemap.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/i18n/sitemap.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("contains a /fr/services entry as canonical url", () => {
    const svc = entries.find((e) => e.url === "https://www.a-ct.ma/fr/services");
    expect(svc).toBeDefined();
  });

  it("each entry has alternates.languages with fr/en/ar", () => {
    for (const entry of entries) {
      expect(entry.alternates?.languages).toMatchObject({
        fr: expect.stringContaining("/fr"),
        en: expect.stringContaining("/en"),
        ar: expect.stringContaining("/ar"),
      });
    }
  });

  it("no longer references obsolete /nous-decouvrir or /notre-savoir-faire", () => {
    for (const entry of entries) {
      expect(entry.url).not.toContain("nous-decouvrir");
      expect(entry.url).not.toContain("notre-savoir-faire");
      for (const v of Object.values(entry.alternates?.languages ?? {})) {
        expect(v).not.toContain("nous-decouvrir");
        expect(v).not.toContain("notre-savoir-faire");
      }
    }
  });

  it("home entry uses /fr as canonical (not bare /)", () => {
    const home = entries.find(
      (e) => e.url === "https://www.a-ct.ma/fr" || e.url === "https://www.a-ct.ma/fr/"
    );
    expect(home).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run tests/i18n/sitemap.test.ts
```
Expected: FAIL — au moins les tests sur `alternates.languages` et `/fr/services`.

- [ ] **Step 3: Rewrite sitemap.ts**

Replace **entire** content of `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://www.a-ct.ma";

const STATIC_ROUTES = [
  { path: "",            changeFrequency: "weekly"  as const, priority: 1.0 },
  { path: "/formations", changeFrequency: "weekly"  as const, priority: 0.9 },
  { path: "/poles",      changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/services",   changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/secteurs",   changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/projects",   changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/about",      changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/blog",       changeFrequency: "daily"   as const, priority: 0.7 },
  { path: "/contact",    changeFrequency: "monthly" as const, priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}/${routing.defaultLocale}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
      ),
    },
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run tests/i18n/sitemap.test.ts
```
Expected: PASS — 4 tests.

- [ ] **Step 5: Verify the sitemap renders in dev**

Run `npm run dev`, then in browser open `http://localhost:3000/sitemap.xml`.
Expected: XML contenant des entrées avec `<xhtml:link rel="alternate" hreflang="fr" ...>` pour chaque URL.

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts tests/i18n/sitemap.test.ts
git commit -m "feat(i18n): rewrite sitemap with multi-locale alternates"
```

---

## Task 11: Create useDirection hook

**Files:**
- Create: `src/hooks/useDirection.ts`

- [ ] **Step 1: Create the hook**

Create `src/hooks/useDirection.ts`:

```ts
"use client";
import { useLocale } from "next-intl";

/**
 * Retourne 1 en LTR, -1 en RTL.
 * Sert à inverser les translations Framer Motion (ex. x: 100 * useDirection())
 * sans réécrire chaque animation pour le RTL.
 */
export function useDirection(): 1 | -1 {
  const locale = useLocale();
  return locale === "ar" ? -1 : 1;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useDirection.ts
git commit -m "feat(i18n): add useDirection hook for RTL animation inversion"
```

> Note : l'application de ce hook dans les animations Framer existantes est **hors-scope** de cette spec. Sera abordé itérativement quand des bugs visuels seront repérés en RTL. Le hook est posé maintenant pour disponibilité.

---

## Task 12: Create LanguageSwitcher component (TDD)

**Files:**
- Create: `src/components/layout/LanguageSwitcher.tsx`
- Test: `tests/i18n/LanguageSwitcher.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/i18n/LanguageSwitcher.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/services",
  useRouter: () => ({ replace }),
}));
vi.mock("next-intl", () => ({
  useLocale: () => "fr",
}));

describe("LanguageSwitcher", () => {
  it("renders all 3 locales as options", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("option", { name: "Français" })).toBeDefined();
    expect(screen.getByRole("option", { name: "English" })).toBeDefined();
    expect(screen.getByRole("option", { name: "العربية" })).toBeDefined();
  });

  it("calls router.replace with the new locale and current pathname", () => {
    render(<LanguageSwitcher />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "en" } });
    expect(replace).toHaveBeenCalledWith("/services", { locale: "en" });
  });
});
```

> ⚠ Pré-requis : si `@testing-library/react` n'est pas installé, l'installer :
> ```bash
> npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
> ```
> Vérifier que `vitest.config.ts` utilise `environment: "jsdom"`. Si non, ajouter cette ligne au `defineConfig`.

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run tests/i18n/LanguageSwitcher.test.tsx
```
Expected: FAIL — module `@/components/layout/LanguageSwitcher` introuvable.

- [ ] **Step 3: Create LanguageSwitcher**

Create `src/components/layout/LanguageSwitcher.tsx`:

```tsx
"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value as Locale })}
      aria-label="Change language"
      className="bg-transparent text-sm font-medium border border-current rounded px-2 py-1"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {LABELS[l]}
        </option>
      ))}
    </select>
  );
}
```

> Le styling est minimal/fonctionnel. Le raffinement visuel (drapeaux, dropdown custom, animations) est laissé à l'itération design suivante.

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run tests/i18n/LanguageSwitcher.test.tsx
```
Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/LanguageSwitcher.tsx tests/i18n/LanguageSwitcher.test.tsx
git commit -m "feat(i18n): add LanguageSwitcher component"
```

---

## Task 13: Integrate LanguageSwitcher into Header

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Read current Header.tsx**

Lire `src/components/layout/Header.tsx` pour comprendre la structure (desktop nav + mobile menu).

- [ ] **Step 2: Add import**

En haut du fichier, ajouter :

```tsx
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
```

- [ ] **Step 3: Insert the switcher in desktop nav**

Repérer dans le JSX la barre de navigation desktop (à droite, avant le CTA contact selon la convention). Insérer `<LanguageSwitcher />` juste avant ce CTA.

> Exemple — si le Header contient quelque chose comme :
> ```tsx
> <nav className="hidden md:flex gap-6">
>   {/* ...links... */}
>   <Link href="/contact">Contact</Link>
> </nav>
> ```
> Devenir :
> ```tsx
> <nav className="hidden md:flex gap-6 items-center">
>   {/* ...links... */}
>   <LanguageSwitcher />
>   <Link href="/contact">Contact</Link>
> </nav>
> ```

- [ ] **Step 4: Insert in mobile menu**

Repérer le panneau menu mobile (souvent un `<motion.div>` qui slide depuis le côté avec les liens). Insérer `<LanguageSwitcher />` en bas de ce panneau ou en haut, au choix selon la cohérence visuelle.

- [ ] **Step 5: Manually verify in dev**

Run `npm run dev`, ouvrir `http://localhost:3000/fr`. Vérifier :
- Le switcher s'affiche dans le header
- Au clic sur `English` → URL devient `/en/...` (même chemin)
- Au clic sur `العربية` → URL devient `/ar/...`, `<html dir="rtl">`
- Le switcher est aussi présent et fonctionnel sur mobile (réduire la fenêtre)

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(i18n): integrate LanguageSwitcher into Header"
```

---

## Task 14: Migrate `next/link` imports to `@/i18n/navigation`

Il y a **37 fichiers** dans `src/components/` qui importent `Link` depuis `next/link`. Tous doivent migrer vers `@/i18n/navigation` pour que la locale soit préservée lors des navigations internes.

**Files:** 37 fichiers identifiés par `grep "from ['\"]next/link['\"]" src/`.

- [ ] **Step 1: Verify the list of files**

Run:
```bash
grep -rl "from ['\"]next/link['\"]" src/
```
Expected: liste de fichiers correspondant à ceux énumérés dans la spec (37). Si plus, mettre à jour mentalement le compteur.

- [ ] **Step 2: Replace imports in all files via PowerShell**

Run PowerShell:
```powershell
$files = Get-ChildItem -Path "src" -Recurse -Include *.tsx,*.ts |
  Select-String -Pattern "from ['""]next/link['""]" -List |
  Select-Object -ExpandProperty Path
foreach ($f in $files) {
  $content = Get-Content $f -Raw
  $content = $content -replace 'import Link from ["'']next/link["''];?', 'import { Link } from "@/i18n/navigation";'
  $content = $content -replace 'import\s*\{\s*Link\s*\}\s*from\s*["'']next/link["''];?', 'import { Link } from "@/i18n/navigation";'
  Set-Content -Path $f -Value $content -NoNewline
}
```

> ⚠ Cette regex couvre les deux formes (`import Link from` et `import { Link } from`). Vérifier le résultat sur 2-3 fichiers à la main pour confirmer qu'il n'y a pas eu de cassure (ex. multi-imports `import Link, { LinkProps } from 'next/link'` — rare mais à corriger manuellement si rencontré).

- [ ] **Step 3: Confirm no remaining `next/link` imports**

Run:
```bash
grep -rl "from ['\"]next/link['\"]" src/
```
Expected: aucun résultat. Si certains fichiers persistent (à cause de formes d'import particulières), les corriger à la main :
```tsx
// Avant
import Link, { LinkProps } from "next/link";
// Après
import { Link } from "@/i18n/navigation";
import type { LinkProps } from "next/link"; // type-only OK
```

- [ ] **Step 4: TypeScript check**

Run:
```bash
npx tsc --noEmit
```
Expected: PASS. Si des erreurs apparaissent (signatures de props différentes entre `next/link` et `next-intl/navigation`), corriger.

> Différence connue : `Link` de `next-intl` accepte une prop `locale` optionnelle pour overrider la locale courante. Sinon API compatible.

- [ ] **Step 5: Verify in dev**

Run `npm run dev`, ouvrir `http://localhost:3000/fr`. Cliquer sur plusieurs liens internes (nav, CTAs, footer). Vérifier qu'on reste toujours sous `/fr/...`. Switch vers `/en` via le LanguageSwitcher, cliquer un lien interne → URL doit rester sous `/en/...`.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "refactor(i18n): migrate next/link imports to locale-aware navigation"
```

---

## Task 15: Audit and migrate Tailwind directional utilities

But : remplacer `ml-*`, `pr-*`, `text-left`, `left-0` etc. par leurs versions logiques bidi (`ms-*`, `pe-*`, `text-start`, `start-0`) pour que le layout soit correct en RTL.

Tailwind v4 fournit ces utilities nativement. Aucun plugin requis.

**Files:** Tous les fichiers `src/components/**/*.tsx` contenant des classes Tailwind directionnelles.

- [ ] **Step 1: Generate the audit list**

Run PowerShell:
```powershell
$patterns = @(
  '\bml-\d', '\bmr-\d', '\bpl-\d', '\bpr-\d',
  '\btext-left\b', '\btext-right\b',
  '\bleft-\d', '\bright-\d', '\bleft-0\b', '\bright-0\b',
  '\brounded-l-', '\brounded-r-',
  '\bborder-l\b', '\bborder-r\b'
)
$results = @{}
foreach ($p in $patterns) {
  $matches = Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts |
    Select-String -Pattern $p
  foreach ($m in $matches) {
    if (-not $results.ContainsKey($m.Path)) { $results[$m.Path] = @() }
    $results[$m.Path] += "L$($m.LineNumber): $($m.Line.Trim())"
  }
}
$results.GetEnumerator() | ForEach-Object {
  Write-Host $_.Key -ForegroundColor Cyan
  $_.Value | ForEach-Object { Write-Host "  $_" }
}
```
Expected: liste de fichiers avec lignes contenant des utilities directionnelles.

- [ ] **Step 2: Replace in bulk via PowerShell (réversibles bi-directionnels)**

Run PowerShell:
```powershell
$mappings = @{
  '\bml-' = 'ms-'
  '\bmr-' = 'me-'
  '\bpl-' = 'ps-'
  '\bpr-' = 'pe-'
  '\btext-left\b' = 'text-start'
  '\btext-right\b' = 'text-end'
  '\brounded-l-' = 'rounded-s-'
  '\brounded-r-' = 'rounded-e-'
  '\bborder-l\b' = 'border-s'
  '\bborder-r\b' = 'border-e'
}
$files = Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts
foreach ($f in $files) {
  $c = Get-Content $f.FullName -Raw
  $modified = $false
  foreach ($k in $mappings.Keys) {
    if ($c -match $k) {
      $c = $c -replace $k, $mappings[$k]
      $modified = $true
    }
  }
  if ($modified) {
    Set-Content -Path $f.FullName -Value $c -NoNewline
    Write-Host "Updated: $($f.FullName)" -ForegroundColor Green
  }
}
```

> **NOTE IMPORTANTE** : On ne remplace **pas** `left-N` → `start-N` et `right-N` → `end-N` automatiquement, car certaines occurrences peuvent être des positions absolues volontaires (ex. `right-0` pour un drawer qui doit toujours sortir à droite, même en RTL). Auditer ces cas manuellement après le script :
> ```powershell
> Select-String -Path src/**/*.tsx -Pattern '\b(left|right)-\d'
> ```
> Pour chaque cas, décider : utility logique (RTL-aware) ou rester directionnel (LTR fixe).

- [ ] **Step 3: TypeScript check + dev visual smoke**

Run:
```bash
npx tsc --noEmit
npm run dev
```

Naviguer sur `/fr/` (LTR) : tout doit être strictement identique à avant. Naviguer sur `/ar/` (RTL) : tout doit être mirroré horizontalement.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "refactor(i18n): migrate Tailwind directional utilities to logical bidi"
```

---

## Task 16: Add E2E Playwright tests for i18n

**Files:**
- Create: `tests/e2e/i18n.spec.ts`

- [ ] **Step 1: Verify playwright config**

Read `playwright.config.ts`. Confirmer que `baseURL` est configuré sur `http://localhost:3000` ou similaire, et qu'il y a un `webServer` (sinon il faut lancer `npm run dev` manuellement avant les tests).

- [ ] **Step 2: Create the E2E test**

Create `tests/e2e/i18n.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("i18n routing", () => {
  test("/ redirects to /fr (or detected locale)", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expect(page.url()).toMatch(/\/(fr|en|ar)(\/|$)/);
  });

  test("/fr/services renders 200 with lang=fr dir=ltr", async ({ page }) => {
    await page.goto("/fr/services");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "fr");
    await expect(html).toHaveAttribute("dir", "ltr");
  });

  test("/ar/services renders 200 with lang=ar dir=rtl", async ({ page }) => {
    await page.goto("/ar/services");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "ar");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("/services returns 308 redirect to /fr/services", async ({ request }) => {
    const res = await request.get("/services", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/fr/services");
  });

  test("LanguageSwitcher preserves path when switching locale", async ({ page }) => {
    await page.goto("/fr/services");
    await page.selectOption("select[aria-label='Change language']", "en");
    await expect(page).toHaveURL(/\/en\/services$/);
  });

  test("NEXT_LOCALE cookie set after switch", async ({ page, context }) => {
    await page.goto("/fr");
    await page.selectOption("select[aria-label='Change language']", "en");
    await page.waitForURL(/\/en/);
    const cookies = await context.cookies();
    const cookie = cookies.find((c) => c.name === "NEXT_LOCALE");
    expect(cookie?.value).toBe("en");
  });
});
```

- [ ] **Step 3: Run the E2E tests**

Run:
```bash
npm run test:e2e -- tests/e2e/i18n.spec.ts
```
Expected: 6 tests PASS. Si un test échoue :
- "308 redirect" — vérifier `next.config.ts` Task 9
- "LanguageSwitcher preserves path" — vérifier l'intégration Task 13
- "lang/dir attributes" — vérifier `[locale]/layout.tsx` Task 5

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/i18n.spec.ts
git commit -m "test(i18n): add E2E tests for routing, redirects, switcher, RTL"
```

---

## Task 17: Final verification — Lighthouse + manual smoke

But : confirmer qu'il n'y a aucune régression de performance et que la totalité du site fonctionne sous `/fr/...`.

- [ ] **Step 1: Build + start production**

Run:
```bash
npm run build
npm run start
```
Expected: build sans erreur, serveur démarre sur port 3000.

- [ ] **Step 2: Run Lighthouse on /fr/**

Dans Chrome devtools → Lighthouse → analyser `http://localhost:3000/fr/`.
- **Performance** ≥ 90 (la cible définie dans la spec)
- **Accessibility** ≥ 90 (le `lang` attribute en place doit aider)
- **SEO** : score actuel — sera amélioré au sous-projet B

Si Performance < 90, comparer avec le score AVANT migration (avant Task 5) — si écart < 5 points, acceptable ; si écart > 5 points, investiguer (probablement la double passe middleware → diagnostiquer via Network tab).

- [ ] **Step 3: Run full smoke checklist (cf. spec section 6.1)**

| Cas | OK ? |
|---|---|
| `/` → redirige vers `/fr` ou autre locale détectée | ☐ |
| `/fr/`, `/fr/services`, `/fr/formations`, `/fr/about`, `/fr/contact`, `/fr/blog`, `/fr/poles`, `/fr/projects`, `/fr/secteurs` rendent 200 | ☐ |
| `/en/services`, `/ar/services` rendent 200 | ☐ |
| `/services`, `/formations`, `/blog`, `/contact` (anciennes URLs) → 308 vers `/fr/...` (test `curl.exe -I`) | ☐ |
| `/ar/services` : `<html lang="ar" dir="rtl">` (devtools) | ☐ |
| LanguageSwitcher fonctionnel desktop + mobile, préserve le chemin | ☐ |
| Cookie `NEXT_LOCALE` posé après switch (devtools → Application → Cookies) | ☐ |
| Police Cairo chargée sur `/ar/*` (Network tab → filtre `cairo`) | ☐ |
| Parcours 7 salles `/fr/` se déroule normalement (mollette + flèches + swipe) — pas de blocage | ☐ |
| Catalogue `/fr/formations` (live Shopify) charge les produits | ☐ |
| Formulaire `/fr/contact` envoie un message (à tester avec un email de test) | ☐ |

Si tout est OK → terminer. Si un cas échoue → ouvrir un ticket / fix avant déploiement.

- [ ] **Step 4: Stop server**

Ctrl+C.

- [ ] **Step 5: No file changes — no commit needed**

---

## Acceptance Criteria (from spec)

- ✅ Toutes les pages existantes accessibles sous `/fr/...` avec contenu identique à l'avant-migration (Task 7-8)
- ✅ Les pages `/en/...` et `/ar/...` répondent sans erreur (Task 8)
- ✅ `<html lang dir>` corrects par locale (Task 5)
- ✅ Switcher fonctionnel sur desktop + mobile (Task 12-13)
- ✅ 308 depuis chaque ancienne URL vers `/fr/...` (Task 9)
- ✅ Sitemap inclut les 3 locales avec `alternates.languages` (Task 10)
- ✅ Aucune régression visuelle sur `/fr/...` (Task 8 + Task 17)
- ✅ Lighthouse Performance ≥ 90 (Task 17)

## Notes

- **Subagent-driven execution recommandé** : ce plan a 17 tâches dont plusieurs purement mécaniques (migration imports, audit Tailwind). Idéal pour parallélisation et review entre étapes.
- **Tâches indépendantes parallélisables** : Task 10 (sitemap) et Task 11 (useDirection) ne dépendent que de Task 2-3. Peuvent être exécutées en parallèle après Task 6.
- **Tâche bloquante** : Task 8 (smoke test) est un checkpoint critique — ne pas avancer si `/fr/` ne ressemble pas à l'ancien site.
