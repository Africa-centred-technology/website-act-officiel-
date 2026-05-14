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
