# C3 — EN + AR Content Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use **superpowers:executing-plans** (recommended for C3) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> ⚠ **Execution preference for C3** : prefer **inline execution** (controller does the translations in-session). Translation quality depends on **terminology consistency across batches** — same LLM, same context window, same glossary memory. Dispatching subagents per batch loses this context and degrades quality. Subagent-driven works if a controller maintains a glossary doc, but inline is strictly better for this phase.

**Goal:** Traduire `src/i18n/messages/fr.json` (~720 clés) en anglais (`en.json`) et en arabe standard moderne (`ar.json`), batch namespace par namespace, en préservant ICU placeholders, tags HTML inline, newlines et glossaire de termes invariants.

**Architecture:** 12 batches, un commit par batch. Aucune modification de code applicatif — uniquement Edit sur `en.json` et `ar.json`. Glossaire centralisé (§"Glossary" ci-dessous) à appliquer cohéremment.

**Tech Stack:** JSON edition (UTF-8), Edit tool, git.

**Spec source:** `docs/superpowers/specs/2026-05-13-content-translation-design.md`

---

## File Structure

### Modified files (only)
- `src/i18n/messages/en.json` — traductions EN namespace par namespace (12 batches)
- `src/i18n/messages/ar.json` — traductions AR namespace par namespace (12 batches)

### Unchanged files (don't touch)
- `src/i18n/messages/fr.json` — référence, jamais modifié
- `src/global.d.ts` — types Messages dérivent de fr.json
- Tous les composants, tests, pages — pas affectés
- Aucun nouveau test (les `i18n coverage` tests de C2 restent valides)

---

## Glossary — invariant terms across ALL batches

**Marques propres (ne pas traduire) :**
- `ACT`, `Africa Centred Technology` (la marque)
- `OpenAI`, `Anthropic`, `Claude`, `Gemini`, `ChatGPT`, `Copilot`, `GitHub Copilot`, `Microsoft Copilot`
- `Shopify`, `GitHub`, `GitLab`

**Technologies (ne pas traduire) :**
- `RAG`, `pgvector`, `Streamlit`, `Python`, `FastAPI`, `Wazuh`, `SIEM`, `OHADA`
- `Next.js`, `React`, `Vite`, `Three.js`, `R3F`, `Framer Motion`, `Tailwind CSS`
- Tags techniques dans les projets (e.g., `"OpenAI GPT-5"`, `"pgvector"`)

**Toponymes :**
| FR | EN | AR |
|---|---|---|
| Maroc | Morocco | المغرب |
| Casablanca | Casablanca | الدار البيضاء |
| Afrique | Africa | أفريقيا |
| Mer Sultan, 6e Rue château | Mers Sultan, 6th Rue château | مرس السلطان، الشارع السادس |
| France | France | فرنسا |

**Tagline corporate :** `Engineering the Future` — DÉJÀ en anglais dans fr.json. Garder tel quel en EN et AR.

**Termes IA/Tech (traductions consacrées) :**

| FR | EN | AR |
|---|---|---|
| Intelligence Artificielle | Artificial Intelligence (AI) | الذكاء الاصطناعي |
| Transformation Digitale / Numérique | Digital Transformation | التحول الرقمي |
| Ingénierie Technologique | Technology Engineering | الهندسة التكنولوجية |
| Conseil & Stratégie IT | IT Consulting & Strategy | الاستشارات والاستراتيجية الرقمية |
| Formation | Training | التدريب |
| Cybersécurité | Cybersecurity | الأمن السيبراني |
| Données / Data | Data | البيانات |
| Cloud souverain | Sovereign cloud | السحابة السيادية |
| Pôle | Division | قسم (or "محور" depending on context) |
| Secteur d'activité | Industry / Sector | قطاع النشاط |
| Réalisation / Projet client | Project / Case study | مشروع / دراسة حالة |
| À propos | About | عن الشركة |
| Apprenants | Learners | المتعلمون |
| Formateur | Trainer | المدرب |
| Pré-requis | Prerequisites | المتطلبات الأساسية |
| Sur mesure | Custom / Tailored | مخصص |
| Présentiel | On-site / In-person | حضوري |

---

## Conventions

**Préservation technique (NEVER ALTER) :**
- ICU placeholders : `{year}`, `{count}`, `{min}`, `{max}`, `{locale}` — copiés exactement à la même position. Si la position dans la phrase change naturellement, OK tant que la variable reste.
- Pluriels : `{count, plural, =0 {Aucune formation} =1 {1 formation} other {# formations}}` — structure préservée, seul le texte FR à l'intérieur des `{...}` est traduit. Le `#` reste `#`.
- HTML inline tags : `<strong>X</strong>`, `<accent>X</accent>` — tags préservés exactement, seul X est traduit.
- Newlines `\n` : préservés exactement, même si la phrase EN/AR aurait naturellement une coupure différente.

**Casse :**
- Titres en MAJUSCULES dans FR (e.g., `"QUI SOMMES-NOUS"`) → MAJUSCULES en EN (`"WHO WE ARE"`).
- AR n'a pas de casse.

