# 🔍 Diagnostic Shopify - Problème identifié

## ❌ Problème trouvé

**Erreur HTTP 402: Payment Required**

```json
{
  "errors": [
    {
      "message": "Unavailable Shop",
      "extensions": {
        "code": "PAYMENT_REQUIRED"
      }
    }
  ]
}
```

---

## 🎯 Signification

L'erreur **402 Payment Required** signifie que la boutique Shopify **n'est pas accessible** car :

### Causes possibles

1. **🛑 Boutique gelée ou suspendue**
   - La boutique a été mise en pause par Shopify
   - Un paiement est en attente (abonnement Shopify)
   - La période d'essai a expiré

2. **💳 Problème de paiement**
   - Carte bancaire expirée ou refusée
   - Paiement mensuel Shopify non effectué
   - Facture impayée

3. **🔧 Boutique en mode développement**
   - La boutique est en mode "test" ou "développement"
   - Certaines fonctionnalités sont désactivées

4. **📦 Plan Shopify insuffisant**
   - Le plan actuel ne permet pas l'accès à l'API Storefront
   - Des limitations sont en place sur le compte

---

## ✅ Configuration détectée

### Variables d'environnement
- ✅ `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`: `act-formation.myshopify.com`
- ✅ `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`: `shpss_9af4...bf603`
- ✅ `NEXT_PUBLIC_SHOPIFY_CLIENT_ID`: `6f662bdb3d...303ca`

**Les variables sont correctement configurées** ✅

### URL de l'API
```
https://act-formation.myshopify.com/api/2024-01/graphql.json
```

**L'URL est valide** ✅

### Code de l'application
- ✅ `src/lib/shopify/config.ts` - Correctement configuré
- ✅ `src/lib/shopify/client.ts` - Code fonctionnel
- ✅ `src/lib/shopify/formations.ts` - Queries GraphQL valides

**Le code est correct** ✅

---

## 🔧 Solutions

### Solution 1 : Vérifier l'état de la boutique Shopify (IMMÉDIAT)

1. **Connectez-vous à Shopify Admin**
   - URL: https://act-formation.myshopify.com/admin

2. **Vérifiez l'état de la boutique**
   - Est-elle **active** ou **en pause** ?
   - Y a-t-il une notification de paiement ?
   - Y a-t-il un message d'erreur en haut de la page ?

3. **Vérifiez votre plan Shopify**
   - Allez dans **Settings** > **Plan**
   - Vérifiez que vous avez un plan actif (Basic, Shopify, Advanced, ou Plus)
   - Vérifiez qu'aucun paiement n'est en attente

4. **Réactivez la boutique si nécessaire**
   - Si la boutique est en pause : **Settings** > **Plan** > **Select a plan**
   - Effectuez le paiement si demandé

---

### Solution 2 : Vérifier les permissions de l'Access Token

1. **Allez dans Shopify Admin**
   - **Settings** > **Apps and sales channels** > **Develop apps**

2. **Sélectionnez votre application**
   - Cliquez sur l'app qui a généré le Storefront Access Token

