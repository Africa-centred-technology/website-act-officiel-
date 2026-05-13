# C1 — UI String Externalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer toutes les chaînes UI FR hardcodées de ~42 composants vers les dictionnaires `next-intl` (`fr.json`/`en.json`/`ar.json`), avec EN/AR copies verbatim FR. Aucune régression visuelle sur `/fr/*`.

**Architecture:** Refactor mécanique en 6 batches progressifs (couche partagée → home/about → catalogue/formations → services/pôles/secteurs/projets → blog/contact → breadcrumb JSON-LD). Chaque batch est un commit autonome avec quality gates (tsc, build, smoke curl). Les chaînes vont dans des namespaces hiérarchiques (`common.cta`, `common.nav`, `common.footer`, `validation`, `home`, `about`, `services`, `formations`, `poles`, `secteurs`, `projects`, `blog`, `contact`, `breadcrumb`).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.9, `next-intl` v4, Playwright, Vitest.

**Spec source:** `docs/superpowers/specs/2026-05-13-content-i18n-extraction-design.md`

---

## File Structure

### Created files
- `tests/e2e/content-fr-snapshot.spec.ts` — sanity test FR par page (Task 9)

### Modified files
- `src/i18n/messages/fr.json` — enrichi avec namespaces de l'ensemble C1 (Task 1)
- `src/i18n/messages/en.json` — copie verbatim de fr.json
- `src/i18n/messages/ar.json` — copie verbatim de fr.json
- **~42 fichiers components** dans `src/components/**/*.tsx` — migrer chaînes hardcodées vers appels `t(...)` (Tasks 2-7)
- `src/app/[locale]/formations/[slug]/page.tsx` — lecture breadcrumb depuis dictionnaire (Task 7)
- `src/app/[locale]/blog/[slug]/page.tsx` — lecture breadcrumb depuis dictionnaire (Task 7)

### Pattern de migration (référence pour toutes les tasks)

**Pour un Server Component** (la majorité des `Shell.tsx`) :

```tsx
// Avant
export default function AboutShell() {
  return <h1>Notre histoire</h1>;
}

// Après
import { getTranslations } from "next-intl/server";

export default async function AboutShell() {
  const t = await getTranslations("about");
  return <h1>{t("hero.title")}</h1>;
}
```

**Pour un Client Component** (`"use client"`) :

```tsx
// Avant
"use client";
export function MyComp() {
  return <button>Envoyer</button>;
}

// Après
"use client";
import { useTranslations } from "next-intl";

export function MyComp() {
  const t = useTranslations("common.cta");
  return <button>{t("send")}</button>;
}
```

**Pour rich text inline** (chaîne avec balises HTML) :

```tsx
// fr.json
"about": { "intro": "Pour <strong>aller plus loin</strong>, contactez-nous." }

// Component
t.rich("intro", {
  strong: (chunks) => <strong>{chunks}</strong>,
})
```

**Pour pluriels / variables** :

```tsx
// fr.json
"formations": { "count": "{count, plural, =0 {Aucune formation} =1 {1 formation} other {# formations}}" }

// Component
t("count", { count: items.length })
```

**Server → Client (passage en props)** quand le child est client avec <3 labels :

```tsx
// Server parent
const t = await getTranslations("common.cta");
return <ClientChild label={t("learnMore")} />;

// Client child
"use client";
export function ClientChild({ label }: { label: string }) {
  return <button>{label}</button>;
}
```

---

## Task 1: Bootstrap le dictionnaire avec tous les namespaces (FR)

But : créer la structure complète des dictionnaires avant les batches. Chaque batch ajoutera ensuite des sous-clés à l'intérieur — pas de nouveau namespace racine.

**Files:**
- Modify: `src/i18n/messages/fr.json`
- Modify: `src/i18n/messages/en.json` (verbatim copy)
- Modify: `src/i18n/messages/ar.json` (verbatim copy)

- [ ] **Step 1: Lire l'état actuel de fr.json**

Read `src/i18n/messages/fr.json`. Confirmer la présence des namespaces actuels (depuis B) : `common.lang`, `common.metadata` (10 sous-clés pour les pages), `metadata` (probablement résiduel — vérifier).

- [ ] **Step 2: Étendre fr.json avec toute la structure cible**

