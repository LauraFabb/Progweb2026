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

// A) une seule carte attendue : querySelector
document.querySelector('#select-ace-spade')
  .addEventListener('click', () => {
    clearSelection();
    deckContainer.querySelector('#SPADE-ACE').classList.add('selected');
  });

// B)
document.querySelector('#select-hearts')
  .addEventListener('click', () => selectCards('.heart'));

// C) la virgule exprime un OU entre deux sélecteurs
document.querySelector('#select-red')
  .addEventListener('click', () => selectCards('.heart, .diamond'));

// D)
document.querySelector('#select-face-cards')
  .addEventListener('click', () => selectCards('[data-face-card]'));

// E)
document.querySelector('#select-red-face-cards')
  .addEventListener('click', () => selectCards('.heart[data-face-card], .diamond[data-face-card]'));

// F) playing-card devant :not() pour ne pas sélectionner les <span> enfants
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
