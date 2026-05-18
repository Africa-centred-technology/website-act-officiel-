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

  it("fetchShopifyFormationByHandle(handle, fr) sends $lang=FR", async () => {
    vi.resetModules();
    const { fetchShopifyFormationByHandle } = await import("@/lib/shopify/formations");
    mockEmptyProductByHandleResponse();
    await fetchShopifyFormationByHandle("any-handle", "fr");
    expect(bodyOf(0).variables.lang).toBe("FR");
  });
});

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
