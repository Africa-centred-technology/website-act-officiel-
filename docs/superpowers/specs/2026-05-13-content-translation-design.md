# Spec — Traduction du contenu EN + AR (sous-phase C3)

**Date** : 2026-05-13
**Projet parent** : Sous-projet C — Traduction du contenu multi-langue
**Phase** : **C3 — Traduction réelle EN + AR** (phase 3 sur 5 dans C)
**Branche** : `feat/i18n-architecture` (poursuite empilée — A + B + C1 + C2 + C3)
**Statut** : Design validé, en attente de relecture utilisateur
**Sous-phases précédentes** : C1 (UI strings externalization, terminée), C2 (data statique externalisée, terminée)
**Sous-phases suivantes** : C4 (Shopify multi-langue), C5 (QA finale)

---

## 1. Contexte

Les sous-phases C1 et C2 ont externalisé tout le contenu texte FR (~720 clés) du site dans les dictionnaires `next-intl` (`src/i18n/messages/fr.json`). Les fichiers `en.json` et `ar.json` sont des **copies verbatim** de `fr.json` — ils contiennent du texte français servi tel quel sur les pages `/en/*` et `/ar/*`.

Conséquence actuelle :
- Un visiteur depuis le navigateur en anglais voit `/en/services` rempli de texte français. **SEO international cassé** — Google détecte du contenu dupliqué entre `/fr/services` et `/en/services` au lieu d'une traduction.
- Idem pour `/ar/*` — l'arabe affiche du français dans une layout RTL.

C3 résout ça en produisant les **vraies traductions** EN puis AR pour les ~720 clés.

C3 n'implique **aucune modification de code applicatif**. C'est uniquement de l'édition de fichiers JSON. Pas de nouveau composant, pas de nouvelle dépendance, pas de nouveau test.

## 2. Objectifs et critères d'acceptation

### Objectifs

1. Produire `en.json` complètement traduit en anglais depuis `fr.json`.
2. Produire `ar.json` complètement traduit en arabe standard moderne depuis `fr.json`.
3. Préserver toutes les structures techniques (ICU placeholders, HTML inline tags, newlines, casse).
4. Maintenir la cohérence terminologique à travers tous les batches.
5. Conserver les marques propres et toponymes invariants (ACT, OpenAI, Maroc, etc.).

### Critères d'acceptation

- ✅ `en.json` byte-différent de `fr.json` — toutes les valeurs traduites en anglais (≤ 1% de tolérance pour identités acceptables comme "Africa Centred Technology" ou les ICU placeholders qui restent identiques).
- ✅ `ar.json` byte-différent de `fr.json` — toutes les valeurs traduites en arabe (idem tolérance pour marques/placeholders).
- ✅ Tous les `i18n coverage` tests (de C2-Task 7) continuent de passer — pas de clé manquante.
- ✅ Build production clean (110+ pages générées).
- ✅ Smoke check : `curl /en/about` rend de l'anglais (vrai, pas du FR), `curl /ar/about` rend de l'arabe avec `<html dir="rtl">` correct.
- ✅ Tous les ICU placeholders (`{year}`, `{count}`, `{min}`, etc.) préservés exactement.
- ✅ Tous les tags HTML inline (`<strong>`, `<accent>`) préservés exactement.
- ✅ Tous les `\n` (newlines pour `titleWithBreaks`/`descriptionLong`) préservés exactement.

## 3. Décisions de cadrage

| Sujet | Décision | Justification |
|---|---|---|
| Branche | Poursuite `feat/i18n-architecture` | Cohérent avec A+B+C1+C2, un seul PR final |
| Méthode de traduction | Claude (LLM) directement dans la session | Pas de SDK à installer, pas de coût API séparé, qualité élevée, contexte projet déjà chargé |
| Exécution | Édition directe de `en.json` et `ar.json` via Edit tool, batch par namespace | Préserve la structure JSON sans script à écrire ; rollback granulaire par batch |
| Scope | Toutes les ~720 clés, EN et AR en un pass | Cohérence terminologique garantie, débloque le SEO multilingue complet |
| Registre EN | Marketing/tech professionnel, neutre US/international | Site B2B africain à audience internationale |
| Registre AR | Arabe standard moderne formel (الفصحى المعاصرة) | Lisible MENA, business-oriented, pas de dialecte régional |
| Relecture humaine native AR | Hors-scope C3 — follow-up éditorial | Le draft Claude est utilisable en prod immédiate ; amélioration par patch |
| Tests | Pas de nouveau test | Tests existants restent valides ; pas d'auto-validation de qualité linguistique |

## 4. Architecture

### 4.1 Approche

