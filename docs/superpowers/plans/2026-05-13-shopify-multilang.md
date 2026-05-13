# C4 — Shopify Multi-language Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Shopify-driven content (formations + blog) honor the active locale end-to-end via `@inContext(language: ...)`, resolve the 2 residual FR strings, tag form submissions with the user's locale, and verify the sitemap exposes formation/blog URLs for all three locales.

**Architecture:** A new `toShopifyLanguage()` helper at the i18n→Shopify boundary maps the next-intl `Locale` to a Shopify `LanguageCode`. The 4 Storefront queries gain `@inContext(language: $lang)` directives. Locale flows from Next pages → API route handlers (via `?locale=` query) → fetchers. Form handlers accept a `locale` field and add a `lang:<code>` Shopify customer tag. Sitemap emits canonical entries per locale.

**Tech Stack:** Next.js 16 (App Router), next-intl v4, Shopify Storefront API 2024-01, Shopify Admin API, Vitest, TypeScript.

**Source spec:** `docs/superpowers/specs/2026-05-13-shopify-multilang-design.md`

**Repository layout (key paths):**
- `src/lib/shopify/{formations,blog}.ts` — fetchers + inline GraphQL queries
- `src/lib/api/{formations,blog,brochure,inscription,newsletter}.ts` — route handler implementations (the `src/app/api/.../route.ts` files just re-export from here)
- `src/app/[locale]/{formations,blog}/...` — pages
- `src/components/{formations,blog}/*.tsx` — client components that call the API routes
- `src/lib/data/formation-defaults.ts` — structural defaults with 2 residual FR strings
- `src/i18n/messages/{fr,en,ar}.json` — message dictionaries
- `src/app/sitemap.ts` — sitemap generator
- `tests/unit/i18n/sitemap.test.ts` — sitemap tests (Shopify mocked)
- Test runner: `npx vitest run` (or `npm test -- --run`)

---

## Task 1: Locale helper

**Files:**
- Create: `src/lib/shopify/locale.ts`
- Create: `tests/unit/shopify/locale.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/shopify/locale.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { toShopifyLanguage } from "@/lib/shopify/locale";

describe("toShopifyLanguage", () => {
  it("maps fr → FR", () => {
    expect(toShopifyLanguage("fr")).toBe("FR");
  });
  it("maps en → EN", () => {
    expect(toShopifyLanguage("en")).toBe("EN");
  });
  it("maps ar → AR", () => {
    expect(toShopifyLanguage("ar")).toBe("AR");
  });
  it("throws on unknown locale", () => {
    // @ts-expect-error — testing runtime guard
    expect(() => toShopifyLanguage("de")).toThrow(/unsupported locale/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run tests/unit/shopify/locale.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/shopify/locale'".

- [ ] **Step 3: Implement the helper**

Create `src/lib/shopify/locale.ts`:

```ts
import type { Locale } from "@/i18n/routing";

export type ShopifyLanguageCode = "FR" | "EN" | "AR";

/**
 * Map the next-intl Locale to a Shopify Storefront LanguageCode.
 * Used at the i18n→Shopify boundary to feed @inContext(language: $lang).
 */
