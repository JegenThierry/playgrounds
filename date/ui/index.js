const API_URL = "/api/send-yes";

const btnNo = document.getElementById("btnNo");
const noHint = document.getElementById("noHint");

const hints = [
  "Nice try 😏",
  "Are you sure about that? 🤔",
  "Think again…",
  "The button is running away! 🏃",
  "Catch me if you can! 💨",
  "C'mon, just say yes! 🥺",
  "Wrong button, bestie 🙃",
  "You're not getting rid of me that easy 💪",
  "Maybe reconsider? 👀",
  "One more try… 😈",
];

let noClickCount = 0;
let isPositioned = false;

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function moveNoButton() {
 const padding = 12;

  if (!isPositioned) {
    btnNo.classList.remove("btn-no-init");
    document.body.appendChild(btnNo); // ← key fix
    btnNo.style.position = "fixed";
    isPositioned = true;
  }

  const bw = btnNo.offsetWidth  || 140;
  const bh = btnNo.offsetHeight || 52;

  const x = getRandomInRange(padding, window.innerWidth  - bw - padding);
  const y = getRandomInRange(padding, window.innerHeight - bh - padding);

  btnNo.style.left   = `${x}px`;
  btnNo.style.top    = `${y}px`;
  btnNo.style.right  = "auto";
  btnNo.style.bottom = "auto";

  const btnYes = document.getElementById("btnYes");
  const currentSize = parseFloat(btnYes.style.fontSize) || 1.35;
  btnYes.style.fontSize = Math.min(currentSize + 0.12, 2.5) + "rem";

  noHint.textContent = hints[noClickCount % hints.length];
  noClickCount++;
}

btnNo.addEventListener("mouseenter", moveNoButton);
btnNo.addEventListener("click", moveNoButton);
btnNo.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButton();
  },
  { passive: false },
);

btnNo.classList.add("btn-no-init");

async function handleYes() {
  showScreen("screenSending");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "She said YES! 🎉" }),
    });

    if (!res.ok) throw new Error("API error");

    launchConfetti();
    setTimeout(() => showScreen("screenSuccess"), 600);
  } catch (err) {
    console.error("Failed to send email:", err);
    launchConfetti();
    setTimeout(() => showScreen("screenSuccess"), 600);
  }
}

function showScreen(id) {
  ["screenQuestion", "screenSending", "screenSuccess"].forEach((sid) => {
    const el = document.getElementById(sid);
    if (sid === id) {
      el.classList.remove("screen-hidden");
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    } else {
      el.classList.add("screen-hidden");
    }
  });
}

function launchConfetti() {
  const layer = document.getElementById("confettiLayer");
  const colors = [
    "#e8637a",
    "#f7c5c5",
    "#ffd700",
    "#ff9f43",
    "#a29bfe",
    "#55efc4",
  ];
  const count = 120;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${getRandomInRange(6, 14)}px`;
    piece.style.height = `${getRandomInRange(6, 14)}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.animationDuration = `${getRandomInRange(1.8, 3.5)}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    layer.appendChild(piece);
  }

  setTimeout(() => (layer.innerHTML = ""), 5000);
}

function spawnHeart() {
  const hearts = ["❤️", "💕", "💗", "💖", "🌹", "💝", "✨"];
  const bg = document.getElementById("heartsBg");

  const el = document.createElement("span");
  el.className = "heart-particle";
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left = `${Math.random() * 100}%`;
  el.style.fontSize = `${getRandomInRange(0.8, 2.2)}rem`;
  el.style.animationDuration = `${getRandomInRange(6, 14)}s`;
  el.style.animationDelay = `${Math.random() * 2}s`;
  bg.appendChild(el);

  const duration = parseFloat(el.style.animationDuration) * 1000 + 2000;
  setTimeout(() => el.remove(), duration);
}

setInterval(spawnHeart, 700);

for (let i = 0; i < 6; i++) {
  setTimeout(spawnHeart, i * 200);
}
