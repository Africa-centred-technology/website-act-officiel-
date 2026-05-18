/**
 * Smoke pack E2E — Playwright
 *
 * 5 tests couvrant les parcours critiques du site ACT :
 *  1. La home charge
 *  2. La page formations charge (mock Shopify)
 *  3. Ouvrir une formation (mock Shopify)
 *  4. Formulaire contact — envoi réussi (mock /api/contact)
 *  5. Formulaire inscription — envoi réussi (mocks réseau)
 *
 * Run : npm run test:e2e
 */

import { test, expect, type Page } from "@playwright/test";

// ── Mock slug & data ──────────────────────────────────────────────────────────

const MOCK_SLUG = "ia-pour-les-pros";

/** ShopifyFormationCard shape returned by GET /api/shopify/formations */
const MOCK_CARD = {
  id: MOCK_SLUG,
  slug: MOCK_SLUG,
  title: "IA pour les Pros",
  secteur: "Tous secteurs",
  categorie: "Intelligence Artificielle",
  niveau: "Initiation",
  duree: "1 journée (7h)",
  format: "Présentiel",
  prix: "400 MAD",
  accroche: "Maîtrisez les outils IA en 1 journée",
  imageUrl: "https://cdn.shopify.com/s/files/placeholder.jpg",
  shopifyId: "gid://shopify/Product/1234567890",
};

