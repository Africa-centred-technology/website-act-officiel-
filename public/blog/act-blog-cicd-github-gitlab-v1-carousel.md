# GitHub Actions, GitLab CI & compagnie

*Comment arrêter de redouter le vendredi soir — par ACT*

**10× plus de livraisons. 5× moins de bugs en production.**

C'est l'écart mesuré entre les équipes qui ont mis en place une chaîne CI/CD et celles qui déploient encore à la main.

9 slides pour comprendre ce qui se passe vraiment dans un pipeline — et choisir l'outil qui colle à votre contexte, pas à celui de la Silicon Valley.

---

## Avant le CI/CD : le déploiement du vendredi 18h

Vous connaissez la scène. Code "prêt" depuis mardi. Personne ne veut y toucher. Vendredi 18h, quelqu'un tire la courte paille.

SSH sur le serveur. `git pull`. Prier. Quelque chose casse à 19h12. Le week-end est mort.

> *Le CI/CD inverse complètement la logique : les développeurs commitent leur code, et une chaîne automatisée exécute les tests, build l'application, et la déploie en production — des dizaines de fois par jour.*

**Pas du courage. De l'automatisation.**

Et en 2026, deux plateformes se partagent l'essentiel du marché : **GitHub Actions** et **GitLab CI**.

---

## Le principe : un commit déclenche tout

À chaque `git push`, la plateforme exécute une **séquence prédéfinie** dans un fichier YAML versionné avec votre code.

> commit → tests → build → analyse → déploiement → notification

Chaque étape échoue vite ou passe la main à la suivante. Si un test casse, le déploiement n'a jamais lieu. Si tout est vert, le code est en production avant que vous ayez fini votre café.

- **Trigger** — push, pull request, tag, planning
- **Build** — compilation, génération des artefacts
- **Test** — unit, intégration, end-to-end
- **Deploy** — staging, puis production

Le YAML est versionné. **Votre infrastructure de livraison devient du code relisable, auditable, reproductible.**

---

## GitHub Actions vs GitLab CI : la comparaison qui tranche

**GitHub Actions — la voie rapide**

- **Hébergement** : Cloud (US)
- **Écosystème** : 20 000+ actions communautaires
- **Gratuit** : 2 000 min/mois (privé)
- **Courbe** : douce
- **Pipelines** : suffisants pour 90% des cas
- **Souveraineté** : ❌ données chez Microsoft

**GitLab CI — la voie souveraine**

- **Hébergement** : Cloud **ou** self-hosted
- **Écosystème** : catalogue plus restreint
- **Gratuit** : illimité en self-hosted
- **Courbe** : plus raide
- **Pipelines** : excellents (DAG, parallélisme)
- **Souveraineté** : ✅ maîtrise totale possible

> *GitHub gagne sur la simplicité. GitLab gagne sur le contrôle. Le bon choix dépend moins de l'outil que de votre contexte.*

---

## Les 4 critères qui changent tout en Afrique

### 1️⃣ Souveraineté des données
Banque, santé, gouvernement, télécom : si la réglementation impose un hébergement local, GitHub est **disqualifié d'office**. GitLab self-hosted devient le seul choix viable.

### 2️⃣ Connectivité
Une coupure internet de 6h fige toute votre chaîne GitHub. Avec GitLab sur un serveur local, vos pipelines continuent à tourner.

### 3️⃣ Coûts
2 000 minutes/mois GitHub = vite atteintes sur un projet actif. Au-delà, la facture grimpe. GitLab self-hosted ne coûte que l'infrastructure.

### 4️⃣ Compétences
Démarrer GitHub Actions : un après-midi. Maintenir une instance GitLab : un profil DevOps sénior. **Pas la même équation.**

---

## Le pipeline minimal qui fait déjà 90% du travail

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest'
    steps:
      - run: ssh user@server 'cd /var/www && git pull && pm2 restart app'
```

**Vingt lignes.** Tests, build, déploiement conditionnel sur `main`. C'est tout ce qu'il faut pour ne plus jamais déployer à la main.

---

## Les 3 pièges qui sabotent les pipelines

### 1️⃣ Les builds qui durent 25 minutes
Sans cache des dépendances, chaque pipeline re-télécharge tout. Solution : **caching agressif** sur `node_modules`, `.venv`, les images Docker. *Objectif : moins de 5 minutes.*

### 2️⃣ Les secrets dans le code
Une clé API committée par erreur dans un YAML public = compte compromis en quelques heures. Les bots scrutent GitHub en permanence. Utilisez **toujours** un gestionnaire de secrets — jamais en clair.

### 3️⃣ Le déploiement direct en prod
Sauter l'étape staging, c'est jouer à la roulette russe. **Staging → smoke tests → production**, dans cet ordre, sans raccourci.

---

## Ce que vous faites lundi matin

**Si votre équipe n'a pas de CI/CD** → commencez par un pipeline de **tests** uniquement. Pas de déploiement automatique encore. Juste : chaque push lance les tests, le résultat est visible. *Demi-journée de travail. Gain immédiat.*

**Si vos pipelines existent mais traînent** → mesurez le temps total. Au-delà de 10 minutes, vos développeurs ne les attendent plus. Cache, parallélisation, fail-fast.

**Si vous opérez dans un secteur régulé** → ne lancez rien avant d'avoir tranché la question hébergement. Migrer de GitHub vers GitLab self-hosted *après coup* est douloureux.

**Ne pas avoir de CI/CD en 2026 n'est plus un retard technique. C'est un handicap compétitif.**

---

## Allez plus loin

Cet article pose les fondations. La suite ira plus loin :
**Tests automatisés · GitOps · sécurité de la supply chain · observabilité.**

> Pour passer à la pratique :
> **Formation "DevOps & CI/CD"**
> ACT University

→ a-ct.ma/formations

