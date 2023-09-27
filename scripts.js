document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".memory-card");
  const startGameBtn = document.getElementById("startGameBtn");
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  const gameOverModal = document.getElementById("gameOverModal");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const gameOverMsg = document.getElementById("gameOverMsg");
  const timerDisplay = document.getElementById("timer");

  let hasFlippedCard = false;
  let lockBoard = true; //so you can't flip cards
  let firstCard, secondCard;
  let matchedPairs = 0;
  const totalPairs = cards.length / 2;
  let gameStarted = false;
  let timerInterval;
  let hasWon = false;

  function flipCard() {
    if (
      lockBoard ||
      !gameStarted ||
      timerDisplay.textContent === "Time left: 0"
    )
      return; //lock the board when game is not started/time left
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
    firstCard.classList.add("match");
    secondCard.classList.add("match");
    matchedPairs++;

    resetBoard();

    if (matchedPairs === totalPairs) {
        clearInterval(timerInterval);
        gameOver(true);
    }
  }

  function unflipCards() {
    lockBoard = true;
    //if no match, set timeout before flipping card back around
    setTimeout(() => {
      //make sure unmatched cards are flipped back
      if (
        !firstCard.classList.contains("match") &&
        !secondCard.classList.contains("match")
      ) {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
      }
      lockBoard = false;
      resetBoard();
    }, 500);
  }

  //after each round, reset board - destructuring assignment
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  //immediately invoked function expression
  (function shuffle() {
    cards.forEach((card) => {
      //shuffle the cards, give cards a random nr
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
  })();

  //timer
  function timer() {
    let sec = 60;

    timerInterval = setInterval(function () {
      timerDisplay.textContent = "Time left: " + sec;
      sec--;

      if (sec < 0) {
        clearInterval(timerInterval);
        //if player not finished, gameover func
        gameOver();
      }
    }, 1000);
  }

  //start game
  function startGame() {
    if (!gameStarted) {
      //start the timer
      timer();

      lockBoard = false;

      //reset board
      resetBoard();

      //show start btn
      startGameBtn.style.display = "none";

      //hide tryAgain and play again btn
      tryAgainBtn.style.display = "none";
      playAgainBtn.style.display = "none";

      gameStarted = true;
    }
  }

  function playAgain() {
    if (gameStarted) {
        hasWon= false;
        matchedPairs = 0;
      timerDisplay.textContent = "Time left: 60";

      cards.forEach((card) => {
        card.classList.remove("flip");
        card.classList.remove("match");
      });

      lockBoard = false;
      //reset board
      resetBoard();
    }
  }

  function showWinModal() {
    hasWon = true;
    clearInterval(timerInterval);
    gameOverMsg.textContent = "Congrats, you won!";
    gameOverModal.style.display = "block";
    tryAgainBtn.style.display = "none";
    playAgainBtn.style.display = "inline-block";
  }

  function showLoseModal() {
    gameOverMsg.textContent = "Sorry, time ran out. Try again!";
    gameOverModal.style.display = "block";
    tryAgainBtn.style.display = "inline-block";
    playAgainBtn.style.display = "none";
  }

  function gameOver(isWinner) {
    if (isWinner) {
      showWinModal();
    } else {
      showLoseModal();
    }
  }

  //event listeners
  startGameBtn.addEventListener("click", startGame);
  //if winner wants to play again
  playAgainBtn.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    playAgain();
  });
  //if looser wants to play again
  tryAgainBtn.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    playAgain();
  });

  cards.forEach((card) =>
    card.addEventListener("click", () => flipCard.call(card))
  );
});
