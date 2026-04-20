# FormationDetailShell — Documentation technique

Page produit d'une formation individuelle.
Route : `/formations/[slug]` → `src/components/formations/FormationDetailShell.tsx`

---

## 1. Vue d'ensemble

| Propriete | Valeur |
|---|---|
| **Fichier** | `src/components/formations/FormationDetailShell.tsx` |
| **Directive** | `"use client"` |
| **Prop d'entree** | `{ slug: string }` |
| **Source de donnees** | `GET /api/shopify/formations/{slug}` (detail) + `GET /api/shopify/formations` (related) |
| **Dependances UI** | Framer Motion, Lucide React, CTAButton, FooterStrip |
| **Dependances 3D** | WaveTerrain (dynamic import, `ssr: false`) |
| **Lignes** | ~777 |

---

## 2. Flux de donnees

```
page.tsx
  └─ FormationDetailShell({ slug })
       │
       ├─ useEffect[slug]
       │    └─ fetch(`/api/shopify/formations/${slug}`)
       │         └─ response.formation → state `formation: FormationDetail`
       │
       └─ useEffect[formation]
            └─ fetch(`/api/shopify/formations`)
                 └─ filtre + tri par pertinence → state `related: RelatedFormation[]`
```

### Requete principale — detail formation

**Endpoint** : `GET /api/shopify/formations/{slug}`

**Response** :
```json
{
  "formation": { ...FormationDetail }
}
```

### Requete secondaire — formations similaires

**Endpoint** : `GET /api/shopify/formations`

**Algorithme de tri** (priorite descendante) :
1. Meme `categorie` que la formation courante
2. Meme `secteur` (mais categorie differente)
3. Le reste

Resultat : les 3 premieres apres tri.

---

## 3. Interfaces de donnees

### FormationDetail

```ts
interface FormationDetail {
  id: string;            // handle Shopify
  slug: string;          // handle Shopify (doublon de id)
  title: string;         // titre produit Shopify
  secteur: string;       // metafield custom.secteur
  categorie: string;     // metafield custom.categorie
  niveau: string;        // metafield custom.niveau
  duree: string;         // metafield custom.duree
  format: string;        // metafield custom.format
  parcours?: string;     // metafield custom.parcours
  prix?: string;         // priceRange.minVariantPrice (formate)
  accroche: string;      // metafield custom.accroche OU product.description
  publicCible: string;   // metafield custom.public_cible_act (virgules)
  prerequis: string;     // metafield custom.prerequis_
  objectifs: string[];   // metafield custom.Objectifs_pedagogiques (JSON)
  programme: {           // metafield custom.programme (JSON)
    module: string;
    details: string[];
  }[];
  livrables: string[];   // metafield custom.livrables (JSON)
  methode: string;       // metafield custom.methode
  imageUrl?: string;     // premiere image produit
  images?: string[];     // toutes les images produit (jusqu'a 10)
  descriptionHtml?: string; // description riche Shopify
}
```

### RelatedFormation

```ts
interface RelatedFormation {
  slug: string;
  title: string;
  categorie: string;
  secteur: string;
  niveau: string;
  duree: string;
  accroche: string;
  imageUrl?: string;
}
```

### Correspondance metafields Shopify

| Champ TS | Metafield Shopify | Namespace | Type |
|---|---|---|---|
| `secteur` | `secteur` | `custom` | `single_line_text` ou JSON array |
| `categorie` | `categorie` | `custom` | `single_line_text` ou JSON array |
| `niveau` | `niveau` | `custom` | `single_line_text` ou JSON array |
| `duree` | `duree` | `custom` | `single_line_text` |
| `format` | `format` | `custom` | `single_line_text` |
| `accroche` | `accroche` | `custom` | `single_line_text` |
| `parcours` | `parcours` | `custom` | `single_line_text` |
| `publicCible` | `public_cible_act` | `custom` | JSON `{"metiers":[...]}` ou tableau ou texte |
| `prerequis` | `prerequis_` | `custom` | `single_line_text` |
| `objectifs` | `Objectifs_pedagogiques` | `custom` | JSON `[...]` ou `{"objectifs":[...]}` |
| `programme` | `programme` | `custom` | JSON `[...]` ou `{"programme":[...]}` |
| `livrables` | `livrables` | `custom` | JSON `[...]` ou `{"livrables":[...]}` |
| `methode` | `methode` | `custom` | `single_line_text` |

> **Attention** : Les cles metafield ont des inconsistances :
> - `prerequis_` (underscore final)
> - `Objectifs_pedagogiques` (majuscule + underscore)
> - `public_cible_act` (suffixe `_act`)
> - `format_suported` (typo dans la query liste, `format` dans la query detail)

