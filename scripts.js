const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let lockBoard = false; //so you can't flip to many cards at once
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
    if (this === firstCard) return; //if double clicking on one card, no match!

  this.classList.add("flip");

  if (!hasFlippedCard) {
    //first time flipped
    hasFlippedCard = true;
    firstCard = this;
    //if true, stop execution
    return;
  }
  //second click
  hasFlippedCard = false;
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  //do the cards match?
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  //match
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  //if no match, set timeout before flipping card back around
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    lockBoard = false;
  }, 1500);
}

//after each round, reset board - destructuring assignment
function resetBoard() {
[hasFlippedCard, lockBoard] = [false, false];
[firstCard, secondCard] = [null, null]
}

cards.forEach((card) => card.addEventListener("click", flipCard));
