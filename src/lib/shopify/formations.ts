/**
 * Intégration Shopify pour les formations ACT
 * Récupère les formations depuis la boutique Shopify
 */

import { shopifyFetch } from './client';
import { Formation, Module } from '@/lib/data/formations';

/**
 * Interface pour les métadonnées Shopify (metafields)
 */
interface ShopifyMetafield {
  key: string;
  value: string;
}

/**
 * Transforme un produit Shopify en Formation ACT
 */
function transformShopifyProductToFormation(product: any): Formation {
  // Récupérer les métadonnées du produit
  const getMetafield = (key: string, defaultValue: string = ''): string => {
    const metafield = product.metafields?.edges?.find(
      (edge: any) => edge.node.key === key
    );
    return metafield?.node?.value || defaultValue;
  };

  // Parser les modules depuis JSON stocké dans Shopify
  const parseModules = (modulesJson: string): Module[] => {
    try {
      return JSON.parse(modulesJson || '[]');
    } catch {
      return [];
    }
  };

  // Parser les arrays depuis JSON
  const parseArray = (jsonString: string): string[] => {
    try {
      return JSON.parse(jsonString || '[]');
    } catch {
      return [];
    }
  };

  return {
    id: product.id.split('/').pop(), // Extraire l'ID de "gid://shopify/Product/123"
    slug: product.handle,
    title: product.title,
    secteur: getMetafield('secteur', 'Transversal'),
    categorie: getMetafield('categorie', 'Intelligence artificielle'),
    niveau: getMetafield('niveau', 'Initiation'),
    duree: getMetafield('duree', '1 journée (7h)'),
    format: getMetafield('format', 'Présentiel ou distanciel'),
    parcours: getMetafield('parcours'),
    prix: product.priceRange?.minVariantPrice?.amount
      ? `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`
      : undefined,
    accroche: product.description || getMetafield('accroche', ''),
    publicCible: getMetafield('public_cible', ''),
    prerequis: getMetafield('prerequis', ''),
    objectifs: parseArray(getMetafield('objectifs', '[]')),
    programme: parseModules(getMetafield('programme', '[]')),
    livrables: parseArray(getMetafield('livrables', '[]')),
    methode: getMetafield('methode', ''),
  };
}

/**
 * Récupère toutes les formations depuis Shopify
 * Les formations doivent avoir le tag "formation" dans Shopify
 */
export async function getFormationsFromShopify(first: number = 50): Promise<Formation[]> {
  const query = `
    query GetFormations($first: Int!, $query: String!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            handle
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            metafields(first: 20) {
              edges {
                node {
                  key
                  value
                  namespace
                }
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

  try {
    const data = await shopifyFetch<any>({
      query,
      variables: {
        first,
        query: 'tag:formation' // Filtre uniquement les produits avec le tag "formation"
      },
    });

    const products = data.products.edges.map((edge: any) => edge.node);
    return products.map(transformShopifyProductToFormation);
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    return [];
  }
}

/**
 * Récupère une formation spécifique par son handle (slug)
 */
export async function getFormationBySlug(slug: string): Promise<Formation | null> {
  const query = `
    query GetFormation($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        handle
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        metafields(first: 20) {
          edges {
            node {
              key
              value
              namespace
            }
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

  try {
    const data = await shopifyFetch<any>({
      query,
      variables: { handle: slug },
    });

    if (!data.product) {
      return null;
    }

    return transformShopifyProductToFormation(data.product);
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    return null;
  }
}

/**
 * Récupère les formations par catégorie
 */
export async function getFormationsByCategorie(categorie: string, first: number = 50): Promise<Formation[]> {
  const formations = await getFormationsFromShopify(first);
  return formations.filter(f => f.categorie === categorie);
}

/**
 * Récupère les formations par secteur
 */
export async function getFormationsBySecteur(secteur: string, first: number = 50): Promise<Formation[]> {
  const formations = await getFormationsFromShopify(first);
  return formations.filter(f => f.secteur === secteur);
}

/**
 * Récupère les formations par niveau
 */
export async function getFormationsByNiveau(niveau: string, first: number = 50): Promise<Formation[]> {
  const formations = await getFormationsFromShopify(first);
  return formations.filter(f => f.niveau === niveau);
}

/**
 * Ajoute une formation au panier Shopify
 */
export async function addFormationToCart(formationHandle: string, variantId: string): Promise<any> {
  // Créer un checkout si nécessaire
  const createCheckoutQuery = `
    mutation {
      checkoutCreate(input: {
        lineItems: [{
          variantId: "${variantId}",
          quantity: 1
        }]
      }) {
        checkout {
          id
          webUrl
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
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

  try {
    const data = await shopifyFetch<any>({ query: createCheckoutQuery });

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return data.checkoutCreate.checkout;
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    throw error;
  }
}
