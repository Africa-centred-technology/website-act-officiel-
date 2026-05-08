# Créer une nouvelle formation dans Shopify

Guide complet pour créer une formation et la remplir avec tous les metafields utilisés par la landing page.

---

## ⚙️ Étape 0 — Setup une seule fois (definitions de metafields)

Avant de pouvoir remplir des metafields sur les produits, il faut créer leur **définition** dans :

**Settings → Custom data → Products → Add definition**

Crée chacune des définitions ci-dessous. Pour chaque définition : `Namespace = custom` · `Key = (voir tableau)` · `Type = (voir tableau)`.

### 🏷️ Métadonnées de base

| Key | Type | Description |
|---|---|---|
| `niveau` | Single line text | Niveau (Débutant, Intermédiaire, Avancé) |
| `secteur` | Single line text | Secteur (ex: "Transversal", "Santé", "Finance") |
| `categorie` | Single line text | Toujours "Intelligence artificielle" |
| `duree` | Single line text | Durée affichée (ex: "1 journée (7h)") |
| `format_suported` | Single line text | Format (ex: "Présentiel ou distanciel") |
| `parcours` | Single line text | Parcours parent (ex: "Claude Code · 1/3") · optionnel |
| `accroche` | Multi-line text | Phrase d'accroche du hero (1-3 phrases) |

### 📚 Contenu pédagogique (JSON)

| Key | Type | Description |
|---|---|---|
| `public_cible_act` | JSON | Liste des publics cibles |
| `prerequis_` | Multi-line text | Prérequis (FAQ default) |
| `Objectifs_pedagogiques` | JSON | Liste des objectifs |
| `programme` | JSON | Modules avec détails |
| `livrables` | JSON | Liste des livrables |
| `methode` | Multi-line text | Méthode pédagogique |

### 💰 Tarification

| Key | Type | Description |
|---|---|---|
| `pricing_plans` | JSON | Les 3 plans (Inter / Intra / Personnalisée) — remplace les anciens prix_public, places, promo_label |

### 👥 Équipe & outils

| Key | Type | Description |
|---|---|---|
| `experts_concepteurs` | JSON | Liste des experts (max 4 affichés) |
| `outils_couverts` | JSON | Outils IA couverts |

### 📄 Lead magnet

| Key | Type | Description |
|---|---|---|
| `brochure` | File · PDF | PDF de brochure |

### 🎯 Angles marketing PAS

| Key | Type | Description |
|---|---|---|
| `hook_pain` | Single line text | Titre dramatique section "Le constat" |
| `hook_pain_question` | Single line text | Question rhétorique italique |
| `promesse_titre` | Single line text | Réponse à la question (avec →) |
| `tagline_action` | Single line text | Titre du Final CTA |
| `usp_banner` | Single line text | Bandeau gold au-dessus du hero |
| `cafe_label` | Single line text | CTA ghost final |
| `pain_points` | JSON | 3 cartes "symptômes" |

### 📅 Session

| Key | Type | Description |
|---|---|---|
| `session_date` | Single line text | Date longue ("30 mai 2026") |
| `session_lieu` | Single line text | Lieu ("Casablanca · Atelier") |
| `session_date_courte` | Single line text | Badge top-right ("SAMEDI 30 MAI") |

### 📢 Bandeau & FAQ

| Key | Type | Description |
|---|---|---|
| `announcement_items` | JSON | Annonces marquee de la sticky bar |
| `faq_items` | JSON | Questions / réponses dépliables |

**Total : 30 définitions de metafields à créer une seule fois.**

---

## 📝 Étape 1 — Créer le produit Shopify

Dans **Products → Add product** :

### Champs natifs Shopify

| Champ | Valeur |
|---|---|
| **Title** | Titre de la formation (ex: "Démystifier ChatGPT & Compagnie") |
| **Description** | Description courte (utilisée comme fallback si `accroche` vide) |
| **Media** | Upload 1-10 images (utilisées en fond hero + cartes pain/audience) |
| **Pricing** | Prix actuel en MAD (ex: 990) — ce prix s'affiche dans la carte hero et le plan Inter |
| **Status** | Active |
| **Sales channels** | ✅ Online Store (sinon invisible côté Storefront API) |
| **Product type** | "Formation" (recommandé) |
| **Vendor** | "ACT University" (recommandé) |
| **Handle** | URL slug (ex: `democratiser-chatgpt-compagnie`) — auto-généré, ajustable |

