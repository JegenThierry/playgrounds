const messages = [
  "You make my heart smile.",
  "I love you more than coffee (and that's a lot).",
  "You are my favorite notification.",
  "My world is better with you in it.",
  "You are the CSS to my HTML.",
  "Forever wouldn't be long enough with you.",
];

let heartContainer = document.getElementById("heart-container");
let messageEl = document.getElementById("message-text");

window.addEventListener("DOMContentLoaded", () => {
  heartContainer = document.getElementById("heart-container");
  messageEl = document.getElementById("message-text");
});

const heartColors = ["#f43f5e", "#fb7185", "#fda4af", "#e11d48"];

function nextMessage() {
  messageEl.classList.remove("fade-in");
  void messageEl.offsetWidth;

  const currentText = messageEl.innerText;
  let newText = currentText;

  while (newText === currentText) {
    newText = messages[Math.floor(Math.random() * messages.length)];
  }

  messageEl.innerText = newText;
  messageEl.classList.add("fade-in");
}

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart-bg");
  heart.innerHTML = "❤";

  const size = Math.random() * 30 + 20 + "px";
  const left = Math.random() * 100 + "vw";
  const duration = Math.random() * 3 + 4 + "s";
  const color = heartColors[Math.floor(Math.random() * heartColors.length)];

  heart.style.fontSize = size;
  heart.style.left = left;
  heart.style.animationDuration = duration;
  heart.style.color = color;

  heartContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8000);
}

setInterval(createHeart, 300);

for (let i = 0; i < 10; i++) {
  setTimeout(createHeart, i * 100);
}
