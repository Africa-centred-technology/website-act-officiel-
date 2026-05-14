# C5 — QA Finale Design

**Date:** 2026-05-13
**Branch:** `feat/i18n-architecture`
**Status:** Spec — pending plan
**Prior work:** A (i18n architecture), B (SEO foundations), C1 (UI string externalization), C2 (static data migration), C3 (FR→EN+AR translation), C4 (Shopify multi-language)

---

## Goal

Verify EN and AR locales are production-ready by (a) measuring Lighthouse scores against the FR baseline across 6 key pages × 3 locales, (b) fixing directional UI bugs only visible in RTL, and (c) protecting against future translation drift via an automated key-parity test.

C5 is the **QA finale** for the i18n-architecture branch. It does not fix Lighthouse scores — those belong to sub-project D. It does not include a native AR review — that is deferred to a separate follow-up.

## Architecture

Three independent units of work, each in its own file boundary, run in any order:

```
unit 1 — Lighthouse comparative audit
  scripts/lighthouse-audit.mjs  →  docs/lighthouse-audit-2026-05-13.md
                                      18 audits, per-locale summary, regressions section

unit 2 — RTL polish
  src/lib/i18n/direction.ts (new helper)
  ~6 directional components rewired to use the helper or a CSS mirror class
  tests/e2e/rtl-smoke.spec.ts (new — 5 tests across /ar pages)

unit 3 — Translation parity test
  tests/unit/i18n/translation-parity.test.ts (new — 1 test)
```

No production code outside `src/` is touched apart from the 6 directional components and the new direction helper. No CI integration. No new build pipeline.

## Unit 1 — Lighthouse comparative audit

### Script

New file `scripts/lighthouse-audit.mjs` (ES module). Behavior:

1. Read `BASE_URL` from env, default `http://localhost:3000`.
2. Iterate over `paths = ["", "/about", "/services", "/formations", "/blog", "/contact"]` × `locales = ["fr", "en", "ar"]` = 18 URLs.
3. For each URL, run Lighthouse with `--preset=desktop --output=json --quiet`. Use the programmatic API (`import lighthouse from "lighthouse"`) with `chrome-launcher` to drive a fresh Chrome instance per audit.
4. Extract `result.categories.{performance,accessibility,best-practices,seo}.score * 100` for each audit. Round to integer.
5. Emit `docs/lighthouse-audit-2026-05-13.md` with:
   - **Header table:** URL × {perf, a11y, bp, seo}, 18 rows.
   - **Per-locale summary table:** locale × average score across the 6 pages.
   - **Regressions section:** flag any EN or AR page that scores ≥ 5 points worse than its FR counterpart in any category. Empty section if no regressions.

### npm script

`package.json` `scripts` block gains:
```
"audit:lighthouse": "node scripts/lighthouse-audit.mjs"
```

### Dependencies

If `lighthouse` and `chrome-launcher` are not already devDependencies, add them. Both are dev-only.

### Out of scope for unit 1

- Fixing any score regression. C5 measures; D fixes.
- Mobile audits. Desktop only.
- Lighthouse CI integration. No `@lhci/cli`, no GitHub Actions, no scheduled runs.

## Unit 2 — RTL polish

### Helper

New file `src/lib/i18n/direction.ts`:

```ts
import type { Locale } from "@/i18n/routing";

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export function directionalArrows(locale: Locale): { previous: string; next: string } {
  return isRtl(locale)
    ? { previous: "→", next: "←" }
    : { previous: "←", next: "→" };
}
```

### CSS mirror utility

`src/app/globals.css` gains a single class:
```css
[dir="rtl"] .mirror-in-rtl { transform: scaleX(-1); }
```

Components that use lucide-react icons like `ChevronLeft`/`ChevronRight` either swap which icon they render based on `isRtl(locale)`, OR keep one icon and add `className="mirror-in-rtl"` for CSS-side mirroring. Both are valid; pick whichever is less invasive per component.

### Components to fix

| File | Approach |
|---|---|
| `src/components/layout/Header.tsx` (MobileAccordion chevron) | Verify in browser — chevron rotation animates up/down, likely fine in RTL. If a horizontal arrow appears, mirror it. |
| `src/components/formations/FormationsCarousel.tsx` | Swap arrow characters via `directionalArrows(locale)`. |
| `src/components/blog/BlogArticlesShell.tsx` | Pagination uses `ChevronLeft`/`ChevronRight`. Swap based on `isRtl(locale)` OR apply `mirror-in-rtl` class. |
| `src/components/poles/PolesIndexShell.tsx` | Same as FormationsCarousel. |
| `src/components/realisations/ProjectDetailShell.tsx` | Next/previous project nav — swap arrow characters via helper. |
| `src/components/services/ServicesShell.tsx` | Verify directional scroll logic still feels correct in RTL; adjust if needed. |

The exact mechanism per component is left to the implementation plan. The contract: in `/ar/<page>`, the "previous" affordance points right (→) and "next" points left (←).

### Playwright smoke

New file `tests/e2e/rtl-smoke.spec.ts`. For each of 5 AR pages (`/ar`, `/ar/about`, `/ar/services`, `/ar/formations`, `/ar/blog`):

