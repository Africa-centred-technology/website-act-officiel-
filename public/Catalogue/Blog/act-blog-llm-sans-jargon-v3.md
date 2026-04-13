# ChatGPT, Gemini, Claude & compagnie : enfin une explication qui ne brûle pas vos neurones

*Par ACT · Lecture : 10 min*

---

78 millions de dollars. C'est ce qu'a coûté l'entraînement de GPT-4 en calcul informatique, selon les estimations du Stanford AI Index 2025. Pour apprendre à faire une seule chose : prédire le mot suivant.

Pas de base de données géante consultée en temps réel. Pas de règles écrites à la main par des linguistes. Pas d'encyclopédie cachée quelque part dans les serveurs. Juste une machine qui a lu une quantité obscène de texte, et qui a appris — à force de corrections répétées — quels mots ont tendance à se suivre.

Et pourtant. Le résultat rédige vos emails, explique vos bilans comptables, et débogue du code à trois heures du matin.

Ce paradoxe mérite d'être compris. Pas pour faire de la veille technologique, mais parce que quand vous savez ce qui se passe vraiment sous le capot, vous utilisez ces outils différemment. Mieux. Et vous arrêtez de vous faire surprendre par leurs ratés.

Cet article décortique les trois mécanismes fondamentaux : la tokenisation, le transformer, et la génération probabiliste. Aucune équation. Aucune ligne de code.

---

## Avant les LLMs : l'IA qui lisait avec une main devant les yeux

Les systèmes de traitement du langage ont longtemps fonctionné d'une façon qu'on peut résumer ainsi : lire un texte en cachant tout ce qui vient après le mot courant.

On appelait ça les réseaux de neurones récurrents — RNN pour les intimes. Ils avançaient mot par mot, de gauche à droite, en portant une sorte de "mémoire" du chemin parcouru. Le problème : cette mémoire s'effaçait. Plus le texte était long, plus les premiers mots disparaissaient du radar. Une phrase courte, ça passait. Un paragraphe entier, c'était une autre histoire.

Prenez cette phrase : *"La cliente que le directeur avait rencontrée lors du salon de Casablanca, et qui lui avait semblé très prometteuse pour le partenariat, a finalement décliné."*

"A décliné" parle de "la cliente". Séparés par vingt mots. Vous faites le lien sans y penser. Un RNN de 2016 avait de bonnes chances de l'avoir perdu en route.

En juin 2017, une équipe de chercheurs chez Google a publié un papier avec un titre qui ressemble presque à un slogan : *"Attention Is All You Need"* (Vaswani et al., arxiv.org/abs/1706.03762). Ce qu'ils proposaient allait tout changer.

---

## La tokenisation : le modèle ne lit pas vos mots. Il lit des numéros.

Avant même de "comprendre" quoi que ce soit, le modèle doit transformer votre texte en quelque chose qu'un ordinateur peut manipuler : des nombres entiers. C'est la tokenisation. Et c'est l'étape que tout le monde oublie de mentionner.

Un token, ce n'est pas un mot. Ce n'est pas non plus un caractère. C'est un fragment de texte — un bout de mot, un mot entier, parfois plusieurs mots — choisi parce qu'il apparaît fréquemment dans les données d'entraînement. Le mot "intelligence", selon le modèle, sera probablement découpé en deux tokens : "intel" et "ligence". Chacun reçoit un numéro. Et c'est ce numéro que le modèle voit. *(Cette décomposition est illustrative — le découpage exact varie d'un tokenizer à l'autre.)*

L'algorithme qui construit ces vocabulaires de tokens s'appelle BPE, pour *Byte Pair Encoding*. Le principe : on part de chaque caractère individuel, on repère les paires qui reviennent le plus souvent dans le corpus, on les fusionne en un seul token, on recommence. On s'arrête quand on atteint la taille de vocabulaire souhaitée. GPT-2 s'est arrêté à environ 50 000 tokens. GPT-4 en a environ 100 000. Les modèles récents dépassent les 200 000. Et selon Tao et al. (NeurIPS 2024, arxiv.org/abs/2409.11402), chaque doublement de vocabulaire améliore la qualité — mais avec des rendements décroissants.

Maintenant, voici ce que ça change concrètement.

Quand vous demandez à un modèle de compter les lettres dans un mot, il se retrouve souvent dans une situation absurde : le mot est représenté par un seul numéro, sans que ses lettres individuelles soient visibles. Lui demander de compter les "r" dans "strawberry", c'est comme demander à quelqu'un de décrire le contenu d'un colis d'après son code-barres. L'information n'est pas là sous cette forme.

Ce n'est pas un bug. C'est une conséquence directe de la façon dont le texte est représenté.

