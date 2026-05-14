# Spec — Architecture i18n ACT (sous-projet A)

**Date** : 2026-05-13
**Projet parent** : Référencement SEO multi-langues de `www.a-ct.ma`
**Statut** : Design validé, en attente de relecture utilisateur
**Sous-projet suivant** : B — Fondations SEO techniques (metadata, JSON-LD, sitemap dynamique)
**Sous-projet ultérieur** : C — Traduction du contenu EN/AR

---

## 1. Contexte et décomposition

Le projet initial est « travailler le SEO de a-ct.ma en multi-pays / multi-langues (FR + EN + AR) ». Audit préalable :

- Le site Next.js 16 (App Router) n'a **aucune infrastructure i18n** actuellement (pas de `next-intl`, pas de routing localisé, pas de dictionnaires).
- Locale unique : FR. URL en production : `https://www.a-ct.ma/`.
- Stack SEO existant : `metadata` root basique, `sitemap.ts` statique (avec routes obsolètes), `robots.ts` minimal, GA + GTM + Meta Pixel + Search Console actifs.

Un chantier « SEO multi-langues from-scratch » est en réalité 3 sous-projets dépendants :

| # | Sous-projet | Nature | Dépend de |
|---|---|---|---|
| **A** | **Architecture i18n** — routing `/fr` `/en` `/ar`, middleware, dictionnaires, RTL, switcher | Architecture frontend | — |
| **B** | **Fondations SEO techniques** — metadata par page, JSON-LD, sitemap dynamique multilingue, hreflang | SEO technique | **A** |
| **C** | **Traduction du contenu** — textes UI, formations Shopify, articles blog en EN + AR | Contenu / opérationnel | **A** |

Cette spec couvre **uniquement le sous-projet A**.

## 2. Objectifs et critères d'acceptation

### Objectifs

1. Mettre en place l'infrastructure i18n Next.js permettant de servir le site sous `/fr/...`, `/en/...`, `/ar/...`.
2. Préserver le SEO existant via redirections 308 depuis les anciennes URLs racine.
3. Préparer le terrain pour les sous-projets B (SEO) et C (traductions).
4. **Aucune régression visuelle ou fonctionnelle** pour un visiteur FR.

### Critères d'acceptation

- ✅ Toutes les pages existantes accessibles sous `/fr/...` avec contenu identique à l'avant-migration.
- ✅ Les pages `/en/...` et `/ar/...` répondent sans erreur (contenu = texte FR, car `en.json` et `ar.json` sont une copie verbatim de `fr.json` à ce stade).
- ✅ `<html lang dir>` corrects par locale (`dir="rtl"` sur `/ar/*`).
- ✅ Switcher de langue fonctionnel sur desktop + mobile, préserve le chemin courant.
- ✅ Redirections 308 depuis chaque ancienne URL racine vers `/fr/...`.
- ✅ Sitemap inclut les 3 locales avec `alternates.languages`.
- ✅ Aucune régression visuelle sur `/fr/*` (parité stricte avec le site actuel).
- ✅ Lighthouse Performance ≥ 90 sur `/fr/` (vérifier que le middleware n'ajoute pas de latence notable).

## 3. Décisions de cadrage

| Sujet | Décision | Justification |
|---|---|---|
| Librairie i18n | `next-intl` | Standard de facto pour App Router, support Server Components, ICU, types générés |
| Locales | `fr` (défaut), `en`, `ar` | Demande utilisateur |
| Stratégie de routing | `localePrefix: 'always'` — préfixe pour toutes | URLs uniformes, hreflang propre, asymétrie évitée |
| Comportement `/` | Middleware détecte `Accept-Language` → redirige vers `/fr`, `/en` ou `/ar` | Standard next-intl, UX correcte pour visiteur primo |
| Cookie de mémorisation | `NEXT_LOCALE`, 1 an | Standard next-intl |
| Slugs localisés | Non en V1 (mêmes slugs entre locales) | Itération ultérieure, moins critique, plus risqué côté analytics |
| Scope traduction | Infra seule, `fr.json` rempli, `en.json` et `ar.json` = copie verbatim de `fr.json` | Le contenu se traduit dans le sous-projet C ; copie verbatim plutôt que clés vides pour éviter d'avoir à configurer un mécanisme de fallback dans next-intl |

## 4. Architecture

### 4.1 Structure de routing

Toutes les pages sont déplacées sous un segment dynamique `[locale]` :

```
src/app/
├── [locale]/
│   ├── layout.tsx          ← <html lang dir> + NextIntlClientProvider
│   ├── page.tsx            ← home (ex-/)
│   ├── about/page.tsx
│   ├── formations/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── poles/page.tsx
│   ├── services/page.tsx
│   ├── secteurs/page.tsx
│   ├── projects/page.tsx
│   ├── blog/page.tsx
│   └── contact/page.tsx
├── api/                    ← hors [locale], inchangé
├── sitemap.ts              ← racine, génère les 3 locales
├── robots.ts               ← racine, inchangé
└── layout.tsx              ← shell minimal (passe-plat)
```

### 4.2 Configuration `next-intl`

**`src/i18n/routing.ts`** — source de vérité unique pour les locales :

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en', 'ar'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  localeDetection: true,
  localeCookie: { name: 'NEXT_LOCALE', maxAge: 60 * 60 * 24 * 365 }
});