### Tags (optionnels mais utiles)

Format `key:value` séparés par virgules :
```
secteur:Transversal · IA, prompt-engineering, niveau:debutant
```

---

## 📋 Étape 2 — Remplir les metafields (checklist par formation)

Sur la page produit, descends à la section **Metafields** et remplis les champs ci-dessous.

### ✅ Minimum obligatoire (pour que la page s'affiche correctement)

- [ ] `accroche` — 1-2 phrases courtes pour le hero
- [ ] `niveau` — ex: "Débutant"
- [ ] `secteur` — ex: "Transversal"
- [ ] `duree` — ex: "1 journée (7h)"
- [ ] `format_suported` — ex: "Présentiel ou distanciel"
- [ ] `Objectifs_pedagogiques` — voir format JSON ci-dessous
- [ ] `programme` — voir format JSON ci-dessous
- [ ] `livrables` — voir format JSON ci-dessous
- [ ] `pricing_plans` — voir format JSON ci-dessous

### 🎯 Recommandé (pour activer le copywriting marketing)

- [ ] `hook_pain` — titre punchy section "Le constat"
- [ ] `hook_pain_question` — question dramatique
- [ ] `promesse_titre` — réponse-pivot
- [ ] `tagline_action` — titre Final CTA
- [ ] `usp_banner` — bandeau positionnement
- [ ] `cafe_label` — bouton ghost final

### 📅 Si la formation a une session planifiée

- [ ] `session_date` — date longue
- [ ] `session_lieu` — lieu
- [ ] `session_date_courte` — badge

### 🏆 Pour différencier la formation

- [ ] `experts_concepteurs` — liste des 4 experts
- [ ] `outils_couverts` — outils IA présentés
- [ ] `pain_points` — 3 cartes symptômes spécifiques
- [ ] `announcement_items` — annonces marquee
- [ ] `faq_items` — FAQ spécifique
- [ ] `brochure` — upload PDF de brochure
- [ ] `public_cible_act` — publics cibles
- [ ] `prerequis_` — prérequis
- [ ] `methode` — méthode pédagogique

---

## 📦 Formats JSON à coller

### `Objectifs_pedagogiques`

```json
{
  "objectifs": [
    "Comprendre ce que l'IA générative peut — et ne peut pas — faire",
    "Identifier les cas d'usage pertinents dans son métier",
    "Utiliser ChatGPT, Claude, Copilot, Gemini efficacement",
    "Rédiger des instructions efficaces (prompt engineering)",
    "Évaluer les sorties IA avec un regard critique",
    "Construire une routine de travail intégrant l'IA"
  ]
}
```

### `programme`

```json
{
  "programme": [
    {
      "module": "Comprendre l'IA générative",
      "duree": "1h",
      "details": [
        "Qu'est-ce que l'IA générative ? Démystifier sans simplifier",
        "Les grands modèles de langage : comment fonctionnent-ils ?",
        "Ce que l'IA fait bien, ce qu'elle invente",
        "Panorama des outils 2024-2025"
      ]
    },
    {
      "module": "Identifier ses propres cas d'usage",
      "duree": "1h30",
      "details": [
        "Cartographie des tâches chronophages",
        "Quelles tâches déléguer à l'IA",
        "Atelier : audit de ses activités hebdomadaires"
      ]
    }
  ]
}
```

### `livrables`

```json
{
  "livrables": [
    "Un plan d'intégration personnalisé (3 usages concrets)",
    "Une bibliothèque de prompts prêts à l'emploi",
    "Un accès aux ressources et outils présentés",
    "Une attestation de participation ACT"
  ]
}
```

### `public_cible_act`

```json
{
  "metiers": [
    "Cadres et managers",
    "Consultants",
    "Marketing et communication",
    "RH et formation",
    "Entrepreneurs et TPE"
  ]
}
```

### `pricing_plans`

