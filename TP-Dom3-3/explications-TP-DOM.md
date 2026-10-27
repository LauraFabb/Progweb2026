# 🃏 TP DOM : le jeu de cartes, expliqué pas à pas

> Ce document reprend **chaque exercice** du TP. Pour chacun, il explique **ce qu'on fait**, **pourquoi on le fait comme ça**, et **les pièges classiques**.
> À la fin, un **quiz corrigé** permet de vérifier que tout est compris.

---

## 📚 Sommaire

0. [Avant de commencer : c'est quoi le DOM ?](#0--avant-de-commencer--cest-quoi-le-dom-)
1. [La boîte à outils](#1--la-boîte-à-outils)
2. [Exercice 1 : `clearSelection`](#2--exercice-1--clearselection)
3. [Exercice 2 : les six boutons A à F](#3--exercice-2--les-six-boutons-a-à-f)
4. [Exercice 3 : tester les boutons](#4--exercice-3--tester-les-boutons)
5. [Exercice 4 : le tableau `deck`](#5--exercice-4--le-tableau-deck)
6. [Exercice 5 : tirer une main](#6--exercice-5--tirer-une-main)
7. [Exercice 6 : vérifier que tout est isolé](#7--exercice-6--vérifier-que-tout-est-isolé)
8. [Le code complet commenté](#8--le-code-complet-commenté)
9. [Erreurs fréquentes](#9--erreurs-fréquentes)
10. [Quiz pour vérifier sa compréhension](#10--quiz-pour-vérifier-sa-compréhension)

---

## 0 · Avant de commencer : c'est quoi le DOM ?

### L'idée en une phrase

Quand le navigateur lit ton fichier HTML, il ne garde pas le texte : il le transforme en un **arbre d'objets JavaScript**. Cet arbre s'appelle le **DOM** (*Document Object Model*). Modifier le DOM en JavaScript, c'est modifier **ce qui est affiché à l'écran**, en direct.

```
document
└── html
    ├── head
    │   ├── title
    │   └── script (cards.js)
    └── body
        └── main
            ├── h1
            ├── div.controls
            │   ├── button#select-ace-spade
            │   └── ...
            ├── div.deck
            │   ├── playing-card#HEART-ACE.rank-ace.heart
            │   │   ├── span.rank   → "A"
            │   │   └── span.suit   → "♥"
            │   └── ... (52 cartes)
            └── div#hand            ← vide au départ
```

**Vocabulaire :**

| Mot | Signification | Exemple dans le TP |
|---|---|---|
| **Nœud** (*node*) | N'importe quel point de l'arbre (élément, texte, commentaire…) | le texte `"A"` |
| **Élément** | Un nœud qui correspond à une balise | `<playing-card>`, `<span>` |
| **Parent / enfant** | Relation directe dans l'arbre | `.deck` est parent des `<playing-card>` |
| **Descendant** | Enfant, petit-enfant, etc. | les `<span>` sont descendants de `.deck` |
| **`document`** | L'objet racine, le point d'entrée de tout | `document.querySelector(...)` |

> 💡 **À retenir :** le HTML est le *plan* de la page ; le DOM est la *maison construite*. JavaScript modifie la maison, jamais le fichier HTML. Si tu recharges la page, tout revient comme au départ.

### Le *custom element* `<playing-card>`

`<playing-card>` n'est pas une balise HTML standard : c'est un **élément personnalisé**. Pour le DOM, c'est un élément comme les autres. On peut le sélectionner, lui ajouter des classes, le cloner… Le CSS (`cards.css`) se charge de le dessiner comme une carte.

Chaque carte porte **trois informations** qu'on va utiliser dans les sélecteurs :

```html
<playing-card id="HEART-KING" class="rank-king heart" data-face-card="">
    <span class="rank">K</span>
    <span class="suit">♥</span>
</playing-card>
```

| Information | Où ? | Sert à… |
|---|---|---|
| `id="HEART-KING"` | identifiant **unique** | viser **une** carte précise |
| `class="rank-king heart"` | une ou plusieurs classes | viser un **groupe** (une couleur, un rang) |
| `data-face-card` | attribut présent ou absent | viser les **figures** (J, Q, K) |

### Pourquoi `type="module"` ?

```html
<script src="cards.js" type="module"></script>
```

Le script est placé dans le `<head>`, donc **avant** les cartes. Avec un `<script>` normal, le navigateur l'exécuterait tout de suite, quand les cartes n'existent pas encore : `document.querySelector('.deck')` renverrait `null`, et tout planterait.

Un script `type="module"` est **différé** : le navigateur attend d'avoir analysé tout le HTML avant de l'exécuter. Les modules apportent aussi d'autres choses : la possibilité d'utiliser `import`/`export`, et le mode strict automatique.

### Pourquoi un serveur HTTP (`php -S`) ?

Les navigateurs **refusent de charger des modules** depuis une adresse `file://`, pour des raisons de sécurité (politique CORS). Il faut donc servir les fichiers via `http://`. C'est exactement ce que fait `php -S 127.0.0.1:8080` : il crée un mini-serveur web local.

---

## 1 · La boîte à outils

Tout le TP repose sur **cinq outils**. Les comprendre, c'est comprendre le TP.

### 🔍 `querySelector` : trouver **un** élément

```js
const ace = document.querySelector('#SPADE-ACE');
```

- Prend un **sélecteur CSS** (exactement la même syntaxe que dans un fichier `.css`).
- Renvoie le **premier** élément qui correspond.
- Renvoie **`null`** si rien ne correspond.

### 🔍🔍 `querySelectorAll` : trouver **tous** les éléments

```js
const hearts = document.querySelectorAll('.heart');
```

- Renvoie une **`NodeList`** de tous les éléments qui correspondent.
- Si rien ne correspond, renvoie une `NodeList` **vide** (jamais `null`).
- Cette `NodeList` est **statique** : c'est une photo prise à l'instant T.
- Ce n'est **pas un vrai tableau** : on peut la parcourir avec `for...of` ou `.forEach`, mais elle n'a pas `.map`, `.filter`, `.slice`…

### 🎯 Chercher *dans* un élément plutôt que dans tout le document

`querySelector` et `querySelectorAll` existent sur `document`, **mais aussi sur n'importe quel élément**. Dans ce cas, la recherche se limite à ses **descendants** :

```js
const deckContainer = document.querySelector('.deck');
deckContainer.querySelectorAll('.heart'); // seulement les cœurs DANS .deck
```

C'est la clé du TP : en cherchant toujours dans `.deck`, on ne touchera **jamais** les cartes de la main.

### 🏷️ `classList` : gérer les classes

```js
card.classList.add('selected');      // ajoute (sans doublon)
card.classList.remove('selected');   // retire (aucune erreur si absente)
card.classList.toggle('selected');   // ajoute si absente, retire si présente
card.classList.contains('selected'); // true / false
```

> 💡 Pourquoi ne pas écrire `card.className = 'selected'` ? Parce que ça **écraserait** toutes les autres classes (`rank-king heart`) : la carte perdrait sa couleur et son rang ! `classList` modifie **une seule** classe sans toucher aux autres.

Ici, la classe `selected` est mise en forme par `cards.css` : la carte est mise en évidence. **Le JavaScript ne dessine rien lui-même** ; il change une classe, et le CSS fait le reste.

### 👂 `addEventListener` : réagir à un clic

```js
button.addEventListener('click', () => {
  // ce code s'exécute À CHAQUE clic
});
```

- 1ᵉʳ argument : le **nom de l'événement** (`'click'`).
- 2ᵉ argument : une **fonction** (appelée *callback*) que le navigateur appellera **plus tard**, au moment du clic.

> ⚠️ **Piège n°1 des débutants :**
> ```js
> button.addEventListener('click', selectCards('.heart'));      // ❌
> button.addEventListener('click', () => selectCards('.heart')); // ✅
> ```
> La première ligne **appelle** `selectCards` immédiatement (au chargement), puis passe son résultat (`undefined`) comme écouteur. La seconde passe une **fonction** qui appellera `selectCards` au moment du clic.

---

## 2 · Exercice 1 : `clearSelection`

> **Consigne :** sélectionner toutes les cartes du paquet, les parcourir, et retirer la classe `selected` de chacune.

```js
const deckContainer = document.querySelector('.deck');

function clearSelection() {
  const cards = deckContainer.querySelectorAll('playing-card');
  for (const card of cards) {
    card.classList.remove('selected');
  }
}
```

### Décortiquons

1. `deckContainer.querySelectorAll('playing-card')` → les 52 cartes de `.deck`, et elles seules.
2. `for (const card of cards)` → on parcourt la `NodeList` une carte à la fois.
3. `card.classList.remove('selected')` → on retire la classe. Si la carte ne l'avait pas, **rien ne se passe**, sans erreur. On n'a donc pas besoin de vérifier avant.

> 💡 **Pourquoi une boucle ?** Une `NodeList` n'a pas de `classList`. On ne peut pas écrire `cards.classList.remove(...)`. Il faut agir **sur chaque élément**, un par un.

---

## 3 · Exercice 2 : les six boutons A à F

### Le schéma commun

Chaque bouton suit **exactement** les mêmes trois étapes :

```
clic ──► 1. clearSelection()  ──► 2. sélectionner les cartes  ──► 3. ajouter "selected"
```

Plutôt que de répéter ce code six fois, on le range dans une fonction :

```js
function selectCards(selector) {
  clearSelection();
  const cards = deckContainer.querySelectorAll(selector);
  for (const card of cards) {
    card.classList.add('selected');
  }
}
```

Seul **le sélecteur CSS** change d'un bouton à l'autre. Tout l'intérêt de l'exercice est donc d'**écrire le bon sélecteur**.

> ⚠️ La consigne impose **un seul sélecteur CSS** par bouton, sans filtrer en JavaScript (pas de `if`, pas de `.filter`). Le but est d'apprendre à exprimer « et », « ou » et « sauf » directement en CSS.

---

### A) Ace of spades : par l'identifiant → **1 carte**

```js
document.querySelector('#select-ace-spade')
  .addEventListener('click', () => {
    clearSelection();
    deckContainer.querySelector('#SPADE-ACE').classList.add('selected');
  });
```

- `#` = sélecteur d'**identifiant**.
- Un seul élément attendu → **`querySelector`**, qui renvoie directement l'élément. On peut donc appeler `.classList` dessus sans boucle.

---

### B) Hearts : par la classe → **13 cartes**

```js
selectCards('.heart')
```

- `.` = sélecteur de **classe**. `.heart` vise tout élément qui a la classe `heart` **parmi ses classes** : `class="rank-2 heart"` correspond bien.

---

### C) Red cards : un **OU** → **26 cartes**

```js
selectCards('.heart, .diamond')
```

- La **virgule** veut dire **OU** : « les éléments qui correspondent à `.heart` **ou** à `.diamond` ».

> ⚠️ Attention aux espaces, ils changent tout :
>
> | Sélecteur | Signification | Résultat |
> |---|---|---|
> | `.heart, .diamond` | cœur **OU** carreau | ✅ 26 |
> | `.heart.diamond` (collé) | à la fois cœur **ET** carreau | ❌ 0 |
> | `.heart .diamond` (espace) | un carreau **à l'intérieur** d'un cœur | ❌ 0 |

---

### D) Face cards : par un attribut → **12 cartes**

```js
selectCards('[data-face-card]')
```

- `[nom]` = « tout élément qui **possède** cet attribut », quelle que soit sa valeur (ici vide).
- 4 couleurs × 3 figures (J, Q, K) = **12**. Les as n'ont pas l'attribut.

> 💡 Les attributs `data-*` sont faits pour stocker des **informations personnalisées** sur un élément. En JavaScript, on peut aussi les lire avec `element.dataset` (ici `card.dataset.faceCard`).

---

### E) Red face cards : **ET** + **OU** → **6 cartes**

```js
selectCards('.heart[data-face-card], .diamond[data-face-card]')
```

- `.heart[data-face-card]` (**collé**) = cœur **ET** figure.
- La virgule fait le **OU** avec la même chose pour les carreaux.
- 2 couleurs × 3 figures = **6**.

> ⚠️ **Piège :** `'.heart, .diamond[data-face-card]'` donne **16**, et non 6 ! La virgule sépare **deux sélecteurs complets et indépendants** : on obtient « tous les cœurs (13) » OU « les figures de carreau (3) ». Il faut répéter `[data-face-card]` des deux côtés.
>
> *(Pour aller plus loin : `:is(.heart, .diamond)[data-face-card]` fait la même chose en plus court.)*

---

### F) All except spades : la négation → **39 cartes**

```js
selectCards('playing-card:not(.spade)')
```

- `:not(X)` = « tout élément qui ne correspond **pas** à X ».
- `playing-card:not(.spade)` = « les `<playing-card>` **qui n'ont pas** la classe `spade` ».

> ⚠️ **Le piège annoncé par la consigne :** `':not(.spade)'` tout seul veut dire « **n'importe quel élément** qui n'est pas un pique ». Dans `.deck`, ça inclut les **`<span>` à l'intérieur des cartes** (eux n'ont pas la classe `spade`) !
> On obtiendrait 39 cartes + 104 `<span>` (2 par carte) = **143 éléments**. En mettant `playing-card` devant, on vise **les cartes elles-mêmes**.

---

### 📋 Récapitulatif des sélecteurs

| Bouton | Sélecteur | Notion CSS | Résultat attendu |
|:---:|---|---|:---:|
| A | `#SPADE-ACE` | identifiant | **1** |
| B | `.heart` | classe | **13** |
| C | `.heart, .diamond` | OU (virgule) | **26** |
| D | `[data-face-card]` | présence d'attribut | **12** |
| E | `.heart[data-face-card], .diamond[data-face-card]` | ET (collé) + OU | **6** |
| F | `playing-card:not(.spade)` | négation | **39** |

---

## 4 · Exercice 3 : tester les boutons

> **Consigne :** chaque clic doit **remplacer** la sélection, pas la compléter.

C'est le rôle de `clearSelection()`, appelé **en premier** dans `selectCards`. Sans lui :

```
clic A (1 carte) → clic B → 14 cartes sélectionnées ❌ (l'as de pique est resté)
```

**Comment vérifier ?** Dans la console du navigateur (F12 → onglet *Console*), après un clic :

```js
document.querySelectorAll('.selected').length
```

Teste dans le désordre : A → F → B → E… Le nombre doit **toujours** correspondre au dernier bouton cliqué.

---

## 5 · Exercice 4 : le tableau `deck`

> **Consigne :** au démarrage, récupérer les 52 cartes **une seule fois** et les convertir en **tableau**.

```js
const deck = [...deckContainer.querySelectorAll('playing-card')];
```

### L'opérateur de décomposition `...` (*spread*)

`...` « déballe » une collection en éléments séparés. Placé entre `[ ]`, il les remballe dans un **nouveau vrai tableau** :

```js
const nodeList = deckContainer.querySelectorAll('playing-card'); // NodeList
const deck = [...nodeList];                                      // Array ✅
```

Ça fonctionne parce qu'une `NodeList` est **itérable** (on peut la parcourir). Équivalent : `Array.from(nodeList)`.

**Pourquoi un tableau ?** Parce qu'on va avoir besoin de `.slice()` et d'échanger des éléments par indice pour le mélange. Une `NodeList` ne le permet pas.

### Pourquoi « une seule fois » ?

- Le paquet ne change jamais : inutile de refaire la recherche à chaque clic.
- Le tableau contient des **références** vers les vrais éléments du DOM, pas des copies. `deck[0]` **est** l'as de cœur affiché à l'écran.

---

## 6 · Exercice 5 : tirer une main

```js
document.querySelector('#draw-hand')
  .addEventListener('click', () => {
    const deckShuffled = shuffleInPlace([...deck]);   // ① copie + mélange
    const drawnCards = deckShuffled.slice(0, 5);      // ② 5 premières
    const handCards = [];
    for (const card of drawnCards) {
      const cardClone = card.cloneNode(true);         // ③ clone profond
      cardClone.removeAttribute('id');                // ④ pas d'id en double
      cardClone.classList.remove('selected');         //    pas de sélection
      handCards.push(cardClone);                      // ⑤ on stocke
    }
    document.querySelector('#hand').replaceChildren(...handCards); // ⑥ affichage
  });
```

### ① Copier avant de mélanger

```js
shuffleInPlace([...deck])
```

`shuffleInPlace` mélange **sur place** (*in place*) : elle **modifie** le tableau qu'on lui donne. Avec `[...deck]`, on lui donne une **copie**, et `deck` garde l'ordre d'origine.

> 💡 Mélanger le tableau ne déplace **pas** les cartes à l'écran : on réordonne seulement des **références** dans un tableau JavaScript. Le DOM n'est pas touché.

### Le mélange de Fisher–Yates (rappel)

```js
function shuffleInPlace(array) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // indice au hasard entre 0 et i
    [array[i], array[j]] = [array[j], array[i]];    // échange i ↔ j
  }
  return array;
}
```

On part de la fin. À chaque tour, on choisit au hasard une carte parmi celles **qui restent** (de 0 à i), et on la place en position i. Chaque ordre possible a **exactement la même probabilité**.

### ② `slice(0, 5)`

Renvoie un **nouveau tableau** avec les éléments d'indice 0 à 4 (le 5 est **exclu**). Le tableau d'origine n'est pas modifié.

### ③ `cloneNode(true)` : pourquoi cloner ?

Un élément du DOM ne peut être qu'**à un seul endroit à la fois**. Si on ajoutait directement `deck[0]` dans `#hand`, il serait **déplacé** : la carte **disparaîtrait du paquet** !

| Appel | Résultat |
|---|---|
| `card.cloneNode(true)` | copie de la carte **avec** ses `<span>` (rang + couleur) ✅ |
| `card.cloneNode(false)` ou `cloneNode()` | copie de la balise **seule**, vide : carte blanche ❌ |

Le `true` veut dire « **profond** » : on copie aussi tous les descendants.

### ④ `removeAttribute('id')` et `classList.remove('selected')`

- Un `id` doit être **unique** dans la page. Le clone de `SPADE-ACE` aurait le même `id` que l'original : HTML invalide, et `querySelector('#SPADE-ACE')` pourrait viser la mauvaise carte.
- Si la carte d'origine était sélectionnée au moment du tirage, le clone **hérite** de la classe `selected`. On la retire pour que la main s'affiche normalement.

### ⑥ `replaceChildren(...handCards)`

- `replaceChildren(a, b, c)` **supprime tous les enfants** de `#hand` puis ajoute `a`, `b`, `c` : **en une seule opération**.
- Elle attend des éléments **séparés**, pas un tableau. On décompose donc le tableau avec `...` : `replaceChildren(...handCards)` équivaut à `replaceChildren(handCards[0], handCards[1], …)`.
- C'est grâce à ça qu'un nouveau tirage **remplace** la main précédente au lieu de s'y ajouter.

---

## 7 · Exercice 6 : vérifier que tout est isolé

> Les boutons A à F ne doivent **jamais** sélectionner les cartes de la main.

Deux protections garantissent ça :

1. **Toutes les recherches partent de `deckContainer`** (`.deck`). `#hand` n'est pas dans `.deck`, donc ses cartes sont invisibles pour ces recherches.
2. **Les clones n'ont pas d'`id`.** Même une recherche par `#SPADE-ACE` ne peut trouver que l'original.

**Test :** tire une main, clique sur F, puis tape dans la console :

```js
document.querySelectorAll('#hand .selected').length  // doit afficher 0
```

---

## 8 · Le code complet commenté

```js
// Fonction reprise du TP sur les tableaux (Serie-2/Tableaux.js)
function shuffleInPlace(array) {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 4) Récupération des 52 cartes du paquet d'origine, une seule fois
const deckContainer = document.querySelector('.deck');
const deck = [...deckContainer.querySelectorAll('playing-card')];

// 1) Retire la classe selected de toutes les cartes du paquet
function clearSelection() {
  const cards = deckContainer.querySelectorAll('playing-card');
  for (const card of cards) {
    card.classList.remove('selected');
  }
}

// 2) Boutons A à F
function selectCards(selector) {
  clearSelection();
  const cards = deckContainer.querySelectorAll(selector);
  for (const card of cards) {
    card.classList.add('selected');
  }
}

document.querySelector('#select-ace-spade')
  .addEventListener('click', () => {
    clearSelection();
    deckContainer.querySelector('#SPADE-ACE').classList.add('selected');
  });
document.querySelector('#select-hearts')
  .addEventListener('click', () => selectCards('.heart'));
document.querySelector('#select-red')
  .addEventListener('click', () => selectCards('.heart, .diamond'));
document.querySelector('#select-face-cards')
  .addEventListener('click', () => selectCards('[data-face-card]'));
document.querySelector('#select-red-face-cards')
  .addEventListener('click', () => selectCards('.heart[data-face-card], .diamond[data-face-card]'));
document.querySelector('#select-not-spades')
  .addEventListener('click', () => selectCards('playing-card:not(.spade)'));

// 5) Tirer une main
document.querySelector('#draw-hand')
  .addEventListener('click', () => {
    const deckShuffled = shuffleInPlace([...deck]);
    const drawnCards = deckShuffled.slice(0, 5);
    const handCards = [];
    for (const card of drawnCards) {
      const cardClone = card.cloneNode(true);
      cardClone.removeAttribute('id');
      cardClone.classList.remove('selected');
      handCards.push(cardClone);
    }
    document.querySelector('#hand').replaceChildren(...handCards);
  });
```

---

## 9 · Erreurs fréquentes

| Message ou symptôme | Cause probable | Solution |
|---|---|---|
| `Cannot read properties of null (reading 'addEventListener')` | `querySelector` n'a rien trouvé : faute de frappe dans le sélecteur, ou script exécuté avant le HTML | vérifier le `#id` ; mettre `type="module"` |
| Erreur CORS / module bloqué | page ouverte en `file://` | lancer `php -S 127.0.0.1:8080` |
| `Failed to load module script` / 404 sur un `import` | le fichier importé n'existe pas (ex. `../utils/array.js`) | corriger le chemin ou définir la fonction dans le fichier |
| `cards.classList is undefined` | `classList` appelé sur une `NodeList` | boucler sur les éléments |
| `deck.slice is not a function` | `deck` est une `NodeList`, pas un tableau | `[...querySelectorAll(...)]` |
| Les cartes disparaissent du paquet | ajout des originaux au lieu des clones | `cloneNode(true)` |
| Cartes de la main vides | `cloneNode()` sans `true` | `cloneNode(true)` |
| La sélection s'accumule | `clearSelection()` oublié | l'appeler au début de chaque clic |
| La main s'allonge à chaque tirage | `append` au lieu de `replaceChildren` | `replaceChildren(...handCards)` |

---

## 10 · Quiz pour vérifier sa compréhension

> Essaie de répondre **avant** de déplier la réponse ! 🙈

### 🟢 Niveau 1 : les bases

**Q1.** Que renvoie `document.querySelector('.joker')` s'il n'y a aucun élément avec la classe `joker` ? Et `document.querySelectorAll('.joker')` ?

<details><summary>Réponse</summary>

`querySelector` renvoie **`null`**. `querySelectorAll` renvoie une **`NodeList` vide** (longueur 0), jamais `null`. C'est pourquoi `querySelector(...).classList` peut planter, alors qu'une boucle sur une `NodeList` vide ne fait simplement rien.
</details>

**Q2.** Quelle est la différence entre le HTML et le DOM ?

<details><summary>Réponse</summary>

Le HTML est le **texte** du fichier. Le DOM est l'**arbre d'objets** construit par le navigateur à partir de ce texte. JavaScript modifie le DOM (donc l'affichage), jamais le fichier HTML.
</details>

**Q3.** Pourquoi utilise-t-on `classList.add('selected')` plutôt que `className = 'selected'` ?

<details><summary>Réponse</summary>

`className = ...` **remplace toutes les classes**. La carte perdrait `heart`, `rank-king`, etc. `classList.add` ajoute une classe **sans toucher aux autres**.
</details>

**Q4.** Que se passe-t-il si on appelle `classList.remove('selected')` sur une carte qui n'a pas cette classe ?

<details><summary>Réponse</summary>

**Rien**, et aucune erreur. C'est pour ça que `clearSelection` n'a pas besoin de vérifier avec `contains` avant de retirer.
</details>

### 🟡 Niveau 2 : les sélecteurs

**Q5.** Combien de cartes sélectionnent `.heart.diamond`, `.heart .diamond` et `.heart, .diamond` ? Pourquoi ?

<details><summary>Réponse</summary>

- `.heart.diamond` → **0** : aucune carte n'est à la fois cœur ET carreau.
- `.heart .diamond` → **0** : aucun carreau ne se trouve *à l'intérieur* d'un cœur.
- `.heart, .diamond` → **26** : cœur OU carreau.
</details>

**Q6.** Combien d'éléments sélectionne `.heart, .diamond[data-face-card]` ? Pourquoi n'est-ce pas 6 ?

<details><summary>Réponse</summary>

**16.** La virgule sépare deux sélecteurs complets : « tous les cœurs » (13) **OU** « les figures de carreau » (3). Le `[data-face-card]` ne s'applique qu'au second.
</details>

**Q7.** Pourquoi `deckContainer.querySelectorAll(':not(.spade)')` ne donne-t-il pas 39 ?

<details><summary>Réponse</summary>

Parce que `:not(.spade)` vise **n'importe quel élément** sans la classe `spade`, y compris les `<span class="rank">` et `<span class="suit">` dans les cartes. On obtient 39 cartes + 104 spans = **143**. Il faut écrire `playing-card:not(.spade)`.
</details>

**Q8.** Écris un sélecteur qui vise **tous les as** du paquet. Combien de cartes ?

<details><summary>Réponse</summary>

`.rank-ace` → **4** cartes. (Ou `[id$="-ACE"]` : « id qui se termine par -ACE ».)
</details>

**Q9.** Écris un sélecteur pour les cartes **noires qui ne sont pas des figures**. Combien ?

<details><summary>Réponse</summary>

`.spade:not([data-face-card]), .club:not([data-face-card])` → 2 couleurs × 10 cartes (as à 10) = **20**.
</details>

### 🟠 Niveau 3 : événements et fonctions

**Q10.** Quel est le problème avec ce code ?
```js
button.addEventListener('click', selectCards('.heart'));
```

<details><summary>Réponse</summary>

`selectCards('.heart')` est **exécuté immédiatement** au chargement de la page (les cœurs sont sélectionnés tout de suite). Son résultat, `undefined`, est passé comme écouteur, donc **le clic ne fait rien**. Il faut passer une fonction : `() => selectCards('.heart')`.
</details>

**Q11.** Si on retire l'appel à `clearSelection()` de `selectCards`, que se passe-t-il quand on clique sur A puis sur B ?

<details><summary>Réponse</summary>

Les sélections **s'additionnent** : l'as de pique reste sélectionné, plus les 13 cœurs = **14** cartes.
</details>

**Q12.** Pourquoi le script dans le `<head>` arrive-t-il à trouver les cartes, alors qu'elles sont écrites plus bas dans le HTML ?

<details><summary>Réponse</summary>

Parce qu'il est en `type="module"`. Les modules sont **différés** : ils s'exécutent seulement une fois tout le HTML analysé, donc quand les cartes existent dans le DOM.
</details>

### 🔴 Niveau 4 : la main

**Q13.** Que se passerait-il si on écrivait `shuffleInPlace(deck)` au lieu de `shuffleInPlace([...deck])` ? Les cartes bougeraient-elles à l'écran ?

<details><summary>Réponse</summary>

Le tableau `deck` lui-même serait mélangé : on perdrait l'ordre d'origine du tableau. Mais **les cartes ne bougeraient pas à l'écran** : on réordonne des références dans un tableau JS, pas des éléments du DOM. La consigne demande quand même la copie, pour ne jamais modifier la source.
</details>

**Q14.** Que se passerait-il si on ajoutait directement les cartes de `deck` dans `#hand`, sans les cloner ?

<details><summary>Réponse</summary>

Elles seraient **déplacées** : un élément ne peut être qu'à un seul endroit du DOM. Elles **disparaîtraient du paquet** pour aller dans la main. Au fil des tirages, le paquet se viderait.
</details>

**Q15.** Quelle est la différence entre `cloneNode(true)` et `cloneNode(false)` ? À quoi ressemblerait la carte avec `false` ?

<details><summary>Réponse</summary>

`true` = clone **profond** (avec tous les descendants). `false` = l'élément **seul**, sans ses enfants. Avec `false`, la carte n'aurait ni `<span class="rank">` ni `<span class="suit">` : ce serait une carte **blanche**, sans rang ni symbole.
</details>

**Q16.** Pourquoi doit-on écrire `replaceChildren(...handCards)` avec `...` ? Que donnerait `replaceChildren(handCards)` ?

<details><summary>Réponse</summary>

`replaceChildren` attend des **nœuds séparés en arguments**, pas un tableau. Sans `...`, le tableau serait converti en **texte** : on verrait quelque chose comme `[object HTMLElement],[object HTMLElement],…` au lieu des cartes.
</details>

**Q17.** Pourquoi retire-t-on l'`id` des clones ? Donne une conséquence concrète si on l'oubliait.

<details><summary>Réponse</summary>

Un `id` doit être **unique**. Avec des doublons, le HTML est invalide. Et si le clone était placé avant l'original dans la page, `document.querySelector('#SPADE-ACE')` pourrait trouver **le clone** à la place. (Dans notre code, la recherche part de `.deck`, ce qui protège aussi.)
</details>

**Q18.** Après un tirage, on clique sur F. Explique **les deux raisons** pour lesquelles aucune carte de la main n'est sélectionnée.

<details><summary>Réponse</summary>

1. La recherche est faite avec `deckContainer.querySelectorAll(...)`, donc **seulement dans `.deck`**. `#hand` est en dehors.
2. `clearSelection` et `selectCards` ne regardent que `.deck`. Et pour le bouton A, les clones n'ont **plus d'id**, donc `#SPADE-ACE` ne peut viser que l'original.
</details>

### 🏆 Défi bonus

**Q19.** Modifie le bouton *Draw a hand* pour que les cartes de la main soient **triées par couleur**, sans modifier `deck`.

<details><summary>Une piste</summary>

Avant de cloner, trier `drawnCards` avec `.sort()` en comparant les classes de couleur. Par exemple, avec un ordre `['heart', 'diamond', 'club', 'spade']` et `indexOf` sur la couleur trouvée dans `card.classList`. `drawnCards` est déjà une copie (créée par `slice`), donc la trier ne touche pas `deck`.
</details>

**Q20.** Comment ferais-tu pour qu'un **clic sur une carte du paquet** la sélectionne ou la désélectionne ?

<details><summary>Une piste</summary>

```js
for (const card of deck) {
  card.addEventListener('click', () => card.classList.toggle('selected'));
}
```
`toggle` ajoute la classe si elle est absente, la retire si elle est présente.
</details>

---

> ✅ **Si tu as su répondre à la majorité de ces questions, tu maîtrises les bases du DOM :** sélectionner, modifier les classes, réagir aux événements, et créer ou remplacer des éléments. Bravo ! 🎉
