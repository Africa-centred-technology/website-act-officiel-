# Charte Graphique — Landing Formation IA (ACT)

Analyse comparative des deux fichiers HTML :
- `docs/Landing Formation IA.html` (thème **Dark** — version par défaut)
- `docs/Landing Formation IA - Clair.html` (thème **Light** — palette inversée)

---

## 1. Palette de couleurs

### 1.1 Thème Dark (Landing Formation IA.html)

| Variable CSS | Valeur | Rôle |
|---|---|---|
| `--act-dark` | `#0A1410` | Fond principal (body) |
| `--act-dark-deep` | `#070E1C` | Fond sections "deep" / marquee / footer |
| `--act-green` | `#1B3022` | Fond sections "green" / panneaux |
| `--act-green-mid` | `#2C4A35` | Gradients accessoires |
| `--act-orange` | `#D35400` | **Couleur d'accent primaire** (CTA, titres em, diamond) |
| `--act-orange-hot` | `#FF6B00` | Accent hover / gradient |
| `--act-gold` | `#F39C12` | Accent secondaire (tags, highlights) |
| `--act-cream` | `#FCF9F2` | Texte clair sur fond orange |
| `--act-white` | `#FFFFFF` | Texte principal |
| `--act-muted` | `#A0A0A0` | Texte secondaire |

**Transparences utilisées** :
- Texte : `rgba(255,255,255,0.75)` (lede), `0.7` (body), `0.5` (mono), `0.4` (marquee)
- Bordures : `rgba(255,255,255,0.06)` à `0.14`
- Fonds de cartes : `rgba(255,255,255,0.02)` à `0.04`

### 1.2 Thème Light (Landing Formation IA - Clair.html)

Palette inversée conservant l'accent orange.

| Variable CSS | Valeur | Rôle |
|---|---|---|
| `--act-dark` | `#FCF9F2` | Fond principal (body) — était dark |
| `--act-dark-deep` | `#F4EFE4` | Fond "deep" — était dark-deep |
| `--act-green` | `#E8E4D7` | Panneaux — était vert foncé |
| `--act-green-mid` | `#D5CFBE` | Gradients |
| `--act-orange` | `#D35400` | **Accent primaire inchangé** |
| `--act-orange-hot` | `#FF6B00` | Accent hover inchangé |
| `--act-gold` | `#B8860B` | Accent secondaire assombri (vs `#F39C12`) |
| `--act-cream` | `#FCF9F2` | Inchangé |
| `--act-white` | `#0A1410` | **Texte principal inversé** (devient sombre) |
| `--act-muted` | `#6B7A72` | Texte secondaire |

**Variables ink additionnelles** (spécifiques au thème clair) :

| Variable | Valeur |
|---|---|
| `--ink` | `#0A1410` |
| `--ink-soft` | `rgba(10,20,16,0.72)` |
| `--ink-mid` | `rgba(10,20,16,0.55)` |
| `--ink-low` | `rgba(10,20,16,0.35)` |
| `--line` | `rgba(10,20,16,0.1)` |
| `--line-soft` | `rgba(10,20,16,0.06)` |
| `--panel` | `rgba(10,20,16,0.03)` |

### 1.3 Variantes d'accent (data-accent)

Les deux fichiers supportent des variantes via l'attribut `[data-accent]` :

| Variante | `--act-orange` | `--act-orange-hot` |
|---|---|---|
| `orange` (défaut) | `#D35400` | `#FF6B00` |
| `gold` | `#F39C12` | `#FFB52E` |
| `red` | `#C0392B` | `#E74C3C` |

---

## 2. Typographie

### 2.1 Familles de polices

Identiques dans les deux fichiers, chargées depuis **Google Fonts** :