export function toShopifyLanguage(locale: Locale): ShopifyLanguageCode {
  switch (locale) {
    case "fr": return "FR";
    case "en": return "EN";
    case "ar": return "AR";
    default: {
      const exhaustive: never = locale;
      throw new Error(`Unsupported locale for Shopify: ${exhaustive as string}`);
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npx vitest run tests/unit/shopify/locale.test.ts
```

Expected: PASS — 4/4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shopify/locale.ts tests/unit/shopify/locale.test.ts
git commit -m "feat(c4): add Locale → Shopify LanguageCode mapper"
```

---

## Task 2: Wire @inContext into formations queries + locale parameter

**Files:**
- Modify: `src/lib/shopify/formations.ts` (PRODUCTS_QUERY ~ lines 24-69, PRODUCT_BY_HANDLE_QUERY ~ lines 277-348, fetchShopifyFormations ~ lines 231-273, fetchShopifyFormationByHandle ~ lines 664-694, mapProduct ~ lines 175 for the price fallback)
- Test: `tests/unit/shopify/formations-i18n.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/shopify/formations-i18n.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

describe("formations Shopify fetcher — @inContext locale plumbing", () => {
  const fetchMock = vi.fn();
  const ORIGINAL_FETCH = global.fetch;

  beforeEach(() => {
    process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  function mockEmptyProductsResponse() {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { products: { edges: [], pageInfo: { hasNextPage: false, endCursor: null } } } }),
    });
  }

  function mockEmptyProductByHandleResponse() {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { product: null } }),
    });
  }

  function bodyOf(call: number) {
    const args = fetchMock.mock.calls[call];
    return JSON.parse(args[1].body as string);
  }

  it("fetchShopifyFormations(en) sends @inContext(language: EN) and $lang=EN", async () => {
    vi.resetModules();
    const { fetchShopifyFormations } = await import("@/lib/shopify/formations");
    mockEmptyProductsResponse();
    await fetchShopifyFormations("en");
    const body = bodyOf(0);
    expect(body.query).toMatch(/@inContext\(language: \$lang\)/);
    expect(body.variables.lang).toBe("EN");
  });

  it("fetchShopifyFormations(ar) sends $lang=AR", async () => {
    vi.resetModules();
    const { fetchShopifyFormations } = await import("@/lib/shopify/formations");
    mockEmptyProductsResponse();
    await fetchShopifyFormations("ar");
    expect(bodyOf(0).variables.lang).toBe("AR");
  });

  it("fetchShopifyFormations(fr) sends $lang=FR", async () => {
    vi.resetModules();
    const { fetchShopifyFormations } = await import("@/lib/shopify/formations");
    mockEmptyProductsResponse();
    await fetchShopifyFormations("fr");
    expect(bodyOf(0).variables.lang).toBe("FR");
  });

  it("fetchShopifyFormationByHandle(handle, en) sends $lang=EN and $handle", async () => {
    vi.resetModules();
    const { fetchShopifyFormationByHandle } = await import("@/lib/shopify/formations");
    mockEmptyProductByHandleResponse();
    await fetchShopifyFormationByHandle("python-basics", "en");
    const body = bodyOf(0);
    expect(body.query).toMatch(/@inContext\(language: \$lang\)/);
    expect(body.variables.lang).toBe("EN");
    expect(body.variables.handle).toBe("python-basics");
  });

  it("fetchShopifyFormationByHandle(handle, ar) sends $lang=AR", async () => {
    vi.resetModules();
    const { fetchShopifyFormationByHandle } = await import("@/lib/shopify/formations");
    mockEmptyProductByHandleResponse();
    await fetchShopifyFormationByHandle("any-handle", "ar");
    expect(bodyOf(0).variables.lang).toBe("AR");
  });

  it("fetchShopifyFormationByHandle(handle, fr) sends $lang=FR", async () => {
    vi.resetModules();
    const { fetchShopifyFormationByHandle } = await import("@/lib/shopify/formations");
    mockEmptyProductByHandleResponse();
    await fetchShopifyFormationByHandle("any-handle", "fr");
    expect(bodyOf(0).variables.lang).toBe("FR");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run tests/unit/shopify/formations-i18n.test.ts
```

Expected: FAIL — `fetchShopifyFormations` doesn't accept an argument; queries don't contain `@inContext`.

- [ ] **Step 3: Update PRODUCTS_QUERY to include @inContext**

In `src/lib/shopify/formations.ts`, replace the `PRODUCTS_QUERY` constant (lines ~24-69) with:

```ts
const PRODUCTS_QUERY = `
  query GetFormations($first: Int!, $after: String, $lang: LanguageCode!) @inContext(language: $lang) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          description
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(identifiers: [
            { namespace: "custom", key: "niveau" }
            { namespace: "custom", key: "secteur" }
            { namespace: "custom", key: "categorie" }
            { namespace: "custom", key: "duree" }
            { namespace: "custom", key: "format_suported" }
            { namespace: "custom", key: "accroche" }
            { namespace: "custom", key: "pricing_plans" }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;
```

- [ ] **Step 4: Update PRODUCT_BY_HANDLE_QUERY to include @inContext**

In `src/lib/shopify/formations.ts`, replace the first line of `PRODUCT_BY_HANDLE_QUERY` (line ~278) to add the directive:

Find:
```ts
  query GetFormationByHandle($handle: String!) {
```

Replace with:
```ts
  query GetFormationByHandle($handle: String!, $lang: LanguageCode!) @inContext(language: $lang) {
```

- [ ] **Step 5: Add locale parameter to both fetchers and pass $lang**

In `src/lib/shopify/formations.ts`, add the import at the top (after the existing constants):

```ts
import type { Locale } from "@/i18n/routing";
import { toShopifyLanguage } from "@/lib/shopify/locale";
```

Replace the `fetchShopifyFormations` signature and body. Find:

```ts
export async function fetchShopifyFormations(): Promise<ShopifyFormationCard[]> {
  const all: ShopifyFormationCard[] = [];
  let after: string | null = null;

  // Pagination : récupère jusqu'à 250 produits (5 × 50)
  for (let page = 0; page < 5; page++) {
    const variables: Record<string, any> = { first: 50 };
    if (after) variables.after = after;
```

Replace with:

```ts
export async function fetchShopifyFormations(locale: Locale): Promise<ShopifyFormationCard[]> {
  const lang = toShopifyLanguage(locale);
  const all: ShopifyFormationCard[] = [];
  let after: string | null = null;

  // Pagination : récupère jusqu'à 250 produits (5 × 50)
  for (let page = 0; page < 5; page++) {
    const variables: Record<string, any> = { first: 50, lang };
    if (after) variables.after = after;
```

Replace `fetchShopifyFormationByHandle` (lines ~664-694). Find:

```ts
export async function fetchShopifyFormationByHandle(handle: string): Promise<ShopifyFormationDetail | null> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCT_BY_HANDLE_QUERY,

      variables: { handle },
    }),
    next: { revalidate: 300 },
  });
```

Replace with:

```ts
export async function fetchShopifyFormationByHandle(handle: string, locale: Locale): Promise<ShopifyFormationDetail | null> {
  const lang = toShopifyLanguage(locale);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle, lang },
    }),
    next: { revalidate: 300 },
  });
```

- [ ] **Step 6: Run i18n test to verify it passes**

```
npx vitest run tests/unit/shopify/formations-i18n.test.ts
```

Expected: PASS — 6/6 tests.

- [ ] **Step 7: Run TypeScript check to surface call-site breakages**

```
npx tsc --noEmit
```

Expected: FAIL with errors at call sites (sitemap.ts, app/[locale]/formations/[slug]/page.tsx, src/lib/api/formations.ts, and 8+ client components). These are handled in Tasks 4–7. Leave them for now — do NOT fix them in this commit.

- [ ] **Step 8: Commit**

```bash
git add src/lib/shopify/formations.ts tests/unit/shopify/formations-i18n.test.ts
git commit -m "feat(c4): @inContext locale plumbing in formations fetchers"
```

---

## Task 3: Wire @inContext into blog queries + locale parameter

**Files:**
- Modify: `src/lib/shopify/blog.ts`
- Test: `tests/unit/shopify/blog-i18n.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/shopify/blog-i18n.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

describe("blog Shopify fetcher — @inContext locale plumbing", () => {
  const fetchMock = vi.fn();
  const ORIGINAL_FETCH = global.fetch;

  beforeEach(() => {
    process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  function mockEmptyBlogsResponse() {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { blogs: { edges: [] } } }),
    });
  }

  function bodyOf(call: number) {
    const args = fetchMock.mock.calls[call];
    return JSON.parse(args[1].body as string);
  }

  it("fetchShopifyBlogPosts(en) sends @inContext(language: EN) and $lang=EN", async () => {
    vi.resetModules();
    const { fetchShopifyBlogPosts } = await import("@/lib/shopify/blog");
    mockEmptyBlogsResponse();
    await fetchShopifyBlogPosts("en");
    const body = bodyOf(0);
    expect(body.query).toMatch(/@inContext\(language: \$lang\)/);
    expect(body.variables.lang).toBe("EN");
  });

  it("fetchShopifyBlogPosts(ar) sends $lang=AR", async () => {
    vi.resetModules();
    const { fetchShopifyBlogPosts } = await import("@/lib/shopify/blog");
    mockEmptyBlogsResponse();
    await fetchShopifyBlogPosts("ar");
    expect(bodyOf(0).variables.lang).toBe("AR");
  });

  it("fetchShopifyBlogPosts(fr) sends $lang=FR", async () => {
    vi.resetModules();
    const { fetchShopifyBlogPosts } = await import("@/lib/shopify/blog");
    mockEmptyBlogsResponse();
    await fetchShopifyBlogPosts("fr");
    expect(bodyOf(0).variables.lang).toBe("FR");
  });

  it("fetchShopifyBlogPostByHandle(handle, en) sends $lang=EN", async () => {
    vi.resetModules();
    const { fetchShopifyBlogPostByHandle } = await import("@/lib/shopify/blog");
    mockEmptyBlogsResponse();
    await fetchShopifyBlogPostByHandle("some-article", "en");
    expect(bodyOf(0).variables.lang).toBe("EN");
  });

  it("fetchShopifyBlogPostByHandle(handle, ar) sends $lang=AR", async () => {
    vi.resetModules();
    const { fetchShopifyBlogPostByHandle } = await import("@/lib/shopify/blog");
    mockEmptyBlogsResponse();
    await fetchShopifyBlogPostByHandle("any-handle", "ar");
    expect(bodyOf(0).variables.lang).toBe("AR");
  });

  it("fetchShopifyBlogPostByHandle(handle, fr) sends $lang=FR", async () => {
    vi.resetModules();
    const { fetchShopifyBlogPostByHandle } = await import("@/lib/shopify/blog");
    mockEmptyBlogsResponse();
    await fetchShopifyBlogPostByHandle("any-handle", "fr");
    expect(bodyOf(0).variables.lang).toBe("FR");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run tests/unit/shopify/blog-i18n.test.ts
```

Expected: FAIL — fetchers don't accept locale; queries don't have `@inContext`.

- [ ] **Step 3: Update ALL_ARTICLES_QUERY to include @inContext**

In `src/lib/shopify/blog.ts`, replace `ALL_ARTICLES_QUERY` (lines ~21-57). Find:

```ts
const ALL_ARTICLES_QUERY = `
  query GetAllBlogArticles {
    blogs(first: 20) {
```

Replace with:

```ts
const ALL_ARTICLES_QUERY = `
  query GetAllBlogArticles($lang: LanguageCode!) @inContext(language: $lang) {
    blogs(first: 20) {
```

- [ ] **Step 4: Update fetchers to accept and forward locale**

In `src/lib/shopify/blog.ts`, add at the top (after the env constants):

```ts
import type { Locale } from "@/i18n/routing";
import { toShopifyLanguage } from "@/lib/shopify/locale";
```

Replace `fetchShopifyBlogPosts` (lines ~180-207). Find:

```ts
export async function fetchShopifyBlogPosts(): Promise<ShopifyBlogPost[]> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query: ALL_ARTICLES_QUERY }),
    next: { revalidate: 300 },
  });
```

Replace with:

```ts
export async function fetchShopifyBlogPosts(locale: Locale): Promise<ShopifyBlogPost[]> {
  const lang = toShopifyLanguage(locale);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query: ALL_ARTICLES_QUERY, variables: { lang } }),
    next: { revalidate: 300 },
  });
