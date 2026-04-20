# Migration Landing Page Formation — Cartographie des donnees

Ce document fait le parallele entre les donnees utilisees dans la landing HTML statique
(`docs/Landing Formation IA.html`) et celles disponibles dans le shell produit actuel
(`FormationDetailShell.tsx` via `ShopifyFormationDetail`).

L'objectif : identifier ce qui est deja exploitable, ce qui doit etre ajoute cote Shopify,
et ce qui releve du contenu statique / config locale.

---

## 1. Donnees deja disponibles (Shopify → shell)

Ces champs existent dans `ShopifyFormationDetail` et sont directement utilisables
pour alimenter la landing.

| Donnee landing | Champ Shopify actuel | Metafield / source | Exemple landing |
|---|---|---|---|
| Titre formation | `title` | `product.title` | "Integrer l'IA dans sa pratique professionnelle" |
| Slug / handle | `slug` | `product.handle` | `integrer-ia-pratique-pro` |
| Accroche / sous-titre | `accroche` | `custom.accroche` | "Le programme qui transforme votre quotidien..." |
| Duree | `duree` | `custom.duree` | "2 jours · 14h" |
| Format | `format` | `custom.format` | "Presentiel + live" |
| Niveau | `niveau` | `custom.niveau` | "Tous niveaux" |
| Secteur | `secteur` | `custom.secteur` | — |
| Categorie | `categorie` | `custom.categorie` | — |
| Prix (min variant) | `prix` | `priceRange.minVariantPrice` | "4 900 MAD HT" |
| Public cible | `publicCible` | `custom.public_cible_act` | "Dirigeants, Managers, Marketing..." |
| Prerequis | `prerequis` | `custom.prerequis_` | "Aucun prerequis technique" |
| Objectifs pedagogiques | `objectifs[]` | `custom.Objectifs_pedagogiques` | Liste de 4-6 objectifs |
| Programme (modules) | `programme[]` | `custom.programme` | Modules avec details |
| Livrables | `livrables[]` | `custom.livrables` | "Support de cours", "Attestation"... |
| Methode pedagogique | `methode` | `custom.methode` | — |
| Images | `images[]` | `product.images` | Jusqu'a 10 images |
| Description HTML | `descriptionHtml` | `product.descriptionHtml` | Rich text Shopify |
| Parcours | `parcours` | `custom.parcours` | — |

---

## 2. Donnees presentes dans la landing MAIS absentes de Shopify

Ces champs sont hardcodes dans la landing HTML. Il faut decider pour chacun :
**(A)** l'ajouter comme metafield Shopify, **(B)** le stocker dans un fichier config local,
ou **(C)** le laisser statique dans le composant.

### 2.1 — Pricing & Urgence

| Donnee | Valeur dans la landing | Source recommandee | Raison |
|---|---|---|---|
| **Prix early bird** | `4 900 MAD HT` | **(A)** Metafield `custom.prix_early_bird` | Varie par formation |
| **Prix barre (ancien prix)** | `6 500 MAD HT` | **(A)** Metafield `custom.prix_barre` ou `compareAtPrice` Shopify natif | Shopify a deja `compareAtPrice` sur les variants |
| **Reduction affichee** | `-25%` | Calcule (`1 - prix/prix_barre`) | Pas besoin de stocker |
| **Date limite early bird** | `5 jours` (countdown) | **(A)** Metafield `custom.date_limite_early_bird` (date ISO) | Varie par session |
| **Places totales** | `12` | **(A)** Metafield `custom.places_totales` | Varie par session |
| **Places prises** | `7` (7/12) | **(A)** Metafield `custom.places_prises` ou calcule via Draft Orders | Doit etre mis a jour |
| **Session date** | "Avril 2026" | **(A)** Metafield `custom.prochaine_session` | Varie |
| **Session lieu** | "Casablanca" | **(A)** Metafield `custom.lieu_session` | Varie |
| **Statut inscriptions** | "Inscriptions ouvertes" | **(A)** Metafield `custom.statut_inscriptions` | `ouvertes` / `bientot` / `complet` |