Réécrire `src/i18n/messages/fr.json` avec EXACTEMENT cette structure (préserver les `metadata` ajoutés en B sous le bon namespace, et `common.lang` déjà existant) :

```json
{
  "common": {
    "lang": {
      "fr": "Français",
      "en": "English",
      "ar": "العربية"
    },
    "cta": {
      "learnMore": "En savoir plus",
      "viewAll": "Voir tous",
      "discover": "Découvrir",
      "contact": "Nous contacter",
      "subscribe": "S'abonner",
      "back": "Retour",
      "close": "Fermer",
      "send": "Envoyer",
      "loading": "Chargement…",
      "readMore": "Lire la suite",
      "register": "S'inscrire",
      "download": "Télécharger",
      "downloadBrochure": "Télécharger la brochure"
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
      "contact": "Contact",
      "openMenu": "Ouvrir le menu",
      "closeMenu": "Fermer le menu"
    },
    "footer": {
      "copyright": "© {year} Africa Centred Technology. Tous droits réservés.",
      "tagline": "Engineering the Future",
      "address": "Maroc — FR",
      "followUs": "Suivez-nous"
    },
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
  },
  "validation": {
    "required": "Ce champ est requis",
    "email": "Email invalide",
    "phone": "Numéro de téléphone invalide",
    "minLength": "Minimum {min} caractères",
    "maxLength": "Maximum {max} caractères"
  },
  "home": {},
  "about": {},
  "services": {},
  "formations": {},
  "poles": {},
  "secteurs": {},
  "projects": {},
  "blog": {},
  "contact": {},
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

> Les namespaces `home`, `about`, `services`, `formations`, `poles`, `secteurs`, `projects`, `blog`, `contact` démarrent vides `{}` — chaque batch (2-6) ajoutera ses sous-clés dans le namespace approprié.

> **Important** : les sous-clés `metadata.*` étaient au niveau racine après B. Cette task les déplace sous `common.metadata.*`. Tu devras donc aussi mettre à jour les appels à `buildPageMetadata({ namespace: "metadata.<page>", ... })` dans toutes les pages migrées en B-Task 5 pour qu'elles utilisent `namespace: "common.metadata.<page>"`. C'est ~11 fichiers `src/app/[locale]/**/page.tsx` à éditer (chaque appel `buildPageMetadata` avec `namespace: "metadata.<X>"` devient `namespace: "common.metadata.<X>"`).
>
> Si tu préfères, alternative plus simple : **garder le namespace `metadata.<page>` au niveau racine** (non imbriqué dans `common`) pour éviter de toucher les pages. Dans ce cas, omets `metadata` de `common` ci-dessus et ajoute-le au niveau racine. Décide en lisant le contenu actuel de `fr.json` au Step 1 : si `metadata` est déjà racine, le laisser racine et adapter la structure cible.

- [ ] **Step 3: Décider — racine ou imbriqué pour metadata**

Si l'état actuel de `fr.json` (depuis B) a `metadata.<page>` au niveau racine, **garder racine** (modifier la structure cible pour mettre `metadata` au niveau racine au lieu de sous `common`). Sinon adapter les appelants.

Pour cette task : **garder racine** (moins de fichiers à toucher, plus simple). Donc la structure cible devient :

```json
{
  "common": {
    "lang": {...},
    "cta": {...},
    "nav": {...},
    "footer": {...}
  },
  "metadata": { /* tel qu'existant après B */ },
  "validation": {...},
  "home": {}, "about": {}, "services": {}, "formations": {},
  "poles": {}, "secteurs": {}, "projects": {}, "blog": {}, "contact": {},
  "breadcrumb": {...}
}
```

Appliquer cette structure dans `fr.json`.

- [ ] **Step 4: Copy fr.json verbatim to en.json and ar.json**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 5: Verify SHA256 hashes match**

PowerShell:
```powershell
Get-FileHash "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json","D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json","D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```
Expected: all 3 hashes identical.

- [ ] **Step 6: TS check + build sanity**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```
Expected: no new errors (the type augmentation in `src/global.d.ts` uses fr.json — adding keys is non-breaking).

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run build
```
Expected: clean build, 110+ pages.

