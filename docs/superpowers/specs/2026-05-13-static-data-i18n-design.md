# Spec — Migration data statique vers dictionnaires (sous-projet C2)

**Date** : 2026-05-13
**Projet parent** : Sous-projet C — Traduction du contenu multi-langue
**Phase** : **C2 — Migration data statique** (phase 2 sur 5 dans C)
**Branche** : `feat/i18n-architecture` (poursuite empilée — A + B + C1 + C2)
**Statut** : Design validé, en attente de relecture utilisateur
**Sous-projets précédents** : A (i18n architecture), B (SEO foundations), C1 (UI strings externalization)
**Sous-phases suivantes** : C3 (traduction EN + AR), C4 (Shopify multi-langue), C5 (QA finale)

---

## 1. Contexte

Le sous-projet C1 a externalisé les chaînes UI hardcodées dans les composants. Reste le **contenu statique structuré** dans 5 fichiers data sources :

| Fichier | Lignes | Contenu |
|---|---|---|
| `src/lib/data/services.ts` | 388 | ~9 services × {title, tagline, intro, subs[], benefits[], deliverables[]} |
| `src/lib/data/formation-defaults.ts` | 256 | Valeurs par défaut Shopify formations |
| `src/lib/data/projects.ts` | 165 | Projets clients × {title, tagline, description, results, challenges} |
| `src/lib/secteurs-data.ts` | 152 | ~5-7 secteurs × {label, tagline, description, services[]} |
| `src/lib/data/poles.ts` | 78 | 3 pôles × {title, tagline, description, stats} |

Soit **~1040 lignes** dont la majorité est du contenu texte FR. Ces fichiers sont importés directement par les composants (consumers : `ServicesGrid`, `RealisationsShell`, `SecteursShell`, `PolesIndexShell`, etc.) qui rendent les champs comme `service.title`, `pole.description`, etc.

Audit post-C1 :
- Le contenu texte est typé et intégré au TS — bonne ergonomie de dev mais bloque l'i18n
- Les types stricts (`Service`, `Pole`, `Project`, `Secteur`) imposent FR partout
- Aucune i18n possible tant que ces fichiers ne sont pas refactor

C2 résout ça avec une approche **hybride** validée :
- Le `.ts` garde la **structure typée** (slug/icon/color/image/etc.)
- Les champs **texte** vont dans `fr.json` et sont lus par les composants via `useTranslations`/`useMessages`

## 2. Objectifs et critères d'acceptation

### Objectifs

1. Extraire tout le contenu texte FR des 5 fichiers data sources vers `src/i18n/messages/fr.json`.
2. Préserver la structure d'array typé (`SERVICES`, `POLES`, etc.) avec ses champs structurels (slug, icon, color, image, etc.).
3. Adapter les composants consumers pour lookuper le texte via i18n par `id` ou `slug`.
4. EN/AR restent verbatim FR (traduction réelle = C3).
5. Aucune régression visuelle sur `/fr/*` — pages identiques avant/après.
6. Préserver tests existants (`data.test.ts` adapté), build clean.

### Critères d'acceptation

- ✅ Les 5 fichiers data ont leurs champs texte retirés au profit d'un lookup i18n par `id`/`slug`.
- ✅ Interfaces `Pole`, `Service`, `Project`, `Secteur` réduites aux champs structurels.
- ✅ `fr.json` enrichi de `poles.items.*`, `services.items.*`, `projects.items.*`, `secteurs.items.*`, `formations.defaults.*`.
- ✅ `en.json` et `ar.json` byte-identiques à `fr.json`.
- ✅ Composants consumers adaptés (lookup texte via `useTranslations`/`useMessages` ou helper `useDataMessages`).
- ✅ `tests/unit/data.test.ts` adapté (assertions sur champs structurels uniquement).
- ✅ `tests/e2e/content-fr-snapshot.spec.ts` étendu avec pages détail (`/fr/poles/<slug>`, `/fr/secteurs/<slug>`, etc.).
- ✅ Tous tests passent, build clean 110+ pages.
- ✅ Lighthouse SEO + Accessibility sur `/fr/` ≥ scores baseline C1 (pas de régression).

