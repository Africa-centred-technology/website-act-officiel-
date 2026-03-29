# ✅ Intégration Shopify - Catalogue de Formations ACT

## 🎉 Installation Complétée !

L'intégration Shopify pour votre catalogue de formations est maintenant prête à être utilisée.

---

## 📁 Fichiers créés

### Configuration
- ✅ `.env.local` - Variables d'environnement Shopify
- ✅ `src/lib/shopify/config.ts` - Configuration centralisée
- ✅ `src/lib/shopify/client.ts` - Client API GraphQL
- ✅ `src/lib/shopify/formations.ts` - Fonctions spécifiques formations
- ✅ `src/lib/shopify/index.ts` - Point d'entrée

### Composants React
- ✅ `src/hooks/useShopifyFormations.ts` - Hooks React
- ✅ `src/components/formations/FormationsShellShopify.tsx` - Catalogue complet
- ✅ `src/components/shopify/ShopifyProductsExample.tsx` - Exemple produits
- ✅ `src/app/formations-shopify/page.tsx` - Page d'exemple

### Documentation
- ✅ `SHOPIFY_INTEGRATION.md` - Guide général Shopify
- ✅ `SHOPIFY_FORMATIONS_SETUP.md` - Configuration formations détaillée
- ✅ `README_SHOPIFY_FORMATIONS.md` - Vue d'ensemble
- ✅ `INTEGRATION_COMPLETE.md` - Ce fichier

---

## 🚀 Prochaines étapes



#### b) Vérifier les identifiants
Vos identifiants sont déjà configurés :
- ✅ Storefront Access Token: `VOTRE_TOKEN_ICI`
- ✅ Client ID: `VOTRE_CLIENT_ID_ICI`

### 2. Configurer les formations dans Shopify

Suivez **TOUTES** les étapes de `SHOPIFY_FORMATIONS_SETUP.md` :

#### Étape 1 : Taguer les produits
- Ajoutez le tag `formation` à tous vos produits de formation

#### Étape 2 : Créer les métadonnées (metafields)
Dans **Shopify Admin** > **Paramètres** > **Métadonnées personnalisées** > **Produits**

Créez ces 13 définitions :

| Clé | Type |
|-----|------|
| `secteur` | Texte sur une ligne |
| `categorie` | Texte sur une ligne |
| `niveau` | Texte sur une ligne |
| `duree` | Texte sur une ligne |
| `format` | Texte sur une ligne |
| `parcours` | Texte sur une ligne |
| `accroche` | Texte multiligne |
| `public_cible` | Texte multiligne |
| `prerequis` | Texte multiligne |
| `objectifs` | JSON |
| `programme` | JSON |
| `livrables` | JSON |
| `methode` | Texte multiligne |

#### Étape 3 : Ajouter vos formations
Pour chaque formation :
1. Créez un nouveau produit
2. Ajoutez le tag `formation`
3. Remplissez tous les metafields
4. Définissez le prix
5. Ajoutez une image (optionnel)

### 3. Tester l'intégration

#### Option A : Page de test
```bash
# Accédez à la page de test
http://localhost:3000/formations-shopify
```

#### Option B : Remplacer la page actuelle
Renommez le fichier :
```bash
# De :
src/app/formations-shopify/page.tsx

# Vers :
src/app/formations/page.tsx
```

### 4. Vérification

✅ Checklist de validation :

- [ ] Le domaine Shopify est configuré dans `.env.local`
- [ ] Les métadonnées sont créées dans Shopify
- [ ] Au moins 1 formation est créée avec le tag "formation"
- [ ] Tous les metafields sont remplis pour cette formation
- [ ] Le prix est configuré
- [ ] La page `/formations-shopify` affiche la formation
- [ ] Les filtres fonctionnent correctement
- [ ] La recherche fonctionne
- [ ] Le passage Grid/List fonctionne

---

## 📊 Exemple de formation dans Shopify

### Produit
```
Titre: Intégrer l'IA dans sa pratique professionnelle
Handle: ia-productivite-quotidienne
Prix: 500.00 EUR
Tags: formation
Description: L'IA est déjà dans vos outils...
```

