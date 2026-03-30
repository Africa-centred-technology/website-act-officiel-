# 🔓 Solution - Essai gratuit Shopify 3 jours

## ❓ Pourquoi l'erreur 402 avec un essai gratuit ?

Avec un **essai gratuit de 3 jours**, Shopify impose des **restrictions importantes** :

### 🚫 Limitations de l'essai gratuit

1. **❌ Storefront API désactivée par défaut**
   - L'API Storefront (utilisée pour afficher les produits sur un site externe) n'est PAS accessible pendant l'essai
   - Seule l'API Admin est disponible (limitée)

2. **❌ Canal de vente "Online Store" désactivé**
   - La boutique en ligne n'est pas publiée pendant l'essai
   - Les produits ne sont pas visibles via l'API Storefront

3. **❌ Mot de passe sur la boutique**
   - Un mot de passe protège la boutique pendant l'essai
   - Empêche l'accès public (et donc l'API Storefront)

4. **⚠️ Code HTTP 402 trompeur**
   - Le code d'erreur suggère un problème de paiement
   - En réalité, c'est une restriction de l'essai gratuit

---

## ✅ SOLUTIONS

### Solution 1 : Boutique de développement Shopify Partners (RECOMMANDÉ - GRATUIT)

C'est la **meilleure solution** pour le développement :

#### Avantages
- ✅ **Totalement gratuite** et illimitée
- ✅ **Toutes les fonctionnalités Shopify** disponibles
- ✅ **API Storefront complète** fonctionnelle
- ✅ Pas de limite de temps
- ✅ Peut être convertie en boutique payante plus tard

#### Comment créer une boutique de développement

**Étape 1 : Créer un compte Shopify Partners**
1. Allez sur : https://partners.shopify.com/signup
2. Remplissez le formulaire (gratuit, aucune carte bancaire requise)
3. Confirmez votre email

**Étape 2 : Créer une boutique de développement**
1. Connectez-vous à Shopify Partners
2. Allez dans **Stores** (menu de gauche)
3. Cliquez sur **Add store** > **Development store**
4. Remplissez :
   - **Store name** : `act-formation-dev` (ou autre)
   - **Store purpose** : Choisissez "Test an app or theme"
   - **Store type** : "Development store"
5. Cliquez sur **Save**

**Étape 3 : Créer un nouveau Storefront Access Token**
1. Dans votre nouvelle boutique de développement, allez dans **Settings** > **Apps and sales channels**
2. Cliquez sur **Develop apps**
3. Cliquez sur **Create an app**
4. Nommez-la : "ACT Formations App"
5. Allez dans **Configuration** > **Storefront API**
6. Activez les scopes :
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_products`
   - ✅ `unauthenticated_read_collections`
7. Cliquez sur **Save**
8. Allez dans l'onglet **API credentials**
9. Copiez le **Storefront access token**

**Étape 4 : Mettre à jour .env.local**
```env
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_NOUVEAU_TOKEN_ICI
NEXT_PUBLIC_SHOPIFY_CLIENT_ID=NOUVEAU_CLIENT_ID_ICI
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=votre-boutique-dev.myshopify.com
```

**Étape 5 : Redémarrer votre serveur**
```bash
# Arrêtez votre serveur (Ctrl+C)
# Puis redémarrez
npm run dev
```

**Étape 6 : Tester la connexion**
```bash
node scripts/test-shopify-connection.mjs
```

**Résultat attendu** :
```
✅ Connexion réussie!
   Boutique: ACT Formations Dev
```

---

### Solution 2 : Activer l'accès à votre boutique d'essai (TEMPORAIRE)

Si vous voulez continuer avec votre boutique d'essai actuelle :

#### Option A : Retirer le mot de passe de la boutique

**⚠️ Attention** : Cela rendra votre boutique publique pendant l'essai

1. **Shopify Admin** > **Online Store** > **Preferences**
2. Descendez jusqu'à **Password protection**
3. **Décochez** "Restrict access with password"
4. Cliquez sur **Save**

Puis testez à nouveau la connexion.

#### Option B : Utiliser le Sales Channel API

Remplacer l'API Storefront par l'API Admin (plus complexe, non recommandé pour l'essai).

---

### Solution 3 : Passer à un plan payant (1$ pour 3 mois)

Shopify propose souvent une **offre spéciale** :

1. **Shopify Admin** > **Settings** > **Plan**
2. Choisissez le plan **Basic** (ou autre)
3. Cherchez l'offre "**$1 for 3 months**" (si disponible)
4. Activez le plan

**Coût** : 1$ pour les 3 premiers mois, puis ~39$/mois

**Avantages** :
- ✅ API Storefront complète
- ✅ Toutes les fonctionnalités
- ✅ Pas de restrictions

---

## 🎯 RECOMMANDATION

### Pour le développement (maintenant)
👉 **Utilisez la Solution 1 : Boutique de développement Shopify Partners**

**Pourquoi ?**
- Gratuite et illimitée
- Toutes les fonctionnalités
- Parfaite pour le développement et les tests
- Temps de setup : 10 minutes

### Pour la production (plus tard)
Quand votre site sera prêt, vous pourrez :
1. Soit **convertir** la boutique de développement en boutique payante
2. Soit **migrer** les données vers votre boutique d'essai actuelle une fois activée

---

## 🔧 Étapes détaillées - Créer une boutique de développement

### 1. Inscription Shopify Partners (2 minutes)

```
URL: https://partners.shopify.com/signup

