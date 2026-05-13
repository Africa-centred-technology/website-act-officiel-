# Spec — Fondations SEO techniques (sous-projet B)

**Date** : 2026-05-13
**Projet parent** : Référencement SEO multi-langues de `www.a-ct.ma`
**Branche** : `feat/i18n-architecture` (poursuite de A — commits empilés sur la même branche)
**Statut** : Design validé, en attente de relecture utilisateur
**Sous-projet précédent** : A — Architecture i18n (terminé, 16 commits)
**Sous-projet suivant** : C — Traduction du contenu EN/AR

---

## 1. Contexte

Le sous-projet A a livré l'architecture i18n (next-intl, routing `/fr` `/en` `/ar`, dictionnaires verbatim, middleware, layout localisé, switcher de langue, 308 redirects, sitemap multi-locales basique). Le site fonctionne en 3 locales avec un fallback FR pour le contenu.

Audit post-A :
- Beaucoup de pages ont déjà des `metadata` (statiques) ou `generateMetadata` (dynamiques pour les `[slug]`). Tout est en FR, identique sur les 3 locales.
- Pas d'`alternates.languages` (hreflang) dans les `metadata`.
- Pas de `canonical` URL.
- `og:locale` hardcodé `fr_MA` dans `[locale]/layout.tsx`.
- Aucun JSON-LD structured data.
- Sitemap statique : 9 routes, pas de routes dynamiques Shopify (formations + blog).
- OG image unique = `logo.png` partout.
- Warning Next 16 : `middleware.ts` déprécié au profit de `proxy.ts`.

Ce sous-projet B couvre toutes ces lacunes.

## 2. Objectifs et critères d'acceptation

### Objectifs

1. Servir des `metadata` par-page localisées (titre, description, OG, Twitter) via un helper centralisé.
2. Inclure `alternates.languages` (`hreflang` fr/en/ar + `x-default`) + `canonical` sur chaque page.
3. Rendre l'`og:locale` dynamique (`fr_MA` / `en_US` / `ar_MA`) selon la locale courante.
4. Injecter du **JSON-LD structured data** : `Organization` (global), `BreadcrumbList` (pages internes), `Course` (formations Shopify), `Article` (blog).
5. Étendre le sitemap pour inclure les routes dynamiques (formations Shopify + articles blog) avec fail-soft et `x-default`.
6. Générer des images Open Graph dynamiques via `next/og` (route `/api/og`).
7. Migrer `middleware.ts` → `proxy.ts` (deprecation Next 16).

### Critères d'acceptation

- ✅ Toutes les pages ont une `metadata.alternates.languages` complète (fr/en/ar + x-default) avec URLs canoniques.
- ✅ `og:locale` correspond à la locale rendue (`fr_MA`, `en_US`, `ar_MA`).
- ✅ Le HTML rendu de `/fr/` contient un `<script type="application/ld+json">` avec `"@type":"Organization"`.
- ✅ Le HTML rendu de `/fr/formations/<slug>` contient un JSON-LD `Course` et un `BreadcrumbList`.
- ✅ Le HTML rendu de `/fr/blog/<slug>` contient un JSON-LD `Article`.
- ✅ `/sitemap.xml` contient au moins une entrée `/<locale>/formations/<handle>` (formation Shopify) et une entrée `/<locale>/blog/<handle>` (article blog).
- ✅ Si Shopify est down au build, le sitemap se génère quand même (fail-soft) sans les routes dynamiques.
- ✅ `/api/og?title=X` répond 200 avec `content-type: image/png` et une image 1200×630.
- ✅ Le warning « middleware file convention is deprecated » disparaît au `npm run dev`.
- ✅ Tous les tests existants passent + nouveaux tests Vitest + Playwright passent.
- ✅ Build production clean (aucune régression sur les 110 pages générées par A).

## 3. Décisions de cadrage

