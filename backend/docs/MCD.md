# MCD — Backend Blog ACT
> **Modèle Conceptuel de Données** — Source de vérité partagée entre les membres de l'équipe backend.
> Toute modification structurelle (modèle, endpoint, sérialisation) doit être reflétée ici.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Installation & lancement](#3-installation--lancement)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Architecture des dossiers](#5-architecture-des-dossiers)
6. [Modèles de données](#6-modèles-de-données)
7. [API REST — Endpoints](#7-api-rest--endpoints)
8. [Sérialisation & logique image](#8-sérialisation--logique-image)
9. [Administration Wagtail](#9-administration-wagtail)
10. [CORS & sécurité](#10-cors--sécurité)
11. [Décisions d'architecture](#11-décisions-darchitecture)
12. [Règles à respecter](#12-règles-à-respecter)

---

## 1. Vue d'ensemble

Le backend du blog ACT est une API **headless** construite avec Django + Wagtail. Il expose des données JSON consommées par le frontend Next.js (`website-act-officiel-`). Wagtail sert uniquement d'interface d'administration de contenu — aucun template Wagtail n'est rendu en production.

```
Wagtail Admin  →  Django ORM  →  DRF Serializers  →  JSON API  →  Next.js Frontend
     ↑                                                                     ↓
  Rédacteurs                                                       Visiteurs du site
```

**URL du backend :** `http://localhost:8000`
**URL de l'API :** `http://localhost:8000/api/v1/`
**Admin Wagtail :** `http://localhost:8000/wagtail-admin/`
**Frontend :** `http://localhost:3000`

---

## 2. Stack technique

| Composant | Version | Rôle |
|---|---|---|
| Python | ≥ 3.11 | Runtime |
| Django | ≥ 4.2, < 5.0 | Framework web |
| Wagtail | ≥ 6.5 | CMS headless (admin de contenu) |
| Django REST Framework | ≥ 3.14 | Exposition de l'API JSON |
| django-cors-headers | ≥ 4.3 | Autorisation cross-origin (Next.js) |
| Cloudinary | ≥ 1.36 | Stockage et CDN des images |
| django-cloudinary-storage | ≥ 0.3 | Backend de stockage Django → Cloudinary |
| psycopg2-binary | ≥ 2.9 | Driver PostgreSQL (Supabase) |
| dj-database-url | ≥ 2.1 | Parsing de `DATABASE_URL` |
| taggit + modelcluster | latest | Système de tags Wagtail |
| python-dotenv | ≥ 1.0 | Chargement des `.env` |
| gunicorn | ≥ 21.2 | Serveur WSGI de production |

---

## 3. Installation & lancement

```bash
# Depuis D:\website-act\back-blog

# 1. Créer et activer l'environnement virtuel
python -m venv env
source env/Scripts/activate      # Windows
# source env/bin/activate         # Linux / macOS

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Configurer les variables d'environnement (voir section 4)
cp backend.env.example .env

# 4. Appliquer les migrations
python manage.py migrate

# 5. Créer un superutilisateur (admin Wagtail)
python manage.py createsuperuser

# 6. Lancer le serveur de développement
python manage.py runserver
```

---

## 4. Variables d'environnement

Fichier : `back-blog/.env`

```env
# Django
SECRET_KEY=<clé-secrète-longue-et-aléatoire>
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de données
# Laisser vide = SQLite local (développement rapide)
# Renseigner pour PostgreSQL Supabase
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>

# Cloudinary (stockage images)
CLOUDINARY_CLOUD_NAME=dbxlgjplu
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# CORS — origines autorisées (frontend)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

> **Important :** Ne jamais committer le fichier `.env`. Le fichier `backend.env.example` sert de modèle sans valeurs sensibles.

---

## 5. Architecture des dossiers

```
back-blog/
├── actblog/                    # Projet Django (settings, urls racine)
│   ├── settings/
│   │   └── base.py             # Paramètres Django + Wagtail
│   ├── urls.py                 # Routage racine (monte /api/v1/ et /wagtail-admin/)
│   └── wsgi.py
│
├── blog/                       # App principale — modèles, API, sérialisation
│   ├── models.py               # BlogPostPage, BlogCategory, BlogPageTag, BlogIndexPage
│   ├── serializers.py          # Sérialisation DRF + logique de résolution d'image
│   ├── api_views.py            # Vues DRF (List/Detail/BySlug)
│   ├── api_urls.py             # Routes de l'API blog
│   └── migrations/             # Migrations Django
│
├── home/                       # App Wagtail : page racine (obligatoire)
├── search/                     # App Wagtail : moteur de recherche
├── docs/                       # Documentation interne du backend Wagtail
├── requirements.txt
└── manage.py
```

---

## 6. Modèles de données

### 6.1 `BlogCategory`

Modèle Django simple (non-Wagtail). Géré via l'admin Django standard.

```python
BlogCategory
├── id          : AutoField (PK)
├── name        : CharField(100, unique=True)   # Nom de la catégorie (ex: "IA")
├── slug        : SlugField(100, unique=True)   # URL-safe (ex: "ia")
├── description : TextField(blank=True)
└── created_at  : DateTimeField(auto_now_add=True)
```

**Catégories existantes :** IA, E-commerce, SIG, Média, FinTech, Innovation, Sécurité, Startups, Réalisations

---

### 6.2 `BlogIndexPage`

Page Wagtail racine du blog. Doit être créée **une seule fois** dans l'arborescence Wagtail sous la page racine.

```python
BlogIndexPage (extends Page)
└── intro : RichTextField(blank=True)   # Texte d'introduction (non exposé en API actuellement)
```

> La méthode `serve_preview()` redirige vers `http://localhost:3000/blog` au lieu de rendre un template.

---

### 6.3 `BlogPostPage`

Modèle principal. Chaque article est une **page Wagtail** enfant de `BlogIndexPage`.

```python
BlogPostPage (extends Page)
│
├── — Métadonnées —
├── date              : DateField          # Date de publication affichée
├── author_name       : CharField(100)     # Auteur (texte libre, défaut: "ACT Team")
├── read_time         : IntegerField       # Temps de lecture en minutes
│
├── — Contenu —
├── intro             : CharField(250)     # Résumé court (affiché dans les listes)
├── body              : RichTextField      # Corps de l'article (HTML enrichi Wagtail)
│
├── — Médias —
├── featured_image    : ForeignKey(wagtailimages.Image)  # Upload direct Wagtail → Cloudinary
├── featured_image_url: URLField           # URL Cloudinary saisie manuellement
├── video_url         : URLField           # URL YouTube (optionnel)
│
└── — Relations —
    ├── category      : ForeignKey(BlogCategory, null=True)
    └── tags          : ClusterTaggableManager(through=BlogPageTag)
```

**Champ hérité de `Page` :** `title`, `slug`, `first_published_at`, `last_published_at`, `live` (booléen de publication).

---

### 6.4 `BlogPageTag`

Table de liaison entre `BlogPostPage` et `taggit.Tag`. Ne pas modifier directement.

```python
BlogPageTag (extends TaggedItemBase)
└── content_object : ParentalKey → BlogPostPage
```

---

## 7. API REST — Endpoints

**Base :** `http://localhost:8000/api/v1`

| Méthode | Endpoint | Vue | Description |
|---|---|---|---|
| `GET` | `/blog/posts/` | `BlogPostListView` | Liste paginée des articles publiés |
| `GET` | `/blog/posts/{id}/` | `BlogPostDetailView` | Article par ID |
| `GET` | `/blog/posts/slug/{slug}/` | `BlogPostBySlugView` | Article par slug |
| `GET` | `/blog/categories/` | `BlogCategoryListView` | Toutes les catégories |
| `GET` | `/blog/categories/{id}/` | `BlogCategoryDetailView` | Catégorie par ID |
| `GET` | `/blog/tags/` | `BlogTagListView` | Tous les tags |

### Paramètres de la liste `/blog/posts/`

| Paramètre | Type | Exemple | Description |
|---|---|---|---|
| `page` | int | `?page=2` | Numéro de page |
| `page_size` | int | `?page_size=5` | Articles par page (max 100, défaut 10) |
| `category` | int | `?category=3` | Filtrer par ID de catégorie |
| `author_name` | string | `?author_name=Jesse` | Filtrer par auteur |
| `search` | string | `?search=IA` | Recherche full-text (titre, intro, body) |
| `ordering` | string | `?ordering=-date` | Tri par `date` ou `title` (préfixe `-` = décroissant) |

### Format de réponse (liste)

```json
{
  "count": 42,
  "next": "http://localhost:8000/api/v1/blog/posts/?page=2",
  "previous": null,
  "results": [
    {
      "id": 5,
      "title": "L'IA au service de l'Afrique",
      "slug": "ia-au-service-de-lafrique",
      "date": "2024-11-15",
      "intro": "Résumé court de l'article...",
      "image_url": "https://res.cloudinary.com/dbxlgjplu/image/upload/...",
      "featured_image_url": "",
      "author_name": "ACT Team",
      "read_time": 5,
      "category_name": "IA",
      "tags_list": ["intelligence-artificielle", "afrique"],
      "url": "/blog/ia-au-service-de-lafrique/",
      "first_published_at": "2024-11-15T10:30:00Z"
    }
  ]
}
```

### Format de réponse (détail)

```json
{
  "id": 5,
  "title": "L'IA au service de l'Afrique",
  "slug": "ia-au-service-de-lafrique",
  "date": "2024-11-15",
  "intro": "Résumé court...",
  "body": "<p>Contenu HTML enrichi Wagtail...</p>",
  "image_url": "https://res.cloudinary.com/dbxlgjplu/image/upload/...",
  "featured_image_url": "",
  "featured_image_data": {
    "url": "https://res.cloudinary.com/...",
    "alt": "Titre de l'image Wagtail",
    "width": 1200,
    "height": 630
  },
  "video_url": "",
  "author_name": "ACT Team",
  "read_time": 5,
  "category": {
    "id": 1,
    "name": "IA",
    "slug": "ia",
    "description": "",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "tags_list": ["intelligence-artificielle", "afrique"],
  "url": "/blog/ia-au-service-de-lafrique/",
  "parent_url": "/blog/",
  "first_published_at": "2024-11-15T10:30:00Z",
  "last_published_at": "2024-11-16T08:00:00Z"
}
```

---

## 8. Sérialisation & logique image

### Logique de résolution d'image (`resolve_image_url`)

Le frontend reçoit **toujours** un champ unifié `image_url`. La résolution suit cet ordre de priorité :

```
1. featured_image_url  →  URL Cloudinary saisie manuellement dans l'admin
         ↓ (si vide)
2. featured_image      →  Image uploadée via le widget Wagtail (auto-sync Cloudinary)
         ↓ (si absent)
3. None                →  Aucune image
```

**Règle d'équipe :** Le frontend doit toujours lire `image_url`, jamais `featured_image_url` directement.

### Sérialiseurs disponibles

| Classe | Utilisé par | Champs image exposés |
|---|---|---|
| `BlogPostSerializer` | Liste `/posts/` | `image_url`, `featured_image_url` |
| `BlogPostDetailSerializer` | Détail `/posts/{id}/` | `image_url`, `featured_image_url`, `featured_image_data` |
| `BlogCategorySerializer` | `/categories/`, `/tags/` | — |

---

## 9. Administration Wagtail

**URL :** `http://localhost:8000/wagtail-admin/`

### Arborescence de pages Wagtail attendue

```
Root (/)
└── Blog Index Page  (slug: blog)
    ├── Article 1    (slug: titre-de-larticle-1)
    ├── Article 2    (slug: titre-de-larticle-2)
    └── ...
```

> La `BlogIndexPage` doit être **enfant directe de la Root page**. Les `BlogPostPage` doivent être **enfants de la BlogIndexPage**.

### Publication d'un article

1. Aller dans Wagtail Admin → Pages → Blog Index
2. Créer une page enfant de type **Blog Post Page**
3. Remplir : titre, intro, body, catégorie, tags, image
4. Cliquer **Publier** (statut `live = True`) — l'article apparaît immédiatement dans l'API

### Aperçu (Preview)

Le bouton "Aperçu" de Wagtail redirige automatiquement vers le frontend Next.js :
- `BlogIndexPage` → `http://localhost:3000/blog`
- `BlogPostPage` → `http://localhost:3000/blog/{slug}`

---

## 10. CORS & sécurité

```python
# settings/base.py
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
# En développement : http://localhost:3000
```

- L'API est **en lecture seule** (GET uniquement) — aucune authentification requise pour les endpoints publics.
- Le Wagtail Admin est protégé par authentification Django.
- En production : restreindre `ALLOWED_HOSTS` et désactiver `DEBUG`.

---

## 11. Décisions d'architecture

### Wagtail en mode headless
Wagtail est utilisé **uniquement comme CMS** (interface de gestion du contenu). Il ne sert aucun template HTML public. Tous les appels depuis le frontend passent par l'API DRF.

### `BlogPostPage` hérite de `Page` (Wagtail)
Avantage : on bénéficie gratuitement du versioning, du workflow de publication, des slugs automatiques, de la recherche Wagtail, et des redirections. Inconvénient : la hiérarchie de pages doit être respectée (BlogPost doit être enfant de BlogIndex).

### Deux champs image sur `BlogPostPage`
- `featured_image` : pour les rédacteurs qui uploadent directement dans Wagtail.
- `featured_image_url` : pour les imports en masse depuis Cloudinary ou un autre CDN.
Les deux coexistent pour ne pas forcer un seul workflow d'upload.

### `author_name` en texte libre
Choix délibéré : pas de modèle `Author` séparé pour simplifier la gestion. Si l'équipe grandit et nécessite des pages auteurs, créer un `Snippet` Wagtail `Author` et remplacer `author_name` par une FK.

### Pagination standard (10 / page, max 100)
Définie dans `StandardPagination`. Le paramètre `page_size` est exposé pour laisser le frontend contrôler la densité d'affichage (carousels, grilles, etc.).

---

## 12. Règles à respecter

> Ces règles sont **obligatoires** pour maintenir la cohérence entre backend et frontend.

1. **Ne jamais supprimer `image_url` du sérialiseur** — le frontend en dépend entièrement.
2. **Toute nouvelle migration doit être committée** avec le code qui la génère.
3. **Les catégories sont en français** (`IA`, `E-commerce`, `SIG`...) — ne pas traduire en anglais.
4. **Le slug d'un article ne doit jamais changer** après publication — cela casserait les URLs partagées.
5. **Ne pas exposer d'endpoints d'écriture (POST/PUT/DELETE)** sans authentification explicite.
6. **Toute nouvelle app Django doit être ajoutée à `INSTALLED_APPS`** dans `base.py`.
7. **Les variables d'environnement sensibles ne sont jamais hardcodées** dans le code — toujours via `os.getenv()`.
8. **Mettre à jour ce fichier MDC.md** lors de tout ajout de modèle, endpoint ou règle métier.

---

*Dernière mise à jour : 2026-04-02 — Équipe ACT Backend*
