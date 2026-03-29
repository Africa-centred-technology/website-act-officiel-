# ACT University — Arborescence V1

## Africa Centred Technology | Mars 2026

---

## 1. Architecture globale

L'ACT University repose sur un système de **briques de connaissances** (Knowledge Bricks) indépendantes et réutilisables. Ces briques s'assemblent en **mini-parcours** de 1 à 4 semaines, organisés en trois axes :

```
🎓 ACT University
│
├── 🧱 BRIQUES DE CONNAISSANCES (Knowledge Bricks)
│   └── Unités autonomes de 2-6h chacune
│       Chaque brique = leçon texte + exercices + quiz + mini-projet
│       Une brique peut appartenir à plusieurs parcours
│
├── 🛤️ MINI-PARCOURS (Learning Paths)
│   ├── 🔤 Par Langage — « Je veux maîtriser Python »
│   ├── 💼 Par Métier — « Je veux devenir Data Analyst »
│   └── 🎯 Par Compétence — « Je veux apprendre Docker »
│
└── 🧑‍💻 EXPÉRIENCE UTILISATEUR
    ├── 🔍 Explorer une brique isolée
    ├── 🛤️ Suivre un mini-parcours guidé
    └── 🗺️ Composer un cursus personnalisé (plusieurs parcours)
```

---

## 2. Format des briques (sans vidéo)

Chaque brique suit un format standardisé 100% textuel et interactif :

| Composant | Format | Durée estimée | Description |
|-----------|--------|---------------|-------------|
| **Cours illustré** | Article interactif (texte + schémas + extraits de code) | 30-60 min | Explications structurées avec exemples commentés, inspiré du style roadmap.sh et MDN |
| **Playground** | Code sandbox intégré (CodeSandbox, StackBlitz ou Repl.it) | 20-40 min | Environnement de code en ligne pour expérimenter directement dans le navigateur |
| **Exercices guidés** | Pas-à-pas avec validation automatique | 30-60 min | Série de 3-5 exercices progressifs, du basique à l'intermédiaire |
| **Quiz** | QCM interactif (10-15 questions) | 10-15 min | Validation des connaissances, score minimum 70% pour débloquer le badge |
| **Challenge** | Exercice autonome + solution | 1-2h | Problème ouvert à résoudre seul, avec solution détaillée accessible après soumission |
| **Cheat Sheet** | Fiche de référence PDF téléchargeable | — | Résumé visuel d'une page à garder sous la main |
| **Ressources** | Liens commentés vers les meilleures ressources externes | — | Documentation officielle, articles de référence, repos GitHub recommandés |

---

## 3. Catalogue des briques de connaissances

### 3.1 Fondations (F)

Briques transversales présentes dans presque tous les parcours.

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| F-01 | Comment fonctionne le web (HTTP, DNS, navigateurs) | 3h | Aucun |
| F-02 | Terminal & ligne de commande (Bash) | 4h | Aucun |
| F-03 | Git & GitHub — les fondamentaux | 4h | F-02 |
| F-04 | Git avancé (branches, merge, rebase, workflows) | 3h | F-03 |
| F-05 | Introduction à Linux (système de fichiers, permissions, processus) | 5h | F-02 |
| F-06 | Éditeur de code : VS Code en profondeur | 3h | Aucun |
| F-07 | Les bases de l'algorithmique (logique, boucles, conditions) | 5h | Aucun |
| F-08 | Structures de données essentielles (tableaux, listes, dictionnaires, piles, files) | 5h | F-07 |
| F-09 | Introduction aux API (REST, JSON, requêtes HTTP) | 4h | F-01 |
| F-10 | Markdown & documentation technique | 2h | Aucun |

