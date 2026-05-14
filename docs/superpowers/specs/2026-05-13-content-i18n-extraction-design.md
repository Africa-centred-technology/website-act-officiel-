# Spec — Externalisation des chaînes UI vers dictionnaires (sous-projet C1)

**Date** : 2026-05-13
**Projet parent** : Sous-projet C — Traduction du contenu multi-langue
**Phase** : **C1 — Externalisation UI** (sur 5 phases C1→C5)
**Branche** : `feat/i18n-architecture` (poursuite empilée — A + B + C)
**Statut** : Design validé, en attente de relecture utilisateur
**Sous-projets précédents** : A (i18n architecture, terminé), B (SEO foundations, terminé)
**Sous-phases suivantes** : C2 (data statique), C3 (traduction EN + AR), C4 (Shopify multi-langue), C5 (QA finale)

---

## 1. Contexte et décomposition

Le sous-projet C couvre la traduction complète du contenu. L'audit révèle un volume massif :

- **~42 fichiers components** avec chaînes FR hardcodées (labels, CTA, descriptions, validations)
- **~887 lignes** de data statique dans `src/lib/data/*.ts` (services, projects, poles, formations defaults)
- **152 lignes** dans `src/lib/secteurs-data.ts`
- **Contenu Shopify** : 15+ formations + 16 articles blog, FR-only côté API
- **Labels JSON-LD breadcrumb** hardcodés en FR dans `src/i18n/seo-jsonld.ts`

Trop gros pour une seule spec. Décomposition en 5 phases :

| # | Phase | Nature | Dépend de |
|---|---|---|---|
| **C1** | **Externaliser les chaînes UI partagées** vers dictionnaires (FR encore) | Refactor technique | — |
| **C2** | Migrer le contenu statique (`src/lib/data/*.ts` + `secteurs-data.ts`) vers dictionnaires | Refactor technique | C1 |
| **C3** | Traduire le contenu UI + statique vers EN puis AR | Traduction | C1 + C2 |
| **C4** | Contenu Shopify multi-langue (formations + blog) via Shopify Markets / metafields | Architecture Shopify | indépendant |
| **C5** | QA finale : Lighthouse EN/AR + audit qualité + RTL polish | Tests + validation | C1-C4 |

Cette spec couvre **uniquement C1**.

## 2. Objectifs et critères d'acceptation

### Objectifs

1. Déplacer toutes les chaînes FR hardcodées des composants vers les dictionnaires `next-intl`.
2. Aucune régression visuelle sur `/fr/*` — strictement identique avant/après.
3. EN et AR restent des copies verbatim FR (traductions réelles = C3).
4. Corriger les hardcoded breadcrumb labels (`"Accueil"`/`"Formations"`/`"Blog"`) dans `seo-jsonld.ts` (follow-up B identifié par le reviewer final).
5. Préparer une structure de dictionnaires propre, prête à traduire en C3.

### Critères d'acceptation

- ✅ Aucune chaîne FR de plus de 10 caractères ne reste hardcodée dans `src/components/**/*.tsx` (sauf cas justifiés documentés : marques, valeurs immuables comme "ACT", URLs, classes CSS).
- ✅ `src/i18n/messages/fr.json` enrichi avec les namespaces : `common.{cta,nav,footer,lang,metadata}`, `validation`, `home`, `about`, `services`, `formations`, `poles`, `secteurs`, `projects`, `blog`, `contact`, `breadcrumb`.
- ✅ `en.json` et `ar.json` byte-identiques à `fr.json` (verbatim).
- ✅ `seo-jsonld.ts::breadcrumbJsonLd()` ne contient plus de label FR hardcodé — accepte un paramètre `items` avec labels déjà traduits depuis l'appelant.
- ✅ Les appelants (`formations/[slug]/page.tsx`, `blog/[slug]/page.tsx`) lisent les labels breadcrumb depuis `breadcrumb.*` via `getTranslations`.
- ✅ Tous les tests existants passent (51 unit + 6 i18n E2E + 6 SEO E2E + 5 smoke E2E + nouveaux content tests).
- ✅ Lighthouse SEO et Accessibility sur `/fr/` ≥ scores baseline post-B (pas de régression).
- ✅ Build production clean (110+ pages générées).

## 3. Décisions de cadrage

