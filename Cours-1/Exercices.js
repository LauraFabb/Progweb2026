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
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < 8; i++) {
    console.log(getRandomInt(4, 8));
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


//ex4 En fonction d'un nombre n (ou n > 0) donné en paramètre, écrire une fonction qui affiche dans la console :

   
   // Les nombres entiers pairs et multiples de 7 compris entre 0 et n.
   function getEvenSeven(n){
    for (let even = 0; even <= n ; even = even +2){
      if  (even % 7 == 0)
      
console.log(even);
      }
    }

    getEvenSeven(72);
   
    //Les nombres entiers pairs et multiples de 3, ainsi que les nombres entiers multiple de 7 compris entre 0 et n.

    function getEvenConditions(n){
      for (let even = 0 ; even <= n ; even = even +2){
        if (even % 7 == 0)

          console.log (even);
      }
    }

    getEvenConditions(getEven);
   // Les nombres entiers pairs et multiples de 3, mais non multiples de 7 compris entre 0 et n.

   //Les nombres entiers pairs compris entre 0 et n.
   function getEven(n){
     for (let even = 0 ;even <=n ; even = even + 2){
      console.log (even);
     }
   }

   getEven(19);