```json
{
  "pricing": [
    {
      "title": "Inter",
      "description": "Session inter-entreprises · ouverte aux inscriptions individuelles.",
      "amount": "990",
      "currency": "MAD HT",
      "old_price": "1 500 MAD",
      "badge": "★ Le plus choisi",
      "featured": true,
      "cta_label": "Je m'inscris",
      "cta_type": "inscription",
      "features": [
        "Session planifiée à dates fixes",
        "Jusqu'à 12 participants multi-entreprises",
        "Tous les templates & prompts",
        "Agent GPT personnalisé",
        "Attestation de fin de formation",
        "Accès replay 6 mois"
      ]
    },
    {
      "title": "Intra",
      "description": "Dans vos locaux · pour vos équipes · à partir de 6 personnes.",
      "amount": "Sur devis",
      "old_price": "Réponse sous 24h",
      "featured": false,
      "cta_label": "Demander un devis",
      "cta_type": "contact",
      "features": [
        "Formation dans vos locaux",
        "Vos cas métier réels en atelier",
        "Audit IA des process avant démarrage",
        "Suivi privé Slack · 30 jours",
        "Rapport de recommandations post-formation",
        "Suivi 90 jours inclus"
      ]
    },
    {
      "title": "Personnalisée",
      "description": "Programme 100% sur-mesure · co-construit avec un expert ACT.",
      "amount": "Sur devis",
      "old_price": "Réponse sous 24h",
      "featured": false,
      "cta_label": "Demander un devis",
      "cta_type": "contact",
      "features": [
        "Programme 100% sur-mesure",
        "Combinaison de plusieurs formations",
        "Format flexible (durée, modalité, lieu)",
        "Co-construction avec un expert ACT",
        "Formation de formateurs en option",
        "Accompagnement long terme"
      ]
    }
  ]
}
```

### `experts_concepteurs`

```json
{
  "experts": [
    {
      "nom": "Sohaib Baroud",
      "role": "Lead AI Engineer",
      "photo": "https://cdn.shopify.com/s/files/.../sohaib.jpg"
    },
    {
      "nom": "Aldrin Djourobi",
      "role": "AI Strategy Advisor",
      "photo": "https://cdn.shopify.com/s/files/.../aldrin.jpg"
    },
    {
      "nom": "Expert 3",
      "role": "Domain Specialist"
    },
    {
      "nom": "Expert 4",
      "role": "Pedagogical Designer"
    }
  ]
}
```

> **Note** : les champs `bio` et `photo` sont optionnels. Sans `photo`, un cercle orange avec la première lettre du nom est affiché.

### `outils_couverts`

**Format simple** (couleurs alternées auto) :
```json
{
  "outils": [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Microsoft Copilot",
    "Perplexity"
  ]
}
```

**Format avancé** (couleur manuelle) :
```json
{
  "outils": [
    { "name": "ChatGPT", "color": "orange" },
    { "name": "Claude", "color": "gold" }
  ]
}
```

### `pain_points`

```json
{
  "pain_points": [
    {
      "title": "Vous testez tout, vous maîtrisez rien",
      "text": "ChatGPT le matin, Claude l'après-midi, Gemini le soir. Vous papillonnez sans aller au fond."
    },
    {
      "title": "Vos prompts sortent du générique",
      "text": "Le résultat est correct mais jamais excellent. Vous repassez derrière à chaque fois."
    },
    {
      "title": "Pas de méthode = pas de gain",
      "text": "Vous gagnez 20 minutes ici, en perdez 30 là. Bilan neutre à la fin du mois."
    }
  ]
}
```

> **Note** : `image_url` est optionnel. Sans image_url, fallback sur les images du produit Shopify.

### `announcement_items`

```json
{
  "items": [
    "Offre de lancement · Démystifier ChatGPT à 990 DH au lieu de 1 500 DH",
    "Prochaine session · Samedi 30 mai 2026 · Casablanca",
    "Conçue par 4 experts ACT qui vous assistent",
    "Discutons-en autour d'un café avant de réserver",
    "Téléchargez gratuitement la brochure complète"
  ]
}
```

### `faq_items`

```json
{
  "faq": [
    {
      "question": "Je suis débutant total. Est-ce que je vais suivre ?",
      "answer": "Oui — aucun prérequis n'est demandé. 60% de nos stagiaires découvrent ChatGPT le jour 1."
    },
    {
      "question": "Combien de temps avant de voir un retour sur investissement ?",
      "answer": "En moyenne, nos stagiaires récupèrent 10h par semaine dès la première semaine."
    },
    {
      "question": "Et si je ne peux pas venir à Casablanca ?",
      "answer": "La formule Inter se déroule 100% en distanciel, en live avec le formateur."
    },
    {
      "question": "Et le RGPD / les données sensibles ?",
      "answer": "Un module complet est dédié à l'usage éthique et conforme : RGPD, IA Act, paramètres confidentialité."
    },
    {
      "question": "Si je ne suis pas satisfait ?",
      "answer": "Garantie satisfait ou remboursé à la fin du jour 1."
    }
  ]
}
```