### 3.2 Langages de programmation (L)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| L-PY-01 | Python — syntaxe, types, structures de contrôle | 5h | F-07 |
| L-PY-02 | Python — fonctions, modules, gestion d'erreurs | 4h | L-PY-01 |
| L-PY-03 | Python — POO (classes, héritage, polymorphisme) | 5h | L-PY-02 |
| L-PY-04 | Python — manipulation de fichiers et données (CSV, JSON, XML) | 3h | L-PY-02 |
| L-PY-05 | Python — environnements virtuels, pip, structuration de projet | 3h | L-PY-02 |
| L-JS-01 | JavaScript — syntaxe, variables, types, opérateurs | 5h | F-07 |
| L-JS-02 | JavaScript — fonctions, closures, scope, callbacks | 4h | L-JS-01 |
| L-JS-03 | JavaScript — manipulation du DOM et événements | 4h | L-JS-02 |
| L-JS-04 | JavaScript — ES6+ (arrow functions, destructuring, modules, promises) | 5h | L-JS-02 |
| L-JS-05 | JavaScript — async/await, Fetch API, gestion d'erreurs | 4h | L-JS-04 |
| L-JS-06 | TypeScript — fondamentaux (types, interfaces, generics) | 5h | L-JS-04 |
| L-JV-01 | Java — syntaxe, types, structures de contrôle | 5h | F-07 |
| L-JV-02 | Java — POO (classes, interfaces, abstract, packages) | 5h | L-JV-01 |
| L-JV-03 | Java — Collections, Streams, Lambda (Java 21) | 5h | L-JV-02 |
| L-JV-04 | Java — gestion d'exceptions, I/O, multithreading | 4h | L-JV-02 |
| L-SQL-01 | SQL — fondamentaux (SELECT, WHERE, JOIN, GROUP BY) | 5h | Aucun |
| L-SQL-02 | SQL — avancé (sous-requêtes, CTE, fenêtrage, optimisation) | 5h | L-SQL-01 |
| L-HTML-01 | HTML5 — structure sémantique, formulaires, accessibilité | 4h | F-01 |
| L-CSS-01 | CSS3 — sélecteurs, box model, positionnement | 4h | L-HTML-01 |
| L-CSS-02 | CSS3 — Flexbox & Grid (layouts modernes) | 4h | L-CSS-01 |
| L-CSS-03 | CSS3 — animations, transitions, responsive design (media queries) | 4h | L-CSS-02 |
| L-BASH-01 | Shell scripting (Bash) — scripts, boucles, conditions, cron | 4h | F-02, F-05 |

### 3.3 Frontend (FE)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| FE-01 | React — composants, JSX, props, state | 5h | L-JS-04 |
| FE-02 | React — hooks (useState, useEffect, useContext, custom hooks) | 5h | FE-01 |
| FE-03 | React — routing (React Router v6) | 3h | FE-02 |
| FE-04 | React — gestion d'état avancée (Context API, Zustand ou Redux Toolkit) | 4h | FE-02 |
| FE-05 | React — consommation d'API (Fetch, Axios, TanStack Query) | 4h | FE-02, F-09 |
| FE-06 | Next.js — fondamentaux (routing, SSR, SSG, API routes) | 5h | FE-03 |
| FE-07 | Tailwind CSS — utility-first styling | 4h | L-CSS-02 |
| FE-08 | Tests frontend (Jest, React Testing Library) | 4h | FE-02 |
| FE-09 | Performance web (Lighthouse, lazy loading, bundle optimization) | 3h | FE-02 |
| FE-10 | Figma pour développeurs (lire un design, exporter des assets) | 3h | Aucun |

### 3.4 Backend (BE)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| BE-DJ-01 | Django — installation, projet, apps, modèles, admin | 5h | L-PY-03 |
| BE-DJ-02 | Django — vues, templates, formulaires, authentification | 5h | BE-DJ-01 |
| BE-DJ-03 | Django REST Framework — serializers, viewsets, permissions | 5h | BE-DJ-02, F-09 |
| BE-ND-01 | Node.js & Express — serveur, routing, middleware | 5h | L-JS-05 |
| BE-ND-02 | Node.js — authentification (JWT, bcrypt, sessions) | 4h | BE-ND-01 |
| BE-ND-03 | Node.js — ORM (Prisma ou Sequelize) et intégration BDD | 4h | BE-ND-01, DB-01 |
| BE-SP-01 | Spring Boot — projet, controllers, services, injection de dépendances | 5h | L-JV-03 |
| BE-SP-02 | Spring Boot — JPA/Hibernate, API REST, validation | 5h | BE-SP-01 |
| BE-SP-03 | Spring Boot — Security (JWT, OAuth2) | 5h | BE-SP-02 |
| BE-FL-01 | Flask — fondamentaux, routes, templates, API | 4h | L-PY-02 |
| BE-FA-01 | FastAPI — fondamentaux, Pydantic, async, documentation auto | 4h | L-PY-03, F-09 |