Informations requises:
• Email
• Mot de passe
• Pays
• Type de partenaire : "I'm a developer"
```

### 2. Création de la boutique (3 minutes)

```
Dans Shopify Partners Dashboard:
1. Stores > Add store
2. Sélectionnez "Development store"
3. Remplissez:
   - Name: act-formation-dev
   - Purpose: Test an app or theme
   - Store type: Development store
4. Save
```

### 3. Configuration de l'app (3 minutes)

```
Dans la nouvelle boutique:
1. Settings > Apps and sales channels > Develop apps
2. Create an app: "ACT Formations"
3. Configuration > Storefront API
4. Activer les 3 scopes:
   ✅ unauthenticated_read_product_listings
   ✅ unauthenticated_read_products
   ✅ unauthenticated_read_collections
5. Save
6. API credentials > Copier le Storefront access token
```

### 4. Mise à jour du projet (2 minutes)

**Fichier : `.env.local`**
```env
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_VOTRE_NOUVEAU_TOKEN
NEXT_PUBLIC_SHOPIFY_CLIENT_ID=VOTRE_NOUVEAU_CLIENT_ID
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=act-formation-dev.myshopify.com
```

**Terminal :**
```bash
# Redémarrer le serveur
npm run dev

# Tester la connexion
node scripts/test-shopify-connection.mjs
```

---

## 📊 Comparaison des solutions

| Solution | Coût | Temps setup | API complète | Recommandé |
|----------|------|-------------|--------------|------------|
| **Boutique Partners** | **Gratuit** | **10 min** | **✅ Oui** | **⭐ OUI** |
| Retirer mot de passe | Gratuit | 2 min | ⚠️ Limité | Non (temporaire) |
| Plan payant ($1) | 1$/3 mois | 5 min | ✅ Oui | Si production imminente |

---

## 🎉 Une fois la boutique de développement créée

Vous pourrez :

1. **Importer vos formations**
   ```bash
   node scripts/export-all-formations-shopify.mjs
   ```
   Puis importer le CSV dans Shopify Admin

2. **Tester l'API**
   ```bash
   node scripts/test-shopify-connection.mjs
   ```
   Résultat : ✅ 16 formations trouvées

3. **Afficher sur votre site**
   - L'API fonctionnera
   - Les formations s'afficheront
   - Tout sera opérationnel

---

## 📞 Besoin d'aide ?

### Documentation Shopify Partners
- Guide : https://shopify.dev/docs/apps/tools/development-stores
- FAQ : https://partners.shopify.com/organizations

### Support
Si vous rencontrez un problème lors de la création de la boutique de développement, contactez le support Shopify Partners (gratuit).

---

## ✅ Checklist de migration vers boutique de développement

- [ ] Créer un compte Shopify Partners
- [ ] Créer une boutique de développement
- [ ] Créer une app avec permissions Storefront API
- [ ] Copier le nouveau Storefront access token
- [ ] Mettre à jour `.env.local` avec les nouvelles valeurs
- [ ] Redémarrer le serveur (`npm run dev`)
- [ ] Tester la connexion (`node scripts/test-shopify-connection.mjs`)
- [ ] Uploader l'image de formation
- [ ] Configurer l'URL d'image dans le script
- [ ] Générer le CSV des formations
- [ ] Importer le CSV dans Shopify
- [ ] Vérifier que les formations s'affichent sur le site

---

**Temps total estimé : 15-20 minutes**

**Résultat : Une boutique Shopify gratuite et entièrement fonctionnelle pour votre développement** ✅

---

**Date** : 30 mars 2026
**Problème** : Erreur 402 avec essai gratuit
**Solution** : Boutique de développement Shopify Partners (gratuite)
**Statut** : 🚀 PRÊT À IMPLÉMENTER
