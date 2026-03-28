/**
 * Configuration Shopify
 * Centralise tous les paramètres de connexion à Shopify
 */

export const shopifyConfig = {
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  clientId: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID || '',
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  apiVersion: '2024-01', // Version de l'API Shopify
};

/**
 * Vérifie que tous les paramètres Shopify sont configurés
 */
export function isShopifyConfigured(): boolean {
  return !!(
    shopifyConfig.storefrontAccessToken &&
    shopifyConfig.clientId &&
    shopifyConfig.storeDomain
  );
}

/**
 * Retourne l'URL de base de l'API Shopify Storefront
 */
export function getShopifyStorefrontUrl(): string {
  return `https://${shopifyConfig.storeDomain}/api/${shopifyConfig.apiVersion}/graphql.json`;
}