export type Locale = (typeof routing.locales)[number];
```

**`src/i18n/navigation.ts`** — helpers typés de navigation :

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

> Conséquence : tous les composants doivent migrer `import Link from 'next/link'` → `import { Link } from '@/i18n/navigation'` pour que la locale soit préservée lors des navigations internes.

**`src/middleware.ts`** :

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

### 4.3 Layout localisé

**`src/app/[locale]/layout.tsx`** reprend le contenu actuel de `src/app/layout.tsx` mais devient locale-aware. Le `<html>` y est rendu avec `lang` et `dir` dynamiques.

```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setRequestLocale, getMessages } from 'next-intl/server';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} data-theme="dark" suppressHydrationWarning>
      <head>{/* fonts + GTM + Meta Pixel inchangés (cf. layout actuel) */}</head>
      <body /* … */>
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

**`src/app/layout.tsx`** devient un passe-plat minimal :

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### 4.4 Dictionnaires

**Emplacement** : `src/i18n/messages/<locale>.json` (un fichier par locale).

**Structure de namespaces** (clés racine du JSON) :

```
src/i18n/messages/fr.json
{
  "common":     { "cta", "nav", "footer", "lang", … },
  "home":       { /* parcours 7 salles */ },
  "about":      { /* … */ },
  "formations": { /* catalogue, fiche, inscription */ },
  "poles":      { /* 3 pôles */ },
  "services":   { /* 9 services */ },
  "secteurs":   { /* … */ },
  "projects":   { /* … */ },
  "blog":       { /* … */ },
  "contact":    { /* formulaire + validations */ },
  "metadata":   { /* title + description par route — prépare le sous-projet B */ }
}
```

`en.json` et `ar.json` ont la **même structure de clés** avec **valeurs initialement identiques au FR** (copie verbatim). Ce n'est pas un fallback automatique de next-intl (qui par défaut affiche la clé ou lance une erreur sur clé manquante) — c'est une duplication assumée, qui rend les locales fonctionnelles immédiatement et localise le travail du sous-projet C à « remplacer ces valeurs FR par leurs traductions » plutôt que « ajouter des clés manquantes ».

**Type-safety** — `src/global.d.ts` :

```ts
declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof import('./i18n/messages/fr.json');
  }
}
```

### 4.5 RTL pour l'arabe

**CSS / Tailwind v4** : utilities logiques bidirectionnelles. Audit et remplacement des classes directionnelles dans tous les composants :

| Avant (LTR-only) | Après (bidi) |
|---|---|
| `ml-*`, `mr-*` | `ms-*`, `me-*` |
| `pl-*`, `pr-*` | `ps-*`, `pe-*` |
| `text-left`, `text-right` | `text-start`, `text-end` |
| `left-*`, `right-*` | `start-*`, `end-*` |
| `rounded-l-*`, `rounded-r-*` | `rounded-s-*`, `rounded-e-*` |
| `border-l`, `border-r` | `border-s`, `border-e` |

