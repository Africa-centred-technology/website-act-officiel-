# Guide GEO — Generative Engine Optimization
## Comment fonctionne le référencement dans les IA génératives

---

## 1. C'est quoi le GEO ?

Le **GEO** (Generative Engine Optimization) est l'équivalent du SEO, mais pour les intelligences artificielles génératives.

Quand un utilisateur pose une question à ChatGPT, Claude, Perplexity ou Google AI Overviews, ces systèmes ne font pas une simple recherche de liens — ils **génèrent une réponse** en synthétisant les informations qu'ils ont indexées. Le GEO consiste à s'assurer que votre contenu est **bien compris, bien structuré et bien cité** par ces systèmes.

### SEO vs GEO

| SEO classique | GEO |
|---|---|
| Optimise pour les crawlers de liens (Googlebot) | Optimise pour les LLMs (GPTBot, ClaudeBot…) |
| Objectif : apparaître dans les résultats de recherche | Objectif : être cité dans les réponses générées |
| Levier principal : backlinks + mots-clés | Levier principal : clarté sémantique + structure + autorité |
| Mesure : ranking de page | Mesure : mention dans les réponses IA |

---

## 2. Comment les LLMs indexent votre site

### 2.1 Les crawlers IA

Les LLMs disposent de leurs propres robots d'exploration du web, distincts de Googlebot. Chaque éditeur IA envoie son propre crawler :

