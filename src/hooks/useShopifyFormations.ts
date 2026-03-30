import { useState, useEffect } from 'react';
import { getFormationsFromShopify, getFormationBySlug, ShopifyProduct, mapShopifyProductToFormation } from '@/lib/data/shopify';
import { FORMATIONS } from '@/lib/data/formations';

/**
 * Hook pour récupérer toutes les formations Shopify
 * Retourne les données statiques en cas d'erreur API (Fallback)
 */
export function useShopifyFormations() {
  const [formations, setFormations] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getFormationsFromShopify();
        
        if (data && data.length > 0) {
          setFormations(data);
          setIsFallback(false);
        } else {
          // Si aucune donnée n'est retournée (boutique vide ou gelée)
          throw new Error('Aucune formation trouvée sur Shopify');
        }
        setError(null);
      } catch (err) {
        console.warn('Shopify API Error, using static fallback:', err);
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        setIsFallback(true);
        
        // Conversion basique des formations statiques au format ShopifyProduct pour le catalogue
        // Note: On pourrait aussi changer le composant pour accepter les deux types
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { formations, loading, error, isFallback };
}

/**
 * Hook pour récupérer une formation par son slug
 */
export function useShopifyFormation(slug: string) {
  const [formation, setFormation] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getFormationBySlug(slug);
        setFormation(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  return { formation, loading, error };
}
