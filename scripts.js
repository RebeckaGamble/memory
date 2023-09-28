document.addEventListener("DOMContentLoaded", function () {
  const initialTimeLimit = 60; //time limit for the game
  const cards = document.querySelectorAll(".memory-card");
  const startGameBtn = document.getElementById("startGameBtn");
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  const gameOverModal = document.getElementById("gameOverModal");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const gameOverMsg = document.getElementById("gameOverMsg");
  const timerDisplay = document.getElementById("timer");
  const confettiContainer = document.querySelector(".confetti-container");

  let hasFlippedCard = false;
  let lockBoard = true; //so you can't flip cards
  let firstCard, secondCard;
  let matchedPairs = 0;
  const totalPairs = cards.length / 2;
  let gameStarted = false;
  let timerInterval;
  let confettiActive = false;
  let isMatch = false;


  function flipCard() {
    if (
      lockBoard ||
      !gameStarted ||
      timerDisplay.textContent === "Time left: 0" ||
      this.classList.contains("flip")
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
    } else {
 //second click
 hasFlippedCard = false;
 secondCard = this;

 checkForMatch();
    }
   
/*
    if (isMatch) {
      firstCard.classList.add("match");
      secondCard.classList.add("match");
    }*/
  }

  function checkForMatch() {
    //do the cards match?
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  //
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

  //no match, flip cards back around
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

  //immediately invoked function expression, shuffle cards
  (function shuffle() {
    cards.forEach((card) => {
      //shuffle the cards, give cards a random nr
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
  })();

  //timer
  function timer() {
    let sec = initialTimeLimit;

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

  //start game first time
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

  //when player wants to play again
  function playAgain() {
    if (gameStarted) {
      matchedPairs = 0;
      //stop and reset timer
      clearInterval(timerInterval);
      timerDisplay.textContent = "Time left: " + initialTimeLimit;

      removeConfetti();

      cards.forEach((card) => {
        card.classList.remove("flip");
        card.classList.remove("match");
      });
      (function shuffle() {
        cards.forEach((card) => {
          let randomPos = Math.floor(Math.random() * 12);
          card.style.order = randomPos;
        });
      })();

      //start timer
      timer();

      lockBoard = false;
      //reset board
      resetBoard();
    }
  }

  //get random color on the confetti
  function getRandomColor() {
    const letters = "01234567ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  //winner confetti
  function createConfetti() {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDuration = `${Math.random() * 6 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;

      const randomColor = getRandomColor();
      confetti.style.backgroundColor = randomColor;

      confettiContainer.appendChild(confetti);
    }
  }

  //to stop the confetti
  function removeConfetti() {
    while (confettiContainer.firstChild) {
      confettiContainer.removeChild(confettiContainer.firstChild);
    }
  }

  //if won game, show modal:
  function showWinModal() {
    clearInterval(timerInterval);
    gameOverMsg.textContent = "Congrats, you won!";
    gameOverModal.style.display = "block";
    tryAgainBtn.style.display = "none";
    playAgainBtn.style.display = "inline-block";
    if (!confettiActive) {
      createConfetti();
      confettiActive = true;
    }
  }

  //if lost game, show:
  function showLoseModal() {
    gameOverMsg.textContent = "Sorry, time ran out. Try again!";
    gameOverModal.classList.add("show");
    gameOverModal.style.display = "block";
    tryAgainBtn.style.display = "inline-block";
    playAgainBtn.style.display = "none";
    gameOverModal.style.opacity = 1;

    gameOverMsg.classList.add("loserGlow");
  }

  function gameOver(isWinner) {
    if (isWinner) {
      showWinModal();
    } else {
      showLoseModal();
    }
  }

  //event listeners:
  //starting the game first time
  startGameBtn.addEventListener("click", startGame);

  //if won and wants to play again
  playAgainBtn.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    playAgain();
  });

  //if lost and wants to play again
  tryAgainBtn.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    playAgain();
  });

  //flipping card
  cards.forEach((card) =>
    card.addEventListener("click", () => flipCard.call(card))
  );
});
