/**
 * Tests de cohérence des données statiques
 *
 * Vérifie que les fichiers src/lib/data/ respectent les invariants attendus :
 *  - IDs / slugs uniques
 *  - Champs obligatoires présents et non vides
 *  - Pas de doublons de titre
 *  - Images / vidéos non vides
 *  - Valeurs d'énumération valides
 *
 * Run : npm test
 */

import { describe, it, expect } from "vitest";
import { POLES } from "@/lib/data/poles";
import { SERVICES } from "@/lib/data/services";
import { PROJECTS, CATEGORIES } from "@/lib/data/projects";

// ── POLES ─────────────────────────────────────────────────────────────────────

describe("POLES — cohérence des données", () => {
  it("IDs sont uniques", () => {
    const ids = POLES.map((p) => p.id);
    expect(new Set(ids).size, "doublons d'ID détectés").toBe(ids.length);
  });

  it("titres sont uniques", () => {
    const titles = POLES.map((p) => p.title);
    expect(new Set(titles).size, "doublons de titre détectés").toBe(titles.length);
  });

  it("champs obligatoires présents et non vides", () => {
    for (const pole of POLES) {
      expect(pole.id.trim(), `pole.id vide pour "${pole.title}"`).not.toBe("");
      expect(pole.title.trim(), `pole.title vide (id: ${pole.id})`).not.toBe("");
      expect(pole.color.trim(), `pole.color vide (id: ${pole.id})`).not.toBe("");
      expect(pole.href.trim(), `pole.href vide (id: ${pole.id})`).not.toBe("");
      expect(pole.image.trim(), `pole.image vide (id: ${pole.id})`).not.toBe("");
      expect(pole.tagline.trim(), `pole.tagline vide (id: ${pole.id})`).not.toBe("");
      expect(pole.description.trim(), `pole.description vide (id: ${pole.id})`).not.toBe("");
    }
  });

  it("href commence par /", () => {
    for (const pole of POLES) {
      expect(pole.href, `href invalide pour "${pole.id}"`).toMatch(/^\//);
    }
  });

  it("color est un code hex valide", () => {
    for (const pole of POLES) {
      expect(pole.color, `color invalide pour "${pole.id}"`).toMatch(/^#[0-9A-Fa-f]{3,6}$/);
    }
  });

  it("n et number cohérents", () => {
    for (const pole of POLES) {
      expect(pole.n, `pole.n vide (id: ${pole.id})`).toBeTruthy();
      expect(pole.number, `pole.number vide (id: ${pole.id})`).toBeTruthy();
      expect(pole.n).toBe(pole.number);
    }
  });
});

// ── SERVICES ──────────────────────────────────────────────────────────────────

describe("SERVICES — cohérence des données", () => {
  it("slugs sont uniques", () => {
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size, "doublons de slug détectés").toBe(slugs.length);
  });

  it("numéros (n) sont uniques", () => {
    const nums = SERVICES.map((s) => s.n);
    expect(new Set(nums).size, "doublons de numéro détectés").toBe(nums.length);
  });

  it("titres sont uniques (normalisation \\n → espace)", () => {
    const titles = SERVICES.map((s) => s.title.replace(/\n/g, " ").trim());
    expect(new Set(titles).size, "doublons de titre détectés").toBe(titles.length);
  });

  it("champs obligatoires présents et non vides", () => {
    for (const svc of SERVICES) {
      expect(svc.slug.trim(), `slug vide`).not.toBe("");
      expect(svc.title.trim(), `title vide (slug: ${svc.slug})`).not.toBe("");
      expect(svc.tagline.trim(), `tagline vide (slug: ${svc.slug})`).not.toBe("");
      expect(svc.intro.trim(), `intro vide (slug: ${svc.slug})`).not.toBe("");
      expect(svc.heroImage.trim(), `heroImage vide (slug: ${svc.slug})`).not.toBe("");
      expect(svc.video.trim(), `video vide (slug: ${svc.slug})`).not.toBe("");
      expect(svc.accent.trim(), `accent vide (slug: ${svc.slug})`).not.toBe("");
    }
  });

  it("poleN est parmi I, II, III", () => {
    for (const svc of SERVICES) {
      expect(["I", "II", "III"], `poleN invalide pour "${svc.slug}"`).toContain(svc.poleN);
    }
  });

  it("subs : au moins 1 entrée, champs non vides", () => {
    for (const svc of SERVICES) {
      expect(svc.subs.length, `subs vide pour "${svc.slug}"`).toBeGreaterThan(0);
      for (const sub of svc.subs) {
        expect(sub.title.trim(), `sub.title vide dans "${svc.slug}"`).not.toBe("");
        expect(sub.desc.trim(), `sub.desc vide dans "${svc.slug}"`).not.toBe("");
      }
    }
  });

  it("benefits : au moins 1 entrée non vide", () => {
    for (const svc of SERVICES) {
      expect(svc.benefits.length, `benefits vide pour "${svc.slug}"`).toBeGreaterThan(0);
      for (const b of svc.benefits) {
        expect(b.trim(), `benefit vide dans "${svc.slug}"`).not.toBe("");
      }
    }
  });

  it("deliverables : au moins 1 entrée non vide", () => {
    for (const svc of SERVICES) {
      expect(svc.deliverables.length, `deliverables vide pour "${svc.slug}"`).toBeGreaterThan(0);
      for (const d of svc.deliverables) {
        expect(d.trim(), `deliverable vide dans "${svc.slug}"`).not.toBe("");
      }
    }
  });

  it("subImages : aucune URL vide", () => {
    for (const svc of SERVICES) {
      for (const img of svc.subImages) {
        expect(img.trim(), `subImage vide dans "${svc.slug}"`).not.toBe("");
      }
    }
  });

  it("heroImage non vide", () => {
    for (const svc of SERVICES) {
      expect(svc.heroImage.trim(), `heroImage vide pour "${svc.slug}"`).not.toBe("");
    }
  });

  it("accent est un code hex valide", () => {
    for (const svc of SERVICES) {
      expect(svc.accent, `accent invalide pour "${svc.slug}"`).toMatch(/^#[0-9A-Fa-f]{3,6}$/);
    }
  });
});

// ── PROJECTS ──────────────────────────────────────────────────────────────────

describe("PROJECTS — cohérence des données", () => {
  it("IDs sont uniques", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size, "doublons d'ID détectés").toBe(ids.length);
  });

  it("titres sont uniques", () => {
    const titles = PROJECTS.map((p) => p.title);
    expect(new Set(titles).size, "doublons de titre détectés").toBe(titles.length);
  });

  it("index sont uniques", () => {
    const indices = PROJECTS.map((p) => p.index);
    expect(new Set(indices).size, "doublons d'index détectés").toBe(indices.length);
  });

  it("champs obligatoires présents et non vides", () => {
    for (const proj of PROJECTS) {
      expect(proj.id.trim(), `id vide`).not.toBe("");
      expect(proj.title.trim(), `title vide (id: ${proj.id})`).not.toBe("");
      expect(proj.tagline.trim(), `tagline vide (id: ${proj.id})`).not.toBe("");
      expect(proj.description.trim(), `description vide (id: ${proj.id})`).not.toBe("");
      expect(proj.descriptionLong.trim(), `descriptionLong vide (id: ${proj.id})`).not.toBe("");
      expect(proj.image.trim(), `image vide (id: ${proj.id})`).not.toBe("");
      expect(proj.client.trim(), `client vide (id: ${proj.id})`).not.toBe("");
      expect(proj.year.trim(), `year vide (id: ${proj.id})`).not.toBe("");
      expect(proj.color.trim(), `color vide (id: ${proj.id})`).not.toBe("");
    }
  });

  it("images non vides", () => {
    for (const proj of PROJECTS) {
      expect(proj.image.trim(), `image vide pour "${proj.id}"`).not.toBe("");
    }
  });

  it("category dans la liste CATEGORIES (hors 'Tous')", () => {
    const valid = CATEGORIES.filter((c) => c !== "Tous");
    for (const proj of PROJECTS) {
      expect(valid, `catégorie invalide pour "${proj.id}"`).toContain(proj.category);
    }
  });

  it("color est un code hex valide", () => {
    for (const proj of PROJECTS) {
      expect(proj.color, `color invalide pour "${proj.id}"`).toMatch(/^#[0-9A-Fa-f]{3,6}$/);
    }
  });

  it("tags : tableau non vide, pas de chaîne vide", () => {
    for (const proj of PROJECTS) {
      expect(proj.tags.length, `tags vide pour "${proj.id}"`).toBeGreaterThan(0);
      for (const tag of proj.tags) {
        expect(tag.trim(), `tag vide dans "${proj.id}"`).not.toBe("");
      }
    }
  });

  it("results : tableau non vide, label et value non vides", () => {
    for (const proj of PROJECTS) {
      expect(proj.results.length, `results vide pour "${proj.id}"`).toBeGreaterThan(0);
      for (const r of proj.results) {
        expect(r.label.trim(), `result.label vide dans "${proj.id}"`).not.toBe("");
        expect(r.value.trim(), `result.value vide dans "${proj.id}"`).not.toBe("");
      }
    }
  });

  it("challenges : tableau non vide", () => {
    for (const proj of PROJECTS) {
      expect(proj.challenges.length, `challenges vide pour "${proj.id}"`).toBeGreaterThan(0);
    }
  });
});
