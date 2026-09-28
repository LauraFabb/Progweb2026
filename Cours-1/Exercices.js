// ============================================================
// EX1
// ÉNONCÉ : Écrire une fonction qui retourne la plus grande valeur
// parmi les trois nombres fournis en paramètre.
// ============================================================
// trad fr : je crée une fonction avec 3 paramètres. Je décide que a est le plus grand (max = a). Je regarde si b est plus grand que max : si oui, max devient b. Pareil pour c. À la fin je retourne max.
function value(a, b, c) {
  let max = a;

  if (b > max) {
    max = b;
  }

  if (c > max) {
    max = c;
  }

  return max;
}

console.log(value(5, 8, 2)); // 8


// ============================================================
// EX2
// ÉNONCÉ : Écrire une fonction qui retourne un nombre entier
// pseudo-aléatoire entre une borne inférieure et une borne supérieure
// (bornes entières et comprises dans l'intervalle).
// ============================================================
// trad fr : Math.random() donne un nombre décimal entre 0 et 1 (1 exclu). 
// (max - min + 1) donne le nombre de valeurs possibles. Je multiplie, j'arrondis vers le bas avec Math.floor pour avoir un entier, puis j'ajoute min pour décaler dans le bon intervalle.
// Le "+ 1" sert à ce que max soit inclus.
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < 8; i++) {
  console.log(getRandomInt(4, 8));
}


// ============================================================
// EX3
// ÉNONCÉ : Écrire deux fonctions compareA et compareB qui retournent
// les mêmes résultats que dans les exemples suivants :
//   compareA(4, '4');      // true
//   compareA(4.0, '4');    // true
//   compareA(4, 'quatre'); // false
//   compareB(8, '8');      // false
//   compareB(8, 'huit');   // false
// ============================================================
// trad fr : compareA utilise == (comparaison "souple") : elle convertit les types avant de comparer, donc 4 == '4' est vrai.
// compareB utilise === (comparaison "stricte") : elle compare aussi le type, donc 8 === '8' est faux (nombre vs texte).
function compareA(a, b) {
  return a == b;
}

function compareB(a, b) {
  return a === b;
}

console.log(compareA(4, '4'));      // true
console.log(compareA(4.0, '4'));    // true
console.log(compareA(4, 'quatre')); // false

console.log(compareB(8, '8'));      // false
console.log(compareB(8, 'huit'));   // false


// ============================================================
// EX4
// ÉNONCÉ : En fonction d'un nombre n (où n > 0) donné en paramètre,
// écrire une fonction qui affiche dans la console :
//  * Les nombres entiers pairs compris entre 0 et n.
//  * Les nombres entiers pairs et multiples de 7 compris entre 0 et n.
//  * Les nombres entiers pairs et multiples de 3, ainsi que les
//    nombres entiers multiples de 7 compris entre 0 et n.
//  * Les nombres entiers pairs et multiples de 3, mais non multiples
//    de 7 compris entre 0 et n.
// ============================================================
// trad fr : pour chaque consigne, je crée une fonction qui parcourt tous les nombres de 0 à n avec une boucle for. Dans la boucle, j'utilise un if avec le modulo % (le reste de la division) pour tester la condition, et j'affiche avec console.log si elle est vraie.
// Un nombre est pair si i % 2 === 0, multiple de 3 si i % 3 === 0, multiple de 7 si i % 7 === 0.
// && veut dire "ET", || veut dire "OU", ! veut dire "NON".

// a) Les pairs entre 0 et n
function getEven(n) {
  for (let i = 0; i <= n; i++) {
    if (i % 2 === 0) {
      console.log(i);
    }
  }
}

// b) Les pairs ET multiples de 7
function getEvenSeven(n) {
  for (let i = 0; i <= n; i++) {
    if (i % 2 === 0 && i % 7 === 0) {
      console.log(i);
    }
  }
}

// c) (pairs ET multiples de 3) OU multiples de 7
// Les parenthèses sont importantes : elles regroupent le "ET" avant le "OU".
function getEvenThreeOrSeven(n) {
  for (let i = 0; i <= n; i++) {
    if ((i % 2 === 0 && i % 3 === 0) || i % 7 === 0) {
      console.log(i);
    }
  }
}

// d) Pairs ET multiples de 3, mais PAS multiples de 7
function getEvenThreeNotSeven(n) {
  for (let i = 0; i <= n; i++) {
    if (i % 2 === 0 && i % 3 === 0 && i % 7 !== 0) {
      console.log(i);
    }
  }
}

getEven(20);
getEvenSeven(72);
getEvenThreeOrSeven(50);
getEvenThreeNotSeven(50);


// ============================================================
// EX5
// ÉNONCÉ : Écrire deux fonctions retournant réciproquement :
//  * le nombre de piles obtenus sur un lancé de n pièces de monnaie
//    simulées par l'utilisation du générateur de nombre aléatoire.
//  * le nombre de piles et de faces obtenus sur un lancé de n pièces
//    de monnaie simulées par l'utilisation du générateur de nombre
//    aléatoire.
// ============================================================
// trad fr : je simule une pièce avec Math.random(). Si le nombre est plus petit que 0.5, c'est pile, sinon c'est face (une chance sur deux).
// Fonction 1 : boucle de n lancers, +1 au compteur à chaque pile, puis je retourne le compteur.
// Fonction 2 : pareil, mais je compte aussi les faces. Une fonction ne peut retourner qu'une seule chose, donc je retourne un objet { piles, faces }.
function countHeads(n) {
  let piles = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.5) {
      piles++; // piles++ est pareil que piles = piles + 1
    }
  }
  return piles;
}

