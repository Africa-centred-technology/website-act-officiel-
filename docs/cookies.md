# Politique Cookies — ACT vs Capgemini

> Généré le 2026-05-16 — Source : analyse du site capgemini.com + codebase ACT

---

## 1. Système de gestion du consentement (CMP)

| | Capgemini | ACT |
|---|---|---|
| **CMP** | TrustArc | Composant custom (`CookieBanner.tsx`) |
| **Consent Mode** | Google Consent Mode v2 via TrustArc | Google Consent Mode v2 natif (`layout.tsx`) |
| **Catégories** | 4 (Nécessaires, Fonctionnels, Statistiques, Ciblage) | 3 → **à aligner sur 4** |
| **Stockage du choix** | Cookie TrustArc (`notice_gdpr_prefs`) | `localStorage` (`act_cookie_consent`) |
| **Expiration du consentement** | 3 mois (TrustArc) | 6 mois (`act_consent_date`) |

---

## 2. Cookies Capgemini — Inventaire complet

### 2.1 Cookies CMP — TrustArc (Strictement nécessaires)

| Nom | Domaine | Finalité | Durée |
|---|---|---|---|
| `TAconsentID` | `.capgemini.com` | Identifiant unique du consentement TrustArc | Session |
| `TAsessionID` | `.capgemini.com` | Identifiant de session TrustArc | Session |
| `notice_gdpr_prefs` | `.capgemini.com` | Stocke les préférences de consentement RGPD | 1 an |
| `notice_preferences` | `.capgemini.com` | Catégories acceptées par l'utilisateur | 1 an |
| `notice_behavior` | `.capgemini.com` | Comportement d'affichage de la bannière | Session |
| `notice_poptime` | `.capgemini.com` | Timestamp du dernier affichage du bandeau | 1 an |
| `cmapi_cookie_privacy` | `.capgemini.com` | Statut du consentement par catégorie | 1 an |
| `cmapi_gtm_bl` | `.capgemini.com` | Blocklist GTM selon le consentement | Session |
| `usprivacy` | `.capgemini.com` | Chaîne de confidentialité CCPA (marché US) | 1 an |

### 2.2 Cookies Analytics / Statistiques

| Nom | Domaine | Finalité | Durée |
|---|---|---|---|
| `_ga` | `.capgemini.com` | Identifiant client Google Analytics (distinct des sessions) | 2 ans |
| `_gid` | `.capgemini.com` | Distingue les utilisateurs — Google Analytics | 24h |
| `_gat` / `_gat_UA-*` | `.capgemini.com` | Limite le taux de requêtes GA | 1 min |
| `_ga_XXXXXXX` | `.capgemini.com` | État de session GA4 | 2 ans |
| `gtm_debug` | `.capgemini.com` | Mode debug Google Tag Manager | Session |
| `hascontent` | `reports.capgemini.com` | Mémorise le choix de consentement sur le rapport annuel | Session |

### 2.3 Cookies Fonctionnels

| Nom | Domaine | Finalité | Durée |
|---|---|---|---|
| `lang` | `.capgemini.com` | Langue sélectionnée par l'utilisateur | 1 an |
| `region` | `.capgemini.com` | Région/pays sélectionnée | 1 an |
| `JSESSIONID` | `.capgemini.com` | Session serveur Java (infrastructure) | Session |

### 2.4 Cookies Ciblage / Marketing

| Nom | Domaine | Finalité | Durée |
|---|---|---|---|
| `_fbp` | `.capgemini.com` | Meta Pixel — identifiant navigateur pour retargeting | 3 mois |
| `_fbc` | `.capgemini.com` | Meta Pixel — suivi des clics sur les publicités Facebook | 3 mois |
| `li_at` | `.linkedin.com` | LinkedIn — session utilisateur authentifié | 1 an |
| `li_gc` | `.linkedin.com` | LinkedIn — consentement cookies | 2 ans |
| `liap` | `.linkedin.com` | LinkedIn — authentification cross-domaine | 1 an |
| `AnalyticsSyncHistory` | `.linkedin.com` | LinkedIn — sync des données d'analytics | 30 jours |
| `UserMatchHistory` | `.linkedin.com` | LinkedIn Insight Tag — correspondance audience | 30 jours |
| `bcookie` | `.linkedin.com` | LinkedIn — identifiant navigateur | 2 ans |
| `bscookie` | `.linkedin.com` | LinkedIn — sécurité authentification | 2 ans |
| `_mkto_tr` | `.capgemini.com` | Marketo Munchkin — suivi des leads marketing | 2 ans |
| `_uetsid` | `.capgemini.com` | Microsoft Advertising — session retargeting | 1 jour |
| `_uetvid` | `.capgemini.com` | Microsoft Advertising — identifiant visiteur | 16 jours |
| `IDE` | `.doubleclick.net` | Google Ads — ciblage publicitaire cross-sites | 13 mois |
| `NID` | `.google.com` | Google — personnalisation des résultats | 6 mois |

### 2.5 Cookies tiers — Infrastructure