- [ ] **Step 7: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/fr.json src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "feat(c1): bootstrap i18n dictionaries with full namespace structure"
```

---

## Task 2: Batch 1 — Migrate shared layout components

**Files (6 fichiers à migrer) :**
- `src/components/layout/Header.tsx`
- `src/components/layout/FooterStrip.tsx`
- `src/components/layout/AnnouncementBar.tsx`
- `src/components/layout/CTASection.tsx`
- `src/components/layout/DropdownMenu.tsx`
- `src/components/ui/CTAButton.tsx`

**Namespace destination :** `common.*` (cta, nav, footer)

> Note CTAButton : ce composant prend `children` — il n'a typiquement pas de texte hardcodé. Vérifier rapidement. Si pas de chaîne, sauter ce fichier et noter dans le commit.

- [ ] **Step 1: Read each file to identify hardcoded strings**

Pour chaque fichier ci-dessus, Read et noter les chaînes FR à externaliser :
- Header : labels nav (Accueil, À propos, Services, …), aria-label menu, peut-être un slogan, "Africa Centred Technology"
- FooterStrip : copyright avec `{year}`, tagline, adresse, suivez-nous
- AnnouncementBar : message d'annonce s'il existe
- CTASection : titre de la section, sous-titre, CTAs
- DropdownMenu : labels du menu (souvent overlap avec nav)
- CTAButton : probablement rien (prend `children`)

Liste interne : quelles chaînes vont dans quel namespace (`common.nav`, `common.cta`, `common.footer`). Ne pas externaliser : marques ("ACT", "Africa Centred Technology"), URLs, classes CSS, valeurs numériques.

- [ ] **Step 2: Add the relevant strings to fr.json**

Ajouter dans `src/i18n/messages/fr.json` toutes les nouvelles clés identifiées sous `common.cta.*`, `common.nav.*`, `common.footer.*`. Les clés majeures (`learnMore`, `viewAll`, `nav.home`, `footer.copyright`, etc.) ont déjà été ajoutées en Task 1 — il s'agit ici de **compléter** avec les clés spécifiques au batch (si tu trouves une chaîne pas couverte).

Exemple d'ajout typique :
```json
"common": {
  "nav": {
    /* existing */
    "menuOpen": "Ouvrir le menu",
    "menuClose": "Fermer le menu",
    "skipToContent": "Aller au contenu"
  }
}
```

- [ ] **Step 3: Re-copy fr.json verbatim to en.json and ar.json**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 4: Migrate each file**

Pour chaque fichier du batch, appliquer le pattern Server ou Client (cf. plan header). Exemples concrets :

**Header.tsx** (Client Component — `"use client"` confirmé) :
```tsx
"use client";
import { useTranslations } from "next-intl";

// dans le composant :
const t = useTranslations("common");

// Remplacer chaque chaîne :
<Link href="/about">À propos</Link>
// devient
<Link href="/about">{t("nav.about")}</Link>
```

**FooterStrip.tsx** : si Server Component, utilise `getTranslations("common")`. Pour le copyright avec année :
```tsx
const year = new Date().getFullYear();
<p>{t("footer.copyright", { year })}</p>
```

**CTAButton.tsx** : probablement aucune chaîne (juste `children`). Si vraiment aucune chaîne FR, ne pas modifier — ajouter une note dans le commit message.

- [ ] **Step 5: TS check**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 6: Build check**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run build
```
Expected: clean.

- [ ] **Step 7: Smoke check curl**

Start dev :
```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run dev
```

Then :
```bash
echo "=== Nav labels rendered ==="
curl.exe -s http://localhost:3000/fr/ | grep -oE '>(À propos|Services|Formations|Contact)<' | sort -u

echo ""
echo "=== Footer copyright ==="
curl.exe -s http://localhost:3000/fr/ | grep -oE '© [0-9]{4} Africa Centred Technology'
```
Expected: labels nav présents + copyright avec l'année courante.