![De la phrase aux probabilités : le transformer en action](transformer-tokenisation-probabilites.png)
*Les tokens de la phrase d'entrée traversent l'encodeur et le décodeur du transformer, qui calcule les probabilités du mot suivant — ici "il" avec 45% de chances d'apparaître après "…et soudain".*

---

## Le mécanisme d'attention : tout lire en même temps

Voilà l'idée centrale du transformer, l'architecture introduite dans ce papier de 2017 : au lieu de lire le texte séquentiellement, le modèle regarde **tout en même temps** et calcule, pour chaque token, à quel point il est lié à chacun des autres.

Une image pour s'y retrouver. Posez un texte de dix phrases sur une table. Vous appelez dix personnes. Chacune lit le texte entier, mais avec une question différente en tête. L'une cherche le sujet. L'autre cherche le verbe principal. Une troisième cherche les mots qui qualifient ce sujet. Chacune surligne ce qui répond à sa question. Vous superposez tous les surlignages. Ce que vous obtenez, c'est une lecture composite du texte, capturant plusieurs types de relations à la fois.

C'est ce que fait le mécanisme d'attention — plusieurs "têtes" de lecture tournant en parallèle, chacune spécialisée dans un type de relation entre les tokens. Le papier original de Vaswani et al. en utilisait 8 simultanément. Les grands modèles d'aujourd'hui en alignent des centaines.

Et le point qu'on mentionne rarement : ce traitement parallèle ne change pas que la vitesse de lecture. Il a permis d'entraîner ces modèles sur des milliers de puces graphiques simultanément. Sans ça, GPT-4 n'aurait tout simplement pas pu être entraîné dans une durée raisonnable — peu importe la puissance de calcul disponible. C'est cette bascule architecturale, plus que tout autre facteur, qui a rendu possible l'explosion des LLMs après 2020.

---

## L'entraînement : 78 millions de dollars pour compléter des phrases

Une fois qu'on sait découper le texte en tokens et établir des relations entre eux, comment le modèle apprend-il à produire quelque chose d'utile ?

La tâche est d'une simplicité qui surprend : **deviner le token suivant**.

Pendant l'entraînement, on présente au modèle des milliards de séquences de texte — pages web, livres, articles scientifiques, code source. Pour chaque séquence, on cache le dernier token et on lui demande de le prédire. Il propose quelque chose. On compare à la réalité. On ajuste ses paramètres internes pour qu'il se trompe un peu moins la prochaine fois. Et on recommence. Des centaines de milliards de fois.

Selon le rapport technique officiel d'OpenAI (arxiv.org/abs/2303.08774), GPT-4 est pré-entraîné exactement comme ça : prédire le token suivant, sur des données publiques et sous licence. Le Stanford AI Index 2025 (hai.stanford.edu) estime le coût de calcul à environ 78 millions de dollars pour ce seul entraînement.

Ce qui ressort de ce processus, ce ne sont pas des "connaissances" au sens humain. Ce sont des **paramètres** — des milliards de valeurs numériques qui encodent des régularités statistiques. Le modèle ne sait pas que Paris est la capitale de la France comme vous le savez. Il a appris que les tokens "Paris" et "capitale" et "France" apparaissent ensemble suffisamment souvent pour que leur association soit probable. C'est une différence fondamentale. On y reviendra.

---

## La génération probabiliste : chaque mot est un pari

On arrive au cœur du truc. Et c'est là que beaucoup de gens ont une surprise.

Quand vous posez une question à un LLM, il ne cherche pas *la bonne réponse* dans une sorte de mémoire. Il génère sa réponse **token par token**, à chaque fois en calculant une distribution de probabilités sur l'ensemble de son vocabulaire.

Prenez la question : *"Quelle est la capitale de la France ?"* Le modèle calcule : parmi les 100 000 tokens possibles, lequel a le plus de chances d'arriver en premier ? "Paris" obtient peut-être 41%. "La" obtient 12%. "C'est" obtient 8%. Et ainsi de suite pour les 99 997 autres. Le modèle tire un token selon ces probabilités — en général le plus probable, mais pas toujours.

Pas toujours, parce qu'une machine qui choisit systématiquement le token le plus probable produit un texte mécanique et répétitif. Un paramètre appelé **température** joue sur ça : basse, le modèle reste prudent et prévisible — c'est ce qu'on veut pour du code ou des faits. Haute, il prend plus de risques — utile pour la fiction, le brainstorming, les formulations créatives. C'est un dé pipé dont vous réglez l'irrégularité.

Ensuite, le token choisi devient l'entrée de la prochaine étape. Le modèle recalcule. Choisit un nouveau token. Recalcule encore. Une réponse de 200 tokens, c'est 200 tirages successifs, chacun conditionné par tous les précédents. C'est ce qu'on appelle la **génération autoregressive** : le modèle se nourrit de ses propres sorties, étape par étape.

