# C2 — Static Data Migration to i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le texte FR des 5 fichiers de data statique (`src/lib/data/poles.ts`, `services.ts`, `projects.ts`, `formation-defaults.ts`, `src/lib/secteurs-data.ts`) vers les dictionnaires `next-intl`, en conservant la structure typée (slug/icon/color/image) dans les fichiers `.ts`. EN/AR restent verbatim FR.

**Architecture:** Approche hybride. `.ts` réduit aux champs structurels. Texte va dans `fr.json` sous `<domain>.items.<id>`. Lookup côté composants via `useTranslations` (scalaires) ou `useMessages` (arrays imbriqués). Helper `useDataMessages()` typé pour DRY. 5 batches progressifs avec smoke check + commit autonome.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.9, `next-intl` v4, Playwright, Vitest.

**Spec source:** `docs/superpowers/specs/2026-05-13-static-data-i18n-design.md`

---

## File Structure

### Created files
- `src/i18n/data-i18n.ts` — helper `useDataMessages` + `getDataMessages` + types `PoleI18n`/`ServiceI18n`/`ProjectI18n`/`SecteurI18n` (Task 1)

### Modified files
- `src/lib/data/poles.ts` — interface réduite, champs texte retirés (Task 2)
- `src/lib/secteurs-data.ts` — idem (Task 3)
- `src/lib/data/projects.ts` — idem (Task 4)
- `src/lib/data/services.ts` — idem (Task 5)
- `src/lib/data/formation-defaults.ts` — exports remplacés par lookup direct dans consumer (Task 6)
- `src/i18n/messages/fr.json` — enrichi de `poles.items`, `services.items`, `projects.items`, `secteurs.items`, `formations.defaults` (Tasks 2-6 incrémentaux)
- `src/i18n/messages/en.json` — copies verbatim
- `src/i18n/messages/ar.json` — copies verbatim
- **17 fichiers consumers** dans `src/components/` (réparties par batch — cf. tasks)
- `tests/unit/data.test.ts` — assertions sur champs texte retirées (Task 7)
- `tests/e2e/content-fr-snapshot.spec.ts` — étendu avec 5 pages détail (Task 8)

### Pattern de migration (référence)

**Pour un Server Component** :

```tsx
import { POLES } from "@/lib/data/poles";
import { getTranslations } from "next-intl/server";

export default async function PolesPage() {
  const t = await getTranslations("poles.items");
  return (
    <ul>
      {POLES.map((pole) => (
        <li key={pole.id} style={{ color: pole.color }}>
          <h3>{t(`${pole.id}.title`)}</h3>
        </li>
      ))}
    </ul>
  );
}
```

**Pour un Client Component avec arrays imbriqués** (via `useMessages` typé) :

```tsx
"use client";
import { SERVICES } from "@/lib/data/services";
import { useDataMessages } from "@/i18n/data-i18n";

export function ServiceDetail({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;
  const msg = useDataMessages();
  const i18n = msg.services.items[slug];

  return (
    <article style={{ background: service.bg }}>
      <h1 style={{ whiteSpace: "pre-line" }}>{i18n.title}</h1>
      <p>{i18n.intro}</p>
      <ul>
        {i18n.subs.map((sub, idx) => (
          <li key={idx}><h3>{sub.title}</h3><p>{sub.desc}</p></li>
        ))}
      </ul>
      <ul>
        {i18n.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
      </ul>
    </article>
  );
}
```

---

## Task 1: Create `useDataMessages` helper

**Files:**
- Create: `src/i18n/data-i18n.ts`

- [ ] **Step 1: Create the helper file**

Create `src/i18n/data-i18n.ts` with EXACTLY this content:

```ts
import { useMessages } from "next-intl";
import { getMessages } from "next-intl/server";

export type PoleI18n = {
  title: string;
  titleWithBreaks: string;
  tagline: string;
  tag: string;
  description: string;
  desc: string;
  stats: { left: string; leftLabel: string; right: string; rightLabel: string };
};

export type ServiceSubI18n = { title: string; desc: string };

export type ServiceI18n = {
  title: string;
  tagline: string;
  intro: string;
  subs: ServiceSubI18n[];
  benefits: string[];
  deliverables: string[];
};

export type ProjectResultI18n = { label: string; value: string };

export type ProjectI18n = {
  title: string;
  category: string;
  categoryFull: string;
  tagline: string;
  description: string;
  descriptionLong: string;
  tags: string[];
  client: string;
  duration: string;
  results: ProjectResultI18n[];
  challenges: string[];
  approach: string;
};

export type SecteurI18n = {
  label: string;
  tagline: string;
  description: string;
  services: string[];
  chiffre?: { value: string; label: string };
};

export type FormationsDefaultsI18n = {
  marquee: string[];
  trustStats: Array<{ value: string; label: string }>;
  painPoints: Array<{ num: string; title: string; text: string }>;
  // additional defaults added in Task 6 as encountered
};

export type DataMessages = {
  poles:      { items: Record<string, PoleI18n> };
  services:   { items: Record<string, ServiceI18n> };
  projects:   { items: Record<string, ProjectI18n> };
  secteurs:   { items: Record<string, SecteurI18n> };
  formations: { defaults: FormationsDefaultsI18n };
};

export function useDataMessages(): DataMessages {
  return useMessages() as unknown as DataMessages;
}

export async function getDataMessages(): Promise<DataMessages> {
  return (await getMessages()) as unknown as DataMessages;
}
```