```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

| Variable | Stack | Usage |
|---|---|---|
| `--font-display` | `'Lora', 'Times New Roman', serif` | Titres (h1–h3), chiffres clés, blockquotes, card-title |
| `--font-body` | `'Poppins', -apple-system, system-ui, sans-serif` | Corps de texte, paragraphes |
| `--font-label` | `'Poppins', system-ui, sans-serif` | Labels, eyebrows, mono, boutons, nav |

### 2.2 Graisses (Poppins)

- **300** — Texte descriptif / lede (poids light)
- **400** — Texte courant
- **500** — Labels, liens nav, textes de boutons secondaires
- **600** — Eyebrow, CTA, nav links actifs
- **700** — Price badges, mono highlight

### 2.3 Styles Lora

- **400–500 (regular + italic)** — titres, nombres
- **italic** — particularité : les mots em (`<em>`) dans les titres → `font-style: italic; color: var(--act-orange);`

### 2.4 Échelle typographique

| Élément | Taille | Line-height | Letter-spacing |
|---|---|---|---|
| `h1` (hero) | `clamp(46px, 6.4vw, 96px)` | `0.98` | `-0.025em` |
| `h1` hero emphatic | `clamp(52px, 7.5vw, 112px)` | — | — |
| `h2` (sec-head) | `clamp(40px, 4.8vw, 72px)` | `1` | `-0.025em` |
| `h2` (final) | `clamp(48px, 7vw, 110px)` | `0.95` | — |
| `h2` (midcta) | `clamp(36px, 4.5vw, 64px)` | `1` | — |
| `h3` (pain-card) | `26px` | `1.15` | — |
| `h3` (value-item) | `24px` | `1.2` | — |
| `h3` (tl-step) | `36px` | `1.1` | — |
| `card-title` | `28px` | `1.15` | `-0.02em` |
| `price-title` | `30px` | `1.05` | — |
| `price-amount .n` | `72px` italic | `0.95` | `-0.03em` |
| `card-price .now` | `52px` italic | `1` | `-0.03em` |
| `value-visual .big-stat` | `160px` italic | `0.9` | `-0.04em` |
| `p.lede` | `20px` | `1.6` | — |
| `sec-head p` | `18px` | `1.6` | — |
| `body` (hero-trust .v) | `32px` italic | `1` | `-0.02em` |
| `eyebrow` | `12px` | — | `0.24em` UPPERCASE |
| `mono` | `11px` | — | `0.22em` UPPERCASE |
| `nav-links a` | `12px` | — | `0.18em` UPPERCASE |
| `btn` | `12px` | — | `0.18em` UPPERCASE |
| `hero-trust-item .l` | `10px` | — | `0.2em` UPPERCASE |
| `topbar` | `12px` | — | `0.14em` UPPERCASE |
| `card-meta .k` | `10px` | — | `0.2em` UPPERCASE |
| `price-features li` | `14px` | `1.5` | — |
| `faq-q .qtxt` | `22px` | `1.25` | `-0.015em` |

### 2.5 text-wrap

Tous les titres `h1/h2/h3` ont `text-wrap: balance`.

---

## 3. Iconographie & éléments décoratifs

### 3.1 Diamond (marqueur de marque)

Élément visuel récurrent de la charte ACT :

```css
.diamond {
  display: inline-block;
  width: 10px; height: 10px;
  background: var(--act-orange);
  transform: rotate(-43.264deg);
  flex-shrink: 0;
}
.diamond.gold  { background: var(--act-gold); }
.diamond.cream { background: var(--act-cream); }
```

Utilisé dans : eyebrow, CTA ghost, nav-logo, price-features `::before`, tl-step `::before`, timeline bullets, footer, final-guarantee.

### 3.2 Grain (texture)

Fond texturé SVG noise inline :

```css
.grain {
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,...fractalNoise baseFrequency='0.85'...");
  opacity: 0.04;
  mix-blend-mode: overlay;  /* dark */
  /* clair : opacity 0.03, mix-blend-mode: multiply */
}
```

### 3.3 Flèches

Caractères Unicode : `→` (flèche droite) dans les boutons `.btn .arr` (animation `translateX(4px)` au hover).

---

## 4. Composants UI

### 4.1 Boutons

| Classe | Description |
|---|---|
| `.btn` | Base : `padding 16px 28px`, uppercase, 12px, letter-spacing 0.18em |
| `.btn-primary` | Fond orange + box-shadow 14px 40px rgba(211,84,0,0.55), hover translateY(-2px) |
| `.btn-ghost` | Transparent, bordure subtile, backdrop-filter blur(6px) |
| `.btn-dark` | Fond `--act-dark`, bordure cream 15% |

### 4.2 Cartes

- **`.hero-card`** — gradient border orange → gold, backdrop-filter blur(10px), padding 32px
- **`.pain-card`** — fond `rgba(255,255,255,0.02)`, hover translateY(-4px) + border orange
- **`.aud-card`** — aspect ratio 1/1.1, hover remplit en orange
- **`.test-card`** — grande guillemette décorative `"` en fond (120px, orange 20%)
- **`.price-card`** — bordure `0.1`, variant `.featured` = gradient orange subtil + shadow `rgba(211,84,0,0.35)`
- **`.tool-pill`** — pilule arrondie 999px, dot coloré

