/**
 * Page catalogue de formations (version Shopify)
 *
 * Cette page récupère les formations depuis la boutique Shopify
 * Pour l'utiliser comme page principale, renommez ce fichier en :
 * src/app/formations/page.tsx
 */

import FormationsShellShopify from '@/components/formations/FormationsShellShopify';

export const metadata = {
  title: 'Catalogue de Formations | ACT - Africa Centre of Technology',
  description: 'Découvrez notre catalogue complet de formations professionnelles pour accélérer votre transformation digitale.',
};

export default function FormationsShopifyPage() {
  return <FormationsShellShopify />;
}