function countHeadsAndTails(n) {
  let piles = 0;
  let faces = 0;
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.5) {
      piles++;
    } else {
      faces++;
    }
  }
  return { piles: piles, faces: faces };
}

console.log(countHeads(100));
console.log(countHeadsAndTails(100)); // { piles: 52, faces: 48 } par exemple


// ============================================================
// EX6
// ÉNONCÉ : Écrire une fonction qui indique si un nombre entier est un
// nombre premier ou non. Tester la fonction avec les valeurs
// suivantes : 0, 1, 2, 3, 4, 9, 11, 26, 87178291197, 87178291199.
// ============================================================
// trad fr : un nombre premier est plus grand que 1 et n'est divisible que par 1 et par lui-même.
// Si n < 2, ce n'est pas premier. Sinon, je teste les diviseurs possibles de 2 jusqu'à la racine carrée de n. Si un seul divise n (reste = 0), je retourne false tout de suite. Si aucun ne divise n, je retourne true.
// Pourquoi la racine carrée ? Si n a un diviseur plus grand que sa racine, il en a forcément un plus petit. Ça évite de faire des milliards de tours pour les gros nombres.
function isPrime(n) {
  if (n < 2) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

const tests = [0, 1, 2, 3, 4, 9, 11, 26, 87178291197, 87178291199];
for (const t of tests) {
  console.log(t + " -> " + isPrime(t));
}
// Attendu : false, false, true, true, false, false, true, false, false, true


// ============================================================
// EX7
// ÉNONCÉ : Écrire une fonction nommée cl qui affiche dans la console,
// ligne après ligne, toutes les données fournies en paramètre.
// Exemple d'appel :
//   cl(1, 2, "a", [3.1, 4, 159]);
// ============================================================
// trad fr : je ne sais pas combien de paramètres on va me passer, donc j'utilise ...args (le "rest parameter") qui met tous les paramètres dans un tableau. Ensuite, avec for...of, je parcours ce tableau et j'affiche chaque élément avec console.log. Chaque console.log affiche sur une nouvelle ligne.
function cl(...args) {
  for (const arg of args) {
    console.log(arg);
  }
}

cl(1, 2, "a", [3.1, 4, 159]);


// ============================================================
// EX8
// ÉNONCÉ : Écrire deux fonctions :
//  * double, qui retourne le double du nombre reçu ;
//  * square, qui retourne le carré du nombre reçu.
// Écrire ensuite une fonction transform qui reçoit un nombre et une
// fonction en paramètres. Elle doit appliquer la fonction reçue au
// nombre, puis retourner le résultat.
//   transform(5, double); // Returns 10
//   transform(5, square); // Returns 25
// ============================================================
// trad fr : double et square sont des fonctions simples qui retournent un calcul.
// transform reçoit un nombre ET une fonction (appelée "func"). Comme les fonctions sont des valeurs en JS, on peut les passer en paramètre. Dans transform, j'appelle func(n) et je retourne le résultat.
// Attention : on écrit transform(5, double) et pas transform(5, double()). Sans parenthèses, on passe la fonction elle-même. Avec, on l'appellerait tout de suite.
function double(n) {
  return n * 2;
}

function square(n) {
  return n * n;
}

function transform(n, func) {
  return func(n);
}

console.log(transform(5, double)); // 10
console.log(transform(5, square)); // 25


// ============================================================
// EX9
// ÉNONCÉ : Écrire une fonction repeatTransform qui reçoit un nombre,
// une fonction et un nombre de répétitions en paramètres. Elle doit
// appliquer la fonction au nombre, puis appliquer à nouveau cette même
// fonction au résultat obtenu, autant de fois que demandé. Elle
// retourne le résultat final.
//   repeatTransform(2, double, 3); // Returns 16 : 2 → 4 → 8 → 16
//   repeatTransform(2, square, 2); // Returns 16 : 2 → 4 → 16
// ============================================================
// trad fr : c'est comme transform, mais je le répète plusieurs fois. Je mets le nombre de départ dans une variable result. Je fais une boucle qui tourne "times" fois, et à chaque tour j'écrase result par func(result). À la fin je retourne result.
function repeatTransform(n, func, times) {
  let result = n;
  for (let i = 0; i < times; i++) {
    result = func(result);
  }
  return result;
}

console.log(repeatTransform(2, double, 3)); // 16
console.log(repeatTransform(2, square, 2)); // 16


// ============================================================
// EX10
// ÉNONCÉ : Écrire une fonction createGreeting qui reçoit une formule
// de salutation et retourne une nouvelle fonction. La fonction
// retournée reçoit un prénom et retourne le message complet.
//   const sayHello = createGreeting('Hello');
//   const sayWelcome = createGreeting('Welcome');
//   sayHello('Ada');     // Returns "Hello Ada !"
//   sayWelcome('Linus'); // Returns "Welcome Linus !"
// ============================================================
// trad fr : createGreeting reçoit une formule ("Hello") et retourne une nouvelle fonction. Cette fonction retournée reçoit un prénom et fabrique le message.
// La fonction retournée "se souvient" de la formule reçue au départ, même après la fin de createGreeting. C'est ce qu'on appelle une closure.
// C'est le même principe que makeSquareFunction dans ton cours.
function createGreeting(greeting) {
  return function(name) {
    return greeting + " " + name + " !";
  };
}

const sayHello = createGreeting('Hello');
const sayWelcome = createGreeting('Welcome');

console.log(sayHello('Ada'));     // "Hello Ada !"
console.log(sayWelcome('Linus')); // "Welcome Linus !"