| Sujet | Décision | Justification |
|---|---|---|
| Branche | Poursuite de `feat/i18n-architecture` | Aucun gain à séparer A/B en deux branches puisque A non encore mergé en `main`. Un seul PR au final |
| Scope | Complet (MVP + JSON-LD + OG dynamiques + migration proxy) | Demande utilisateur. Permet de livrer un site SEO-ready niveau pro en une phase |
| Approche metadata | Helper centralisé `buildPageMetadata()` + variante dynamique | DRY, scalable, point de contrôle unique pour evolutions (ex. ajouter `twitter:site` partout) |
| OG images | Route API `/api/og` via `next/og` ImageResponse | Couvre pages statiques + dynamiques, génération à la volée, cache CDN |
| JSON-LD typing | `schema-dts` (devDep, types-only) | Types officiels Schema.org → autocomplétion + erreur si mauvais nom de propriété |
| Traductions metadata | Verbatim FR pour EN/AR (dictionnaires partagés) | Aligné avec décision A. Traductions réelles = sous-projet C |
| Fail-soft sitemap | `Promise.allSettled` pour les fetchs Shopify | Si Shopify est down, le sitemap statique se génère quand même. Aucun risque pour le SEO existant |
| Revalidation sitemap | `revalidate = 3600` (1h) | Compromis entre fraîcheur et coût API Shopify |

## 4. Architecture

### 4.1 Helper `buildPageMetadata`

**Fichier** : `src/i18n/seo.ts`

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

type Params = {
  locale: string;
  namespace: string;  // ex: "metadata.about"
  path: string;        // sans la locale, ex: "/about"
  ogImage?: string;    // override (sinon /api/og avec title)
};

export async function buildPageMetadata({
  locale, namespace, path, ogImage,
}: Params): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const title = t("title");
  const description = t("description");

  const canonical = `${BASE_URL}/${locale}${path}`;
  const ogImageUrl = ogImage ?? `/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ["x-default", `${BASE_URL}/${routing.defaultLocale}${path}`],
      ]),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE_MAP[locale as keyof typeof OG_LOCALE_MAP],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE_MAP[l as keyof typeof OG_LOCALE_MAP]),
      url: canonical,
      siteName: "Africa Centred Technology",
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
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
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ["x-default", `${BASE_URL}/${routing.defaultLocale}${path}`],
      ]),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE_MAP[locale as keyof typeof OG_LOCALE_MAP],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE_MAP[l as keyof typeof OG_LOCALE_MAP]),
      url: canonical,
      siteName: "Africa Centred Technology",
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
```

**Usage en page statique** :

```tsx
// src/app/[locale]/about/page.tsx
import { buildPageMetadata } from "@/i18n/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata({ locale, namespace: "metadata.about", path: "/about" });
}
```

**Usage en page dynamique `[slug]`** :

```tsx
// src/app/[locale]/formations/[slug]/page.tsx
import { buildDynamicPageMetadata } from "@/i18n/seo";

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const formation = await fetchFormationBySlug(slug);
  return buildDynamicPageMetadata({
    locale,
    path: `/formations/${slug}`,
    title: formation.title,
    description: formation.excerpt,
    ogImage: `/api/og?title=${encodeURIComponent(formation.title)}&subtitle=Formation`,
  });
}
```

### 4.2 Extension des dictionnaires

`src/i18n/messages/fr.json` — ajouter sous `metadata` :

```json
"metadata": {
  "home":       { "title": "...", "description": "..." },
  "about":      { "title": "...", "description": "..." },
  "services":   { "title": "...", "description": "..." },
  "formations": { "title": "...", "description": "..." },
  "poles":      { "title": "...", "description": "..." },
  "secteurs":   { "title": "...", "description": "..." },
  "projects":   { "title": "...", "description": "..." },
  "blog":       { "title": "...", "description": "..." },
  "contact":    { "title": "...", "description": "..." }
}
```

Les valeurs initiales sont récupérées depuis les `metadata` statiques actuelles de chaque page (titres/descriptions FR existants). `en.json` et `ar.json` sont mis à jour en parallèle pour rester verbatim copies de `fr.json`.

### 4.3 Layout root metadata épuré