| Sujet | Décision | Justification |
|---|---|---|
| Branche | Poursuite de `feat/i18n-architecture` | Cohérent avec A + B, un seul PR final |
| Phasage | C1 isolé (refactor pur) puis C2 (data) | C1 livre une PR mergeable sans casser visuellement, indépendamment des traductions futures |
| Méthode | `useTranslations` (client) / `getTranslations` (server) selon contexte | API standard `next-intl`, pas de magie custom |
| Migration progressive | 6 batches de composants liés, commit par batch | Diff plus reviewables ; rollback possible par batch |
| Hors-scope | `src/lib/data/`, `secteurs-data.ts`, Shopify, traductions réelles | Reportés à C2/C3/C4 — cf. tableau §1 |

## 4. Architecture

### 4.1 Organisation des namespaces

```json
src/i18n/messages/fr.json (structure cible)
{
  "common": {
    "cta": {
      "learnMore": "En savoir plus",
      "viewAll": "Voir tous",
      "discover": "Découvrir",
      "contact": "Nous contacter",
      "subscribe": "S'abonner",
      "back": "Retour",
      "close": "Fermer",
      "send": "Envoyer",
      "loading": "Chargement…"
    },
    "nav": {
      "home": "Accueil",
      "about": "À propos",
      "services": "Services",
      "formations": "Formations",
      "poles": "Pôles",
      "secteurs": "Secteurs",
      "projects": "Réalisations",
      "blog": "Blog",
      "contact": "Contact"
    },
    "footer": {
      "copyright": "© {year} Africa Centred Technology. Tous droits réservés.",
      "tagline": "Engineering the Future",
      "address": "Maroc — FR",
      "followUs": "Suivez-nous"
    },
    "lang": {
      "fr": "Français",
      "en": "English",
      "ar": "العربية"
    },
    "metadata": { /* ... existant depuis B ... */ }
  },
  "validation": {
    "required": "Ce champ est requis",
    "email": "Email invalide",
    "phone": "Numéro de téléphone invalide",
    "minLength": "Minimum {min} caractères",
    "maxLength": "Maximum {max} caractères"
  },
  "home": { "hero": {...}, "about": {...}, "services": {...}, "projects": {...}, "blog": {...} },
  "about":      { /* labels page about */ },
  "services":   { /* labels page services + intro + détail */ },
  "formations": { /* labels catalogue, fiche, inscription, brochure modal, cart */ },
  "poles":      { /* labels pages pôles */ },
  "secteurs":   { /* labels pages secteurs */ },
  "projects":   { /* labels page projets + détail */ },
  "blog":       { /* labels blog + post + articles */ },
  "contact":    { /* labels contact + form */ },
  "breadcrumb": {
    "home": "Accueil",
    "formations": "Formations",
    "blog": "Blog",
    "services": "Services",
    "projects": "Réalisations",
    "secteurs": "Secteurs",
    "poles": "Pôles"
  }
}
```

**Principes** :

1. `common.*` pour les labels apparaissant sur 2+ pages (CTA, nav, footer, lang).
2. Un namespace par page principale (`home`, `about`, `services`, …) pour les labels propres à cette page.
3. `validation.*` pour les messages Zod/forms.
4. `breadcrumb.*` dédié — alimente `seo-jsonld.ts` côté serveur, élimine le hardcoded FR.

**Pluriels et variables** — ICU MessageFormat de `next-intl` :

```json
"formations": {
  "count": "{count, plural, =0 {Aucune formation} =1 {1 formation disponible} other {# formations disponibles}}"
}
```

Utilisation :
```tsx
t("count", { count: formations.length })
```

**Rich text (HTML inline)** — `t.rich()` pour les chaînes avec balises :

```tsx
t.rich("hero.subtitle", {
  strong: (chunks) => <strong>{chunks}</strong>,
  em: (chunks) => <em>{chunks}</em>,
})
```

→ jamais d'injection HTML brute via la prop React correspondante pour du contenu localisé. Ce pattern reste réservé au JSON-LD (cf. décision sous-projet B section 4.5) où le contenu est typé et contrôlé.

### 4.2 Pattern d'usage Server vs Client

**Server Components** (la majorité des `Shell.tsx`) :

```tsx
import { getTranslations } from "next-intl/server";

export default async function AboutShell() {
  const t = await getTranslations("about");
  return (
    <section>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
    </section>
  );
}
```

**Client Components** (`"use client"`) :

```tsx
"use client";
import { useTranslations } from "next-intl";

export function LanguageSwitcher() {
  const t = useTranslations("common.lang");
  return <option>{t("fr")}</option>;
}
```

**Cas mixtes** (server → client) — passage en props :

```tsx
// Server parent
const t = await getTranslations("common.cta");
return <CTAButton label={t("learnMore")} href="..." />;

// Client child
"use client";
export function CTAButton({ label, href }: { label: string; href: string }) {
  return <Link href={href}>{label}</Link>;
}
```

