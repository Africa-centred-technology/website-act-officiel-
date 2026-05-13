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