### Metafields
```
secteur: "Transversal — tous métiers"
categorie: "Intelligence artificielle"
niveau: "Initiation"
duree: "1 journée (7h)"
format: "Présentiel ou distanciel"

objectifs (JSON):
[
  "Comprendre ce que l'IA générative peut faire",
  "Identifier les cas d'usage pertinents",
  "Utiliser les principaux outils IA disponibles"
]

programme (JSON):
[
  {
    "module": "Module 1 — Comprendre l'IA (1h)",
    "details": [
      "Qu'est-ce que l'IA générative ?",
      "Les grands modèles de langage"
    ]
  }
]

livrables (JSON):
[
  "Plan d'intégration personnalisé",
  "Bibliothèque de prompts",
  "Attestation ACT"
]
```

---

## 🎯 Utilisation dans le code

### Hook de base
```tsx
import { useShopifyFormations } from '@/hooks/useShopifyFormations';

function MonComposant() {
  const { formations, loading, error } = useShopifyFormations();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div>
      {formations.map(f => (
        <div key={f.id}>
          <h3>{f.title}</h3>
          <p>{f.prix}</p>
        </div>
      ))}
    </div>
  );
}
```

### Récupérer une formation spécifique
```tsx
import { useShopifyFormation } from '@/hooks/useShopifyFormations';

function DetailFormation({ slug }: { slug: string }) {
  const { formation, loading, error } = useShopifyFormation(slug);

  if (loading) return <p>Chargement...</p>;
  if (!formation) return <p>Formation non trouvée</p>;

  return (
    <div>
      <h1>{formation.title}</h1>
      <p>{formation.accroche}</p>
      <p>Prix: {formation.prix}</p>
    </div>
  );
}
```

### Fonctions serveur (API)
```tsx
import { getFormationsFromShopify, getFormationBySlug } from '@/lib/shopify/formations';

// Dans un Server Component ou API Route
export async function GET() {
  const formations = await getFormationsFromShopify(50);
  return Response.json(formations);
}
```

---

## 🔄 Migration depuis données statiques

Vous avez actuellement des formations dans `src/lib/data/formations.ts`.

### Recommandation : Migration progressive

1. **Phase 1** : Tester avec `/formations-shopify`
2. **Phase 2** : Ajouter toutes vos formations dans Shopify
3. **Phase 3** : Remplacer la page `/formations` principale
4. **Phase 4** : Garder `formations.ts` comme backup

---

## ⚠️ Problèmes courants

### "Shopify n'est pas configuré"
➡️ Vérifiez `.env.local` et redémarrez le serveur de dev

### "Aucune formation trouvée"
➡️ Vérifiez le tag "formation" sur vos produits Shopify

### "Erreur GraphQL"
➡️ Vérifiez votre Storefront Access Token

### Métadonnées vides
➡️ Vérifiez que vous utilisez le namespace "custom"

### Redémarrer après modification .env
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
# ou
bun dev
```

---

## 📞 Ressources & Support

### Documentation
- 📖 `SHOPIFY_INTEGRATION.md` - Guide général
- 📖 `SHOPIFY_FORMATIONS_SETUP.md` - Config formations
- 📖 `README_SHOPIFY_FORMATIONS.md` - Vue d'ensemble

### Liens externes
- 🔗 [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- 🔗 [Metafields Guide](https://shopify.dev/docs/apps/custom-data/metafields)
- 🔗 [GraphQL Explorer](https://shopify.dev/docs/apps/tools/graphiql-admin-api)

### Support ACT
- 📧 contact@africacentredtechnology.com

---

## ✨ Fonctionnalités futures

Une fois l'intégration de base fonctionnelle, vous pouvez ajouter :

- 🛒 Panier Shopify intégré
- 💳 Checkout direct depuis le site
- 📧 Notifications email personnalisées
- 🎫 Codes promo et réductions
- 📊 Tracking des inscriptions
- 🔄 Synchronisation automatique
- 📱 Application mobile avec même API
- 🌍 Multi-langues via Shopify Markets

---

## 🎓 Prochaine action immédiate

1. **Ouvrez** `SHOPIFY_FORMATIONS_SETUP.md`
2. **Suivez** toutes les étapes de configuration
3. **Ajoutez** votre première formation dans Shopify
4. **Testez** sur `/formations-shopify`

**Temps estimé : 30-60 minutes pour la première formation** ⏱️

---

**Bonne chance avec votre catalogue de formations ! 🚀**

---

*Documentation créée le : ${new Date().toLocaleDateString('fr-FR')}*