### 2.2 — Formules tarifaires (Pricing grid)

La landing propose 3 formules. Cela n'existe pas dans le modele Shopify actuel.

| Donnee | Valeur landing | Source recommandee |
|---|---|---|
| **Nombre de formules** | 3 (Essentiel / Pro / Intra) | **(A)** Variants Shopify (1 variant = 1 formule) OU **(B)** Metafield JSON `custom.formules` |
| **Nom formule** | "Essentiel", "Pro · Presentiel", "Intra · Equipe" | Idem |
| **Prix par formule** | 3 200 / 4 900 / Sur devis | Idem |
| **Prix barre par formule** | 4 200 / 6 500 / — | Idem |
| **Features par formule** | Liste de 6-7 bullet points | Idem |
| **Formule mise en avant** | "Pro" (featured) | Idem |
| **Badge formule** | "Le plus choisi" | Idem |

**Format JSON recommande pour `custom.formules` :**

```json
{
  "formules": [
    {
      "nom": "Essentiel",
      "sousTitre": "En distanciel live · petit groupe",
      "prix": 3200,
      "prixBarre": 4200,
      "devise": "MAD HT",
      "featured": false,
      "badge": null,
      "features": [
        "2 jours · 14h de live",
        "Jusqu'a 12 participants",
        "Tous les templates & prompts",
        "Agent GPT personnalise",
        "Certification ACT",
        "Acces replay 6 mois"
      ],
      "ctaLabel": "Reserver ma place",
      "ctaVariant": "ghost"
    },
    {
      "nom": "Pro",
      "sousTitre": "A Casablanca · 2 jours en presentiel",
      "prix": 4900,
      "prixBarre": 6500,
      "devise": "MAD HT",
      "featured": true,
      "badge": "Le plus choisi",
      "features": [
        "Tout ce qui est dans Essentiel",
        "Formation en presentiel",
        "1h de coaching 1-to-1 post-formation",
        "Audit de vos taches (avant J1)",
        "Suivi prive Slack · 30 jours",
        "Session Q&R live a J+30",
        "Dejeuners inclus"
      ],
      "ctaLabel": "Reserver · -25%",
      "ctaVariant": "primary"
    },
    {
      "nom": "Intra · Equipe",
      "sousTitre": "Dans vos locaux · sur-mesure · a partir de 6 personnes",
      "prix": null,
      "prixBarre": null,
      "devise": null,
      "featured": false,
      "badge": null,
      "features": [
        "Programme sur-mesure · votre secteur",
        "Vos cas metier reels en atelier",
        "Audit IA des process avant demarrage",
        "Formation de formateurs en option",
        "Rapport de recommandations post-formation",
        "Suivi 90 jours inclus"
      ],
      "ctaLabel": "Demander un devis",
      "ctaVariant": "ghost"
    }
  ]
}
```

### 2.3 — Pain points (section probleme)

| Donnee | Valeur landing | Source recommandee |
|---|---|---|
| **Titre section** | "L'IA va tout changer..." | **(A)** Metafield `custom.pain_intro` (texte) OU **(C)** Statique |
| **3 pain cards** | Titre + description + image | **(A)** Metafield JSON `custom.pain_points` OU **(C)** Statique |

**Format JSON recommande pour `custom.pain_points` :**

```json
[
  {
    "titre": "Submerge par les outils ?",
    "description": "ChatGPT, Claude, Gemini, Copilot...",
    "imageUrl": "https://images.unsplash.com/photo-..."
  }
]
```

> **Verdict** : **(C)** statique est probablement suffisant ici. Les pain points sont
> generiques et ne changent pas par formation. On peut les hardcoder dans le composant
> ou les mettre dans un fichier `src/lib/data/landing-content.ts`.

### 2.4 — Value / Benefices

