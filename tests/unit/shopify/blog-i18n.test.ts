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

  it("fetchShopifyBlogPostByHandle(handle, fr) sends $lang=FR", async () => {
    vi.resetModules();
    const { fetchShopifyBlogPostByHandle } = await import("@/lib/shopify/blog");
    mockEmptyBlogsResponse();
    await fetchShopifyBlogPostByHandle("any-handle", "fr");
    expect(bodyOf(0).variables.lang).toBe("FR");
  });
});