| Nom | Domaine | Finalité | Durée |
|---|---|---|---|
| `__Secure-1PAPISID` | `.google.com` | Google — authentification session compte Google | 2 ans |
| `__Secure-3PAPISID` | `.google.com` | Google — authentification cross-site sécurisée | 2 ans |
| `SAPISID` | `.google.com` | Google — sécurité session | 2 ans |
| `SSID` | `.google.com` | Google — session connectée | 2 ans |
| `__cf_bm` | `.capgemini.com` | Cloudflare — protection bot | 30 min |
| `cf_clearance` | `.capgemini.com` | Cloudflare — validation humain (challenge) | 1 an |

---

## 3. Cookies ACT — Inventaire actuel

### 3.1 Cookies propriétaires (First-party)

| Nom | Stockage | Catégorie | Finalité | Durée |
|---|---|---|---|---|
| `act_cookie_consent` | `localStorage` | **Nécessaire** | Choix de consentement (granted/denied) | 6 mois |
| `act_consent_date` | `localStorage` | **Nécessaire** | Timestamp du consentement (pour expiration) | 6 mois |
| `act_session_id` | `localStorage` | **Nécessaire** | UUID session utilisateur — envoyé à GA4 comme `user_id` | Permanent (ou refus) |
| `act_user_profile` | `localStorage` | **Fonctionnel** | Profil utilisateur (nom, email, téléphone) — pré-remplissage formulaires | Permanent |

### 3.2 Cookies Analytics (tiers)

| Nom | Domaine | Catégorie | Finalité | Durée |
|---|---|---|---|---|
| `_ga` | `.a-ct.ma` | **Statistiques** | Identifiant client Google Analytics | 2 ans |
| `_gid` | `.a-ct.ma` | **Statistiques** | Distingue les sessions GA | 24h |
| `_ga_5T0CM1FR5Q` | `.a-ct.ma` | **Statistiques** | État session GA4 (ID: G-5T0CM1FR5Q) | 2 ans |
| `_ga_R21NYV01M2` | `.a-ct.ma` | **Statistiques** | État session GA4 (ID: G-R21NYV01M2) | 2 ans |

### 3.3 Cookies Marketing / Ciblage (tiers)

| Nom | Domaine | Catégorie | Finalité | Durée |
|---|---|---|---|---|
| `_fbp` | `.a-ct.ma` | **Ciblage** | Meta Pixel — identifiant navigateur pour retargeting Facebook/Instagram | 3 mois |
| `_fbc` | `.a-ct.ma` | **Ciblage** | Meta Pixel — suivi clics publicités (paramètre `fbclid` URL) | 3 mois |

### 3.4 Cookies Google / Infrastructure (tiers)

| Nom | Domaine | Catégorie | Finalité | Durée |
|---|---|---|---|---|
| `__Secure-1PAPISID` | `.google.com` | **Nécessaire*** | Google — authentification session (chargé via GTM/GA) | 2 ans |
| `__Secure-3PAPISID` | `.google.com` | **Nécessaire*** | Google — authentification cross-site sécurisée | 2 ans |
| `_gcl_au` | `.a-ct.ma` | **Ciblage** | Google Ads — conversion linking | 3 mois |

> *Ces cookies Google sont déposés par des services tiers (GTM, GA, Fonts) et ne peuvent pas être contrôlés côté serveur ACT.

---

## 4. Analyse des écarts ACT vs Capgemini

| Point | Capgemini | ACT actuel | Action requise |
|---|---|---|---|
| Nombre de catégories | 4 | 3 | ✅ Ajouter catégorie "Fonctionnel" |
| Stockage consentement | Cookie (persistant cross-tab) | localStorage | ⚠️ localStorage correct mais non partagé cross-tab |
| Expiration du consent | 3 mois | 6 mois | ✅ OK |
| Re-demande auto | Oui (TrustArc) | Oui (custom) | ✅ Implémenté |
| Profil utilisateur | Non documenté | `act_user_profile` | ✅ Valeur ajoutée ACT |
| LinkedIn cookies | Oui (Insight Tag) | Non | ℹ️ À ajouter si LinkedIn Ads |
| Marketo | Oui (`_mkto_tr`) | Non | ℹ️ Non utilisé |
| Google Consent Mode v2 | Oui (via TrustArc) | Oui (natif) | ✅ OK |
| CAPI Meta (serveur) | Non documenté | Oui (`/lib/facebook/capi.ts`) | ✅ Avantage ACT |

---

## 5. Catégories alignées avec Capgemini (à implémenter)

```
Strictement nécessaires  → act_cookie_consent, act_consent_date, act_session_id
Fonctionnels             → act_user_profile (pré-remplissage formulaires)
Statistiques             → _ga, _gid, _ga_*, Google Analytics
Ciblage / Publicité      → _fbp, _fbc, Meta Pixel, _gcl_au
```

---

## 6. Références

- [Politique cookies Capgemini](https://www.capgemini.com/cookie-policy/)
- [Cookie settings Capgemini DK](https://www.capgemini.com/dk-en/cookie-settings/)
- [Rapport annuel Capgemini — cookies](https://reports.capgemini.com/2021/en/cookies.html)
- [TrustArc — Cookie Consent Manager](https://trustarc.com/products/consent-consumer-rights/cookie-consent-manager/)
- [Google Consent Mode v2 + TrustArc](https://support.google.com/analytics/answer/14713828)
- [Meta Pixel — cookie `_fbp`](https://developers.facebook.com/docs/marketing-api/conversions-api)