---

## 4. Etats du composant

| State | Type | Default | Description |
|---|---|---|---|
| `formation` | `FormationDetail \| null` | `null` | Donnees de la formation chargee |
| `isLoading` | `boolean` | `true` | Fetch en cours |
| `fetchError` | `boolean` | `false` | Erreur de fetch |
| `openModule` | `number \| null` | `0` | Index du module programme ouvert (accordion) |
| `related` | `RelatedFormation[]` | `[]` | Formations similaires |
| `scrolled` | `boolean` | `false` | `true` quand `scrollY > 120px` |

### Diagramme d'etats du chargement

```
[Montage] → isLoading=true
    │
    ├─ fetch OK → formation={...}, isLoading=false
    │     └─ fetch related → related=[...]
    │
    └─ fetch KO → fetchError=true, isLoading=false
          └─ clic "Reessayer" → retour a isLoading=true
```

---

## 5. Sections de la page (ordre d'affichage)

### 5.1 — Sticky CTA Bar

| Propriete | Valeur |
|---|---|
| **Apparition** | Quand `scrollY > 120px` ET `formation !== null` |
| **Position** | `fixed top-0`, z-index 200 |
| **Contenu** | Logo "ACT" a gauche + bouton "Je m'inscris" a droite |
| **Animation entree** | `y: -80 → 0`, opacity fade, ease `[0.22, 1, 0.36, 1]` |
| **Animation bouton** | Pulse border infini (`ctaPulse`, 2s) |
| **Action** | `router.push(/formations/{slug}/inscription)` |
| **Fond** | `rgba(7,14,28,0.92)` + `backdrop-filter: blur(16px)` |

### 5.2 — Couches de fond

| Couche | Z-index | Description |
|---|---|---|
| **Grain** | 0 | Texture SVG `fractalNoise`, opacity 0.028, fixed |
| **WaveTerrain** | 0 | Background 3D (Three.js/R3F), opacity 0.4, fixed |
| **Grid** | 0 (interne hero) | Grille 80x80px, `rgba(211,84,0,0.035)` |
| **Glow** | 0 (interne hero) | `radial-gradient` orange, 60vw, centre-droit |

### 5.3 — Hero

**Layout** : grid 3 colonnes `1.2fr / 200px / 0.8fr`, gap 80px, max-width 1400px

| Colonne | Contenu |
|---|---|
| **Gauche (1.2fr)** | Bouton retour, titre (avec "IA" en orange italic), 2 CTA, 4 stats, accroche, lien brochure |
| **Centre (200px)** | Label `{secteur} · ATTESTATION ACT` |
| **Droite (0.8fr)** | `FramedImage` avec `images[0]`, hauteur 500px |

**Etats alternatifs** :
- `isLoading` → 5 blocs skeleton
- `fetchError` → message erreur + bouton "Reessayer"
- `formation === null` apres chargement → rien

**Titre** : Split sur "IA" pour le colorer en orange italic :
```tsx
formation.title.split('IA').map(...)
// "Formation IA avancee" → "Formation " + <span orange>IA</span> + " avancee"
```

**Stats hero** (4 blocs) :

| Valeur | Label | Source |
|---|---|---|
| `{duree}h` | "pratique intensive" | `formation.duree` |
| `{programme.length}` ou `6` | "modules progressifs" | `formation.programme.length` |
| `≤12` | "apprenants / session" | Hardcode |
| `100%` | "cas metier reels" | Hardcode |

### 5.4 — Pour Qui

**Layout** : centre, max-width 1100px

| Element | Source |
|---|---|
| Sous-titre | `formation.prerequis` ou fallback "Aucun prerequis technique..." |
| Pills | `formation.publicCible.split(',')` → pills arrondies |
| Fallback | "Tous les professionnels" si `publicCible` vide |

### 5.5 — Objectifs

**Layout** : grid 2 colonnes, max-width 1200px, centre

| Element | Source |
|---|---|
| Cartes | `formation.objectifs.slice(0, 4)` (max 4 objectifs) |
| Image carte | `formation.images[i % images.length]` |
| Icone | Cycle fixe : BookOpen, BarChart3, Users, Clock |
| Fallback | 4 cartes skeleton si `objectifs` vide |

Chaque carte :
- Image en haut (150px, brightness 0.55 + gradient overlay)
- Badge icone + numero en overlay
- Barre orange decorative (32x3px)
- Texte objectif

### 5.6 — Programme (accordion)

**Layout** : grid 2 colonnes `1.2fr / 420px`, max-width 1440px

