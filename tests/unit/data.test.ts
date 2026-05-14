/**
 * Tests de cohérence des données statiques
 *
 * Vérifie que les fichiers src/lib/data/ respectent les invariants attendus :
 *  - IDs / slugs uniques
 *  - Champs structurels présents et non vides
 *  - Images / vidéos non vides
 *  - Valeurs d'énumération valides
 *
 * Run : npm test
 */

import { describe, it, expect } from "vitest";
import { POLES } from "@/lib/data/poles";
import { SERVICES } from "@/lib/data/services";
import { PROJECTS, CATEGORIES } from "@/lib/data/projects";
import { secteurs } from "@/lib/secteurs-data";
import frMessages from "@/i18n/messages/fr.json";

// ── POLES ─────────────────────────────────────────────────────────────────────

describe("POLES — cohérence des données", () => {
  it("IDs sont uniques", () => {
    const ids = POLES.map((p) => p.id);
    expect(new Set(ids).size, "doublons d'ID détectés").toBe(ids.length);
  });

  it("champs obligatoires présents et non vides", () => {
    for (const pole of POLES) {
      expect(pole.id.trim(), `pole.id vide (id: ${pole.id})`).not.toBe("");
      expect(pole.color.trim(), `pole.color vide (id: ${pole.id})`).not.toBe("");
      expect(pole.href.trim(), `pole.href vide (id: ${pole.id})`).not.toBe("");
      expect(pole.image.trim(), `pole.image vide (id: ${pole.id})`).not.toBe("");
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

  it("champs obligatoires présents et non vides", () => {
    for (const svc of SERVICES) {
      expect(svc.slug.trim(), `slug vide`).not.toBe("");
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

  it("index sont uniques", () => {
    const indices = PROJECTS.map((p) => p.index);
    expect(new Set(indices).size, "doublons d'index détectés").toBe(indices.length);
  });

  it("champs obligatoires présents et non vides", () => {
    for (const proj of PROJECTS) {
      expect(proj.id.trim(), `id vide`).not.toBe("");
      expect(proj.image.trim(), `image vide (id: ${proj.id})`).not.toBe("");
      expect(proj.year.trim(), `year vide (id: ${proj.id})`).not.toBe("");
      expect(proj.color.trim(), `color vide (id: ${proj.id})`).not.toBe("");
    }
  });

  it("images non vides", () => {
    for (const proj of PROJECTS) {
      expect(proj.image.trim(), `image vide pour "${proj.id}"`).not.toBe("");
    }
  });

  it("color est un code hex valide", () => {
    for (const proj of PROJECTS) {
      expect(proj.color, `color invalide pour "${proj.id}"`).toMatch(/^#[0-9A-Fa-f]{3,6}$/);
    }
  });
});

// ── i18n coverage — POLES ────────────────────────────────────────────────────

describe("i18n coverage — POLES", () => {
  it("every pole has a fr.json entry", () => {
    const polesItems = (frMessages as any).poles?.items;
    expect(polesItems).toBeDefined();
    for (const pole of POLES) {
      expect(polesItems[pole.id], `missing fr.json entry for pole "${pole.id}"`).toBeDefined();
      expect(polesItems[pole.id].title, `missing title in fr.json for pole "${pole.id}"`).toBeTruthy();
    }
  });
});

// ── i18n coverage — SECTEURS ─────────────────────────────────────────────────

describe("i18n coverage — SECTEURS", () => {
  it("every secteur has a fr.json entry", () => {
    const secteursItems = (frMessages as any).secteurs?.items;
    expect(secteursItems).toBeDefined();
    for (const secteur of secteurs) {
      expect(secteursItems[secteur.slug], `missing fr.json entry for secteur "${secteur.slug}"`).toBeDefined();
      expect(secteursItems[secteur.slug].label, `missing label in fr.json for secteur "${secteur.slug}"`).toBeTruthy();
    }
  });
});

// ── i18n coverage — PROJECTS ─────────────────────────────────────────────────

describe("i18n coverage — PROJECTS", () => {
  it("every project has a fr.json entry", () => {
    const projectsItems = (frMessages as any).projects?.items;
    expect(projectsItems).toBeDefined();
    for (const project of PROJECTS) {
      expect(projectsItems[project.id], `missing fr.json entry for project "${project.id}"`).toBeDefined();
      expect(projectsItems[project.id].title, `missing title in fr.json for project "${project.id}"`).toBeTruthy();
    }
  });
});

// ── i18n coverage — SERVICES ─────────────────────────────────────────────────

describe("i18n coverage — SERVICES", () => {
  it("every service has a fr.json entry", () => {
    const servicesItems = (frMessages as any).services?.items;
    expect(servicesItems).toBeDefined();
    for (const service of SERVICES) {
      expect(servicesItems[service.slug], `missing fr.json entry for service "${service.slug}"`).toBeDefined();
      expect(servicesItems[service.slug].title, `missing title in fr.json for service "${service.slug}"`).toBeTruthy();
    }
  });
});
