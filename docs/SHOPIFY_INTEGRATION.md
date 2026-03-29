# Intégration Shopify

Ce document explique comment utiliser l'intégration Shopify dans votre site vitrine ACT.

## Configuration

### 1. Variables d'environnement

Les identifiants Shopify sont déjà configurés dans `.env.local` :



⚠️ **Important** : Vous devez remplacer `votre-boutique.myshopify.com` par le nom de domaine réel de votre boutique Shopify.

### 2. Structure des fichiers

```
src/
├── lib/
│   └── shopify/
│       ├── config.ts       # Configuration Shopify
│       ├── client.ts       # Client API avec requêtes GraphQL
│       └── index.ts        # Point d'entrée
└── components/
    └── shopify/
        └── ShopifyProductsExample.tsx  # Exemple d'utilisation
```

## Utilisation

### Récupérer les produits

```typescript
import { getProducts } from '@/lib/shopify';

// Dans un composant ou une fonction
const data = await getProducts(10); // Récupère 10 produits
const products = data.products.edges.map(edge => edge.node);
```

### Récupérer un produit spécifique

```typescript
import { getProductByHandle } from '@/lib/shopify';

const data = await getProductByHandle('nom-du-produit');
const product = data.product;
```

### Créer un panier

```typescript
import { createCheckout, addToCheckout } from '@/lib/shopify';

// Créer un nouveau panier
const checkoutData = await createCheckout();
const checkoutId = checkoutData.checkoutCreate.checkout.id;

// Ajouter un produit au panier
const variantId = 'gid://shopify/ProductVariant/123456';
await addToCheckout(checkoutId, variantId, 1);
```

## Exemple de composant

Un exemple complet est disponible dans `src/components/shopify/ShopifyProductsExample.tsx`.

Pour l'utiliser dans une page :

```tsx
import ShopifyProductsExample from '@/components/shopify/ShopifyProductsExample';

export default function MaBoutique() {
  return (
    <div>
      <h1>Notre Boutique</h1>
      <ShopifyProductsExample />
    </div>
  );
}
```

## API Shopify Storefront

L'intégration utilise l'API Shopify Storefront GraphQL qui permet de :

- ✅ Lire les produits et collections
- ✅ Gérer le panier (checkout)
- ✅ Rechercher des produits
- ✅ Récupérer les variantes et prix
- ❌ Pas d'accès aux commandes ou données clients (nécessite l'API Admin)

## Sécurité

- Le token Storefront Access Token est **public** et peut être exposé côté client
- Il ne donne accès qu'en lecture aux produits et à la gestion du panier
- Les données sensibles nécessitent l'API Admin (non implémentée ici)

## Documentation Shopify

- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [GraphQL Explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api)
- [Storefront API Examples](https://shopify.dev/docs/api/storefront/latest)

## Prochaines étapes

Pour une intégration complète, vous pourriez ajouter :

1. **Page boutique** : Afficher tous les produits avec filtres et recherche
2. **Page produit** : Détails complets d'un produit avec variantes
3. **Panier** : Gestion complète du panier avec ajout/suppression
4. **Checkout** : Redirection vers le checkout Shopify
5. **Collections** : Afficher les produits par catégorie/collection

## Support

Pour toute question sur l'intégration Shopify, consultez :
- Documentation officielle Shopify
- Support ACT : contact@africacentredtechnology.com