Stop dev server.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/components/layout/ src/components/ui/CTAButton.tsx src/i18n/messages/ && git commit -m "refactor(c1): batch 1 — migrate shared layout components to i18n dictionaries"
```

---

## Task 3: Batch 2 — Migrate Home & About sections

**Files :**
- `src/components/home/Home.tsx`
- `src/components/home/sections/HeroSection.tsx`
- `src/components/home/sections/AboutSection.tsx`
- `src/components/home/sections/HorizonSection.tsx`
- `src/components/home/sections/PolesSection.tsx`
- `src/components/home/sections/ProjectsSection.tsx`
- `src/components/home/sections/BlogSection.tsx`
- `src/components/home/sections/BlogShowcaseSection.tsx`
- `src/components/about/AboutShell.tsx`
- `src/components/about/TeamSection.tsx`

**Namespace destination :** `home.*` (avec sous-namespaces `hero`, `about`, `horizon`, `poles`, `projects`, `blog`) et `about.*`

- [ ] **Step 1: Read each file, identify FR strings**

Pour chaque fichier, faire un Read complet et lister les chaînes à externaliser. Le parcours 7 salles dans `Home.tsx` est probablement le plus dense (titres, sous-titres, transitions). `AboutShell.tsx` (728 lignes) contient l'histoire ACT, la mission, les valeurs.

Mapping namespace :
- `home/Home.tsx` + `sections/HeroSection.tsx` → `home.hero.*`
- `sections/AboutSection.tsx` → `home.about.*`
- `sections/HorizonSection.tsx` → `home.horizon.*`
- `sections/PolesSection.tsx` → `home.poles.*`
- `sections/ProjectsSection.tsx` → `home.projects.*`
- `sections/BlogSection.tsx` + `BlogShowcaseSection.tsx` → `home.blog.*`
- `about/AboutShell.tsx` → `about.*` (hero, mission, values, team)
- `about/TeamSection.tsx` → `about.team.*`

- [ ] **Step 2: Add keys to fr.json**

Étendre `home` et `about` dans `fr.json` avec toutes les sous-clés identifiées. Exemple structure :

```json
"home": {
  "hero": { "title": "...", "subtitle": "..." },
  "about": { "title": "...", "intro": "..." },
  "horizon": { ... },
  "poles": { "title": "...", "subtitle": "..." },
  "projects": { ... },
  "blog": { "title": "...", "viewAll": "..." }
},
"about": {
  "hero": { "title": "...", "subtitle": "..." },
  "mission": { "title": "...", "body": "..." },
  "values": { "title": "...", "items": ["...", "..."] },
  "team": { "title": "...", "members": { "founder": "Fondateur", ... } }
}
```

- [ ] **Step 3: Re-copy fr.json to en/ar verbatim**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 4: Migrate each component**

Pour chaque Server Component (`AboutShell.tsx` probablement), pattern `getTranslations`. Pour chaque Client Component (sections du parcours qui ont souvent `useState` pour les animations), `useTranslations`.

**Attention rich text** : si tu rencontres `<strong>X</strong>` ou autres balises inline, utilise `t.rich()` plutôt que de couper la chaîne en plusieurs clés.

**Attention listes** : si une section affiche une liste de valeurs (`["Innovation", "Ambition", "Excellence"]`), tu peux stocker comme array dans JSON :
```json
"values": { "items": ["Innovation", "Ambition", "Excellence"] }
```
puis lire avec `t.raw("values.items")` (renvoie le tableau directement) — note : `useTranslations` ne supporte pas directement les arrays, utiliser `useMessages` ou `t.raw`.

Préférable pour ce batch : éviter `t.raw`, dupliquer en sous-clés `values.item1`, `values.item2` (clé par item). Plus simple à traduire en C3.

- [ ] **Step 5: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && npm run build
```
Expected: clean.

- [ ] **Step 6: Smoke check curl**

`npm run dev`, then:
```bash
echo "=== Home hero title ==="
curl.exe -s http://localhost:3000/fr/ | grep -oE "<h1[^>]*>[^<]*</h1>" | head -3

echo ""
echo "=== About page hero ==="
curl.exe -s http://localhost:3000/fr/about | grep -oE "<h1[^>]*>[^<]*</h1>" | head -1
```
Expected: titres FR rendus correctement.

Stop dev.