| Donnee | Valeur landing | Source recommandee |
|---|---|---|
| **6 benefices** | Titre + description chacun | **(A)** Metafield JSON `custom.benefices` OU derives de `objectifs` + `livrables` |
| **Stat ROI principale** | "10h recuperees / semaine" | **(A)** Metafield `custom.stat_roi` OU **(C)** Statique |
| **Stats secondaires** | "x4 vitesse redaction", "-60% temps d'analyse" | **(A)** Metafield JSON `custom.stats_secondaires` OU **(C)** Statique |

> **Verdict** : Les stats ROI sont marketing et generiques → **(C)** statique.
> Les benefices peuvent etre derives des `objectifs` existants.

### 2.5 — Outils couverts

| Donnee | Valeur landing | Source recommandee |
|---|---|---|
| **Liste d'outils** | ChatGPT, Claude, Gemini, Perplexity, Copilot, Notion AI, Gamma, Midjourney, Zapier, Make, n8n... | **(A)** Metafield JSON `custom.outils_couverts` OU **(B)** Config locale |

**Format JSON recommande pour `custom.outils_couverts` :**

```json
["ChatGPT", "Claude", "Gemini", "Perplexity", "Copilot 365", "Notion AI", "Gamma", "Midjourney"]
```

> **Verdict** : **(A)** metafield si les outils varient par formation. **(C)** statique si commun a toutes.

### 2.6 — Testimonials / Avis

| Donnee | Valeur landing | Source recommandee |
|---|---|---|
| **Temoignages** (3) | Citation + nom + role + ville + avatar | **(B)** Fichier local `src/lib/data/testimonials.ts` OU **(A)** Metafield JSON `custom.temoignages` |
| **Stats globales** | "+400 pros formes", "4,9/5", "97% recommandent", "32 entreprises" | **(B)** Fichier local `src/lib/data/social-proof.ts` OU **(C)** Statique |

**Format JSON recommande pour `custom.temoignages` :**

```json
[
  {
    "citation": "J'ai divise par trois le temps...",
    "nom": "Samira Bennani",
    "role": "Directrice Marketing",
    "ville": "Casablanca",
    "note": 5,
    "avatarUrl": "https://..."
  }
]
```

> **Verdict** : **(B)** fichier local. Les temoignages sont transverses (pas par formation)
> et n'ont pas besoin d'etre edites depuis Shopify.

### 2.7 — FAQ

| Donnee | Valeur landing | Source recommandee |
|---|---|---|
| **Questions/Reponses** (7) | Question + reponse texte | **(A)** Metafield JSON `custom.faq` OU **(B)** Fichier local |

**Format JSON recommande pour `custom.faq` :**

```json
[
  {
    "question": "Je suis debutant total. Est-ce que je vais suivre ?",
    "reponse": "Oui — cette formation est concue pour les profils non-techniques..."
  }
]
```

> **Verdict** : **(A)** metafield si la FAQ varie par formation (probable).
> **(B)** fichier local si c'est la meme FAQ pour toutes les formations.

### 2.8 — Trust / Certifications

| Donnee | Valeur landing | Source recommandee |
|---|---|---|
| **Certification** | "Qualiopi" | **(C)** Statique (global ACT) |
| **Eligible CPF** | oui | **(A)** Metafield boolean `custom.eligible_cpf` |
| **Eligible OPCO** | oui | **(A)** Metafield boolean `custom.eligible_opco` |
| **Paiement 3x** | oui | **(C)** Statique |
| **Garantie** | "Satisfait ou rembourse" | **(C)** Statique |

---

## 3. Donnees du programme — comparaison des structures

### Structure actuelle (Shopify metafield `custom.programme`)

```json
[
  {
    "module": "Cartographier l'IA pour son metier",
    "details": [
      "Panorama 2026 : generative, agentique, RAG, multimodale",
      "Le bon outil pour chaque tache"
    ]
  }
]
```

### Structure dans la landing (plus riche)

```
Jour 1 · Matin · 3h30       ← creneau temporel
Module 01                     ← numero
Cartographier l'IA...        ← titre module
4 bullet points              ← details
```