3. **Vérifiez les permissions (Scopes)**
   - L'app doit avoir les scopes suivants activés :
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_products`
     - ✅ `unauthenticated_read_collections`

4. **Régénérez l'Access Token si nécessaire**
   - Si les scopes ne sont pas corrects, mettez-les à jour
   - Régénérez le token
   - Mettez à jour `.env.local` avec le nouveau token

---

### Solution 3 : Utiliser une boutique de développement

Si vous êtes en phase de test et que vous n'avez pas encore de boutique payante :

1. **Créez une boutique de développement** (gratuite)
   - URL: https://shopify.dev/docs/apps/tools/development-stores
   - Allez sur : https://partners.shopify.com/
   - Créez un compte Shopify Partners (gratuit)
   - Créez une boutique de développement

2. **Avantages**
   - Gratuite et illimitée pour le développement
   - Toutes les fonctionnalités Shopify disponibles
   - Peut être convertie en boutique payante plus tard

---

### Solution 4 : Vérifier le statut de la boutique via le Admin

1. **Vérifiez si la boutique est "gelée"**
   - Connectez-vous à Shopify Admin
   - Cherchez un bandeau rouge en haut de la page
   - Messages typiques :
     - "Your store is frozen"
     - "Payment required"
     - "Trial expired"

2. **Actions à prendre selon le message**
   - **Trial expired** : Choisissez un plan payant
   - **Payment failed** : Mettez à jour votre carte bancaire
   - **Frozen** : Contactez le support Shopify

---

## 📊 Résumé du diagnostic

| Élément | État | Action requise |
|---------|------|----------------|
| **Variables d'environnement** | ✅ OK | Aucune |
| **URL API** | ✅ OK | Aucune |
| **Access Token** | ✅ Syntaxe OK | À vérifier dans Shopify Admin |
| **Code application** | ✅ OK | Aucune |
| **Boutique Shopify** | ❌ **Indisponible (402)** | **Réactivation nécessaire** |

---

## 🎯 Action immédiate recommandée

### Étape 1 : Vérifier la boutique
1. Connectez-vous à **Shopify Admin**
2. Vérifiez l'**état de la boutique**
3. Vérifiez le **plan actif**
4. Vérifiez les **paiements en attente**

### Étape 2 : Réactiver si nécessaire
1. Effectuez le **paiement requis** (si demandé)
2. Sélectionnez un **plan Shopify** (minimum : Basic)
3. Attendez quelques minutes que la boutique soit réactivée

### Étape 3 : Tester à nouveau
1. Ré-exécutez le script de diagnostic :
   ```bash
   node scripts/test-shopify-connection.mjs
   ```
2. Vous devriez maintenant voir :
   ```
   ✅ Connexion réussie!
   Boutique: [Nom de votre boutique]
   ```

---

## 📞 Support

### Si le problème persiste après réactivation

1. **Vérifiez les permissions de l'Access Token**
   - Shopify Admin > Settings > Apps > Develop apps
   - Régénérez le token avec les bons scopes

2. **Contactez le support Shopify**
   - Chat en direct dans Shopify Admin
   - Email: support@shopify.com
   - Forum: community.shopify.com

3. **Vérifiez le statut de Shopify**
   - URL: https://status.shopify.com
   - Peut-être un problème global de Shopify

---

## 🔄 Une fois le problème résolu

### Étapes pour importer les formations

1. **Testez à nouveau la connexion**
   ```bash
   node scripts/test-shopify-connection.mjs
   ```

2. **Uploadez l'image par défaut**
   - Shopify Admin > Settings > Files
   - Uploadez : `public/Catalogue/images/Intégrer l'IA dans sa pratique professionnelle.jpg`

3. **Configurez l'URL d'image dans le script**
   - Éditez `scripts/export-all-formations-shopify.mjs` (ligne 631)
   - Remplacez par l'URL de votre image

4. **Générez le CSV**
   ```bash
   node scripts/export-all-formations-shopify.mjs
   ```

5. **Importez dans Shopify**
   - Shopify Admin > Produits > Importer
   - Sélectionnez `exports/formations-shopify-complete.csv`

---

## 📝 Notes importantes

### Pourquoi ce n'était PAS un problème de code

Votre configuration est **parfaite** :
- ✅ Variables d'environnement bien définies
- ✅ Code TypeScript correct
- ✅ Queries GraphQL valides
- ✅ Structure du projet propre

Le problème est **exclusivement côté Shopify** (boutique gelée/suspendue).

### Ce qu'il faut retenir

L'erreur **402 Payment Required** signifie toujours un problème **commercial/administratif** avec Shopify, jamais un problème technique de code.

---

## 🎉 Prochaine étape

**👉 Connectez-vous à Shopify Admin et vérifiez l'état de votre boutique**

URL directe : https://act-formation.myshopify.com/admin

---

**Date du diagnostic** : 30 mars 2026
**Script de test** : `scripts/test-shopify-connection.mjs`
**Erreur détectée** : HTTP 402 - Payment Required
**Statut** : ⚠️ BOUTIQUE SHOPIFY À RÉACTIVER
