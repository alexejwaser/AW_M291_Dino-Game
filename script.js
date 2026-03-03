const mario = document.getElementById("mario");
const gumba = document.getElementById("gumba");
const score = document.getElementById("score");

function jump() {
  mario.classList.add("jump-animation");
  setTimeout(() => mario.classList.remove("jump-animation"), 600);
}

document.addEventListener("keypress", (event) => {
  if (!mario.classList.contains("jump-animation")) {
    jump();
  }
});

setInterval(() => {
  const marioTop = parseInt(
    window.getComputedStyle(mario).getPropertyValue("top"),
  );
  const gumbaLeft = parseInt(
    window.getComputedStyle(gumba).getPropertyValue("left"),
  );
  score.innerText = Number(score.innerText) + 2;

  if (gumbaLeft < 0) {
    gumba.style.display = "none";
  } else {
    gumba.style.display = "";
  }

  if (gumbaLeft < 50 && gumbaLeft > 0 && marioTop > 150) {
    score.innerText = 0;
  }
}, 50);
