# Guide d'import des formations ACT dans Shopify

## 📋 Vue d'ensemble

Ce guide explique comment importer les **16 formations ACT** dans votre boutique Shopify à partir du fichier CSV généré.

---

## 🎯 Fichier généré

**Emplacement**: `exports/formations-shopify-complete.csv`

**Contenu**:
- 16 formations complètes avec toutes leurs métadonnées
- Format compatible 100% avec l'import Shopify
- Colonnes alignées sur le format `products_export_1.csv`

---

## 📊 Structure du CSV

### Colonnes principales
| Colonne | Valeur | Description |
|---------|--------|-------------|
| **Handle** | `ia-productivite-quotidienne` | Identifiant unique URL-friendly |
| **Title** | Nom de la formation | Titre affiché |
| **Vendor** | `Act-formation` | Fournisseur/marque |
| **Product Category** | `Services > Professional Services > IT & Technology` | Catégorie Shopify |
| **Type** | `F` | Type de produit (F = Formation) |
| **Published** | `true` | Publié immédiatement |
| **Variant SKU** | ID unique | Référence interne |
| **Variant Price** | Prix en EUR | Prix de la formation |

### Metafields personnalisés (7 champs)
| Metafield | Type | Exemple |
|-----------|------|---------|
| `duree` | Texte simple | `7` (heures) |
| `format` | Texte simple | `Présentiel ou distanciel` |
| `methode` | Texte multi-ligne | Description de la pédagogie |
| `niveau` | Texte simple | `Initiation`, `Intermédiaire`, `Avancé` |
| `prerequis` | Texte multi-ligne | Conditions d'accès |
| `public_cible` | Texte multi-ligne | Profils visés |
| `secteur` | Texte simple | Secteur d'activité |

---

## 🚀 Étapes d'import dans Shopify

### 1️⃣ Préparation du fichier (OPTIONNEL)

Si vous souhaitez ajouter des images aux formations :

1. Ouvrez `formations-shopify-complete.csv` dans Excel/LibreOffice
2. Remplissez la colonne **"Image Src"** avec les URLs de vos images
   - Format: `https://cdn.shopify.com/s/files/1/0757/3015/7705/files/nom-image.png`
3. Sauvegardez le fichier

> ⚠️ **Important**: Les images doivent d'abord être uploadées dans Shopify (Settings > Files)

### 2️⃣ Import dans Shopify Admin

1. Connectez-vous à votre **Shopify Admin**
2. Allez dans **Produits** (menu de gauche)
3. Cliquez sur **Importer** (bouton en haut à droite)
4. Sélectionnez le fichier `formations-shopify-complete.csv`
5. Configurez les options d'import :
   - ✅ **Écraser les produits existants avec le même handle**
   - ✅ **Publier les nouveaux produits**
6. Cliquez sur **Continuer l'import**
7. Attendez la fin du traitement (quelques minutes)

### 3️⃣ Vérification après import

Une fois l'import terminé, vérifiez :

1. **Nombre de produits**: 16 formations doivent apparaître
2. **Metafields**: Allez dans un produit > "Metafields" (section en bas)
   - Vous devriez voir 7 metafields personnalisés remplis
3. **Prix**: Vérifiez que les prix sont corrects
4. **Statut**: Toutes les formations doivent être **actives**

---

## 🔧 Configuration des metafields dans Shopify

Si les metafields ne s'affichent pas automatiquement, configurez-les manuellement :

### Étapes de configuration

1. **Shopify Admin** > **Settings** > **Custom data** > **Products**
2. Cliquez sur **Add definition** pour chaque metafield :

| Nom | Namespace.Key | Type | Description |
|-----|---------------|------|-------------|
| Durée | `custom.duree` | Single line text | Durée de la formation |
| Format | `custom.format` | Single line text | Format (présentiel/distanciel) |
| Méthode | `custom.methode` | Multi-line text | Méthode pédagogique |
| Niveau | `custom.niveau` | Single line text | Niveau requis |
| Prérequis | `custom.prerequis` | Multi-line text | Prérequis techniques |
| Public cible | `custom.public_cible` | Multi-line text | Public visé |
| Secteur | `custom.secteur` | Single line text | Secteur d'activité |

