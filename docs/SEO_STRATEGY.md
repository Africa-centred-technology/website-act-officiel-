# Stratégie SEO — Africa Centred Technology
## Document de référence — Mai 2026

> **Contexte** : Départ de zéro. Cibles multiples (B2C, B2B, recrutement, notoriété). Zones : Maroc + Afrique francophone + Europe francophone. Langues : FR (prioritaire), EN, AR.

---

## 1. Les 4 phases de la stratégie

```
Phase 1 (mois 1-2)   → Fondations techniques — rendre le site indexable correctement
Phase 2 (mois 2-4)   → Mots-clés & architecture — définir les piliers de contenu
Phase 3 (mois 3-6)   → Production de contenu — créer la masse de contenu SEO
Phase 4 (mois 6+)    → Autorité & netlinking — gagner des backlinks et de la crédibilité
```

---

## 2. Phase 1 — Fondations techniques

### 2.1 Outils à configurer en priorité absolue

| Outil | Pourquoi | Action |
|---|---|---|
| **Google Search Console** | Suivre l'indexation, les impressions, les clics | Créer le compte, soumettre sitemap |
| **Bing Webmaster Tools** | Bing = Copilot AI, 30% du trafic desktop | Créer le compte, soumettre sitemap |
| **Google Analytics 4** | Mesurer le trafic et les conversions | Installer le tag via `src/app/[locale]/layout.tsx` |
| **Clarity ou Hotjar** | Comprendre le comportement utilisateur | Activer `NEXT_PUBLIC_CLARITY_PROJECT_ID` dans `.env.local` |

### 2.2 Vérifications techniques

**Sitemap XML**
- Vérifier que `https://www.a-ct.ma/sitemap.xml` est accessible et complet
- Il doit lister toutes les URLs : accueil, services, formations, formations/[slug], blog, blog/[slug], à propos, contact
- Soumettre dans Google Search Console ET Bing Webmaster Tools

**Hreflang (multilingue)**
Le site a 3 langues (fr, en, ar). Chaque page doit déclarer ses équivalents :
```html
<link rel="alternate" hreflang="fr" href="https://www.a-ct.ma/fr/formations" />
<link rel="alternate" hreflang="en" href="https://www.a-ct.ma/en/formations" />
<link rel="alternate" hreflang="ar" href="https://www.a-ct.ma/ar/formations" />
<link rel="alternate" hreflang="x-default" href="https://www.a-ct.ma/fr/formations" />
```
Vérifier que `next-intl` génère ces balises automatiquement ou les ajouter dans `layout.tsx`.

**URL canonique**
Chaque page doit déclarer sa propre URL canonique pour éviter le duplicate content entre `/fr/`, `/en/` et `/ar/`.

