/**
 * /api/odoo/inscription
 *
 * Crée un devis (sale.order en state 'draft') dans Odoo à partir du
 * formulaire FormationInscriptionForm.
 *
 * Usage côté client (équivalent de l'actuel /api/shopify/inscription) :
 *   await fetch("/api/odoo/inscription", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ typeClient, prenom, nom, email, ... }),
 *   });
 *
 * Réponse :
 *   { success: true, saleOrder: { id, name, state, amount_total }, partnerId }
 */

export { POST } from "@/lib/odoo/inscription";
