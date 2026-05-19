# Inventaire des images — ACT Website

> Scan complet du 2026-05-19 · 45 images locales · Images distantes via Unsplash & Pixabay

---

## Résumé

| Catégorie | Nombre | État |
|-----------|--------|------|
| Images locales actives | 32 | ✅ OK |
| Images locales orphelines | 10 | ⚠️ Non utilisées |
| Image manquante | 1 | 🔴 CRITIQUE |
| Vidéos distantes (Pixabay) | 8 | ✅ OK |
| Images distantes (Unsplash) | ~30 | ✅ OK |

---

## 1. Images locales actives

### Logo & Identité

| Fichier | Utilisé dans | Rôle |
|---------|-------------|------|
| `/logo/logo.png` | `layout.tsx`, `[locale]/layout.tsx` | Favicon, OG image, apple-touch-icon |
| `/logo/logo_continent.png` | `HeroSection.tsx` | Logo continent — LCP hero home |
| `/Sohaib_baroud_Manifeste.png` | `FormationLandpage.tsx` | Portrait Sohaib — section manifeste formation |
| `/images/Manifeste.png` | `ManifesteSection.tsx` | Image section manifeste home |

### Équipe (`/images/Equipe/`)

| Fichier | Utilisé dans | Membre |
|---------|-------------|--------|
| `/images/Equipe/sohaib_baroud.jpg` | `AboutShell.tsx` | Sohaib Baroud — Fondateur & CEO |
| `/images/Equipe/MPIGA.png` | `AboutShell.tsx` | MPIGA-ODOUMBA JESSE |
| `/images/Equipe/Aldrin.png` | `AboutShell.tsx` | Aldrin Djourobi |

### Services — Hero images (`/images/services/`)

| Fichier | Service | Slug |
|---------|---------|------|
| `/images/services/Ingéneurie_logicielle.jpg` | 01 · Ingénierie Logicielle | `ingenierie-logicielle` |
| `/images/services/Agentic_AI.jpg` | 02 · Automatisation IA | `automatisation-ia` |
| `/images/services/architerture.png` | 03 · Architecture & Infrastructure | `architecture-infrastructure` |
| `/images/services/big-data-and-et-artificial-intelligence.jpg` | 04 · Data & IA | `data-intelligence-artificielle` |
| `/images/services/sig.jpg` | 05 · Géomatique & SIG (hero) | `geomatique-sig` |
| `/images/services/sig-1.jpg` | 05 · Géomatique & SIG (sub) | `geomatique-sig` |

### Pôles (`/images/poles/`)

| Fichier | Service | Rôle |
|---------|---------|------|
| `/images/poles/pole-conseil.jpg` | 06 · Conseil Stratégique & 07 · Conseil Opérationnel | heroImage |
| `/images/poles/pole-formation.jpg` | 09 · Catalogue Formations | heroImage |
| `/images/poles/pole-it.jpg` | Pôle Ingénierie | Shell |
| `/images/poles/pole-it2.jpg` | Pôle Ingénierie | Shell |
| `/images/poles/pole-it3.jpg` | Pôle Ingénierie | Shell |
| `/images/poles/pole-conseil1.jpg` | Pôle Conseil | Shell |
| `/images/poles/pole-formation1.jpg` | Pôle Formation | Shell |

### Blog (`/images/Blog/`)

| Fichier | Utilisé dans | Rôle |
|---------|-------------|------|
| `/images/Blog/reader.png` | `BlogHero.tsx` | Illustration hero blog |

> **Note :** le composant référence `/images/blog/reader.png` (minuscule) — fonctionne sur Linux/prod car sensible à la casse. À vérifier en déploiement.

### Réalisations (`/realisationprojet/`)

| Fichier | Projet | Année |
|---------|--------|-------|
| `/realisationprojet/2025/systeme-rag-multi-sources.png` | Système RAG Multi-Sources | 2025 |
| `/realisationprojet/2025/CODRescue-v2.png` | CODRescue v2 | 2025 |
| `/realisationprojet/2026/GreenSIGapp.png` | GreenSIG App | 2026 |
| `/realisationprojet/2026/GAM-Genies-Afrique-Medias.png` | GAM — Génies Afrique Médias | 2026 |

### Blog — Photos articles (`/blog/`)

| Fichier court | Sujet de l'article |
|---------------|-------------------|
| `ideogram-v3.0_...L_Afrique_tech_en_2026...jpg` | L'Afrique tech en 2026 |
| `lucid-origin_...Agentic_AI...jpg` | Agentic AI |
| `lucid-origin_...Cloud_souverain...jpg` | Cloud souverain en Afrique |
| `lucid-origin_...Cybersécurité_2026...jpg` | Cybersécurité 2026 |
| `lucid-origin_...IA_générative_en_entreprise...jpg` | IA générative en entreprise |
| `lucid-origin_...L_IA_en_entreprise_acheter_ou...jpg` | IA en entreprise : acheter ou développer |
| `lucid-origin_...Les_10_compétences_tech...jpg` | 10 compétences tech |
| `lucid-origin_...Maroc_hub_numérique...jpg` | Maroc hub numérique |
| `lucid-origin_...Veille_1...jpg` | Veille tech semaine 1 |

