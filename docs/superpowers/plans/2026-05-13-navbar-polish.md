# D1 — Navbar Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two small UI polish changes — (1) make the ACT logo's typography match the navigation links in `Header.tsx`, and (2) replace the `<select>` LanguageSwitcher with a globe-icon button that cycles `fr → en → ar → fr` on click.

**Architecture:** Both changes are local to `src/components/layout/`. The logo fix strips inline style overrides so the `<Link>` inherits the existing `.navbar-navigation__link` CSS class fully. The LanguageSwitcher is a complete rewrite of a 31-line component plus a rewrite of its 28-line test file.

**Tech Stack:** Next.js 16 App Router, next-intl v4, React 19, lucide-react, Vitest, @testing-library/react.

**Source spec:** `docs/superpowers/specs/2026-05-13-navbar-polish-design.md`

**Repo paths:**
- Modify: `src/components/layout/Header.tsx` (lines 268-289)
- Rewrite: `src/components/layout/LanguageSwitcher.tsx`
- Rewrite: `tests/unit/i18n/LanguageSwitcher.test.tsx`
- Test runner: `npx vitest run`

---

## Task 1: ACT logo typography

**Files:**
- Modify: `src/components/layout/Header.tsx` (lines 268-289)

**Context:** The ACT logo `<Link>` currently has an inline `style={...}` block that overrides the `.navbar-navigation__link` class. Result: the logo is slightly smaller (`clamp(1.2rem, 1.5vw, 1.6rem)`) and has tighter letter-spacing (`0.08em`) than the nav links (`clamp(1.3rem, 1.6vw, 1.75rem)`, `0.1em`). Removing the inline overrides — keeping only `position: relative` for the underline dot — makes them identical.

- [ ] **Step 1: Apply the typography fix**

In `src/components/layout/Header.tsx`, find this block around line 267-289:

```tsx
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
```

Replace with:

```tsx
          <Link
            href="/"
            className={`navbar-navigation__link${isActive("index") ? " --is-active" : ""}`}
            style={{ position: "relative" }}
          >
            ACT
```

(The `ACT` literal text and the `motion.span` underline dot below it stay unchanged.)

- [ ] **Step 2: Verify TypeScript**

```
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 3: Verify tests still pass**

```
npx vitest run
```

Expected: all baseline tests still green. No tests assert on Header logo typography, so this should be a no-op for the test suite.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "fix(d1): align ACT logo typography with nav links"
```

---

## Task 2: LanguageSwitcher globe button — failing test

**Files:**
- Rewrite: `tests/unit/i18n/LanguageSwitcher.test.tsx`

**Context:** Following TDD, rewrite the test file first to specify the new component's contract. The 2 existing tests describe the `<select>` behavior — they're replaced by 5 tests for the globe button.

- [ ] **Step 1: Replace the test file contents entirely**

Overwrite `tests/unit/i18n/LanguageSwitcher.test.tsx` with:

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

- [ ] **Step 2: Run the test to verify it fails**

```
npx vitest run tests/unit/i18n/LanguageSwitcher.test.tsx
```

Expected: tests FAIL — the current `LanguageSwitcher` renders a `<select>` (combobox role), not a `<button>`. The first test should fail with something like "Unable to find element with role 'button'" or display text "FR" not matching the option labels.

- [ ] **Step 3: Do NOT commit yet**

The test file alone with no matching component yields a red test. Commit comes after Task 3 (the implementation) so the commit history shows test + impl together.

---

## Task 3: LanguageSwitcher globe button — implementation

**Files:**
- Rewrite: `src/components/layout/LanguageSwitcher.tsx`

- [ ] **Step 1: Replace the file contents entirely**

Overwrite `src/components/layout/LanguageSwitcher.tsx` with:

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

- [ ] **Step 2: Run the unit tests**

```
npx vitest run tests/unit/i18n/LanguageSwitcher.test.tsx
```

Expected: PASS — 5/5 tests.

- [ ] **Step 3: Run the full test suite**

```
npx vitest run
```

Expected: all unit tests green. The test count shifts: 77 (from C5 end) − 2 (removed LanguageSwitcher tests) + 5 (new) = 80 tests passing.

