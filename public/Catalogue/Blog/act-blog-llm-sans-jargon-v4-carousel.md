# ChatGPT, Gemini, Claude & compagnie

*Enfin une explication qui ne brûle pas vos neurones — par ACT*

**78 millions de dollars.** C'est ce qu'a coûté l'entraînement de GPT-4, selon le Stanford AI Index 2025.

Pour apprendre à faire une seule chose : **prédire le mot suivant**.

9 slides pour comprendre ce qui se passe vraiment sous le capot — et arrêter de vous faire surprendre par leurs ratés.

---

## Avant 2017 : l'IA qui lisait avec une main devant les yeux

Les anciens systèmes (RNN) avançaient mot par mot, de gauche à droite, avec une mémoire qui s'effaçait.

Texte court : ça passait. Paragraphe entier : c'était une autre histoire.

> *« La cliente que le directeur avait rencontrée lors du salon de Casablanca, et qui lui avait semblé très prometteuse, a finalement décliné. »*

« A décliné » parle de « la cliente ». Vingt mots d'écart. Vous faites le lien sans y penser. Un RNN de 2016 le perdait en route.

**Juin 2017 — Google publie "Attention Is All You Need".** Tout change.

---

## La tokenisation : le modèle ne lit pas vos mots. Il lit des numéros.

Avant de "comprendre" quoi que ce soit, votre texte est découpé en **tokens** — des fragments numérotés.

Pas un mot. Pas un caractère. Un fragment.

> "intelligence" → "intel" + "ligence" → deux numéros.

| Modèle | Vocabulaire |
|---|---|
| GPT-2 | 50 000 tokens |
| GPT-4 | ~100 000 |
| Modèles récents | 200 000+ |

**C'est pour ça** qu'un LLM n'arrive pas à compter les "r" dans *strawberry*. L'info n'est pas là sous cette forme — c'est comme demander de décrire un colis depuis son code-barres.

---

## Le mécanisme d'attention : tout lire en même temps

Imaginez 10 personnes devant le même texte, chacune avec une question différente. L'une cherche le sujet. L'autre le verbe. La troisième les qualificatifs. Chacune surligne. Vous superposez.

C'est ça, **l'attention** — plusieurs « têtes » de lecture en parallèle, chacune spécialisée dans un type de relation.

`[CALLOUT : "Vaswani et al. en utilisaient 8 simultanément en 2017. Les modèles d'aujourd'hui en alignent des centaines."]`

**Sans cette bascule architecturale, GPT-4 n'aurait jamais pu être entraîné.**

---

## L'entraînement : 78 millions de dollars pour compléter des phrases

La tâche est d'une simplicité qui surprend : **deviner le token suivant**.

On présente au modèle des milliards de séquences. On cache le dernier token. On lui demande de le prédire. On compare. On ajuste. **Des centaines de milliards de fois.**

Ce qui en sort, ce ne sont pas des "connaissances". Ce sont des **paramètres** — des milliards de valeurs numériques.

> Le modèle ne sait pas que Paris est la capitale de la France comme vous le savez.
> Il a appris que ces tokens vont souvent ensemble.

*Sources : OpenAI Technical Report (2023) · Stanford AI Index 2025*

---

## La génération : chaque mot est un pari

Quand vous lui posez une question, le modèle ne cherche pas *la bonne réponse*. Il génère **token par token**, en calculant à chaque étape une distribution de probabilités.

> *"Quelle est la capitale de la France ?"*
> "Paris" : 41% — "La" : 12% — "C'est" : 8% — *(et 99 997 autres)*

Il tire un token. Recalcule. Recommence.

Un paramètre — la **température** — règle l'irrégularité du dé : basse pour le code et les faits, haute pour la créativité.

**Génération autoregressive** : le modèle se nourrit de ses propres sorties, étape par étape.

---

## Les 3 vérités cachées

### 1️⃣ Les hallucinations ne sont pas des bugs
Le modèle n'a pas de vérité de référence — seulement des probabilités. Une citation parfaitement tournée d'un auteur qui n'a jamais écrit ça : même mécanisme qu'une analyse juste. **C'est structurel.**

### 2️⃣ Toutes les langues ne sont pas égales
Un modèle entraîné à 80% sur de l'anglais a des probabilités moins bien calibrées pour l'arabe, le wolof, le dari. Pas moins "intelligent" — moins de données.

### 3️⃣ La fenêtre de contexte = mémoire de court terme
GPT-4 Turbo : 128 000 tokens max. Au-delà, il oublie brutalement. Comme si on arrachait les premières pages.

---

## Ce que vous en faites demain matin

**Vous savez que la génération est probabiliste** → un prompt précis surpasse une question vague. Vous réduisez l'espace des suites possibles.

**Vous savez que les hallucinations sont structurelles** → vous vérifiez les chiffres et les citations. Vous arrêtez d'attendre une mise à jour qui les fera disparaître.

**Vous savez que la fenêtre de contexte a une limite dure** → vous architecturez vos workflows longs en conséquence.

Les LLMs ne sont pas des oracles. Ce sont des systèmes de complétion de texte avec des forces et des angles morts **prévisibles et documentés**.

---

## Allez plus loin

Cet article décortique les fondations. La suite ira plus loin :
**RAG · fine-tuning · évaluation · gouvernance.**

> Pour passer à la pratique :
> **Formation "LLMs & IA Générative"**
> ACT University

→ act.africa/formations

---

## Méta SEO

**Titre** : ChatGPT, Gemini, Claude & compagnie : enfin une explication qui ne brûle pas vos neurones
**Meta description** : Comment fonctionnent vraiment ChatGPT, Gemini et Claude ? Tokenisation, transformers, génération probabiliste — en 9 slides, sans jargon.
**Mot-clé principal** : comment fonctionne ChatGPT
**Mots-clés secondaires** : explication IA générative simple, comprendre ChatGPT sans coder, transformer explication simple
**Slug** : /blog/chatgpt-gemini-claude-explication-sans-jargon
**Format** : Carousel 9 slides (~80-120 mots/slide)
**CTA** : Formation "LLMs & IA Générative" — ACT University
