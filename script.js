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

// --- Enemy positions (pixels from the left edge of the game) ---
let gumbaX = 550;
let gumba2X = 950; // starts further right so the player has time before the second enemy arrives

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
  gumbaX = 550;
  gumba2X = 950;
  hideOverlay();
  startLoop();
}

// --- Pause (toggle with Escape key) ---
function togglePause() {
  isPaused = !isPaused;

  if (isPaused) {
    clearInterval(gameLoop);
    showOverlay("PAUSED", "Press Escape to resume");
  } else {
    hideOverlay();
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

    // Increase score each tick
    currentScore += 2;
    scoreEl.innerText = currentScore;

    // Speed increases gradually with score (starts at 8px/tick, caps at 20px/tick)
    const speed = Math.min(8 + currentScore / 250, 20);

    // Move enemies left; when off the left edge reset them to the right
    gumbaX -= speed;
    gumba2X -= speed;
    if (gumbaX < -50) gumbaX = 650;
    if (gumba2X < -50) gumba2X = 650;

    // Apply the new positions
    gumba.style.left = gumbaX + "px";
    gumba2.style.left = gumba2X + "px";

    // Flash a message at score milestones
    if ([100, 500, 1000, 2000].includes(currentScore)) showMilestone(currentScore + "!");

    // Collision: an enemy is at Mario's position while Mario is on the ground
    const isHit = (x) => x < 50 && x > 0 && marioTop > 150;
    if (isHit(gumbaX) || isHit(gumba2X)) triggerGameOver();
  }, 50);
}

// Start the game!
startLoop();
