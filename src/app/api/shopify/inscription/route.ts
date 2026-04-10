import { NextResponse } from "next/server";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_SECRET = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN; // usually "shpss_..." or "shpat_..."
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Variable globale pour mettre en cache le jeton à courte durée
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

// Fonction pour récupérer le vrai jeton d'accès d'API
async function getAdminToken(): Promise<string> {
  // Option 1 : Si c'est déjà un vrai token permanent
  if (ADMIN_SECRET && (ADMIN_SECRET.startsWith("shpat_") || ADMIN_SECRET.startsWith("shpua_"))) {
    return ADMIN_SECRET;
  }
  
  // Option 2 : Si c'est un secret d'app OAuth (Dev Dashboard), 
  // on utilise le "Client Credentials Grant" pour obtenir un jeton temporaire (24h)
  if (!CLIENT_ID || !ADMIN_SECRET) {
    throw new Error("Client ID ou Secret manquant pour l'auth Shopify Dev Dashboard.");
  }

  // Utiliser le cache si encore valide
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken as string;
  }

  const endpoint = `https://${DOMAIN}/admin/oauth/access_token`;
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: ADMIN_SECRET,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = await response.json();
  
  if (!response.ok || !data.access_token) {
    console.error("Échec génération du Access Token OAuth:", data);
    throw new Error("Authentication OAuth Shopify a échoué.");
  }

  // Cache le jeton et garde une marge de sécurité de 5 min (300 sec) avant péremption
  cachedAccessToken = data.access_token as string;
  tokenExpiresAt = Date.now() + ((data.expires_in || 86399) - 300) * 1000;
  
  return cachedAccessToken;
}
// Fonction utilitaire pour interroger l'API Storefront (pour récupérer le variant)
async function storefrontFetch(query: string, variables = {}) {
  const endpoint = `https://${DOMAIN}/api/2024-01/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

/**
 * Création d'une "Commande Provisoire" (Purchase Order / Draft Order) sur Shopify.
 * Idéal pour valider et créer un bon de commande sans paiement immédiat.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!DOMAIN || !ADMIN_SECRET || !STOREFRONT_TOKEN) {
      console.error("Missing Shopify configuration");
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    // Récupérer le vrai token (ça prend 100ms la 1ère fois, puis c'est en cache)
    const activeAdminToken = await getAdminToken();

    const { formationSlug } = body;

    // 1. (Optionnel mais recommandé) Récupérer le vrai Variant ID du produit
    let variantId = null;
    if (formationSlug) {
      const productQuery = `
        query getProductVariant($handle: String!) {
          product(handle: $handle) {
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `;
      const productRes = await storefrontFetch(productQuery, { handle: formationSlug });
      variantId = productRes?.data?.product?.variants?.edges?.[0]?.node?.id;
    }

    const endpoint = `https://${DOMAIN}/admin/api/2024-01/graphql.json`;

    // 2. Formater la Note récapitulative
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

    const note = noteLines.join("\\n");

    // 3. Déterminer la quantité basée sur le nombre de participants (pour B2B)
    const quantity = body.typeClient === "B2B" && body.nombreParticipants 
      ? parseInt(body.nombreParticipants, 10) || 1 
      : 1;

    // 4. Préparer les items de la commande
    // Si on a le variant, on l'utilise. Sinon on crée un item custom.
    const lineItems = variantId 
      ? [ { variantId: variantId, quantity: quantity } ]
      : [ { title: `Inscription: ${body.formationSouhaitee || formationSlug || "Formation"}`, originalUnitPrice: 0, quantity: quantity }];

    const mutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Important: Dans la DraftOrder, on utilise email, billingAddress et shippingAddress 
    // pour lier l'identité sans erreur GraphQL.
    const variables = {
      input: {
        note: note,
        tags: ["Inscription", "Formation", body.typeClient],
        email: body.email,
        billingAddress: {
          firstName: body.prenom,
          lastName: body.nom,
          phone: body.telephone || "",
          company: body.typeClient === "B2B" ? body.entreprise : ""
        },
        shippingAddress: {
          firstName: body.prenom,
          lastName: body.nom,
          phone: body.telephone || "",
          company: body.typeClient === "B2B" ? body.entreprise : ""
        },
        lineItems: lineItems
      }
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": activeAdminToken,
      },
      body: JSON.stringify({
        query: mutation,
        variables
      }),
    });

    const json = await response.json();

    if (json.errors || json?.data?.draftOrderCreate?.userErrors?.length > 0) {
      console.error("Erreur GraphQL Shopify Admin:", json.errors || json.data.draftOrderCreate.userErrors);
      return NextResponse.json({ error: "Impossible de créer le bon de commande.", details: json.errors || json.data.draftOrderCreate.userErrors }, { status: 400 });
    }

    return NextResponse.json({ success: true, draftOrder: json.data.draftOrderCreate.draftOrder });

  } catch (error) {
    console.error("Erreur Inscription Route:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
