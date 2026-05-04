/**
 * Odoo — Formations fetcher
 *
 * Depuis la migration vers le module Events, ce fichier est un alias
 * de `events.ts`. Une "formation" ACT est désormais matérialisée par
 * un `event.event` Odoo.
 *
 * Ce ré-export préserve la compatibilité avec les anciens imports :
 *
 *   import { fetchOdooFormations } from "@/lib/odoo/formations";
 *
 * tout en pointant en réalité sur la nouvelle implémentation events.
 */

export {
  fetchOdooFormations,
  fetchOdooFormationBySlug,
  fetchSessionsByType,
  type OdooFormationCard,
  type OdooFormationDetail,
} from "./events";