| Colonne gauche | Colonne droite (sticky top 140px) |
|---|---|
| Accordion des modules | `FramedImage` avec `images[1]` (540px) |
| | Texte italic |
| | Bouton "Je m'inscris" (ghost → primary au hover) |

**Accordion** :
- Un seul module ouvert a la fois (toggle)
- Premier module ouvert par defaut (`openModule = 0`)
- Couleur du cercle numerote : cycle `LOGO_COLORS` (5 couleurs)
- ChevronDown tourne 180deg quand ouvert
- Animation contenu : `height: 0 → auto`, Framer Motion `AnimatePresence`

**Palette LOGO_COLORS** :

| Index | Couleur | Utilisation |
|---|---|---|
| 0 | `#1B5B3A` | Vert ACT |
| 1 | `#F0A500` | Or |
| 2 | `#D35400` | Orange ACT |
| 3 | `#B83C1F` | Rouge-orange |
| 4 | `#8B1515` | Rouge sombre |

### 5.7 — Livrables

**Layout** : grid 2 colonnes `1fr / 1fr`, max-width 1300px

| Colonne gauche | Colonne droite |
|---|---|
| Carte avec liste check (Check icon + texte) | `FramedImage` avec `images[2]` ou `images[0]` ou fallback Unsplash |

Fallback si `livrables` vide : 2 items hardcodes ("Support de cours complet", "Attestation de reussite ACT Formation").

### 5.8 — Formations similaires

**Condition** : affiche seulement si `related.length > 0`

**Layout** : grid 3 colonnes, max-width 1400px

Chaque carte :
- Image (200px, brightness 0.75)
- Badge categorie (ou secteur) en overlay
- Meta : niveau (BarChart3) + duree (Clock)
- Titre (font-display)
- Accroche (2 lignes max, clamp)
- Lien "Voir la formation" avec ChevronRight
- Hover : `y: -6`, border orange

### 5.9 — FooterStrip

Composant importe depuis `src/components/layout/FooterStrip.tsx`.
4 colonnes (Contact, Navigation, Reseaux Sociaux, Nos Poles) + newsletter + copyright.

---

## 6. Sous-composants internes

### SectionLabel

```tsx
<SectionLabel centered>POUR QUI</SectionLabel>
```

Pill arrondie orange : dot 6px + texte uppercase, letterSpacing 0.15em, border `{ORANGE}44`, bg `{ORANGE}11`.

### Button

```tsx
<Button variant="primary" onClick={fn}>Texte</Button>
<Button variant="secondary" onClick={fn}>Texte</Button>
```

| Variant | Background | Couleur texte | Border |
|---|---|---|---|
| `primary` | `#D35400` | `#000` | aucune |
| `secondary` | transparent | `#fff` | `rgba(255,255,255,0.3)` |

### FramedImage

Image avec cadre decoratif : border offset 12px en bas/droite + 2 coins accent orange (haut-gauche, bas-droite).

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string?` | — | URL image |
| `alt` | `string?` | `""` | Alt text |
| `height` | `string` | requis | Hauteur CSS |
| `borderRadius` | `string` | `"16px"` | Arrondi |
| `fallback` | `ReactNode?` | fond orange 18% | Rendu si pas d'image |

### SkeletonBlock

Bloc placeholder anime (`pulse` 1.5s).

| Prop | Type | Default |
|---|---|---|
| `w` | `string` | `"100%"` |
| `h` | `number` | `16` |

### Grain

Texture SVG `fractalNoise` fixe, opacity 0.028, plein ecran, `pointer-events: none`.

---

## 7. Constantes de style

```ts
const ORANGE    = "#D35400";          // Accent principal
const DARK      = "#070E1C";          // Fond page
const CARD_BG   = "rgba(255,255,255,0.03)";  // Fond cartes
const BORDER    = "rgba(255,255,255,0.06)";  // Bordures subtiles
const TEXT_GRAY = "rgba(255,255,255,0.6)";   // Texte secondaire
const OFF_WHITE = "#fcf9f2";          // Texte clair
```

---

## 8. Animations

### Framer Motion

| Element | Animation | Parametres |
|---|---|---|
| Sticky bar | Entree/sortie verticale | `y: -80 → 0`, ease `[0.22,1,0.36,1]`, 0.35s |
| Hero gauche | Slide-in gauche | `x: -30 → 0`, 0.8s |
| Hero attestation | Fade-in bas | `y: 20 → 0`, 0.8s, delay 0.1s |
| Hero image droite | Slide-in droite | `x: 30 → 0`, 0.8s, delay 0.2s |
| Accordion programme | Height animate | `height: 0 → auto`, ease `[0.04,0.62,0.23,0.98]`, 0.35s |
| ChevronDown | Rotation | `rotate: 0 → 180deg`, 0.3s |
| Cartes objectifs | Hover | `borderColor → ORANGE, y: -4` |
| Cartes similaires | Entree echelonnee | `y: 24 → 0`, delay `i * 0.1s` |
| Cartes similaires | Hover | `y: -6` |
| Icone Users (hero) | Bounce infini | `y: [0, -8, 0]`, 1.5s, repeat Infinity |

### CSS Keyframes

```css
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.8; }
}