**Ponctuation :**
- FR : `« mot »` (espaces insécables avant `?` `!` `:` `;`) → EN : `"mot"` (pas d'espace insécable).
- AR : guillemets `«...»` ou `"..."` selon le rendu visuel souhaité. Préférer `"..."` pour cohérence avec l'EN si pas de raison esthétique forte.

**Registre :**
- EN : marketing/tech professionnel, neutre US/international. Contractions évitées en tone corporate ("you are" plutôt que "you're"). Oxford comma optionnel.
- AR : modern standard formel (الفصحى المعاصرة). Pas de Darija. Nombres en chiffres occidentaux (1, 2, 3), pas en arabes-arabes (١, ٢, ٣).

---

## Pattern by batch (apply to each of the 12 tasks below)

```
1. Read src/i18n/messages/fr.json — get the current content of the target namespace.
2. Translate to EN (apply glossary + conventions above).
3. Edit src/i18n/messages/en.json — replace the EXACT same namespace with the EN translation.
4. Translate to AR (apply glossary + conventions).
5. Edit src/i18n/messages/ar.json — replace the EXACT same namespace with the AR translation.
6. `npx tsc --noEmit` — should be clean (types derive from fr.json, unchanged).
7. `npm run build` — should be clean, 110+ pages.
8. Smoke check via curl (one URL per batch — namespace-specific).
9. Commit: `git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate <namespace> to EN + AR"`
```

For each Edit step, use `replace_all: false` and target the EXACT block of JSON corresponding to the namespace. If the namespace is large (e.g., `services.items.*` is ~200 keys), break it into sub-edits (one Edit per sub-namespace) to keep each Edit reviewable.

---

## Task 1: Translate `common.*` (cta, nav, footer, lang)

**Files:**
- Modify: `src/i18n/messages/en.json` — replace `"common": {...}` block
- Modify: `src/i18n/messages/ar.json` — same

- [ ] **Step 1: Read fr.json**

Run: read `src/i18n/messages/fr.json`, locate the `"common"` block. It contains sub-namespaces : `lang`, `cta`, `nav`, `footer`, plus potentially `ctaSection` if it was added in C1-Task 2.

- [ ] **Step 2: Translate `common.cta` to EN**

Each key in `common.cta` is a label. Map FR → EN. Examples (apply same approach to all keys) :

| FR | EN |
|---|---|
| `En savoir plus` | `Learn more` |
| `Voir tous` | `View all` |
| `Découvrir` | `Discover` |
| `Nous contacter` | `Contact us` |
| `S'abonner` | `Subscribe` |
| `Retour` | `Back` |
| `Fermer` | `Close` |
| `Envoyer` | `Send` |
| `Chargement…` | `Loading…` |
| `Lire la suite` | `Read more` |
| `S'inscrire` | `Register` |
| `Télécharger` | `Download` |
| `Télécharger la brochure` | `Download the brochure` |

Other keys not in the table above : translate similarly, registre marketing professionnel.

- [ ] **Step 3: Translate `common.nav` to EN**

| FR | EN |
|---|---|
| `Accueil` | `Home` |
| `À propos` | `About` |
| `Services` | `Services` |
| `Formations` | `Training` |
| `Pôles` | `Divisions` |
| `Secteurs` | `Industries` |
| `Réalisations` | `Projects` |
| `Blog` | `Blog` |
| `Contact` | `Contact` |
| `Ouvrir le menu` | `Open menu` |
| `Fermer le menu` | `Close menu` |

For other nav keys (added in C1 — e.g., `savoirFaire`, `nousDecouvrir`, etc.), translate following the same pattern. `Notre savoir-faire` → `Our expertise`. `Nous découvrir` → `Discover us`.

- [ ] **Step 4: Translate `common.footer` to EN**

| FR | EN |
|---|---|
| `© {year} Africa Centred Technology. Tous droits réservés.` | `© {year} Africa Centred Technology. All rights reserved.` |
| `Engineering the Future` | `Engineering the Future` (unchanged — already English) |
| `Maroc — FR` | `Morocco — EN` |
| `Suivez-nous` | `Follow us` |

For sub-keys added in C1 (privacyPolicy, terms, etc.) : `Politique de confidentialité` → `Privacy Policy`, `Conditions d'utilisation` → `Terms of Service`, `Inscription à la newsletter` → `Newsletter signup`, `Inscription confirmée !` → `Subscription confirmed!`, etc.

- [ ] **Step 5: Translate `common.lang` to EN — special case**

`common.lang` exposes language labels rendered in the LanguageSwitcher. They should remain self-referential (each language's own name) :

| key | EN value |
|---|---|
| `fr` | `Français` (untouched — that's how French speakers see their language) |
| `en` | `English` (untouched) |
| `ar` | `العربية` (untouched) |

Same values in EN and AR — labels are self-naming.

- [ ] **Step 6: Edit en.json — replace the `common` block**

Use Edit tool with `replace_all: false` to find the exact JSON block of `"common": {...}` in `en.json` and replace it with the EN-translated version. Preserve trailing comma if present after the closing brace.

- [ ] **Step 7: Translate `common.*` to AR (same sub-namespaces)**

Apply the glossary's AR column + conventions :

`common.cta` :
| FR | AR |
|---|---|
| `En savoir plus` | `معرفة المزيد` |
| `Voir tous` | `عرض الكل` |
| `Découvrir` | `اكتشاف` |
| `Nous contacter` | `اتصل بنا` |
| `S'abonner` | `اشترك` |
| `Retour` | `رجوع` |
| `Fermer` | `إغلاق` |
| `Envoyer` | `إرسال` |
| `Chargement…` | `جارٍ التحميل…` |
| `Lire la suite` | `قراءة المزيد` |
| `S'inscrire` | `التسجيل` |
| `Télécharger` | `تحميل` |
| `Télécharger la brochure` | `تحميل الكتيب` |

`common.nav` :
| FR | AR |
|---|---|
| `Accueil` | `الرئيسية` |
| `À propos` | `عن الشركة` |
| `Services` | `الخدمات` |
| `Formations` | `التدريب` |
| `Pôles` | `الأقسام` |
| `Secteurs` | `القطاعات` |
| `Réalisations` | `المشاريع` |
| `Blog` | `المدونة` |
| `Contact` | `اتصل بنا` |
| `Ouvrir le menu` | `فتح القائمة` |
| `Fermer le menu` | `إغلاق القائمة` |

`common.footer` :
| FR | AR |
|---|---|
| `© {year} Africa Centred Technology. Tous droits réservés.` | `© {year} Africa Centred Technology. جميع الحقوق محفوظة.` |
| `Engineering the Future` | `Engineering the Future` (unchanged) |
| `Maroc — FR` | `المغرب — AR` |
| `Suivez-nous` | `تابعنا` |

`common.lang` : labels self-referential, same as EN (each language's own name).

- [ ] **Step 8: Edit ar.json — replace the `common` block**

Use Edit tool to replace the `"common": {...}` block in `ar.json` with the AR-translated version.

- [ ] **Step 9: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit
```
Expected: 0 errors.

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && rm -rf .next && npm run build 2>&1 | tail -5
```
Expected: clean, 110 pages.

- [ ] **Step 10: Smoke check**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run dev
```
Wait for ready, then:
```bash
echo "=== /en/ shows EN nav ==="
curl.exe -s http://localhost:3000/en/ | grep -oE ">(Home|About|Services|Training|Industries|Projects|Contact)<" | sort -u

echo ""
echo "=== /ar/ shows AR nav + RTL ==="
curl.exe -s http://localhost:3000/ar/ | grep -oE '<html[^>]*dir="rtl"[^>]*>' | head -1
curl.exe -s http://localhost:3000/ar/ | grep -oE ">(الرئيسية|الخدمات|التدريب)<" | sort -u
```
Expected : EN nav labels rendered in English, AR nav rendered in Arabic, `<html dir="rtl">` preserved.

Stop dev cleanly.

- [ ] **Step 11: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate common namespace to EN + AR"
```

---

## Task 2: Translate `validation.*` + `breadcrumb.*`

**Files:** `en.json`, `ar.json` — replace `validation` and `breadcrumb` blocks.

- [ ] **Step 1: Read fr.json — `validation` block**

Standard form validation messages. Keys: `required`, `email`, `phone`, `minLength`, `maxLength`.

- [ ] **Step 2: Translate `validation` to EN**

| FR | EN |
|---|---|
| `Ce champ est requis` | `This field is required` |
| `Email invalide` | `Invalid email` |
| `Numéro de téléphone invalide` | `Invalid phone number` |
| `Minimum {min} caractères` | `Minimum {min} characters` |
| `Maximum {max} caractères` | `Maximum {max} characters` |

- [ ] **Step 3: Translate `breadcrumb` to EN**

| FR | EN |
|---|---|
| `Accueil` | `Home` |
| `Formations` | `Training` |
| `Blog` | `Blog` |
| `Services` | `Services` |
| `Réalisations` | `Projects` |
| `Secteurs` | `Industries` |
| `Pôles` | `Divisions` |

- [ ] **Step 4: Edit en.json — replace both blocks**

Two Edits : one for `"validation": {...}` block, one for `"breadcrumb": {...}` block.

- [ ] **Step 5: Translate `validation` to AR**

| FR | AR |
|---|---|
| `Ce champ est requis` | `هذا الحقل مطلوب` |
| `Email invalide` | `بريد إلكتروني غير صالح` |
| `Numéro de téléphone invalide` | `رقم هاتف غير صالح` |
| `Minimum {min} caractères` | `الحد الأدنى {min} حرفًا` |
| `Maximum {max} caractères` | `الحد الأقصى {max} حرفًا` |

- [ ] **Step 6: Translate `breadcrumb` to AR**

| FR | AR |
|---|---|
| `Accueil` | `الرئيسية` |
| `Formations` | `التدريب` |
| `Blog` | `المدونة` |
| `Services` | `الخدمات` |
| `Réalisations` | `المشاريع` |
| `Secteurs` | `القطاعات` |
| `Pôles` | `الأقسام` |

- [ ] **Step 7: Edit ar.json — replace both blocks**

- [ ] **Step 8: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 9: Smoke check**

`npm run dev`, then verify breadcrumb JSON-LD on `/en/formations/<slug>` and `/ar/formations/<slug>` contains EN/AR labels respectively :
```bash
curl.exe -s "http://localhost:3000/en/formations/01_ia_productivite_quotidienne" | grep -oE '"name":"(Home|Training)"' | sort -u
curl.exe -s "http://localhost:3000/ar/formations/01_ia_productivite_quotidienne" | grep -oE '"name":"(الرئيسية|التدريب)"' | sort -u
```

Stop dev.

- [ ] **Step 10: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate validation + breadcrumb namespaces to EN + AR"
```

---

## Task 3: Translate `metadata.*` (SEO titles + descriptions)

**Files:** `en.json`, `ar.json` — replace `metadata` block.

`metadata` contains : `default`, `home`, `about`, `services`, `formations`, `poles`, `secteurs`, `projects`, `blog`, `contact` — each with `title` and `description` (used by `buildPageMetadata` from B for SEO meta tags).

- [ ] **Step 1: Read fr.json `metadata` block**

10 entries × 2 fields = 20 strings.

- [ ] **Step 2: Translate `metadata.*` to EN**

Translation guidance :
- `title` : 50-60 chars optimal. Pattern : `<Page name> — Africa Centred Technology`.
- `description` : 150-160 chars optimal. Marketing pitch + keywords.

| FR title | EN title |
|---|---|
| `Africa Centred Technology \| Engineering the Future` | `Africa Centred Technology \| Engineering the Future` (unchanged — pure brand) |
| `ACT — Africa Centred Technology \| Engineering the Future` | unchanged |
| `À Propos — Africa Centred Technology` | `About — Africa Centred Technology` |
| `Services — Africa Centred Technology` | unchanged (Services = Services in EN) |
| `Formations — Africa Centred Technology` | `Training — Africa Centred Technology` |
| `Pôles — Africa Centred Technology` | `Divisions — Africa Centred Technology` |
| `Secteurs — Africa Centred Technology` | `Industries — Africa Centred Technology` |
| `Réalisations — Africa Centred Technology` | `Projects — Africa Centred Technology` |
| `Blog — Africa Centred Technology` | unchanged |
| `Contact — Africa Centred Technology` | unchanged |

For descriptions : translate the marketing pitch idiomatically. Examples :
- FR : `Découvrez l'histoire, la mission et l'équipe d'Africa Centred Technology — pionniers de la transformation digitale en Afrique depuis 2023.`
- EN : `Discover the story, mission, and team behind Africa Centred Technology — pioneers of digital transformation in Africa since 2023.`

Apply similarly to all 10 descriptions. Keep mention of "Africa", "Morocco", "AI" where relevant for SEO.

- [ ] **Step 3: Edit en.json — replace `metadata` block**

- [ ] **Step 4: Translate `metadata.*` to AR**

Same logic. Titles and descriptions in modern standard Arabic. Examples :
- title `À Propos — Africa Centred Technology` → `عن الشركة — Africa Centred Technology`
- description `Découvrez l'histoire...` → `اكتشف تاريخ ورسالة وفريق Africa Centred Technology — روّاد التحول الرقمي في أفريقيا منذ 2023.`

Note : brand name `Africa Centred Technology` stays in Latin script (consistent with international branding).

- [ ] **Step 5: Edit ar.json — replace `metadata` block**

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Smoke check**

`npm run dev`, then:
```bash
curl.exe -s http://localhost:3000/en/about | grep -oE "<title>[^<]+</title>"
curl.exe -s http://localhost:3000/ar/about | grep -oE "<title>[^<]+</title>"
```
Expected : EN title in English, AR title in Arabic.

Stop dev.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate metadata namespace (SEO titles + descriptions) to EN + AR"
```

---

## Task 4: Translate `home.*`

**Files:** `en.json`, `ar.json` — replace `home` block.

`home` contains sub-namespaces from C1-Task 3 : `hero`, `about`, `horizon`, `poles`, `projects`, `blog`, `cta`, `manifeste` (added by C1 cleanup). About ~50 keys including the parcours 7 salles labels.

- [ ] **Step 1: Read fr.json `home` block**

Identify all sub-namespaces and keys. Note any rich-text patterns (`<strong>...</strong>`, `<accent>...</accent>`) for preservation.

- [ ] **Step 2: Translate `home.*` to EN**

Approach : translate each sub-namespace's keys, applying the glossary. The parcours 7 salles uses dramatic short phrases (e.g., `"QUI SOMMES-NOUS"`) — render in same registre dramatique en EN (`"WHO WE ARE"`). Preserve all-caps, newlines, and rich tags.

Examples :
- `"NOTRE EXPERTISE"` → `"OUR EXPERTISE"`
- `"DÉMARRONS"` → `"LET'S START"` (or `"GET STARTED"`)
- `"L'IA & l'ingénierie au service de l'Afrique"` → `"AI & engineering at the service of Africa"`
- Hero h1 with `<accent>` tags : preserve tags exactly, translate inside.

- [ ] **Step 3: Edit en.json — replace `home` block**

For a block this large (~50 keys), prefer a single Edit replacing the entire `"home": {...}` block, since the content is contiguous.

- [ ] **Step 4: Translate `home.*` to AR**

Same approach, AR conventions. The dramatic ALL-CAPS doesn't translate visually to AR (no case) — render natural Arabic with appropriate emphasis ; the visual emphasis in components will likely come from font-weight/size, not casing.

- [ ] **Step 5: Edit ar.json — replace `home` block**

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Smoke check**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run dev
```

```bash
echo "=== /en/ home content ==="
curl.exe -s http://localhost:3000/en/ | grep -oE "(WHO WE ARE|OUR EXPERTISE|LET'S START|GET STARTED)" | sort -u

echo "=== /ar/ home content ==="
curl.exe -s http://localhost:3000/ar/ | grep -oE "<h1[^>]*>[^<]+</h1>" | head -1
```

Stop dev.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate home namespace to EN + AR"
```

---

## Task 5: Translate `about.*`

**Files:** `en.json`, `ar.json` — replace `about` block.

`about` contains sub-namespaces from C1-Task 3 : `hero`, `stats`, `adn`, `values`, `timeline`, `team`, `cta`. About ~80 keys including team member names + roles.

> Special note for team member names : names of real persons stay in Latin script for both EN and AR (e.g., `"Aldrin Djourobi"` is unchanged in all locales). Their **roles** (e.g., `"Fondateur · CEO"`) are translated.

- [ ] **Step 1: Read fr.json `about` block**

- [ ] **Step 2: Translate `about.*` to EN**

Approach : translate keys section by section. Examples :
- `hero.eyebrow` `"À propos"` → `"About us"`
- `mission.title` `"Notre mission"` → `"Our mission"`
- `values.items.innovation.label` `"Innovation"` → `"Innovation"` (unchanged)
- `team.members.<member>.role` `"Fondateur · CEO"` → `"Founder · CEO"`
- Long paragraphs in `adn.body` or `mission.body` : full translation, marketing register, preserve `\n` newlines, keep brand mentions.

- [ ] **Step 3: Edit en.json — replace `about` block**

- [ ] **Step 4: Translate `about.*` to AR**

Same approach. Names of persons unchanged (Latin script). Roles translated :
- `"Fondateur · CEO"` → `"المؤسس · الرئيس التنفيذي"`

Long paragraphs in modern standard Arabic, marketing register.

- [ ] **Step 5: Edit ar.json — replace `about` block**

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Smoke check**

```bash
echo "=== /en/about content ==="
curl.exe -s http://localhost:3000/en/about | grep -oE "(About us|Our mission|Founder)" | sort -u | head -3

echo "=== /ar/about content ==="
curl.exe -s http://localhost:3000/ar/about | grep -oE "(عن الشركة|رسالتنا|المؤسس)" | sort -u | head -3
```

Stop dev.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate about namespace to EN + AR"
```

---

## Task 6: Translate `formations.*` (non-items)

**Files:** `en.json`, `ar.json` — sub-namespaces : `catalogue`, `detail`, `inscription`, `brochure`, `cart`, `defaults`, `poles`, `landpage`, `grid`, `intro` (some added in C1).

> About ~80 keys. Skip `formations.items.*` — handled in Task 7.

- [ ] **Step 1: Read fr.json `formations` block (excluding `items`)**

- [ ] **Step 2: Translate to EN**

Vocabulaire formations :
- `Formation` → `Training` (or `Course` for an individual training)
- `Catalogue` → `Catalog`
- `Inscription` → `Registration`
- `Brochure` → `Brochure` (unchanged)
- `Panier` → `Cart`
- `Programme` → `Program`
- `Objectifs` → `Objectives` (or `Goals`)
- `Bénéfices` → `Benefits`
- `Livrables` → `Deliverables`
- `Pré-requis` → `Prerequisites`
- `Durée` → `Duration`
- `Format` → `Format`
- `Niveau` → `Level`
- `Sur devis` → `On request`
- `Réponse sous 24h` → `Response within 24h`

For form labels (inscription/brochure) : translate each label. For Zod messages : reuse the `validation.*` namespace (already done in Task 2).

`formations.defaults.*` (from C2-Task 6) — translate trustStats, painPoints, marquee items, valueRoi, audienceCards, testimonials, pricingPlans, faqItems, midCta, finalCta, prixBarre. Each carries small text payloads.

- [ ] **Step 3: Edit en.json**

The block is large. Break into multiple Edits if needed (one per sub-namespace).

- [ ] **Step 4: Translate to AR**

Vocabulaire formations :
- `Formation` → `تدريب` / `دورة تدريبية`
- `Catalogue` → `الكتالوج`
- `Inscription` → `التسجيل`
- `Programme` → `البرنامج`
- `Objectifs` → `الأهداف`
- `Bénéfices` → `الفوائد`
- `Livrables` → `المخرجات`
- `Pré-requis` → `المتطلبات الأساسية`
- `Durée` → `المدة`
- `Format` → `الشكل` / `الصيغة`
- `Niveau` → `المستوى`
- `Sur devis` → `حسب الطلب`
- `Réponse sous 24h` → `الرد خلال 24 ساعة`

- [ ] **Step 5: Edit ar.json**

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Smoke check**

```bash
echo "=== /en/formations catalog ==="
curl.exe -s http://localhost:3000/en/formations | grep -oE "(Catalog|Training|Filter|Sort by)" | sort -u | head -3

echo "=== /ar/formations catalog ==="
curl.exe -s http://localhost:3000/ar/formations | grep -oE "(الكتالوج|التدريب)" | sort -u | head -3
```

Stop dev.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate formations namespace (catalogue/detail/inscription/...) to EN + AR"
```

---

## Task 7: Translate `formations.items.*`

**Files:** `en.json`, `ar.json` — replace `formations.items.*` block.

This block (added in C2-Task 5/6) is sparse — most formation content comes from Shopify at runtime. There may be 0 or a handful of items with text fields. Read first to see what's present.

- [ ] **Step 1: Read fr.json `formations.items.*`**

Note keys per item. May be empty.

- [ ] **Step 2: Translate keys to EN**

Apply standard translation. Item slugs (keys) stay unchanged (e.g., `"01_ia_productivite_quotidienne"`).

- [ ] **Step 3: Edit en.json**

- [ ] **Step 4: Translate to AR**

- [ ] **Step 5: Edit ar.json**

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate formations.items namespace to EN + AR"
```

> If `formations.items` is empty in fr.json (no static formation content), this task is a no-op. Skip commit and report `DONE — empty namespace, nothing to translate`.

---

## Task 8: Translate `services.*` (non-items)

**Files:** `en.json`, `ar.json` — sub-namespaces `catalogue`, `index`, `intro`, `grid`, `detail`, `poles.{ingenierie,conseil,formation}`. About ~50 keys.

> Skip `services.items.*` — handled in Task 9.

- [ ] **Step 1: Read fr.json `services` block excluding `items`**

- [ ] **Step 2: Translate to EN**

Examples :
- `services.intro.eyebrow` `"Nos services"` → `"Our services"`
- `services.detail.objectifsTitle` `"Objectifs"` → `"Objectives"`
- `services.poles.ingenierie.title` `"Ingénierie Technologique"` → `"Technology Engineering"`
- `services.poles.conseil.title` `"Conseil & Stratégie IT"` → `"IT Consulting & Strategy"`
- `services.poles.formation.title` `"Formation & Développement"` → `"Training & Development"`

- [ ] **Step 3: Edit en.json**

- [ ] **Step 4: Translate to AR**

- `Ingénierie Technologique` → `الهندسة التكنولوجية`
- `Conseil & Stratégie IT` → `الاستشارات والاستراتيجية الرقمية`
- `Formation & Développement` → `التدريب والتطوير`

- [ ] **Step 5: Edit ar.json**

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Smoke check**

```bash
echo "=== /en/services overview ==="
curl.exe -s http://localhost:3000/en/services | grep -oE "(Our services|Technology Engineering|IT Consulting)" | sort -u | head -3

echo "=== /ar/services overview ==="
curl.exe -s http://localhost:3000/ar/services | grep -oE "(الخدمات|الهندسة التكنولوجية)" | sort -u | head -3
```

Stop dev.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate services namespace (catalogue/intro/detail/poles) to EN + AR"
```

---

## Task 9: Translate `services.items.*` (the big one)

**Files:** `en.json`, `ar.json` — replace `services.items.*` block.

8 services × text complet : `pole`, `title`, `tagline`, `intro`, `subs[]` (2-3 sub-services × {title, desc}), `benefits[]` (4-5 bullets), `deliverables[]` (3-4 bullets). About ~200 keys.

This is the largest single batch.

- [ ] **Step 1: Read fr.json `services.items.*`**

Read the full block — note service slugs (e.g., `ingenierie-logicielle`, `automatisation-ia`, `architecture-infrastructure`, etc.).

- [ ] **Step 2: Translate ALL 8 services to EN**

For each service, translate :
- `pole` : already mapped (`"Ingénierie Technologique"` → `"Technology Engineering"`)
- `title` (multi-line, preserve `\n`)
- `tagline` (short marketing punchline)
- `intro` (1-2 paragraphs)
- Each entry in `subs[]` (title + desc)
- Each entry in `benefits[]` and `deliverables[]`

Apply glossary cohérently — same FR term gives same EN term across all 8 services. Examples :
- `"OHADA"` stays `"OHADA"` (régional standard)
- `"transformation digitale"` always `"digital transformation"`
- `"sur mesure"` always `"tailored"` (or `"custom"` — pick one and stick)

- [ ] **Step 3: Edit en.json**

The block is very large (~5-10 KB JSON). Break into 2-3 Edits, one per group of 3-4 services. This keeps each Edit reviewable.

- [ ] **Step 4: Translate ALL 8 services to AR**

Same approach. Examples :
- `subs[].title` `"Applications Web & Mobiles « African-Ready »"` → `"تطبيقات الويب والجوال « African-Ready »"` (mix of Arabic + brand-tagline en anglais entre guillemets)
- `benefits[]` items → courtes phrases AR

Vocabulaire AR :
- `Application` → `تطبيق`
- `Logiciel` → `برنامج`
- `Mobile` → `الجوال`
- `Données` → `البيانات`
- `Performance` → `الأداء`
- `Sécurité` → `الأمن`

- [ ] **Step 5: Edit ar.json**

Break into 2-3 Edits like Step 3.

- [ ] **Step 6: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 7: Smoke check**

```bash
echo "=== /en/services/ingenierie-logicielle ==="
curl.exe -s "http://localhost:3000/en/services/ingenierie-logicielle" | grep -oE "(Software Engineering|African-Ready|tailored)" | sort -u | head -3

echo "=== /ar/services/ingenierie-logicielle ==="
curl.exe -s "http://localhost:3000/ar/services/ingenierie-logicielle" | grep -oE "(هندسة البرمجيات|التطبيقات)" | sort -u | head -3
```

Stop dev.

- [ ] **Step 8: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate services.items.* (8 services) to EN + AR"
```

---

## Task 10: Translate `poles.*`

**Files:** `en.json`, `ar.json` — sub-namespaces `index`, `conseil`, `developpement`, `items`. About ~60 keys (3 pôles × ~15 each in items + general labels).

- [ ] **Step 1: Read fr.json `poles` block**

- [ ] **Step 2: Translate `poles.index` and `poles.{conseil,developpement}` to EN**

Examples :
- `poles.conseil.title` `"Pôle Conseil"` → `"Consulting Division"`
- `poles.developpement.title` `"Pôle Développement"` → `"Development Division"`
- `poles.index.eyebrow` `"Nos pôles"` → `"Our divisions"`

- [ ] **Step 3: Translate `poles.items.*` to EN (3 entries)**

Use mappings from C2-Task 2 :
- `developpement-technologique` :
  - `title` `"Développement Technologique"` → `"Technology Development"`
  - `titleWithBreaks` preserve `\n`
  - `tagline` `"L'excellence technique au service de vos ambitions"` → `"Technical excellence serving your ambitions"`
  - `description` translate naturally
- `conseil-strategie-it` :
  - `title` `"Conseil & Stratégie IT"` → `"IT Consulting & Strategy"`
- `formation` :
  - `title` `"Formation & Développement"` → `"Training & Development"`

- [ ] **Step 4: Edit en.json — replace `poles` block**

- [ ] **Step 5: Translate to AR (same structure)**

- `Conseil` → `الاستشارات`
- `Développement` → `التطوير`
- `Pôle Développement Technologique` → `قسم التطوير التكنولوجي`

- [ ] **Step 6: Edit ar.json**

- [ ] **Step 7: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 8: Smoke check**

```bash
curl.exe -s http://localhost:3000/en/poles | grep -oE "(Technology Development|IT Consulting|Training)" | sort -u
curl.exe -s http://localhost:3000/ar/poles | grep -oE "(التطوير|الاستشارات|التدريب)" | sort -u
```

Stop dev.

- [ ] **Step 9: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate poles namespace to EN + AR"
```

---

## Task 11: Translate `secteurs.*`

**Files:** `en.json`, `ar.json` — sub-namespaces `index`, `detail`, `items` (7 secteurs × ~10 keys each). About ~80 keys.

- [ ] **Step 1: Read fr.json `secteurs` block**

- [ ] **Step 2: Translate `secteurs.index` and `secteurs.detail` to EN**

- [ ] **Step 3: Translate `secteurs.items.*` (7 secteurs) to EN**

Secteurs identified in C2-Task 3 : industrie, telecoms-medias, finance, ecommerce, sante, immobilier, education.

Mappings :
- `industrie` → label `"Industrie"` → EN `"Industry"`
- `telecoms-medias` → label `"Télécommunications & Médias"` → EN `"Telecommunications & Media"`
- `finance` → label `"Finance"` → EN `"Finance"` (unchanged)
- `ecommerce` → label `"E-commerce"` → EN `"E-commerce"`
- `sante` → label `"Santé"` → EN `"Healthcare"`
- `immobilier` → label `"Immobilier"` → EN `"Real Estate"`
- `education` → label `"Éducation"` → EN `"Education"`

For each, translate `tagline`, `description`, `services[]` (5 bullets), `chiffre.label` (if present).

- [ ] **Step 4: Edit en.json**

- [ ] **Step 5: Translate to AR**

Secteurs :
- `Industrie` → `الصناعة`
- `Télécommunications & Médias` → `الاتصالات والإعلام`
- `Finance` → `المالية`
- `E-commerce` → `التجارة الإلكترونية`
- `Santé` → `الصحة`
- `Immobilier` → `العقارات`
- `Éducation` → `التعليم`

- [ ] **Step 6: Edit ar.json**

- [ ] **Step 7: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 8: Smoke check**

```bash
curl.exe -s http://localhost:3000/en/secteurs | grep -oE "(Industry|Healthcare|Finance|Education|Real Estate)" | sort -u
curl.exe -s http://localhost:3000/ar/secteurs | grep -oE "(الصناعة|الصحة|المالية|التعليم|العقارات)" | sort -u
```

Stop dev.

- [ ] **Step 9: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate secteurs namespace (7 industries) to EN + AR"
```

---

## Task 12: Translate `projects.*` + `blog.*` + `contact.*`

**Files:** `en.json`, `ar.json` — final batch combining the 3 last namespaces.

About ~120 keys total. The `projects.items.*` has 4 projects with potentially long `descriptionLong` paragraphs.

- [ ] **Step 1: Read fr.json `projects`, `blog`, `contact` blocks**

- [ ] **Step 2: Translate `projects.*` to EN**

`projects.items.*` : 4 projects identified in C2-Task 4 (rag, cod, sig, gam). For each :
- `title` (e.g., `"Système RAG Multi-sources"` → `"Multi-source RAG System"`)
- `category` / `categoryFull` (e.g., `"IA"` / `"Intelligence Artificielle"` → `"AI"` / `"Artificial Intelligence"`)
- `tagline`, `description`, `descriptionLong` (long paragraphs with `\n\n`)
- `tags[]` (mostly tech names — unchanged : `"RAG"`, `"OpenAI GPT-5"`, `"Python"`, etc.)
- `client`, `duration` (e.g., `"6 mois"` → `"6 months"`)
- `results[]` (label + value), `challenges[]`, `approach`

- [ ] **Step 3: Translate `blog.*` to EN**

`blog.hero`, `blog.index`, `blog.articles`, `blog.post` — labels du blog UI.

Examples :
- `"Lecture {minutes} min"` → `"{minutes} min read"`
- `"Articles similaires"` → `"Related articles"`
- `"Partager"` → `"Share"`
- `"Copié !"` → `"Copied!"`

- [ ] **Step 4: Translate `contact.*` to EN**

`contact.hero`, `contact.form` (8 field labels + 7 placeholders + 7 select options), `contact.success`, `contact.info` (address, hours), `contact.sidebar`, `contact.faq` (4 Q&A), `contact.engagements` (3 items).

Examples form :
- `"Nom complet"` → `"Full name"`
- `"Adresse email"` → `"Email address"`
- `"Téléphone"` → `"Phone"`
- `"Votre message"` → `"Your message"`
- `"Type de projet"` → `"Project type"`
- `"Conseil & stratégie"` → `"Consulting & strategy"`
- `"Casablanca, Maroc"` → `"Casablanca, Morocco"`
- `"Lundi au Samedi"` → `"Monday to Saturday"`

- [ ] **Step 5: Edit en.json — replace 3 blocks**

3 separate Edits or 1 big one — your call based on Edit ergonomics.

- [ ] **Step 6: Translate to AR**

Same approach. Vocabulary projects/blog/contact :
- `"Mois"` → `"شهر"` (singular) / `"أشهر"` (plural after 3-10) / `"شهرًا"` (after 11+)
- `"Lecture X min"` → `"قراءة X دقائق"` (or similar; AR plurals are complex, simplify for V1)
- `"Articles similaires"` → `"مقالات مشابهة"`
- `"Nom complet"` → `"الاسم الكامل"`
- `"Casablanca, Maroc"` → `"الدار البيضاء، المغرب"`

- [ ] **Step 7: Edit ar.json**

- [ ] **Step 8: TS check + build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npx tsc --noEmit && rm -rf .next && npm run build 2>&1 | tail -5
```

- [ ] **Step 9: Smoke check**

```bash
echo "=== /en/projects/rag ==="
curl.exe -s http://localhost:3000/en/projects/rag | grep -oE "(Multi-source RAG|Artificial Intelligence|months)" | sort -u | head -3

echo "=== /en/contact form ==="
curl.exe -s http://localhost:3000/en/contact | grep -oE 'placeholder="[^"]+"' | head -3

echo "=== /ar/projects/rag ==="
curl.exe -s http://localhost:3000/ar/projects/rag | grep -oE "(نظام|الذكاء الاصطناعي)" | sort -u | head -3
```

Stop dev.

- [ ] **Step 10: Commit**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && git add src/i18n/messages/en.json src/i18n/messages/ar.json && git commit -m "refactor(c3): translate projects + blog + contact namespaces to EN + AR"
```

---

## Task 13: Final validation (no commit)

- [ ] **Step 1: Production build**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && rm -rf .next && npm run build 2>&1 | tail -10
```
Expected : clean, ≥110 pages.

- [ ] **Step 2: All unit tests**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm test 2>&1 | tail -10
```
Expected : all 45 tests pass. Notably the `i18n coverage` describe blocks (4) — they validate FR has entries for each item, unaffected by EN/AR changes.

- [ ] **Step 3: All E2E tests**

```bash
cd "D:/server/website-act-officiel-/.worktrees/feat-i18n-architecture" && npm run test:e2e 2>&1 | tail -10
```
Expected : i18n + seo + smoke + content-fr-snapshot all pass. The content-fr-snapshot is FR-only — unaffected by EN/AR translations.

- [ ] **Step 4: Smoke checks via prod server**

`npm run start`, then comprehensive check :

```bash
echo "=== /en/ — no leftover FR ==="
curl.exe -s http://localhost:3000/en/ | grep -oE "(Notre|Découvrir|En savoir plus|Voir tous|Aujourd'hui|Bénéfices)" | head -5
# Expected: zero matches. If matches appear, some namespace wasn't translated.

echo ""
echo "=== /ar/ — no leftover FR ==="
curl.exe -s http://localhost:3000/ar/ | grep -oE "(Notre|Découvrir|En savoir plus|Voir tous|Aujourd'hui|Bénéfices)" | head -5
# Expected: zero matches.

echo ""
echo "=== /en/about title ==="
curl.exe -s http://localhost:3000/en/about | grep -oE "<title>[^<]+</title>"
# Expected: title in English (e.g., "About — Africa Centred Technology")

echo ""
echo "=== /ar/about RTL + content ==="
curl.exe -s http://localhost:3000/ar/about | grep -oE '<html[^>]*dir="rtl"[^>]*>' | head -1
curl.exe -s http://localhost:3000/ar/about | grep -oE "<title>[^<]+</title>"

echo ""
echo "=== Breadcrumb JSON-LD on /en/formations/<slug> ==="
curl.exe -s "http://localhost:3000/en/formations/01_ia_productivite_quotidienne" | grep -oE '"name":"(Home|Training)"' | sort -u
# Expected: contains "Home" and "Training" (not "Accueil"/"Formations")

echo ""
echo "=== sitemap.xml multi-locale ==="
curl.exe -s http://localhost:3000/sitemap.xml | head -5
```

Stop server. Verify each check matches expectation. If FR leftovers appear in EN/AR, identify which namespace wasn't fully translated and patch.

- [ ] **Step 5: Compile final report**

Summarize :
- Build outcome
- Unit test count (should be 45/45)
- E2E test count (should be ~32/35 with 3 skips for Shopify)
- Smoke check findings
- Any FR leftover detected → which namespace → propose patch task

---

## Acceptance Criteria

- ✅ Tasks 1-12 all committed on `feat/i18n-architecture` (~12 commits)
- ✅ `en.json` and `ar.json` byte-different from `fr.json` (≥99% of values changed)
- ✅ All ICU placeholders, HTML inline tags, newlines preserved exactly
- ✅ Brand names (ACT, OpenAI, etc.) and toponyms applied per glossary
- ✅ Build clean, ≥110 pages
- ✅ All tests pass (Task 13)
- ✅ Smoke checks show EN/AR content rendered without FR leftover

## Notes

- **Inline execution strongly recommended** for C3 (controller — this Claude session — does the translations directly). Subagent dispatching loses glossary memory between batches, degrading terminology consistency.
- **For subagent execution if chosen anyway** : the controller must pass the **full glossary section** in every dispatched prompt + verify glossary application during review. Otherwise each subagent re-invents term mappings, causing inconsistency.
- **Volume context-window** : 12 batches of ~50-200 segments each. Each batch's Edit replaces a ~5-30 KB JSON block. Total Edit count : 24+ (one per locale × 12 batches), often broken into smaller sub-Edits for the bigger namespaces (services.items, formations.defaults).
- **Quality validation** : automated tests don't check translation quality. Final validation (Task 13) is structural (build + tests + smoke FR leftover detection). Editorial quality validation = post-C3 human native AR/EN review, deferred.
- **Hardcoded FR residuals** (`"Sur devis"`, `"Réponse sous 24h"`) in `formation-defaults.ts` — outside C3 scope, handled in C4 with Shopify.
