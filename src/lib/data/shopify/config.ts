/**
 * Configuration Shopify Storefront API
 */

const getEnv = (key: string) => {
  if (typeof window !== 'undefined') {
    return (process.env as any)[key] || '';
  }
  return process.env[key] || '';
};

export const SHOPIFY_CONFIG = {
  domain: getEnv('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN') || '',
  accessToken: getEnv('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN') || '',
  clientId: getEnv('NEXT_PUBLIC_SHOPIFY_CLIENT_ID') || '',
  apiVersion: '2024-01', // Version stable de l'API Storefront
};

export const isShopifyConfigured = 
  !!SHOPIFY_CONFIG.domain && 
  !!SHOPIFY_CONFIG.accessToken && 
  SHOPIFY_CONFIG.domain !== 'votre-boutique.myshopify.com' &&
  SHOPIFY_CONFIG.domain !== '';

/**
 * URL de l'API GraphQL Storefront
 */
export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
