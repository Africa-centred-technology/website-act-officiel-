---
titre: Prompt & Context Engineering — Le saut entre utilisateur et opérateur d'IA
slug: prompt-context-engineering-3h
domaine: llm
niveau: debutant
duree_apprenant: 3 heures (atelier présentiel intensif)
duree_production: 12 heures
prerequis:
  - Avoir déjà utilisé ChatGPT, Claude, Gemini ou Copilot au moins 5 fois
  - Disposer d'un ordinateur avec navigateur et d'au moins un compte LLM actif (gratuit accepté)
  - Être à l'aise avec un brief professionnel écrit (rédaction, lecture critique)
outils:
  - ChatGPT (web — version gratuite minimum)
  - Claude (web — version gratuite minimum)
  - Perplexity (web — version gratuite)
  - Outil de génération d'image au choix (DALL-E intégré, Imagen, Midjourney…)
  - Canva (web — version gratuite)
colab_compatible: non (formation sans code)
date_creation: 2026-04
date_revue_prevue: 2026-10
auteur: Sohaib — ACT University
badge_linkedin: en cours
---

# Prompt & Context Engineering — Le saut entre utilisateur et opérateur d'IA

## Section 1 — Accroche

Vous travaillez à côté d'un collègue. Vous utilisez le même ChatGPT. Vous avez payé le même abonnement. Vous tapez tous les deux des questions, lisez les réponses, copiez-collez dans vos documents.

Et pourtant, à la fin du mois, lui produit un dossier d'appel d'offres qui décroche un client. Vous, vous produisez un document que votre directeur vous demande de "retravailler". Même outil. Même temps. Résultats radicalement différents.

Cette différence n'est pas une question de talent. C'est une question de méthode. Cette formation vous apprend cette méthode. À la fin des 3 heures, vous aurez vécu — pas appris — le passage de l'utilisateur naïf à l'opérateur méthodique d'IA générative.

**Ce que vous saurez faire à la fin de cette formation :**
- Choisir le bon LLM pour une tâche donnée plutôt que d'utiliser toujours le même par habitude
- Construire un prompt structuré en 6 blocs au lieu d'une question d'une ligne
- Préparer et injecter du contexte métier dans une session pour obtenir un résultat exploitable
- Orchestrer 3 ou 4 outils complémentaires sur une même livraison professionnelle
- Diagnostiquer en 30 secondes pourquoi une sortie d'IA est décevante et la corriger

**Ce que cette formation n'est PAS :**
- Une formation au développement, à l'API ou au fine-tuning de modèles
- Une revue exhaustive de tous les LLM du marché — on apprend la méthode, pas le catalogue
- Un atelier d'automatisation no-code (Make, n8n, Zapier) — c'est un autre sujet

---

## Section 2 — Public cible

**Cette formation s'adresse à :**
- Cadres et managers marocains qui utilisent l'IA depuis quelques mois sans être satisfaits du rendu
- Consultants, commerciaux, chefs de projet qui produisent régulièrement des livrables écrits
- Entrepreneurs qui veulent industrialiser l'usage de l'IA dans leurs livrables clients
- Formateurs et enseignants qui veulent comprendre avant de transmettre

**Cette formation ne s'adresse PAS à :**
- Développeurs cherchant à intégrer une API LLM dans une application — voir la formation "LLM en production"
- Débutants absolus n'ayant jamais ouvert ChatGPT — installer l'outil et tâtonner d'abord, revenir ensuite