### 3.5 Bases de données (DB)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| DB-01 | PostgreSQL — installation, schémas, CRUD, types de données | 4h | L-SQL-01 |
| DB-02 | PostgreSQL — relations, contraintes, indexation, performance | 4h | DB-01 |
| DB-03 | MongoDB — documents, collections, CRUD, agrégation | 4h | F-09 |
| DB-04 | Modélisation de données (MCD, MLD, normalisation, dénormalisation) | 5h | L-SQL-01 |
| DB-05 | Redis — cache, sessions, pub/sub | 3h | BE-ND-01 ou BE-DJ-01 |

### 3.6 DevOps & Infrastructure (DO)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| DO-01 | Docker — images, containers, Dockerfile, volumes | 5h | F-05 |
| DO-02 | Docker Compose — orchestration multi-services | 3h | DO-01 |
| DO-03 | CI/CD avec GitHub Actions | 4h | F-03, DO-01 |
| DO-04 | Déploiement cloud (Vercel, Railway, Render) | 3h | F-03 |
| DO-05 | Introduction à Kubernetes (pods, services, deployments) | 5h | DO-02 |
| DO-06 | Terraform — Infrastructure as Code, premiers providers | 5h | DO-01, F-05 |
| DO-07 | Nginx — reverse proxy, SSL, configuration de base | 3h | F-05 |
| DO-08 | Monitoring (Prometheus + Grafana) | 4h | DO-01 |

### 3.7 Data & IA (DA)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| DA-01 | Pandas — DataFrames, nettoyage, transformation | 5h | L-PY-02 |
| DA-02 | Visualisation de données (Matplotlib, Seaborn) | 4h | DA-01 |
| DA-03 | Statistiques appliquées pour la data analyse | 5h | L-PY-01 |
| DA-04 | Power BI — connexion données, modèle en étoile, DAX, dashboards | 5h | L-SQL-01 |
| DA-05 | Scikit-learn — régression, classification, évaluation de modèles | 5h | DA-01, DA-03 |
| DA-06 | Introduction au NLP (tokenisation, embeddings, sentiment analysis) | 5h | DA-05 |
| DA-07 | Prompt engineering — techniques avancées pour LLM | 4h | Aucun |
| DA-08 | RAG (Retrieval-Augmented Generation) — concept et implémentation | 5h | DA-07, L-PY-03, DB-03 |
| DA-09 | Introduction à PyTorch (tenseurs, modèles, entraînement) | 5h | DA-05 |
| DA-10 | dbt — transformation de données, tests, documentation | 4h | L-SQL-02 |
| DA-11 | Airflow — orchestration de pipelines de données | 4h | L-PY-02, L-SQL-01 |

### 3.8 Cybersécurité (CY)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| CY-01 | Fondamentaux de la sécurité (CIA, menaces, vulnérabilités, frameworks) | 4h | Aucun |
| CY-02 | Réseaux pour la sécurité (TCP/IP, DNS, ports, Wireshark basics) | 5h | F-01 |
| CY-03 | OWASP Top 10 — comprendre et prévenir les vulnérabilités web | 5h | F-09, L-JS-01 ou L-PY-01 |
| CY-04 | Linux pour la cybersécurité (permissions, logs, hardening) | 4h | F-05 |
| CY-05 | Wazuh — déployer un SIEM open source | 5h | CY-04 |
| CY-06 | Nmap & reconnaissance réseau | 3h | CY-02 |
| CY-07 | Zero Trust — principes et mise en œuvre | 4h | CY-01, CY-02 |
| CY-08 | Conformité & protection des données (RGPD, loi 09-08 Maroc) | 4h | CY-01 |
| CY-09 | Sécuriser une API REST (authentification, rate limiting, CORS, headers) | 4h | F-09, CY-03 |
| CY-10 | Tests de pénétration web — méthodologie et outils (Burp Suite basics) | 5h | CY-03, CY-06 |

