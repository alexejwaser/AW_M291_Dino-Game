// --- Get all elements from the HTML ---
const mario = document.getElementById("mario");
const gumba = document.getElementById("gumba");
const gumba2 = document.getElementById("gumba2");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highscore");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlaySubtitle = document.getElementById("overlay-subtitle");
const milestoneEl = document.getElementById("milestone");

// Sound placeholders - add a real file in index.html (e.g. src="sounds/jump.mp3") to enable
const jumpSound = document.getElementById("jump-sound");
const gameOverSound = document.getElementById("gameover-sound");

// --- Game state ---
let currentScore = 0;
let highScore = 0;
let isRunning = true;
let isPaused = false;
let gameLoop;

// --- Helper: play a sound (silently does nothing if no audio file is set) ---
function playSound(sound) {
  sound.play().catch(() => {});
}

// --- Jump ---
function jump() {
  mario.classList.add("jump-animation");
  playSound(jumpSound);
  setTimeout(() => mario.classList.remove("jump-animation"), 600);
}

// --- Speed: enemies get faster as the score rises, down to a minimum of 0.5s per cycle ---
function updateSpeed() {
  const speed = Math.max(0.5, 1.33 - currentScore / 500);
  gumba.style.animationDuration = speed + "s";
  gumba2.style.animationDuration = speed + "s";
}

// --- Milestone: show a brief flash message at certain score thresholds ---
function showMilestone(text) {
  milestoneEl.innerText = text;
  milestoneEl.classList.add("show");
  setTimeout(() => milestoneEl.classList.remove("show"), 1000);
}

// --- Overlay: show or hide the Game Over / Pause panel ---
function showOverlay(title, subtitle) {
  overlayTitle.innerText = title;
  overlaySubtitle.innerText = subtitle;
  overlay.style.display = "flex";
}

function hideOverlay() {
  overlay.style.display = "none";
}

// --- Game Over ---
function triggerGameOver() {
  isRunning = false;
  clearInterval(gameLoop);
  gumba.style.animationPlayState = "paused";
  gumba2.style.animationPlayState = "paused";
  playSound(gameOverSound);

  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreEl.innerText = "Best: " + highScore;
  }

  showOverlay("GAME OVER", "Score: " + currentScore + " — Press any key to restart");
}

// --- Restart ---
function restart() {
  currentScore = 0;
  scoreEl.innerText = 0;
  isRunning = true;
  isPaused = false;
  hideOverlay();
  gumba.style.animationPlayState = "";
  gumba2.style.animationPlayState = "";
  gumba.style.animationDuration = "1.33s";
  gumba2.style.animationDuration = "1.33s";
  startLoop();
}

// --- Pause (toggle with Escape key) ---
function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    clearInterval(gameLoop);
    gumba.style.animationPlayState = "paused";
    gumba2.style.animationPlayState = "paused";
    showOverlay("PAUSED", "Press Escape to resume");
  } else {
    hideOverlay();
    gumba.style.animationPlayState = "";
    gumba2.style.animationPlayState = "";
    startLoop();
  }
}

// --- Keyboard input ---
document.addEventListener("keydown", (event) => {
  if (event.code === "Escape" && isRunning) { togglePause(); return; }
  if (!isRunning) { restart(); return; }
  if (isPaused) return;

  // Space or Arrow Up to jump
  if (event.code === "Space" || event.code === "ArrowUp") {
    if (!mario.classList.contains("jump-animation")) jump();
  }
});

// --- Click / tap input (also works on mobile) ---
document.addEventListener("click", () => {
  if (!isRunning) { restart(); return; }
  if (!isPaused && !mario.classList.contains("jump-animation")) jump();
});

// --- Main game loop (runs 20 times per second) ---
function startLoop() {
  gameLoop = setInterval(() => {
    const marioTop = parseInt(window.getComputedStyle(mario).getPropertyValue("top"));
    const gumbaLeft = parseInt(window.getComputedStyle(gumba).getPropertyValue("left"));
    const gumba2Left = parseInt(window.getComputedStyle(gumba2).getPropertyValue("left"));

    // Increase score each tick
    currentScore += 2;
    scoreEl.innerText = currentScore;

    // Speed up enemies as score rises
    updateSpeed();

    // Flash a message at score milestones
    if ([100, 500, 1000, 2000].includes(currentScore)) showMilestone(currentScore + "!");

    // Hide enemies when they slide off the left edge of the screen
    gumba.style.display = gumbaLeft < 0 ? "none" : "";
    gumba2.style.display = gumba2Left < 0 ? "none" : "";

    // Collision: an enemy is at Mario's position while Mario is on the ground
    const isHit = (enemyLeft) => enemyLeft < 50 && enemyLeft > 0 && marioTop > 150;
    if (isHit(gumbaLeft) || isHit(gumba2Left)) triggerGameOver();
  }, 50);
}

// Start the game!
startLoop();