## 3. Décisions de cadrage

| Sujet | Décision | Justification |
|---|---|---|
| Branche | Poursuite `feat/i18n-architecture` | Cohérent avec A+B+C1, un seul PR final |
| Approche | Hybride (structure typée en `.ts` + texte en dictionnaire) | Recommandation user. Préserve type safety + ergonomie, centralise texte pour traduction |
| Lookup | `useTranslations`/`useMessages` selon complexité | API standard next-intl. `useMessages` pour arrays imbriqués, `useTranslations` pour champs scalaires |
| Helper réutilisable | `src/i18n/data-i18n.ts` avec `useDataMessages` typé | Optionnel mais DRY pour les cas avec arrays (services, secteurs) |
| Phasage | 5 batches (1 par fichier source), commit autonome par batch | Diff reviewable par batch ; rollback ciblé possible |
| Hors-scope | Traduction EN/AR réelle, Shopify, perf | Reportés à C3, C4, sous-projet D |

## 4. Architecture

### 4.1 Pattern de migration hybride

**Avant** (`src/lib/data/poles.ts` extrait) :

```ts
export interface Pole {
  id: string;
  n: string;
  number: string;
  title: string;
  titleWithBreaks: string;
  tagline: string;
  tag: string;
  description: string;
  desc: string;
  color: string;
  icon: LucideIcon;
  image: string;
  img: string;
  href: string;
  stats: { left: string; leftLabel: string; right: string; rightLabel: string };
}

export const POLES: Pole[] = [
  {
    id: "developpement-technologique",
    n: "01", number: "01",
    title: "Développement Technologique",
    titleWithBreaks: "Pôle\nDéveloppement\nTechnologique",
    tagline: "L'excellence technique au service de vos ambitions",
    tag: "Ingénierie",
    description: "Conception et déploiement de solutions technologiques sur mesure...",
    desc: "Solutions sur mesure, plateformes robustes et développement logiciel...",
    color: "#D35400",
    icon: Code,
    image: "/images/poles/pole-it.jpg",
    img: "/images/poles/pole-it.jpg",
    href: "/poles/developpement-technologique",
    stats: { left: "Sur-mesure", leftLabel: "Ingénierie", right: "Performance", rightLabel: "Robustesse" }
  },
  // ...
];
```

**Après** — `src/lib/data/poles.ts` (réduit à la structure) :

```ts
export interface Pole {
  id: string;       // utilisé comme clé i18n
  n: string;        // numéro affiché ("01"/"02"/"03" — non traduisible)
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
  // ...
];
```

**Et** `src/i18n/messages/fr.json` (extension du namespace `poles`) :

```json
"poles": {
  "index": { /* existant depuis C1 */ },
  "items": {
    "developpement-technologique": {
      "title": "Développement Technologique",
      "titleWithBreaks": "Pôle\nDéveloppement\nTechnologique",
      "tagline": "L'excellence technique au service de vos ambitions",
      "tag": "Ingénierie",
      "description": "Conception et déploiement de solutions technologiques sur mesure...",
      "desc": "Solutions sur mesure, plateformes robustes...",
      "stats": {
        "left": "Sur-mesure", "leftLabel": "Ingénierie",
        "right": "Performance", "rightLabel": "Robustesse"
      }
    },
    "conseil-strategie-it": { /* ... */ },
    "formation": { /* ... */ }
  }
}
```

### 4.2 Gestion des arrays imbriqués

`services.ts` a des arrays imbriqués (`subs: ServiceSub[]`, `benefits: string[]`, `deliverables: string[]`). Stockage dans JSON :