- [ ] **Step 7: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/components/home/ src/components/about/ src/i18n/messages/ && git commit -m "refactor(c1): batch 2 — migrate home + about sections to i18n dictionaries"
```

---

## Task 4: Batch 3 — Migrate Catalogue & Formations

**Files :**
- `src/components/formations/FormationsShell.tsx`
- `src/components/formations/CatalogueSection.tsx`
- `src/components/formations/FormationsCarousel.tsx`
- `src/components/formations/FormationDetailShell.tsx`
- `src/components/formations/FormationLandpage.tsx`
- `src/components/formations/FormationInscriptionShell.tsx`
- `src/components/formations/FormationInscriptionForm.tsx`
- `src/components/formations/BrochureRequestModal.tsx`
- `src/components/formations/CartDrawer.tsx`

**Namespace destination :** `formations.*`

- [ ] **Step 1: Read + identify**

Mapping namespace recommandé :
- `FormationsShell.tsx` + `CatalogueSection.tsx` + `FormationsCarousel.tsx` → `formations.catalogue.*` (titre, filtres, sort, etc.)
- `FormationDetailShell.tsx` + `FormationLandpage.tsx` → `formations.detail.*` (sections de la fiche formation : objectifs, programme, audience, prérequis, prix, etc.)
- `FormationInscriptionShell.tsx` + `FormationInscriptionForm.tsx` → `formations.inscription.*` (labels du formulaire : type d'inscription, niveau, coordonnées, validation, confirmation, etc.) + `validation.*` pour les messages d'erreur Zod
- `BrochureRequestModal.tsx` → `formations.brochure.*`
- `CartDrawer.tsx` → `formations.cart.*`

**Attention** : `FormationInscriptionForm.tsx` utilise probablement `zod` + `react-hook-form` avec messages d'erreur en FR. Migrer ces messages dans `validation.*`. Pattern recommandé pour Zod avec next-intl :

```tsx
import { useTranslations } from "next-intl";
const tv = useTranslations("validation");

const schema = z.object({
  email: z.string().email(tv("email")),
  name: z.string().min(1, tv("required")),
});
```

- [ ] **Step 2: Add keys to fr.json**

Étendre `formations.*` et `validation.*`. Volume estimé : ~50-80 clés (la formation a beaucoup de copy marketing).

- [ ] **Step 3: Re-copy fr.json to en/ar verbatim**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 4: Migrate each file**

Beaucoup de Client Components (forms interactifs). Utiliser `useTranslations("formations.X")` selon le sous-namespace.

**Attention CartDrawer & BrochureRequestModal** : ce sont probablement des modals/drawers avec animations Framer. La logique d'état (`useState`, `useEffect`) reste inchangée ; uniquement les chaînes affichées sont migrées.

- [ ] **Step 5: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && npm run build
```
Expected: clean.

- [ ] **Step 6: Smoke check curl + Vitest forms**

`npm run dev`, then:
```bash
curl.exe -s "http://localhost:3000/fr/formations" | grep -oE "<h1[^>]*>[^<]*</h1>" | head -1
curl.exe -s "http://localhost:3000/fr/formations" | grep -oE "filtres|Filtrer|Trier" | head -3
```

Stop dev.

- [ ] **Step 7: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/components/formations/ src/i18n/messages/ && git commit -m "refactor(c1): batch 3 — migrate catalogue and formation components to i18n dictionaries"
```

---

## Task 5: Batch 4 — Migrate Services, Pôles, Secteurs, Projets

**Files (regroupés par domaine) :**

Services :
- `src/components/services/ServicesShell.tsx`
- `src/components/services/ServicesIntroShell.tsx`
- `src/components/services/ServicesGrid.tsx`
- `src/components/services/ServiceDetailShell.tsx`
- `src/components/services/PoleIngenieurieShell.tsx`
- `src/components/services/PoleConseilShell.tsx`
- `src/components/services/PoleFormationShell.tsx`

Pôles :
- `src/components/poles/PolesIndexShell.tsx`
- `src/components/poles/PoleConseilShell.tsx`
- `src/components/poles/PoleDeveloppementShell.tsx`

Secteurs :
- `src/components/secteurs/SecteursShell.tsx`
- `src/components/secteurs/SecteurDetailShell.tsx`

Projets/Réalisations :
- `src/components/realisations/RealisationsShell.tsx`
- `src/components/realisations/ProjectDetailShell.tsx`

**Namespace destination :**
- `services.*` (index + intro + grid + detail + sub-pôles)
- `poles.*` (index + détails)
- `secteurs.*` (index + détail)
- `projects.*` (index + détail)

> **Note importante** : les composants `PoleXShell.tsx` peuvent exister à deux endroits (`components/services/` et `components/poles/`). Vérifier qu'ils sont distincts. Si le même composant est référencé par les deux dossiers, c'est une dette technique à signaler mais pas à fixer dans C1.

- [ ] **Step 1: Read + identify, group by sub-domain**

Sub-namespaces recommandés :
- `services.index.*` (page liste services), `services.intro.*`, `services.detail.*`
- `services.poles.{ingenierie,conseil,formation}.*` (les 3 shells de pôles dans services/)
- `poles.index.*`, `poles.conseil.*`, `poles.developpement.*`
- `secteurs.index.*`, `secteurs.detail.*`
- `projects.index.*`, `projects.detail.*`

- [ ] **Step 2: Add keys to fr.json**

Volume estimé : ~80-120 clés (4 sous-domaines × ~20-30 clés chacun).

- [ ] **Step 3: Re-copy fr.json to en/ar verbatim**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 4: Migrate each file**

Préférer `getTranslations` pour les Shell servers ; `useTranslations` pour les composants interactifs (cartes hover, sliders).

- [ ] **Step 5: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && npm run build
```