Pour chaque namespace de `fr.json` :
1. Lire le contenu du namespace dans `fr.json` (référence).
2. Produire la traduction EN, en respectant le glossaire (§4.3) et les conventions (§4.4).
3. Remplacer le namespace correspondant dans `en.json` via Edit (replace de l'objet entier).
4. Produire la traduction AR, mêmes contraintes + RTL/MSA formel.
5. Remplacer le namespace correspondant dans `ar.json` via Edit.
6. `npx tsc --noEmit` + commit autonome.

Les types `Messages` (dans `src/global.d.ts`) dérivent de `fr.json` — inchangés. Aucun TS error attendu.

### 4.2 Découpe en batches

12 batches namespace par namespace :

| # | Namespace | Type contenu | Volume estimé (clés) |
|---|---|---|---|
| 1 | `common.{cta,nav,footer,lang}` | Labels universels | ~30 |
| 2 | `validation.*` + `breadcrumb.*` | Form errors + breadcrumb labels | ~12 |
| 3 | `metadata.*` | Titles + descriptions SEO de 10 pages | ~20 |
| 4 | `home.*` | Parcours 7 salles + sections home | ~50 |
| 5 | `about.*` | Page about complète | ~80 |
| 6 | `formations.*` (sauf items) | Catalogue, inscription, brochure, cart, defaults | ~80 |
| 7 | `formations.items.*` | Formations × text minimal | ~5 |
| 8 | `services.*` (catalogue/intro/grid/detail/poles) | Labels services hors items | ~50 |
| 9 | `services.items.*` | 8 services × text complet | ~200 |
| 10 | `poles.*` + `poles.items.*` | 3 pôles × text complet | ~60 |
| 11 | `secteurs.*` + `secteurs.items.*` | 7 secteurs × text complet | ~80 |
| 12 | `projects.*` + `projects.items.*` + `blog.*` + `contact.*` | Reste : 4 projets, blog, contact | ~120 |

**Total** : ~720 clés × 2 langues = ~1440 segments traduits.

### 4.3 Glossaire — termes invariants

Ces termes ne sont **pas traduits** ; ils restent identiques en EN et AR (ou adaptés en transliteration AR standard).

**Marques propres** : `ACT`, `Africa Centred Technology`, `OpenAI`, `Anthropic`, `Claude`, `Gemini`, `ChatGPT`, `Shopify`, `GitHub`, `GitLab`, `Microsoft Copilot`.

**Noms de produits/technologies** : `RAG`, `pgvector`, `Streamlit`, `Python`, `FastAPI`, `Wazuh`, `SIEM`, `OHADA`, `Next.js`, `React`, `Vite`, `Three.js`, `R3F`, `Framer Motion`, `Tailwind CSS`.

**Toponymes** :
- EN : `Morocco`, `Casablanca`, `Africa`
- AR : `المغرب`, `الدار البيضاء`, `أفريقيا` (transcriptions arabes standards)

**Tagline corporate** : `Engineering the Future` — déjà en anglais dans `fr.json`. Conservé tel quel en EN et AR.

**Format date** : reste numérique (`2026`, `2025`) — pas de problème de localisation.

### 4.4 Préservation technique

**ICU placeholders** :
- `{year}`, `{count}`, `{min}`, `{max}`, `{locale}` — préservés exactement.
- Pluriels CLDR : `{count, plural, =0 {...} =1 {...} other {...}}` — structure préservée, seul le texte FR à l'intérieur des `{...}` est traduit. Note : EN et AR ont leurs propres règles plural CLDR (AR en a 6 : zero/one/two/few/many/other) — pour V1, on garde la structure FR (=0, =1, other) et on traduit le texte ; next-intl gère le fallback CLDR.

**HTML inline tags** :
- `<strong>...</strong>`, `<accent>...</accent>`, etc. — balises préservées exactement, seul le texte interne est traduit.
- Exemple : `"Pour <strong>aller plus loin</strong>"` (FR) → `"To <strong>go further</strong>"` (EN) → `"للذهاب <strong>أبعد</strong>"` (AR).

**Newlines** :
- `\n` dans `titleWithBreaks`, `descriptionLong`, etc. — préservés exactement, même si la phrase EN/AR aurait naturellement une coupure différente. Les retours à la ligne sont utilisés pour le rendu CSS `whiteSpace: pre-line`.

**Casse** :
- Titres en MAJUSCULES dans `fr.json` (e.g., `"QUI SOMMES-NOUS"`) → en EN majuscules conservées (`"WHO WE ARE"`).
- AR n'a pas de casse — adaptation naturelle.

**Ponctuation** :
- Guillemets français `« »` → en EN guillemets droits `"..."` ; en AR identiques `« »` ou `"..."` (selon contexte).
- Espaces typographiques avant `?` `!` `:` `;` en FR → supprimés en EN ; conservés ou adaptés selon usage AR.

### 4.5 Conventions par locale

**EN** :
- Registre marketing professionnel, neutre US/international.
- Pas trop UK (skip "behaviour" pour "behavior"), pas trop US (limite les contractions "you're" → "you are" pour le ton corporate).
- Oxford comma : optionnel, à utiliser pour clarté.
- "Africa Centred" garde le spelling britannique car c'est dans le nom de marque (déjà figé).

**AR** :
- Direction RTL — déjà gérée par CSS `dir="rtl"` depuis sous-projet A. Pas d'impact sur la traduction elle-même.
- Registre formel business (الفصحى المعاصرة), pas de Darija marocain.
- Nombres en chiffres "arabes occidentaux" (1, 2, 3) plutôt que arabes-arabes (١, ٢, ٣) — plus lisible et standard moderne dans le contexte tech/business MENA.
- Vocabulaire IA : utiliser les termes consacrés modernes (`الذكاء الاصطناعي`, `التحول الرقمي`, `الحوسبة السحابية`) ; pour les termes très récents (RAG, embeddings), garder l'anglais entre parenthèses ou translittéré.

## 5. Plan de tests

### 5.1 Tests existants à préserver

- **Unit tests** (45) — pas d'impact, ne valident pas la qualité de traduction.
- **`i18n coverage` tests** (4 describe blocks de C2-Task 7) — doivent continuer à passer. Ils vérifient que `fr.json.poles.items[id].title` est truthy pour chaque pole — comme on ne modifie que en.json et ar.json, ces tests restent verts.
- **E2E i18n + seo + smoke + content-fr-snapshot** — pas d'impact, sont FR-only.

### 5.2 Smoke check par batch (post-traduction)

Pour chaque batch, après commit, démarrer dev et vérifier :

```bash
# Exemple Batch 1 (common.*)
curl.exe -s http://localhost:3000/en/ | grep -oE ">(Home|About|Services|Contact|Formations)<" | sort -u
curl.exe -s http://localhost:3000/ar/ | grep -oE '<html lang="ar" dir="rtl">' | head -1
```

L'EN doit rendre les nav labels en anglais ("Home", "About", "Services"), l'AR doit rendre `<html dir="rtl">` (RTL préservé) et les nav labels en arabe.

### 5.3 Smoke check global post-C3

Après tous les batches :
```bash
echo "=== /en/about complete in English ==="
curl.exe -s http://localhost:3000/en/about | grep -c "Africa Centred Technology"
# Vérifier qu'aucun bout de FR ne traîne :
curl.exe -s http://localhost:3000/en/about | grep -oE "(Notre|Découvrir|Voir tous|En savoir plus)" | head -3
# Expected: zero matches (sinon, un namespace n'a pas été traduit)

echo "=== /ar/about complete in Arabic ==="
curl.exe -s http://localhost:3000/ar/about | grep -oE "<html[^>]*>" | head -1
# Expected: <html lang="ar" dir="rtl" ...>
```

### 5.4 Pas de nouvelle automatisation

Aucun test automatisé n'est ajouté pour valider la **qualité** de traduction (impossible à automatiser sans validation native). La qualité est validée manuellement par smoke check + relecture humaine post-C3 si disponible.

## 6. Risques et points d'attention

| Risque | Mitigation |
|---|---|
| Erreur de traduction sur terme technique | Glossaire interne (§4.3) appliqué cohéremment ; corrections ultérieures par patch |
| Pluriels ICU mal formatés en EN/AR | Préserver la syntaxe `{count, plural, ...}` exactement ; adapter seulement le texte à l'intérieur des `{...}` |
| Cohérence terminologique entre batches | Maintenir mentalement le glossaire + spot-check après chaque batch |
| `\n` dans titres reformulés en EN/AR | Préserver les `\n` exactement même si la coupure EN/AR serait différente naturellement |
| Volume context-window saturé | Découpe en 12 batches ; commit + reset implicite entre chaque |
| AR : direction RTL casse une animation Framer | Hors-scope C3 (documenté C5) |
| Qualité AR moyenne sans validation native | Acceptée comme V1 ; draft Claude utilisable immédiatement, amélioration par patch quand un natif AR repasse |
| Hardcoded FR résiduels (`"Sur devis"`, `"Réponse sous 24h"`) | Hors-scope C3 (Shopify subsystem — C4) |

## 7. Livrables

**Fichiers modifiés** :
- `src/i18n/messages/en.json` — entièrement traduit FR → EN
- `src/i18n/messages/ar.json` — entièrement traduit FR → AR

**Fichiers non modifiés** (importants pour confirmer l'isolation du scope) :
- `src/i18n/messages/fr.json` — référence, inchangé
- Aucun composant React
- Aucun fichier `.ts` (data ou helper)
- Aucun test
- `src/global.d.ts` — augment de Messages dérive de fr.json, inchangé

**Commits** : 12 commits autonomes, un par batch, message standard `refactor(c3): translate <namespace> to EN + AR`.

## 8. Hors-scope

**Reporté à C4 (Shopify multi-langue)** :
- Activation Shopify Markets ou metafields multi-langues
- Formations live et articles blog en EN / AR depuis Shopify
- Résolution des 2 strings FR résiduels (`"Sur devis"`, `"Réponse sous 24h"`) dans `formation-defaults.ts`

**Reporté à C5 (QA finale)** :
- Audit Lighthouse en EN et AR (post-traduction réelle)
- Polish RTL fin des animations Framer
- Audit qualité traductions par locuteurs natifs (EN US/UK ; AR Maroc/MENA)
- Corrections idiomatiques ciblées

**Reporté au sous-projet D (post-C)** :
- Performance Lighthouse 35 → ≥90 (Core Web Vitals)
- Best Practices 54 → ≥90
- Symétrie typographique navbar (titres nav vs nom site)
- Remplacer `<select>` LanguageSwitcher par bouton globe (cycle au clic)
