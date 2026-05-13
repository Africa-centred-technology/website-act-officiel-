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