- [ ] **Step 6: Smoke check curl**

`npm run dev`, then:
```bash
for path in services poles secteurs projects; do
  echo "=== /fr/$path ==="
  curl.exe -s "http://localhost:3000/fr/$path" | grep -oE "<h1[^>]*>[^<]*</h1>" | head -1
done
```

Stop dev.

- [ ] **Step 7: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/components/services/ src/components/poles/ src/components/secteurs/ src/components/realisations/ src/i18n/messages/ && git commit -m "refactor(c1): batch 4 — migrate services/poles/secteurs/projects to i18n dictionaries"
```

---

## Task 6: Batch 5 — Migrate Blog & Contact

**Files :**
- `src/components/blog/BlogShell.tsx`
- `src/components/blog/BlogHero.tsx`
- `src/components/blog/BlogArticlesShell.tsx`
- `src/components/blog/BlogPostShell.tsx`
- `src/components/contact/ContactShell.tsx`

**Namespace destination :** `blog.*`, `contact.*`

- [ ] **Step 1: Read + identify**

Sub-namespaces :
- `blog.hero.*` (BlogHero.tsx — titre, sous-titre, search bar)
- `blog.index.*` (BlogShell — labels filtres catégories, sort, empty state)
- `blog.articles.*` (BlogArticlesShell — labels liste, tags, dates)
- `blog.post.*` (BlogPostShell — labels d'un article : "Lecture X min", "Partager", "Articles similaires", etc.)
- `contact.*` (ContactShell — titre, formulaire, validation, success message)

- [ ] **Step 2: Add keys to fr.json**

Étendre `blog.*` et `contact.*`.

**Attention** : ContactShell utilise probablement `react-hook-form` + zod (comme FormationInscriptionForm). Réutiliser les clés `validation.*` ajoutées en Task 4 (ne pas dupliquer).

- [ ] **Step 3: Re-copy fr.json to en/ar verbatim**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 4: Migrate each file**

Pour chaque fichier du batch, appliquer le pattern Server ou Client selon le contexte du composant. Reprendre les exemples de la section "Pattern de migration" en haut de ce plan. Pour ContactShell qui utilise un formulaire avec validation, réutiliser les clés `validation.*` déjà ajoutées en Task 4 (ne pas dupliquer).

- [ ] **Step 5: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && npm run build
```

- [ ] **Step 6: Smoke check curl**

`npm run dev`, then:
```bash
echo "=== /fr/blog ==="
curl.exe -s http://localhost:3000/fr/blog | grep -oE "<h1[^>]*>[^<]*</h1>" | head -1

echo "=== /fr/contact form labels ==="
curl.exe -s http://localhost:3000/fr/contact | grep -oE 'placeholder="[^"]+"' | head -5
```

Stop dev.