### Structure recommandee (enrichie)

```json
[
  {
    "module": "Cartographier l'IA pour son metier",
    "creneau": "Jour 1 · Matin · 3h30",
    "details": [
      "Panorama 2026 : generative, agentique, RAG, multimodale",
      "Le bon outil pour chaque tache (decisionnel visuel)",
      "Audit de vos taches chronophages — atelier individuel",
      "Plan de deploiement personnel"
    ]
  }
]
```

Le champ `creneau` est optionnel. S'il est absent, on affiche juste "Module 01", "Module 02", etc.
Le champ `duree` existe deja dans le type TS (`duree?: string`) mais n'est pas dans la query Shopify.

---

## 4. Nouveaux metafields Shopify a creer

Voici la liste consolidee des metafields a ajouter dans Shopify
(namespace `custom`) pour couvrir toutes les donnees de la landing.

### Priorite haute (necessaires pour la landing)

| Cle metafield | Type Shopify | Description |
|---|---|---|
| `prochaine_session` | `single_line_text` | "Avril 2026" |
| `lieu_session` | `single_line_text` | "Casablanca" |
| `places_totales` | `number_integer` | 12 |
| `places_prises` | `number_integer` | 7 |
| `statut_inscriptions` | `single_line_text` | "ouvertes" / "bientot" / "complet" |
| `date_limite_early_bird` | `date` | "2026-04-25" |
| `formules` | `json` | Objet JSON des 3 formules (voir format 2.2) |
| `faq` | `json` | Tableau JSON question/reponse |
| `certification` | `single_line_text` | "ACT + Qualiopi" |

### Priorite moyenne (enrichissement)

| Cle metafield | Type Shopify | Description |
|---|---|---|
| `outils_couverts` | `json` | `["ChatGPT", "Claude", ...]` |
| `benefices` | `json` | Tableau de {titre, description} |
| `pain_points` | `json` | Tableau de {titre, description, imageUrl} |
| `temoignages` | `json` | Tableau de {citation, nom, role, note, avatarUrl} |
| `eligible_cpf` | `boolean` | true/false |
| `eligible_opco` | `boolean` | true/false |

### Priorite basse (deja exploitable autrement)

| Cle metafield | Type Shopify | Description |
|---|---|---|
| `stats_roi` | `json` | `{"principal": "10h", "label": "recuperees / semaine", "secondaires": [...]}` |
| `prix_early_bird` | `number_decimal` | Alternative a `compareAtPrice` natif |

> **Note** : `compareAtPrice` est natif sur les variants Shopify. Il vaut mieux utiliser
> ce champ pour le prix barre plutot que de creer un metafield custom.

---

## 5. Donnees statiques (fichier local recommande)

Ces donnees ne changent pas par formation et ne necessitent pas Shopify.

### `src/lib/data/landing-static.ts`

```ts
/** Contenu statique partage entre toutes les landing pages formation */

export const SOCIAL_PROOF = {
  prosFormes: "+400",
  noteAverage: "4,9/5",
  tauxRecommandation: "97%",
  entreprisesClientes: "32",
};

export const MARQUEE_ITEMS = [
  "Formation certifiee Qualiopi",
  "+400 professionnels formes",
  "Note 4,9/5 sur 213 avis",
  "Financable CPF & OPCO",
  "Satisfait ou rembourse",
  "97% recommandent",
];

export const TRUST_BADGES = {
  qualiopi: true,
  cpf: "Eligible CPF · OPCO · Formation professionnelle",
  paiement3x: "Paiement en 3x sans frais",
  garantie: "Garantie satisfait ou rembourse",
};

export const DEFAULT_TESTIMONIALS = [
  {
    citation: "J'ai divise par trois le temps que je passe sur mes comptes-rendus hebdo.",
    nom: "Samira Bennani",
    role: "Directrice Marketing · Casablanca",
    note: 5,
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  },
  // ...
];
```

---

## 6. Mise a jour de la query GraphQL

