# Inventaire des cookies — Africa Centred Technology (a-ct.ma)

> Document mis à jour le 2026-05-16 à partir du code source du projet.
> Référence : `src/lib/session.ts`, `src/lib/csrf.ts`, `src/middleware.ts`, `src/app/layout.tsx`, `src/lib/facebook/capi.ts`, `src/components/layout/CookieBanner.tsx`, `src/i18n/routing.ts`

---

## Résumé

| Catégorie | Nombre | Contrôle |
|---|---|---|
| Strictement nécessaires | 7 | First-party (ACT) + Cloudflare (tiers) |
| Fonctionnels | 1 | First-party (ACT) |
| Statistiques | 13 | Tiers (Google + Microsoft Clarity + Hotjar) |
| Ciblage & Publicité | 2 | Tiers (Meta) |
| **Total** | **23** | |

---

## Catégorie 1 — Strictement nécessaires

> Toujours actifs. Ne peuvent pas être refusés. Ne collectent aucune donnée personnelle identifiable.

| Nom | Type | Domaine | Finalité | Durée | Code source |
|---|---|---|---|---|---|
| `act_cookie_consent` | `localStorage` | `a-ct.ma` | Stocke le choix de consentement de l'utilisateur (`granted` ou `denied`) | 6 mois puis re-demande | `src/lib/session.ts:2` |
| `act_consent_date` | `localStorage` | `a-ct.ma` | Horodatage du consentement — permet de détecter l'expiration après 6 mois | 6 mois | `src/lib/session.ts:3` |
| `act_session_id` | `localStorage` | `a-ct.ma` | UUID unique par navigateur, envoyé à Google Analytics comme `user_id` pour dédupliquer les sessions | Permanent (supprimé si refus ou expiration) | `src/lib/session.ts:1` |
| `act_csrf` | Cookie HTTP | `a-ct.ma` | Token anti-CSRF (double-submit cookie pattern) — protège les routes POST contre les attaques cross-site. Valeur aléatoire (UUID) générée par le middleware Next.js, lue par le client JS et envoyée dans le header `X-CSRF-Token`. | 24 heures, renouvelé automatiquement | `src/middleware.ts`, `src/lib/csrf.ts` |
| `NEXT_LOCALE` | Cookie HTTP | `a-ct.ma` | Mémorise la préférence de langue de l'utilisateur (`fr`, `en`, `ar`) pour les visites suivantes | 1 an | `src/i18n/routing.ts:8` |
| `__cf_bm` | Cookie HTTP | `.a-ct.ma` | Cookie Cloudflare — détection de bots, protection anti-DDOS. Déposé automatiquement par le réseau Cloudflare si le domaine est derrière Cloudflare. Non contrôlé par ACT. | 30 minutes | Cloudflare (tiers) |
| `cf_clearance` | Cookie HTTP | `.a-ct.ma` | Cookie Cloudflare — preuve de passage du challenge CAPTCHA Cloudflare. Présent uniquement en cas de trafic suspect. Non contrôlé par ACT. | 1 an | Cloudflare (tiers) |

> **Note sur le stockage :** `act_cookie_consent`, `act_consent_date` et `act_session_id` sont dans le `localStorage` (inaccessibles côté serveur, ne transitent pas sur le réseau). `act_csrf` et `NEXT_LOCALE` sont de vrais cookies HTTP, envoyés automatiquement avec chaque requête.

**Flux CSRF (`act_csrf`) :**
```
Visite d'une page
    → middleware.ts vérifie si act_csrf existe
    → si absent : génère crypto.randomUUID() → Set-Cookie: act_csrf=<uuid>; SameSite=Strict

Soumission d'un formulaire (client JS)
    → lit act_csrf depuis document.cookie
    → inclut "X-CSRF-Token: <uuid>" dans le header fetch

Validation serveur (src/lib/csrf.ts)
    → compare header X-CSRF-Token avec cookie act_csrf
    → si différents ou absents → 403 Forbidden
```

---

## Catégorie 2 — Fonctionnels

> Activés uniquement avec le consentement. Améliorent l'expérience sans transmettre de données à des tiers.

| Nom | Type | Domaine | Finalité | Durée | Code source |
|---|---|---|---|---|---|
| `act_user_profile` | `localStorage` | `a-ct.ma` | Profil utilisateur (nom, email, téléphone, société) collecté via les formulaires — sert à pré-remplir les prochains formulaires. Merger automatique des données. | Permanent | `src/lib/session.ts:4` |

**Données stockées dans `act_user_profile` :**
```json
{
  "name": "Prénom Nom",
  "email": "utilisateur@exemple.com",
  "phone": "+212600000000",
  "company": "Nom société",
  "locale": "fr",
  "updatedAt": "2026-05-16T10:00:00.000Z"
}
```