### 4.3 Sections

| Modifier | Fond dark | Fond clair |
|---|---|---|
| `section.sec` | `#0A1410` | `#FCF9F2` |
| `section.sec.deep` | `#070E1C` | `#F4EFE4` |
| `section.sec.green` | `#1B3022` | `#E8E4D7` |

Padding vertical : `120px` (sec), `80px` (midcta), `140px` (final).

### 4.4 Topbar d'urgence

- Fond : `--act-orange`
- Pulse animé : boucle 1.6s ease-in-out `opacity` + `transform: scale(1→1.4)`
- Countdown : Lora italic 18px avec cases noires `rgba(0,0,0,0.18)`

### 4.5 Nav

- Sticky à `top: 44px` (sous topbar)
- `backdrop-filter: blur(16px)`
- Fond : `rgba(10,20,16,0.82)` (dark) / `rgba(252,249,242,0.88)` (clair)

---

## 5. Animations & transitions

| Animation | Paramètres |
|---|---|
| Cubic-bezier principale | `cubic-bezier(0.6, 0.08, 0.02, 0.99)` (matches `--ease-uptown` du projet) |
| Marquee `@keyframes scroll` | `to { transform: translateX(-50%); }` — 45s linear infinite |
| Tools row `@keyframes slide` | idem — 40s linear, variante `.rev` direction inversée |
| Pulse | 1.6s ease-in-out infinite |
| Hover CTA primary | `translateY(-2px)` + shadow intensifiée |
| FAQ expand | `max-height` transition 0.4s ease |
| Value-item hover | `padding-left: 0 → 16px` + color shift |

---

## 6. Layout

### 6.1 Container

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}
```

### 6.2 Breakpoints

| Breakpoint | Ajustement |
|---|---|
| `1000px` | hero-grid → 1 col, value-split → 1 col, price-grid → 1 col |
| `900px` | nav-links masqués, pain-grid → 1 col, aud-grid → 2 col, test-grid → 1 col, midcta-inner → 1 col |
| `700px` | timeline padding réduit (64px vs 100px), tl-step ul → 1 col, mob-cta visible, body padding-bottom 80px |
| `500px` | aud-grid → 1 col |

### 6.3 Grilles spécifiques

- `hero-grid` : `1.35fr 1fr`, gap 80px
- `value-split` : `1fr 1fr`, gap 60px (visual sticky top 140px)
- `pain-grid` : `repeat(3, 1fr)`
- `price-grid` : `repeat(3, 1fr)`
- `aud-grid` : `repeat(4, 1fr)`
- `test-grid` : `repeat(3, 1fr)`

---

## 7. Images externes utilisées

Toutes sont des URLs Unsplash optimisées :

- Hero bg : `photo-1677442136019-21780ecad995?w=2000&q=80`
- Value visual : `photo-1620712943543-bcc4688e7485?w=1400&q=80`
- Pain cards : `photo-1581091226825-...`, `photo-1587440871875-...`, `photo-1552664730-...`
- Audience (8 cartes) : URLs `photo-1556761175-*`, `photo-1600880292203-*`, `photo-1460925895917-*`, `photo-1551836022-*`, `photo-1521737711867-*`, `photo-1554224155-*`, `photo-1556761175-*`, `photo-1531482615713-*`
- Testimonials avatars : `photo-1573496359142-*`, `photo-1507003211169-*`, `photo-1580489944761-*`
- Final bg : `photo-1451187580459-43490279c0fa?w=2000&q=80`

Les images appliquent systématiquement : `mix-blend-mode` (luminosity, screen, multiply selon thème), `filter: grayscale() contrast() saturate()`, `opacity` entre 0.08 et 0.22.

---

## 8. Analyse comparative des deux fichiers

### 8.1 Ce qui change entre Dark et Clair

| Aspect | Dark | Clair |
|---|---|---|
| **Fond body** | `#0A1410` | `#FCF9F2` |
| **Texte principal** | `#FFFFFF` | `#0A1410` |
| **`--act-gold`** | `#F39C12` (vif) | `#B8860B` (doré profond) |
| **Grain blend-mode** | `overlay` | `multiply` |
| **Grain opacity** | `0.04` | `0.03` |
| **Nav fond** | `rgba(10,20,16,0.82)` | `rgba(252,249,242,0.88)` |
| **hero-bg gradient** | orange 0.28 + vert 0.5 | orange 0.14 + gold 0.12 |
| **hero-bg-img blend** | `luminosity` | `multiply` |
| **hero-bg-img opacity** | `0.22` | `0.1` |
| **hero-card fond** | gradient sombre vert→noir | gradient blanc `#FFFFFF → #F8F4E9` + shadow 30px 80px |
| **Pain-card fond** | `rgba(255,255,255,0.02)` | `#FFFFFF` + shadow |
| **Test-card fond** | `rgba(255,255,255,0.02)` | `#FFFFFF` + shadow |
| **Price-card featured** | `rgba(211,84,0,0.08→rgba(10,20,16,0.4))` + shadow orange 0.35 | `#FFFAF2→#FFFFFF` + shadow orange 0.22 |
| **Tool-pill** | `rgba(255,255,255,0.03)` + border 0.12 | `#FFFFFF` + border ink 0.1 |
| **aud-card:hover** | → orange + texte cream | → orange + texte cream (identique) |
| **Tweaks panel** | garde le fond sombre pour contraste | garde le fond sombre pour contraste |