> Note : le `FormationsDefaultsI18n` est volontairement minimal au Task 1 ; les sous-clés exactes (autres que `marquee`, `trustStats`, `painPoints`) seront ajoutées au type au Task 6 quand les exports de `formation-defaults.ts` seront migrés. Le cast `as unknown as ...` est nécessaire car `useMessages()` retourne `IntlMessages` (le type du Messages augmenté de `next-intl`) qui ne matche pas notre shape personnalisé.

- [ ] **Step 2: TypeScript check**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/data-i18n.ts && git commit -m "feat(c2): add useDataMessages helper with typed i18n shapes"
```

---

## Task 2: Batch 1 — Migrate `poles.ts`

**Files:**
- Modify: `src/lib/data/poles.ts`
- Modify: `src/components/poles/PolesIndexShell.tsx`
- Modify: `src/components/home/sections/PolesSection.tsx`
- Modify: `src/i18n/messages/fr.json`, `en.json`, `ar.json`
- Modify: `src/i18n/data-i18n.ts` (extend `PoleI18n` if fields not anticipated)

### Step 1: Read the source

Read `src/lib/data/poles.ts` to confirm the 3 `Pole` objects and their text fields: `title`, `titleWithBreaks`, `tagline`, `tag`, `description`, `desc`, `stats.{left,leftLabel,right,rightLabel}`.

- [ ] **Step 2: Add `poles.items.*` to fr.json**

Edit `src/i18n/messages/fr.json`. Add (or extend) the `poles` namespace. The `index` sub-namespace stays as-is (from C1). Add `items` sibling :

```json
"poles": {
  "index": { /* unchanged from C1 */ },
  "items": {
    "developpement-technologique": {
      "title": "Développement Technologique",
      "titleWithBreaks": "Pôle\nDéveloppement\nTechnologique",
      "tagline": "L'excellence technique au service de vos ambitions",
      "tag": "Ingénierie",
      "description": "Conception et déploiement de solutions technologiques sur mesure qui transforment vos idées en produits concrets.",
      "desc": "Solutions sur mesure, plateformes robustes et développement logiciel adapté aux enjeux de chaque client.",
      "stats": {
        "left": "Sur-mesure",
        "leftLabel": "Ingénierie",
        "right": "Performance",
        "rightLabel": "Robustesse"
      }
    },
    "conseil-strategie-it": {
      "title": "Conseil & Stratégie IT",
      "titleWithBreaks": "Pôle\nConseil",
      "tagline": "Votre partenaire stratégique pour la transformation digitale",
      "tag": "Stratégie IT",
      "description": "Accompagnement stratégique et opérationnel dans votre transformation numérique, de l'audit au pilotage de projets.",
      "desc": "Accompagnement stratégique, audit technologique et transformation globale pour accélérer votre croissance.",
      "stats": {
        "left": "Audit 360°",
        "leftLabel": "Diagnostic",
        "right": "Stratégie",
        "rightLabel": "Accompagnement"
      }
    },
    "formation": {
      "title": "Formation & Développement",
      "titleWithBreaks": "Pôle\nFormation",
      "tagline": "Former les talents qui construiront l'Afrique de demain",
      "tag": "Transmission",
      "description": "Démocratisation de l'accès aux compétences technologiques via formations certifiantes, ateliers et bootcamps.",
      "desc": "Montée en compétences, ateliers spécialisés et parcours de formation pour développer les talents.",
      "stats": {
        "left": "Certifiant",
        "leftLabel": "Parcours",
        "right": "Innovation",
        "rightLabel": "Impact Local"
      }
    }
  }
}
```

- [ ] **Step 3: Reduce `Pole` interface and `POLES` array**

Replace ENTIRE content of `src/lib/data/poles.ts` with:

```ts
import { Code, Users, GraduationCap, LucideIcon } from "lucide-react";

export interface Pole {
  id: string;       // utilisé comme clé i18n (poles.items.<id>.*)
  n: string;        // numéro affiché "01"/"02"/"03"
  number: string;
  color: string;
  icon: LucideIcon;
  image: string;
  img: string;
  href: string;
}

export const POLES: Pole[] = [
  {
    id: "developpement-technologique",
    n: "01", number: "01",
    color: "#D35400",
    icon: Code,
    image: "/images/poles/pole-it.jpg",
    img: "/images/poles/pole-it.jpg",
    href: "/poles/developpement-technologique",
  },
  {
    id: "conseil-strategie-it",
    n: "02", number: "02",
    color: "#D35400",
    icon: Users,
    image: "/images/poles/pole-conseil.jpg",
    img: "/images/poles/pole-conseil.jpg",
    href: "/poles/conseil-strategie-it",
  },
  {
    id: "formation",
    n: "03", number: "03",
    color: "#D35400",
    icon: GraduationCap,
    image: "/images/poles/pole-formation.jpg",
    img: "/images/poles/pole-formation.jpg",
    href: "/poles/formation",
  },
];
```

- [ ] **Step 4: Adapt `src/components/poles/PolesIndexShell.tsx`**

Read the file first. Then replace direct accesses like `pole.title`, `pole.description`, `pole.stats.left`, etc. with `useDataMessages()` lookups.

Add import:
```tsx
import { useDataMessages } from "@/i18n/data-i18n";
```

In the component body:
```tsx
const msg = useDataMessages();
// ...
{POLES.map((pole) => {
  const i18n = msg.poles.items[pole.id];
  return (
    <Card key={pole.id} color={pole.color} icon={pole.icon} image={pole.image} href={pole.href}>
      <h3 style={{ whiteSpace: "pre-line" }}>{i18n.titleWithBreaks}</h3>
      <p>{i18n.tagline}</p>
      <p>{i18n.description}</p>
      {/* stats */}
      <div>
        <span>{i18n.stats.left}</span>
        <small>{i18n.stats.leftLabel}</small>
      </div>
    </Card>
  );
})}
```

Adapt to the actual JSX structure. The principle: any reference to `pole.<textField>` becomes `i18n.<textField>` (where `i18n = msg.poles.items[pole.id]`). Structural fields (`pole.color`, `pole.icon`, `pole.image`, `pole.href`, `pole.n`) stay as direct `pole.<field>` accesses.

If `PolesIndexShell` is a **Server Component** (no `"use client"` at top), use `getDataMessages()` instead :
```tsx
import { getDataMessages } from "@/i18n/data-i18n";
const msg = await getDataMessages();
```

- [ ] **Step 5: Adapt `src/components/home/sections/PolesSection.tsx`**

Same pattern. Read file, replace text field accesses with `msg.poles.items[pole.id].<field>`.

- [ ] **Step 6: Re-copy fr.json to en/ar verbatim**

PowerShell:
```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 7: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```

If TS errors appear in `tests/unit/data.test.ts` (validating `pole.title`, etc.), don't fix them here — they're addressed in Task 7. Note them but proceed.

If TS errors appear in **other consumers** not listed (e.g., another component imports POLES and accesses `pole.description`), update those too — they're in scope for Batch 1.

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && rm -rf .next && npm run build 2>&1 | tail -10
```
Expected: clean, ≥110 pages.