- [ ] **Step 4: Run TypeScript check**

```
npx tsc --noEmit
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/LanguageSwitcher.tsx tests/unit/i18n/LanguageSwitcher.test.tsx
git commit -m "feat(d1): replace LanguageSwitcher dropdown with globe cycle button"
```

---

## Task 4: Verify e2e i18n flow still works

**Files:** none modified — verification only.

**Context:** The existing `tests/e2e/i18n.spec.ts` exercises locale switching via the UI. The old test interacted with a `<select>` element; the new component is a `<button>`. We need to check if the test passes or needs updating.

- [ ] **Step 1: Inspect the e2e test for hard dependencies on `<select>`**

```
grep -n "select\|combobox\|LanguageSwitcher" tests/e2e/i18n.spec.ts
```

Look for any locator that targets `select`, `combobox`, or specifically depends on the old dropdown semantics. If found, note the line numbers.

- [ ] **Step 2: Run the e2e suite**

```
npx playwright test tests/e2e/i18n.spec.ts
```

Expected: all i18n tests pass. If any fail because they target `<select>` elements directly, see Step 3.

- [ ] **Step 3: Update e2e selectors if needed**

If a test failed because it does e.g. `page.locator('form select')` or similar `<select>`-specific lookup, update it to target the new button. The new button is the only `<button>` in the locale-switching UI region. A robust selector:

```ts
page.getByRole("button", { name: /switch to/i })
```

This matches the dynamic `aria-label="Switch to English"`/`French`/`العربية` pattern.

Clicking the button cycles to the next locale (not directly to a specific one). The old test pattern `select.selectOption("en")` (which jumped straight to EN) becomes either:
- Click once if going from FR → EN.
- Click twice if going from FR → AR (FR → EN → AR).

Update the test logic accordingly. If the test originally just verifies "switching locale works", a single click verifying FR → EN is sufficient.

- [ ] **Step 4: Re-run e2e to confirm green**

```
npx playwright test tests/e2e/i18n.spec.ts
```

Expected: all i18n tests pass.

- [ ] **Step 5: Commit (only if test file was modified)**

If no test changes were needed in Step 3, skip this step.

If test changes were needed:

```bash
git add tests/e2e/i18n.spec.ts
git commit -m "test(d1): update i18n e2e selectors for globe button switcher"
```

---

## Task 5: Final validation

**Files:** none modified — verification only.

- [ ] **Step 1: TypeScript clean**

```
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: All unit tests pass**

```
npx vitest run
```

Expected: 80 unit tests pass (77 baseline − 2 removed + 5 new).

- [ ] **Step 3: All Playwright tests pass**

```
npx playwright test
```

Expected: all e2e tests pass. The smoke test pre-existing issues were fixed in C5 (`30734b8`). The flaky `/ar/about` console-error test should pass when run cleanly.

- [ ] **Step 4: Production build green**

```
npm run build
```

Expected: build succeeds, no new errors compared to C5 end.

- [ ] **Step 5: Visual smoke (manual, requires dev server)**

```
npm run dev
```

Open in a browser and verify:
- `http://localhost:3000/fr` — at desktop width, observe the ACT logo (left of nav) and the nav links (Notre savoir-faire, Formations, Blog, Réalisations, etc.). They should look visually consistent: same Poppins, same size, same letter-spacing, same uppercase, same weight.
- Click the globe button. URL should change to `/en/...`. The button text should now show "EN".
- Click again. URL should change to `/ar/...`. The button text should now show "AR". The page should render right-to-left (verified in the C5 RTL smoke).
- Click again. URL should cycle back to `/fr/...`.
- On a narrow viewport (≤ 1023px), open the hamburger mobile menu. Scroll to the footer of the drawer — the globe button should be there, cycling identically.

Kill the dev server when done.

- [ ] **Step 6: Hand off to finishing skill**

Announce: "I'm using the finishing-a-development-branch skill to complete this work."

Use `superpowers:finishing-a-development-branch` to present the 4-option menu (Merge / PR / Keep / Discard).