```json
"services": {
  "items": {
    "ingenierie-logicielle": {
      "title": "Ingénierie Logicielle\n& Développement de Solutions\nMétiers & Mobiles",
      "tagline": "Des applications qui parlent africain",
      "intro": "La transformation digitale et la généralisation du mobile redéfinissent...",
      "subs": [
        { "title": "Applications Web & Mobiles « African-Ready »", "desc": "..." },
        { "title": "Logiciels Métiers Spécifiques", "desc": "..." }
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

next-intl supporte les arrays via `useMessages()` (accès à l'objet entier) ou `t.raw()` (contourne le typage). On préfère `useMessages` car typable.

### 4.3 Pattern de lookup côté composants

**Pattern A — Champs scalaires** (`useTranslations`) :

```tsx
"use client";
import { POLES } from "@/lib/data/poles";
import { useTranslations } from "next-intl";

export function PolesList() {
  const t = useTranslations("poles.items");

  return (
    <ul>
      {POLES.map((pole) => (
        <li key={pole.id} style={{ color: pole.color }}>
          <span>{pole.n}</span>
          <h3>{t(`${pole.id}.title`)}</h3>
          <p>{t(`${pole.id}.tagline`)}</p>
        </li>
      ))}
    </ul>
  );
}
```

**Pattern B — Champs avec arrays imbriqués** (`useMessages`) :

```tsx
"use client";
import { SERVICES } from "@/lib/data/services";
import { useMessages } from "next-intl";

type ServiceI18n = {
  title: string;
  tagline: string;
  intro: string;
  subs: Array<{ title: string; desc: string }>;
  benefits: string[];
  deliverables: string[];
};