```

Replace `fetchShopifyBlogPostByHandle` (lines ~210-213). Find:

```ts
export async function fetchShopifyBlogPostByHandle(handle: string): Promise<ShopifyBlogPost | null> {
  const all = await fetchShopifyBlogPosts();
  return all.find((p) => p.slug === handle) ?? null;
}
```

Replace with:

```ts
export async function fetchShopifyBlogPostByHandle(handle: string, locale: Locale): Promise<ShopifyBlogPost | null> {
  const all = await fetchShopifyBlogPosts(locale);
  return all.find((p) => p.slug === handle) ?? null;
}
```

- [ ] **Step 5: Run blog i18n test to verify it passes**

```
npx vitest run tests/unit/shopify/blog-i18n.test.ts
```

Expected: PASS — 6/6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/shopify/blog.ts tests/unit/shopify/blog-i18n.test.ts
git commit -m "feat(c4): @inContext locale plumbing in blog fetchers"
```

---

## Task 4: API route handlers accept locale query

**Files:**
- Modify: `src/lib/api/formations.ts` (44 lines)
- Modify: `src/lib/api/blog.ts` (41 lines)
- Test: extend `tests/unit/shopify/formations-i18n.test.ts` (already created in Task 2 — append new tests at the end)

- [ ] **Step 1: Write the failing test**

Append to `tests/unit/shopify/formations-i18n.test.ts` (inside the same file, after the existing `describe` block — add this new describe block):

```ts
describe("/api/shopify/formations handler — locale query plumbing", () => {
  const fetchMock = vi.fn();
  const ORIGINAL_FETCH = global.fetch;

  beforeEach(() => {
    process.env.SHOPIFY_STORE_DOMAIN = "test.myshopify.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "test-token";
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { products: { edges: [], pageInfo: { hasNextPage: false } } } }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  function bodyOf(call: number) {
    return JSON.parse(fetchMock.mock.calls[call][1].body as string);
  }

  it("GET /api/shopify/formations?locale=en forwards EN to Shopify", async () => {
    vi.resetModules();
    const { GET } = await import("@/lib/api/formations");
    const req = new Request("http://localhost/api/shopify/formations?locale=en");
    await GET(req as unknown as Parameters<typeof GET>[0]);
    expect(bodyOf(0).variables.lang).toBe("EN");
  });

  it("GET /api/shopify/formations (no locale) defaults to FR", async () => {
    vi.resetModules();
    const { GET } = await import("@/lib/api/formations");
    const req = new Request("http://localhost/api/shopify/formations");
    await GET(req as unknown as Parameters<typeof GET>[0]);
    expect(bodyOf(0).variables.lang).toBe("FR");
  });

  it("GET /api/shopify/formations?locale=invalid falls back to FR", async () => {
    vi.resetModules();
    const { GET } = await import("@/lib/api/formations");
    const req = new Request("http://localhost/api/shopify/formations?locale=zz");
    await GET(req as unknown as Parameters<typeof GET>[0]);
    expect(bodyOf(0).variables.lang).toBe("FR");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run tests/unit/shopify/formations-i18n.test.ts
```

Expected: FAIL — `GET` no longer compiles or accepts `Request`.

- [ ] **Step 3: Update `src/lib/api/formations.ts` to read locale from query**

Replace the file contents entirely:

```ts
import { NextResponse } from "next/server";
import {
  fetchShopifyFormations,
  fetchShopifyFormationByHandle,
} from "@/lib/shopify/formations";
import { routing, type Locale } from "@/i18n/routing";

function readLocale(url: string): Locale {
  try {
    const param = new URL(url).searchParams.get("locale");
    if (param && (routing.locales as readonly string[]).includes(param)) {
      return param as Locale;
    }
  } catch {
    // malformed URL — fall through to default
  }
  return routing.defaultLocale;
}

/** GET /api/shopify/formations?locale=<fr|en|ar> */
export async function GET(req: Request) {
  const locale = readLocale(req.url);
  try {
    const formations = await fetchShopifyFormations(locale);
    return NextResponse.json({ formations });
  } catch (error) {
    console.error("[/api/shopify/formations] Shopify fetch failed:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les formations depuis Shopify.", formations: [] },
      { status: 502 }
    );
  }
}

/** GET /api/shopify/formations/[slug]?locale=<fr|en|ar> */
export async function getBySlug(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const locale = readLocale(req.url);
  try {
    const formation = await fetchShopifyFormationByHandle(slug, locale);
    if (!formation) {
      return NextResponse.json(
        { error: "Formation introuvable sur Shopify." },
        { status: 404 }
      );
    }
    return NextResponse.json({ formation });
  } catch (error) {
    console.error(`[/api/shopify/formations/${slug}] Shopify fetch failed:`, error);
    return NextResponse.json(
      { error: "Impossible de récupérer la formation depuis Shopify." },
      { status: 502 }
    );
  }
}
```

- [ ] **Step 4: Update `src/lib/api/blog.ts` to read locale from query**

Replace the file contents entirely:

```ts
import { NextResponse } from "next/server";
import {
  fetchShopifyBlogPosts,
  fetchShopifyBlogPostByHandle,
} from "@/lib/shopify/blog";
import { routing, type Locale } from "@/i18n/routing";

function readLocale(url: string): Locale {
  try {
    const param = new URL(url).searchParams.get("locale");
    if (param && (routing.locales as readonly string[]).includes(param)) {
      return param as Locale;
    }
  } catch {
    // malformed URL — fall through to default
  }
  return routing.defaultLocale;
}

/** GET /api/shopify/blog?locale=<fr|en|ar> */
export async function GET(req: Request) {
  const locale = readLocale(req.url);
  try {
    const posts = await fetchShopifyBlogPosts(locale);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[/api/shopify/blog] fetch failed:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les articles." },
      { status: 502 }
    );
  }
}

/** GET /api/shopify/blog/[handle]?locale=<fr|en|ar> */
export async function getByHandle(
  req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params;
  const locale = readLocale(req.url);
  try {
    const post = await fetchShopifyBlogPostByHandle(handle, locale);
    if (!post) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error(`[/api/shopify/blog/${handle}] fetch failed:`, error);
    return NextResponse.json(
      { error: "Impossible de récupérer l'article." },
      { status: 502 }
    );
  }
}
```

- [ ] **Step 5: Run the formations API test to verify it passes**

```
npx vitest run tests/unit/shopify/formations-i18n.test.ts
```

Expected: PASS — 9/9 tests (6 fetcher + 3 API route).

- [ ] **Step 6: Commit**

```bash
git add src/lib/api/formations.ts src/lib/api/blog.ts tests/unit/shopify/formations-i18n.test.ts
git commit -m "feat(c4): API routes forward ?locale= to Shopify fetchers"
```

---

## Task 5: Server pages pass locale to fetchers

**Files:**
- Modify: `src/app/[locale]/formations/[slug]/page.tsx` (lines 14-28 generateMetadata, 49-51 page)
- Modify: `src/app/[locale]/blog/[slug]/page.tsx` (lines 11-18 generateStaticParams, 28 generateMetadata, 52 page)
- Modify: `src/app/sitemap.ts` (lines 50-53)

- [ ] **Step 1: Update `src/app/[locale]/formations/[slug]/page.tsx`**

First, add the `Locale` type import. Find at the top of the file:

```ts
import { fetchShopifyFormationByHandle } from "@/lib/shopify/formations";
```

After this line, add:

```ts
import type { Locale } from "@/i18n/routing";
```

Then find on line 16:

```ts
  const formation = await fetchShopifyFormationByHandle(slug).catch(() => null);
```

Replace with:

```ts
  const formation = await fetchShopifyFormationByHandle(slug, locale as Locale).catch(() => null);
```

Find on line 51:

```ts
  const formation = await fetchShopifyFormationByHandle(slug).catch(() => null);
```

Replace with:

```ts
  const formation = await fetchShopifyFormationByHandle(slug, locale as Locale).catch(() => null);
```

(Both occurrences — there are 2 in this file.)

- [ ] **Step 2: Update `src/app/[locale]/blog/[slug]/page.tsx`**

First, add the `routing` import. Find at the top of the file:

```ts
import { fetchShopifyBlogPostByHandle, fetchShopifyBlogPosts } from "@/lib/shopify/blog";
```

After this line, add:

```ts
import { routing, type Locale } from "@/i18n/routing";
```

Then find on line 13:

```ts
    const posts = await fetchShopifyBlogPosts();
```

Replace with:

```ts
    // generateStaticParams runs once per route — use defaultLocale to enumerate handles.
    // (Handles are the same across locales per spec; only payload differs.)
    const posts = await fetchShopifyBlogPosts(routing.defaultLocale);
```

Find on line 28:

```ts
  const post = await fetchShopifyBlogPostByHandle(slug).catch(() => null);
```

Replace with (now that `Locale` is imported at the top of the file):

```ts
  const post = await fetchShopifyBlogPostByHandle(slug, locale as Locale).catch(() => null);
```

Find on line 52:

```ts
  const post = await fetchShopifyBlogPostByHandle(slug).catch(() => null);
```

Replace with:

```ts
  const post = await fetchShopifyBlogPostByHandle(slug, locale as Locale).catch(() => null);
```

- [ ] **Step 3: Update `src/app/sitemap.ts` to pass locale**

Find lines 50-53:

```ts
  const [formations, posts] = await Promise.allSettled([
    fetchShopifyFormations(),
    fetchShopifyBlogPosts(),
  ]);
```

Replace with:

```ts
  // Enumerate slugs once using the default locale — handles are shared across locales.
  // (Multi-locale canonical URLs are emitted in Task 8 by iterating routing.locales for each slug.)
  const [formations, posts] = await Promise.allSettled([
    fetchShopifyFormations(routing.defaultLocale),
    fetchShopifyBlogPosts(routing.defaultLocale),
  ]);
```

- [ ] **Step 4: Run TypeScript check**

```
npx tsc --noEmit
```

Expected: still failing — remaining errors come from client components in Task 6 and `FormationDetailShell` (which calls `/api/shopify/formations/${slug}` without locale — Task 6). API/server-side errors should be gone.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/formations/[slug]/page.tsx src/app/[locale]/blog/[slug]/page.tsx src/app/sitemap.ts
git commit -m "feat(c4): server pages + sitemap pass locale to Shopify fetchers"
```

---

## Task 6: Client components append `?locale=` to fetch URLs

**Files (modify all):**
- `src/components/formations/FormationLandpage.tsx` (line 578)
- `src/components/formations/FormationsShell.tsx` (line 70)
- `src/components/formations/FormationsCarousel.tsx` (line 42)
- `src/components/formations/CatalogueSection.tsx` (line 32)
- `src/components/formations/FormationDetailShell.tsx` (line 306)
- `src/components/formations/FormationInscriptionShell.tsx` (line 149)
- `src/components/formations/LandingFormation.tsx` (line 187)
- `src/components/blog/BlogShell.tsx` (line 81)
- `src/components/blog/BlogCategoriesBlock.tsx` (line 50)
- `src/components/blog/BlogArticlesShell.tsx` (line 57)
- `src/components/blog/BlogHero.tsx` (line 67)
- `src/components/blog/BlogPostShell.tsx` (line 59)
- `src/components/home/sections/BlogSection.tsx` (line 40)
- `src/components/home/sections/BlogShowcaseSection.tsx` (line 64)
- `src/components/poles/PoleConseilShell.tsx` (line 86)
- `src/components/poles/PoleDeveloppementShell.tsx` (line 76)
- `src/components/services/ServicesShell.tsx` (line 847)

- [ ] **Step 1: Pattern for each client component**

Each file needs three changes:

1. Add `useLocale` to the next-intl import line. Find an existing `from "next-intl"` import (each file uses `useTranslations`); add `useLocale` to the import. Example:

```ts
// Before
import { useTranslations } from "next-intl";

