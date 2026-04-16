import { NextResponse } from "next/server";
import { getAdminToken, shopifyAdminUrl } from "@/lib/api/shopify-admin";

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }

    const domain      = process.env.SHOPIFY_STORE_DOMAIN;
    const adminSecret = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!domain || !adminSecret) {
      return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
    }

    const token    = await getAdminToken();
    const endpoint = shopifyAdminUrl();

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

    // Email déjà utilisé → mettre à jour le consentement
    const emailTaken = userErrors.some(
      (e) =>
        e.message?.toLowerCase().includes("taken") ||
        e.message?.toLowerCase().includes("déjà")
    );

    if (emailTaken) {
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