export function ServiceDetail({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return null;

  const messages = useMessages() as { services: { items: Record<string, ServiceI18n> } };
  const i18n = messages.services.items[slug];

  return (
    <article style={{ background: service.bg }}>
      <h1 style={{ whiteSpace: "pre-line" }}>{i18n.title}</h1>
      <p>{i18n.tagline}</p>
      <p>{i18n.intro}</p>
      <ul>
        {i18n.subs.map((sub, idx) => (
          <li key={idx}>
            <h3>{sub.title}</h3>
            <p>{sub.desc}</p>
          </li>
        ))}
      </ul>
      <h4>Bénéfices</h4>
      <ul>
        {i18n.benefits.map((b, idx) => <li key={idx}>{b}</li>)}
      </ul>
    </article>
  );
}
```

**Pattern C — Server Components** : `getMessages()` et `getTranslations()` à la place de leurs hooks.

### 4.4 Helper réutilisable (optionnel)

`src/i18n/data-i18n.ts` (à créer pour éviter le cast répété) :

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

export type ServiceI18n = {
  title: string;
  tagline: string;
  intro: string;
  subs: Array<{ title: string; desc: string }>;
  benefits: string[];
  deliverables: string[];
};

export type ProjectI18n = {
  title: string;
  tagline?: string;
  description: string;
  results: string[];
  challenges: string[];
  // ... à compléter selon Project interface
};

export type SecteurI18n = {
  label: string;
  tagline: string;
  description: string;
  services: string[];
  chiffre?: { value: string; label: string };
};

type DataMessages = {
  poles:    { items: Record<string, PoleI18n> };
  services: { items: Record<string, ServiceI18n> };
  projects: { items: Record<string, ProjectI18n> };
  secteurs: { items: Record<string, SecteurI18n> };
};

export function useDataMessages(): DataMessages {
  return useMessages() as DataMessages;
}

export async function getDataMessages(): Promise<DataMessages> {
  return (await getMessages()) as DataMessages;
}
```

Usage simplifié :

```tsx
import { useDataMessages } from "@/i18n/data-i18n";
const msg = useDataMessages();
const i18n = msg.services.items[slug];
```

### 4.5 Namespaces par fichier source

| Fichier source | Namespace cible |
|---|---|
| `poles.ts` | `poles.items.<id>` |
| `services.ts` | `services.items.<slug>` |
| `projects.ts` | `projects.items.<id>` |
| `secteurs-data.ts` | `secteurs.items.<slug>` |
| `formation-defaults.ts` | `formations.defaults.*` |

## 5. Stratégie de migration progressive

5 batches, 1 par fichier source.

**Batch 1 — `poles.ts`** (le plus petit, 3 pôles)
- Extraire texte → `poles.items.*`
- Réduire interface `Pole`
- Adapter consumers : `PolesIndexShell`, `PoleConseilShell`, `PoleDeveloppementShell`, `PolesSection` (home), `Header` (si POLES y est référencé)
- Smoke : `/fr/poles` rend les 3 pôles identiques

**Batch 2 — `secteurs-data.ts`** (~5-7 secteurs)
- Extraire → `secteurs.items.*`
- Réduire interface `Secteur` (champ `services: string[]` aussi externalisé)
- Adapter consumers : `SecteursShell`, `SecteurDetailShell`
- Smoke : `/fr/secteurs` + `/fr/secteurs/<slug>`

**Batch 3 — `projects.ts`** (projets clients)
- Extraire → `projects.items.*` (arrays `results`, `challenges`, `tags` aussi)
- Réduire interface `Project`
- Adapter consumers : `RealisationsShell`, `ProjectDetailShell`, `ProjectsSection` (home)
- Smoke : `/fr/projects` + `/fr/projects/<slug>`

**Batch 4 — `services.ts`** (le plus gros, 388 lignes)
- Extraire → `services.items.*` (avec subs[], benefits[], deliverables[])
- Réduire interface `Service`
- Adapter consumers : `ServicesGrid`, `ServiceDetailShell`, `ServicesShell`, `ServicesIntroShell`, `PoleIngenieurieShell`, `PoleConseilShell`, `PoleFormationShell`, `PolesSection`
- Smoke : `/fr/services` + `/fr/services/<slug>`

**Batch 5 — `formation-defaults.ts`**
- Extraire → `formations.defaults.*`
- Adapter consumers : `FormationDetailShell` (lit ces defaults pour fallback Shopify)
- Smoke : `/fr/formations/<slug>` rend toujours la fiche (defaults appliqués en fallback)

**Optionnel — Helper hook** : créer `src/i18n/data-i18n.ts` après le Batch 1 (validation du pattern sur un petit batch). Les batches 2-5 utilisent alors le helper.

**Entre chaque batch** :
1. `npx tsc --noEmit` — les TS errors sur consumers indiquent les endroits à migrer
2. `npm run build` clean
3. Smoke curl sur la page affectée
4. Visual check browser sur 1 page
5. Re-copie `fr.json` → `en.json` + `ar.json` (verbatim)
6. Commit autonome par batch

## 6. Plan de tests

### 6.1 Tests existants à vérifier

- **`tests/unit/data.test.ts`** — IMPORTANT : ce test valide la cohérence des arrays POLES/SERVICES/PROJECTS (slugs uniques, couleurs hex valides, etc.). Après migration, les assertions sur champs texte (ex. `title: "..."`) ne passeront plus. **Action** : adapter les assertions pour ne valider que les champs structurels (slug unique, color valide, icon non vide, image présente, etc.). Retirer les assertions sur title/description/tagline.
- **`tests/unit/i18n/*.test.ts`** — inchangé (les tests seo/sitemap/routing/LanguageSwitcher ne dépendent pas de la data).
- **`tests/e2e/content-fr-snapshot.spec.ts`** — doit continuer à passer.

### 6.2 Extension du snapshot E2E

Ajouter au `tests/e2e/content-fr-snapshot.spec.ts` quelques pages détail :

```ts
const DETAIL_PAGES = [
  { path: "/fr/poles/developpement-technologique", contains: ["Développement Technologique"] },
  { path: "/fr/poles/conseil-strategie-it", contains: ["Conseil"] },
  { path: "/fr/poles/formation", contains: ["Formation"] },
  { path: "/fr/secteurs/industrie", contains: ["Industrie"] },
  { path: "/fr/services/ingenierie-logicielle", contains: ["Ingénierie Logicielle"] },
];
```

Ces tests garantissent que le lookup i18n par slug fonctionne correctement.

### 6.3 Vérifications par batch (smoke curl)

- Batch 1 : `curl /fr/poles | grep "Développement Technologique"` retourne le titre
- Batch 2 : `curl /fr/secteurs | grep -oE "<h2[^>]*>[^<]+</h2>" | head -3`
- Batch 3 : `curl /fr/projects` rend la liste sans 404
- Batch 4 : `curl /fr/services` rend 9 services + `curl /fr/services/ingenierie-logicielle | grep "Bénéfices"` (ou label équivalent)
- Batch 5 : `curl /fr/formations/<slug>` rend toujours la fiche

### 6.4 Validation Lighthouse

Après chaque batch sur `/fr/` :
- SEO ≥ score baseline C1 (≥95)
- Accessibility ≥ score baseline (≥90)

Perf et Best Practices : peu impactés (refactor de string lookup, pas de changement de bundle).

## 7. Risques et points d'attention

| Risque | Mitigation |
|---|---|
| Régression visuelle sur `/fr/<page>` après un batch | Smoke curl + visual browser entre chaque ; commit autonome permet rollback ciblé |
| `useMessages()` retourne `unknown` → cast obligatoire | Helper `useDataMessages()` typé centralise le cast |
| Consumers oubliés (composant qui accède toujours à `pole.title`) | TS errors signalent immédiatement ; chaque batch fait `tsc --noEmit` avant commit |
| Arrays imbriqués (`subs`, `benefits`) mal mappés | `useMessages()` préserve la structure ; tests E2E sur pages détail vérifient les bullets affichés |
| Adaptation `data.test.ts` trop agressive | Garder les assertions structurelles (slug unique, color valide) ; retirer seulement celles qui valident des chaînes texte |
| Volume du Batch 4 (`services.ts`, 388 lignes × 9 services × 4-5 arrays) | C'est le gros morceau — prévoir ~30% du temps total de C2 pour ce batch ; revue dédiée |
| Performance lookup `useMessages` à chaque render | next-intl mémoize côté hook ; pas de bottleneck attendu sur les pages statiques actuelles |

## 8. Livrables

**Fichiers créés (optionnel)** :
- `src/i18n/data-i18n.ts` — helper `useDataMessages` + types par entité (PoleI18n, ServiceI18n, etc.)

**Fichiers modifiés** :
- `src/lib/data/poles.ts` — interface réduite + champs texte retirés
- `src/lib/data/services.ts` — idem
- `src/lib/data/projects.ts` — idem
- `src/lib/data/formation-defaults.ts` — idem
- `src/lib/secteurs-data.ts` — idem
- `src/i18n/messages/fr.json` — extension `poles.items`, `services.items`, `projects.items`, `secteurs.items`, `formations.defaults`
- `src/i18n/messages/en.json` — copie verbatim
- `src/i18n/messages/ar.json` — copie verbatim
- **Composants consumers** (impact identifié par TS errors au batch — typiquement les Shells de chaque domaine) : adaptation au pattern `useTranslations`/`useMessages` ou helper
- `tests/unit/data.test.ts` — assertions sur champs texte retirées (préservation assertions structurelles)
- `tests/e2e/content-fr-snapshot.spec.ts` — extension avec pages détail

## 9. Hors-scope

**Reporté à C3 (Traduction réelle)** :
- Remplacer les valeurs verbatim FR dans `en.json` et `ar.json` namespace `*.items.*` par de vraies traductions EN puis AR
- Méthode (humain pro / IA / mix), workflow validation native AR

**Reporté à C4 (Shopify multi-langue)** :
- Activation de Shopify Markets ou metafields multi-langues
- Formations + articles blog en EN / AR depuis Shopify

**Reporté à C5 (QA finale)** :
- Audit Lighthouse en EN et AR (pas seulement FR)
- Polish RTL fin des animations Framer
- Audit qualité traductions par locuteurs natifs

**Reporté au sous-projet D (post-C)** :
- Performance Lighthouse 35 → ≥90
- Best Practices 54 → ≥90
- Symétrie typographique navbar
- Remplacer `<select>` LanguageSwitcher par bouton globe (cycle au clic)