`[CALLOUT : "Un LLM ne consulte pas une base de données. À chaque token, il calcule la distribution de probabilité de toutes les suites possibles, et en choisit une. C'est pour ça qu'il peut écrire un poème sur commande — et halluciner une référence qui n'existe pas."]`

---

## Ce que ça explique — et qu'on ne vous dit pas assez

### Les hallucinations ne sont pas des bugs

Un LLM produit une analyse solide sur un sujet complexe, puis, dans la même conversation, invente une citation parfaitement tournée d'un auteur qui n'a jamais écrit ça.

Même cause. Même mécanisme.

Quand le modèle génère "Comme le disait Camus,", il calcule les tokens qui ont le plus de chances de suivre cette phrase dans son expérience statistique du langage humain. Parfois c'est juste. Parfois c'est faux mais plausible. Le modèle lui-même ne peut pas faire la différence — il n'a pas de vérité de référence, seulement des probabilités.

L'hallucination n'est pas une défaillance à corriger dans la prochaine version. C'est une propriété structurelle de l'approche. Ce que ça veut dire en pratique : tout chiffre, toute citation, toute affirmation factuelle produite par un LLM mérite une vérification. Pas par méfiance irrationnelle — par lucidité sur ce que l'outil est réellement.

### Toutes les langues ne sont pas égales

Un modèle entraîné à 80% sur de l'anglais aura des probabilités moins bien calibrées pour l'arabe, le wolof ou le dari. La tokenisation sera moins efficace — il faut plus de fragments pour encoder le même contenu, ce qui veut dire plus de tokens, plus de calcul, et une précision moindre. Ce n'est pas que le modèle est "moins intelligent" dans ces langues. C'est qu'il a moins de données pour les apprendre. La différence est importante pour quiconque déploie ces outils dans un contexte multilingue.

### La fenêtre de contexte, c'est la mémoire de court terme du modèle

La **fenêtre de contexte** désigne la quantité maximale de texte que le modèle peut traiter en un seul échange. Au-delà, il "oublie" — pas progressivement comme un RNN, mais brutalement, comme si on avait arraché les premières pages. Selon la documentation officielle d'OpenAI, GPT-4 Turbo peut tenir jusqu'à 128 000 tokens dans une même conversation — plusieurs centaines de pages. C'est cette limite qui explique pourquoi certains modèles perdent le fil au bout d'un long échange.

---

## Ce que vous en faites demain matin

Ces trois mécanismes ne sont pas des détails réservés aux équipes techniques. Ils ont des conséquences pratiques immédiates.

Si vous savez que la génération est probabiliste et token par token, vous comprenez pourquoi un prompt précis et bien structuré surpasse systématiquement une question vague — vous réduisez l'espace des suites possibles vers celles qui vous intéressent. Si vous savez que les hallucinations sont structurelles, vous arrêtez d'espérer qu'une prochaine mise à jour les éliminera et vous construisez vos processus en conséquence. Si vous savez que la fenêtre de contexte a une limite dure, vous architecturez différemment vos workflows longs.

Les LLMs ne sont pas des oracles. Ce sont des systèmes de complétion de texte extraordinairement puissants, avec des forces et des angles morts prévisibles et documentés. Ceux qui comprennent les deux s'en servent mieux. Et surtout, ils s'en font moins surprendre.

La suite de ce blog ira plus loin : RAG, fine-tuning, évaluation de modèles, gouvernance. Si vous voulez passer à la pratique dès maintenant, la formation **"LLMs & IA Générative"** d'ACT University vous donne les bases concrètes pour construire, évaluer et déployer ces systèmes dans votre contexte métier.

---

## Méta SEO

**Titre SEO** : ChatGPT, Gemini, Claude & compagnie : enfin une explication qui ne brûle pas vos neurones  
**Meta description** : Comment fonctionnent vraiment ChatGPT, Gemini et Claude ? Tokenisation, transformers, génération probabiliste — expliqués simplement, sans jargon. Article de référence ACT.  
**Mot-clé principal** : comment fonctionne ChatGPT  
**Mots-clés secondaires** : explication IA générative simple, comprendre ChatGPT sans coder, comment fonctionne Gemini, transformer explication simple, IA générative sans jargon  
**Slug URL** : /blog/chatgpt-gemini-claude-explication-sans-jargon  
**Temps de lecture estimé** : 10 min  
**CTA recommandé** : Lien vers la formation "LLMs & IA Générative" — ACT University  
**Image à la une** : Illustration schématique d'une phrase se décomposant en tokens colorés, qui entrent dans un réseau de neurones stylisé, avec une flèche vers du texte généré — fond sombre, palette bleu/violet ACT