**Règle** : préférer `useTranslations` côté client quand le composant a 3+ labels. En dessous, passer en props depuis le parent (moins d'hydration).

### 4.3 Stratégie de migration progressive — 6 batches

**Batch 1 — Couche partagée** (utilisée partout, à faire d'abord) :
- `src/components/layout/Header.tsx`
- `src/components/layout/FooterStrip.tsx`
- `src/components/layout/AnnouncementBar.tsx`
- `src/components/layout/CTASection.tsx`
- `src/components/layout/DropdownMenu.tsx`
- `src/components/ui/CTAButton.tsx`

**Batch 2 — Home & About** :
- `src/components/home/Home.tsx` + `home/sections/*` (HeroSection, AboutSection, HorizonSection, PolesSection, ProjectsSection, BlogSection, BlogShowcaseSection)
- `src/components/about/AboutShell.tsx`, `TeamSection.tsx`

**Batch 3 — Catalogue & formations** :
- `formations/FormationsShell.tsx`, `CatalogueSection.tsx`, `FormationsCarousel.tsx`
- `formations/FormationDetailShell.tsx`, `FormationLandpage.tsx`
- `formations/FormationInscriptionShell.tsx`, `FormationInscriptionForm.tsx`
- `formations/BrochureRequestModal.tsx`, `CartDrawer.tsx`

**Batch 4 — Services, Pôles, Secteurs, Projets** :
- `services/*` (ServicesShell, ServicesIntroShell, ServicesGrid, ServiceDetailShell, PoleIngenieurieShell, PoleConseilShell, PoleFormationShell)
- `poles/*` (PolesIndexShell, PoleConseilShell, PoleDeveloppementShell)
- `secteurs/*` (SecteursShell, SecteurDetailShell)
- `realisations/*` (RealisationsShell, ProjectDetailShell)

**Batch 5 — Blog & Contact** :
- `blog/*` (BlogShell, BlogHero, BlogArticlesShell, BlogPostShell)
- `contact/ContactShell.tsx`

**Batch 6 — Breadcrumb JSON-LD (fix follow-up B)** :
- Refactor `src/i18n/seo-jsonld.ts::breadcrumbJsonLd` : il accepte déjà `items: Array<{ name, url }>` — pas de changement de signature, mais on documente que `name` doit être traduit par l'appelant.
- Update `src/app/[locale]/formations/[slug]/page.tsx` — appelle `getTranslations("breadcrumb")` et utilise `t("home")` / `t("formations")` pour les noms.
- Update `src/app/[locale]/blog/[slug]/page.tsx` — idem avec `t("blog")`.

**Entre chaque batch** :
1. `npx tsc --noEmit` clean
2. `npm run build` clean
3. Smoke check curl sur 2-3 pages affectées : `<title>` et `<h1>` toujours en FR correct
4. Visual check browser sur 1 page affectée
5. Commit autonome par batch (1+ commit)

Chaque batch est un commit mergeable indépendamment. Si on s'arrête à mi-chemin, la branche reste fonctionnelle (FR pas cassé).

## 5. Plan de tests

### 5.1 Tests existants

Tous les tests existants doivent continuer à passer :
- 51 Vitest unit (data, routing, LanguageSwitcher, seo, seo-jsonld, sitemap)
- 6 Playwright i18n
- 6 Playwright seo (2 peuvent skip si pas de Shopify creds)
- 5 Playwright smoke (déjà fixés post-B pour le `<select>` LanguageSwitcher)

### 5.2 Nouveau test E2E — content snapshot

Fichier nouveau `tests/e2e/content-fr-snapshot.spec.ts` :

```ts
import { test, expect } from "@playwright/test";

test.describe("Content FR — no regression after externalization", () => {
  const PAGES = [
    "/fr/",
    "/fr/about",
    "/fr/services",
    "/fr/formations",
    "/fr/poles",
    "/fr/secteurs",
    "/fr/projects",
    "/fr/blog",
    "/fr/contact",
  ];

  for (const path of PAGES) {
    test(`${path} renders FR critical strings`, async ({ page }) => {
      await page.goto(path);
      const html = await page.content();
      expect(html).toContain("Africa Centred Technology");
      // Page-specific assertions added per batch (see plan)
    });
  }
});
```

> Ce test n'est pas un diff pixel-perfect (trop fragile avec animations Framer + R3F). Il vérifie juste que les **strings critiques** sont toujours rendues. Plus de granularité par batch dans le plan d'implémentation.

### 5.3 Vérifications par batch

- **Batch 1 (couche partagée)** : `curl /fr/` rend "À propos", "Services", "Formations" (nav), "© 2026 Africa Centred Technology" (footer)
- **Batch 2 (Home + About)** : `curl /fr/` rend les titres du parcours 7 salles
- **Batch 3 (Formations)** : `curl /fr/formations` rend le titre catalogue + labels d'une fiche formation
- **Batch 4 (Services/Pôles/etc.)** : `curl /fr/services` rend le titre + intros
- **Batch 5 (Blog/Contact)** : `curl /fr/contact` rend les labels du formulaire
- **Batch 6 (Breadcrumb)** : `curl /fr/formations/<slug>` contient `"@type":"BreadcrumbList"` avec `"name":"Accueil"` (vérifie que la lecture depuis dictionnaire fonctionne)

### 5.4 Validation Lighthouse

Lighthouse sur `/fr/` après C1 — comparer aux scores post-B :
- SEO ≥ score post-B (devrait rester ≥95)
- Accessibility ≥ score post-B (≥90)
- Performance et Best Practices : peu impactés (refactor pur, pas de changement de bundle significatif)

Si SEO/A11y baisse de plus de 3 points → investiguer (probablement un `alt` ou `aria-label` oublié dans la migration).

## 6. Risques et points d'attention

| Risque | Mitigation |
|---|---|
| Régression visuelle FR sur une page après un batch | Smoke check curl + visual check browser entre chaque batch ; commit autonome par batch permet rollback ciblé |
| Volume de strings → erreurs de copie | Migration batch par batch + utilisation systématique des outils Edit/Read plutôt que retypage ; revue par batch via subagent reviewer |
| Cas particulier `t.rich` ou pluriels mal détectés | Le plan d'implémentation listera explicitement les chaînes qui requièrent `t.rich` ou `plural` pour chaque batch |
| Composants client lourds qui appellent `useTranslations` → bundle size | Préférer passage en props depuis le server parent quand <3 labels ; quand >3, accepter le coût hydration (mineur — `next-intl` est tree-shakeable) |
| Hardcoded keys oubliés dans seo-jsonld | Batch 6 dédié, dernier ; test E2E vérifie `"@type":"BreadcrumbList"` avec labels |
| TS errors transitoires entre batches | Tous les batches font `npx tsc --noEmit` avant commit ; aucun batch n'est mergé avec erreur TS |

## 7. Livrables

**Fichiers créés** :
- `tests/e2e/content-fr-snapshot.spec.ts` — sanity tests par page

**Fichiers modifiés** :
- `src/i18n/messages/fr.json` — enrichi avec tous les nouveaux namespaces
- `src/i18n/messages/en.json` — copie verbatim
- `src/i18n/messages/ar.json` — copie verbatim
- **~42 fichiers** dans `src/components/**/*.tsx` — chaînes hardcodées remplacées par appels `t(...)` / `useTranslations()` / `getTranslations()`
- `src/app/[locale]/formations/[slug]/page.tsx` — lecture breadcrumb depuis dictionnaire
- `src/app/[locale]/blog/[slug]/page.tsx` — lecture breadcrumb depuis dictionnaire

**Fichiers inchangés malgré leur usage** :
- `src/i18n/seo-jsonld.ts` : `breadcrumbJsonLd` accepte déjà des labels en paramètre, pas de modification de signature. La doc inline est juste précisée pour rappeler que `name` doit être traduit par l'appelant.

## 8. Hors-scope

**Reporté à C2 (Migration data statique)** :
- `src/lib/data/services.ts`, `projects.ts`, `poles.ts`, `formation-defaults.ts`
- `src/lib/secteurs-data.ts`

**Reporté à C3 (Traduction réelle)** :
- Remplacer les valeurs verbatim FR dans `en.json` et `ar.json` par de vraies traductions EN puis AR
- Méthode (humain / IA / mix), workflow validation native AR

**Reporté à C4 (Shopify multi-langue)** :
- Activation de Shopify Markets ou metafields multi-langues
- Récupération des formations + articles blog en EN / AR depuis Shopify

**Reporté à C5 (QA finale)** :
- Audit Lighthouse en EN et AR (pas seulement FR comme C1)
- Polish RTL fin des animations Framer
- Audit qualité traductions par locuteurs natifs

**Reporté au sous-projet D (post-C)** :
- Performance Lighthouse 35 → ≥90 (Core Web Vitals)
- Best Practices 54 → ≥90
- Symétrie typographique navbar (titres nav vs nom site)
- Remplacer `<select>` LanguageSwitcher par bouton globe (cycle au clic, pas de dropdown) + réfléchir au placement
