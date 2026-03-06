// Elemente aus dem HTML holen
const mario = document.getElementById("mario");
const gumba = document.getElementById("gumba");
const score = document.getElementById("score");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOver");
const highScoreText = document.getElementById("highScoreText");
const restartButton = document.getElementById("restartButton");

// Alle drei Life-Icons als Array holen
const lifeIcons = document.querySelectorAll(".life-icon");

// Spiel-Status
let gameRunning = false;
let gameInterval = null;

// Leben: startet mit 3
let lives = 3;

// Session High-Score (bleibt über mehrere Runden erhalten)
let highScore = 0;

// Verhindert mehrfache Kollision bei einem Gumba-Durchgang
let hitThisRound = false;

// Sprung-Funktion
function jump() {
  mario.classList.add("jump-animation");
  setTimeout(() => mario.classList.remove("jump-animation"), 600);
}

// Tastendruck: nur springen wenn das Spiel läuft
document.addEventListener("keypress", (event) => {
  if (gameRunning && !mario.classList.contains("jump-animation")) {
    jump();
  }
});

// Ein Leben abziehen: das letzte Icon von rechts verstecken
function loseLife() {
  // lives zuerst reduzieren
  lives = lives - 1;

  // Das Icon an Position "lives" ausblenden (von rechts nach links)
  // z.B. lives=2 → Icon[2] (das rechte) wird versteckt
  lifeIcons[lives].style.visibility = "hidden";

  // Kollisions-Animation
  mario.classList.add("collision-animation");
  setTimeout(() => mario.classList.remove("collision-animation"), 500);

  // Wenn keine Leben mehr übrig → Game Over
  if (lives === 0) {
    showGameOver();
  }
}

// Game-Over Screen anzeigen
function showGameOver() {
  // Spiel stoppen
  gameRunning = false;
  clearInterval(gameInterval);
  gumba.style.animationPlayState = "paused";

  // High-Score aktualisieren
  const currentScore = Number(score.innerText);
  if (currentScore > highScore) {
    highScore = currentScore;
  }

  highScoreText.innerText = "HIGH SCORE: " + highScore;
  gameOverScreen.style.display = "block";
}

// Game Loop: Score hochzählen + Kollision prüfen
function gameLoop() {
  const marioTop = parseInt(
    window.getComputedStyle(mario).getPropertyValue("top")
  );
  const gumbaLeft = parseInt(
    window.getComputedStyle(gumba).getPropertyValue("left")
  );

  // Score erhöhen
  score.innerText = Number(score.innerText) + 2;

  // hitThisRound zurücksetzen wenn Gumba vorbei ist
  if (gumbaLeft < 0) {
    gumba.style.display = "none";
    hitThisRound = false;
  } else {
    gumba.style.display = "";
  }

  // Kollision: Gumba trifft Mario (Mario steht am Boden)
  if (gumbaLeft < 50 && gumbaLeft > 0 && marioTop > 150 && !hitThisRound) {
    hitThisRound = true;
    loseLife();
  }
}

// startGame Funktion: wird beim Klick auf den Button aufgerufen
function startGame() {
  console.log("Start Button wurde geklickt – Spiel startet!");

  // Button verstecken
  startButton.style.display = "none";

  // Spiel als laufend markieren
  gameRunning = true;

  // Gumba-Animation starten
  gumba.style.animationPlayState = "running";

  // Game Loop starten (alle 50ms)
  gameInterval = setInterval(gameLoop, 50);
}

// Neustart-Funktion: Spiel zurücksetzen und neu starten
function restartGame() {
  console.log("Erneut spielen geklickt – Spiel wird neu gestartet!");

  // Game Over Screen verstecken
  gameOverScreen.style.display = "none";

  // Score auf 0 zurücksetzen
  score.innerText = 0;

  // Leben auf 3 zurücksetzen
  lives = 3;
  lifeIcons[0].style.visibility = "visible";
  lifeIcons[1].style.visibility = "visible";
  lifeIcons[2].style.visibility = "visible";

  // hitThisRound zurücksetzen
  hitThisRound = false;

  // Gumba-Animation neu starten
  gumba.style.animation = "none";
  // Kurze Pause damit der Browser die Animation wirklich neu startet
  setTimeout(() => {
    gumba.style.animation = "";
    gumba.style.animationPlayState = "running";
  }, 10);

  gumba.style.display = "";

  // Spiel läuft wieder
  gameRunning = true;
  gameInterval = setInterval(gameLoop, 50);
}

// Event Handler für den Start Button
startButton.addEventListener("click", () => {
  startGame();
});

// Event Handler für den Neustart Button
restartButton.addEventListener("click", () => {
  restartGame();
});