**Polices arabes** : ajouter **Cairo** (Google Fonts) au préchargement dans `[locale]/layout.tsx`. `Bebas Neue` et `Outfit` actuelles n'incluent pas l'arabe.

**Animations Framer Motion / GSAP** : introduire un hook `useDirection()` qui retourne `1` (LTR) ou `-1` (RTL) pour multiplier les translations `x` dans les variantes Framer. Plus simple que de réécrire toutes les animations.

**Composants à re-tester manuellement en RTL** :
- `home/Shell.tsx` (parcours 7 salles, `AnimatePresence`)
- `WaveTerrain`, `Cursor`, `Grain` (3D / canvas)
- Tous les sliders Swiper (`swiper` a un mode RTL natif via `dir="rtl"` sur le conteneur)

**Hors-scope V1** : perfection des animations RTL. Cible : rendu correct (pas cassé), avec imperfections documentées pour itération.

### 4.6 Language switcher

**Composant** : `src/components/layout/LanguageSwitcher.tsx`, intégré dans le `Header`.

```tsx
'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = { fr: 'Français', en: 'English', ar: 'العربية' };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value as 'fr' | 'en' | 'ar' })}
      aria-label="Change language"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>{LABELS[l]}</option>
      ))}
    </select>
  );
}
```

Le `<select>` est un **placeholder fonctionnel** : le styling effectif (dropdown custom, animations, intégration thème dark/light, polices Outfit/Bebas) se définit à l'implémentation.

**Position** :
- Desktop : à droite du `Header`, avant le CTA de contact.
- Mobile : dans le menu hamburger ouvert.

