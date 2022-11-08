"use strict";

const introBtn = document.querySelector(".introBtn");
const beforeGame = document.querySelector(".beforeGame");
const counterBtn = document.querySelector(".counter");
const playBtn = document.querySelector(".playBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const replayBox = document.querySelector(".replaySection");
const lostBox = document.querySelector(".lostSection");
const wonBox = document.querySelector(".wonSection");
const gameSection = document.querySelector(".gameSection");
const originReplay = document.querySelector(".originReplay");
const lostReplay = document.querySelector(".lostReplay");
const wonReplay = document.querySelector(".wonReplay");

const clickBeforeGameSound = new Audio("./sound/clickBeforeGame.wav");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg2.wav");
const ghostSound = new Audio("./sound/ghostClick.mp3");
const winSound = new Audio("./sound/won.wav");
const lostSound = new Audio("./sound/lost.wav");

let numberOfPumpkins = 7;
let numberOfGhosts = 5;

let timer = document.querySelector(".timer");
let timeLeft = 10;
let level = 1;

let Pumpkin = [];
let item;
let Ghost = [];
let Ghost_COUNT = 5;

introBtn.addEventListener("click", () => {
  const readySection = document.querySelector(".readySection");
  const bgSection = document.querySelector(".bgSection");
  readySection.style.display = "none";
  bgSection.style.display = "flex";
  beforeGame.style.display = "flex";
  playSound(clickBeforeGameSound);
});

playBtn.addEventListener("click", () => {
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
  beforeGame.style.display = "none";
  gameSection.style.display = "block";

  refreshGhostCount();
  timerStart();
  playSound(bgSound);
  randomPosition();
  GhostCounter();
  GhostFind();
  whenPumpkinClicked();
});

pauseBtn.addEventListener("click", () => {
  replayBox.style.display = "block";
  lostBox.style.display = "none";
  clearInterval(timer);
  deactivatePumpkinsGhosts();
  stopSound(bgSound);
  playSound(alertSound);
});

lostReplay.addEventListener("click", () => {
  lostBox.style.display = "none";
  gameRestart();
});

wonReplay.addEventListener("click", () => {
  wonBox.style.display = "none";
  nextLevel();
  gameRestart();
});

originReplay.addEventListener("click", () => {
  replayBox.style.display = "none";
  activatePumpkinsGhosts();
  timerStart();
  playSound(bgSound);
});

function whenPumpkinClicked() {
  Pumpkin.forEach((array) => {
    array.addEventListener("click", () => {
      lostBox.style.display = "block";
      timeLeft = 0;
      deactivatePumpkinsGhosts();
      playSound(lostSound);
      stopSound(bgSound);
      pauseBtn.style.pointerEvents = "none";
    });
  });
}

// create pumpkin automatically using for loop and push into Pumpkin array
function createPumpkin(className, count, imgPath) {
  for (let i = 0; i < count; i++) {
    item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    Pumpkin.push(item);
    gameSection.appendChild(item);
  }

  whenPumpkinClicked();
}

// create ghosts automatically using for loop and push into ghosts array
function createGhost(className, count, imgPath) {
  for (let i = 0; i < count; i++) {
    item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    Ghost.push(item);
    gameSection.appendChild(item);
  }
}

// reset(remove) pumpkin and ghosts on gameSection before starting new game
function removePumpkinAndGhosts() {
  Ghost = [];
  Pumpkin = [];
  gameSection.innerHTML = "";
}

// make pumpkins and ghosts not clickable
function deactivatePumpkinsGhosts() {
  Pumpkin.forEach((array) => {
    array.style.pointerEvents = "none";
  });
  Ghost.forEach((array) => {
    array.style.pointerEvents = "none";
  });
}

// make pumpkins and ghosts clickable
function activatePumpkinsGhosts() {
  Pumpkin.forEach((array) => {
    array.style.pointerEvents = "auto";
  });
  Ghost.forEach((array) => {
    array.style.pointerEvents = "auto";
  });
}

// position pumpkin and ghosts randomly
function randomPosition() {
  createGhost("GhostImg", numberOfGhosts, "./img/ghost1.png");
  createPumpkin("PumpkinImg", numberOfPumpkins, "./img/pumpkin1.png");

  let winWidth = 700;
  let winHeight = 300;

  Ghost.forEach((array) => {
    let thisDiv = array;

    // get random numbers for each element
    let randomTop = getRandomNumber(winHeight);
    let randomLeft = getRandomNumber(winWidth);

    // update top and left position
    thisDiv.style.top = randomTop + "px";
    thisDiv.style.left = randomLeft + "px";

    function getRandomNumber(max) {
      return Math.random() * max;
    }
  });

  Pumpkin.forEach((array) => {
    let thisDiv = array;

    let randomTop = getRandomNumber(winHeight);
    let randomLeft = getRandomNumber(winWidth);

    thisDiv.style.top = randomTop + "px";
    thisDiv.style.left = randomLeft + "px";

    function getRandomNumber(max) {
      return Math.random() * max;
    }
  });
}

function updateTimer() {
  timeLeft = timeLeft - 1;
  if (timeLeft > 0) {
    document.querySelector(".timer").innerHTML = `0:${timeLeft}`;
  } else if (timeLeft == 0) {
    document.querySelector(".timer").innerHTML = `0:${timeLeft}`;
    clearInterval(timer);
    showLostBox();
    playSound(lostSound);
    stopSound(bgSound);
  }
}

function showLostBox() {
  lostBox.style.display = "block";
  deactivatePumpkinsGhosts();
}

function timerStart() {
  timer = setInterval(updateTimer, 1000);
  updateTimer();
  lostBox.style.display = "none";
}

function refreshGhostCount() {
  Ghost_COUNT = numberOfGhosts;
  counterBtn.innerHTML = Ghost_COUNT;
}

function GhostCounter() {
  Ghost.forEach((array) => {
    array.addEventListener("click", () => {
      counterBtn.innerHTML = Ghost_COUNT - 1;
      Ghost_COUNT--;
      checker();
    });
  });
}

function checker() {
  if (Ghost_COUNT == 0) {
    wonBox.style.display = "block";
    pauseBtn.style.pointerEvents = "none";
    timeLeft = 0;
    deactivatePumpkinsGhosts();
    playSound(winSound);
    stopSound(bgSound);
  }
}

// when user click ghosts, ghost's gonna be killed(disappeared) one by one
function GhostFind() {
  Ghost.forEach((array) => {
    array.addEventListener("click", (event) => {
      event.target.style.display = "none";
      playSound(ghostSound);
    });
  });
}

function gameRestart() {
  const levelBtn = document.querySelector(".level");
  levelBtn.innerHTML = `Level ${level}`;
  counterBtn.innerHTML = 0;
  timeLeft = 10;
  clearInterval(timer);
  timerStart();
  removePumpkinAndGhosts();
  randomPosition();
  GhostCounter();
  GhostFind();
  playSound(bgSound);
  refreshGhostCount();
  pauseBtn.style.pointerEvents = "auto";
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function initCounts() {
  numberOfPumpkins = 7;
  numberOfGhosts = 5;
  level = 1;
}

function nextLevel() {
  numberOfPumpkins++;
  numberOfGhosts++;
  level++;
}