La query `PRODUCT_BY_HANDLE_QUERY` dans `src/lib/shopify/formations.ts` doit etre
enrichie pour recuperer les nouveaux metafields.

### Metafields a ajouter dans `identifiers`

```graphql
{ namespace: "custom", key: "prochaine_session" }
{ namespace: "custom", key: "lieu_session" }
{ namespace: "custom", key: "places_totales" }
{ namespace: "custom", key: "places_prises" }
{ namespace: "custom", key: "statut_inscriptions" }
{ namespace: "custom", key: "date_limite_early_bird" }
{ namespace: "custom", key: "formules" }
{ namespace: "custom", key: "faq" }
{ namespace: "custom", key: "outils_couverts" }
{ namespace: "custom", key: "certification" }
{ namespace: "custom", key: "eligible_cpf" }
{ namespace: "custom", key: "eligible_opco" }
```

### Champ `compareAtPrice` a ajouter

```graphql
priceRange {
  minVariantPrice { amount currencyCode }
}
compareAtPriceRange {
  maxVariantPrice { amount currencyCode }
}
```

### Type TS a etendre (`ShopifyFormationDetail`)

```ts
export interface ShopifyFormationDetail extends ShopifyFormationCard {
  // ... champs existants ...

  // Nouveaux champs landing
  prochaineSession?: string;
  lieuSession?: string;
  placesTotales?: number;
  placesPrises?: number;
  statutInscriptions?: "ouvertes" | "bientot" | "complet";
  dateLimiteEarlyBird?: string;
  prixBarre?: string;
  formules?: {
    nom: string;
    sousTitre: string;
    prix: number | null;
    prixBarre: number | null;
    devise: string | null;
    featured: boolean;
    badge: string | null;
    features: string[];
    ctaLabel: string;
    ctaVariant: "primary" | "ghost";
  }[];
  faq?: { question: string; reponse: string }[];
  outilsCouverts?: string[];
  certification?: string;
  eligibleCpf?: boolean;
  eligibleOpco?: boolean;
}
```

---

## 7. Resume : d'ou vient chaque section

| Section landing | Source donnees | Priorite |
|---|---|---|
| Barre urgence (countdown) | `date_limite_early_bird` + `prochaine_session` + `lieu_session` | Haute |
| Hero titre + accroche | `title` + `accroche` (existe) | Existe |
| Hero product card | `prix` + `compareAtPrice` + `places_*` + `statut_inscriptions` | Haute |
| Hero trust stats | `landing-static.ts` SOCIAL_PROOF | Statique |
| Marquee | `landing-static.ts` MARQUEE_ITEMS | Statique |
| Pain points | `landing-static.ts` ou `custom.pain_points` | Basse |
| Value / Benefices | Derive de `objectifs` + `livrables` ou `custom.benefices` | Moyenne |
| Outils couverts | `custom.outils_couverts` ou statique | Moyenne |
| Programme | `custom.programme` (existe, enrichir avec `creneau`) | Existe (enrichir) |
| Mid CTA | `prochaine_session` + `places_*` | Haute |
| Pour qui | `publicCible` (existe) | Existe |
| Testimonials | `landing-static.ts` DEFAULT_TESTIMONIALS | Statique |
| Pricing grid | `custom.formules` | Haute |
| FAQ | `custom.faq` | Haute |
| CTA final | `places_*` + statique | Mix |
| Trust (CPF, OPCO, garantie) | `eligible_cpf` + `eligible_opco` + statique | Moyenne |

---

## 8. Ordre d'implementation recommande

1. **Creer les metafields Shopify** priorite haute (session, places, formules, faq)
2. **Enrichir la query GraphQL** + type TS
3. **Creer `src/lib/data/landing-static.ts`** pour le contenu transversal
4. **Migrer le composant** section par section (hero → pricing → FAQ → reste)
5. **Tester** avec une formation reelle qui a les metafields remplis
6. **Fallback** : si un metafield est vide, ne pas afficher la section (graceful degradation)