---

## 2. Image manquante 🔴

| Fichier manquant | Référencé dans | Impact |
|-----------------|---------------|--------|
| `/images/Equipe/elvis.png` | `AboutShell.tsx:64` | Photo d'un membre de l'équipe absente — page /about cassée |

**Correction :** Ajouter la photo ou supprimer la ligne dans `src/components/about/AboutShell.tsx`.

---

## 3. Images locales orphelines ⚠️

Ces fichiers existent dans `public/` mais **ne sont référencés nulle part** dans le code source.

| Fichier | Dossier | Raison probable |
|---------|---------|----------------|
| `/MPIGA.png` | racine `public/` | Doublon de `/images/Equipe/MPIGA.png` |
| `/Sohaid.png` | racine `public/` | Doublon/brouillon de `sohaib_baroud.jpg` |
| `/images/services/E1141IIE.avif` | services | Image non assignée à un service |
| `/logo_entreprise_partenaire/Logo_Lear.png` | partenaires | Section partenaires non implémentée |
| `/logo_entreprise_partenaire/logo_Yoozak.png` | partenaires | Section partenaires non implémentée |
| `/logo_entreprise_partenaire/logo_green_sig.png` | partenaires | Section partenaires non implémentée |
| `/Catalogue/images/Intégrer l'IA dans sa pratique professionnelle.jpg` | Catalogue | Non référencé dans le code |
| `/Catalogue/Blog/image/Gemini_Generated_Image_w0xmavw0xmavw0xm.png` | Catalogue/Blog | Non référencé dans le code |
| `/Catalogue/Blog/image/WhatsApp Image 2026-04-11 at 19.50.00.jpeg` | Catalogue/Blog | Non référencé dans le code |

---

## 4. Images distantes — Vidéos Pixabay (cdn.pixabay.com)

Utilisées comme vidéos de fond dans `services.ts` et `ServicesShell.tsx`.

| Service | URL |
|---------|-----|
| 01 · Ingénierie Logicielle | `cdn.pixabay.com/video/2019/05/06/23355-334950213_large.mp4` |
| 02 · Automatisation IA | `cdn.pixabay.com/video/2023/07/24/173103-848555583_large.mp4` |
| 03 · Architecture | `cdn.pixabay.com/video/2024/11/05/240062_large.mp4` |
| 04 · Data & IA | `cdn.pixabay.com/video/2020/01/30/31772-388253161_large.mp4` |
| 05 · Géomatique | `cdn.pixabay.com/video/2017/07/23/10854-226632941_large.mp4` |
| 06 · Conseil Stratégique | `cdn.pixabay.com/video/2022/10/31/137265-766326232_large.mp4` |
| 07 · Conseil Opérationnel | `cdn.pixabay.com/video/2024/03/01/202560-918431383_large.mp4` |
| 09 · Formations | `cdn.pixabay.com/video/2024/07/21/222279_large.mp4` |

---

## 5. Images distantes — Photos Unsplash (images.unsplash.com)

### Services — subImages (`services.ts`)

| Service | Unsplash IDs |
|---------|-------------|
| 01 · Ingénierie Logicielle | `photo-1512941937669` · `photo-1461749280684` |
| 02 · Automatisation IA | `photo-1485827404703` · `photo-1526374965328` · `photo-1531746790731` |
| 03 · Architecture | `photo-1451187580459` · `photo-1544197150-b99a580bb7a8` · `photo-1647166545674` |
| 04 · Data & IA | `photo-1518186285589` · `photo-1504868584819` · `photo-1527474305487` |
| 05 · Géomatique | `photo-1599507593499` |
| 06 · Conseil Stratégique | `photo-1517245386807` · `photo-1521791136064` |
| 07 · Conseil Opérationnel | `photo-1664575602554` · `photo-1454165804606` · `photo-1519389950473` |
| 09 · Formations | `photo-1509062522246` · `photo-1523240795612` (×2) |

### Formation defaults (`formation-defaults.ts`)

9 images Unsplash pour les formations sans image Shopify.

### Secteurs (`secteurs-data.ts`)

7 images Unsplash — une par secteur (Finance, Santé, Agriculture, Industrie, etc.).

### Carousel formations (`FormationsCarousel.tsx`)

6 images Unsplash en fallback carousel.

---

## 6. Domaines autorisés (next.config.ts)

```
images.unsplash.com
res.cloudinary.com
videos.pexels.com
media.licdn.com
cdn.pixabay.com
cdn.shopify.com
```

---

## Actions recommandées

| Priorité | Action |
|----------|--------|
| 🔴 **CRITIQUE** | Ajouter `/images/Equipe/elvis.png` ou retirer ce membre de `AboutShell.tsx` |
| ⚠️ **Moyen** | Vérifier la casse `/images/blog/reader.png` vs `/images/Blog/reader.png` en production Linux |
| 🟡 **Faible** | Nettoyer les 9 fichiers orphelins (`/MPIGA.png`, `/Sohaid.png`, `E1141IIE.avif`, logos partenaires, Catalogue/) |
| 🟡 **Faible** | Implémenter la section partenaires ou supprimer les 3 logos dans `logo_entreprise_partenaire/` |
