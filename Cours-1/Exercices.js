//ex1  Ecrire une fonction qui retourne la plus grande valeur parmi les trois nombres fournis en paramètre.

function value(a, b, c) {
  let max = a;

  if (b > max){
    max = b;
  }

  if (c > max){
    max = c;
  }

  return max;
}

console.log(value(5, 8, 2));

//ex2 Ecrire une fonction qui retourne un nombre entier pseudo-aléatoire entre une borne inférieure et une borne supérieure (bornes entières et comprises dans l'intervalle).
function getRandomInt(min, max){
return (Math.random() + min) * (max - min);
}

for (let i=0;i>10;i++){

}

//ex3  Ecrire deux fonctions compareA et compareB qui retournent les mêmes résultats que dans les exemples suivant:
function compareA(a, b) {
    return a == b;
}

function compareB(a, b) {
    return a === b;
}

console.log(compareA(4, '4'));
console.log(compareA(4.0, '4'));
console.log(compareA(4, 'quatre'));

console.log(compareB(8, '8'));
console.log(compareB(8, 'huit'));