/** ShopifyFormationDetail shape returned by GET /api/shopify/formations/[slug] */
const MOCK_DETAIL = {
  ...MOCK_CARD,
  publicCible: "Professionnels, Managers, Consultants",
  prerequis: "Aucun prérequis",
  objectifs: [
    "Comprendre les bases de l'IA",
    "Utiliser ChatGPT et les outils IA au quotidien",
  ],
  // Nouveau format : description (string) au lieu de details (string[])
  programme: [
    {
      module: "Introduction à l'IA",
      description: "Définitions clés et panorama des outils IA disponibles en 2025.",
    },
    {
      module: "Prompts efficaces",
      description: "Méthode CREA pour rédiger des prompts qui donnent des résultats.",
    },
  ],
  livrables: ["Attestation de participation", "Pack 20 prompts PDF"],
  methode: "Présentiel avec exercices pratiques sur poste",
  images: ["https://cdn.shopify.com/s/files/placeholder.jpg"],
  descriptionHtml: "<p>Formation IA pour les professionnels — 1 journée intensive.</p>",
  pricingPlans: [
    {
      title: "Inter",
      description: "Session inter-entreprises.",
      amount: "990",
      currency: "MAD HT",
      featured: true,
      cta_label: "Réserver ma place",
      cta_type: "inscription",
      features: ["3h d'atelier en présentiel", "Pack 20 prompts", "Attestation"],
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Intercepte les appels Shopify formations pour éviter les erreurs réseau en test. */
async function mockFormationsAPI(page: Page) {
  await page.route("**/api/shopify/formations*", (route) => {
    // Ne pas intercepter les routes avec un slug (/api/shopify/formations/foo)
    if (route.request().url().includes("/api/shopify/formations/")) return route.fallback();
    return route.fulfill({ json: { formations: [MOCK_CARD] } });
  });

  await page.route(`**/api/shopify/formations/${MOCK_SLUG}*`, (route) =>
    route.fulfill({ json: { formation: MOCK_DETAIL } })
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe("Smoke pack — parcours critiques ACT", () => {
  // ── 1. Home ────────────────────────────────────────────────────────────────
  test("1. La home charge", async ({ page }) => {
    await page.goto("/");

    // Le titre de la page doit contenir "ACT"
    await expect(page).toHaveTitle(/ACT/i);

    // Pas d'erreur 500 ou 404 affichée
    const body = page.locator("body");
    await expect(body).not.toContainText("Application error");
    await expect(body).not.toContainText("404");

    // La page a bien rendu du contenu (pas vide)
    await expect(body).not.toBeEmpty();
  });

  // ── 2. Page formations ────────────────────────────────────────────────────
  test("2. La page formations charge et affiche les formations", async ({ page }) => {
    await mockFormationsAPI(page);
    await page.goto("/formations");

    // La formation mockée doit apparaître (client-side fetch)
    await expect(
      page.getByText("IA pour les Pros").first()
    ).toBeVisible({ timeout: 20_000 });
  });

  // ── 3. Ouvrir une formation ───────────────────────────────────────────────
  test("3. La page détail formation charge", async ({ page }) => {
    await mockFormationsAPI(page);
    await page.goto(`/formations/${MOCK_SLUG}`);

    // Le titre de la formation doit apparaître
    await expect(
      page.getByText("IA pour les Pros").first()
    ).toBeVisible({ timeout: 20_000 });

    // La page ne doit pas afficher une erreur
    await expect(page.locator("body")).not.toContainText("Formation introuvable");
    await expect(page.locator("body")).not.toContainText("Application error");

    // Section programme — nouveau format description (plus de details[])
    await expect(
      page.getByText("Introduction à l'IA").first()
    ).toBeVisible({ timeout: 10_000 });

    // Section "Pour qui ?" — pills statiques
    await expect(
      page.getByText("Professionnels").first()
    ).toBeVisible({ timeout: 10_000 });

    // Section tarifs — pricingPlan mocké
    await expect(
      page.getByText("Réserver ma place").first()
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── 4. Formulaire contact ─────────────────────────────────────────────────
  test("4. Formulaire contact — envoi réussi (mock API)", async ({ page }) => {
    // Mock la route contact avant la navigation
    await page.route("**/api/contact", (route) =>
      route.fulfill({ json: { success: true, draftOrder: null } })
    );

    await page.goto("/fr/contact");

    // Attendre que la page soit interactive avant de scroller
    await page.waitForLoadState("domcontentloaded");
    await page.locator("#form").scrollIntoViewIfNeeded();

    // Remplir les champs requis
    await page.getByPlaceholder("Votre nom complet").fill("Test Smoke User");
    await page.getByPlaceholder("votre@entreprise.com").fill("smoke@test.com");
    // "Type de projet" est required — sans sélection la validation HTML5 bloque le submit
    await page.locator("form select").selectOption("web");
    await page
      .getByPlaceholder("Décrivez votre projet, vos objectifs et vos contraintes...")
      .fill("Ceci est un message de test automatisé Playwright.");

    // Soumettre (scopé au formulaire pour éviter d'ambiguïté avec d'autres boutons de la page)
    await page.locator("form").getByRole("button", { name: /envoyer/i }).click();

    // Vérifier l'état de succès
    await expect(
      page.getByText("Message envoyé", { exact: false })
    ).toBeVisible({ timeout: 10_000 });
  });

  // ── 5. Formulaire inscription ─────────────────────────────────────────────
  test("5. Formulaire inscription — envoi réussi (mocks réseau)", async ({ page }) => {
    // Mocks : formation detail + endpoint inscription
    await mockFormationsAPI(page);
    await page.route("**/api/shopify/inscription", (route) =>
      route.fulfill({
        json: {
          success: true,
          draftOrder: { id: "gid://shopify/DraftOrder/1", name: "#D001" },
        },
      })
    );

    await page.goto(`/fr/formations/${MOCK_SLUG}/inscription`);

    // Attendre que le formulaire soit rendu (chargement de la formation mockée)
    await expect(
      page.getByPlaceholder("votre@email.com")
    ).toBeVisible({ timeout: 20_000 });

    // ── Champs texte requis (mode étudiant uniquement, plus de Pro tab) ─────
    await page.getByPlaceholder("votre@email.com").fill("inscrit@test.com");
    await page.getByPlaceholder("Votre nom").fill("Dupont");
    await page.getByPlaceholder("Votre prénom").fill("Marie");
    // Téléphone (plus de Téléphone 2 / WhatsApp / Pays — un seul champ tel)
    await page.getByPlaceholder("+212 6XX XXX XXX").first().fill("+212600112233");

    // ── 2 selects en mode étudiant : niveau d'études, fonction
    // 1er select : Niveau d'études
    await page.locator("form select").nth(0).selectOption({ index: 1 });
    // 2ème select : Fonction du participant
    await page.locator("form select").nth(1).selectOption({ index: 1 });

    // ── Soumettre (scopé au form pour éviter le bouton newsletter du footer) ──
    await page.locator("form").getByRole("button", { name: /s'inscrire/i }).click();

    // ── Vérifier le message de succès ────────────────────────────────────────
    await expect(
      page.getByText("Inscription validée !")
    ).toBeVisible({ timeout: 10_000 });
  });
});
