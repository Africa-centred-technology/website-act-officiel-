import { describe, it, expect } from "vitest";
import { isRtl, directionalArrows } from "@/lib/i18n/direction";

describe("isRtl", () => {
  it("returns false for fr and en", () => {
    expect(isRtl("fr")).toBe(false);
    expect(isRtl("en")).toBe(false);
  });
});

describe("directionalArrows", () => {
  it("returns ← previous, → next for LTR locales", () => {
    expect(directionalArrows("fr")).toEqual({ previous: "←", next: "→" });
    expect(directionalArrows("en")).toEqual({ previous: "←", next: "→" });
  });
});
