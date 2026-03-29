# Configuration des Formations dans Shopify

Ce guide explique comment configurer vos formations dans Shopify pour qu'elles s'affichent correctement sur votre site vitrine ACT.

## 📋 Prérequis

1. Accès administrateur à votre boutique Shopify
2. Les identifiants Shopify configurés dans `.env.local`
3. Le domaine de votre boutique Shopify configuré

## 🏷️ Étape 1 : Taguer les produits comme formations

Pour qu'un produit soit reconnu comme formation, il doit avoir le tag **"formation"**.

### Dans l'admin Shopify :
1. Allez dans **Produits** > sélectionnez un produit
2. Dans la section **Tags**, ajoutez : `formation`
3. Cliquez sur **Enregistrer**

## 📝 Étape 2 : Configurer les métadonnées (metafields)

Les formations utilisent des métadonnées personnalisées pour stocker les informations détaillées.

### Créer les définitions de metafields

Dans l'admin Shopify, allez dans **Paramètres** > **Métadonnées personnalisées** > **Produits**

Créez les définitions suivantes :

| Namespace | Clé | Type | Description |
|-----------|-----|------|-------------|
| `custom` | `secteur` | Texte sur une ligne | Secteur d'activité (ex: "Transversal — tous métiers") |
| `custom` | `categorie` | Texte sur une ligne | Catégorie (ex: "Intelligence artificielle") |
| `custom` | `niveau` | Texte sur une ligne | Niveau (ex: "Initiation", "Intermédiaire", "Avancé", "Expert") |
| `custom` | `duree` | Texte sur une ligne | Durée (ex: "1 journée (7h)") |
| `custom` | `format` | Texte sur une ligne | Format (ex: "Présentiel ou distanciel") |
| `custom` | `parcours` | Texte sur une ligne | Parcours (optionnel) |
| `custom` | `accroche` | Texte multiligne | Phrase d'accroche marketing |
| `custom` | `public_cible` | Texte multiligne | Description du public cible |
| `custom` | `prerequis` | Texte multiligne | Prérequis nécessaires |
| `custom` | `objectifs` | JSON | Liste des objectifs pédagogiques |
| `custom` | `programme` | JSON | Programme détaillé (modules) |
| `custom` | `livrables` | JSON | Liste des livrables |
| `custom` | `methode` | Texte multiligne | Méthode pédagogique |

### Exemple de valeurs

#### objectifs (JSON)
```json
[
  "Comprendre ce que l'IA générative peut faire",
  "Identifier les cas d'usage pertinents",
  "Utiliser les principaux outils IA disponibles",
  "Rédiger des instructions efficaces"
]
```

#### programme (JSON)
```json
[
  {
    "module": "Module 1 — Comprendre l'IA générative (1h)",
    "details": [
      "Qu'est-ce que l'IA générative ?",
      "Les grands modèles de langage",
      "Ce que l'IA fait bien et mal"
    ]
  },
  {
    "module": "Module 2 — Identifier ses cas d'usage (1h30)",
    "details": [
      "Cartographie des tâches chronophages",
      "Quelles tâches déléguer à l'IA"
    ]
  }
]
```

#### livrables (JSON)
```json
[
  "Un plan d'intégration personnalisé",
  "Une bibliothèque de prompts",
  "Accès aux ressources présentées",
  "Attestation de participation ACT"
]
```

## 💰 Étape 3 : Configurer le prix

1. Le prix principal du produit dans Shopify sera affiché comme prix de la formation
2. Si vous avez plusieurs variantes (ex: tarif individuel, tarif entreprise), elles seront disponibles via l'API

## 🖼️ Étape 4 : Ajouter des images

1. Ajoutez une image principale au produit
2. Cette image sera affichée dans la liste des formations (optionnel)

## 📱 Utilisation dans le site

### Composant Shopify (recommandé)

Utilisez `FormationsShellShopify.tsx` pour récupérer automatiquement les formations depuis Shopify :

```tsx
import FormationsShellShopify from '@/components/formations/FormationsShellShopify';

export default function FormationsPage() {
  return <FormationsShellShopify />;
}
```

### Hook personnalisé

Pour une utilisation plus flexible :

```tsx
import { useShopifyFormations } from '@/hooks/useShopifyFormations';

function MesFormations() {
  const { formations, loading, error } = useShopifyFormations();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div>
      {formations.map(formation => (
        <div key={formation.id}>
          <h3>{formation.title}</h3>
          <p>{formation.accroche}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Migration depuis les données statiques

Si vous avez déjà des formations dans `src/lib/data/formations.ts`, vous pouvez :

1. **Option 1** : Importer vos formations existantes dans Shopify manuellement
2. **Option 2** : Utiliser l'API Shopify Admin pour les importer par script
3. **Option 3** : Garder les deux systèmes en parallèle temporairement

### Script de migration (exemple)

```typescript
import { FORMATIONS } from '@/lib/data/formations';
// Script à exécuter côté serveur pour importer dans Shopify
// (nécessite l'API Admin Shopify)
```

## ✅ Checklist de configuration

- [ ] Token Storefront Access configuré dans `.env.local`
- [ ] Domaine Shopify configuré dans `.env.local`
- [ ] Produits tagués avec "formation"
- [ ] Définitions de metafields créées
- [ ] Au moins une formation complète ajoutée
- [ ] Prix configuré
- [ ] Test de l'affichage sur le site

## 🚀 Fonctionnalités disponibles

Une fois configuré, vous aurez accès à :

- ✅ Catalogue complet des formations depuis Shopify
- ✅ Filtres par catégorie, secteur et niveau
- ✅ Recherche en temps réel
- ✅ Tri personnalisé
- ✅ Vues Grid et List
- ✅ Affichage des prix
- ✅ Pages de détail par formation
- ✅ Ajout au panier Shopify (à configurer)

## 📞 Support

Pour toute question sur la configuration Shopify :
- Documentation Shopify : https://shopify.dev/docs/api/admin-rest
- Metafields : https://shopify.dev/docs/apps/custom-data/metafields
- Support ACT : contact@africacentredtechnology.com

## 🎯 Prochaines étapes

1. Configurer les métadonnées dans Shopify
2. Ajouter vos premières formations
3. Tester l'affichage sur le site
4. Configurer le panier et le checkout
5. Ajouter des collections de formations (optionnel)
