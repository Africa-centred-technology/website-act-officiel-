# Guide Shopify — Back-office & contenus par défaut (stratégie hybride)

Stratégie adoptée : **Hybride**.

- 📦 **Shopify** pilote uniquement les données spécifiques à chaque formation
- 💻 **Code** (fichier `src/lib/data/formation-defaults.ts`) pilote tous les contenus marketing partagés (témoignages, FAQ, CTA, marquee, etc.)

> Boutique : `act-formation.myshopify.com`
> 1 produit Shopify = 1 formation
> Namespace metafields : `custom`

---

## 1. Ce qui vient de Shopify (par formation)

Ces champs **varient d'une formation à l'autre**. Ils doivent être remplis dans le back-office pour chaque produit.

| Section affichée | Clé Shopify | Type | Obligatoire |
|---|---|---|---|
| Titre H1 + product card | `title` (produit) | natif | ✅ |
| Handle / URL | `handle` (produit) | natif | ✅ |
| Image hero (fond) | 1ʳᵉ `image` produit | natif | ✅ |
| Prix product card + formule Pro | `priceRange.minVariantPrice` | natif | ✅ |
| Eyebrow hero (durée) | `custom.duree` | Single line | ✅ |
| Lede / accroche | `custom.accroche` (fallback = `description`) | Multi-line | ✅ |
| Product card · Secteur (tag) | `custom.secteur` | Single line | ✅ |
| Product card · Durée | `custom.duree` | Single line | ✅ |
| Product card · Format | `custom.format` | Single line | ✅ |
| Product card · Niveau | `custom.niveau` | Single line | ✅ |
| Section VALUE (6 items) | `custom.objectifs_pedagogiques` | JSON array | ✅ |
| Section PROGRAMME (timeline) | `custom.programme` | JSON array | ✅ |
| Section AUDIENCE (cartes) | `custom.public_cible_act` | JSON array | ⚠️ (fallback = 4 cartes génériques) |
| FAQ Q1 (prérequis) | `custom.prerequis_` | Multi-line | ⚠️ |
| Filtrage catalogue | `custom.categorie` | Single line | ⚠️ |
| (Réservé) | `custom.parcours`, `custom.methode`, `custom.livrables` | — | ⚠️ |

### 1.1 Formats JSON de référence

**`objectifs_pedagogiques`** (6 items recommandés) :
```json
[
  "Maîtriser le framework CRAFT pour rédiger des prompts efficaces",
  "Cartographier les 4-6 outils IA adaptés à votre métier",
  "Créer votre propre agent GPT personnalisé",
  "Automatiser vos tâches répétitives avec Make/Zapier",
  "Appliquer le cadre RGPD & IA Act",
  "Construire une feuille de route 30/60/90 jours"
]
```

**`programme`** (4 modules recommandés) :
```json
[
  {
    "module": "Cartographier l'IA pour son métier",
    "details": [
      "Panorama 2026 : générative, agentique, RAG, multimodale",
      "Le bon outil pour chaque tâche",
      "Audit de vos tâches chronophages",
      "Plan de déploiement personnel"
    ],
    "duree": "3h30"
  }
]
```

**`public_cible_act`** :
```json
["Dirigeants & CODIR", "Managers", "Marketing", "Consultants", "RH"]
```

---

## 2. Ce qui reste en code (partagé sur toutes les formations)

Ces contenus sont **identiques** sur chaque fiche formation → pilotés par le fichier [`src/lib/data/formation-defaults.ts`](../src/lib/data/formation-defaults.ts).

Pour les modifier : **éditer ce fichier + rebuild**.

| Section | Constante exportée |
|---|---|
| Marquee (bande défilante social proof) | `DEFAULT_MARQUEE_ITEMS` |
| Hero trust stats (×4 chiffres) | `DEFAULT_TRUST_STATS` |
| Pain points (3 cards) | `DEFAULT_PAIN_POINTS` |
| Value ROI (10h, ×4, -60%) | `DEFAULT_VALUE_ROI` |
| Outils couverts (pills) | `DEFAULT_TOOLS_COVERED` |
| Audience fallback | `DEFAULT_AUDIENCE_CARDS` |
| Testimonials (3 cartes) | `DEFAULT_TESTIMONIALS` |
| Pricing (3 formules) | `getDefaultPricingPlans(formation.prix)` |
| FAQ (6 Q/R) | `getDefaultFaqItems(formation.prerequis)` |
| Mid CTA banner | `DEFAULT_MID_CTA` |
| Final CTA | `DEFAULT_FINAL_CTA` |
| Places session (7/12, 5 restantes) | `DEFAULT_PLACES_SESSION` |
| Prix barré (6 500 MAD) | `DEFAULT_PRIX_BARRE` |

### 2.1 Pourquoi ce choix

- ✅ Pas besoin de dupliquer ces contenus dans Shopify **pour chaque formation** (gain de temps énorme côté saisie).
- ✅ Cohérence garantie : si la stat passe de `+400` à `+500 pros formés`, 1 ligne à modifier dans le code.
- ✅ Les témoignages / FAQ / pricing / CTA = **contenu marketing ACT**, pas spécifique à une formation.
- ✅ Le fichier `formation-defaults.ts` peut ensuite servir d'**offre unique** d'override futur via metafield si un jour on veut personnaliser (voir §4).

### 2.2 Injection de données Shopify dans les defaults

Deux fonctions `getDefault…()` **mixent** données Shopify + defaults :

- `getDefaultPricingPlans(formation.prix)` — injecte le prix Shopify dans la formule **Pro · Présentiel**.
- `getDefaultFaqItems(formation.prerequis)` — injecte le champ `prerequis_` dans la réponse de la Q1.

---