**Core Web Vitals**
Tester sur [PageSpeed Insights](https://pagespeed.web.dev) :
- LCP (Largest Contentful Paint) < 2.5s
- CLS (Cumulative Layout Shift) < 0.1
- INP (Interaction to Next Paint) < 200ms

**Images**
- Toutes les images doivent avoir un attribut `alt` descriptif
- Utiliser le composant `<Image>` Next.js (déjà fait sur la plupart des pages)
- Format WebP privilégié

---

## 3. Phase 2 — Stratégie de mots-clés

### 3.1 Architecture par audience

Le SEO d'ACT cible 4 audiences avec des intentions de recherche très différentes.

---

#### Audience 1 — B2C : Étudiants & Particuliers

**Intention** : trouver une formation, comparer, s'inscrire

| Mot-clé | Volume estimé | Difficulté | Page cible |
|---|---|---|---|
| formation IA Maroc | 500-1k/mois | Faible | /formations |
| formation machine learning Maroc | 200-500/mois | Faible | /formations/[slug-ml] |
| formation data science Maroc | 300-700/mois | Faible | /formations/[slug-data] |
| bootcamp développement web Maroc | 200-400/mois | Faible | /formations/[slug-dev] |
| formation cloud AWS Maroc | 100-300/mois | Faible | /formations/[slug-cloud] |
| reconversion professionnelle tech Maroc | 100-200/mois | Faible | /blog ou page dédiée |
| formation IA agentique | 50-150/mois | Très faible | /formations/[slug-agentique] |
| apprendre intelligence artificielle | 1k-5k/mois | Moyenne | /blog/[article-intro-ia] |

**Note** : La faible difficulté est une opportunité — le marché marocain est peu concurrentiel en SEO tech. Se positionner maintenant avant que les concurrents s'y mettent.

---

#### Audience 2 — B2B : Entreprises & DSI

**Intention** : trouver un prestataire, évaluer les compétences, demander un devis

| Mot-clé | Volume estimé | Difficulté | Page cible |
|---|---|---|---|
| agence IA Maroc | 100-300/mois | Faible | /services |
| développement application web Maroc | 300-600/mois | Faible | /services/ingenierie-logicielle |
| conseil transformation digitale Maroc | 100-250/mois | Faible | /services/conseil-strategique |
| automatisation processus entreprise IA | 200-500/mois | Moyenne | /services/automatisation-ia |
| agent IA entreprise | 500-2k/mois | Moyenne | /services/automatisation-ia |
| développement logiciel sur mesure Maroc | 200-400/mois | Faible | /services/ingenierie-logicielle |
| société IA Afrique | 100-200/mois | Très faible | /about ou home |
| LLM entreprise déploiement | 300-800/mois | Moyenne | /blog/[article-llm-entreprise] |

---

#### Audience 3 — Notoriété de marque

**Intention** : informer, éduquer, devenir la référence IA en Afrique

| Mot-clé | Volume estimé | Difficulté | Page cible |
|---|---|---|---|
| IA agentique | 2k-10k/mois | Moyenne | /blog/ia-agentique-explication |
| comment fonctionne ChatGPT | 10k-50k/mois | Haute | /blog/chatgpt-explication |
| intelligence artificielle Afrique | 500-2k/mois | Faible | /blog ou home |
| transformation digitale Maroc | 500-1k/mois | Faible | /blog/[article] |
| LLM explication | 1k-5k/mois | Moyenne | /blog/[article] |
| data science vs machine learning | 2k-10k/mois | Moyenne | /blog/[article] |

---

#### Audience 4 — Recrutement

**Intention** : trouver un emploi tech au Maroc

| Mot-clé | Volume estimé | Difficulté | Page cible |
|---|---|---|---|
| emploi développeur IA Maroc | 100-300/mois | Faible | /carrieres (à créer) |
| jobs data scientist Maroc | 100-200/mois | Faible | /carrieres |
| travailler dans l'IA Maroc | 50-150/mois | Très faible | /carrieres ou /about |
| startup tech Maroc recrutement | 50-100/mois | Très faible | /carrieres |

---

### 3.2 Les 5 mots-clés à cibler en priorité absolue

En départ de zéro, il faut choisir les batailles les plus faciles à gagner d'abord :

1. **"formation IA Maroc"** → volume correct + quasi aucun concurrent SEO sérieux
2. **"agence IA Maroc"** → intention d'achat forte + faible concurrence
3. **"IA agentique"** → sujet tendance + ACT est légitime sur ce topic
4. **"formation data science Maroc"** → volume correct + faible difficulté
5. **"agent IA entreprise"** → volume croissant + fort intent B2B

---

## 4. Phase 3 — Architecture de contenu

### 4.1 Le modèle Pilier + Clusters

Le modèle de contenu le plus efficace pour le SEO en 2026 est le **Topic Cluster** :
- Une **page pilier** couvre un sujet en profondeur (2 000-4 000 mots)
- Des **articles satellites** couvrent des sous-sujets et renvoient vers le pilier
- Le maillage interne concentre l'autorité vers les pages cibles

**3 clusters prioritaires pour ACT :**

---

#### Cluster 1 — "IA Agentique" (notoriété + B2B)

```
PILIER : /blog/ia-agentique-guide-complet
  ├── /blog/ia-agentique-explication-agents-autonomes  ✅ (déjà rédigé)
  ├── /blog/langchain-tutoriel-debutant
  ├── /blog/react-pattern-agents-ia
  ├── /blog/multi-agents-crewai-autogen
  ├── /blog/cas-usage-ia-agentique-entreprise
  └── /blog/gouvernance-agents-ia-ai-act
```

---

#### Cluster 2 — "Formation IA Maroc" (B2C + recrutement)

```
PILIER : /formations (page catalogue, optimisée "formation IA Maroc")
  ├── /formations/[slug-ia-ml]        → "formation machine learning Maroc"
  ├── /formations/[slug-data]         → "formation data science Maroc"
  ├── /formations/[slug-cloud]        → "formation AWS cloud Maroc"
  ├── /formations/[slug-dev]          → "bootcamp développement web Maroc"
  ├── /blog/comment-choisir-formation-ia-maroc
  ├── /blog/reconversion-tech-maroc-guide
  └── /blog/certifications-aws-azure-gcp-maroc
```

---

#### Cluster 3 — "Transformation Digitale Maroc" (B2B)

```
PILIER : /services (page catalogue, optimisée "agence IA Maroc")
  ├── /services/ingenierie-logicielle  → "développement logiciel Maroc"
  ├── /services/automatisation-ia      → "automatisation IA entreprise"
  ├── /services/conseil-strategique    → "conseil transformation digitale Maroc"
  ├── /blog/ia-agentique-offshoring-maroc
  ├── /blog/automatiser-processus-ia-pme
  └── /blog/roi-intelligence-artificielle-entreprise
```

---

### 4.2 Calendrier éditorial — 6 mois

| Mois | Article / Page | Mot-clé cible | Audience |
|---|---|---|---|
| **Mois 1** | Guide complet IA Agentique (pilier) | ia agentique guide | Notoriété |
| **Mois 1** | Page /carrieres | emploi IA Maroc | Recrutement |
| **Mois 2** | ChatGPT, Gemini, Claude — explication sans jargon | comment fonctionne chatgpt | Notoriété |
| **Mois 2** | Comment choisir sa formation IA au Maroc | choisir formation ia maroc | B2C |
| **Mois 3** | LangChain : tutoriel débutant | langchain débutant | Notoriété + B2B |
| **Mois 3** | Automatiser vos processus avec les agents IA | automatisation ia entreprise | B2B |
| **Mois 4** | Reconversion professionnelle en data science au Maroc | reconversion data science maroc | B2C |
| **Mois 4** | ROI de l'intelligence artificielle : ce que disent les chiffres | roi intelligence artificielle | B2B |
| **Mois 5** | Certifications AWS, Azure, GCP : le guide complet | certification cloud aws azure maroc | B2C |
| **Mois 5** | Multi-agents avec CrewAI : guide pratique | crewai multi agent | Notoriété + B2B |
| **Mois 6** | IA agentique et offshoring marocain | ia agentique offshoring maroc | B2B + Notoriété |
| **Mois 6** | Gouvernance des agents IA : AI Act et conformité | ai act agents ia | B2B |

---

## 5. Phase 4 — Autorité et netlinking

### 5.1 Stratégie de backlinks (hors budget)

Pour un site partant de zéro, les backlinks gratuits les plus efficaces :

**Médias & presse tech africaine**
- Soumettre des tribunes d'expertise à : TechCabal, Jeune Afrique Tech, Le Desk (Maroc), L'Économiste
- Proposer des interviews sur l'IA agentique et la transformation digitale en Afrique

**Partenariats académiques**
- Écoles d'ingénieurs marocaines (ENSIAS, EMSI, ENSA) : proposer des interventions, des articles co-signés
- Universités partenaires : obtenir des liens depuis leurs pages de partenaires

**LinkedIn & réseaux professionnels**
- Republier les articles de blog sur LinkedIn (trafic + signal d'autorité)
- Répondre aux discussions LinkedIn sur l'IA en citant les articles ACT

**Annuaires & listings**
- Crunchbase, Clutch.co (agences tech), G2 (formation), Product Hunt
- Annuaires marocains : Maroc Annuaire, Pages Jaunes Maroc

**Guest posting**
- Proposer des articles invités sur des blogs tech francophones (FrenchWeb, Journal du Net, etc.)

### 5.2 Stratégie de backlinks (budget)

- Campagne de relations presse via une agence RP marocaine
- Partenariats sponsorisés avec médias tech africains (TechCabal, Disrupt Africa)

---

## 6. SEO Local — Maroc

### 6.1 Google Business Profile

Créer et optimiser la fiche Google Business Profile (anciennement Google My Business) :
- Nom : Africa Centred Technology
- Catégories : École de programmation, Société de conseil en informatique, Formation professionnelle
- Description avec mots-clés locaux
- Photos de l'équipe, des locaux, des formations
- Recueillir des avis Google (minimum 10 pour crédibilité)

### 6.2 Citations locales

S'inscrire sur les annuaires locaux marocains :
- Pages Jaunes Maroc
- Maroc Annuaire
- Bottin Maroc
- Chambre de Commerce de Casablanca (si applicable)

---

## 7. Monitoring et KPIs

### 7.1 Outils de suivi

| Outil | Fréquence | Ce qu'on surveille |
|---|---|---|
| Google Search Console | Hebdomadaire | Impressions, clics, CTR, positions moyennes |
| Google Analytics 4 | Hebdomadaire | Sessions organiques, pages vues, taux de conversion |
| PageSpeed Insights | Mensuel | Core Web Vitals, score performance |
| Ahrefs / Semrush (optionnel) | Mensuel | Positions mots-clés, backlinks, concurrents |

### 7.2 KPIs à suivre

**Mois 1-3 (phase d'indexation)**
- Nombre de pages indexées dans Google Search Console
- Nombre d'impressions organiques (même sans clics, c'est bon signe)
- Score Core Web Vitals

**Mois 3-6 (phase de croissance)**
- Positions sur les 5 mots-clés prioritaires
- Trafic organique mensuel (objectif : +20% par mois)
- Taux de clics (CTR) sur les pages blog (objectif : >3%)

**Mois 6+ (phase de maturité)**
- Nombre de backlinks acquis
- Part du trafic organique dans le trafic total (objectif : >30%)
- Conversions issues du SEO (inscriptions formations, demandes de devis)

---

## 8. Résumé des priorités

### Semaine 1-2 (actions immédiates)
- [ ] Créer Google Search Console + soumettre sitemap
- [ ] Créer Bing Webmaster Tools + soumettre sitemap
- [ ] Installer Google Analytics 4
- [ ] Tester Core Web Vitals sur PageSpeed Insights
- [ ] Vérifier que toutes les pages ont title + meta description uniques
- [ ] Créer Google Business Profile

### Mois 1
- [ ] Rédiger le pilier "Guide complet IA Agentique"
- [ ] Créer la page /carrieres
- [ ] Optimiser les meta titles/descriptions de toutes les pages existantes
- [ ] Vérifier le hreflang multilingue

### Mois 2-3
- [ ] Publier 2 articles de blog/mois (voir calendrier)
- [ ] Construire le maillage interne entre articles et pages services/formations
- [ ] Soumettre 2 tribunes à des médias tech africains

### Mois 4-6
- [ ] Atteindre 6 articles de blog publiés
- [ ] Premier bilan Google Search Console
- [ ] Ajuster la stratégie selon les données réelles

---

## 9. Ce que Claude Code peut produire

Pour chaque article du calendrier éditorial, je peux générer :
- Le **brief SEO** complet (angle, structure, mots-clés secondaires, longueur cible)
- L'**article complet** optimisé pour le mot-clé cible (format Shopify blog)
- Les **meta title + meta description** optimisées
- Le **texte de publication** social media (LinkedIn, Facebook, Instagram)
- Les **données structurées JSON-LD** si nécessaire (Article schema)

---

*Document créé le 18 mai 2026 — à réviser à chaque bilan mensuel Google Search Console.*
