const letters = [
  [
    "Hi you,",
    "You are the prettiest girl in the whole world. Not just today. Every day. Even on the messy ones. Especially on the quiet ones.",
    "always, 💌",
  ],
  [
    "To the loveliest,",
    "The moon is a little jealous tonight. So are the stars. They have all seen you, and now they know they were never the prettiest thing in the sky.",
    "yours, ✨",
  ],
  [
    "A tiny confession,",
    "I wished on a star tonight. It blinked back and told me it was already taken. Apparently it had been wishing on you the whole time.",
    "with love, 🌟",
  ],
  [
    "Hello pretty,",
    "If the world were a gallery, you would be the painting everyone stops in front of. Twice. And then once more on the way out.",
    "endlessly, 💗",
  ],
  [
    "Just so you know,",
    "Every little heart floating around was drawn for you. They were practising on smaller hearts before they got to mine.",
    "forever, 🌸",
  ],
];

const HEARTS = ["♡", "♥", "❀", "✿", "🌸", "💗", "💖", "🩷", "✨"];
const SPARKLES = ["✨", "💖", "✿", "♡", "🌸"];
const HEART_COLORS = [
  "#ff7eaa",
  "#ffa3c2",
  "#ffc1d4",
  "#ff95b6",
  "#d8b9ec",
  "#f7a3c0",
];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const isCoarse = window.matchMedia("(pointer: coarse)").matches;
const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isNarrow = window.matchMedia("(max-width: 640px)").matches;

const HEART_COUNT = isReduced ? 0 : isNarrow ? 22 : 38;
const BURST_MIN = isCoarse ? 6000 : 4500;
const BURST_MAX = isCoarse ? 12000 : 9000;

function makeHeart() {
  const el = document.createElement("div");
  const size = rand(14, 32);
  const duration = rand(14, 26);
  const sway = rand(-26, 26);
  const opacity = rand(0.45, 0.85);

  el.className = "heart";
  el.textContent = pick(HEARTS);
  el.style.color = pick(HEART_COLORS);
  el.style.fontSize = `${size}px`;
  el.style.left = `${rand(0, 100)}%`;
  el.style.top = `${rand(0, 100)}%`;
  el.style.setProperty("--sway", `${sway}px`);
  el.style.setProperty("--target-opacity", String(opacity));
  el.style.animationDuration = `${duration}s`;
  el.style.animationDelay = `${rand(-duration, 0)}s`;
  return el;
}

function spawn(parent, className, css, lifetimeMs) {
  const el = document.createElement("div");
  el.className = className;
  el.style.cssText = css;
  parent.appendChild(el);
  setTimeout(() => el.remove(), lifetimeMs);
  return el;
}

function ambientBurst(sky) {
  const rect = sky.getBoundingClientRect();
  const x = rand(rect.left + 30, rect.right - 30);
  const y = rand(rect.top + 30, rect.bottom * 0.7);
  const count = isNarrow ? 4 : 6;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
    const dist = rand(30, 70);
    const el = spawn(
      document.body,
      "sparkle",
      `left:${x}px;top:${y}px;` +
        `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;`,
      1300,
    );
    el.textContent = pick(SPARKLES);
  }
}

function sparkleBurst(x, y) {
  const count = isNarrow ? 12 : 16;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
    const dist = rand(60, isNarrow ? 110 : 140);
    const el = spawn(
      document.body,
      "sparkle",
      `left:${x}px;top:${y}px;` +
        `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;`,
      1300,
    );
    el.textContent = pick(SPARKLES);
  }
}

const renderLetter = ([g, b, s]) =>
  `<p class="letter-greeting">${g}</p>` +
  `<p class="letter-body">${b}</p>` +
  `<p class="letter-sign">${s}</p>`;

function init() {
  const sky = document.getElementById("sky");
  const scene = document.querySelector(".envelope-scene");
  const envelope = document.getElementById("envelope");
  const letterEl = document.getElementById("letter");

  const frag = document.createDocumentFragment();
  for (let i = 0; i < HEART_COUNT; i++) frag.appendChild(makeHeart());
  sky.appendChild(frag);

  if (!isReduced) {
    const loopBurst = () => {
      ambientBurst(sky);
      setTimeout(loopBurst, rand(BURST_MIN, BURST_MAX));
    };
    setTimeout(loopBurst, 2000);
  }

  let current = -1;
  let open = false;

  envelope.addEventListener("click", () => {
    if (!open) {
      let next = current;
      while (next === current) next = Math.floor(Math.random() * letters.length);
      current = next;
      letterEl.innerHTML = renderLetter(letters[current]);

      const r = envelope.getBoundingClientRect();
      sparkleBurst(r.left + r.width / 2, r.top + r.height / 2);
    }
    open = !open;
    scene.classList.toggle("is-open", open);
    scene.classList.add("has-opened");
    envelope.setAttribute("aria-expanded", String(open));
    letterEl.setAttribute("aria-hidden", String(!open));
  });
}

window.addEventListener("DOMContentLoaded", init);