### 3.9 ERP & Business (ER)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| ER-01 | Comprendre les ERP — concepts, processus métier, cartographie | 4h | Aucun |
| ER-02 | Odoo fonctionnel — CRM, ventes, achats, stock | 5h | ER-01 |
| ER-03 | Odoo fonctionnel — comptabilité, RH, fabrication | 4h | ER-02 |
| ER-04 | Odoo développement — modèles, vues, héritage | 5h | L-PY-03, ER-02 |
| ER-05 | Odoo développement — API XML-RPC, modules custom | 5h | ER-04 |
| ER-06 | Odoo — intégration et migration de données | 4h | ER-04 |

### 3.10 Compétences transversales (TX)

| ID | Brique | Durée | Prérequis |
|----|--------|-------|-----------|
| TX-01 | Gestion de projet Agile (Scrum, Kanban, sprints) | 4h | Aucun |
| TX-02 | Rédiger de la documentation technique | 3h | F-10 |
| TX-03 | Construire son portfolio développeur | 3h | F-03 |
| TX-04 | Préparer un entretien technique | 4h | F-08 |
| TX-05 | Architecture logicielle — principes (SOLID, Clean Architecture, MVC) | 5h | Tout langage L-*-02+ |
| TX-06 | Design patterns essentiels (Singleton, Factory, Observer, Strategy) | 5h | TX-05 |

---

## 4. Mini-parcours

### 4.1 🔤 Parcours par langage

Des parcours courts pour maîtriser un langage et son écosystème.

---

#### Python — De zéro à autonome
**Durée** : 3 semaines | **9 briques** | **~37h**

```
L-PY-01 → L-PY-02 → L-PY-03 → L-PY-04 → L-PY-05
    ↑ prérequis                       ↓ complété par
  F-07                            DA-01 (optionnel)
                                  BE-DJ-01 (optionnel)
                                  BE-FL-01 (optionnel)
```

| Semaine | Briques | Heures |
|---------|---------|--------|
| S1 | F-07 (Algorithmique) → L-PY-01 (Syntaxe) → L-PY-02 (Fonctions & modules) | 14h |
| S2 | L-PY-03 (POO) → L-PY-04 (Fichiers & données) | 8h |
| S3 | L-PY-05 (Projet & environnements) → **Challenge final** : Script d'automatisation complet | 6h + challenge |

---

#### JavaScript — De zéro à autonome
**Durée** : 3 semaines | **8 briques** | **~35h**

| Semaine | Briques | Heures |
|---------|---------|--------|
| S1 | F-07 → L-JS-01 → L-JS-02 | 14h |
| S2 | L-JS-03 (DOM) → L-JS-04 (ES6+) | 9h |
| S3 | L-JS-05 (Async) → **Challenge final** : App interactive consommant une API publique | 7h + challenge |

---

#### Java — De zéro à autonome
**Durée** : 3 semaines | **8 briques** | **~34h**

| Semaine | Briques | Heures |
|---------|---------|--------|
| S1 | F-07 → L-JV-01 → L-JV-02 | 15h |
| S2 | L-JV-03 (Collections & Streams) → L-JV-04 (Exceptions & I/O) | 9h |
| S3 | TX-05 (Architecture) → **Challenge final** : Application console structurée | 8h + challenge |

---

#### SQL — De zéro à autonome
**Durée** : 2 semaines | **4 briques** | **~19h**

| Semaine | Briques | Heures |
|---------|---------|--------|
| S1 | L-SQL-01 (Fondamentaux) → DB-04 (Modélisation) | 10h |
| S2 | L-SQL-02 (Avancé) → **Challenge final** : Requêtes analytiques complexes sur un dataset e-commerce | 7h + challenge |

---

### 4.2 💼 Parcours par métier

Des parcours orientés vers un profil professionnel cible, composés de briques issues de plusieurs catégories.

---

