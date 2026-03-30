# 🖼️ Guide rapide - Ajouter l'image par défaut aux formations Shopify

## ⚠️ Problème rencontré

Lors de l'import du CSV dans Shopify, vous avez reçu l'erreur :
```
Missing image source data
```

Cela signifie que Shopify exige qu'une URL d'image valide soit fournie dans la colonne "Image Src" du CSV.

---

## ✅ Solution en 4 étapes

### Étape 1: Uploader l'image dans Shopify

1. **Connectez-vous à Shopify Admin**
2. Allez dans **Settings** (Paramètres) > **Files** (Fichiers)
3. Cliquez sur **Upload files** (Télécharger des fichiers)
4. Sélectionnez l'image :
   ```
   C:\Users\ASUS\Desktop\ACT\Site web\website-act-officiel-\public\Catalogue\images\Intégrer l'IA dans sa pratique professionnelle.jpg
   ```
5. Attendez que l'upload se termine

### Étape 2: Copier l'URL de l'image

1. Une fois l'image uploadée, **cliquez dessus** dans la liste des fichiers
2. Copiez l'URL complète qui apparaît, par exemple :
   ```
   https://cdn.shopify.com/s/files/1/0757/3015/7705/files/formation-ia.jpg
   ```
3. **Gardez cette URL** (collez-la dans un notepad temporairement)

### Étape 3: Configurer le script

1. Ouvrez le fichier du script :
   ```
   scripts/export-all-formations-shopify.mjs
   ```

2. Trouvez la ligne 631 qui contient :
   ```javascript
   const IMAGE_URL_SHOPIFY = 'https://cdn.shopify.com/s/files/1/0757/3015/7705/files/formation-ia-default.jpg';
   ```

3. **Remplacez l'URL** par celle que vous avez copiée à l'étape 2 :
   ```javascript
   const IMAGE_URL_SHOPIFY = 'https://cdn.shopify.com/s/files/1/0757/3015/7705/files/votre-image.jpg';
   ```

4. Sauvegardez le fichier

### Étape 4: Régénérer le CSV et importer

1. **Ré-exécutez le script** pour régénérer le CSV avec l'image :
   ```bash
   node scripts/export-all-formations-shopify.mjs
   ```

2. Le nouveau fichier `exports/formations-shopify-complete.csv` contiendra maintenant l'URL de l'image

3. **Importez le CSV** dans Shopify :
   - Shopify Admin > **Produits** > **Importer**
   - Sélectionnez le nouveau CSV
   - Lancez l'import

4. Cette fois, l'import devrait réussir ! ✅

---

## 🎯 Résultat attendu

Après avoir suivi ces étapes :
- ✅ Les 16 formations seront importées avec succès
- ✅ Chaque formation aura la même image par défaut
- ✅ Plus d'erreur "Missing image source data"

---

## 🔄 Pour utiliser des images différentes par formation

Si vous souhaitez que chaque formation ait sa propre image :

### Option 1: Avant l'import (recommandé)
1. Uploadez toutes les images dans Shopify > Settings > Files
2. Modifiez le script pour mapper chaque formation à son image
3. Régénérez le CSV

### Option 2: Après l'import
1. Importez d'abord toutes les formations avec l'image par défaut
2. Ensuite, éditez chaque produit manuellement dans Shopify pour changer l'image

---

## 📝 Exemple complet

### Avant (ligne 631 du script) :
```javascript
const IMAGE_URL_SHOPIFY = 'https://cdn.shopify.com/s/files/1/0757/3015/7705/files/formation-ia-default.jpg';
```

### Après avoir uploadé votre image :
```javascript
const IMAGE_URL_SHOPIFY = 'https://cdn.shopify.com/s/files/1/0757/3015/7705/files/Integrer-IA-pratique-professionnelle.jpg';
```

---

## ❓ FAQ

### Q: L'image doit-elle être au format JPG ?
**R**: Non, Shopify accepte JPG, PNG, GIF et WEBP. Votre image JPG est parfaite.

### Q: Quelle taille d'image recommandez-vous ?
**R**:
- **Minimum**: 800x800px
- **Recommandé**: 1200x1200px ou 1200x800px
- **Maximum**: 4472x4472px

### Q: Puis-je utiliser une URL externe (non Shopify) ?
**R**: Non, Shopify exige que l'image soit hébergée sur son CDN pour des raisons de performance et sécurité.

### Q: Combien d'images puis-je uploader gratuitement ?
**R**: Shopify offre un stockage illimité pour les images de produits (selon votre plan).

### Q: L'image sera-t-elle la même pour toutes les formations ?
**R**: Oui, avec la configuration actuelle. Mais vous pouvez facilement modifier chaque produit après l'import pour utiliser des images différentes.

---

## 🎨 Conseil bonus

Pour une meilleure présentation, créez plusieurs images spécifiques par catégorie :
- `formation-ia-generale.jpg` (pour les formations IA transversales)
- `formation-it.jpg` (pour les formations IT & Technique)
- `formation-education.jpg` (pour les formations Éducation)
- `formation-sante.jpg` (pour la formation Santé)
- etc.

Puis modifiez le script pour assigner l'image selon le secteur de la formation.

---

## 📞 Besoin d'aide ?

Si vous rencontrez des difficultés :
1. Vérifiez que l'URL copiée est complète (commence par `https://`)
2. Vérifiez qu'il n'y a pas d'espaces avant/après l'URL dans le script
3. Ré-exécutez le script après chaque modification
4. Consultez la documentation Shopify sur les images : https://help.shopify.com/fr/manual/products/product-media

---

**Temps estimé pour cette opération** : 5-10 minutes

**Dernière mise à jour** : 30 mars 2026