// After
import { useTranslations, useLocale } from "next-intl";
```

If a file does NOT already import from `"next-intl"`, add this import after the React import:

```ts
import { useLocale } from "next-intl";
```

2. Add at the top of the component (after `useTranslations` calls if any):

```ts
const locale = useLocale();
```

3. Append `?locale=${locale}` to the relevant `/api/shopify/...` URL. Example:

```ts
// Before
fetch("/api/shopify/formations")
// After
fetch(`/api/shopify/formations?locale=${locale}`)

// Before
fetch(`/api/shopify/formations/${slug}`);
// After
fetch(`/api/shopify/formations/${slug}?locale=${locale}`);
```

- [ ] **Step 2: Apply pattern to all 17 files**

For each file in the list above, apply the three changes from Step 1. The exact URL replacements:

| File | Find | Replace |
|------|------|---------|
| FormationLandpage.tsx | `fetch("/api/shopify/formations")` | `` fetch(`/api/shopify/formations?locale=${locale}`) `` |
| FormationsShell.tsx | `fetch("/api/shopify/formations")` | `` fetch(`/api/shopify/formations?locale=${locale}`) `` |
| FormationsCarousel.tsx | `fetch("/api/shopify/formations")` | `` fetch(`/api/shopify/formations?locale=${locale}`) `` |
| CatalogueSection.tsx | `fetch("/api/shopify/formations")` | `` fetch(`/api/shopify/formations?locale=${locale}`) `` |
| FormationDetailShell.tsx | `` fetch(`/api/shopify/formations/${slug}`) `` | `` fetch(`/api/shopify/formations/${slug}?locale=${locale}`) `` |
| FormationInscriptionShell.tsx | `` fetch(`/api/shopify/formations/${slug}`) `` | `` fetch(`/api/shopify/formations/${slug}?locale=${locale}`) `` |
| LandingFormation.tsx | `` fetch(`/api/shopify/formations/${slug}`) `` | `` fetch(`/api/shopify/formations/${slug}?locale=${locale}`) `` |
| BlogShell.tsx | `fetch("/api/shopify/blog")` (line 81 only — NOT the newsletter on line 63) | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| BlogCategoriesBlock.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| BlogArticlesShell.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| BlogHero.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| BlogPostShell.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| home/sections/BlogSection.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| home/sections/BlogShowcaseSection.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| poles/PoleConseilShell.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| poles/PoleDeveloppementShell.tsx | `fetch("/api/shopify/blog")` | `` fetch(`/api/shopify/blog?locale=${locale}`) `` |
| services/ServicesShell.tsx | `fetch("/api/shopify/formations")` | `` fetch(`/api/shopify/formations?locale=${locale}`) `` |

- [ ] **Step 3: Run TypeScript check**

```
npx tsc --noEmit
```

Expected: clean. If any errors remain, they're missing `useLocale` imports or missing `const locale = useLocale()` calls in one of the 17 files — fix them.

- [ ] **Step 4: Run all tests**

```
npx vitest run
```

Expected: all green (existing 45 + new 13).

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat(c4): client components append ?locale= to Shopify API URLs"
```

---

## Task 7: Resolve residual FR strings via i18n

**Files:**
- Modify: `src/i18n/messages/en.json` and `src/i18n/messages/ar.json` (add EN+AR for `metaSurDevis`; confirm `landpageConfirmation` is already translated)
- Modify: `src/lib/data/formation-defaults.ts` — convert to factory function
- Modify: `src/lib/shopify/formations.ts` line 211 — remove "Sur devis" literal fallback
- Modify: `src/components/formations/FormationDetailShell.tsx` lines 382, 384, 972 — use `t("metaSurDevis")`
- Modify: `src/components/formations/LandingFormation.tsx` line 518 — use `t("landpageConfirmation")`

- [ ] **Step 1: Verify existing translations**

```
node -e "console.log('fr:', JSON.parse(require('fs').readFileSync('src/i18n/messages/fr.json','utf8')).formations.metaSurDevis); console.log('en:', JSON.parse(require('fs').readFileSync('src/i18n/messages/en.json','utf8')).formations.metaSurDevis); console.log('ar:', JSON.parse(require('fs').readFileSync('src/i18n/messages/ar.json','utf8')).formations.metaSurDevis);"
```

Expected: `fr: Sur devis`, `en: On request` (or similar — from C3), `ar:` Arabic translation.

If en/ar keys are missing the translation (i.e., still show `Sur devis`), update them:

In `src/i18n/messages/en.json`, find `"metaSurDevis":` and set value to `"On request"`.
In `src/i18n/messages/ar.json`, find `"metaSurDevis":` and set value to `"حسب الطلب"`.

- [ ] **Step 2: Verify `landpageConfirmation` translations**

```
node -e "console.log('en:', JSON.parse(require('fs').readFileSync('src/i18n/messages/en.json','utf8')).formations.landpageConfirmation); console.log('ar:', JSON.parse(require('fs').readFileSync('src/i18n/messages/ar.json','utf8')).formations.landpageConfirmation);"
```

Expected: EN and AR variants from C3 exist. If en says something like `"✓ Response within 24h · ✓ No commitment"` and ar says `"✓ ردّ خلال 24 ساعة · ✓ بدون التزام"` — good. If either still shows the French original, edit the file to provide a translation.

- [ ] **Step 3: Convert `formation-defaults.ts` to a factory function**

Replace the contents of `src/lib/data/formation-defaults.ts` entirely with:

```ts
/**
 * Default formation page assets — structural (images / URLs / numbers).
 * Text content lives in fr.json under `formations.defaults.*`.
 */

/* ── Pain point images (mapped by index to i18n painPoints) ── */
export const DEFAULT_PAIN_POINT_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
  "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
];

/* ── Audience card images (mapped by index to i18n audienceCards) ── */
export const DEFAULT_AUDIENCE_CARD_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80",
];

/* ── Testimonial avatars (mapped by index to i18n testimonials) ── */
export const DEFAULT_TESTIMONIAL_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
];

/* ── Testimonial ratings (structural numbers) ── */
export const DEFAULT_TESTIMONIAL_RATINGS: number[] = [5, 5, 5];

/* ── Tools covered (brand names + accent colour — structural UI data) ── */
export const DEFAULT_TOOLS_COVERED = {
  row1: [
    { name: "ChatGPT" },
    { name: "Claude" },
    { name: "Gemini", color: "gold" as const },
    { name: "Perplexity" },
    { name: "Copilot 365" },
    { name: "Notion AI", color: "gold" as const },
    { name: "Gamma" },
    { name: "Midjourney" },
    { name: "Freepik IA" },
    { name: "Luma", color: "gold" as const },
  ],
  row2: [
    { name: "Zapier" },
    { name: "Make", color: "gold" as const },
    { name: "n8n" },
    { name: "ElevenLabs" },
    { name: "Heygen" },
    { name: "Suno", color: "gold" as const },
    { name: "Canva IA" },
    { name: "GPTs sur-mesure" },
    { name: "RAG interne", color: "gold" as const },
    { name: "Agents Claude" },
  ],
};

/* ── Pricing plan structural config (amounts/CTA types/featured flags) ── */
export interface PricingPlanStructural {
  amount: string;
  currency?: string;
  old_price?: string;
  cta_type: "inscription" | "contact" | "external";
  cta_url?: string;
  featured: boolean;
}

/**
 * Build the default pricing-plan placeholders, localized via the caller's translator.
 * The `t` argument is a `useTranslations("formations")` instance — both server
 * (`getTranslations`) and client (`useTranslations`) variants are compatible.
 */
export function getDefaultPricingPlanStructural(
  t: (key: string) => string
): PricingPlanStructural[] {
  const surDevis = t("metaSurDevis");
  const responseUnder24h = t("landpageConfirmation");
  return [
    {
      amount: surDevis,
      currency: "MAD HT",
      cta_type: "inscription",
      featured: true,
    },
    {
      amount: surDevis,
      old_price: responseUnder24h,
      cta_type: "contact",
      featured: false,
    },
    {
      amount: surDevis,
      old_price: responseUnder24h,
      cta_type: "contact",
      featured: false,
    },
  ];
}

/* ── Places / session capacity (numeric structural) ── */
export const DEFAULT_PLACES_SESSION = {
  inscrits: 7,
  total: 12,
  restantes: 5,
};

/* ── Mid CTA structural links ── */
export const DEFAULT_MID_CTA_STRUCTURAL = {
  cta_primary_url: "#pricing",
  cta_ghost_url: "/contact",
  cta_dark_type: "inscription" as const,
};
```