`src/app/[locale]/layout.tsx` — la `metadata` statique perd les champs gérés par-page (`title`, `description`, `openGraph` détaillé, `keywords` page-spécifiques). Garde uniquement les invariants globaux :

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://www.a-ct.ma"),
  icons: { icon: "/logo/logo.png", apple: "/logo/logo.png" },
  verification: { google: "iRIaR0ZtvBgQSDQPwMV4eOL0-Gajr88p6_t-qKfiSno" },
};
```

Le `title`, `description`, `openGraph.locale`, `openGraph.url`, etc. sont désormais générés par les pages individuelles via `buildPageMetadata`. Next merge automatiquement le metadata du layout et de la page (la page écrase, les champs absents en page tombent sur le layout).

### 4.4 Route `/api/og`

**Fichier** : `src/app/api/og/route.tsx`

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
      <div style={{
        width: "100%", height: "100%",
        background: BG, color: FG,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 100px",
        fontFamily: "Outfit",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28,
            background: accent, color: BG,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800,
          }}>A</div>
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

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, opacity: 0.7 }}>
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

**Params** :
- `title` — texte principal (tronqué à 120 caractères)
- `subtitle` — surtitre (tronqué à 60 caractères, ex. "Formation", "Article")
- `accent` — couleur hex (par défaut `#D35400`)