3. Sauvegardez chaque définition

---

## 📈 Utilisation des formations dans votre site

### Option 1: API Storefront (déjà configurée)

Vous avez déjà configuré l'intégration Shopify dans votre site :

```typescript
// src/lib/shopify/formations.ts
export async function getFormationsFromShopify() {
  // Récupère toutes les formations depuis Shopify
}
```

**Composant prêt**: `src/components/formations/FormationsShellShopify.tsx`

### Option 2: Affichage dans le thème Shopify

Si vous utilisez un thème Shopify pour afficher les formations :

1. Créez une collection **"Formations"**
2. Ajoutez toutes les formations à cette collection
3. Personnalisez le template de produit pour afficher les metafields

**Exemple de code Liquid** :
```liquid
<h3>Durée</h3>
<p>{{ product.metafields.custom.duree }}</p>

<h3>Format</h3>
<p>{{ product.metafields.custom.format }}</p>

<h3>Niveau</h3>
<p>{{ product.metafields.custom.niveau }}</p>
```

---

## 🎨 Ajout d'images aux formations

### Méthode recommandée

1. **Préparez vos images**:
   - Format: PNG ou JPG
   - Taille recommandée: 1200x800px
   - Nommage: `formation-nom-slug.png`

2. **Upload dans Shopify**:
   - **Settings** > **Files**
   - Cliquez sur **Upload files**
   - Sélectionnez toutes vos images

3. **Copiez les URLs**:
   - Chaque image uploadée a une URL type:
   - `https://cdn.shopify.com/s/files/1/XXXX/XXXX/XXXX/files/image.png`

4. **Associez aux produits**:
   - Manuellement: Éditez chaque produit et ajoutez l'image
   - Ou via CSV: Remplissez la colonne "Image Src" et ré-importez

---

## 🛠️ Script de mise à jour

Pour re-générer le CSV avec de nouvelles formations :

```bash
# Modifiez src/lib/data/formations.ts avec les nouvelles formations
# Puis exécutez :
node scripts/export-all-formations-shopify.mjs
```

Le fichier `formations-shopify-complete.csv` sera mis à jour.

---

## ❓ FAQ

### Q: Puis-je importer seulement quelques formations ?
**R**: Oui, supprimez les lignes non désirées du CSV avant l'import.

### Q: Les prix sont-ils en EUR ?
**R**: Oui, mais Shopify les convertira selon la devise de votre boutique.

### Q: Que faire si l'import échoue ?
**R**:
1. Vérifiez le format du CSV (virgules correctes)
2. Assurez-vous que les handles sont uniques
3. Consultez les logs d'erreur dans Shopify Admin

### Q: Comment modifier une formation après import ?
**R**:
- Méthode 1: Directement dans Shopify Admin
- Méthode 2: Modifiez le CSV et ré-importez avec "Écraser les produits existants"

### Q: Les metafields sont-ils visibles dans le thème ?
**R**: Non par défaut. Vous devez modifier le template Liquid de votre thème ou utiliser l'API Storefront.

---

## 📞 Support

Pour toute question sur l'import :
- Documentation Shopify: https://help.shopify.com/fr/manual/products/import-export
- Support ACT: contact@act-formation.com

---

## ✅ Checklist finale

- [ ] CSV généré : `exports/formations-shopify-complete.csv`
- [ ] Images préparées et uploadées (optionnel)
- [ ] Import réalisé dans Shopify Admin
- [ ] 16 formations visibles dans Produits
- [ ] Metafields configurés et remplis
- [ ] Prix vérifiés
- [ ] Formations publiées (status: active)
- [ ] Test d'affichage sur le site

---

**Dernière mise à jour**: 30 mars 2026
**Version du script**: 1.0