- [ ] **Step 8: Smoke check curl**

`npm run dev`, then:
```bash
echo "=== /fr/poles renders pole titles ==="
curl.exe -s http://localhost:3000/fr/poles | grep -oE "(Développement Technologique|Conseil|Formation)" | sort -u | head -3

echo ""
echo "=== /fr/poles renders descriptions ==="
curl.exe -s http://localhost:3000/fr/poles | grep -oE "Conception et déploiement" | head -1
```
Expected: pôle titles render + at least one description string.

Stop dev server cleanly (port 3000 free).

- [ ] **Step 9: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/lib/data/poles.ts src/components/poles/PolesIndexShell.tsx src/components/home/sections/PolesSection.tsx src/i18n/messages/ && git commit -m "refactor(c2): batch 1 — migrate poles.ts text fields to i18n dictionary"
```

---

## Task 3: Batch 2 — Migrate `secteurs-data.ts`

**Files:**
- Modify: `src/lib/secteurs-data.ts`
- Modify: `src/components/secteurs/SecteursShell.tsx`
- Modify: `src/components/secteurs/SecteurDetailShell.tsx`
- Modify: `src/app/[locale]/secteurs/[slug]/page.tsx` (consumer pour metadata éventuellement)
- Modify: `src/i18n/messages/fr.json`, `en.json`, `ar.json`

### Step 1: Read source

Read `src/lib/secteurs-data.ts`. Identify the array `secteurs` (typed `Secteur[]`) with fields per item: `slug`, `label`, `tagline`, `description`, `icon` (emoji), `color`, `image`, `services[]` (bullet points), optional `chiffre: {value, label}`.

Text fields to migrate: `label`, `tagline`, `description`, `services[]` (each bullet), `chiffre.label` (if present).
Structural fields to keep: `slug`, `icon` (emoji), `color`, `image`, `chiffre.value`.

- [ ] **Step 2: Add `secteurs.items.*` to fr.json**

Edit `src/i18n/messages/fr.json`. Extend the `secteurs` namespace with an `items` sub-namespace (preserve `secteurs.index` and `secteurs.detail` from C1).

For each secteur in the source array, add an entry under `secteurs.items.<slug>`:

```json
"secteurs": {
  "index": { /* unchanged */ },
  "detail": { /* unchanged */ },
  "items": {
    "industrie": {
      "label": "Industrie",
      "tagline": "Moderniser pour mieux compétir",
      "description": "Dans un environnement industriel de plus en plus compétitif...",
      "services": [
        "Automatisation des lignes de production",
        "IoT & maintenance prédictive",
        "Digitalisation de la chaîne logistique",
        "Systèmes de traçabilité & suivi temps réel",
        "Optimisation des flux de production"
      ],
      "chiffre": { "label": "Industrie 4.0" }
    },
    "<other-secteur-slug>": { /* ... */ }
  }
}
```

Use the actual data from `secteurs-data.ts` — copy text verbatim.

- [ ] **Step 3: Reduce `Secteur` interface and `secteurs` array**

Replace the interface and array in `src/lib/secteurs-data.ts`:

```ts
export type Secteur = {
  slug: string;
  icon: string; // emoji
  color: string;
  image: string;
  chiffreValue?: string;
};

export const secteurs: Secteur[] = [
  {
    slug: "industrie",
    icon: "⚙️",
    color: "#E67E22",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=2400&q=80",
    chiffreValue: "30+",
  },
  // ... apply same reduction to all secteurs items, copying only structural fields
];
```

> The `chiffre: { value, label }` object is split: `chiffreValue` stays in `.ts`, `chiffre.label` goes to dictionary.

- [ ] **Step 4: Adapt `SecteursShell.tsx`**

Read the file. Replace `secteur.label`/`secteur.tagline`/`secteur.description`/`secteur.services[]`/`secteur.chiffre.label` with i18n lookups.

```tsx
import { useDataMessages } from "@/i18n/data-i18n";
// (use getDataMessages if Server Component)

const msg = useDataMessages();