## ⚡ Automatisation — scripts prêts à l'emploi

Deux scripts Node.js utilisent votre **Admin Access Token** Shopify pour tout faire en un clic.

### Pré-requis

Dans `.env.local` :
```
SHOPIFY_STORE_DOMAIN=act-formation.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Le token doit avoir les scopes **`read_products`, `write_products`, `read_product_listings`, `write_metafield_definitions`**.

### Étape 1 — Créer les 13 définitions de metafields

```bash
npm run shopify:setup-metafields
```

Sortie attendue :
```
✅  niveau                       créé (single_line_text_field)
✅  secteur                      créé (single_line_text_field)
✅  categorie                    créé (single_line_text_field)
✅  duree                        créé (single_line_text_field)
✅  format                       créé (single_line_text_field)
…
✅  programme                    créé (json)
✅  public_cible_act             créé (json)
✨ Terminé. 13 créé(s), 0 déjà existant(s).
```

Les définitions déjà présentes sont détectées et ignorées → le script est **idempotent** (relançable à volonté).

### Étape 2 — Pré-remplir les formations avec des valeurs exemple

**Une seule formation** :
```bash
npm run shopify:prefill -- --handle integrer-ia-pratique-professionnelle
```

**Toutes les formations actives** :
```bash
npm run shopify:prefill -- --all
```

**Simulation (aucune écriture)** :
```bash
npm run shopify:prefill -- --all --dry-run
```

**Écraser les valeurs existantes** :
```bash
npm run shopify:prefill -- --handle XXX --force
```

> Par défaut, les metafields **déjà renseignés ne sont pas écrasés** — le script remplit uniquement les cases vides.

### Que contient le pré-remplissage ?

Les valeurs exemple sont **génériques** (framework CRAFT, 4 modules type IA, 8 publics cibles, etc.) — idéales comme **point de départ**. Vous devez ensuite ouvrir chaque produit dans Shopify Admin pour adapter :
- Le titre exact et l'accroche
- Le programme spécifique de cette formation
- Les objectifs pédagogiques réels
- Le public cible précis

---

## 3. Workflow de saisie en back-office

### 3.1 Créer une nouvelle formation

1. Shopify Admin → **Products → Add product**
2. Remplir :
   - Titre (apparaît en H1)
   - Description (fallback si pas de metafield `accroche`)
   - Prix (MAD) dans "Pricing"
   - **Image** dans Media (format paysage 2000px+, utilisée en fond de hero)
3. Renseigner les metafields `custom.*` (voir tableau §1)
4. Statut : **Active** + Sales channel `Online Store`

### 3.2 Modifier les contenus partagés (marquee, FAQ, pricing, etc.)

1. Ouvrir [`src/lib/data/formation-defaults.ts`](../src/lib/data/formation-defaults.ts)
2. Modifier la constante concernée (`DEFAULT_MARQUEE_ITEMS`, `DEFAULT_TESTIMONIALS`, `getDefaultFaqItems`, etc.)
3. Commit + déploiement

---

## 4. Évolution future : override par metafield (optionnel)

Si un jour une formation spécifique a besoin de contenus différents (ex. : témoignages sectoriels), la stratégie d'extension serait :

1. Ajouter un metafield `custom.X_override` (ex. `testimonials_override`)
2. Dans `src/lib/shopify/formations.ts`, parser ce metafield
3. Dans `FormationDetailShell.tsx`, prioriser le metafield s'il existe :
   ```ts
   const testimonials = formation.testimonialsOverride?.length
     ? formation.testimonialsOverride
     : DEFAULT_TESTIMONIALS;
   ```

Pour l'instant, **aucun override n'est câblé** → tous les contenus partagés viennent du code.

---

## 5. Checklist mise en ligne d'une formation

- [ ] Titre Shopify rempli
- [ ] Handle / URL vérifié
- [ ] Description **OU** metafield `accroche` rempli
- [ ] **1 image** uploadée (≥ 2000px, paysage)
- [ ] Prix saisi en MAD
- [ ] Metafields obligatoires :
  - [ ] `custom.duree`
  - [ ] `custom.secteur`
  - [ ] `custom.niveau`
  - [ ] `custom.format`
  - [ ] `custom.objectifs_pedagogiques` (JSON array 6+ items)
  - [ ] `custom.programme` (JSON array de modules)
- [ ] Metafields recommandés :
  - [ ] `custom.accroche`
  - [ ] `custom.prerequis_`
  - [ ] `custom.public_cible_act` (JSON array)
- [ ] Produit en statut **Active**
- [ ] Sales channel `Online Store` activé

Le cache Next.js se revalide toutes les **5 minutes**.

---

## 6. Debug

- Console navigateur (F12) : erreurs de parsing JSON loggées (`Failed to parse metafield JSON`, etc.)
- Endpoint direct : `GET /api/shopify/formations/{handle}` retourne le JSON brut
- Metafields vides/mal formatés → fallback silencieux sur la constante par défaut du code (pas de crash)
- Pour changer un témoignage, une FAQ, un prix de formule : **c'est dans le code**, pas Shopify

---

## 7. Synthèse de la répartition

| Type de contenu | Emplacement | Impact |
|---|---|---|
| Spécifique à la formation (titre, prix, programme, objectifs, public) | **Shopify metafields** `custom.*` | 1 édition par formation |
| Marketing partagé (témoignages, FAQ, outils, pricing, CTA) | **Code** `formation-defaults.ts` | 1 édition pour toutes les formations |
| Branding (palette, typo, animations) | **Code** `FormationDetailShell.tsx` + globals.css | Design system |

Cette répartition garantit :
- Autonomie marketing maximale sur Shopify pour les données métier
- Cohérence globale sur les contenus de promotion
- Zéro duplication de saisie
