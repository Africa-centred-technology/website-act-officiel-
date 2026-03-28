"use client";

/**
 * Exemple de composant utilisant l'intégration Shopify
 * Ce composant affiche les produits de votre boutique Shopify
 */

import React, { useState, useEffect } from "react";
import { getProducts, isShopifyConfigured } from "@/lib/shopify";

export default function ShopifyProductsExample() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      // Vérifier si Shopify est configuré
      if (!isShopifyConfigured()) {
        setError("Shopify n'est pas configuré. Veuillez vérifier vos variables d'environnement.");
        setLoading(false);
        return;
      }

      try {
        const data = await getProducts(10);
        setProducts(data.products.edges.map((edge: any) => edge.node));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des produits");
        console.error("Erreur Shopify:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#e74c3c" }}>
        <p>⚠️ {error}</p>
        <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#7f8c8d" }}>
          Assurez-vous d'avoir configuré correctement les variables d'environnement Shopify.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Aucun produit trouvé dans la boutique.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "bold" }}>
        Produits Shopify
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "2rem",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              transition: "transform 0.2s",
            }}
          >
            {product.images.edges[0] && (
              <img
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                }}
              />
            )}
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              {product.title}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#666",
                marginBottom: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {product.description}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#D35400" }}>
                {product.priceRange.minVariantPrice.amount}{" "}
                {product.priceRange.minVariantPrice.currencyCode}
              </span>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  background: "#D35400",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Voir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
