import { NextResponse } from "next/server";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_SECRET = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAdminToken(): Promise<string> {
  if (ADMIN_SECRET && (ADMIN_SECRET.startsWith("shpat_") || ADMIN_SECRET.startsWith("shpua_"))) {
    return ADMIN_SECRET;
  }
  if (!CLIENT_ID || !ADMIN_SECRET) {
    throw new Error("Configuration Shopify manquante.");
  }
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }
  const response = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: ADMIN_SECRET,
    }).toString(),
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("Authentification Shopify échouée.");
  cachedAccessToken = data.access_token as string;
  tokenExpiresAt = Date.now() + ((data.expires_in || 86399) - 300) * 1000;
  return cachedAccessToken;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }

    if (!DOMAIN || !ADMIN_SECRET) {
      return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
    }

    const token = await getAdminToken();
    const endpoint = `https://${DOMAIN}/admin/api/2024-01/graphql.json`;

    // Essaie de créer le client avec consentement marketing
    const createRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
              customer { id email }
              userErrors { field message }
            }
          }
        `,
        variables: {
          input: {
            email,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
            },
          },
        },
      }),
    });

    const createJson = await createRes.json();
    const userErrors: { field: string[]; message: string }[] =
      createJson?.data?.customerCreate?.userErrors ?? [];

    // Vérifie si le client existe déjà
    const emailTaken = userErrors.some(
      (e) => e.message?.toLowerCase().includes("taken") || e.message?.toLowerCase().includes("déjà")
    );

    if (emailTaken) {
      // Retrouve l'ID du client existant
      const searchRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({
          query: `
            query findCustomer($query: String!) {
              customers(first: 1, query: $query) {
                edges { node { id } }
              }
            }
          `,
          variables: { query: `email:${email}` },
        }),
      });
      const searchJson = await searchRes.json();
      const customerId = searchJson?.data?.customers?.edges?.[0]?.node?.id;

      if (customerId) {
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": token,
          },
          body: JSON.stringify({
            query: `
              mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
                customerEmailMarketingConsentUpdate(input: $input) {
                  customer { id }
                  userErrors { field message }
                }
              }
            `,
            variables: {
              input: {
                customerId,
                emailMarketingConsent: {
                  marketingState: "SUBSCRIBED",
                  marketingOptInLevel: "SINGLE_OPT_IN",
                },
              },
            },
          }),
        });
      }

      return NextResponse.json({ success: true });
    }

    if (createJson.errors || userErrors.length > 0) {
      console.error("Erreur Shopify newsletter:", createJson.errors || userErrors);
      return NextResponse.json(
        { error: "Impossible de s'inscrire à la newsletter." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur route newsletter:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
