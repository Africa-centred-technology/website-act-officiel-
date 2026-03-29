# 🎓 Intégration Shopify - Catalogue de Formations ACT

## 📦 Ce qui a été créé

### 1. Configuration Shopify
- ✅ Variables d'environnement configurées dans `.env.local`
- ✅ Configuration centralisée dans `src/lib/shopify/config.ts`
- ✅ Client API GraphQL dans `src/lib/shopify/client.ts`

### 2. Module Formations Shopify
- ✅ `src/lib/shopify/formations.ts` - Fonctions pour récupérer les formations
- ✅ `src/hooks/useShopifyFormations.ts` - Hooks React pour faciliter l'utilisation
- ✅ `src/components/formations/FormationsShellShopify.tsx` - Composant catalogue complet

### 3. Documentation
- ✅ `SHOPIFY_INTEGRATION.md` - Guide d'intégration général
- ✅ `SHOPIFY_FORMATIONS_SETUP.md` - Guide de configuration des formations dans Shopify

## 🚀 Démarrage rapide

### Étape 1 : Configurer le domaine Shopify

Éditez `.env.local` et remplacez :
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
```

Par le véritable domaine de votre boutique Shopify.

### Étape 2 : Configurer les formations dans Shopify

Suivez le guide détaillé dans `SHOPIFY_FORMATIONS_SETUP.md` :

1. **Taguer les produits** avec "formation"
2. **Créer les métadonnées** (metafields) pour stocker les informations détaillées
3. **Ajouter vos formations** avec tous les détails
4. **Tester** l'affichage sur le site

### Étape 3 : Utiliser le composant

Remplacez le composant actuel dans votre page formations :

```tsx
// Avant (données statiques)
import FormationsShell from '@/components/formations/FormationsShell';

// Après (données Shopify)
import FormationsShellShopify from '@/components/formations/FormationsShellShopify';

export default function FormationsPage() {
  return <FormationsShellShopify />;
}
```

## 📊 Structure des données

### Champs Shopify requis

| Champ | Type | Obligatoire | Exemple |
|-------|------|-------------|---------|
| Title | Texte | ✅ | "Intégrer l'IA dans sa pratique professionnelle" |
| Description | HTML | ✅ | Description marketing courte |
| Handle | Slug | ✅ | "ia-productivite-quotidienne" |
| Price | Nombre | ✅ | 500.00 EUR |
| Tags | Liste | ✅ | "formation" (obligatoire) |

### Métadonnées personnalisées (metafields)

| Clé | Type | Obligatoire | Exemple |
|-----|------|-------------|---------|
| `secteur` | Texte | ✅ | "Transversal — tous métiers" |
| `categorie` | Texte | ✅ | "Intelligence artificielle" |
| `niveau` | Texte | ✅ | "Initiation" |
| `duree` | Texte | ✅ | "1 journée (7h)" |
| `format` | Texte | ✅ | "Présentiel ou distanciel" |
| `accroche` | Texte long | ✅ | Phrase marketing |
| `public_cible` | Texte long | ✅ | Description du public |
| `prerequis` | Texte long | ✅ | Prérequis nécessaires |
| `objectifs` | JSON | ✅ | `["Objectif 1", "Objectif 2"]` |
| `programme` | JSON | ✅ | `[{"module": "...", "details": [...]}]` |
| `livrables` | JSON | ✅ | `["Livrable 1", "Livrable 2"]` |
| `methode` | Texte long | ✅ | Méthode pédagogique |
| `parcours` | Texte | ❌ | Parcours de formation (optionnel) |

## 🎯 Fonctionnalités disponibles

### Dans le catalogue
- ✅ Affichage de toutes les formations depuis Shopify
- ✅ Recherche en temps réel
- ✅ Filtres par catégorie, secteur et niveau
- ✅ Tri (récent, titre, durée, niveau)
- ✅ Vues Grid et List
- ✅ Affichage des prix
- ✅ Responsive (mobile, tablet, desktop)

### Fonctions disponibles

```typescript
// Récupérer toutes les formations
import { getFormationsFromShopify } from '@/lib/shopify/formations';
const formations = await getFormationsFromShopify(50);

// Récupérer une formation par slug
import { getFormationBySlug } from '@/lib/shopify/formations';
const formation = await getFormationBySlug('ia-productivite-quotidienne');

// Filtrer par catégorie
import { getFormationsByCategorie } from '@/lib/shopify/formations';
const formationsIA = await getFormationsByCategorie('Intelligence artificielle');

// Hooks React
import { useShopifyFormations, useShopifyFormation } from '@/hooks/useShopifyFormations';

function MonComposant() {
  const { formations, loading, error } = useShopifyFormations();
  // ...
}
```

## 🔄 Migration depuis les données statiques

Vous avez actuellement des formations dans `src/lib/data/formations.ts`.

### Option A : Migration complète vers Shopify (recommandé)

1. Configurer toutes vos formations dans Shopify
2. Remplacer `FormationsShell` par `FormationsShellShopify`
3. Garder `formations.ts` comme backup

### Option B : Système hybride

1. Utiliser Shopify pour les nouvelles formations
2. Garder les anciennes dans `formations.ts`
3. Fusionner les deux sources dans un composant custom

### Option C : Import automatique

Créer un script pour importer automatiquement depuis `formations.ts` vers Shopify (nécessite l'API Admin).

## ⚠️ Points importants

### Sécurité
- Le Storefront Access Token est **public** (safe pour le client)
- Il ne donne accès qu'en **lecture seule** aux produits
- Pas d'accès aux données sensibles ou aux commandes

### Performance
- Les données sont récupérées côté client au chargement
- Possibilité de mettre en cache avec React Query ou SWR
- Optimisation possible avec Server Components (Next.js 14+)

### Limitations
- L'API Storefront est limitée en nombre de requêtes
- Pas d'accès à toutes les fonctionnalités Admin
- Les métadonnées doivent être bien structurées

## 🛠️ Dépannage

### "Shopify n'est pas configuré"
➡️ Vérifiez que toutes les variables d'environnement sont définies dans `.env.local`

### "Aucune formation trouvée"
➡️ Vérifiez que vos produits ont bien le tag "formation"

### "Erreur GraphQL"
➡️ Vérifiez votre Storefront Access Token et les permissions

### Les métadonnées ne s'affichent pas
➡️ Vérifiez que les définitions de metafields utilisent le namespace "custom"

## 📚 Ressources

- [Documentation Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Guide des Metafields](https://shopify.dev/docs/apps/custom-data/metafields)
- [GraphQL Explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api)
- [SHOPIFY_INTEGRATION.md](./SHOPIFY_INTEGRATION.md) - Guide général
- [SHOPIFY_FORMATIONS_SETUP.md](./SHOPIFY_FORMATIONS_SETUP.md) - Configuration détaillée

## 💬 Support

Pour toute question :
- 📧 Email : contact@africacentredtechnology.com
- 📖 Documentation : Voir les fichiers MD dans le projet
- 🐛 Issues : Créer un ticket dans votre système de suivi

---

**Prochaine étape recommandée** : Suivre le guide `SHOPIFY_FORMATIONS_SETUP.md` pour configurer votre première formation dans Shopify ! 🚀
