// Tableaux de nombres

//1. Afficher tous les nombres dans la console
const numbers = Object.freeze([3, 14, 15, 92 ,65, 35, 89, 79, 32, 38]);

numbers.forEach((element) => console.log(element));

//2. Retourner un tableau avec les valeurs doublées 
const doubleValues = numbers.map( n => n*2);
console.log(doubleValues);

//3. Retourner un tableau ne contenant que les valeurs impaires
const even = numbers.filter ( n => n%2);
console.log(even);
//4.Retourner un tableau ne contenant pas le premier élément
console.log(numbers.slice(1));
//.5 Retourner un tableau ne contenant pas le dernier élément
console.log(numbers.slice(0, -1));
//6.Retourner la somme des nombres
const initinalValue = 0;
const somWithInitinal = numbers.reduce((acc, curr) => acc + curr, initinalValue);
console.log(somWithInitinal);

//7.Retourner le plus grand nombre
console.log(Math.max(...numbers));
//.8 Indiquer si le tableau contient au moins un nombre multiple de 9
console.log(numbers.some(n => n % 9 === 0));
//9. Indiquer si le tableau ne contient que des nombres positifs
console.log(numbers.every(n => n > 0));
//10. Retourner un tableau contenant d'abord les nombres pairs, puis les nombres impairs, en conservant leur ordre relatif dans chaque groupe
const evenThenOdd = [
    ...numbers.filter(n => n % 2 === 0),
    ...numbers.filter(n => n %2 !== 0),
];
console.log(evenThenOdd);

//Tableaux de chaînes de caractères

const strings = Object.freeze(["Sator", "Arepo", "Tenet", "Opera", "Rotas"]);

//Réalisez les fonctionnalités ci-dessous. La structure de données initiale ne doit pas être modifiée.

    //1.Retourner tous les mots contenant au moins un r
    const LetterR = strings.filter ( w => w.includes('r'));
console.log(LetterR);
    //2. Indiquer si tous les mots font 5 lettres
    const letterLength = strings.every(w => w.length ===5);
    console.log(letterLength);
    //3. Retourner un nouveau tableau contenant le mot Lorem au début, suivi des mots du tableau initial
    const newWord = Object.freeze(["Lorem"]);
    const combine = [...newWord,...strings];
console.log(combine);
// ou bien :
const withLorem = ["Lorem", ...strings];
console.log(withLorem);
    //4. Retourner un nouveau tableau contenant les mots du tableau initial, suivis du mot Ipsum
    const withtIpsum = [...strings, "Ipsum"];
    console.log(withtIpsum);
    //5. Retourner un tableau en remplaçant le mot du milieu par le mot radar (si le tableau a un nombre de mots pair, remplacer le mot situé à l'indice juste avant le milieu)
    const end = strings.slice(3);
    const begin = strings.slice(0,2);
    const withRadar = [...begin, "radar",...end];
    console.log(withRadar);
    // ou bien :
    const middle = Math.floor((strings.length - 1) / 2);
const wRadar = [
  ...strings.slice(0, middle),
  "radar",
  ...strings.slice(middle + 1),
];
console.log(wRadar);

    //6. Retourner la concaténation de tous les mots
    const joined = strings.join("");
    console.log(joined);
    //7. Retourner le mot qui vient en premier selon l'ordre alphabétique, sans modifier le tableau initial (localeCompare et toSorted peuvent être utiles)
    const sorted = strings.toSorted((a, b) => a.localeCompare(b));
console.log(sorted);
console.log(sorted.slice(0,1));

// ou bien 
const [first] = strings.toSorted((a, b) => a.localeCompare(b));
console.log(first);

    //8. Concaténer les chaînes dans l'ordre de leurs indices, convertir le résultat en minuscules, puis indiquer s'il forme un palindrome, c'est-à-dire s'il se lit de la même manière dans les deux sens
const text = strings.join("").toLowerCase();
const reversed = text.split("").toReversed().join("");
console.log(text === reversed); 

    //Tableaux d'objets : jeu de cartes

    //Nous allons créer un jeu de 52 cartes : 13 valeurs pour chacune des quatre couleurs. Chaque carte possède un rang numérique, de 2 à 14. Le valet vaut 11, la dame 12, le roi 13 et l'as 14. Les rangs sont donc classés de la plus faible à la plus forte valeur.