// Inside the map:
const i18n = msg.secteurs.items[secteur.slug];
<h3>{i18n.label}</h3>
<p>{i18n.tagline}</p>
<p>{i18n.description}</p>
<ul>
  {i18n.services.map((s, i) => <li key={i}>{s}</li>)}
</ul>
{secteur.chiffreValue && i18n.chiffre && (
  <div>
    <strong>{secteur.chiffreValue}</strong>
    <small>{i18n.chiffre.label}</small>
  </div>
)}
```

- [ ] **Step 5: Adapt `SecteurDetailShell.tsx`**

Same pattern — replace all `secteur.<textField>` with `i18n.<textField>` via `useDataMessages` / `getDataMessages`.

- [ ] **Step 6: Verify `src/app/[locale]/secteurs/[slug]/page.tsx`**

Read this page. The existing `generateMetadata` (from C1 phase B) probably reads `secteur.label` and `secteur.description` from `src/lib/data/`. Adapt to use translations:

```tsx
import { getTranslations } from "next-intl/server";
import { getDataMessages } from "@/i18n/data-i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const msg = await getDataMessages();
  const i18n = msg.secteurs.items[slug];
  return buildDynamicPageMetadata({
    locale,
    path: `/secteurs/${slug}`,
    title: i18n?.label ?? `${slug} — ACT`,
    description: (i18n?.description ?? "Secteur d'activité — ACT.").slice(0, 155),
  });
}
```

- [ ] **Step 7: Re-copy fr.json to en/ar verbatim**

```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 8: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -10
```

- [ ] **Step 9: Smoke check curl**

```bash
echo "=== /fr/secteurs renders secteurs ==="
curl.exe -s http://localhost:3000/fr/secteurs | grep -oE "Industrie" | head -1

echo ""
echo "=== /fr/secteurs/industrie renders detail ==="
curl.exe -s http://localhost:3000/fr/secteurs/industrie | grep -oE "Moderniser pour mieux compétir" | head -1
```

Stop dev cleanly.

- [ ] **Step 10: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/lib/secteurs-data.ts src/components/secteurs/ "src/app/[locale]/secteurs/" src/i18n/messages/ && git commit -m "refactor(c2): batch 2 — migrate secteurs-data.ts text fields to i18n dictionary"
```

---

## Task 4: Batch 3 — Migrate `projects.ts`

**Files:**
- Modify: `src/lib/data/projects.ts`
- Modify: `src/components/realisations/RealisationsShell.tsx`
- Modify: `src/components/realisations/ProjectDetailShell.tsx`
- Modify: `src/components/home/sections/ProjectsSection.tsx`
- Modify: `src/app/[locale]/projects/[slug]/page.tsx`
- Modify: `src/i18n/messages/fr.json`, `en.json`, `ar.json`

### Step 1: Read source

Read `src/lib/data/projects.ts`. Identify `Project` interface and `PROJECTS` array. Text fields per project: `title`, `category`, `categoryFull`, `tagline`, `description`, `descriptionLong`, `tags[]`, `client`, `duration`, `results[].label`, `results[].value`, `challenges[]`, `approach`.
Structural fields: `id`, `index`, `image`, `year` (numeric-ish), `color`.

> Note : `tags[]` (e.g., `["RAG", "OpenAI GPT-5", "pgvector"]`) sont des termes techniques majoritairement non-traduisibles. Discussion : on les migre quand même (pour cohérence) — la traduction C3 décidera s'ils restent identiques en EN/AR.
> Note : `year` (e.g., `"2025"`) reste structurel (un chiffre, non-traduisible).
> Note : `results[].value` (e.g., `"99.2% uptime"`, `"+400 utilisateurs"`) contient parfois du texte traduisible (`"99.2% uptime"` → `"99.2% uptime"` invariant ; `"+400 utilisateurs"` → `"+400 users"` en EN). On migre `results[]` complet (label ET value) — la traduction C3 décidera.

- [ ] **Step 2: Add `projects.items.*` to fr.json**

For each project in `PROJECTS`, add an entry under `projects.items.<id>` with all text fields. Preserve newlines (`\n`) in `descriptionLong` as JSON string literal `\n`.

```json
"projects": {
  "index": { /* unchanged from C1 */ },
  "detail": { /* unchanged from C1 */ },
  "items": {
    "rag": {
      "title": "Système RAG Multi-sources",
      "category": "IA",
      "categoryFull": "Intelligence Artificielle",
      "tagline": "Chatbot multimodal pour environnements à faible connectivité",
      "description": "Chatbot multimodal capable de répondre à partir de documents, images, audio et vidéo grâce à un pipeline RAG et embeddings multimodaux.",
      "descriptionLong": "Le Système RAG Multi-sources est une solution d'intelligence artificielle de pointe...\n\nLe cœur du système repose sur un pipeline RAG (Retrieval-Augmented Generation) optimisé...\n\nL'interface Streamlit permet aux équipes non-techniques...",
      "tags": ["RAG", "OpenAI GPT-5", "pgvector", "Streamlit", "Python", "FastAPI"],
      "client": "ACT Lab",
      "duration": "6 mois",
      "results": [
        { "label": "Recherche multimodale", "value": "4 types de médias" },
        { "label": "Indexation vectorielle", "value": "< 50 ms / requête" },
        { "label": "Pipeline robuste", "value": "99.2% uptime" },
        { "label": "Base documentaire", "value": "10 000+ documents" }
      ],
      "challenges": [ /* copy from source */ ],
      "approach": "..."
    }
  }
}
```

Repeat for each project. Use the exact text from the source.

- [ ] **Step 3: Reduce `Project` interface and `PROJECTS` array**

