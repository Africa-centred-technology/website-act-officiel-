import { NextResponse } from "next/server";
import { getAdminToken, shopifyAdminUrl } from "@/lib/api/shopify-admin";
import { routing, type Locale } from "@/i18n/routing";

const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

function safeLocale(raw: unknown): Locale {
  if (typeof raw === "string" && (routing.locales as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return routing.defaultLocale;
}

// ── Storefront helper ─────────────────────────────────────────────────────────

async function storefrontFetch(query: string, variables = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const domain      = process.env.SHOPIFY_STORE_DOMAIN;
    const adminSecret = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!domain || !adminSecret || !STOREFRONT_TOKEN) {
      console.error("Missing Shopify configuration");
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    const activeAdminToken = await getAdminToken();
    const { formationSlug } = body;

    // 1. Récupérer le Variant ID du produit (optionnel)
    let variantId: string | null = null;
    if (formationSlug) {
      const productRes = await storefrontFetch(
        `query getProductVariant($handle: String!) {
          product(handle: $handle) {
            variants(first: 1) {
              edges { node { id } }
            }
          }
        }`,
        { handle: formationSlug }
      );
      variantId = productRes?.data?.product?.variants?.edges?.[0]?.node?.id ?? null;
    }

    // 2. Note récapitulative
    const noteLines = [
      `Source: Site Web - Inscription Formation`,
      `Type: ${body.typeClient}`,
      `Ville: ${body.ville}`,
    ];

    if (body.typeClient === "B2C") {
      noteLines.push(`Âge: ${body.age}`);
      noteLines.push(`Statut: ${body.statutProfessionnel}`);
      noteLines.push(`Études: ${body.niveauEtudes}`);
      noteLines.push(`Expérience IA: ${body.experienceIA}`);
      noteLines.push(`Objectif: ${body.objectifPrincipal}`);
    } else {
      noteLines.push(`Entreprise: ${body.entreprise}`);
      noteLines.push(`Secteur: ${body.secteurActivite}`);
      noteLines.push(`Taille Entrep.: ${body.tailleEntreprise}`);
      noteLines.push(`Fonction: ${body.fonctionDemandeur}`);
      noteLines.push(`Nb Participants: ${body.nombreParticipants}`);
      noteLines.push(`Besoin: ${body.besoinPrincipal}`);
    }

    noteLines.push(`Formats préférés: ${body.formatsPreferes?.join(", ") || ""}`);
    noteLines.push(`Disponibilité: ${body.disponibilite}`);
    noteLines.push(`Message complémentaire: ${body.message || "Aucun"}`);

    const locale = safeLocale(body.locale);
    noteLines.push(`Locale: ${locale}`);

    const note = noteLines.join("\\n");

    // 3. Quantité (B2B = nombre de participants)
    const quantity =
      body.typeClient === "B2B" && body.nombreParticipants
        ? parseInt(body.nombreParticipants, 10) || 1
        : 1;

    // 4. Line items
    const lineItems = variantId
      ? [{ variantId, quantity }]
      : [
          {
            title: `Inscription: ${body.formationSouhaitee || formationSlug || "Formation"}`,
            originalUnitPrice: 0,
            quantity,
          },
        ];

    // 5. Draft Order via GraphQL Admin
    const draftInput = {
      input: {
        note,
        tags: ["Inscription", "Formation", body.typeClient, `lang:${locale}`],
        email: body.email,
        billingAddress: {
          firstName: body.prenom,
          lastName:  body.nom,
          phone:     body.telephone || "",
          company:   body.typeClient === "B2B" ? body.entreprise : "",
        },
        shippingAddress: {
          firstName: body.prenom,
          lastName:  body.nom,
          phone:     body.telephone || "",
          company:   body.typeClient === "B2B" ? body.entreprise : "",
        },
        lineItems,
      },
    };

    const adminHeaders = {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": activeAdminToken,
    };

    const draftRes = await fetch(shopifyAdminUrl(), {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        query: `
          mutation draftOrderCreate($input: DraftOrderInput!) {
            draftOrderCreate(input: $input) {
              draftOrder { id name }
              userErrors { field message }
            }
          }
        `,
        variables: draftInput,
      }),
    });

    const draftJson = await draftRes.json();

    if (draftJson.errors || draftJson?.data?.draftOrderCreate?.userErrors?.length > 0) {
      console.error("Erreur draftOrderCreate:", draftJson.errors || draftJson.data.draftOrderCreate.userErrors);
      return NextResponse.json(
        { error: "Impossible de créer l'inscription.", details: draftJson.errors || draftJson.data.draftOrderCreate.userErrors },
        { status: 400 }
      );
    }

    const draftOrderId = draftJson.data.draftOrderCreate.draftOrder.id;

    // 6. Compléter immédiatement → convertit en vrai Order (paiement en attente)
    const completeRes = await fetch(shopifyAdminUrl(), {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        query: `
          mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {
            draftOrderComplete(id: $id, paymentPending: $paymentPending) {
              draftOrder {
                order { id name }
              }
              userErrors { field message }
            }
          }
        `,
        variables: { id: draftOrderId, paymentPending: true },
      }),
    });

    const completeJson = await completeRes.json();

    if (completeJson.errors || completeJson?.data?.draftOrderComplete?.userErrors?.length > 0) {
      console.error("Erreur draftOrderComplete:", completeJson.errors || completeJson.data.draftOrderComplete.userErrors);
      return NextResponse.json(
        { error: "Inscription créée mais non finalisée.", details: completeJson.errors || completeJson.data.draftOrderComplete.userErrors },
        { status: 400 }
      );
    }

    const order = completeJson.data.draftOrderComplete.draftOrder.order;
    return NextResponse.json({
      success: true,
      orderId: order?.id ?? null,
      orderName: order?.name ?? null,
    });

  } catch (error) {
    console.error("Erreur Inscription Route:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