(Note: the const `DEFAULT_PRICING_PLAN_STRUCTURAL` is removed in favor of `getDefaultPricingPlanStructural(t)`. If anywhere imports the const, the next steps replace those import sites.)

- [ ] **Step 4: Find consumers of the old constant**

```
grep -rn "DEFAULT_PRICING_PLAN_STRUCTURAL" src/
```

Expected: zero or a handful of hits. Update each to call `getDefaultPricingPlanStructural(t)` with the consumer's `useTranslations("formations")` instance.

- [ ] **Step 5: Remove "Sur devis" literal in `formations.ts:211`**

In `src/lib/shopify/formations.ts`, find line ~211:

```ts
          amount:      String(p?.amount || p?.prix || "Sur devis").trim(),
```

Replace with:

```ts
          amount:      String(p?.amount || p?.prix || "").trim(),
```

Rationale: the empty-string sentinel is rendered by callers via `t("metaSurDevis")` in the localized component context.

- [ ] **Step 6: Update `FormationDetailShell.tsx` to use `t("metaSurDevis")`**

In `src/components/formations/FormationDetailShell.tsx`:

Find around line 382:

```ts
        amount: idx === 0 ? (formation.prix || "Sur devis") : "Sur devis",
```

Replace with (assuming `const t = useTranslations("formations");` is already in scope; if not, add it near the top of the component):

```ts
        amount: idx === 0 ? (formation.prix || t("metaSurDevis")) : t("metaSurDevis"),
```

Find around line 384:

```ts
        old_price: idx > 0 ? "Réponse sous 24h" : undefined,
```

Replace with:

```ts
        old_price: idx > 0 ? t("landpageConfirmation") : undefined,
```

Find around line 972:

```tsx
                    {p.amount !== "Sur devis" && p.currency && <span ...>{p.currency}</span>}
```

Replace with:

```tsx
                    {p.amount !== t("metaSurDevis") && p.amount !== "" && p.currency && <span style={{ fontFamily: FONT_LABEL, fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>{p.currency}</span>}
```

(The condition now also excludes empty sentinel from Shopify's empty fallback.)

- [ ] **Step 7: Update `LandingFormation.tsx` to use `t("landpageConfirmation")`**

In `src/components/formations/LandingFormation.tsx`:

Find around line 518:

```tsx
                ✓ Réponse sous 24h · ✓ Sans engagement
```

Replace with (the surrounding JSX element wraps a child text node — replace the literal text only):

```tsx
                {t("landpageConfirmation")}
```

If `t` isn't already in scope as `useTranslations("formations")`, add `const t = useTranslations("formations");` near the top of the component (after any existing translator hooks).

- [ ] **Step 8: Run grep audit — no more FR literals**

```
grep -rn "Sur devis\|Réponse sous 24h" src/ --include="*.ts" --include="*.tsx"
```

Expected: zero matches outside of `src/i18n/messages/fr.json` (the FR dictionary keeps the literal as the source of truth).

- [ ] **Step 9: Run TypeScript check and full tests**

```
npx tsc --noEmit && npx vitest run
```

Expected: clean tsc; all tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/i18n/messages/en.json src/i18n/messages/ar.json src/lib/data/formation-defaults.ts src/lib/shopify/formations.ts src/components/formations/FormationDetailShell.tsx src/components/formations/LandingFormation.tsx
git commit -m "refactor(c4): resolve residual FR strings via formations i18n keys"
```

---

## Task 8: Form locale-tagging — brochure, inscription, newsletter

**Files:**
- Modify: `src/lib/api/brochure.ts`
- Modify: `src/lib/api/inscription.ts`
- Modify: `src/lib/api/newsletter.ts`
- Modify: `src/components/formations/BrochureRequestModal.tsx` (line 98 — POST body)
- Modify: `src/components/formations/FormationInscriptionForm.tsx` (line 441 — POST body)
- Modify: `src/components/formations/FormationLandpage.tsx` (line 432 — POST body)
- Modify: `src/components/blog/BlogShell.tsx` (line 63 — newsletter POST body)
- Modify: `src/components/layout/FooterStrip.tsx` (line 34 — newsletter POST body)
- Test: `tests/unit/api/form-locale-tag.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/api/form-locale-tag.test.ts`:

```ts
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

vi.mock("@/lib/api/shopify-admin", () => ({
  getAdminToken: vi.fn(async () => "test-admin-token"),
  shopifyAdminUrl: () => "https://test.myshopify.com/admin/api/2024-01/graphql.json",
  shopifyAdminRestUrl: (path: string) => `https://test.myshopify.com/admin/api/2024-01/${path}`,
}));

describe("brochure handler — locale tag", () => {
  const fetchMock = vi.fn();
  const ORIGINAL_FETCH = global.fetch;

  beforeEach(() => {
    process.env.DEFAULT_BROCHURE_URL = "https://example.com/brochure.pdf";
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ customer: { id: 1 } }) });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  it("posting with locale=en adds tag 'lang:en' to the Shopify customer payload", async () => {
    vi.resetModules();
    const { POST } = await import("@/lib/api/brochure");
    const req = new Request("http://localhost/api/brochure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alice",
        email: "alice@example.com",
        formationSlug: "python-basics",
        formationTitle: "Python Basics",
        locale: "en",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    // Find the Shopify Admin call (the only fetch invoked)
    const adminCall = fetchMock.mock.calls.find(([url]) => String(url).includes("/admin/api/"));
    expect(adminCall).toBeTruthy();
    const body = JSON.parse(adminCall![1].body as string);
    expect(body.customer.tags).toContain("lang:en");
  });

  it("posting without locale defaults to lang:fr", async () => {
    vi.resetModules();
    const { POST } = await import("@/lib/api/brochure");
    const req = new Request("http://localhost/api/brochure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bob",
        email: "bob@example.com",
        formationSlug: "any",
        formationTitle: "Any",
      }),
    });
    await POST(req);
    const adminCall = fetchMock.mock.calls.find(([url]) => String(url).includes("/admin/api/"));
    const body = JSON.parse(adminCall![1].body as string);
    expect(body.customer.tags).toContain("lang:fr");
  });

  it("invalid locale falls back to lang:fr", async () => {
    vi.resetModules();
    const { POST } = await import("@/lib/api/brochure");
    const req = new Request("http://localhost/api/brochure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Carol",
        email: "carol@example.com",
        formationSlug: "any",
        formationTitle: "Any",
        locale: "zz",
      }),
    });
    await POST(req);
    const adminCall = fetchMock.mock.calls.find(([url]) => String(url).includes("/admin/api/"));
    const body = JSON.parse(adminCall![1].body as string);
    expect(body.customer.tags).toContain("lang:fr");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run tests/unit/api/form-locale-tag.test.ts