#### Développeur Frontend React
**Durée** : 4 semaines | **14 briques** | **~58h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | F-01, L-HTML-01, L-CSS-01, L-CSS-02 | Fondations web & CSS moderne |
| S2 | L-JS-01, L-JS-02, L-JS-04, L-JS-05 | JavaScript solide |
| S3 | FE-01, FE-02, FE-03, FE-07 | React + Tailwind |
| S4 | FE-05, FE-09, **Challenge** | Consommation d'API, performance, projet final |

**Challenge final** : Construire un dashboard interactif responsive consommant une API publique, déployé sur Vercel.

---

#### Développeur Backend Python (Django)
**Durée** : 4 semaines | **13 briques** | **~56h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | L-PY-01, L-PY-02, L-PY-03 | Python solide |
| S2 | L-SQL-01, DB-01, DB-04 | Bases de données |
| S3 | BE-DJ-01, BE-DJ-02, F-09 | Django et API |
| S4 | BE-DJ-03, CY-09, **Challenge** | API REST sécurisée, projet final |

**Challenge final** : API RESTful complète avec authentification JWT, connectée à PostgreSQL, documentée avec Swagger.

---

#### Développeur Backend Java (Spring Boot)
**Durée** : 4 semaines | **13 briques** | **~58h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | L-JV-01, L-JV-02, L-JV-03 | Java solide |
| S2 | L-SQL-01, DB-01, DB-02, TX-05 | BDD + architecture |
| S3 | BE-SP-01, BE-SP-02, F-09 | Spring Boot & API REST |
| S4 | BE-SP-03, CY-09, **Challenge** | Sécurité, projet final |

**Challenge final** : Microservice Spring Boot avec API REST, JPA/PostgreSQL, auth JWT, testé et documenté.

---

#### Data Analyst
**Durée** : 4 semaines | **11 briques** | **~52h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | L-PY-01, L-PY-02, L-SQL-01 | Python + SQL |
| S2 | DA-01, DA-02, DA-03 | Pandas, visualisation, statistiques |
| S3 | L-SQL-02, DB-04, DA-04 | SQL avancé, modélisation, Power BI |
| S4 | DA-10, **Challenge** | dbt + projet final |

**Challenge final** : Analyse complète d'un dataset africain (nettoyage, exploration, dashboard Power BI, rapport d'insights).

---

#### DevOps Engineer
**Durée** : 4 semaines | **12 briques** | **~50h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | F-02, F-05, L-BASH-01, F-03 | Linux, Bash, Git |
| S2 | DO-01, DO-02, DO-07 | Docker, Compose, Nginx |
| S3 | DO-03, DO-04 | CI/CD, déploiement cloud |
| S4 | DO-08, CY-04, **Challenge** | Monitoring, hardening, projet final |

**Challenge final** : Conteneuriser une application multi-services, créer un pipeline CI/CD complet, déployer avec monitoring.

---

#### Analyste Cybersécurité
**Durée** : 4 semaines | **11 briques** | **~48h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | CY-01, CY-02, F-05 | Fondamentaux sécu & réseau |
| S2 | CY-04, CY-06, CY-03 | Linux sécu, reconnaissance, OWASP |
| S3 | CY-05, CY-07 | SIEM Wazuh, Zero Trust |
| S4 | CY-08, CY-10, **Challenge** | Conformité, pentest, projet final |

**Challenge final** : Audit de sécurité complet d'un environnement simulé (scan, pentest web, rapport de vulnérabilités, plan de remédiation).

---

#### Consultant ERP / Odoo
**Durée** : 4 semaines | **10 briques** | **~44h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | ER-01, ER-02, TX-01 | ERP + Odoo fonctionnel + Agile |
| S2 | ER-03, L-PY-01, L-PY-02 | Odoo avancé + bases Python |
| S3 | L-PY-03, ER-04 | POO + développement Odoo |
| S4 | ER-05, ER-06, **Challenge** | API, migration, projet final |

**Challenge final** : Paramétrage complet d'Odoo pour une PME fictive + développement d'un module custom.

---

#### Développeur Full Stack JS
**Durée** : 6 semaines | **19 briques** | **~80h**