- [ ] **Step 7: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/components/blog/ src/components/contact/ src/i18n/messages/ && git commit -m "refactor(c1): batch 5 — migrate blog and contact components to i18n dictionaries"
```

---

## Task 7: Batch 6 — Fix breadcrumb JSON-LD hardcoded labels

**Files :**
- Modify: `src/app/[locale]/formations/[slug]/page.tsx`
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

> Note : `src/i18n/seo-jsonld.ts::breadcrumbJsonLd` accepte déjà un paramètre `items: Array<{ name, url }>` (depuis B). Pas de changement de signature requis. Il s'agit juste de remplacer les valeurs hardcodées au call site par `t(...)`.

- [ ] **Step 1: Read formations/[slug]/page.tsx**

Identifier les labels breadcrumb hardcodés (issus de B-Task 10) :
```tsx
const crumbData = breadcrumbJsonLd([
  { name: "Accueil", url: ... },
  { name: "Formations", url: ... },
  { name: formation?.title ?? slug, url: ... },
]);
```

- [ ] **Step 2: Modify formations/[slug]/page.tsx**

Ajouter import + lecture du namespace breadcrumb :

```tsx
import { getTranslations } from "next-intl/server";

// Dans la fonction default export, après `const { locale, slug } = await params`:
const tBreadcrumb = await getTranslations("breadcrumb");

// Remplacer le crumbData :
const crumbData = breadcrumbJsonLd([
  { name: tBreadcrumb("home"), url: `https://www.a-ct.ma/${locale}` },
  { name: tBreadcrumb("formations"), url: `https://www.a-ct.ma/${locale}/formations` },
  { name: formation?.title ?? slug, url: `https://www.a-ct.ma/${locale}/formations/${slug}` },
]);
```

- [ ] **Step 3: Modify blog/[slug]/page.tsx**

Même pattern :

```tsx
import { getTranslations } from "next-intl/server";

// Dans le default export :
const tBreadcrumb = await getTranslations("breadcrumb");

const crumbData = breadcrumbJsonLd([
  { name: tBreadcrumb("home"), url: `https://www.a-ct.ma/${locale}` },
  { name: tBreadcrumb("blog"), url: `https://www.a-ct.ma/${locale}/blog` },
  { name: post.title, url: `https://www.a-ct.ma/${locale}/blog/${slug}` },
]);
```

- [ ] **Step 4: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && npm run build
```
Expected: clean.

- [ ] **Step 5: Smoke check curl**

`npm run dev`, then:
```bash
# Vérifier que le breadcrumb JSON-LD contient toujours "Accueil" / "Formations" (lu depuis le dictionnaire FR maintenant)
curl.exe -s "http://localhost:3000/fr/formations/01_ia_productivite_quotidienne" | grep -oE '"name":"(Accueil|Formations|Blog)"' | sort -u
```
Expected: contains `"name":"Accueil"` AND `"name":"Formations"` (or `"name":"Blog"` selon le path).

Stop dev.

- [ ] **Step 6: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add "src/app/[locale]/formations/[slug]/page.tsx" "src/app/[locale]/blog/[slug]/page.tsx" && git commit -m "refactor(c1): batch 6 — read breadcrumb labels from i18n dictionary"
```

---

## Task 8: Add content snapshot E2E test

**Files :**
- Create: `tests/e2e/content-fr-snapshot.spec.ts`

- [ ] **Step 1: Create the test file**

Create `tests/e2e/content-fr-snapshot.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Content FR — no regression after externalization", () => {
  const PAGES = [
    { path: "/fr/", contains: ["Africa Centred Technology"] },
    { path: "/fr/about", contains: ["Africa Centred Technology", "À propos"] },
    { path: "/fr/services", contains: ["Services"] },
    { path: "/fr/formations", contains: ["Formations"] },
    { path: "/fr/poles", contains: ["Pôles"] },
    { path: "/fr/secteurs", contains: ["Secteurs"] },
    { path: "/fr/projects", contains: ["Réalisations"] },
    { path: "/fr/blog", contains: ["Blog"] },
    { path: "/fr/contact", contains: ["Contact"] },
  ];

  for (const { path, contains } of PAGES) {
    test(`${path} renders FR critical strings`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      const html = await page.content();
      for (const expectedString of contains) {
        expect(html).toContain(expectedString);
      }
    });
  }

  test("Breadcrumb JSON-LD on /fr/formations/[slug] contains Accueil + Formations", async ({ page, request }) => {
    const apiRes = await request.get("/api/shopify/formations");
    const list = await apiRes.json().catch(() => []);
    const firstSlug = Array.isArray(list) ? list?.[0]?.slug : undefined;
    test.skip(!firstSlug, "No formation available");

    await page.goto(`/fr/formations/${firstSlug}`);
    const html = await page.content();
    expect(html).toContain('"name":"Accueil"');
    expect(html).toContain('"name":"Formations"');
  });
});
```

- [ ] **Step 2: Run the suite**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e -- tests/e2e/content-fr-snapshot.spec.ts
```
Expected: all 9 page tests pass + 1 breadcrumb test pass (or skip if no Shopify).