```

Expected: FAIL — current brochure handler doesn't read `locale` from body and doesn't add `lang:` tag.

- [ ] **Step 3: Add locale-tagging to `src/lib/api/brochure.ts`**

Replace the entire file with:

```ts
import { NextResponse } from "next/server";
import { getAdminToken, shopifyAdminRestUrl } from "@/lib/api/shopify-admin";
import { routing, type Locale } from "@/i18n/routing";

const DEFAULT_BROCHURE_URL = process.env.DEFAULT_BROCHURE_URL ?? "";

interface BrochurePayload {
  name: string;
  email: string;
  company?: string;
  formationSlug: string;
  formationTitle: string;
  brochureUrl?: string;
  locale?: string;
}

function safeLocale(raw: unknown): Locale {
  if (typeof raw === "string" && (routing.locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return routing.defaultLocale;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BrochurePayload>;
    const { name, email, company, formationSlug, formationTitle, brochureUrl } = body;
    const locale = safeLocale(body.locale);

    if (!name || !email || !formationSlug || !formationTitle) {
      return NextResponse.json(
        { error: "Champs requis manquants (nom, email, formation)" },
        { status: 400 }
      );
    }

    const finalBrochureUrl = brochureUrl || DEFAULT_BROCHURE_URL;
    if (!finalBrochureUrl) {
      return NextResponse.json(
        { error: "Brochure non disponible pour cette formation" },
        { status: 404 }
      );
    }

    // ── Capture du lead dans Shopify (best effort, non-bloquant) ───────────
    try {
      const adminToken = await getAdminToken();
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName  = nameParts.slice(1).join(" ") || "-";

      const tags = ["Lead", "Brochure", `Formation:${formationSlug}`, `lang:${locale}`].join(", ");
      const note = [
        `Lead brochure — ${formationTitle}`,
        `Slug: ${formationSlug}`,
        `Entreprise: ${company || "N/A"}`,
        `Locale: ${locale}`,
        `Date: ${new Date().toISOString()}`,
      ].join("\n");

      await fetch(shopifyAdminRestUrl("customers.json"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({
          customer: {
            first_name: firstName,
            last_name:  lastName,
            email,
            tags,
            note,
          },
        }),
      });
    } catch (err) {
      console.warn("[brochure] Capture Shopify échouée (non-bloquant) :", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({ success: true, brochureUrl: finalBrochureUrl });

  } catch (error) {
    console.error("Brochure API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Add locale-tagging to `src/lib/api/inscription.ts`**

In `src/lib/api/inscription.ts`:

Add the import near the top:

```ts
import { routing, type Locale } from "@/i18n/routing";
```

Add the helper after the imports:

```ts
function safeLocale(raw: unknown): Locale {
  if (typeof raw === "string" && (routing.locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return routing.defaultLocale;
}
```

Find:

```ts
    const note = noteLines.join("\\n");
```

Just before this line, add:

```ts
    const locale = safeLocale(body.locale);
    noteLines.push(`Locale: ${locale}`);
```

Find:

```ts
        tags: ["Inscription", "Formation", body.typeClient],
```

Replace with:

```ts
        tags: ["Inscription", "Formation", body.typeClient, `lang:${locale}`],
```

- [ ] **Step 5: Add locale-tagging to `src/lib/api/newsletter.ts`**

In `src/lib/api/newsletter.ts`:

Add the import near the top:

```ts
import { routing, type Locale } from "@/i18n/routing";
```

Add the helper after the imports:

```ts
function safeLocale(raw: unknown): Locale {
  if (typeof raw === "string" && (routing.locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return routing.defaultLocale;
}
```

Find:

```ts
    const { email } = await req.json();
```

Replace with:

```ts
    const reqBody = await req.json();
    const { email } = reqBody;
    const locale = safeLocale(reqBody.locale);
```

Find the `customerCreate` mutation `variables` block:

```ts
        variables: {
          input: {
            email,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
            },
          },
        },
```

Replace with:

```ts
        variables: {
          input: {
            email,
            tags: [`lang:${locale}`],
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
            },
          },
        },
```

(Shopify's CustomerInput accepts `tags: [String!]`.)

- [ ] **Step 6: Add locale to client POST bodies**

For each of these files, add `locale: useLocale()` (or reuse the existing `const locale = useLocale();` from Task 6 if it's the same component) to the POST body of the fetch call.

**`src/components/formations/BrochureRequestModal.tsx`** — line 98 area, in the JSON body of the brochure POST. Find the call:

```ts
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ... existing fields
        }),
      });
```

Add `locale,` to the JSON body. If `useLocale` isn't imported, add it: `import { useLocale } from "next-intl";` and `const locale = useLocale();` near the component top.

**`src/components/formations/FormationInscriptionForm.tsx`** — line 441 area. Same pattern: add `locale,` to the inscription POST body and ensure `const locale = useLocale();` is in scope.

**`src/components/formations/FormationLandpage.tsx`** — line 432 area (inscription POST). Same pattern. (Likely `locale` is already in scope from Task 6.)

**`src/components/blog/BlogShell.tsx`** — line 63 area (newsletter POST). Add `locale` to the body. (Likely `locale` is already in scope from Task 6.)

**`src/components/layout/FooterStrip.tsx`** — line 34 area (newsletter POST). Add `locale` to the body. Add `useLocale` import + call if not already in scope.

- [ ] **Step 7: Run test to verify all pass**

```
npx vitest run tests/unit/api/form-locale-tag.test.ts
```

Expected: PASS — 3/3.

- [ ] **Step 8: Run all tests + tsc**

```
npx tsc --noEmit && npx vitest run
```

Expected: clean tsc; all tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/lib/api/brochure.ts src/lib/api/inscription.ts src/lib/api/newsletter.ts src/components/formations/BrochureRequestModal.tsx src/components/formations/FormationInscriptionForm.tsx src/components/formations/FormationLandpage.tsx src/components/blog/BlogShell.tsx src/components/layout/FooterStrip.tsx tests/unit/api/form-locale-tag.test.ts
git commit -m "feat(c4): tag Shopify form submissions with user locale"
```

---

## Task 9: Sitemap emits canonical entries per locale for Shopify routes

**Files:**
- Modify: `src/app/sitemap.ts`
- Test: extend `tests/unit/i18n/sitemap.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/unit/i18n/sitemap.test.ts` (inside the existing top-level `describe("sitemap", ...)` block, before its closing brace):

```ts
  it("emits a canonical /en/formations/<slug> entry (not just hreflang alternates)", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    // Mock provides at least one formation slug
    expect(urls.some((u) => u.startsWith("https://www.a-ct.ma/en/formations/"))).toBe(true);
  });

  it("emits a canonical /ar/formations/<slug> entry", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.startsWith("https://www.a-ct.ma/ar/formations/"))).toBe(true);
  });

  it("emits a canonical /en/blog/<slug> entry", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.startsWith("https://www.a-ct.ma/en/blog/"))).toBe(true);
  });

  it("emits a canonical /ar/blog/<slug> entry", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.startsWith("https://www.a-ct.ma/ar/blog/"))).toBe(true);
  });
