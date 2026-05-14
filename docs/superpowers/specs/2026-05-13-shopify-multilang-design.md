# C4 — Shopify Multi-language Design

**Date:** 2026-05-13
**Branch:** `feat/i18n-architecture`
**Status:** Spec — pending plan
**Prior work:** A (i18n architecture), B (SEO foundations), C1 (UI string externalization), C2 (static data migration), C3 (FR→EN+AR translation)

---

## Goal

Make Shopify-driven content (formations + blog) honor the active locale end-to-end, by passing `locale` from each Next route down to the Storefront GraphQL fetcher, which adds the `@inContext(language: ...)` directive. Resolve the two FR strings that remained out-of-scope of C3 because they live in Shopify-adjacent code (`formation-defaults.ts` + `formations.ts` fallback). Tag form submissions with the user's locale so customer service can reply in the right language. Verify the sitemap correctly exposes formation and blog URLs in all three locales.

## Architecture

**Data flow:**

```
Next page (/[locale]/formations/[slug])
  ↓ locale="en"
Server fetcher fetchShopifyFormationByHandle(handle, locale)
  ↓ language=EN
GraphQL: query GetFormation @inContext(language: $lang) { ... }
  ↓
Shopify Storefront API (Translate & Adapt returns translated values)
  ↓
Page renders in EN
```

EN and AR translations already exist in the Shopify shop (confirmed with the user — Translate & Adapt is configured). C4 is plumbing only; no Shopify-side data work.

**Locale → Shopify LanguageCode mapping:**

| App locale | Shopify `LanguageCode` |
|------------|-----------------------|
| `fr`       | `FR`                  |
| `en`       | `EN`                  |
| `ar`       | `AR`                  |

Country code (`MA`) is not strictly required for language-only translation; we omit it from the directive to keep scope minimal.

**URL strategy:** Same handle/slug across all three locales (decided with the user). `/fr/formations/python-basics`, `/en/formations/python-basics`, `/ar/formations/python-basics` all hit the same Shopify product; only the response payload differs by `@inContext` language.

**Cache strategy:** Next.js `fetch()` is keyed by URL + body. Adding `?locale=` to the API route URL and `$lang` to the GraphQL request body produces 3 distinct cache entries per resource automatically. No manual cache work.

## Components & files

### New

- **`src/lib/shopify/locale.ts`** (~15 lines) — `toShopifyLanguage(locale: Locale): "FR" | "EN" | "AR"`. Throws on unknown input (defensive guard at the i18n→Shopify boundary).

### Modified

- **`src/lib/shopify/formations.ts`** — `fetchShopifyFormations(locale)` and `fetchShopifyFormationByHandle(handle, locale)` get a `locale` parameter. Inline GraphQL queries (`PRODUCTS_QUERY`, `PRODUCT_BY_HANDLE_QUERY`) get the `@inContext(language: $lang)` directive and a `$lang: LanguageCode!` variable. The price fallback at line 211 returns `null` rather than the literal `"Sur devis"` — the rendering component picks up the localized string via `t("metaSurDevis")`.
- **`src/lib/shopify/blog.ts`** — same pattern: `fetchAllArticles(locale)` and `fetchArticleByHandle(handle, locale)` with `@inContext` on `ALL_ARTICLES_QUERY` and the article-by-handle query.
- **`src/lib/api/formations.ts`** + **`src/lib/api/blog.ts`** — read `locale` from `request.nextUrl.searchParams.get("locale")` (default `"fr"`), validate against `["fr","en","ar"]`, pass to the fetcher.
- **`src/app/[locale]/formations/page.tsx`**, **`src/app/[locale]/formations/[slug]/page.tsx`**, **`src/app/[locale]/blog/page.tsx`**, **`src/app/[locale]/blog/[slug]/page.tsx`** — read `locale` from `params`, pass directly to fetcher (no API hop for server-rendered paths).
- **`src/components/formations/FormationLandpage.tsx`** + **`src/components/blog/BlogShell.tsx`** (or equivalent client fetchers) — read locale via `useLocale()` from next-intl, append `?locale=${locale}` to fetch URLs.
- **`src/lib/data/formation-defaults.ts`** — convert from a static export to a factory function `getFormationDefaults(t)` that returns localized defaults using a passed-in translator. Callers (`FormationDetailShell`, `LandingFormation`) call it with their `useTranslations("formations")` instance.