```ts
export interface Project {
  id: string;          // utilisé comme clé i18n
  index: string;       // "01"/"02"/... (structural)
  image: string;
  year: string;
  color: string;
}

export const PROJECTS: Project[] = [
  { id: "rag", index: "01", image: "/realisationprojet/2025/systeme-rag-multi-sources.png", year: "2025", color: "#D35400" },
  // ... all other projects, structural fields only
];
```

- [ ] **Step 4: Adapt the 4 consumers**

For each of `RealisationsShell.tsx`, `ProjectDetailShell.tsx`, `ProjectsSection.tsx`, `projects/[slug]/page.tsx`:

1. Add `useDataMessages` (or `getDataMessages` for server) import
2. Replace `project.title`, `project.tagline`, etc. with `msg.projects.items[project.id].<field>`
3. For nested arrays (`results`, `challenges`, `tags`), iterate via `i18n.results.map(...)`

For `app/[locale]/projects/[slug]/page.tsx`, adapt `generateMetadata` similarly to Batch 2 Step 6 (use `getDataMessages` + `buildDynamicPageMetadata`).

- [ ] **Step 5: Re-copy fr.json to en/ar verbatim**

```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -10
```

- [ ] **Step 7: Smoke check**

```bash
echo "=== /fr/projects renders project titles ==="
curl.exe -s http://localhost:3000/fr/projects | grep -oE "(Système RAG Multi-sources|<h[1-3][^>]*>[^<]+</h[1-3]>)" | head -3

echo ""
echo "=== /fr/projects/rag detail page ==="
curl.exe -s http://localhost:3000/fr/projects/rag | grep -oE "Chatbot multimodal" | head -1
```

Stop dev cleanly.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/lib/data/projects.ts src/components/realisations/ src/components/home/sections/ProjectsSection.tsx "src/app/[locale]/projects/" src/i18n/messages/ && git commit -m "refactor(c2): batch 3 — migrate projects.ts text fields to i18n dictionary"
```

---

## Task 5: Batch 4 — Migrate `services.ts` (the big one)

**Files:**
- Modify: `src/lib/data/services.ts`
- Modify: `src/components/services/ServicesGrid.tsx`
- Modify: `src/components/services/ServicesIntroShell.tsx`
- Modify: `src/components/services/ServiceDetailShell.tsx`
- Modify: `src/components/services/PoleIngenieurieShell.tsx`
- Modify: `src/components/services/PoleConseilShell.tsx`
- Modify: `src/components/services/PoleFormationShell.tsx`
- Modify: `src/app/[locale]/services/[slug]/page.tsx`
- Modify: `src/i18n/messages/fr.json`, `en.json`, `ar.json`

> Note : This is the biggest batch. The source file is 388 lines with ~9 services each having `title`, `tagline`, `intro`, `subs[]` (2-3 sub-services × {title, desc}), `benefits[]` (4-5 bullets), `deliverables[]` (3-4 bullets). Expected ~200-250 dictionary keys added.

### Step 1: Read source

Read `src/lib/data/services.ts` in chunks. List each service's text content. Structural fields per service: `slug`, `n`, `pole`, `poleN`, `accent`, `bg`, `icon` (SVG path string), `video`, `heroImage`, `subImages[]`.

> Important : `pole` (e.g., `"Ingénierie Technologique"`) is a French text label that might appear in UI. Check if it does. If yes, migrate it. If it's only used for grouping by `poleN`, keep it as structural metadata (but probably the consumer renders `pole` in a badge — migrate it).

- [ ] **Step 2: Add `services.items.*` to fr.json**

For each service, add an entry under `services.items.<slug>`:

```json
"services": {
  "catalogue": { /* unchanged from C1 */ },
  "detail": { /* unchanged */ },
  "intro": { /* unchanged */ },
  "grid": { /* unchanged */ },
  "poles": { /* unchanged */ },
  "items": {
    "ingenierie-logicielle": {
      "pole": "Ingénierie Technologique",
      "title": "Ingénierie Logicielle\n& Développement de Solutions\nMétiers & Mobiles",
      "tagline": "Des applications qui parlent africain",
      "intro": "La transformation digitale et la généralisation du mobile redéfinissent...",
      "subs": [
        { "title": "Applications Web & Mobiles « African-Ready »", "desc": "Applications web et mobiles modernes alliant performance..." },
        { "title": "Logiciels Métiers Spécifiques", "desc": "Solutions sur mesure pour les entreprises et institutions africaines..." }
      ],
      "benefits": [
        "Efficacité opérationnelle améliorée",
        "Gestion des processus métiers simplifiée",
        "Expérience utilisateur renforcée",
        "Indépendance des systèmes génériques",
        "Plateformes digitales évolutives et performantes"
      ],
      "deliverables": [
        "Application livrée & documentée",
        "Formation des équipes techniques",
        "Maintenance & support 12 mois",
        "Tableau de bord de performance"
      ]
    }
  }
}
```

Repeat for all 9 services. The `pole` field is added to the i18n shape so the badge label displayed on each service card is translatable.

- [ ] **Step 3: Update `ServiceI18n` type in `src/i18n/data-i18n.ts`**

Add the `pole` field to `ServiceI18n`:

```ts
export type ServiceI18n = {
  pole: string;       // NEW: previously structural; now translated
  title: string;
  tagline: string;
  intro: string;
  subs: ServiceSubI18n[];
  benefits: string[];
  deliverables: string[];
};
```

- [ ] **Step 4: Reduce `Service` interface and `SERVICES` array**

```ts
export interface ServiceSub {
  // No longer needed at this level — the i18n shape has it
  // (kept for backward compat if any consumer references the type; can remove if unused)
}