```

- [ ] **Step 2: Run test to verify it fails**

```
npx vitest run tests/unit/i18n/sitemap.test.ts
```

Expected: 4 new tests FAIL — the current sitemap only emits one canonical per slug (under the default locale).

- [ ] **Step 3: Make the sitemap iterate locales for Shopify-driven slugs**

In `src/app/sitemap.ts`, replace the `entry()` helper signature and the build of `formationEntries` / `blogEntries`. Replace the whole file with:

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { fetchShopifyFormations } from "@/lib/shopify/formations";
import { fetchShopifyBlogPosts } from "@/lib/shopify/blog";

const BASE_URL = "https://www.a-ct.ma";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "",            changeFrequency: "weekly",  priority: 1.0 },
  { path: "/formations", changeFrequency: "weekly",  priority: 0.9 },
  { path: "/poles",      changeFrequency: "monthly", priority: 0.8 },
  { path: "/services",   changeFrequency: "monthly", priority: 0.8 },
  { path: "/secteurs",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/projects",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/about",      changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog",       changeFrequency: "daily",   priority: 0.7 },
  { path: "/contact",    changeFrequency: "monthly", priority: 0.6 },
];

/** Build one sitemap entry per locale × path, each with alternates pointing at the other locales. */
function entriesForPath(path: string, opts: {
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
}): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: {
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ["x-default", `${BASE_URL}/${routing.defaultLocale}${path}`],
      ]),
    },
  }));
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.flatMap(({ path, changeFrequency, priority }) =>
    entriesForPath(path, { changeFrequency, priority })
  );

  // Slug enumeration uses the default locale; handles are the same across locales.
  const [formations, posts] = await Promise.allSettled([
    fetchShopifyFormations(routing.defaultLocale),
    fetchShopifyBlogPosts(routing.defaultLocale),
  ]);

  const formationEntries =
    formations.status === "fulfilled"
      ? formations.value.flatMap((f) =>
          entriesForPath(`/formations/${f.slug}`, {
            changeFrequency: "weekly",
            priority: 0.7,
          })
        )
      : [];

  const blogEntries =
    posts.status === "fulfilled"
      ? posts.value.flatMap((p) =>
          entriesForPath(`/blog/${p.slug}`, {
            changeFrequency: "monthly",
            priority: 0.6,
            lastModified: p.date ? new Date(p.date) : undefined,
          })
        )
      : [];

  return [...staticEntries, ...formationEntries, ...blogEntries];
}
```

This change has one ripple: existing tests in `sitemap.test.ts` that assert `/fr` canonical entries continue to hold (since `routing.locales` still includes `fr`), but the count of static entries triples (3× locales). Verify in Step 4.

- [ ] **Step 4: Run all sitemap tests**

```
npx vitest run tests/unit/i18n/sitemap.test.ts
```

Expected: all sitemap tests pass — the existing ones still hold (FR entries exist) and the 4 new ones pass too.

If an existing test fails (e.g., one that counts entries assuming a flat 1-per-static-path), inspect it. Likely candidates:
- `contains a /fr/services entry as canonical url` — still passes (FR entry exists per locale).
- `each entry has alternates.languages with fr/en/ar` — still passes (every entry has the alternates block).
- `home entry uses /fr as canonical (no trailing slash)` — still passes (the FR home entry is still in the output).

- [ ] **Step 5: Run all tests + tsc**

```
npx tsc --noEmit && npx vitest run
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts tests/unit/i18n/sitemap.test.ts
git commit -m "feat(c4): sitemap emits canonical entries per locale for Shopify slugs"
```

---

## Task 10: Final validation

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

Expected: all green. Pre-C4 baseline was 45 tests; C4 adds 4 (locale) + 6 (formations i18n) + 6 (blog i18n) + 3 (API locale routing) + 3 (form locale tag) + 4 (sitemap multi-locale) = 26 new. Total ~71.

- [ ] **Step 3: Production build green**

```
npm run build
```

Expected: build succeeds with no errors. Page list should include `/en/formations/[slug]` and `/ar/formations/[slug]` pre-rendered for each Shopify product (and same for blog).

- [ ] **Step 4: Grep audit — zero hardcoded literals**

```
grep -rn "Sur devis\|Réponse sous 24h" src/ --include="*.ts" --include="*.tsx"
```

Expected: zero matches outside `src/i18n/messages/fr.json`.

- [ ] **Step 5: Smoke test (manual, requires running server)**

```
npm start
```

Open in browser:
- `http://localhost:3000/en/formations` — verify Shopify formation cards render with EN titles/taglines/etc.
- `http://localhost:3000/ar/formations` — verify RTL rendering with AR translations.
- Click into one formation in EN — verify metafields (programme, livrables, objectifs, etc.) render in English.
- Click into one formation in AR — verify same in Arabic.
- Visit `http://localhost:3000/en/blog` and click into an article — verify title/excerpt/contentHtml render in EN.
- Visit `http://localhost:3000/sitemap.xml` — verify it contains `/en/formations/<slug>` and `/ar/blog/<slug>` lines.

(If you don't have Shopify admin access to verify the `lang:<code>` tag on customer records after a brochure download, trust the unit test in Task 8.)

- [ ] **Step 6: Commit (if no changes, skip)**

If any cleanup was needed during smoke, commit it now:

```bash
git add -p
git commit -m "fix(c4): smoke-test cleanup"
```

Otherwise, just print the C4 summary:

```
echo "C4 complete. Locale-aware Shopify integration shipped."
```

- [ ] **Step 7: Hand off to finishing skill**

Announce: "I'm using the finishing-a-development-branch skill to complete this work."

Use `superpowers:finishing-a-development-branch` to present the 4-option menu (Merge / PR / Keep / Discard).
