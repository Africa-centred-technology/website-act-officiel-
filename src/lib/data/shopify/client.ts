/**
 * Client API Shopify Storefront
 */
import { SHOPIFY_GRAPHQL_URL, SHOPIFY_CONFIG, isShopifyConfigured } from './config';

/**
 * Fonction générique pour effectuer des requêtes GraphQL vers Shopify
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
}: {
  query: string;
  variables?: any;
  cache?: RequestCache;
}): Promise<T> {
  if (!isShopifyConfigured) {
    if (typeof window !== 'undefined') {
      console.warn('Shopify non configuré.');
      return { products: { edges: [] } } as any;
    }
    throw new Error('Shopify n\'est pas configuré.');
  }

  try {
    const isBrowser = typeof window !== 'undefined';
    const options: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.accessToken,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    };

    if (!isBrowser) {
      options.cache = cache;
      options.next = { revalidate: 3600 };
    } else {
      options.cache = 'no-store';
    }

    const result = await fetch(SHOPIFY_GRAPHQL_URL, options);
    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }
    return body.data;
  } catch (error) {
    console.error('Erreur Shopify API:', error);
    throw error;
  }
}
