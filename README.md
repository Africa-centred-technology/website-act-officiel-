# Africa Centred Technology — Site Web Officiel

Site vitrine et catalogue de formations d'**ACT** (Africa Centred Technology), une entreprise qui fusionne intelligence artificielle et ingénierie de pointe pour propulser les entreprises africaines au sommet de l'innovation mondiale.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 · TypeScript |
| Style | Tailwind CSS v4 · CSS variables |
| Animations | Framer Motion · GSAP |
| 3D | Three.js · React Three Fiber (R3F) |
| Catalogue formations | Shopify Storefront API (GraphQL) |
| Inscriptions | Shopify Admin API (Draft Orders) |
| Formulaires | react-hook-form · zod |
| E-mail | Resend |

---

## Démarrage rapide

### Prérequis

- Node.js ≥ 18
- Compte Shopify avec accès Storefront + Admin

### Installation

```bash
git clone <repo-url>
cd website-act-officiel-
npm install
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
SHOPIFY_STORE_DOMAIN=act-formation.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token storefront>
SHOPIFY_ADMIN_ACCESS_TOKEN=<shpat_... ou secret OAuth>
SHOPIFY_CLIENT_ID=<client ID, uniquement pour le flux OAuth>

```

> Les variables peuvent aussi être préfixées `NEXT_PUBLIC_` pour un accès côté client.

### Commandes

```bash
npm run dev          # Serveur de développement
npm run dev:turbo    # Serveur de développement (Turbopack — plus rapide)
npm run build        # Build de production
npm run start        # Lancer la build de production
```

> Il n'y a pas de scripts de lint ou de test configurés. ESLint est désactivé pendant les builds.

---

## Architecture

### Structure des pages

Chaque route suit le même schéma :

```
src/app/<route>/page.tsx          → thin wrapper (metadata + import)
src/components/<route>/Shell.tsx  → layout, data fetching, composition
src/components/<route>/<Section>  → composants de section individuels
```

### Routes disponibles

| URL | Description |
|---|---|
| `/` | Page d'accueil — parcours immersif 7 salles |
| `/formations` | Catalogue des formations (live Shopify) |
| `/formations/[slug]` | Détail d'une formation |
| `/poles` | Les 3 pôles métiers d'ACT |
| `/services` | Détail des 9 services |
| `/secteurs` | Secteurs d'activité |
| `/projects` | Réalisations clients |
| `/about` | À propos d'ACT |
| `/blog` | Articles |
| `/contact` | Formulaire de contact |

### API routes

| Route | Méthode | Rôle |
|---|---|---|
| `/api/shopify/formations` | GET | Toutes les formations Shopify |
| `/api/shopify/formations/[slug]` | GET | Une formation par handle |
| `/api/shopify/inscription` | POST | Crée un Draft Order Shopify |

### Données

**Statiques** — Services, pôles et projets sont définis en TypeScript dans `src/lib/data/` :
- **Pôle I — Ingénierie Technologique** · 5 services · accent `#D35400`
- **Pôle II — Conseil** · 2 services · accent `#F39C12`
- **Pôle III — Formation** · 1 service · accent `#16a34a`


---

## Page d'accueil — Parcours immersif

`src/components/home2/Shell.tsx` implémente un parcours plein écran en 7 salles navigables via :
- Molette de la souris
- Flèches clavier
- Swipe tactile

Throttle entre transitions : **1 300 ms**. Sur mobile (< 900 px) les salles s'empilent verticalement. Les couches de fond (`WaveTerrain`, `Cursor`, `Grain`) sont importées dynamiquement avec `ssr: false`. Les transitions utilisent Framer Motion `AnimatePresence` avec des variantes depth-of-field (blur + scale + y).

---

## Système de thème

`src/contexts/ThemeContext.tsx` expose `dark` / `light` via l'attribut `data-theme` sur `<html>`. Un script inline dans `layout.tsx` lit `localStorage` avant l'hydratation React pour éviter le flash. Les composants utilisent des variables CSS (`--bg-primary`, `--text-primary`, etc.) plutôt que les classes Tailwind dark mode.