---

## 🎯 Étape 3 — Marketing angles (optionnel mais fortement recommandé)

Pour matcher tes campagnes ads et avoir une page percutante :

### `hook_pain` — Titre pain section

Exemples :
- "Même outils, même brief : résultats pas à la hauteur de vos attentes."
- "Vous utilisez ChatGPT, mais vos heures de travail ne diminuent pas."
- "Copilot écrit du code. Mais le code n'est pas votre vrai problème."

### `hook_pain_question` — Question dramatique

Exemples :
- "Vous vous demandez pourquoi ?"
- "Et si la différence n'était pas une question de talent ?"
- "Combien d'heures par semaine perdez-vous sur des tâches répétitives ?"

### `promesse_titre` — Réponse-pivot (avec flèche →)

Exemples :
- "La réponse n'est pas dans l'outil, mais dans la méthode."
- "Avec la bonne méthode, oui. Sans elle, jamais."
- "Ce n'est pas le talent. C'est la méthode CRAFT."

### `tagline_action` — Titre Final CTA

Exemples :
- "Arrêtez de subir. Commencez à maîtriser."
- "Arrêtez de tester. Commencez à automatiser."
- "Codez moins. Livrez plus."

### `usp_banner` — Bandeau positionnement (top hero)

Universel : `"La seule formation IA au Maroc faite par 4 experts qui vous assistent"`

### `cafe_label` — Bouton ghost final

Universel : `"On en parle autour d'un café ?"`

---

## ✅ Checklist finale avant publication

- [ ] Produit Shopify créé et **Status: Active**
- [ ] **Online Store** activé dans Sales channels
- [ ] Title + Description + Prix remplis
- [ ] Au moins 1 image média uploadée
- [ ] Tous les metafields obligatoires remplis (voir Étape 2)
- [ ] Brochure PDF uploadée dans `custom.brochure`
- [ ] Test sur le site : `/formations/{handle}`
  - [ ] La page s'affiche sans erreur
  - [ ] Les 3 plans pricing apparaissent (Inter en avant)
  - [ ] Le bandeau marquee défile
  - [ ] Les 3 pain cards apparaissent
  - [ ] Les experts sont affichés
  - [ ] Le CTA Réserver ouvre bien le modal
  - [ ] Le bouton brochure ouvre le PDF
- [ ] Cache invalidé (5 min après update Shopify, ou redémarre dev)

---

## 🛠️ Bulk fill via script

Pour pousser tous les metafields d'une formation en une fois (au lieu de les remplir un par un) :

1. Édite [scripts/data/formations-content.json](../scripts/data/formations-content.json) en ajoutant ton handle et ses valeurs
2. Lance :
   ```bash
   node scripts/shopify-fill-content.mjs --handle <handle> --dry-run   # simulation
   node scripts/shopify-fill-content.mjs --handle <handle>             # écriture réelle
   node scripts/shopify-fill-content.mjs --handle <handle> --force     # écrase l'existant
   ```

Le script gère automatiquement les types (text, JSON, integer, URL).

---

## 🆘 Troubleshooting

### La page reste sur le contenu par défaut

- Vérifie que les metafields sont bien sauvegardés dans Shopify
- Cache Storefront API = 5 min · attends ou redémarre `npm run dev`
- Vérifie via curl :
  ```bash
  curl -s -X POST "https://act-formation.myshopify.com/api/2024-01/graphql.json" \
    -H "Content-Type: application/json" \
    -H "X-Shopify-Storefront-Access-Token: <token>" \
    -d '{"query":"{ product(handle:\"<handle>\") { metafields(identifiers:[{namespace:\"custom\",key:\"<key>\"}]) { key value } } }"}'
  ```

### JSON refusé par Shopify

- Le metafield doit être de type **JSON** (pas Single line text)
- Vérifie que le JSON est valide (pas de virgule traînante, guillemets droits `"`)
- Caractères spéciaux : utilise `\"` pour les guillemets internes

### La brochure ne se télécharge pas

- Le metafield `custom.brochure` doit être de type **File** (pas URL)
- Le fichier doit être uploadé dans Shopify Files
- Restart le dev server pour invalider le cache

### Le pricing affiche les valeurs par défaut

- Vérifie que `custom.pricing_plans` est bien rempli avec le format JSON exact
- Les champs requis par plan : `title`, `amount`, `cta_label`, `features` (array)
- `cta_type` doit être `"inscription"` ou `"contact"`
