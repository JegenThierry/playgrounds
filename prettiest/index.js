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
    "Every star in this little sky was drawn for you. The night kept the prettiest ones out late, hoping you would look up.",
    "forever, 🌙",
  ],
];

const SPARKLES = ["✨", "💖", "✦", "♡", "🌟"];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const isCoarse = window.matchMedia("(pointer: coarse)").matches;
const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isNarrow = window.matchMedia("(max-width: 640px)").matches;

const STAR_COUNT = isReduced ? 60 : isNarrow ? 90 : 160;
const SHOOT_MIN = isCoarse ? 7000 : 5000;
const SHOOT_MAX = isCoarse ? 14000 : 12000;

function makeStar() {
  const el = document.createElement("div");
  const size = rand(0.6, 2.6);
  el.className =
    "star" +
    (Math.random() < 0.06 ? " bright" : "") +
    (Math.random() < 0.12 ? " pink" : "");
  el.style.cssText = `
    width:${size}px;height:${size}px;
    left:${rand(0, 100)}%;top:${rand(0, 100)}%;
    opacity:${rand(0.3, 1)};
    animation-duration:${rand(2.5, 7.5)}s;
    animation-delay:${rand(0, 5)}s;
  `;
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

function shootingStar(sky) {
  spawn(sky, "shooting-star", `top:${rand(0, 40)}%;left:${rand(0, 30)}%;`, 2000);
}

function sparkleBurst(x, y) {
  const count = isNarrow ? 10 : 14;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
    const dist = rand(50, isNarrow ? 100 : 130);
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
  for (let i = 0; i < STAR_COUNT; i++) frag.appendChild(makeStar());
  sky.appendChild(frag);

  if (!isReduced) {
    const loopShoot = () => {
      shootingStar(sky);
      setTimeout(loopShoot, rand(SHOOT_MIN, SHOOT_MAX));
    };
    setTimeout(loopShoot, 1500);
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
