// --- The reasons. Specific beats generic, so edit these to make them truly Anne. ---
const compliments = [
  "That smile. The whole room gets a little brighter — like you brought the sun in with you — and a little weaker in the knees at the same time.",
  "You're the most caring person I've ever met. You look after everyone, and somehow still make me feel like the most looked-after of all.",
  "You're warm and sweet… and then you say something so wonderfully inappropriate that I nearly choke on my drink. I'm obsessed with both.",
  "Your dirty jokes have absolutely no business being that funny. I lose every single time.",
  "You make people feel safe just by being near you, and that kind of warmth is rare. It's all yours.",
  "You're sweet enough to melt and bold enough to make me blush, often within the same sentence.",
  "You turn toward everyone the way a sunflower turns to the sun, handing out your warmth all day long. Just once, let this little card turn back toward you. 🌻",
];

const screens = {
  hero: document.querySelector('[data-screen="hero"]'),
  cards: document.querySelector('[data-screen="cards"]'),
  finale: document.querySelector('[data-screen="finale"]'),
};

const cardEl = document.getElementById("card");
const textEl = document.getElementById("cardText");
const indexEl = document.getElementById("cardIndex");
const dotsEl = document.getElementById("dots");
const petalsEl = document.getElementById("petals");
const prevBtn = document.querySelector('[data-action="prev"]');

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let current = 0;

// Build progress dots
compliments.forEach(() => {
  const dot = document.createElement("span");
  dot.className = "dot";
  dotsEl.appendChild(dot);
});
const dots = [...dotsEl.children];

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function renderCard(animate = true) {
  const paint = () => {
    textEl.textContent = compliments[current];
    indexEl.textContent = `reason ${current + 1} of ${compliments.length}`;
    dots.forEach((d, i) => d.classList.toggle("is-on", i === current));
    prevBtn.disabled = current === 0;
  };

  if (animate && !isReduced) {
    cardEl.classList.remove("is-flipping");
    void cardEl.offsetWidth; // restart the animation
    cardEl.classList.add("is-flipping");
    setTimeout(paint, 200);
  } else {
    paint();
  }
}

function next() {
  if (current < compliments.length - 1) {
    current++;
    renderCard();
  } else {
    showScreen("finale");
    burstHearts();
  }
}

function prev() {
  if (current > 0) {
    current--;
    renderCard();
  }
}

function startCards() {
  current = 0;
  showScreen("cards");
  renderCard(false);
}

function burstHearts() {
  if (isReduced) return;
  const layer = document.createElement("div");
  layer.className = "confetti";
  document.body.appendChild(layer);
  const emojis = ["🌻", "🌼", "💛", "✨", "🌻", "💗"];
  for (let i = 0; i < 38; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = pick(emojis);
    h.style.left = `${rand(0, 100)}vw`;
    h.style.fontSize = `${rand(14, 30)}px`;
    h.style.animationDuration = `${rand(2.5, 4.5)}s`;
    h.style.animationDelay = `${rand(0, 0.8)}s`;
    layer.appendChild(h);
  }
  setTimeout(() => layer.remove(), 5500);
}

// Floating background petals
(function petals() {
  if (isReduced) return;
  const emojis = ["🌻", "🌼", "🌻", "🌾", "🌻"];
  const count = window.matchMedia("(max-width: 640px)").matches ? 12 : 18;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const duration = rand(9, 18);
    p.className = "petal";
    p.textContent = pick(emojis);
    p.style.left = `${rand(0, 100)}vw`;
    p.style.fontSize = `${rand(0.9, 2.2)}rem`;
    p.style.setProperty("--sway", `${rand(-26, 26)}px`);
    p.style.setProperty("--target-opacity", String(rand(0.55, 0.9)));
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${rand(-duration, 0)}s`;
    frag.appendChild(p);
  }
  petalsEl.appendChild(frag);
})();

// Wire up button actions
document.addEventListener("click", (e) => {
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "begin") startCards();
  else if (action === "next") next();
  else if (action === "prev") prev();
  else if (action === "replay") showScreen("hero");
});

// Swipe support on the card
let touchX = null;
cardEl.addEventListener(
  "touchstart",
  (e) => (touchX = e.touches[0].clientX),
  { passive: true },
);
cardEl.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (dx < -45) next();
  else if (dx > 45) prev();
  touchX = null;
});