```ts
test("/ar/... loads with dir=rtl and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  await page.goto(`/ar${path}`);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  expect(errors).toEqual([]);
});
```

5 tests total. The existing Playwright config (used by `smoke.spec.ts`, `i18n.spec.ts`) handles base-URL and dev-server orchestration.

### Out of scope for unit 2

- Pixel-perfect manual audit of all 19 pages. The smoke test + directional fixes are the agreed surface.
- Cairo font conditional loading (a perf optimization — belongs to D).
- Navbar typography symmetry and globe LanguageSwitcher — both tracked in sub-project D.

## Unit 3 — Translation parity test

### Test

New file `tests/unit/i18n/translation-parity.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import fr from "@/i18n/messages/fr.json";
import en from "@/i18n/messages/en.json";
import ar from "@/i18n/messages/ar.json";

function collectLeafPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    collectLeafPaths(v, prefix ? `${prefix}.${k}` : k)
  );
}

describe("translation parity", () => {
  const frPaths = new Set(collectLeafPaths(fr));

  it("every fr.json leaf key exists in en.json", () => {
    const enPaths = new Set(collectLeafPaths(en));
    const missing = [...frPaths].filter((p) => !enPaths.has(p));
    expect(missing.slice(0, 10), `missing in en.json (showing first 10): ${missing.slice(0, 10).join(", ")}`).toEqual([]);
  });

  it("every fr.json leaf key exists in ar.json", () => {
    const arPaths = new Set(collectLeafPaths(ar));
    const missing = [...frPaths].filter((p) => !arPaths.has(p));
    expect(missing.slice(0, 10), `missing in ar.json (showing first 10): ${missing.slice(0, 10).join(", ")}`).toEqual([]);
  });
});
```

Arrays are treated as leaves (the whole array is one "key path") rather than expanding indices, because translation dictionaries use arrays for bullet-list content where the structure should be identical across locales but per-item content differs.

### Out of scope for unit 3

- Value-level checks (e.g., flagging EN values that are identical to FR — indicating untranslated strings). Out of scope; would produce too much noise on legitimate proper nouns and brand names.
- ICU placeholder validation (e.g., `{count}` consistency across locales). Out of scope; future improvement.

## Error handling

- **Lighthouse failures:** if Chrome fails to launch or a single URL audit times out, log the error, mark that row with `ERROR` in the markdown report, and continue with the remaining URLs. The script exits 0 unless every audit failed (in which case exit 1).
- **Server not running:** the script checks `fetch(BASE_URL)` first. If it can't connect, print a helpful message ("Run `npm run build && npm start` first") and exit 1.
- **RTL smoke test failures:** treated like any other Playwright failure — exit 1, surfaced in CI.
- **Translation parity failures:** the assertion includes the first 10 missing paths in the error message for fast debugging.

## Testing strategy

Unit tests added: 1 (translation parity, with 2 `it()` cases).
E2E tests added: 5 (RTL smoke).
Lighthouse: not a test — a manual audit run producing a committed markdown report.

Verification after C5:
- `npx tsc --noEmit` clean.
- `npx vitest run` — all tests pass (~71 from prior + 1 parity = ~72 unit; 5 new e2e).
- `npm run audit:lighthouse` produces a fresh report; review it manually for surprises.
- Visual: open `/ar/formations` and `/ar/blog`, click pagination/carousel arrows, confirm they point the right way.

## Done criteria

- `scripts/lighthouse-audit.mjs` exists; `npm run audit:lighthouse` produces `docs/lighthouse-audit-2026-05-13.md` with 18 audits + per-locale summary + regressions section.
- `src/lib/i18n/direction.ts` exposes `isRtl(locale)` and `directionalArrows(locale)`. All 6 directional components honor locale direction — zero hardcoded `←`/`→` characters or `ChevronLeft`/`ChevronRight` pairs that ignore the active locale.
- `tests/e2e/rtl-smoke.spec.ts` — 5 tests pass.
- `tests/unit/i18n/translation-parity.test.ts` — 2 tests pass.
- `npx tsc --noEmit` clean. Full test suite green.
- The Lighthouse markdown report is committed under `docs/`.

## Out of scope (consolidated)

- Lighthouse score fixes (perf 35→90, BP 54→90) — sub-project D.
- Native AR translation review by a human Arabic speaker — deferred.
- Mobile Lighthouse audits — desktop only.
- CI integration of Lighthouse (`@lhci/cli`, GitHub Actions) — not adopted.
- Pixel-perfect manual visual audit of all 19 pages — smoke + arrow fixes are the surface.
- Navbar typography symmetry, globe LanguageSwitcher — sub-project D.
- Conditional Cairo font loading — sub-project D (perf concern).
- ICU placeholder validation across locales — future improvement.
- Value-level translation comparison (e.g., flagging untranslated EN/AR strings identical to FR) — future improvement.

## Open questions

None. All clarifying questions resolved during brainstorming:
- AR review by human → deferred.
- Lighthouse → audit only, no fixes.
- RTL polish → directional arrows + smoke, no exhaustive manual visual audit.