| Semaine | Briques | Focus |
|---------|---------|-------|
| S1 | F-01, F-03, L-HTML-01, L-CSS-01, L-CSS-02 | Web + Git + CSS |
| S2 | L-JS-01, L-JS-02, L-JS-04, L-JS-05 | JavaScript complet |
| S3 | FE-01, FE-02, FE-03, FE-05 | React & API |
| S4 | BE-ND-01, BE-ND-02, DB-01 | Node/Express + PostgreSQL |
| S5 | BE-ND-03, DO-01, DO-03 | ORM, Docker, CI/CD |
| S6 | FE-09, CY-09, **Challenge** | Performance, sécurité, projet final |

**Challenge final** : Application full stack (React + Node + PostgreSQL) conteneurisée, déployée avec CI/CD.

---

### 4.3 🎯 Parcours par compétence

Des parcours ultra-ciblés sur une compétence technique précise. Le format le plus court (1-2 semaines).

---

#### Docker — De zéro à la production
**Durée** : 1 semaine | **4 briques** | **~16h**

| Briques | Heures |
|---------|--------|
| F-05 (Linux essentiel) → DO-01 (Docker) → DO-02 (Compose) → DO-07 (Nginx) | 16h |

**Challenge** : Conteneuriser une app frontend + backend + BDD avec Docker Compose et Nginx en reverse proxy.

---

#### Git — Maîtrise complète
**Durée** : 1 semaine | **3 briques** | **~9h**

| Briques | Heures |
|---------|--------|
| F-02 (Terminal) → F-03 (Git fondamentaux) → F-04 (Git avancé) | 9h |

**Challenge** : Gérer un projet collaboratif simulé avec branches, pull requests, résolution de conflits et release tags.

---

#### API REST — Concevoir et consommer
**Durée** : 2 semaines | **5 briques** | **~21h**

| Briques | Heures |
|---------|--------|
| F-09 (Intro API) → BE-DJ-03 ou BE-ND-01 (Construire une API) → FE-05 (Consommer une API) → CY-09 (Sécuriser une API) | 21h |

**Challenge** : Créer une API, la documenter avec Swagger, la consommer avec React, et implémenter la sécurité.

---

#### CI/CD — Automatiser le déploiement
**Durée** : 1 semaine | **3 briques** | **~11h**

| Briques | Heures |
|---------|--------|
| F-03 (Git) → DO-01 (Docker) → DO-03 (GitHub Actions) | 11h |

**Challenge** : Pipeline complet : push → lint → test → build → deploy sur Render ou Railway.

---

#### Prompt Engineering & RAG
**Durée** : 2 semaines | **3 briques** | **~13h**

| Briques | Heures |
|---------|--------|
| DA-07 (Prompt engineering) → DA-08 (RAG) → **Challenge** | 13h |