**Notes** :
- L'arabe `العربية` s'affiche en RTL même quand la locale courante est LTR (CSS `unicode-bidi: plaintext` ou `dir="auto"` sur l'option).
- Switch sans JS : hors-scope V1, on accepte que le switch requière JS.

### 4.7 Migration des URLs existantes (redirections 308)

Mécanisme : `redirects()` dans `next.config.ts`. Exécuté **avant** le middleware → garantit que `/services` part en 308 vers `/fr/services` sans passer par la détection Accept-Language (ce qui pourrait sinon casser le SEO en redirigeant vers `/en/services` pour un navigateur EN).

```ts
async redirects() {
  const ROUTES = ['about', 'formations', 'poles', 'services',
                  'secteurs', 'projects', 'blog', 'contact'];
  return [
    ...ROUTES.map(r => ({
      source: `/${r}`,
      destination: `/fr/${r}`,
      permanent: true   // 308 — transfère le PageRank
    })),
    ...ROUTES.map(r => ({
      source: `/${r}/:path*`,
      destination: `/fr/${r}/:path*`,
      permanent: true
    }))
  ];
}
```

**Cas particulier `/`** : pas de redirection forcée dans `redirects()`. On laisse le middleware faire la détection Accept-Language. Google indexera `/fr`, `/en`, `/ar` séparément via `hreflang` (cf. sous-projet B).

### 4.8 Sitemap multi-locales

`src/app/sitemap.ts` réécrit pour générer **les 3 locales** avec `alternates.languages` (équivalent `hreflang` dans le sitemap). Les routes obsolètes actuelles (`/nous-decouvrir`, `/notre-savoir-faire`) sont supprimées.

```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://www.a-ct.ma';

const STATIC_ROUTES = [
  { path: '',           changeFrequency: 'weekly' as const,  priority: 1.0 },
  { path: '/formations',changeFrequency: 'weekly' as const,  priority: 0.9 },
  { path: '/poles',     changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/services',  changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/secteurs',  changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/projects',  changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about',     changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/blog',      changeFrequency: 'daily'   as const, priority: 0.7 },
  { path: '/contact',   changeFrequency: 'monthly' as const, priority: 0.6 },
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

`robots.ts` reste valide tel quel (pointe vers `/sitemap.xml`).

## 5. Hors-scope explicite

**Reporté au sous-projet B (SEO)** :
- `generateMetadata()` localisé par page (title/description/OG par route + locale)
- JSON-LD structured data (Organization, Course, Article, BreadcrumbList, FAQPage)
- Sitemap dynamique incluant formations Shopify et articles blog
- Balise `x-default` dans hreflang
- Balises `<link rel="alternate" hreflang="...">` dans `<head>` de chaque page

**Reporté au sous-projet C (Traduction)** :
- Remplir les dictionnaires `en.json` et `ar.json`
- Traduire le contenu statique de `src/lib/data/` (services, pôles, secteurs, projects)
- Traduire les formations Shopify (via metafields multi-langues ou markets)
- Traduire les articles blog

## 6. Plan de tests

### 6.1 Smoke test manuel post-déploiement preview

- `/` → redirige vers `/fr` (ou la locale du navigateur)
- `/fr/services`, `/en/services`, `/ar/services` répondent 200
- `/services` (ancienne URL) → 308 vers `/fr/services` (vérifier avec `curl -I`)
- `/ar/services` : `<html lang="ar" dir="rtl">` dans le DOM
- Language switcher : passe de `/fr/formations` à `/en/formations` (préserve le chemin)
- Cookie `NEXT_LOCALE` posé après un switch
- Police Cairo chargée sur `/ar/*`
- Au moins `/fr/` (parcours 7 salles) testé en RTL pour vérifier qu'aucune animation n'est cassée

### 6.2 Tests E2E Playwright

- Test « routing locales » : visite `/`, vérifie redirection vers `/fr`
- Test « préservation du chemin au switch » : sur `/fr/services`, clic switcher → EN, vérifie URL = `/en/services`
- Test « redirection 308 anciennes URLs » : visite `/services`, vérifie statut HTTP final + URL finale
- Test « RTL sur AR » : visite `/ar`, vérifie `document.documentElement.dir === 'rtl'`

### 6.3 Tests unitaires Vitest

- `LanguageSwitcher` rend bien les 3 locales et déclenche `router.replace` au change
- `routing.ts` exporte la bonne config (locales, defaultLocale)

## 7. Risques et points d'attention

| Risque | Mitigation |
|---|---|
| Régression visuelle FR après migration | Smoke test exhaustif sur `/fr/*` avant déploiement prod ; comparaison capture d'écran avant/après si nécessaire |
| Perte de SEO sur URLs existantes | Redirections 308 (`permanent: true`) configurées dans `next.config.ts` ; vérification GSC après déploiement |
| Animations Framer Motion cassées en RTL | Hook `useDirection()` pour inverser `x` ; tests manuels documentés |
| Polices arabes non chargées | Préchargement Cairo dans `[locale]/layout.tsx` |
| Latence middleware visible | Mesure Lighthouse Performance avant/après sur `/fr/` |
| Imports `next/link` oubliés (locale non préservée) | Recherche globale `from 'next/link'` à la migration ; règle ESLint custom envisageable au sous-projet B |

## 8. Livrables

- `src/i18n/routing.ts`
- `src/i18n/navigation.ts`
- `src/i18n/messages/fr.json` (rempli)
- `src/i18n/messages/en.json` (copie verbatim de `fr.json` — clés et valeurs identiques)
- `src/i18n/messages/ar.json` (idem)
- `src/middleware.ts`
- `src/app/[locale]/layout.tsx` (ex-`src/app/layout.tsx`, locale-aware)
- `src/app/layout.tsx` (passe-plat minimal)
- `src/app/[locale]/*` (toutes les pages migrées)
- `src/app/sitemap.ts` (réécrit multi-locales)
- `src/components/layout/LanguageSwitcher.tsx`
- Modifications `next.config.ts` (redirects)
- Modifications `Header.tsx` (intégration switcher)
- Audit + migration des utilities Tailwind directionnelles dans `src/components/**`
- Audit + migration des imports `next/link` → `@/i18n/navigation`
- Tests Playwright + Vitest associés
- `package.json` : ajout `next-intl`