**Runtime** : `edge` pour rapidité et coût minimal. **Cache** : 24h, immutable (l'image est purement déterminée par les query params, donc safe à cacher long).

**Hors-scope V1** : chargement de fonts custom (Outfit, Bebas Neue) dans `ImageResponse`. La font système est utilisée par défaut. À enrichir ultérieurement si besoin esthétique.

### 4.5 JSON-LD structured data

**Composant** : `src/components/seo/JsonLd.tsx`

Composant Server Component minimal qui rend une balise `<script type="application/ld+json">` contenant le résultat de `JSON.stringify(data)`. Le pattern d'injection est celui documenté par Next.js (voir https://nextjs.org/docs/app/guides/json-ld) — il consiste à utiliser la prop React d'injection HTML brute sur l'élément `<script>` avec `{ __html: JSON.stringify(data) }`.

**Justification sécurité** : `data` est typé via `schema-dts` (`WithContext<T>`), généré uniquement par notre code applicatif (jamais d'input utilisateur), et `JSON.stringify` ne produit jamais de balises HTML — uniquement du JSON valide. Le navigateur n'exécute pas ce contenu (`type` est `application/ld+json`, pas `text/javascript`). Pattern recommandé par Google Search Central et Next.js. À NE PAS confondre avec un usage généralisé sur du contenu HTML utilisateur.

Signature du composant :

```ts
import type { Thing, WithContext } from "schema-dts";

export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }): JSX.Element;
```

> **Note pour l'implémenteur** : le code exact (incluant la prop d'injection HTML brute) sera détaillé dans le plan d'implémentation. Suivre strictement le pattern Next.js officiel cité plus haut.

**Helpers de construction** : `src/i18n/seo-jsonld.ts` — quatre fonctions exportées :

```ts
import type {
  Organization, BreadcrumbList, Course, Article, WithContext,
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
    sameAs: [
      // À remplir lors de l'implémentation : LinkedIn, Twitter/X, YouTube, Instagram (URLs prod)
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      // Adresse précise à remplir si dispo lors de l'implémentation
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@a-ct.ma", // à confirmer lors de l'implémentation
      areaServed: ["MA", "FR", "Africa"],
      availableLanguage: ["fr", "en", "ar"],
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
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
  return {
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
    ...(opts.price && opts.currency
      ? {
          offers: {
            "@type": "Offer",
            price: opts.price,
            priceCurrency: opts.currency,
            availability: "https://schema.org/InStock",
            url: `${BASE_URL}/${opts.locale}/formations/${opts.slug}`,
          },
        }
      : {}),
    ...(opts.startDate
      ? {
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "onsite",
            startDate: opts.startDate,
          },
        }
      : {}),
  };
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
  return {
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
    ...(opts.image ? { image: opts.image } : {}),
  };
}
```

**Placement** :

| Schéma | Fichier où injecter | Pages affectées |
|---|---|---|
| `Organization` | `[locale]/layout.tsx` | Toutes |
| `BreadcrumbList` | Chaque page interne (about, services, formations, etc.) | Pages internes |
| `Course` | `formations/[slug]/page.tsx` | Fiches formation |
| `Article` | `blog/[slug]/page.tsx` | Articles blog |

**Labels breadcrumb hardcodés en FR pour V1** ("Accueil", "Formations", "Blog") — ils seront traduits dans le sous-projet C en même temps que le reste du contenu.

**Hors-scope V1** : `FAQPage` (pas de FAQ structurée), `Review` (pas de système d'avis), `Product` (formations modélisées en `Course` plus pertinent), `VideoObject` (pas de vidéos hébergées). À considérer quand les données seront disponibles.

### 4.6 Sitemap dynamique

`src/app/sitemap.ts` réécrit en async, fetch Shopify avec `Promise.allSettled` pour fail-soft.

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchShopifyFormations } from "@/lib/shopify/formations";
import { fetchShopifyBlogPosts } from "@/lib/shopify/blog";

const BASE_URL = "https://www.a-ct.ma";

const STATIC_ROUTES = [/* ...9 routes statiques inchangées... */];

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
          entry(`/formations/${f.handle}`, {
            changeFrequency: "weekly",
            priority: 0.7,
            lastModified: f.updatedAt ? new Date(f.updatedAt) : undefined,
          })
        )
      : [];

  const blogEntries =
    posts.status === "fulfilled"
      ? posts.value.map((p) =>
          entry(`/blog/${p.handle}`, {
            changeFrequency: "monthly",
            priority: 0.6,
            lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
          })
        )
      : [];

  return [...staticEntries, ...formationEntries, ...blogEntries];
}
```

**Comportement** :
- Statique d'abord, dynamique ensuite — si Shopify timeout / rejette, on a au moins le sitemap statique.
- `x-default` réutilise la valeur de la locale par défaut.
- `revalidate = 3600` — Next régénère le sitemap toutes les heures côté serveur.

### 4.7 Migration `middleware.ts` → `proxy.ts`

**Action** : renommer `src/middleware.ts` → `src/proxy.ts`. Contenu identique :

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

L'API `createMiddleware` de `next-intl` reste compatible. Le warning Next 16 disparaît. Les 6 tests E2E Playwright valident le bon fonctionnement.

## 5. Plan de tests

### 5.1 Vitest unit

| Fichier | Tests ajoutés |
|---|---|
| `tests/unit/i18n/seo.test.ts` | `buildPageMetadata` retourne `alternates.languages` complet + `canonical` + `og:locale` correct par locale + image `/api/og?...` par défaut |
| `tests/unit/i18n/seo-jsonld.test.ts` | Chaque helper retourne un objet avec `@type` et `@context` corrects ; encodage params OK |
| `tests/unit/i18n/sitemap.test.ts` (étendu) | Mocks `fetchShopifyFormations` + `fetchShopifyBlogPosts` ; vérifie présence entrées dynamiques + `x-default` + fail-soft |

### 5.2 Playwright E2E

**Nouveau fichier** : `tests/e2e/seo.spec.ts`.

- `<link rel="canonical">` présent sur `/fr/services` avec la bonne URL
- `<link rel="alternate" hreflang="en">`, `="ar"`, `="x-default"` présents
- `<meta property="og:locale">` = `fr_MA` sur `/fr/`, `en_US` sur `/en/`, `ar_MA` sur `/ar/`
- `/fr/` contient un JSON-LD `Organization`
- `/fr/formations/<slug>` contient un JSON-LD `Course`
- `/fr/blog/<slug>` contient un JSON-LD `Article`
- `/api/og?title=Test` répond 200 avec `content-type: image/png`
- `/sitemap.xml` contient `/<locale>/formations/<handle>` + `/<locale>/blog/<handle>`

### 5.3 Validation manuelle post-déploiement

- [Google Rich Results Test](https://search.google.com/test/rich-results) sur 3 pages clés (home, formation, article) → Organization / Course / Article détectés
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) et Facebook Sharing Debugger sur une URL → OG image dynamique affichée correctement
- Google Search Console après déploiement → onglet "Indexation > Sitemaps", confirmer ingestion + indexation progressive des routes dynamiques

## 6. Risques et points d'attention

| Risque | Mitigation |
|---|---|
| `og:locale` mal mappé pour une locale → mauvais social share | `OG_LOCALE_MAP` typé `as const` avec assertions TypeScript ; test unit vérifie chaque locale |
| Shopify down au build → sitemap incomplet | `Promise.allSettled` + degradation gracieuse au sitemap statique ; alerte CI envisageable |
| JSON-LD invalide → Google ignore les rich snippets | `schema-dts` types ; validation manuelle Rich Results Test post-déploiement |
| `/api/og` lent au scrape → social cards expirent | Edge runtime + cache 24h immutable + headers cache explicites |
| Métadonnées dupliquées entre layout et page | `metadata` layout épuré (uniquement invariants globaux) ; chaque page définit son `title`/`description` complets via helper |
| `proxy.ts` migration introduit régression | 6 tests E2E + smoke check curl manuel des redirections ; rollback trivial (git revert) |
| Régression contenu existant (titles FR cassés) | Migration progressive page par page ; chaque page testée individuellement après migration |
| Hook security warning sur le pattern JSON-LD | Le pattern Next.js officiel pour JSON-LD requiert une prop React d'injection HTML brute sur un `<script type="application/ld+json">`. C'est documenté comme sûr car (1) `data` est typé `schema-dts`, (2) `JSON.stringify` ne produit pas de HTML, (3) le navigateur n'exécute pas `application/ld+json`. Si le hook de sécurité bloque, justifier explicitement dans la PR. |

## 7. Livrables

**Créés** :
- `src/i18n/seo.ts`
- `src/i18n/seo-jsonld.ts`
- `src/components/seo/JsonLd.tsx`
- `src/app/api/og/route.tsx`
- `src/proxy.ts`
- `tests/unit/i18n/seo.test.ts`
- `tests/unit/i18n/seo-jsonld.test.ts`
- `tests/e2e/seo.spec.ts`

**Modifiés** :
- `src/app/[locale]/layout.tsx` — `metadata` épuré + injection `<JsonLd Organization />`
- ~17 pages `src/app/[locale]/**/page.tsx` — `generateMetadata` migré vers helper
- `src/app/[locale]/formations/[slug]/page.tsx` — + JSON-LD Course + Breadcrumb
- `src/app/[locale]/blog/[slug]/page.tsx` — + JSON-LD Article + Breadcrumb
- `src/app/sitemap.ts` — async, fetch Shopify, x-default, revalidate
- `src/i18n/messages/fr.json` + `en.json` + `ar.json` — extension namespace `metadata`
- `tests/unit/i18n/sitemap.test.ts` — extensions
- `package.json` — `+ schema-dts` (devDep)

**Supprimés** :
- `src/middleware.ts` (remplacé par `src/proxy.ts`)

## 8. Hors-scope

**Reporté au sous-projet C (Traduction)** :
- Traductions effectives EN/AR du namespace `metadata` (titres + descriptions par page)
- Traductions des labels breadcrumb (`"Accueil"`, `"Formations"`, etc.)
- Traduction du contenu statique des pages

**Reporté à un sous-projet ultérieur** :
- `FAQPage` JSON-LD (quand FAQ structurée disponible)
- `Review` / `AggregateRating` (quand système d'avis en place)
- `VideoObject` (quand vidéos hébergées)
- Routes statiques `[slug]` pôles/services/secteurs/projects dans le sitemap (mécanique mais V1 acceptable sans)
- Optimisation Core Web Vitals au-delà des fondations
- Custom fonts dans `ImageResponse` (Outfit, Bebas Neue chargées en runtime edge)
- Robots.txt enrichi (déjà fonctionnel basique)