| Crawler | IA associée |
|---|---|
| `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` | OpenAI (ChatGPT, GPT-4o search) |
| `ClaudeBot`, `anthropic-ai`, `Claude-Web` | Anthropic (Claude) |
| `PerplexityBot` | Perplexity AI |
| `Google-Extended` | Google AI Overviews / Gemini |
| `FacebookBot` | Meta AI (Llama) |
| `Bingbot` | Microsoft Copilot |
| `cohere-ai` | Cohere |
| `CCBot` | Common Crawl (base d'entraînement des LLMs) |
| `YouBot` | You.com |

Ces crawlers lisent votre `robots.txt` pour savoir s'ils sont autorisés, puis explorent votre contenu HTML et vos fichiers texte statiques.

### 2.2 Ce que les LLMs lisent

Les LLMs traitent plusieurs types de contenu sur votre site :

1. **Le HTML brut** : le texte visible de vos pages, les balises `<title>`, `<h1>`, `<meta description>`, etc.
2. **Les données structurées JSON-LD** : des blocs de données machine-readable injectés dans le `<head>` de vos pages, qui décrivent explicitement ce qu'est votre organisation, vos articles, vos formations, etc.
3. **Les fichiers texte GEO** : `llms.txt` et `llms-full.txt`, des fichiers texte en Markdown que les crawlers IA lisent directement, conçus pour être résumés facilement.
4. **Le sitemap XML** : pour découvrir toutes les URLs du site.

---

## 3. Les 4 leviers du GEO

### Levier 1 — `robots.txt` : autoriser les crawlers

C'est le prérequis fondamental. Si un crawler IA est bloqué dans `robots.txt`, il n'indexera rien.

**Fichier** : `src/app/robots.ts`

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /
...
```

Sans cette autorisation explicite, certains crawlers respectueux des règles se bloquent eux-mêmes.

---

### Levier 2 — `llms.txt` / `llms-full.txt` : le résumé pour les LLMs

Standard émergent initié par Anthropic et adopté par OpenAI. Ces fichiers texte en Markdown sont placés à la racine du site et servent de **guide de lecture** pour les LLMs.

- `/llms.txt` : version courte (~150 lignes), résumé structuré de l'entreprise, ses activités et ses pages clés.
- `/llms-full.txt` : version longue (~300 lignes), description exhaustive de chaque service, formation, FAQ étendue.

**Pourquoi ça marche** : les LLMs sont entraînés à traiter le Markdown. Un fichier structuré avec des titres `##`, des listes `-` et des liens est plus facilement parseable qu'une page HTML complexe avec des menus, des modales et du JavaScript.

**Emplacement dans le projet** :
```
public/
└── geo/
    ├── llms.txt
    └── llms-full.txt
```

Les rewrites Next.js dans `next.config.ts` redirigent `/llms.txt` → `/geo/llms.txt` de façon transparente pour les crawlers.

---

### Levier 3 — JSON-LD : les données structurées

Le JSON-LD (JavaScript Object Notation for Linked Data) est un bloc de données injecté dans le `<head>` de chaque page. Il décrit explicitement le contenu de la page en utilisant le vocabulaire [schema.org](https://schema.org), un standard co-développé par Google, Microsoft, Yahoo et Yandex.

**Pourquoi c'est important pour le GEO** : les LLMs ne devinent pas ce qu'est votre entreprise — ils lisent les données structurées pour le savoir avec certitude. Un `Organization` schema avec `knowsAbout` est une déclaration explicite d'expertise.

#### Schemas déployés sur le site ACT

| Schema | Page | Ce qu'il communique |
|---|---|---|
| `WebSite` + `SearchAction` | Toutes les pages | L'existence du site et son moteur de recherche interne |
| `Organization` | Toutes les pages | L'identité ACT, ses expertises (`knowsAbout`), ses coordonnées, ses réseaux sociaux |
| `WebPage` + `speakable` | Page d'accueil | Les éléments de la page qui peuvent être lus à voix haute par les assistants IA |
| `FAQPage` | `/formations`, `/services` | Les questions/réponses clés — format idéal pour les réponses directes des LLMs |
| `Course` | `/formations/[slug]` | Le détail de chaque formation (nom, description, prix, prestataire) |
| `Article` | `/blog/[slug]` | Les métadonnées de chaque article (auteur, date, mots-clés, résumé) |
| `BreadcrumbList` | Pages internes | La hiérarchie de navigation — aide les LLMs à comprendre la structure du site |

**Fichier source** : `src/i18n/seo-jsonld.ts`
**Injection** : composant `<JsonLd data={...} />` dans `src/components/seo/JsonLd.tsx`

#### Exemple — Organization schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Africa Centred Technology",
  "alternateName": "ACT",
  "foundingDate": "2026",
  "areaServed": ["MA", "Africa", "FR", "BE", "CH"],
  "knowsAbout": [
    "Intelligence Artificielle",
    "IA Agentique",
    "Ingénierie Logicielle",
    "Cloud Computing",
    "Data Science"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@a-ct.ma",
    "availableLanguage": ["fr", "en", "ar"]
  }
}
```

Un LLM qui lit ce bloc sait immédiatement : ACT est une organisation marocaine spécialisée en IA, fondée en 2026, joignable en français, anglais et arabe.

#### Exemple — FAQPage schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quelles formations propose ACT ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ACT propose des formations en IA, Data Science, Cloud..."
      }
    }
  ]
}
```

Les FAQ schemas sont particulièrement puissants : Google AI Overviews et Perplexity les utilisent directement pour construire leurs réponses en format Q&A.

---

### Levier 4 — Signaux de fraîcheur (`dateModified`)

Les LLMs et les moteurs de recherche IA privilégient le contenu récent. Plusieurs signaux de fraîcheur sont injectés dans les métadonnées de chaque page :

- `article:modified_time` dans les Open Graph meta tags
- `openGraph.modifiedTime` dans les métadonnées Next.js
- `datePublished` / `dateModified` dans les schemas JSON-LD d'articles

**Fichier** : `src/i18n/seo.ts` — fonctions `buildPageMetadata()` et `buildDynamicPageMetadata()`

---

## 4. Architecture GEO du site ACT

```
┌─────────────────────────────────────────────────────────┐
│                    Crawlers IA                          │
│  GPTBot · ClaudeBot · PerplexityBot · Google-Extended   │
└────────────────────┬────────────────────────────────────┘
                     │ lisent
          ┌──────────┼──────────┐
          ▼          ▼          ▼
   robots.txt    llms.txt   HTML + JSON-LD
   (autorise)   (résumé)   (contenu structuré)
                     │
              public/geo/
              ├── llms.txt        → /llms.txt (rewrite)
              └── llms-full.txt   → /llms-full.txt (rewrite)
                     │
              src/i18n/seo-jsonld.ts
              ├── organizationJsonLd()   → layout.tsx (toutes pages)
              ├── websiteJsonLd()        → layout.tsx (toutes pages)
              ├── faqJsonLd()            → /formations, /services
              ├── courseJsonLd()         → /formations/[slug]
              ├── articleJsonLd()        → /blog/[slug]
              └── breadcrumbJsonLd()     → pages internes
```

---

## 5. Comment maintenir le GEO

### 5.1 Ajouter une nouvelle formation

Rien à faire manuellement : le schema `Course` est généré dynamiquement depuis les données Shopify dans `src/app/[locale]/formations/[slug]/page.tsx`. Chaque nouvelle formation publiée sur Shopify obtient automatiquement son schema JSON-LD.

En revanche, **mettre à jour `public/geo/llms.txt`** si la formation représente un nouveau domaine majeur non encore mentionné.

### 5.2 Ajouter un nouvel article de blog

Rien à faire : le schema `Article` avec `keywords` et `alternativeHeadline` est généré automatiquement depuis les données Shopify dans `src/app/[locale]/blog/[slug]/page.tsx`.

### 5.3 Ajouter un nouveau service

1. Créer le service dans `src/lib/data/services.ts`
2. Ajouter une entrée dans `public/geo/llms.txt` (section correspondante)
3. Ajouter une entrée dans `public/geo/llms-full.txt` avec la description complète du service
4. Vérifier que `knowsAbout` dans `organizationJsonLd()` couvre la nouvelle expertise

### 5.4 Mettre à jour les FAQ

Les FAQ schemas sont définis statiquement dans :
- `src/app/[locale]/formations/page.tsx` — constante `FORMATIONS_FAQ`
- `src/app/[locale]/services/page.tsx` — constante `SERVICES_FAQ`

Modifier directement ces constantes pour ajouter ou mettre à jour des Q&A.

### 5.5 Modifier les informations de l'entreprise (adresse, réseaux, langues)

Modifier `organizationJsonLd()` dans `src/i18n/seo-jsonld.ts`. Ce schema est injecté sur **toutes les pages** depuis `src/app/[locale]/layout.tsx`.

---

## 6. Validation et tests

| Outil | Ce qu'il teste | URL |
|---|---|---|
| **Google Rich Results Test** | Valide la syntaxe JSON-LD et l'éligibilité aux rich results | https://search.google.com/test/rich-results |
| **Schema.org Validator** | Vérifie la conformité au vocabulaire schema.org | https://validator.schema.org |
| **llms.txt Validator** | Vérifie la syntaxe du fichier llms.txt | https://llmstxt.org/validator |
| **Google Search Console** | Monitore l'indexation et les AI Overviews | https://search.google.com/search-console |
| **Bing Webmaster Tools** | Monitore l'indexation Bing/Copilot | https://www.bing.com/webmasters |
| **Perplexity** | Tester si ACT est cité dans des réponses | Rechercher "formations IA Maroc" ou "agence IA Afrique" |

### Test rapide en prod

```bash
# Vérifier que llms.txt est accessible
curl https://www.a-ct.ma/llms.txt

# Vérifier que llms-full.txt est accessible
curl https://www.a-ct.ma/llms-full.txt

# Vérifier que robots.txt autorise les crawlers IA
curl https://www.a-ct.ma/robots.txt
```

---

## 7. Ce que le GEO ne fait PAS

- **Il ne garantit pas d'être cité** : les LLMs choisissent leurs sources selon leur entraînement et leurs critères de confiance. Le GEO augmente les chances, il ne les certifie pas.
- **Il ne remplace pas le SEO** : les deux sont complémentaires. Un bon SEO (backlinks, contenu de qualité, vitesse) renforce la crédibilité perçue par les LLMs.
- **Il n'est pas instantané** : les crawlers IA re-indexent à leur propre rythme. Comptez 4 à 12 semaines pour voir l'impact d'une modification.

---

## 8. Fichiers clés du projet

| Fichier | Rôle GEO |
|---|---|
| `public/geo/llms.txt` | Résumé court pour tous les crawlers LLM |
| `public/geo/llms-full.txt` | Guide exhaustif pour You.com, Cohere, etc. |
| `src/app/robots.ts` | Autorisation des 14 crawlers IA |
| `src/i18n/seo-jsonld.ts` | Tous les helpers de schemas JSON-LD |
| `src/i18n/seo.ts` | Métadonnées Next.js + signaux dateModified |
| `src/app/[locale]/layout.tsx` | Injection Organization + WebSite sur toutes les pages |
| `src/app/[locale]/page.tsx` | Schema WebPage + speakable (accueil) |
| `src/app/[locale]/formations/page.tsx` | Schema FAQPage formations |
| `src/app/[locale]/services/page.tsx` | Schema FAQPage services |
| `src/app/[locale]/formations/[slug]/page.tsx` | Schema Course par formation |
| `src/app/[locale]/blog/[slug]/page.tsx` | Schema Article par article |
| `next.config.ts` | Rewrites `/llms.txt` → `/geo/llms.txt` |
| `docs/GEO_IMPLEMENTATION.md` | Suivi d'avancement des tâches GEO |

---

*Documentation rédigée le 16 mai 2026.*