export interface Service {
  slug: string;
  n: string;
  poleN: "I" | "II" | "III";
  accent: string;
  bg: string;
  icon: string;        // SVG path
  video: string;
  heroImage: string;
  subImages: string[];
}

const ORANGE = "#D35400";
const GOLD   = "#F39C12";

export const SERVICES: Service[] = [
  {
    slug: "ingenierie-logicielle",
    n: "01", poleN: "I", accent: ORANGE,
    bg: "radial-gradient(ellipse 90% 80% at 20% 60%, #0D2040 0%, #050C18 55%, #030810 100%)",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    video: "https://cdn.pixabay.com/video/2019/05/06/23355-334950213_large.mp4",
    heroImage: "/images/services/Ingéneurie_logicielle.jpg",
    subImages: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  // ... all other services, structural fields only
];
```

> Note : the old `pole` string field is gone — it's now in dict. `poleN` (Roman numeral grouping) stays as structural metadata.
> If any code uses `ServiceSub` type for typing, replace those references with `ServiceSubI18n` from `@/i18n/data-i18n`.

- [ ] **Step 5: Adapt the 7 consumers**

For each of:
- `src/components/services/ServicesGrid.tsx`
- `src/components/services/ServicesIntroShell.tsx`
- `src/components/services/ServiceDetailShell.tsx`
- `src/components/services/PoleIngenieurieShell.tsx`
- `src/components/services/PoleConseilShell.tsx`
- `src/components/services/PoleFormationShell.tsx`
- `src/app/[locale]/services/[slug]/page.tsx`

Apply the pattern:
1. Import `useDataMessages` (or `getDataMessages`)
2. Get `const msg = useDataMessages();` (or `await getDataMessages()`)
3. For each service rendered, lookup `const i18n = msg.services.items[service.slug];`
4. Replace `service.title`, `service.tagline`, `service.intro`, `service.pole`, `service.subs`, `service.benefits`, `service.deliverables` with `i18n.<field>`
5. Iterate over arrays via `i18n.subs.map(...)`, `i18n.benefits.map(...)`, etc.

> For the page `app/[locale]/services/[slug]/page.tsx`, also update `generateMetadata` to use `await getDataMessages()` and `i18n.title`/`i18n.tagline` for the metadata title and description.

- [ ] **Step 6: Re-copy fr.json to en/ar verbatim**

```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

- [ ] **Step 7: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -10
```

Errors will appear in `tests/unit/data.test.ts` (validating `service.title`, etc.) — leave for Task 7.

- [ ] **Step 8: Smoke check curl**

```bash
echo "=== /fr/services renders 9 services ==="
curl.exe -s http://localhost:3000/fr/services | grep -oE "(Ingénierie Logicielle|Automatisation Intelligente)" | sort -u

echo ""
echo "=== /fr/services/ingenierie-logicielle detail ==="
curl.exe -s "http://localhost:3000/fr/services/ingenierie-logicielle" | grep -oE "Des applications qui parlent africain" | head -1

echo ""
echo "=== Benefits list rendered ==="
curl.exe -s "http://localhost:3000/fr/services/ingenierie-logicielle" | grep -oE "Efficacité opérationnelle améliorée" | head -1
```

Stop dev cleanly.

- [ ] **Step 9: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/lib/data/services.ts src/components/services/ "src/app/[locale]/services/" src/i18n/messages/ src/i18n/data-i18n.ts && git commit -m "refactor(c2): batch 4 — migrate services.ts text fields to i18n dictionary"
```

---

## Task 6: Batch 5 — Migrate `formation-defaults.ts`

**Files:**
- Modify: `src/lib/data/formation-defaults.ts`
- Modify: `src/components/formations/FormationDetailShell.tsx`
- Modify: `src/i18n/messages/fr.json`, `en.json`, `ar.json`
- Modify: `src/i18n/data-i18n.ts` (extend `FormationsDefaultsI18n`)

> Note : `formation-defaults.ts` exports several **named constants** (`DEFAULT_MARQUEE_ITEMS`, `DEFAULT_TRUST_STATS`, `DEFAULT_PAIN_POINTS`, etc.) rather than a single typed array. Approach: remove the named exports (or replace them with helpers that read from dictionary), and let the consumer `FormationDetailShell.tsx` read directly from `useDataMessages().formations.defaults.*`.

### Step 1: Read source fully

Read `src/lib/data/formation-defaults.ts` end-to-end. Identify all named exports and their content :

- `DEFAULT_MARQUEE_ITEMS: string[]` — 5 items (social proof scrolling text)
- `DEFAULT_TRUST_STATS: { value, label }[]` — 3 trust stats for hero
- `DEFAULT_PAIN_POINTS: { num, title, text, image_url }[]` — 3 pain point cards
- (plus other exports — read to enumerate)

Structural (keep in `.ts`): `image_url` for pain points. All other fields are text.

### Step 2: Add `formations.defaults.*` to fr.json

Build the full structure based on what you found in Step 1:

```json
"formations": {
  "catalogue": { /* unchanged */ },
  "detail": { /* unchanged */ },
  "inscription": { /* unchanged */ },
  "brochure": { /* unchanged */ },
  "cart": { /* unchanged */ },
  "items": {
    /* if any per-formation defaults exist */
  },
  "defaults": {
    "marquee": [
      "+400 professionnels formés",
      "Note 4,9/5 sur 213 avis",
      "Partenaire OpenAI & Anthropic",
      "97% recommandent",
      "32 entreprises clientes"
    ],
    "trustStats": [
      { "value": "+400", "label": "Pros formés" },
      { "value": "4,9/5", "label": "Satisfaction" },
      { "value": "97%", "label": "Recommandent" }
    ],
    "painPoints": [
      { "num": "01", "title": "Submergé par les outils ?", "text": "ChatGPT, Claude, Gemini, Copilot... impossible de savoir par où commencer." },
      { "num": "02", "title": "Prompts qui ne marchent pas ?", "text": "Vous testez, mais les réponses restent génériques. Plus de temps perdu que gagné." },
      { "num": "03", "title": "Équipe qui décroche ?", "text": "Certains adoptent, d'autres résistent. Pas de méthode commune, risque RGPD." }
    ]
    /* ... add remaining defaults found in Step 1 */
  }
}
```

> The `image_url` field of `DEFAULT_PAIN_POINTS` is removed from the i18n shape (it's structural — same image across locales). It will be kept in `formation-defaults.ts` as a separate structural export.

### Step 3: Update `FormationsDefaultsI18n` in `src/i18n/data-i18n.ts`

Extend the type to match the actual content of `formations.defaults`:

```ts
export type FormationsDefaultsI18n = {
  marquee: string[];
  trustStats: Array<{ value: string; label: string }>;
  painPoints: Array<{ num: string; title: string; text: string }>;
  /* add other defaults you encountered in Step 1 */
};
```

### Step 4: Replace exports in `formation-defaults.ts`

Replace ENTIRE content of `src/lib/data/formation-defaults.ts` with structural-only exports:

```ts
/**
 * Default formation page assets — structural (images/URLs).
 * Text content lives in fr.json under formations.defaults.*
 */

export const DEFAULT_PAIN_POINT_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
  "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
];

/* Add other structural exports found in Step 1 (image URLs, video URLs, etc.) */
```

Remove all the named exports that contained text (DEFAULT_MARQUEE_ITEMS, DEFAULT_TRUST_STATS, DEFAULT_PAIN_POINTS).

### Step 5: Adapt `FormationDetailShell.tsx`

Read the file. Find imports from `@/lib/data/formation-defaults`. Replace them:

```tsx
// Before:
import { DEFAULT_MARQUEE_ITEMS, DEFAULT_TRUST_STATS, DEFAULT_PAIN_POINTS } from "@/lib/data/formation-defaults";

// After:
import { DEFAULT_PAIN_POINT_IMAGES } from "@/lib/data/formation-defaults";
import { useDataMessages } from "@/i18n/data-i18n";
```

In the component body, replace constant usage:

```tsx
const msg = useDataMessages();
const defaults = msg.formations.defaults;

// Use defaults.marquee, defaults.trustStats, defaults.painPoints
// For pain points, combine text from i18n + image from structural:
const painPointsCombined = defaults.painPoints.map((pp, idx) => ({
  ...pp,
  image_url: DEFAULT_PAIN_POINT_IMAGES[idx] ?? "",
}));
```

Or render inline:

```tsx
{defaults.painPoints.map((pp, idx) => (
  <div key={idx}>
    <span>{pp.num}</span>
    <h3>{pp.title}</h3>
    <p>{pp.text}</p>
    <img src={DEFAULT_PAIN_POINT_IMAGES[idx] ?? ""} alt="" />
  </div>
))}
```

### Step 6: Re-copy fr.json to en/ar

```powershell
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\en.json"
Copy-Item "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\fr.json" "D:\server\website-act-officiel-\.worktrees\feat-i18n-architecture\src\i18n\messages\ar.json"
```

### Step 7: TS check + build

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -10
```

### Step 8: Smoke check

```bash
echo "=== /fr/formations/<slug> shows pain points ==="
curl.exe -s "http://localhost:3000/fr/formations/01_ia_productivite_quotidienne" | grep -oE "Submergé par les outils" | head -1
```

If the Shopify formation slug doesn't exist, the page may 404 — that's fine, the defaults still load (they're injected by the page template).

Stop dev cleanly.

### Step 9: Commit

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/lib/data/formation-defaults.ts src/components/formations/FormationDetailShell.tsx src/i18n/messages/ src/i18n/data-i18n.ts && git commit -m "refactor(c2): batch 5 — migrate formation-defaults.ts text to i18n dictionary"
```

---

## Task 7: Adapt `tests/unit/data.test.ts`

**Files:**
- Modify: `tests/unit/data.test.ts`

After batches 1-5, the `data.test.ts` will have failing assertions because they reference text fields that no longer exist on the reduced interfaces (`Pole`, `Service`, `Project`, etc.).

### Step 1: Read tests/unit/data.test.ts

Read the full file. Identify which assertions check text fields (e.g., `expect(pole.title).toBeTruthy()`) vs. structural fields (e.g., `expect(pole.color).toMatch(/^#[0-9A-F]{6}$/i)`).

### Step 2: Remove assertions on text fields

For each removed text field (`title`, `tagline`, `description`, `intro`, `subs[]`, `benefits[]`, `deliverables[]`, etc.), remove the corresponding `expect(...)` call. Keep:
- Slug/ID uniqueness checks
- Color hex format validation
- Image URL non-empty validation
- Numeric/structural constraints (e.g., `poleN ∈ ["I", "II", "III"]`)
- Array non-emptiness (e.g., `expect(subImages.length).toBeGreaterThan(0)` — structural)

### Step 3: Optionally — add new assertions on i18n keys

To validate that every entity in the array has a corresponding i18n key, add a test:

```ts
import frMessages from "@/i18n/messages/fr.json";
import { POLES } from "@/lib/data/poles";

describe("poles i18n coverage", () => {
  it("every pole has a fr.json entry", () => {
    for (const pole of POLES) {
      expect((frMessages as any).poles.items[pole.id]).toBeDefined();
      expect((frMessages as any).poles.items[pole.id].title).toBeTruthy();
    }
  });
});
```

Apply same pattern for SECTEURS, PROJECTS, SERVICES.

### Step 4: Run tests

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm test 2>&1 | tail -10
```
Expected: all tests pass.

### Step 5: Commit

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add tests/unit/data.test.ts && git commit -m "test(c2): adapt data.test.ts assertions to reduced interfaces + add i18n coverage tests"
```

---

## Task 8: Extend `content-fr-snapshot.spec.ts` with detail pages

**Files:**
- Modify: `tests/e2e/content-fr-snapshot.spec.ts`

### Step 1: Read current content-fr-snapshot.spec.ts

Confirm the structure — array of `{ path, contains }` objects.

### Step 2: Add detail pages to the PAGES array

Append these entries to the `PAGES` array (or create a new `DETAIL_PAGES` constant and iterate the same way) :

```ts
{ path: "/fr/poles/developpement-technologique", contains: ["Développement Technologique"] },
{ path: "/fr/poles/conseil-strategie-it", contains: ["Conseil"] },
{ path: "/fr/poles/formation", contains: ["Formation"] },
{ path: "/fr/secteurs/industrie", contains: ["Industrie"] },
{ path: "/fr/services/ingenierie-logicielle", contains: ["Ingénierie Logicielle"] },
```

> If a project slug is publicly known to exist (e.g., `/fr/projects/rag`), add it too. Otherwise leave for later.

### Step 3: Run the test

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e -- tests/e2e/content-fr-snapshot.spec.ts
```
Expected: all page tests pass (existing + new detail pages).

### Step 4: Commit

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add tests/e2e/content-fr-snapshot.spec.ts && git commit -m "test(c2): extend FR content snapshot with detail pages (poles/secteurs/services)"
```

---

## Task 9: Final validation (no commit)

### Step 1: Production build

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && rm -rf .next && npm run build 2>&1 | tail -10
```
Expected: clean, ≥110 pages.

### Step 2: All unit tests

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm test 2>&1 | tail -10
```
Expected: all tests pass.

### Step 3: All E2E tests

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e 2>&1 | tail -10
```
Expected: i18n + seo + smoke + content-fr-snapshot all pass (Shopify-dependent ones may skip).

### Step 4: Smoke checks via prod server

`npm run start`, then:

```bash
echo "=== /fr/poles ==="
curl.exe -s http://localhost:3000/fr/poles | grep -oE "(Développement Technologique|Conseil|Formation)" | sort -u

echo ""
echo "=== /fr/secteurs ==="
curl.exe -s http://localhost:3000/fr/secteurs | grep -oE "<h[1-3][^>]*>[^<]+</h[1-3]>" | head -5

echo ""
echo "=== /fr/services/ingenierie-logicielle ==="
curl.exe -s http://localhost:3000/fr/services/ingenierie-logicielle | grep -oE "Efficacité opérationnelle améliorée" | head -1

echo ""
echo "=== /fr/projects/rag ==="
curl.exe -s http://localhost:3000/fr/projects/rag | grep -oE "Chatbot multimodal" | head -1
```

Stop server.

### Step 5: Audit no hardcoded FR remaining in src/lib/

```bash
grep -rln '"[A-ZÀ-ÿ][^"]\{15,\}"' "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture/src/lib/data/" "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture/src/lib/secteurs-data.ts" 2>&1
```

Expected: very few results — only image URLs, video URLs, slugs (slugs may contain accented chars), CSS gradients. No real user-visible FR text.

Document any remaining text strings (likely none for legitimate cases) for follow-up.

### Step 6: Lighthouse comparison

Run Lighthouse on `http://localhost:3000/fr/` and `/fr/services/ingenierie-logicielle`. Compare to post-C1 baseline:
- SEO ≥ score post-C1
- Accessibility ≥ score post-C1
- Performance & Best Practices: should be neutral

If any drops more than 3 points, investigate.

---

## Acceptance Criteria

- ✅ Helper `useDataMessages` created with typed shapes (Task 1)
- ✅ All 5 data sources migrated: structural fields in `.ts`, text in `fr.json` (Tasks 2-6)
- ✅ All 17 consumers adapted to lookup pattern (Tasks 2-6)
- ✅ JSON dicts byte-identical (every batch re-copies)
- ✅ `data.test.ts` adapted (Task 7)
- ✅ Snapshot E2E extended with detail pages (Task 8)
- ✅ Build clean ≥110 pages, all tests pass (Task 9)
- ✅ Lighthouse SEO + A11y inchangés vs C1 baseline (Task 9)

## Notes

- **Subagent-driven execution recommandé** — 9 tasks dont 5 batches répétitifs.
- **Batch 4 (services.ts)** est le plus gros : 9 services × 4-5 arrays imbriqués = ~200+ keys. Prévoir 30% du temps total de C2 sur ce batch. Sonnet recommandé.
- **Smoke check entre batches** est critique — refactor de structure peut casser un cast TS qui ne se révèle qu'au runtime sur la page rendue.
- **Reviewer subagents** vérifient batch par batch : (a) tous les champs texte du fichier source extraits, (b) interface `.ts` réduite correctement, (c) consumers adaptés sans casser la logique métier, (d) JSON dicts en sync.