### 8.2 Ce qui est identique

- **Structure HTML complète** (sections, composants, contenus, scripts)
- **Typographies** (Lora + Poppins via Google Fonts)
- **Script countdown / marquee / FAQ / tweaks**
- **Accent `--act-orange` = `#D35400`**
- **Diamond, eyebrow, mono, animations, breakpoints**
- **Layout container 1280px / padding 40px**
- **SVG grain et son générateur**
- **Variantes `[data-accent]` gold/red**

### 8.3 Stratégie d'override

Le fichier **Clair** redéfinit les tokens racine puis applique un bloc d'overrides `!important` (≈180 lignes) ciblant chaque composant plutôt qu'un refactor complet. Cette approche :

- ✅ **Permet** — réutilisation du même HTML et de la même base CSS
- ⚠️ **Inconvénient** — forte dette technique due au `!important` partout, rend la maintenance fragile

**Recommandation pour intégration Next.js** : extraire ces tokens dans `src/app/globals.css` sous `[data-theme="light"]` (pattern déjà en place dans le projet) et remplacer les styles inline par des classes réutilisables.

---

## 9. Tokens à intégrer dans globals.css (Tailwind v4 @theme)

Suggestion d'extension du `@theme {}` block déjà présent dans `src/app/globals.css` :

```css
@theme {
  /* ACT — Landing Formation IA */
  --color-act-dark:        #0A1410;
  --color-act-dark-deep:   #070E1C;
  --color-act-green:       #1B3022;
  --color-act-green-mid:   #2C4A35;
  --color-act-orange:      #D35400;
  --color-act-orange-hot:  #FF6B00;
  --color-act-gold:        #F39C12;
  --color-act-cream:       #FCF9F2;

  --font-display: 'Lora', 'Times New Roman', serif;
  --font-body:    'Poppins', -apple-system, system-ui, sans-serif;
  --font-label:   'Poppins', system-ui, sans-serif;

  --ease-uptown: cubic-bezier(0.6, 0.08, 0.02, 0.99);
}

[data-theme="light"] {
  --color-act-dark:       #FCF9F2;
  --color-act-dark-deep:  #F4EFE4;
  --color-act-green:      #E8E4D7;
  --color-act-green-mid:  #D5CFBE;
  --color-act-gold:       #B8860B;
  /* accent orange inchangé */
}
```