- [ ] **Step 3: Regression check — run all E2E**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e
```
Expected: i18n.spec.ts 6/6 + seo.spec.ts (6 + 2 skip OK) + smoke.spec.ts 5/5 + content-fr-snapshot.spec.ts pass.

- [ ] **Step 4: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add tests/e2e/content-fr-snapshot.spec.ts && git commit -m "test(c1): add FR content snapshot E2E to detect i18n regressions"
```

---

## Task 9: Final validation (no commit)

- [ ] **Step 1: Production build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run build
```
Expected: clean build, ≥110 pages.

- [ ] **Step 2: All unit tests**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm test
```
Expected: 51+ tests pass (existing + any new added during batches).

- [ ] **Step 3: All E2E tests**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e
```
Expected: i18n + seo + smoke + content-fr-snapshot all pass.

- [ ] **Step 4: Visual smoke check — manual browser**

Start `npm run start` (prod), then open `http://localhost:3000/fr/` in browser. Navigate through the main pages :
- Home `/fr/` — parcours 7 salles fonctionnel
- `/fr/about` — page about complète
- `/fr/formations` — catalogue Shopify charge
- `/fr/services` — services rendus
- `/fr/contact` — formulaire opérationnel

Verify visually that nothing is broken, no missing labels, no `<MISSING_MESSAGE>` placeholders.

Stop server.

- [ ] **Step 5: Audit hardcoded strings remaining**

Run a final scan to confirm no FR string >10 chars remains hardcoded :

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && grep -rln '"[A-ZÀ-ÿ][^"]\{10,\}"' src/components/ 2>&1 | head -20
```

If files appear, manually inspect to determine if remaining strings are:
- ✓ Brand/immutable values ("Africa Centred Technology", URLs)
- ✓ Technical strings (CSS classes, aria-roles)
- ✓ Type definitions / interface labels
- ❌ Missed UI strings — flag for follow-up

Document any remaining hardcoded UI strings as a TODO note (not a blocker for C1 completion unless extensive).

- [ ] **Step 6: Lighthouse comparison**

Open Chrome DevTools → Lighthouse → analyze `http://localhost:3000/fr/`. Compare to post-B baseline:
- SEO ≥ post-B score
- Accessibility ≥ post-B score
- Performance & Best Practices: should be neutral (refactor pur)

If SEO or A11y drops more than 3 points, investigate (likely missing `alt` or `aria-label` in a migration).

---

## Acceptance Criteria

- ✅ Tous les batches 1-6 committés sur `feat/i18n-architecture` (Tasks 2-7)
- ✅ Aucune chaîne FR > 10 chars hardcodée dans `src/components/**/*.tsx` (sauf cas justifiés documentés) (Task 9 step 5)
- ✅ Dictionnaires `fr.json` / `en.json` / `ar.json` byte-identiques en fin de C1 (chaque batch re-copie) (Tasks 1-7)
- ✅ Breadcrumb JSON-LD lit depuis `breadcrumb.*` du dictionnaire (Task 7)
- ✅ Tests existants passent + nouveau snapshot E2E pass (Tasks 8-9)
- ✅ Build clean, ≥110 pages (Task 9 step 1)
- ✅ Lighthouse SEO + A11y inchangés (Task 9 step 6)

## Notes

- **Subagent-driven execution recommandé** — 9 tasks dont 6 batches répétitifs (pattern identique). Idéal pour parallélisation possible avec review entre chaque batch.
- **Tasks 2-7 sont mécaniques** : haiku/sonnet selon la complexité de la batch (Sonnet recommandé pour Header/Home/Formations qui sont volumineux ; haiku acceptable pour Breadcrumb fix).
- **Smoke check entre batches** est critique — c'est la seule façon de garantir non-régression visuelle FR sans test pixel-perfect.
- **Reviewer subagents** doivent vérifier batch par batch : (a) toutes les chaînes du batch externalisées, (b) aucune chaîne hors-batch touchée (scope respecté), (c) `t(...)` calls cohérents avec namespace du batch.