@keyframes ctaPulse {
  0%   { opacity: 0.9; transform: scale(1); }
  70%  { opacity: 0;   transform: scale(1.25); }
  100% { opacity: 0;   transform: scale(1.25); }
}
```

---

## 9. Navigation et interactions

| Action utilisateur | Comportement |
|---|---|
| Clic "Retour" (hero) | `router.back()` |
| Clic "Je m'inscris" (hero, sticky, programme) | `router.push(/formations/{slug}/inscription)` |
| Clic "Voir le programme" (hero) | Scroll smooth vers `#programme-section` |
| Clic "Telecharger la brochure" | Lien `href="#"` (pas encore implemente) |
| Clic module programme | Toggle accordion (un seul ouvert) |
| Clic carte similaire | Navigation vers `/formations/{slug}` |
| Scroll > 120px | Apparition sticky bar |

---

## 10. Responsivite

Le composant n'a **pas de breakpoints explicites**. Tous les layouts utilisent des grilles CSS fixes qui ne s'adaptent pas au mobile. Points d'attention :

| Section | Probleme mobile potentiel |
|---|---|
| Hero | Grid 3 colonnes fixe (`1.2fr 200px 0.8fr`) ne se collapse pas |
| Objectifs | Grid 2 colonnes fixe |
| Programme | Grid `1.2fr 420px` fixe, image sticky a droite |
| Livrables | Grid 2 colonnes fixe |
| Similaires | Grid 3 colonnes fixe |
| Stats hero | Flex row avec gap 40px, pas de wrap |

> **A noter** : La landing HTML de reference utilise des `@media (max-width: 900px/1000px)` 
> pour collapser les grilles en 1 colonne. Le shell actuel ne le fait pas.

---

## 11. Dependances externes

| Package | Utilisation |
|---|---|
| `framer-motion` | AnimatePresence, motion.div, whileHover, animate |
| `lucide-react` | Clock, Users, BarChart3, BookOpen, Check, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, ChevronDown |
| `next/dynamic` | Import WaveTerrain SSR-disabled |
| `next/navigation` | `useRouter()` |
| `next/link` | (importe mais non utilise directement — utilise dans CTAButton) |

### Composants internes importes

| Composant | Chemin | Role |
|---|---|---|
| `CTAButton` | `@/components/ui/CTAButton` | Bouton glassmorphism avec diamant |
| `WaveTerrain` | `@/components/home2/WaveTerrain` | Background 3D (dynamic, ssr:false) |
| `FooterStrip` | `../layout/FooterStrip` | Footer complet avec newsletter |

---

## 12. Fonts

Declare dans le `<style jsx global>` du composant :

```css
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700;800&display=swap');
:root {
  --font-display: 'Lora', serif;
  --font-body: 'Poppins', sans-serif;
}
```

> **Note** : ces variables sont aussi definies dans `globals.css`. La redeclaration ici 
> est redondante mais garantit que le composant fonctionne si isole.

---

## 13. Points d'amelioration identifies

| # | Point | Severite |
|---|---|---|
| 1 | **Pas de responsivite** — les grilles ne se collapsent jamais | Haute |
| 2 | **Import `Link` inutilise** — importe en ligne 2 mais jamais utilise dans le composant | Basse |
| 3 | **Import `Loader2` et `AlertCircle` inutilises** | Basse |
| 4 | **Brochure non implementee** — `href="#"` sur le CTAButton | Moyenne |
| 5 | **Hover gere en JS** — `onMouseEnter/onMouseLeave` modifient le style inline au lieu d'utiliser CSS | Basse |
| 6 | **Pas de `<title>` / metadata** — pas de SEO dynamique (gere dans `page.tsx` ?) | Moyenne |
| 7 | **Font import dans style jsx** — doublon avec `globals.css` et `layout.tsx` | Basse |
| 8 | **Stat "≤12 apprenants" hardcodee** — ne reflete pas forcement la realite par formation | Basse |
| 9 | **Stats "100% cas metier" hardcodee** — marketing statique | Basse |
| 10 | **`compareAtPrice` non utilise** — le prix barre Shopify natif n'est pas fetche | Moyenne |