**Sources de collecte :**
- Formulaire de contact (`/contact`) → nom, email, téléphone, société
- Formulaire d'inscription formation → nom, email, téléphone, organisme
- Modale de téléchargement brochure → nom, email, société
- Newsletter (footer) → email uniquement

---

## Catégorie 3 — Statistiques

> Activés uniquement avec le consentement.
> GA4 : contrôlé par Google Consent Mode v2. Clarity & Hotjar : injection dynamique après acceptation.

### 3a — Google Analytics 4

| Nom | Domaine | Finalité | Durée | Émetteur |
|---|---|---|---|---|
| `_ga` | `.a-ct.ma` | Identifiant client GA4 — distingue les utilisateurs uniques entre les sessions | **2 ans** | Google Analytics |
| `_gid` | `.a-ct.ma` | Distingue les utilisateurs entre les sessions — se renouvelle quotidiennement | **24 h** | Google Analytics |
| `_ga_5T0CM1FR5Q` | `.a-ct.ma` | État de session GA4 pour la propriété `G-5T0CM1FR5Q` | **2 ans** | Google Analytics 4 |
| `_ga_R21NYV01M2` | `.a-ct.ma` | État de session GA4 pour la propriété `G-R21NYV01M2` | **2 ans** | Google Analytics 4 |
| `_gat` / `_gat_gtag_*` | `.a-ct.ma` | Limite le taux de requêtes envoyées à GA4 (throttle) — renouvellement toutes les minutes | **1 min** | Google Analytics |

**Configuration (`src/app/layout.tsx:7`) :**
```js
const GA_MEASUREMENT_IDS = ["G-5T0CM1FR5Q", "G-R21NYV01M2"];
const GTM_ID = "GTM-KD4MFQXX";
```

**Consent Mode v2 appliqué (`src/app/layout.tsx:62-68`) :**
```js
gtag('consent', 'default', {
  analytics_storage: 'denied',   // GA bloqué par défaut
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
});
```

---

### 3b — Microsoft Clarity

> Script injecté dynamiquement uniquement après consentement. Enregistre les sessions et génère des heatmaps de navigation.

| Nom | Domaine | Finalité | Durée | Émetteur |
|---|---|---|---|---|
| `_clck` | `.a-ct.ma` | Identifiant utilisateur Clarity — persiste l'ID anonyme entre les sessions pour les heatmaps | **1 an** | Microsoft Clarity |
| `_clsk` | `.a-ct.ma` | Identifiant de session Clarity — associe les pages vues d'une même visite | **1 jour** | Microsoft Clarity |

**Intégration (`src/lib/analytics.ts`) :**
```ts
// Script injecté uniquement si NEXT_PUBLIC_CLARITY_PROJECT_ID est défini
// et si l'utilisateur a donné son consentement analytics
export function initClarity(): void { ... }
```

**Variable d'environnement requise :**
```env
NEXT_PUBLIC_CLARITY_PROJECT_ID=<ton-project-id>  # clarity.microsoft.com
```

---

### 3c — Hotjar

> Script injecté dynamiquement uniquement après consentement. Enregistre les sessions et génère des heatmaps de clics/mouvements.

| Nom | Domaine | Finalité | Durée | Émetteur |
|---|---|---|---|---|
| `_hjSessionUser_<ID>` | `.a-ct.ma` | Identifiant utilisateur Hotjar — persiste l'ID anonyme entre les sessions | **1 an** | Hotjar |
| `_hjSession_<ID>` | `.a-ct.ma` | Identifiant de session Hotjar — associe les événements d'une même visite | **30 min** | Hotjar |
| `_hjFirstSeen` | `.a-ct.ma` | Détecte si l'utilisateur est nouveau — influe sur le taux de sampling | **Session** | Hotjar |
| `_hjIncludedInPageviewSample` | `.a-ct.ma` | Indique si la session est incluse dans l'échantillon de pageviews | **2 min** | Hotjar |
| `_hjAbsoluteSessionInProgress` | `.a-ct.ma` | Différencie les nouvelles sessions des sessions actives | **30 min** | Hotjar |

**Intégration (`src/lib/analytics.ts`) :**
```ts
// Script injecté uniquement si NEXT_PUBLIC_HOTJAR_SITE_ID est défini
// et si l'utilisateur a donné son consentement analytics
export function initHotjar(): void { ... }
```

**Variable d'environnement requise :**
```env
NEXT_PUBLIC_HOTJAR_SITE_ID=<ton-site-id>  # hotjar.com → Sites
```

---

## Catégorie 4 — Ciblage & Publicité

> Activés uniquement avec le consentement. Gérés par Meta (Facebook/Instagram).
> Lus côté serveur par la Conversions API pour le hachage SHA-256.

