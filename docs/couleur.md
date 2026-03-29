# Couleurs (Colors) utilisées — Africa Centred Technology (Site & Blog)

Ce document rassemble et définit la palette de couleurs utilisée sur le site et le blog Africa Centred Technology (ACT), ainsi que leur utilisation stratégique dans le design de l'interface (UI).

---

## 1. Couleurs de Marque (Brand Colors)
Ces couleurs constituent l'identité forte et vibrante d'ACT. Elles sont définies comme variables globales dans le fichier `src/app/globals.css`.

| Nom CSS | Code Hex | Aperçu | Rôle & Utilisation |
| :--- | :--- | :--- | :--- |
| `--color-act-orange` | **`#D35400`** | Orange brûlé / Terre battue | **Couleur principale d'accentuation.** Utilisée pour les boutons principaux (CTA), les lignes de séparation, le curseur personnalisé (`::selection`), les textes en surbrillance, et les titres clés. C'est le marqueur d'action du site. |
| `--color-act-gold` | **`#F39C12`** | Jaune or / Ambre | **Couleur secondaire d'accentuation.** Souvent utilisée en tandem avec le orange (`#D35400`) pour créer des dégradés dynamiques (comme sur les bordures ou les lignes d'animation) et pour l'interaction (effets au survol/hover). |
| `--color-act-dark` | **`#0A1410`** | Vert très sombre / Noir | **Fond texturé par défaut.** C'est la couleur de base (`body`) de l'application. Elle offre un contraste saisissant pour le texte clair et permet au design lumineux "glassmorphism" de ressortir. |
| `--color-act-green` | **`#1B3022`** | Vert forêt profond | **Nuance de fond secondaire.** Utilisée pour superposer des sections subtiles (cartes de contact, panneaux latéraux) sans utiliser du noir pur. |
| `--color-act-green-mid` | **`#2C4A35`** | Vert mousse / Olive | **Nuance de transition.** Souvent exploitée dans des dégradés subtils sur les fonds des composants "Services" pour enrichir le thème africain et naturel. |
| `--color-act-cream` | **`#FCF9F2`** | Crème cassé | **Variante de texte clair.** Moins agressive à l'œil que le blanc pur, idéale pour de longs blocs de texte dans certaines sections lumineuses ou dans des articles éditoriaux (Blog). |

---

## 2. Palette des Réalisations (Tech & Cyber)
Dans les pages spécifiques (comme la section "Pôle Réalisations" ou certains sous-composants), le design bascule légèrement vers des codes plus techniques et cyberpunk.

- **`#070E1C` (Bleu nuit abyssal) :** Utilisé comme couleur de fond (`background`) principale dans la page d'accueil des projets et le détail des réalisations pour renforcer l'aspect "technologique".
- **`#0A1520` (Bleu gris sombre) :** Utilisé pour l'arrière-plan des boîtes contenant des images de projets.

---

## 3. Typographie et Transparences (Opacities)
Le site utilise un système complexe de transparence sur le blanc pour créer une hiérarchie de l'information (Glassmorphism & Profondeur).

- **`#FFFFFF` ou `rgba(255,255,255, 1)` :** Blanc pur. Réservé aux titres principaux (H1, H2), aux mots-clés et aux textes mis en gras ("LE MANIFESTE", "Bienvenue").
- **`rgba(255,255,255, 0.6)` ou `0.55` :** Blanc atténué (environ 60% d'opacité). C'est la couleur standard pour le **Texte courant (Paragraphes)**. Elle évite la fatigue oculaire sur de grands écrans noirs.
- **`rgba(255,255,255, 0.4)` ou `0.3` :** Blanc très transparent. Réservé aux textes techniques, aux numéros (ex: `01 / 04`), au copyright dans le footer, et aux labels secondaires.
- **`rgba(255,255,255, 0.05)` :** Gris/Blanc quasi-transparent. Utilisé pour créer les **contours (borders)** ou les **arrières-plans de cartes (cards)** dans l'esprit Glassmorphism.

---

## 4. Dégradés & Gradients Remarquables
Pour ajouter de l'impact, le thème utilise des dégradés (gradients) spécifiques misant sur l'identité africaine.

- **Le Dégradé Feu / Magma :** `linear-gradient(to right, #D35400, #F39C12, #D35400)`
  *Utilisé comme ligne d'horizon animée ou comme soulignement pour les titres massifs des réalisations.*
- **L'Ombré de Contenu (Fade-out) :** `linear-gradient(to bottom, rgba(7,14,28,0.3) 0%, rgba(7,14,28,0.95) 80%, #070e1c 100%)`
  *Une utilisation courante pour le bas des images "Hero", permettant de fondre l'image doucement dans l'arrière-plan uni sans coupure nette.*
- **Glow orange en arrière-plan :** `radial-gradient(ellipse at 50% 50%, rgba(211,84,0,0.07) 0%, transparent 65%)`  
  *(Dans le code RGB, 211, 84, 0 correspond à `#D35400`). Cet effet ajoute une douce lumière derrière les éléments majeurs.*
