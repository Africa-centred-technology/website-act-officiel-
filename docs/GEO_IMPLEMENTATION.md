# GEO — Generative Engine Optimization
## Document d'implémentation — Africa Centred Technology

> **Objectif** : Maximiser la visibilité d'ACT dans les réponses générées par les LLMs (ChatGPT, Claude, Perplexity, Gemini, Copilot…) et les moteurs de recherche IA.

---

## 1. Qu'est-ce que le GEO ?

Le GEO (Generative Engine Optimization) est l'ensemble des techniques qui permettent à un site d'être cité, référencé et résumé correctement par les intelligences artificielles génératives.

Contrairement au SEO classique (optimisation pour les crawlers de liens), le GEO cible :
- Les **LLMs** qui indexent le web (GPTBot, ClaudeBot, PerplexityBot…)
- Les **AI Overviews** de Google (résumés IA en haut des SERP)
- Les **assistants conversationnels** qui citent des sources
- Les **moteurs de recherche IA** (Perplexity, You.com, Bing Copilot…)

---

## 2. État d'implémentation

### 2.1 Fichiers GEO

| Fichier | Statut | Rôle |
|---|---|---|
| `public/llms.txt` | ✅ Fait | Guide textuel structuré pour les LLMs — standard emergent (Anthropic, OpenAI) |
| `src/app/robots.ts` | ✅ Fait | Autorise explicitement 14 crawlers IA |
| `src/i18n/seo-jsonld.ts` | ✅ Partiel | Schemas JSON-LD (WebSite, Organization, Course, Article, FAQ) |

### 2.2 Schemas JSON-LD

| Schema | Fonction | Statut | Déployé sur |
|---|---|---|---|
| `Organization` | Identité ACT, coordonnées, réseaux | ✅ Fait | Toutes les pages (`[locale]/layout.tsx`) |
| `WebSite` | Sitelinks SearchAction | ✅ Fait | Toutes les pages (`[locale]/layout.tsx`) |
| `Course` | Détail d'une formation | ✅ Fait | Pages `/formations/[slug]` |
| `Article` | Articles de blog + `speakable` | ✅ Fait | Pages `/blog/[slug]` |
| `BreadcrumbList` | Fil d'Ariane | ✅ Fait | Pages internes |
| `FAQPage` | Questions-réponses sur les services/formations | ⚠️ Helper créé, non déployé | — |

### 2.3 Crawlers IA autorisés dans robots.txt

```
GPTBot, ChatGPT-User, OAI-SearchBot   → OpenAI (ChatGPT / GPT-4o search)
ClaudeBot, anthropic-ai, Claude-Web   → Anthropic (Claude)
PerplexityBot                         → Perplexity AI
Google-Extended, Googlebot            → Google AI Overviews / Gemini
FacebookBot                           → Meta AI (Llama)
Bingbot                               → Microsoft Copilot
cohere-ai                             → Cohere
CCBot                                 → Common Crawl (base LLM)
YouBot                                → You.com
```

---

## 3. Ce qui manque (actions prioritaires)

### P1 — Impact fort, effort faible

#### 3.1 `knowsAbout` sur Organization schema
Les LLMs utilisent cette propriété pour associer ACT aux requêtes métier.

```typescript
// Dans organizationJsonLd() — src/i18n/seo-jsonld.ts
knowsAbout: [
  "Intelligence Artificielle",
  "Ingénierie Logicielle",
  "Cloud Computing",
  "Data Science",
  "Formation Technologique",
  "Transformation Digitale",
  "Géomatique",
  "Automatisation IA Agentique",
  "Architecture Microservices",
],
```

#### 3.2 `founder` + `foundingDate` + `areaServed` sur Organization

```typescript
founder: { "@type": "Person", name: "Aldrin Djourobi" },
foundingDate: "2026",
areaServed: ["MA", "Africa", "FR", "BE", "CH"],
numberOfEmployees: { "@type": "QuantitativeValue", minValue: 1, maxValue: 10 },
```

#### 3.3 Déployer `faqJsonLd()` sur la page formations

Fichier : `src/app/[locale]/formations/page.tsx` ou `FormationsShell.tsx`

```typescript
import { faqJsonLd } from "@/i18n/seo-jsonld";
import { JsonLd } from "@/components/seo/JsonLd";

const faq = faqJsonLd([
  {
    question: "Quelles formations propose ACT ?",
    answer: "ACT propose des formations en IA, Data Science, Cloud Computing et développement logiciel, en présentiel et à distance, pour étudiants et professionnels.",
  },
  {
    question: "Les formations ACT sont-elles certifiantes ?",
    answer: "Oui, les formations ACT délivrent des attestations de complétion et sont alignées sur les certifications professionnelles reconnues du secteur.",
  },
  {
    question: "ACT forme-t-il les entreprises (B2B) ?",
    answer: "Oui, ACT propose des programmes sur mesure pour les équipes d'entreprises au Maroc et en Afrique subsaharienne.",
  },
]);
// Puis : <JsonLd data={faq} />
```

#### 3.4 Déployer `faqJsonLd()` sur la page services

Fichier : `src/app/[locale]/services/page.tsx` ou `ServicesShell.tsx`

