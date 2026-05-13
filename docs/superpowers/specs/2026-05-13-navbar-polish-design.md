# D1 — Navbar Polish Design

**Date:** 2026-05-13
**Branch:** `feat/i18n-architecture`
**Status:** Spec — pending plan
**Prior work:** A → B → C1 → C2 → C3 → C4 → C5

---

## Goal

Two small UI polish changes in `src/components/layout/Header.tsx` and `src/components/layout/LanguageSwitcher.tsx`:

1. Make the ACT logo's typography match the navigation links exactly (same font, size, letter-spacing, weight) — the user noticed an asymmetry between the site name on the left and the nav titles on the right.
2. Replace the `<select>` dropdown LanguageSwitcher with a globe-icon button that cycles through the three locales on click.

This is D1, the UI-polish half of sub-project D. Performance + Best-Practices work (D2) is a separate sub-project that runs after a clean Lighthouse baseline is established on Linux/macOS.

## Architecture

Two independent units of work, both contained within the `layout` folder:

```
unit 1 — Navbar logo typography
  src/components/layout/Header.tsx
    line 268-289: drop inline font overrides on the ACT <Link>
                  → it now inherits .navbar-navigation__link fully

unit 2 — LanguageSwitcher globe button
  src/components/layout/LanguageSwitcher.tsx (rewrite)
  tests/unit/i18n/LanguageSwitcher.test.tsx (rewrite — 5 tests)
```

No other files are touched. No new dependencies.

## Unit 1 — Navbar logo typography

The ACT logo is currently rendered with an inline `style={...}` block that overrides the `.navbar-navigation__link` class. The result: the logo is slightly smaller and has tighter letter-spacing than the nav links.

### Concrete values

| Property | Nav link (`.navbar-navigation__link` in globals.css) | ACT logo (inline override in Header.tsx) |
|---|---|---|
| `font-size` | `clamp(1.3rem, 1.6vw, 1.75rem)` | `clamp(1.2rem, 1.5vw, 1.6rem)` |
| `letter-spacing` | `0.1em` | `0.08em` |
| `font-family` | `Poppins, sans-serif` | `var(--font-body)` (Poppins) |
| `font-weight` | default (400) | `700` |
| `text-transform` | `uppercase` | `uppercase` |

### Change

Remove the inline `fontFamily`, `fontSize`, `letterSpacing`, `textTransform`, and `fontWeight` overrides on the `<Link>` at Header.tsx line 268. Keep only `position: "relative"` (needed because the active-state dot at line 280 is positioned absolutely against this Link).

```tsx
// Before (lines 268-289)
<Link
  href="/"
  className={`navbar-navigation__link${isActive("index") ? " --is-active" : ""}`}
  style={{
    position: "relative",
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    fontSize: "clamp(1.2rem, 1.5vw, 1.6rem)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  }}
>
  ACT
  {/* underline dot */}
</Link>

// After
<Link
  href="/"
  className={`navbar-navigation__link${isActive("index") ? " --is-active" : ""}`}
  style={{ position: "relative" }}
>
  ACT
  {/* underline dot */}
</Link>
```

After this change, the ACT logo and the nav links use the same Poppins, the same `clamp(1.3rem, 1.6vw, 1.75rem)` size, the same `0.1em` letter-spacing, the same weight (400), and the same uppercase transform.

## Unit 2 — LanguageSwitcher globe button

Replace `src/components/layout/LanguageSwitcher.tsx` entirely:

```tsx
"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();

  const ordered = routing.locales as readonly string[];
  const idx = ordered.indexOf(current);
  const next = ordered[(idx + 1) % ordered.length] as (typeof routing.locales)[number];

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={`Switch to ${LOCALE_LABELS[next]}`}
      className="inline-flex items-center gap-1.5 bg-transparent text-sm font-medium border border-current rounded px-2 py-1 hover:opacity-80 transition-opacity"
    >
      <Globe size={14} aria-hidden="true" />
      <span>{current.toUpperCase()}</span>
    </button>
  );
}
```

### Behavior contract