### Residual FR strings

1. **`"Sur devis"`** — `formations.metaSurDevis` key already exists in `fr.json` per the C3 audit. Reuse it. Add EN translation `"On request"` and AR translation `"حسب الطلب"` in the corresponding dictionaries.

2. **`"Réponse sous 24h"`** — add new key `formations.brochure.responseTime`:
   - FR: `"Réponse sous 24h"`
   - EN: `"Response within 24h"`
   - AR: `"ردّ خلال 24 ساعة"`

### Form locale-tagging

For `/api/shopify/inscription`, `/api/shopify/newsletter`, `/api/brochure`:

- Client-side: append the active locale to the request body (`locale: "en"`).
- Handler: validate locale is in `["fr","en","ar"]`, add a Shopify customer **tag** `lang:en` (or append to existing tags) in the Admin API mutation. Tags are cleaner than note-stuffing for filtering inside the Shopify admin.

~10 lines per route.

## Error handling

- **Unknown locale at boundary**: `toShopifyLanguage` throws. API route handlers default to `"fr"` if the query param is missing or unrecognized — never throws at the route boundary (graceful fallback for malformed client calls).
- **Shopify translation missing**: Translate & Adapt silently falls back to the default locale (FR). No app-level error — the page renders in FR. This is acceptable degradation; surfacing it as an error would block the page on a non-blocking content problem.
- **Form locale tag failure**: If the Shopify Admin mutation rejects the tag, log the error but don't fail the user-facing form. The submission still goes through.

## Testing strategy

### Unit tests

1. **`src/lib/shopify/locale.test.ts`** — `toShopifyLanguage()` returns `FR`/`EN`/`AR` for the three locales; throws on unknown input.
2. **Extend `tests/unit/shopify/formations.test.ts`** (create if absent) — mock the Storefront `fetch`, assert the GraphQL request body for each locale:
   - Includes `@inContext(language: EN)` (etc.) directive.
   - Passes correct `$lang` variable value.
   - 3 locales × 2 fetchers (list + detail) = 6 tests.
3. **Extend `tests/unit/shopify/blog.test.ts`** — same pattern, 6 tests.
4. **Extend `tests/unit/i18n/sitemap.test.ts`** — assert canonical entries (not just hreflang alternates) exist for `/en/formations/<slug>`, `/ar/formations/<slug>`, `/en/blog/<slug>`, `/ar/blog/<slug>`.
5. **`tests/unit/api/brochure-locale-tag.test.ts`** + **`tests/unit/api/inscription-locale-tag.test.ts`** — posting with `locale: "en"` results in the Shopify Admin call including a `lang:en` tag.

### Smoke (manual)

- `npm run build && npm start`
- Visit `/en/formations` and `/ar/formations` — verify Shopify titles/descriptions render in EN and AR.
- Open one formation detail page in each locale — verify metafields are translated.
- Submit a brochure form in EN — verify the resulting Shopify customer has tag `lang:en` (requires Shopify admin access; falls back to trusting the unit test if admin access isn't available).

## Done criteria

- `npx tsc --noEmit` clean.
- All unit tests pass (existing 45 + new ~14).
- `npm run build` green.
- Grep audit: zero hardcoded `"Sur devis"` or `"Réponse sous 24h"` literals in `src/`.
- Manual smoke verified for one formation slug and one blog slug per locale.

## Out of scope

- Translating Shopify content itself (Translate & Adapt already handles this — confirmed with user).
- Translated handles per locale (decided: same slug across the three locales).
- Multi-currency / Shopify Markets country switching (language-only for now).
- Performance work (Lighthouse Perf 35→90, BP 54→90) — belongs to sub-project D.
- Native AR review of translated Shopify content quality (belongs to C5).
- RTL polish on formation/blog UI (belongs to C5).

## Open questions

None. All clarifying questions answered during brainstorming:
- Shopify EN/AR translations exist → ship plumbing now, validate against real data.
- Same slug across locales → no handle translation work.
- Tag locale on forms: yes. Verify sitemap EN+AR coverage: yes.