```typescript
const faq = faqJsonLd([
  {
    question: "Quels services d'ingénierie logicielle propose ACT ?",
    answer: "ACT développe des applications web, mobile et d'entreprise sur mesure, des agents IA autonomes, des architectures cloud (AWS, Azure, GCP) et des pipelines de données.",
  },
  {
    question: "ACT intervient-il hors du Maroc ?",
    answer: "Oui, ACT intervient sur l'ensemble du continent africain ainsi qu'en Europe francophone (France, Belgique, Suisse).",
  },
  {
    question: "Comment obtenir un devis pour un projet ?",
    answer: "Via le formulaire de contact sur https://www.a-ct.ma/fr/contact ou par email à contact@a-ct.ma.",
  },
]);
```

### P2 — Impact moyen, effort moyen

#### 3.5 `dateModified` dans les métadonnées des pages

Dans chaque `generateMetadata()` :
```typescript
export async function generateMetadata() {
  return {
    other: {
      "article:modified_time": new Date().toISOString(),
    },
  };
}
```

#### 3.6 Enrichir `llms.txt` avec le catalogue formations

Ajouter dans `public/llms.txt` une section `## Catalogue de formations` avec les titres, niveaux et durées des formations Shopify. À régénérer à chaque ajout de formation.

#### 3.7 `speakable` sur la page d'accueil

Dans le `HomeShell` ou `layout.tsx`, ajouter un schema `WebPage` avec `speakable` :

```typescript
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Africa Centred Technology — IA & Ingénierie Logicielle au Maroc",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".hero-subtitle", ".tagline"],
  },
  url: "https://www.a-ct.ma/fr",
}
```

### P3 — Impact faible, effort faible

#### 3.8 `llms-full.txt`

Certains crawlers (You.com, Cohere) cherchent `/llms-full.txt` pour un contenu plus détaillé. Créer `public/llms-full.txt` avec une description complète de chaque service et formation.

#### 3.9 `alternativeHeadline` + `keywords` sur Article

```typescript
// Dans articleJsonLd()
alternativeHeadline: opts.excerpt.substring(0, 110),
keywords: opts.tags?.join(", "),
```

---

## 4. Vérifications sociales (sameAs)

Les URLs `sameAs` dans `organizationJsonLd()` sont des estimations basées sur le nom de l'entreprise. **À vérifier et corriger** :

```typescript
sameAs: [
  "https://www.linkedin.com/company/africa-centred-technology",  // ← vérifier
  "https://www.facebook.com/africacentredtechnology",            // ← vérifier
  "https://www.instagram.com/africa_centred_technology",         // ← vérifier
  "https://www.youtube.com/@africacentredtechnology",            // ← vérifier
],
```

Si un profil n'existe pas encore, **ne pas laisser de fausse URL** — supprimer l'entrée.

---

## 5. Outils de test et validation

| Outil | Usage | URL |
|---|---|---|
| Google Rich Results Test | Valider JSON-LD | https://search.google.com/test/rich-results |
| Schema.org Validator | Vérifier la syntaxe | https://validator.schema.org |
| Bing Webmaster Tools | Voir l'indexation Bing/Copilot | https://www.bing.com/webmasters |
| Google Search Console | AI Overviews + indexation | https://search.google.com/search-console |
| llms.txt checker | Valider la syntaxe llms.txt | https://llmstxt.org/validator |

---

## 6. Checklist de déploiement GEO

### Avant mise en production
- [ ] Vérifier et corriger les URLs `sameAs` (LinkedIn, Facebook, Instagram, YouTube)
- [ ] Déployer `faqJsonLd()` sur la page formations
- [ ] Déployer `faqJsonLd()` sur la page services
- [ ] Ajouter `knowsAbout` + `founder` + `foundingDate` dans `organizationJsonLd()`
- [ ] Valider les schemas avec Google Rich Results Test

### Après mise en production
- [ ] Soumettre le sitemap dans Google Search Console
- [ ] Soumettre le sitemap dans Bing Webmaster Tools
- [ ] Tester `https://www.a-ct.ma/llms.txt` (accessible publiquement)
- [ ] Vérifier le rendu des AI Overviews Google sur des requêtes ciblées
- [ ] Créer les comptes Clarity (`NEXT_PUBLIC_CLARITY_PROJECT_ID`) et Hotjar (`NEXT_PUBLIC_HOTJAR_SITE_ID`)

---

## 7. Roadmap GEO — priorités

```
Semaine 1 (maintenant)
  ├── P1.1 → knowsAbout + founder + areaServed sur Organization
  ├── P1.2 → faqJsonLd() déployé sur /formations
  └── P1.3 → faqJsonLd() déployé sur /services

Semaine 2
  ├── P2.1 → Enrichir llms.txt avec catalogue formations
  └── P2.2 → speakable sur home page

Semaine 3+
  ├── P3.1 → llms-full.txt
  ├── P3.2 → dateModified dans les métadonnées
  └── P3.3 → alternativeHeadline + keywords sur articles
```

---

*Document généré le 16 mai 2026 — à mettre à jour à chaque évolution GEO.*
