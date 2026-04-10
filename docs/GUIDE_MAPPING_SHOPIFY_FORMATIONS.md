# 🎓 Guide de Mapping & Récupération Shopify — Formations ACT

Ce document détaille comment configurer les produits dans l'administration Shopify pour qu'ils soient correctement récupérés et affichés par le composant `FormationDetailShell.tsx`.

---

## 1. Configuration des Champs de Base (Shopify Standard)

Ces champs sont natifs à Shopify et utilisés directement par l'API Storefront.

| Champ Shopify | Variable Code | Usage dans l'UI ACT |
| :--- | :--- | :--- |
| **Titre du produit** | `title` | Titre principal (H1) de la page formation. |
| **Handle (URL)** | `slug` | Identifiant unique dans l'URL (`/formations/mon-handle`). |
| **Description HTML** | `descriptionHtml` | Affichée en bas de page si le "Programme" est vide. |
| **Description (Texte)** | `accroche` | Utilisée comme fallback pour l'accroche sous le titre. |
| **Prix (Variante)** | `prix` | Affiché dans le badge tarifaire (Formaté en "Dhs" ou "Nous consulter"). |
| **Images (Media)** | `images` | Si 1 image : affichage fixe. Si > 1 image : **Carrousel automatique** (jusqu'à 3 images récupérées par défaut). |

---

## 2. Configuration des Metafields (Crucial)

Pour l'affichage riche (durée, niveau, programme, etc.), vous devez créer des **Définitions de Metafields** dans :
*Administration Shopify > Paramètres > Données personnalisées > Produits.*

**Namespace obligatoire :** `formation`

### Champs de caractéristiques (Texte simple)

| Clé (Key) | Type Shopify | Usage / Exemple |
| :--- | :--- | :--- |
| `accroche` | Texte (une ligne) | Texte percutant sous le titre. |
| `secteur` | Texte (une ligne) | Ex: `Santé`, `Finance`, `Technologie`. |
| `categorie` | Texte (une ligne) | Ex: `Intelligence Artificielle`. |
| `niveau` | Texte (une ligne) | Ex: `Initiation`, `Expert`, `Intermédiaire`. |
| `duree` | Texte (une ligne) | Ex: `2 jours (14h)`. |
| `format` | Texte (une ligne) | Ex: `Présentiel` ou `Distanciel`. |
| `parcours` | Texte (une ligne) | Nom du parcours diplômant associé. |

### Champs de contenu riche (Texte multiligne)

| Clé (Key) | Type Shopify | Usage |
| :--- | :--- | :--- |
| `public_cible` | Texte multiligne | Affiché dans l'onglet "Public Cible". |
| `prerequis` | Texte multiligne | Section "Prérequis" sous le divider. |
| `methode` | Texte multiligne | Section "Méthode pédagogique". |

---

## 3. Champs de Listes & JSON (Structures Complexes)

Le code ACT est conçu pour parser du JSON ou des listes de textes.

### Objectifs & Livrables
*Type : Liste de textes (List of strings) ou JSON.*
- `objectifs` : Liste des points clés (Onglet "Objectifs").
- `livrables` : Liste des acquis/outils (Sidebar droite).

### Programme Détaillé (JSON)
*Type : JSON (Obligatoire pour l'affichage par modules).*
**Clé :** `formation.programme`

Structure à copier/coller dans le champ Metafield :
```json
[
  {
    "module": "Module 1 : Fondamentaux",
    "details": [
      "Introduction aux concepts clés",
      "Panorama des outils",
      "Études de cas"
    ]
  },
  {
    "module": "Module 2 : Mise en pratique",
    "details": [
      "Atelier dirigé",
      "Optimisation des flux",
      "Évaluation finale"
    ]
  }
]
```

---

## 4. Système de Secours via les Tags (Optionnel)

Si vous ne configurez pas les Metafields, le système tente de lire les **Tags** du produit Shopify avec le préfixe `clé:valeur` :

- `niveau:Initiation`
- `secteur:Santé`
- `duree:7h`
- `format:Hybride`
- `categorie:IA`

---

## 5. Résumé de l'Affichage (Front-end)

- **Hero Section :** Affiche `title`, `accroche`, `imageUrl` et les 4 badges de caractéristiques (`duree`, `format`, `niveau`, `categorie`).
- **Système d'onglets :** Bascule dynamiquement entre `public_cible`, `programme` (JSON) et `objectifs`.
- **Sidebar :** Affiche la liste des `livrables` et le `parcours` suggéré.
- **Modal d'inscription :** Pré-remplit le formulaire avec le `title` du produit pour faciliter la conversion.
