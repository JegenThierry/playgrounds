// --- The rewards. Edit these to make them truly yours. ---
const rewards = [
  {
    emoji: "🌞",
    title: "A Day With Me",
    desc: "Redeemable for one whole day together — your plans, your pace, your choice. Phone away, no excuses. I'm all yours.",
    tag: "your day · your rules",
    code: "LIZ-DAY-01",
  },
  {
    emoji: "🪄",
    title: "Any Wish Granted",
    desc: "One wish, no questions asked. Big or small, silly or serious — say the word and I'll make it happen.",
    tag: "one wish · no limits",
    code: "LIZ-WISH-01",
  },
  {
    emoji: "🤐",
    title: "The Shut-Up Card",
    desc: "Present this whenever I'm talking too much and I'll go instantly, blissfully quiet. Use it wisely — it's a one-time miracle.",
    tag: "silence guaranteed",
    code: "LIZ-QUIET-01",
  },
];

const screens = {
  hero: document.querySelector('[data-screen="hero"]'),
  cards: document.querySelector('[data-screen="cards"]'),
  finale: document.querySelector('[data-screen="finale"]'),
};

const cardEl = document.getElementById("card");
const emojiEl = document.getElementById("cardEmoji");
const titleEl = document.getElementById("cardTitle");
const descEl = document.getElementById("cardDesc");
const tagEl = document.getElementById("cardTag");
const codeEl = document.getElementById("cardCode");
const indexEl = document.getElementById("cardIndex");
const dotsEl = document.getElementById("dots");
const skyEl = document.getElementById("sky");
const prevBtn = document.querySelector('[data-action="prev"]');

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let current = 0;

// Build progress dots
rewards.forEach(() => {
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
    const r = rewards[current];
    emojiEl.textContent = r.emoji;
    titleEl.textContent = r.title;
    descEl.textContent = r.desc;
    tagEl.textContent = r.tag;
    codeEl.textContent = r.code;
    indexEl.textContent = `${current + 1} of ${rewards.length}`;
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
  if (current < rewards.length - 1) {
    current++;
    renderCard();
  } else {
    showScreen("finale");
    burstConfetti();
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

function burstConfetti() {
  if (isReduced) return;
  const layer = document.createElement("div");
  layer.className = "confetti";
  document.body.appendChild(layer);
  const emojis = ["🎉", "🎊", "⭐", "🌟", "✨", "🏆", "🎈", "💛"];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("span");
    c.className = "pop";
    c.textContent = pick(emojis);
    c.style.left = `${rand(0, 100)}vw`;
    c.style.fontSize = `${rand(14, 30)}px`;
    c.style.animationDuration = `${rand(2.5, 4.5)}s`;
    c.style.animationDelay = `${rand(0, 0.8)}s`;
    layer.appendChild(c);
  }
  setTimeout(() => layer.remove(), 5500);
}

// Floating background celebration
(function floaties() {
  if (isReduced) return;
  const emojis = ["🎉", "✨", "🎊", "⭐", "🌟", "🎈", "🏅"];
  const count = window.matchMedia("(max-width: 640px)").matches ? 12 : 18;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const f = document.createElement("span");
    const duration = rand(9, 18);
    f.className = "floatie";
    f.textContent = pick(emojis);
    f.style.left = `${rand(0, 100)}vw`;
    f.style.fontSize = `${rand(0.9, 2.1)}rem`;
    f.style.setProperty("--sway", `${rand(-26, 26)}px`);
    f.style.setProperty("--target-opacity", String(rand(0.5, 0.85)));
    f.style.animationDuration = `${duration}s`;
    f.style.animationDelay = `${rand(-duration, 0)}s`;
    frag.appendChild(f);
  }
  skyEl.appendChild(frag);
})();

// Wire up button actions
document.addEventListener("click", (e) => {
  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "begin") startCards();
  else if (action === "next") next();
  else if (action === "prev") prev();
  else if (action === "replay") showScreen("hero");
});

// Swipe support on the coupon
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
