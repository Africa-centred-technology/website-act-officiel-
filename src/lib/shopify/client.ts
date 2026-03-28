/**
 * Client Shopify
 * Gère les requêtes vers l'API Shopify Storefront
 */

import { shopifyConfig, getShopifyStorefrontUrl, isShopifyConfigured } from './config';

/**
 * Effectue une requête GraphQL vers l'API Shopify Storefront
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify n\'est pas configuré. Vérifiez vos variables d\'environnement.');
  }

  const url = getShopifyStorefrontUrl();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopifyConfig.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(`Erreur GraphQL: ${JSON.stringify(json.errors)}`);
    }

    return json.data as T;
  } catch (error) {
    console.error('Erreur lors de la requête Shopify:', error);
    throw error;
  }
}

/**
 * Récupère les produits de la boutique
 */
export async function getProducts(first: number = 10) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  return shopifyFetch<any>({
    query,
    variables: { first },
  });
}

/**
 * Récupère un produit par son handle
 */
export async function getProductByHandle(handle: string) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  return shopifyFetch<any>({
    query,
    variables: { handle },
  });
}

/**
 * Crée un panier (checkout)
 */
export async function createCheckout() {
  const query = `
    mutation {
      checkoutCreate(input: {}) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

  return shopifyFetch<any>({ query });
}

/**
 * Ajoute un article au panier
 */
export async function addToCheckout(checkoutId: string, variantId: string, quantity: number = 1) {
  const query = `
    mutation AddToCheckout($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
              }
            }
          }
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

  return shopifyFetch<any>({
    query,
    variables: {
      checkoutId,
      lineItems: [{ variantId, quantity }],
    },
  });
}