**Prérequis réels :**
- Avoir tapé au moins une dizaine de prompts en conditions réelles, même décevants
- Savoir reconnaître un bon livrable professionnel dans son domaine (vous devez pouvoir juger la sortie de l'IA)
- Apporter un cas réel à traiter pendant l'atelier — un livrable que vous deviez produire cette semaine

---

## Section 3 — Fil conducteur narratif

**Entreprise fictive fil conducteur :**
> **Atlas Bureautique SARL** — fournisseur de mobilier et fournitures de bureau — Casablanca, Aïn Sebaâ
> Gérant : Karim Bennani, 38 ans, ingénieur commercial reconverti en chef d'entreprise.
> Effectif : 12 personnes. CA 2025 : 14 M MAD.
> Problème : l'OCP Group vient de publier un appel d'offres pour le réaménagement complet de ses plateaux bureaux à Khouribga. Karim a 5 jours pour produire un dossier de réponse complet et différenciant. Sa concurrence inclut deux acteurs internationaux établis. Il sait qu'un dossier "moyen" perd l'AO d'avance.

**Arc narratif de la formation :**
Karim ouvre ChatGPT et tape : "Aide-moi à répondre à l'appel d'offres de l'OCP pour du mobilier de bureau." Il obtient une réponse de 800 mots, polie, générique, inutilisable. À la fin de la formation, vous aurez reproduit le parcours de Karim : la même tâche traitée d'abord avec sa méthode actuelle (résultat plat), puis avec la méthode opérateur (résultat livrable au client).

**Cas pratique fil conducteur :**
- Brief : appel d'offres OCP — fourniture et installation de mobilier de bureau pour 180 postes de travail
- Livrables attendus dans le dossier : note de synthèse, argumentaire différenciant, plan d'exécution, devis structuré, réponses aux objections, email d'envoi
- Évolution : le même cas est traité 2 fois — séquence 4 (méthode naïve, échec) puis séquence 6 (méthode opérateur, effet wow)

---

## Section 4 — Carte des dépendances conceptuelles

```
Séquence 1 → introduit : paradoxe utilisateur, notion de levier d'usage
Séquence 2 → introduit : IA, LLM, génération probabiliste, fenêtre de contexte, hallucination
Séquence 3 → réutilise : LLM, fenêtre de contexte | introduit : écosystème, spécialités modèles, modalités
Séquence 4 → réutilise : tout ce qui précède | introduit : la frustration calibrée (mécanique pédagogique)
Séquence 5 → réutilise : la frustration de S4 | introduit : 6 blocs du prompt, rôles, exemples, contraintes, format de sortie
Séquence 6 → réutilise : prompt structuré | introduit : contexte comme actif réutilisable, projets/GPTs personnalisés, orchestration multi-outils, effet wow
```

Signal d'alerte vérifié : chaque séquence relit ce que la précédente a installé. La S4 est volontairement un point de rupture — c'est l'élément narratif clé de la formation.

---

## Section 5 — Plan de la formation (3h)

| # | Titre | Durée | Format | Énergie |
|---|---|---|---|---|
| S1 | Le paradoxe — pourquoi deux personnes, deux résultats ? | 15 min | Frontal interactif | ⚡ Forte |
| S2 | IA, LLM, et la mécanique cachée derrière le chatbot | 20 min | Frontal + démo | 🧠 Réflexive |
| S3 | L'écosystème — chaque modèle a sa spécialité | 20 min | Frontal + démo comparative | 🗺️ Cartographie |
| S4 | Le challenge — votre méthode actuelle face au mur | 40 min | Atelier individuel | 🔥 Frustration calibrée |
| ☕ | Pause | 10 min | — | — |
| S5 | Les 6 blocs du prompt qui change tout | 45 min | Frontal + pratique guidée | 🛠️ Construction |
| S6 | Context engineering et orchestration — l'effet wow | 35 min | Démo + reprise du challenge | 🚀 Délivrance |
| 🎯 | Clôture — engagements et plan de pratique | 15 min | Cercle de parole | 🌱 Ancrage |

**Total : 3h00 (180 min) — pause incluse.**

---

# DÉROULÉ DÉTAILLÉ

## Séquence 1 — Le paradoxe (15 min) ⚡

> À la fin de cette séquence, les participants ont accepté l'idée que l'écart de résultat ne vient pas de l'outil mais de l'opérateur — et veulent savoir comment combler cet écart.

### 1.1 — Ouverture (3 min)

Vous démarrez sans projeter de slide. Vous racontez deux histoires courtes.

> "La semaine dernière, j'ai vu deux directeurs marketing utiliser le même ChatGPT pour préparer une présentation client. Le premier a sorti un brouillon en 4 heures qu'il a fini par réécrire la nuit. Le second a sorti une présentation prête à envoyer en 35 minutes. Même outil. Même version. Même brief. La différence ne s'explique pas par la chance."

Pause. Vous laissez la salle respirer. Puis :

> "Aujourd'hui, vous êtes presque tous le premier directeur. Dans 3 heures, vous serez tous le second. Pas parce que vous serez devenus plus intelligents. Parce que vous aurez compris ce qui se passe vraiment quand vous parlez à un LLM."

### 1.2 — Mini-sondage à main levée (4 min)

Trois questions, à main levée, dans cet ordre :

1. "Qui ici utilise un LLM au moins une fois par semaine ?" → presque toutes les mains montent.
2. "Qui a déjà été déçu par un résultat au point de ne pas l'utiliser et de tout réécrire ?" → la majorité des mains restent levées.
3. "Qui a déjà partagé sa méthode de prompting avec un collègue de manière structurée ?" → quasi personne.

Conclusion à projeter ou écrire au tableau :
> Tout le monde utilise. Personne n'a appris. C'est le seul outil professionnel qu'on adopte sans formation préalable.

### 1.3 — La courbe d'usage (5 min)

Projeter ou dessiner au tableau cette courbe — la dessiner en direct est plus marquant que la projeter.

```
Niveau de
résultat
   ▲
   │                                              ⭐ Opérateur
   │                                          ╱
   │                                      ╱
   │                                  ╱
   │                              ╱
   │              ⭐ Utilisateur ╱
   │              ────────────╱
   │ ⭐ Curieux ╱
   │  ╱
   └────────────────────────────────────────────►  Effort méthodologique
      Test     Routine     Méthode      Système
```

Trois plateaux observés :
- **Curieux** (semaine 1) : "Wow ça marche". On copie-colle, on s'émerveille.
- **Utilisateur** (mois 1 à 6) : on a sa routine, ses 5 prompts favoris, on est productif sur des tâches simples mais on bute sur les tâches complexes.
- **Opérateur** (à partir du moment où on a une méthode) : on traite des livrables complexes en orchestrant l'IA — ce que l'on va atteindre aujourd'hui.

> "Vous êtes presque tous au plateau utilisateur. La marche entre utilisateur et opérateur n'est pas une marche d'effort. C'est une marche de méthode."

### 1.4 — Le contrat de la formation (3 min)

Annoncez clairement le contrat :

> "Voici ce qui va se passer aujourd'hui. Pendant les 30 premières minutes, je vais vous donner du vocabulaire — l'IA, les LLM, l'écosystème. Pas pour vous transformer en experts techniques. Pour qu'on puisse parler la même langue ensuite. Puis, pendant 40 minutes, je vais vous mettre en difficulté volontairement avec un cas réel. Vous allez le traiter avec votre méthode actuelle, et je vous garantis que la majorité d'entre vous ne sera pas satisfaite du résultat. Ce n'est pas un piège. C'est le seul moyen de mesurer ce qu'on a gagné à la fin. Ensuite, on installera la méthode. Et à la fin, on refera exactement le même exercice. Vous verrez la différence."

---

## Séquence 2 — IA, LLM, et la mécanique cachée (20 min) 🧠

> À la fin de cette séquence, les participants peuvent expliquer en 3 phrases ce qu'est un LLM, comprennent pourquoi il "hallucine" parfois, et savent ce qu'est une fenêtre de contexte.

### 2.1 — Rappel d'ouverture

> "Vous savez maintenant qu'il existe un écart entre utilisateur et opérateur. Vous ne savez pas encore pourquoi cet écart existe. Pour le comprendre, il faut ouvrir la boîte noire — pas trop, juste ce qu'il faut pour reprendre le contrôle."

### 2.2 — Pyramide IA → ML → DL → LLM (5 min)

Dessinez ou projetez :

```
    ┌─────────────────────────────────────┐
    │  Intelligence Artificielle (IA)     │
    │  Toute machine qui imite un         │
    │  comportement intelligent           │
    │  ┌───────────────────────────────┐  │
    │  │  Machine Learning (ML)        │  │
    │  │  La machine apprend de        │  │
    │  │  données, sans règles écrites │  │
    │  │  ┌─────────────────────────┐  │  │
    │  │  │  Deep Learning (DL)     │  │  │
    │  │  │  ML avec réseaux de     │  │  │
    │  │  │  neurones profonds      │  │  │
    │  │  │  ┌───────────────────┐  │  │  │
    │  │  │  │  LLM              │  │  │  │
    │  │  │  │  DL spécialisé    │  │  │  │
    │  │  │  │  sur le langage   │  │  │  │
    │  │  │  └───────────────────┘  │  │  │
    │  │  └─────────────────────────┘  │  │
    │  └───────────────────────────────┘  │
    └─────────────────────────────────────┘
```

Définition à mémoriser, courte :

> Un **LLM** (Large Language Model) est un programme qui a lu un volume colossal de textes et qui, quand vous lui donnez un début, prédit la suite la plus probable mot par mot.

Insistez : **mot par mot**. Le LLM ne "réfléchit" pas comme vous. Il prédit. Cette différence change tout pour la suite.

### 2.3 — La démonstration de la prédiction (5 min)

Démonstration en direct, projetée. Tapez dans ChatGPT ou Claude :

```
Complète cette phrase : "Le directeur de Marjane Holding a annoncé hier que..."
```

Lancez 3 fois la même requête (un nouveau chat à chaque fois). Vous obtenez 3 réponses différentes. Pourquoi ? Parce que le LLM choisit à chaque mot parmi plusieurs candidats probables, avec une part d'aléa. Ce n'est pas une base de données. Ce n'est pas une recherche Google. C'est une machine probabiliste.

> "Quand vous comprenez ça, vous comprenez aussi pourquoi 'donner plus de contexte' n'est pas une politesse. C'est ce qui réduit l'espace des suites possibles. Plus le contexte est précis, moins la machine a de marge d'erreur."

### 2.4 — Pourquoi on a créé les LLM (3 min)

Trois étapes courtes, racontées comme une histoire :

1. **Avant 2017** : on faisait du traitement du langage avec des règles écrites à la main. Coûteux, fragile, ne se généralisait pas.
2. **2017 — l'article "Attention is all you need"** : Google publie l'architecture Transformer. Pour la première fois, un modèle peut "regarder" tous les mots d'un texte en même temps et comprendre les relations entre eux.
3. **2018-2022** : course à la taille (BERT, GPT-2, GPT-3). On découvre une chose étonnante : plus on agrandit le modèle, plus il devient bon à des tâches qu'on ne lui a jamais explicitement enseignées.
4. **Novembre 2022** : ChatGPT sort en grand public. En 5 jours il a un million d'utilisateurs. La technologie de laboratoire devient un outil de bureau.
5. **2023-2026** : extension multimodale (image, voix, vidéo), agents (l'IA qui agit, pas seulement qui parle), et explosion de l'écosystème — le sujet de la séquence suivante.

### 2.5 — La fenêtre de contexte et l'hallucination (5 min)

Deux concepts à installer maintenant car ils reviendront :

**Fenêtre de contexte** : la quantité de texte que le LLM peut "voir" en même temps dans une conversation. Mesurée en tokens (un token = environ ¾ d'un mot français). Plus la fenêtre est large, plus vous pouvez injecter de matière (un cahier des charges complet, un historique d'échanges, un livre entier). Selon les modèles, on va de quelques milliers de tokens à plusieurs millions. Cette fenêtre est votre espace de travail — vous apprendrez à le remplir intelligemment.

**Hallucination** : le LLM produit une affirmation factuellement fausse mais formulée avec autant d'assurance qu'une affirmation vraie. Cause : il a été entraîné à produire du texte plausible, pas du texte vrai. Conséquence directe : tout ce que le LLM dit doit être vérifié si la décision a un coût. Ce n'est pas une faiblesse à corriger, c'est une propriété de la technologie à connaître.

> **À retenir** : un LLM prédit, il ne vérifie pas. Plus vous lui donnez de contexte précis, plus vous réduisez sa zone d'invention. Tout ce qu'il affirme sans contexte fourni est à vérifier.

---

## Séquence 3 — L'écosystème et les spécialités (20 min) 🗺️

> À la fin de cette séquence, les participants ont en tête une carte simplifiée des familles de LLM, savent que chaque modèle a une zone de force, et arrêtent d'utiliser un seul outil par défaut.

### 3.1 — Pont conceptuel

> "Vous savez maintenant ce qu'est un LLM. Vous pensez peut-être qu'ils se valent tous. C'est faux. Comme un menuisier ne fait pas tout avec la même scie, un opérateur d'IA ne fait pas tout avec le même modèle."

### 3.2 — La carte des familles (8 min)

Présentez une carte structurée. Les noms de modèles évoluent vite — la carte est conçue pour rester valable même quand les modèles changent. Insistez sur les **familles**, pas sur les versions du jour.

| Famille | Acteurs principaux | Force dominante | Cas d'usage typique |
|---|---|---|---|
| **Généralistes premium fermés** | OpenAI (GPT), Anthropic (Claude), Google (Gemini) | Qualité de raisonnement, suivi d'instructions complexes | Rédaction longue, analyse, code complexe |
| **Open source** | Meta (Llama), Mistral, Qwen, DeepSeek | Souveraineté, déploiement local, coût marginal | Cas où la donnée ne doit pas sortir, automatisation à volume |
| **Spécialistes recherche web** | Perplexity, ChatGPT search, You.com | Sourcage en temps réel | Veille, vérification factuelle, état de l'art |
| **Spécialistes code** | Cursor, GitHub Copilot, Codex, Claude Code | Compréhension de bases de code entières | Développement, refactoring, debug |
| **Multimodaux (texte+image+voix)** | GPT-4o, Gemini, Claude (vision) | Lecture d'images, génération vocale | Analyse de documents scannés, accessibilité |
| **Générateurs d'images** | Midjourney, DALL-E, Imagen, Stable Diffusion | Création visuelle | Visuels marketing, illustrations, maquettes |
| **Agents intégrés** | Claude (Computer Use, MCP), ChatGPT agents, Manus | Action dans des outils tiers | Automatisation de workflows complets |

### 3.3 — Démonstration comparative en direct (8 min)

Un même prompt simple, lancé en direct dans 3 outils différents. Choisissez quelque chose de discriminant. Suggestion :

> "Je suis directeur d'une PME marocaine de 12 personnes dans la fourniture de bureau. Donne-moi 3 angles différenciants crédibles pour me positionner contre des acteurs internationaux dans une réponse à appel d'offres OCP."

Lancez la même requête dans :
1. ChatGPT (généraliste premium)
2. Claude (généraliste premium)
3. Perplexity (spécialiste recherche web)

Les participants observent à voix haute ce qui change : style, structure, présence de sources, profondeur. Vous ne dites pas "le meilleur c'est X". Vous montrez que **chaque sortie a une signature** et que choisir l'outil c'est déjà 50% du travail.

### 3.4 — La règle de poche (4 min)

À écrire au tableau, c'est ce qu'ils doivent retenir :

> **Quatre questions avant de choisir un LLM :**
> 1. Ai-je besoin d'informations à jour ? → Perplexity ou ChatGPT search
> 2. Ai-je besoin de raisonner sur un long document ? → Claude (fenêtre large)
> 3. Ai-je besoin de produire du code ? → Cursor, Claude Code ou Copilot
> 4. La tâche est-elle générique ? → ChatGPT ou Claude au choix

> **À retenir** : votre erreur la plus fréquente est d'avoir un seul LLM ouvert. Un opérateur a 3 onglets ouverts en même temps et sait ce que chaque onglet fait mieux que les autres.

---

## Séquence 4 — Le challenge (40 min) 🔥

> À la fin de cette séquence, les participants ont eu le temps de produire un livrable de qualité moyenne avec leur méthode actuelle, et constatent par eux-mêmes les limites de cette méthode. La frustration est l'objectif pédagogique — calibrée, non humiliante.

### 4.1 — Présentation du challenge (5 min)

Distribuez le brief par écrit (papier ou fichier). Le brief doit tenir sur une page recto. Voici le contenu à projeter et distribuer :

---

**📄 BRIEF — RÉPONSE APPEL D'OFFRES OCP**

> **Contexte** : Vous êtes Karim Bennani, gérant d'**Atlas Bureautique SARL**, PME basée à Casablanca, Aïn Sebaâ. 12 employés. CA 14 M MAD en 2025. Vous fournissez du mobilier et des fournitures de bureau aux entreprises marocaines. Votre clientèle actuelle : PME locales, quelques administrations.
>
> **L'enjeu** : L'OCP Group lance un appel d'offres pour le réaménagement complet de ses plateaux bureaux à Khouribga — 180 postes de travail. Mobilier, cloisons acoustiques, ergonomie, livraison et installation comprises. Budget annoncé : entre 4 et 6 M MAD. Délai de réponse : 5 jours ouvrés.
>
> **Concurrence identifiée** : 2 acteurs internationaux établis (filiales de grands groupes français), 3 acteurs marocains comparables à vous.
>
> **Votre handicap** : vous n'avez jamais répondu à un AO de cette taille. Vous savez que produire un dossier "moyen" vous fait perdre l'AO d'avance.
>
> **Livrables attendus dans le dossier** :
> 1. Note de synthèse exécutive — 1 page, à destination du décideur OCP
> 2. Argumentaire différenciant — 3 angles solides, factualisables
> 3. Plan d'exécution avec planning macro
> 4. Structure du devis (sans chiffrage final, juste la structure des postes)
> 5. Anticipation des 5 objections probables et réponses préparées
> 6. Email d'envoi du dossier — ton, longueur, accroche
>
> **Votre mission, maintenant** : produire ces 6 livrables avec votre méthode habituelle. Vous avez 30 minutes. Tous les outils IA que vous avez l'habitude d'utiliser sont autorisés.

---

### 4.2 — Production individuelle (30 min)

Les participants travaillent **chacun de leur côté**, sur leur ordinateur, avec les outils qu'ils utilisent au quotidien. Ils ne reçoivent **aucun conseil** pendant cette phase. Vous circulez sans intervenir, sauf pour confirmer que tout le monde est en train de produire.

Pourquoi 30 minutes et pas plus : c'est le temps qu'on accorde dans la vraie vie à ce genre de tâche quand on est sous pression. C'est aussi le temps suffisant pour que la majorité produise quelque chose, et insuffisant pour que les meilleurs s'en sortent par la rigueur seule.

Pendant que vous circulez, repérez :
- Qui prompte en une seule ligne ?
- Qui ouvre un seul outil ?
- Qui ne donne aucun contexte sur Atlas Bureautique ?
- Qui se contente du premier jet ?

Notez 2 ou 3 cas pour le débrief.

### 4.3 — Débrief honnête (5 min)

À l'issue des 30 minutes, ne demandez pas "alors c'était bien ?" — demandez :

> "Levez la main si vous enverriez votre dossier tel quel à un décideur OCP qui peut signer 5 millions de dirhams."

Quasi personne ne lève la main. C'est le signal pédagogique attendu.

Ensuite, demandez à 2 ou 3 personnes de partager **brièvement** ce qui leur manque dans leur sortie. Les réponses typiques que vous allez entendre :

- "Le résultat est trop générique"
- "Ça ne ressemble pas à un dossier Atlas Bureautique"
- "Les arguments sont creux"
- "L'IA a inventé un chiffre que je ne peux pas vérifier"
- "Je ne savais pas par où commencer"

Notez ces phrases au tableau. Elles vont structurer la séquence suivante.

> "Ces frustrations ne sont pas de votre faute. Elles viennent toutes d'une seule cause : vous avez parlé à l'IA comme à un moteur de recherche. Dans 45 minutes, vous lui parlerez comme à un assistant. La différence est totale."

---

## ☕ Pause — 10 min

---

## Séquence 5 — Les 6 blocs du prompt qui change tout (45 min) 🛠️

> À la fin de cette séquence, les participants savent construire un prompt structuré, l'ont fait sur leur cas réel, et ont vu un changement immédiat dans la qualité de la sortie.

### 5.1 — Rappel d'ouverture (3 min)

> "Dans la séquence précédente, vous avez tous écrit des prompts d'une à trois lignes. Vous attendiez de l'IA qu'elle devine ce qu'Atlas Bureautique fait, qu'elle devine qui est l'OCP, qu'elle devine ce qu'est un AO marocain. Elle n'a pas deviné. Elle a inventé. Maintenant on va arrêter de la faire deviner."

### 5.2 — Le cadre des 6 blocs (12 min)

Introduisez la structure. Dessinez ou projetez le squelette :

```
┌──────────────────────────────────────────────────────┐
│  1. RÔLE          → Qui est l'IA dans cette tâche ?  │
├──────────────────────────────────────────────────────┤
│  2. CONTEXTE      → Qui suis-je, ma situation, mes   │
│                     contraintes, le marché, l'enjeu  │
├──────────────────────────────────────────────────────┤
│  3. OBJECTIF      → Quel résultat précis je veux ?   │
├──────────────────────────────────────────────────────┤
│  4. CONTRAINTES   → Ton, langue, longueur, ce qu'il  │
│                     faut éviter                      │
├──────────────────────────────────────────────────────┤
│  5. EXEMPLES      → Modèles ou références à imiter   │
│                     (optionnel mais puissant)        │
├──────────────────────────────────────────────────────┤
│  6. FORMAT        → Structure de la sortie attendue  │
└──────────────────────────────────────────────────────┘
```

Détaillez chaque bloc avec une phrase d'exemple ancrée dans le cas Atlas Bureautique :

**1. Rôle** — *"Tu es un consultant senior en réponse aux appels d'offres B2B au Maroc, spécialisé dans les marchés publics et grandes entreprises industrielles."*
Pourquoi : oriente le vocabulaire, le niveau d'exigence, le ton.

**2. Contexte** — *"Je dirige Atlas Bureautique, PME de 12 personnes basée à Aïn Sebaâ, CA 14 M MAD. Je réponds pour la première fois à un AO de l'OCP Group sur le réaménagement de 180 postes de travail à Khouribga, budget 4 à 6 M MAD. Concurrence : 2 filiales internationales et 3 PME marocaines comparables."*
Pourquoi : c'est ce que vous avez oublié de donner pendant la séquence 4.

**3. Objectif** — *"Aide-moi à rédiger une note de synthèse exécutive d'une page maximum, destinée au directeur des achats OCP, qui doit le convaincre en 90 secondes de lecture que je suis un candidat sérieux."*
Pourquoi : objectif mesurable (1 page, 90 secondes de lecture), destinataire identifié.

**4. Contraintes** — *"Ton sobre et factuel, pas de superlatif marketing. Français professionnel. Pas plus de 350 mots. Pas de chiffres inventés — si tu as besoin d'un chiffre, demande-le moi avant de l'écrire."*
Pourquoi : la contrainte "demande-moi avant d'inventer" élimine 80% des hallucinations.

**5. Exemples** *(optionnel mais puissant)* — *"Voici une note de synthèse que j'ai produite l'an dernier pour un AO comparable. Inspire-toi de son ton et de sa structure : [collage d'un exemple]."*
Pourquoi : un exemple vaut 200 mots de description.

**6. Format** — *"Structure attendue : (1) accroche en 2 phrases, (2) 3 puces sur l'expérience pertinente, (3) 3 puces sur les différenciateurs, (4) ligne de clôture orientée action."*
Pourquoi : sans format imposé, le LLM en invente un — souvent verbeux.

### 5.3 — Démonstration en direct (10 min)

Reprenez le challenge OCP. Construisez en direct, sous les yeux des participants, un prompt structuré complet selon les 6 blocs. Lancez-le. Comparez la sortie avec celle du début. Demandez à la salle de pointer 3 différences observables. Réponses typiques attendues : "ça parle d'Atlas", "il y a une vraie structure", "le ton est différent", "plus court mais plus dense".

### 5.4 — Atelier individuel — votre prompt structuré (15 min)

Consigne :

> "Reprenez le brief OCP. Reconstruisez **votre** prompt structuré en utilisant les 6 blocs. Pas besoin d'écrire dans l'IA tout de suite — écrivez d'abord la structure dans un document texte. Quand votre prompt est complet, lancez-le dans le LLM de votre choix et observez."

Vous circulez. Cette fois vous intervenez : vous repérez ceux qui sautent le bloc Contexte (le plus souvent oublié), ceux qui mettent un Format vague. Vous corrigez à voix basse.

### 5.5 — Mini-débrief (5 min)

Demandez à 2 personnes de partager à l'oral leur sortie nouvelle vs leur sortie de la séquence 4. La différence doit être visible. Si elle ne l'est pas, c'est qu'un bloc a été bâclé — l'occasion d'un mini-correctif en direct.

> **À retenir** :
> - Un prompt structuré, c'est 6 blocs : Rôle, Contexte, Objectif, Contraintes, Exemples, Format
> - Le bloc le plus souvent oublié est le Contexte. C'est aussi celui qui change le plus la sortie
> - Un bon prompt prend 10 minutes à écrire. Il fait gagner 2 heures sur la sortie

---

## Séquence 6 — Context engineering et orchestration (35 min) 🚀

> À la fin de cette séquence, les participants ont vu le passage du prompt structuré (S5) au système de production multi-outils, et ont produit une version "opérateur" de leur livrable OCP qui contraste fortement avec celle de S4.

### 6.1 — Pont conceptuel (3 min)

> "Vous savez maintenant écrire un bon prompt. Mais Karim Bennani a un problème : il ne va pas répondre à un seul AO dans sa carrière. Il va en répondre à 50. Réécrire les 6 blocs à chaque fois serait absurde. Et puis, son métier ne tient pas dans un prompt — son métier tient dans un dossier. Le passage du prompt structuré au context engineering, c'est ça : transformer le contexte ponctuel en actif réutilisable."

### 6.2 — Qu'est-ce que le context engineering (5 min)

Définition pour la salle :

> Le **context engineering**, c'est l'art de préparer, structurer et injecter dans une session d'IA tout ce qui n'est pas la question elle-même mais qui détermine la qualité de la réponse : votre identité, vos données, vos références, vos préférences, votre historique.

Trois leviers concrets, accessibles sans code :

**A — Les "Projects" et "Custom GPTs"** : ChatGPT, Claude et Gemini permettent de créer un espace persistant qui contient à l'avance vos instructions de rôle, vos documents de référence, votre style. Une fois configuré, chaque nouvelle conversation dans ce projet hérite de tout ce contexte sans que vous ayez à le retaper.

**B — Les documents joints** : depuis 2024, on peut joindre PDF, Word, images directement dans la conversation. Le LLM lit le contenu et travaille dessus. Pour Atlas Bureautique, ça veut dire : joindre les 3 derniers AO gagnés, le profil entreprise, la grille tarifaire — et ne plus jamais retaper "je dirige une PME de 12 personnes…"

**C — Les instructions personnalisées** : un espace de configuration où vous écrivez une fois pour toutes qui vous êtes, dans quel secteur vous opérez, quel ton vous attendez. Toutes vos conversations en bénéficient.

### 6.3 — Démonstration — créer un Project Atlas Bureautique (10 min)

En direct, sous les yeux de la salle, créez un Project (Claude) ou un Custom GPT (ChatGPT) pour Atlas Bureautique. Montrez chaque étape :

1. Création de l'espace projet
2. Rédaction des instructions persistantes (rôle + identité + style)
3. Upload de documents fictifs : profil entreprise, devis types, références clients
4. Lancement d'une nouvelle conversation : "Aide-moi à rédiger la note de synthèse pour l'AO OCP." Et c'est tout. Plus besoin de réécrire qui est Karim, où est l'entreprise, quel ton adopter.

La salle voit la différence en direct. Cette démonstration est le pic émotionnel de la formation. Soignez-la.

### 6.4 — Orchestration multi-outils — la chaîne de l'opérateur (8 min)

Présentez la chaîne complète qu'un opérateur expérimenté met en place pour le dossier OCP. Une chaîne, ce sont **des outils différents enchaînés sur la même livraison**, chacun pour ce qu'il fait le mieux :

```
1. Perplexity        → Recherche : qui est l'OCP, quels AO publics
                       similaires gagnés récemment, par qui ?
                       Sortie : 3 sources sourcées
                            ↓
2. Claude (Project)  → Rédaction longue : note de synthèse,
                       argumentaire, plan d'exécution
                       Sortie : draft complet
                            ↓
3. ChatGPT           → Critique adversariale : "tu es un acheteur
                       OCP critique, démolis ce dossier en 5 points"
                       Sortie : liste d'objections à anticiper
                            ↓
4. Claude (Project)  → Réécriture intégrant les objections
                       Sortie : v2 du dossier
                            ↓
5. DALL-E / Imagen   → 3 visuels concept (rendu plateau, ergonomie)
                       Sortie : illustrations pour le dossier
                            ↓
6. Canva             → Mise en page finale, charte Atlas Bureautique
                       Sortie : PDF de présentation prêt à envoyer
```

Insistez : aucun de ces outils ne sait tout faire. L'opérateur, lui, sait quel outil sert à quoi et orchestre. C'est exactement le geste qu'on vient d'installer.

### 6.5 — Reprise du challenge — l'effet wow (5 min)

Annoncez à la salle :

> "Maintenant, vous avez 5 minutes. Reprenez votre cas OCP. Utilisez votre prompt structuré de la séquence 5, branché sur un Project que vous venez de créer (ou un Custom GPT). Lancez la production de la note de synthèse."

5 minutes plus tard, demandez la même question qu'à la fin de S4 :

> "Levez la main si vous enverriez **cette version-là** à un décideur OCP."

Cette fois, la majorité des mains montent. C'est le moment dont vous vous souvenez 6 mois après la formation. La preuve par l'expérience est faite. Vous n'avez plus rien à démontrer.

> **À retenir** :
> - Le contexte n'est pas une politesse, c'est l'actif principal de l'opérateur
> - Un Project ou un Custom GPT bien construit divise par 5 le temps de chaque livraison ultérieure
> - Un opérateur orchestre plusieurs outils sur une même livraison — il n'utilise pas un outil unique pour tout

---

## Clôture — Engagements et plan de pratique (15 min) 🌱

> À la fin de cette clôture, chaque participant repart avec une intention concrète à pratiquer dans la semaine, et un cadre pour mesurer ses progrès.

### Le tour de table des engagements (10 min)

Faites passer la parole. Chaque participant complète à voix haute la phrase :

> *"Cette semaine, je vais créer un Project [pour ____________] et je vais traiter [____________ tâche réelle] avec la méthode des 6 blocs."*

L'oralisation est volontaire — un engagement public a 5 fois plus de chances d'être tenu qu'un engagement intérieur.

### La carte de progression (3 min)

Distribuez une carte papier ou un fichier avec ce tableau de bord personnel à remplir dans les 30 jours :

| Compétence | Niveau de départ (1-5) | Niveau visé J+30 |
|---|---|---|
| Je choisis le bon LLM pour la tâche | __ | __ |
| Je construis un prompt en 6 blocs | __ | __ |
| Je crée et maintiens un Project par sujet récurrent | __ | __ |
| J'orchestre 2 ou 3 outils sur une même livraison | __ | __ |
| Je critique une sortie et je la corrige par re-prompting | __ | __ |

### Mot de clôture (2 min)

> "Vous êtes entrés dans cette salle ce matin comme utilisateurs. Vous en sortez comme opérateurs. Pas parce que vous avez appris des outils — les outils, vous les connaissiez déjà. Parce que vous avez appris à structurer ce que vous demandez et à orchestrer ce qui répond. C'est désormais votre métier qui change, pas votre IA."

---

## Section 6 — Ressources et matériel pour le formateur

**Matériel à préparer avant la session :**
- Brief OCP imprimé (1 par participant) — voir le cadre détaillé dans la S4
- Carte de progression imprimée (1 par participant)
- Tableau ou paperboard pour dessiner la pyramide IA et la courbe d'usage
- Vidéoprojecteur connecté à votre poste
- Un Project Claude ou Custom GPT "Atlas Bureautique" préconfiguré pour la démo S6 — gain de temps majeur le jour J
- 3 onglets de navigateur prêts : ChatGPT, Claude, Perplexity (connectés)

**Documents fictifs à préparer pour la démo Project (S6) :**
- Profil entreprise Atlas Bureautique (1 page)
- 1 devis type (mobilier, montants en MAD)
- 1 cas client réussi anonymisé (300 mots)
- Charte de ton et style (200 mots)

Ces 4 documents sont la matière du Project. Ils doivent paraître crédibles aux yeux des participants — soignez-les.

**Datasets / cas alternatifs si Atlas Bureautique ne convient pas à votre audience :**
- Cabinet de conseil RH répondant à un AO de la CNSS
- Agence digitale répondant à un AO d'Inwi
- Bureau d'études BTP répondant à un AO de l'ONCF

Le mécanisme pédagogique reste identique — seul le décor change. Adaptez à la majorité de votre audience.

---

## Section 7 — Évaluation et badge

**Évaluation continue :** observation par le formateur durant les ateliers S4 et S5 + auto-évaluation finale via la carte de progression.

**Critère de validation :** lever la main "oui je l'enverrais à OCP" à la fin de la S6 — c'est l'évaluation comportementale clé.

**Badge ACT délivré :** oui, à condition de soumettre 7 jours après la formation un cas pratique personnel traité avec la méthode (prompt structuré + Project + chaîne d'au moins 2 outils). Soumission par email ou via la plateforme ACT University.

**Attestation de complétion :** délivrée immédiatement à la fin de l'atelier.

---

## ⚠️ Auto-vérification finale (act-coherence-checker)

- ✅ Vouvoiement strict respecté dans tout le document — aucun tutoiement détecté
- ✅ Fil conducteur cohérent : Karim / Atlas Bureautique / OCP de la S1 à la S6
- ✅ Carte des dépendances renseignée et auto-cohérente — chaque séquence réutilise au moins un concept de la précédente
- ✅ Niveaux de Bloom progressifs : S1-S2 mémoriser/comprendre, S3-S4 appliquer/analyser, S5 appliquer, S6 évaluer/créer
- ✅ Contextualisation marocaine : OCP, Marjane, Inwi, ONCF, montants en MAD, lieux Casablanca/Khouribga/Aïn Sebaâ
- ✅ Cas réel à apporter par les participants prévu en prérequis — ancrage métier garanti
- ⚠️ **Sections nécessitant validation humaine** :
  - Le brief OCP est fictif mais inspiré de pratiques réelles. Vérifier qu'il ne ressemble pas trop à un AO récent réel pour éviter toute confusion. Si un AO OCP réel comparable existe, modifier le périmètre (autre site, autre volume).
  - Les 4 documents fictifs Atlas Bureautique sont à produire avant la session — comptez 1h de production.
  - La règle des 4 questions (S3.4) et la chaîne d'outils (S6.4) listent des outils qui évoluent. Vérifier la pertinence des noms cités à la date de la session.
- ⚠️ **Calage temporel à valider en pilote** : la S5 est dense (45 min). Si en pilote vous débordez, raccourcir la démo S5.3 à 7 min plutôt que d'amputer l'atelier individuel S5.4.

**Temps de production restant estimé** : 4 à 6 heures pour produire les 4 documents fictifs Atlas Bureautique, le slide deck d'accompagnement, et les supports imprimables (brief OCP, carte de progression). La fiche ci-dessus est complète et exploitable telle quelle pour le déroulé.