**Challenge** : Construire un chatbot RAG spécialisé sur un corpus documentaire (ex: documentation technique d'une entreprise).

---

#### Sécuriser une application web
**Durée** : 2 semaines | **4 briques** | **~17h**

| Briques | Heures |
|---------|--------|
| CY-01 (Fondamentaux) → CY-03 (OWASP Top 10) → CY-09 (Sécuriser une API) → CY-10 (Pentest web) | 17h |

**Challenge** : Trouver et corriger les vulnérabilités d'une application intentionnellement vulnérable (style DVWA).

---

#### Power BI — Dashboards professionnels
**Durée** : 2 semaines | **4 briques** | **~19h**

| Briques | Heures |
|---------|--------|
| L-SQL-01 (SQL) → DB-04 (Modélisation) → DA-04 (Power BI) → **Challenge** | 19h |

**Challenge** : Dashboard commercial interactif avec drill-down, KPIs dynamiques et modèle en étoile.

---

#### React — De zéro au dashboard
**Durée** : 2 semaines | **6 briques** | **~25h**

| Briques | Heures |
|---------|--------|
| L-JS-04 (ES6+) → FE-01 → FE-02 → FE-03 → FE-05 → FE-07 | 25h |

**Challenge** : Dashboard interactif consommant une API avec routing, state management et Tailwind CSS.

---

## 5. Matrice de réutilisation des briques

Ce tableau montre comment les briques sont partagées entre les parcours métier (chaque ✓ = la brique est utilisée dans ce parcours) :

| Brique | Frontend React | Backend Django | Backend Java | Data Analyst | DevOps | Cybersécurité | Full Stack JS | ERP Odoo |
|--------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| F-01 | ✓ | | | | | | ✓ | |
| F-02 | | | | | ✓ | | | |
| F-03 | | | | | ✓ | | ✓ | |
| F-05 | | | | | ✓ | ✓ | | |
| F-07 | | ✓ | ✓ | ✓ | | | | |
| F-09 | | ✓ | ✓ | | | | | |
| L-PY-01 | | ✓ | | ✓ | | | | ✓ |
| L-PY-02 | | ✓ | | ✓ | | | | ✓ |
| L-PY-03 | | ✓ | | | | | | ✓ |
| L-JS-01 | ✓ | | | | | | ✓ | |
| L-JS-04 | ✓ | | | | | | ✓ | |
| L-SQL-01 | | ✓ | ✓ | ✓ | | | | |
| DB-01 | | ✓ | ✓ | | | | ✓ | |
| DO-01 | | | | | ✓ | | ✓ | |
| CY-01 | | | | | | ✓ | | |
| CY-09 | | ✓ | ✓ | | | ✓ | ✓ | |
| TX-05 | | | ✓ | | | | | |
| ER-01 | | | | | | | | ✓ |

---

## 6. Système de progression

### Badges

| Badge | Condition | Visuel |
|-------|-----------|--------|
| **Brique complétée** | Quiz réussi ≥ 70% | 🧱 |
| **Challenge réussi** | Challenge soumis et validé | 🏆 |
| **Parcours complété** | Toutes les briques + challenge final | 🎓 |
| **Multi-path** | 3 parcours complétés | ⭐ |
| **Streak 7 jours** | 7 jours consécutifs d'activité | 🔥 |
| **Helper** | 10+ réponses utiles sur le forum | 🤝 |

### Profil public

Chaque apprenant dispose d'un profil affichant ses briques complétées, ses parcours, ses badges et les liens vers ses projets (challenges). Ce profil est partageable et peut servir de portfolio.

---

## 7. Stack technique de la plateforme

| Composant | Solution recommandée | Justification |
|-----------|---------------------|---------------|
| CMS / Contenu | Notion API + Next.js ou Docusaurus | Rédaction facile, rendu statique rapide |
| Code sandboxes | StackBlitz WebContainers ou CodeSandbox embeds | Exécution dans le navigateur, zéro config |
| Quiz | Composants React custom avec stockage résultats | Contrôle total, pas de dépendance externe |
| Forum | Discord (MVP) → solution intégrée (Phase 2) | Communauté active, gratuit |
| Auth | Clerk ou Auth0 | SSO, gestion profils, gratuit jusqu'à 10K users |
| Hébergement | Vercel (frontend) + Supabase (BDD + auth) | Gratuit pour le MVP, scalable |
| Analytics | PostHog (open source) | Suivi de progression, funnels, respect RGPD |
| Certificats | Accredible ou PDF généré automatiquement | Vérifiable, ajout LinkedIn |

---

## 8. Pistes de développement

### Phase 1 — MVP (Mois 1-2)
- Publier les briques **Fondations (F)** + **Python (L-PY)** + **JavaScript (L-JS)**
- Lancer 2 parcours par langage (Python, JavaScript) + 1 parcours métier (Data Analyst)
- Forum Discord
- 100 premiers utilisateurs beta

### Phase 2 — Expansion (Mois 3-5)
- Ajouter les briques **Frontend, Backend, Database, DevOps**
- Lancer tous les parcours métier + parcours par compétence
- Système de badges et profil public
- Partenariats avec des universités pour reconnaissance

### Phase 3 — Scale (Mois 6-12)
- Contenu vidéo court (si budget disponible) en complément des articles
- Application mobile (PWA ou React Native)
- Mentorat IA intégré
- Traduction des briques clés en anglais
- Programme ambassadeurs dans les universités africaines