| Nom | Domaine | Finalité | Durée | Émetteur |
|---|---|---|---|---|
| `_fbp` | `.a-ct.ma` | Meta Pixel — identifiant navigateur unique, utilisé pour le retargeting sur Facebook et Instagram | **3 mois** | Meta (Facebook) |
| `_fbc` | `.a-ct.ma` | Meta Pixel — capture le paramètre `fbclid` de l'URL lors d'un clic sur une publicité Meta | **3 mois** | Meta (Facebook) |

**Pixel ID (`src/app/layout.tsx:6`) :**
```
1550173629800746
```

**Lecture côté serveur (`src/lib/facebook/capi.ts:104-105`) :**
```ts
const fbp = cookie.match(/_fbp=([^;]+)/)?.[1] ?? "";
const fbc = cookie.match(/_fbc=([^;]+)/)?.[1] ?? "";
```
Ces valeurs sont hashées SHA-256 et envoyées à la **Facebook Conversions API** pour améliorer la précision des événements de conversion.

**Consentement Meta géré par (`src/components/layout/CookieBanner.tsx`) :**
```ts
window.fbq?.("consent", "grant");  // si accepté
window.fbq?.("consent", "revoke"); // si refusé (défaut)
```

---

## Logique de consentement

```
Première visite
    → act_cookie_consent absent → Bannière affichée

Utilisateur accepte
    → act_cookie_consent = "granted"
    → act_consent_date   = Date.now()
    → act_session_id     = crypto.randomUUID()
    → gtag consent update : granted
    → fbq consent : grant
    → initClarity() : script Clarity injecté (si NEXT_PUBLIC_CLARITY_PROJECT_ID défini)
    → initHotjar()  : script Hotjar injecté (si NEXT_PUBLIC_HOTJAR_SITE_ID défini)

Utilisateur refuse
    → act_cookie_consent = "denied"
    → act_consent_date   = Date.now()
    → act_session_id     supprimé
    → gtag consent update : denied
    → fbq consent : revoke

Visite ultérieure — consentement > 6 mois
    → act_cookie_consent supprimé
    → act_consent_date   supprimé
    → act_session_id     supprimé
    → Bannière re-affichée

Visite ultérieure — act_session_id absent mais act_cookie_consent = "granted"
    → Cache vidé partiellement détecté
    → Bannière re-affichée
```

---

## Cookies tiers déposés par les services intégrés

> Ces cookies sont hors du contrôle d'ACT. Ils sont déposés automatiquement par les scripts tiers chargés sur le site.

| Nom | Domaine | Service | Catégorie | Durée |
|---|---|---|---|---|
| `__Secure-1PAPISID` | `.google.com` | Google (via GTM/GA/Fonts) | Nécessaire infrastructure | 2 ans |
| `__Secure-3PAPISID` | `.google.com` | Google — auth cross-site | Nécessaire infrastructure | 2 ans |
| `SAPISID` | `.google.com` | Google — session connectée | Nécessaire infrastructure | 2 ans |
| `NID` | `.google.com` | Google — personnalisation | Fonctionnel | 6 mois |
| `_gcl_au` | `.a-ct.ma` | Google Ads Conversion Linker | Ciblage | 3 mois |

---

## Fichiers sources

| Fichier | Rôle |
|---|---|
| [`src/lib/session.ts`](../src/lib/session.ts) | Gestion consentement, session, profil utilisateur |
| [`src/components/layout/CookieBanner.tsx`](../src/components/layout/CookieBanner.tsx) | Composant bannière + logique UI |
| [`src/app/layout.tsx`](../src/app/layout.tsx) | Injection Meta Pixel, GTM, Google Analytics, Consent Mode v2 |
| [`src/lib/facebook/capi.ts`](../src/lib/facebook/capi.ts) | Facebook Conversions API (lecture `_fbp`, `_fbc`) |
| [`src/lib/api/contact.ts`](../src/lib/api/contact.ts) | Événement CAPI `Lead` (formulaire contact) |
| [`src/lib/api/inscription.ts`](../src/lib/api/inscription.ts) | Événement CAPI `Purchase` (inscription formation) |
| [`src/lib/api/brochure.ts`](../src/lib/api/brochure.ts) | Événement CAPI `Lead` (téléchargement brochure) |
| [`src/lib/api/newsletter.ts`](../src/lib/api/newsletter.ts) | Événement CAPI `Subscribe` (newsletter) |

---

## Variables d'environnement liées aux cookies

```env
# Facebook Conversions API
META_PIXEL_ID=1550173629800746
FACEBOOK_CAPI_TOKEN=<token-system-user>
FACEBOOK_CAPI_TEST_CODE=TEST69742   # À supprimer en production
```
