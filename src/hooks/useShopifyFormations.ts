"use client";

/**
 * Hook React pour récupérer les formations depuis Shopify
 */

import { useState, useEffect } from 'react';
import { Formation } from '@/lib/data/formations';
import { getFormationsFromShopify, getFormationBySlug } from '@/lib/shopify/formations';
import { isShopifyConfigured } from '@/lib/shopify';

interface UseFormationsResult {
  formations: Formation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook pour récupérer toutes les formations
 */
export function useShopifyFormations(limit: number = 50): UseFormationsResult {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormations = async () => {
    // Vérifier si Shopify est configuré
    if (!isShopifyConfigured()) {
      setError('Shopify n\'est pas configuré');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getFormationsFromShopify(limit);
      setFormations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des formations');
      console.error('Erreur useShopifyFormations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, [limit]);

  return {
    formations,
    loading,
    error,
    refetch: fetchFormations,
  };
}

interface UseFormationResult {
  formation: Formation | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook pour récupérer une formation spécifique
 */
export function useShopifyFormation(slug: string): UseFormationResult {
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormation = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    if (!isShopifyConfigured()) {
      setError('Shopify n\'est pas configuré');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getFormationBySlug(slug);
      setFormation(data);

      if (!data) {
        setError('Formation non trouvée');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la formation');
      console.error('Erreur useShopifyFormation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormation();
  }, [slug]);

  return {
    formation,
    loading,
    error,
    refetch: fetchFormation,
  };
}
