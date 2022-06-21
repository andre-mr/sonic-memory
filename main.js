const cards = document.querySelectorAll(".card");
const timeLabel = document.querySelector("#time");
const soundCheck = document.querySelector("#sound");

let flippedCard = null;
let blocked = false;
let matches = 0;
let elapsedTime = 0;
let stopWatch = null;

const soundRight = new Audio("./snd/right.mp3");
const soundWorng = new Audio("./snd/wrong.mp3");
const soundDone = new Audio("./snd/alldone.mp3");
const soundMusic = new Audio("./snd/greenhill.mp3");

soundMusic.loop = true;
soundMusic.volume = 1;

function startup() {
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * 12);
  });
  cards.forEach((card) => {
    card.addEventListener("click", flip);
  });
  soundCheck.addEventListener("change", toggleSound);
  stopWatch = null;
}

function toggleSound() {
  if (soundCheck.checked) {
    soundRight.volume = 1;
    soundWorng.volume = 1;
    soundDone.volume = 1;
    soundMusic.volume = 1;
  } else {
    soundRight.volume = 0;
    soundWorng.volume = 0;
    soundDone.volume = 0;
    soundMusic.volume = 0;
  }
}

const flip = (e) => {
  if (!stopWatch) {
    soundMusic.play();
    timeLabel.innerHTML = "00:00";
    elapsedTime = 0;
    stopWatch = setInterval(() => {
      elapsedTime++;
      let minutes = (elapsedTime / 60).toFixed();
      let seconds = (elapsedTime % 60).toFixed();
      timeLabel.innerHTML =
        `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }, 1000);
  }

  if (!blocked) {
    let selectedCard = e.currentTarget;
    selectedCard.classList.toggle("card-flip");

    if (flippedCard) {
      // there is a card flipped waiting for comparison
      // comparing image source
      if (
        flippedCard.querySelector(".card-front").src !=
        selectedCard.querySelector(".card-front").src
      ) {
        soundWorng.play();
        blocked = true;
        setTimeout(() => {
          selectedCard.classList.toggle("card-flip");
          flippedCard.classList.toggle("card-flip");
          flippedCard.addEventListener("click", flip);
          flippedCard = null;
          blocked = false;
        }, 1000);
      } else {
        flippedCard.removeEventListener("click", flip);
        flippedCard = null;
        matches++;

        if (matches >= 6) {
          clearInterval(stopWatch);
          soundMusic.pause();
          soundMusic.currentTime = 0;
          soundDone.play();
          let blinkingEffect = setInterval(() => {
            cards.forEach((card) => {
              card.classList.toggle("bright-border");
            });
          }, 250);
          setTimeout(() => {
            cards.forEach((card) => {
              card.classList.remove("card-flip");
            });
            matches = 0;
            setTimeout(() => {
              startup();
            }, 500); // avoid showing shuffle process before flipping transition ends
            clearInterval(blinkingEffect);
            cards.forEach((card) => {
              card.classList.remove("bright-border");
            });
          }, 5000);
        } else {
          soundRight.play();
          selectedCard.removeEventListener("click", flip);
          blocked = false;
        }
      }
    } else {
      flippedCard = selectedCard;
      flippedCard.removeEventListener("click", flip); // avoid blocking when selected same card twice
    }

  }
};

startup();
