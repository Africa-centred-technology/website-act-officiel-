# Polices (Fonts) utilisées — Africa Centred Technology (Site & Blog)

Ce document recense l'architecture typographique globale du projet, les polices utilisées, leurs variations et leurs rôles dans le design du site web et du blog.

## 1. Polices Globales (Importées via Google Fonts)
Ces polices sont chargées à la racine de l'application (dans `src/app/layout.tsx`) et sont principalement utilisées pour structurer les contenus web modernes.

### **Outfit**
- **Type :** Sans-serif géométrique
- **Graisses utilisées (Weights) :** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)
- **Rôle :** Typographie principale pour le corps du texte (paragraphes), les descriptions, le texte des articles de blog et les éléments d'interface utilisateur (UI). Elle offre une lecture claire et moderne sur tous les écrans.

### **Bebas Neue**
- **Type :** Sans-serif (Display)
- **Graisses utilisées :** Régulière
- **Rôle :** Utilisée pour des titres à fort impact visuel, en lettres majuscules (uppercase), des grands compteurs, ou des mots nécessitant une esthétique percutante et condensée.

### **Instrument Serif**
- **Type :** Serif élégante
- **Styles :** Normal (0) et Italique (1)
- **Rôle :** Sert souvent de police de contraste (accent font) pour des citations, des titres éditoriaux de blog, ou pour insérer des termes élégants (italiques) au sein des grands titres, créant une esthétique haut de gamme.

---

## 2. Polices Intégrées / Système (Styles Inline et Composants)
Ces polices sont très présentes dans le code de structuration des composants (ex: `ProjectDetailShell`, `ServiceRoom`, `Header`), appliquées de manière brute dans les styles ou classes CSS.

### **Futura**
- **Type :** Sans-serif géométrique classique
- **Rôle :** Utilisée de manière massive à travers le site pour la **micro-typographie technique et les marqueurs visuels** :
  - Sur-titres (eyebrows)
  - Labels de boutons techniques
  - Tags de filtres
  - Texte de la barre de navigation (liens des menus)
  - Pied de page technique
- **Fallbacks (Polices de secours) :** Toujours déclarée avec `system-ui, sans-serif` en cas d'absence de Futura sur la machine du visiteur.

---

## 3. Hiérarchie Typographique Résumée

| Élément | Police Principale | Caractéristiques Types |
| :--- | :--- | :--- |
| **Grands Titres (H1, H2)** | Bebas Neue / Outfit (Bold/Black) | Fort impact, souvent en majuscules ou géométrique massif. |
| **Titres Éditoriaux / Citations** | Instrument Serif | Élégance, courbes fluides, souvent mixé avec de l'italique. |
| **Texte courant (Paragraphes, Blog)** | Outfit (300/400) | Clarté, lisibilité fine pour les blocs textes longs. |
| **Boutons, Tags, Micro-Labels** | Futura | Très structuré, capitales (uppercase), fort espacement des lettres (`letter-spacing: 0.2em` à `0.3em`). |

---
**Note d'implémentation :**  
Dans le framework Next.js du site et de son blog, les polices Google (*Outfit*, *Bebas Neue*, *Instrument Serif*) assurent une compatibilité multi-navigateur tout en conférant cette touche premium, tandis que des polices comme *Futura* en inline renforcent l'aspect technique et avant-gardiste cher à "Africa Centred Technology".