- Click cycles `fr → en → ar → fr` (the fixed order of `routing.locales`).
- The button visibly shows the *current* locale code; the `aria-label` announces the *next* locale (what the click will do).
- Navigation uses `router.replace(pathname, { locale: next })` — same mechanism as the previous `<select>`-based implementation.
- The component is `"use client"` (uses `useLocale`, `useRouter`, `usePathname`).

### Placement (unchanged)

`<LanguageSwitcher />` continues to be rendered in two places in `Header.tsx`:

- Desktop nav bar (around line 409).
- Mobile menu footer (around line 564).

No change to Header.tsx for placement — the component is just swapped in place.

### Test update

Rewrite `tests/unit/i18n/LanguageSwitcher.test.tsx` with 5 tests. The two existing tests assert behaviors that don't match the new component and must be replaced.

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock next-intl + navigation hooks
const replaceMock = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/services",
  useRouter: () => ({ replace: replaceMock }),
}));

// Per-test locale mock — reassignable so each `it` can swap it.
// Captured by closure inside the factory below.
let currentLocale = "fr";
vi.mock("next-intl", () => ({
  useLocale: () => currentLocale,
}));

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    replaceMock.mockReset();
  });

  it("displays the current locale code in uppercase", () => {
    currentLocale = "fr";
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button")).toHaveTextContent("FR");
  });

  it("cycles fr → en when clicked", () => {
    currentLocale = "fr";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    expect(replaceMock).toHaveBeenCalledWith("/services", { locale: "en" });
  });

  it("cycles en → ar when clicked", () => {
    currentLocale = "en";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    expect(replaceMock).toHaveBeenCalledWith("/services", { locale: "ar" });
  });

  it("cycles ar → fr when clicked (wraps around)", () => {
    currentLocale = "ar";
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button"));
    expect(replaceMock).toHaveBeenCalledWith("/services", { locale: "fr" });
  });

  it("aria-label announces the next locale", () => {
    currentLocale = "fr";
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Switch to English");
  });
});
```

## Error handling

- **Unknown locale at runtime:** If `useLocale()` returns a value not in `routing.locales` (theoretically impossible given the type), `indexOf` returns `-1` and the modulo gives `(−1 + 1) % 3 = 0` — first locale (`fr`). Graceful fallback, no throw. Acceptable.
- **router.replace failures:** Same behavior as before — handled by next-intl. No special handling needed.
- **No-locale URL** (e.g., the root `/` before redirect): `usePathname()` returns the pathname stripped of locale; `router.replace(pathname, { locale })` handles it correctly. Unchanged from the prior implementation.

## Testing strategy

- **Unit:** the 5 rewritten LanguageSwitcher tests above.
- **E2E:** the existing `tests/e2e/i18n.spec.ts` already exercises locale switching via UI interaction. After this change, the test must still pass. If it specifically clicks a `<select>` element, it may need to be updated — verify during implementation.
- **Manual visual smoke:** open the dev server, visit `/fr`, click the globe button, verify cycle to `/en` → `/ar` → `/fr`. Verify on mobile menu (open the hamburger, click the globe in the footer).

## Done criteria

- `Header.tsx` ACT `<Link>` has no inline font overrides.
- `LanguageSwitcher.tsx` exports a `<button>`-based globe component matching the spec.
- 5 LanguageSwitcher unit tests pass.
- `npx tsc --noEmit` clean.
- `npx vitest run` all green (~81 tests after removing 2 old LanguageSwitcher tests and adding 5 new).
- `npm run build` green.
- Existing Playwright e2e suite green (i18n.spec.ts in particular).
- Visual smoke: at desktop width, ACT logo and nav links have visually identical typography.

## Out of scope

- **Mobile-menu logo font** (Lora vs Poppins inconsistency in the collapsed drawer at Header.tsx line 454) — different visual context from the main navbar; not the symmetry the user raised.
- **`.brand-logo` CSS class refactor** — over-engineering for a one-place style.
- **Switcher cycle animation** (fade/slide on locale change) — can be added later if the cycle feels jarring.
- **D2 — Performance + Best Practices** — separate sub-project. Requires re-running Lighthouse on Linux/macOS first to establish a clean baseline.

## Open questions

None. All resolved during brainstorming:
- Logo typography: match nav links exactly.
- Switcher cycle: `fr → en → ar → fr`.
- Switcher placement: unchanged (desktop nav + mobile menu footer).