const JACK = 11;
const QUEEN = 12;
const KING = 13;
const ACE = 14;

const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, JACK, QUEEN, KING, ACE];
const SUITS = ['hearts', 'spades', 'clubs', 'diamonds'];

    //1. Proposer une structure d'objet pour représenter une carte (son rang numérique et sa couleur), ainsi qu'une structure pour représenter le paquet entier.
const carte = { rank: ACE, suit: 'hearts'};


    //2. Écrire une fonction buildBaseDeck qui construit et retourne un paquet de 52 cartes classiques à partir de RANKS et SUITS.
function buildBaseDeck() {
  const deck = [];

  SUITS.forEach(function (suit) {
    RANKS.forEach(rank => {
      deck.push({ rank: rank, suit: suit });
    });
  });

  return deck;
}

function buildBaseDeckV2() {
  const deck = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank: rank, suit: suit });
    }
  }
  return deck;
}

const deck = buildBaseDeck();
console.log(deck.length);
console.log(deck);

    //3. Écrire une fonction shuffleInPlace qui mélange le tableau de cartes reçu selon la version moderne de l'algorithme de Fisher–Yates : pour chaque indice i, du dernier jusqu'à 1, échanger l'élément d'indice i avec un élément d'indice aléatoire j compris entre 0 et i.

function shuffleInPlace(deck) {
  for (let i = deck.length - 1; i >= 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}


shuffleInPlace(deck);
console.log(deck);

    //4. Écrire une fonction drawCards qui reçoit un paquet et un nombre de cartes, copie le paquet, mélange cette copie et retourne le nombre de cartes demandé. Le paquet reçu par drawCards ne doit pas être modifié.

 function drawCards(deck, count) {
const copy = [...deck];
shuffleInPlace(copy);
return copy.slice(0, count);
}
  const hand = drawCards(deck, 5) ;

  console.log(hand);
  console.log(deck.length);

  //5. Écrire une fonction compareRank qui reçoit deux cartes et compare uniquement leurs rangs numériques. Elle retourne un nombre négatif si la première est plus faible, zéro si les deux rangs sont égaux, ou un nombre positif si la première est plus forte. Tirer deux cartes et utiliser cette fonction pour annoncer la plus forte, ou une égalité.
function compareRank(carteA, carteB ) {
  return carteA.rank - carteB.rank;
}
const carte1 = deck.pop();
const carte2 = deck.pop();

const resultat = compareRank(carte1, carte2);

console.log(`Carte 1 : ${carte1.rank} de ${carte1.suit}`);
console.log(`Carte 2 : ${carte2.rank} de ${carte2.suit}`);

if (resultat > 0) {
  console.log("La carte 1 est la plus forte.");
} else if (resultat < 0) {
  console.log("La carte 2 est la plus forte.");
} else {
  console.log("Égalité !");
}
    //6. Utiliser drawCards pour obtenir une main de cinq cartes distinctes. Écrire une fonction getHighestCard qui parcourt cette main et retourne la carte de plus forte valeur. Si plusieurs cartes ont ce rang, la première sera retournée.


 function getHighestCard(hand){
  let best = hand[0];
  for (let i = 0 ; i < hand.length ; i++){
    if (compareRank(hand[i], best)> 0){
    best = hand[i];
  }
 }
return best;
}

const highest = getHighestCard(hand);
console.log(highest);


    //7. Écrire une fonction displayRank qui retourne les rangs de 2 à 10 sous forme de texte et remplace 11, 12, 13 et 14 par J, Q, K et A respectivement. Écrire ensuite une fonction showCard qui affiche une carte dans le terminal avec son rang et le symbole Unicode de sa couleur (♥, ♠, ♣ ou ♦). Les cœurs et carreaux doivent apparaître en rouge, les piques et trèfles en noir, sur fond blanc pour rester lisibles dans tous les thèmes du terminal. Voici un exemple à essayer avec Node.js :

    const red = '\x1b[31;47m';
    const black = '\x1b[30;47m';
    const defaultColor = '\x1b[0m';
    const label1 = 'A♥';
    const label2= 'A♠';

    console.log(red + label1 + defaultColor);
    console.log(black + label2 + defaultColor);

    //Utiliser showCard pour afficher les cartes de la main de cinq cartes et rétablir la couleur normale après chaque carte.

