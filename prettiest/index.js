const letters = [
  ["Dearest you,", "You are the prettiest girl in the world. Not just today, every day. Wherever stars shine, they shine a little brighter because of you.", "always, 💌"],
  ["To the loveliest,", "Somewhere out there, the moon is a little jealous. The sun is a little jealous. The stars are a little jealous. They've all seen you, and now they know.", "yours, ✨"],
  ["A small confession,", "I wished on a star tonight. The star said it was already taken apparently it had been wishing on you the whole time.", "with love, 🌟"],
  ["Hello pretty,", "If the world were a gallery, you'd be the painting everyone stops in front of. Twice. And then once more on the way out.", "endlessly, 💗"],
  ["Just so you know,", "Every constellation in this little sky was drawn for you. The night kept the prettiest stars out late, hoping you'd look up.", "forever, 🌙"],
];

const STAR_COUNT = 160;
const SPARKLES = ["✨", "💖", "✦", "♡", "🌟"];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function makeStar() {
  const el = document.createElement("div");
  const size = rand(0.6, 2.8);
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

function spawn(sky, className, css, lifetimeMs) {
  const el = document.createElement("div");
  el.className = className;
  el.style.cssText = css;
  sky.appendChild(el);
  setTimeout(() => el.remove(), lifetimeMs);
  return el;
}

function shootingStar(sky) {
  spawn(sky, "shooting-star", `top:${rand(0, 40)}%;left:${rand(0, 30)}%;`, 2000);
}

function sparkleBurst(sky, x, y) {
  for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2 + rand(-0.3, 0.3);
    const dist = rand(60, 130);
    const el = spawn(sky, "sparkle",
      `left:${x}px;top:${y}px;` +
      `--dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;`,
      1300);
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

  const loopShoot = () => {
    shootingStar(sky);
    setTimeout(loopShoot, rand(5000, 12000));
  };
  setTimeout(loopShoot, 1500);

  let current = -1;
  let open = false;

  envelope.addEventListener("click", () => {
    if (!open) {
      let next = current;
      while (next === current) next = Math.floor(Math.random() * letters.length);
      current = next;
      letterEl.innerHTML = renderLetter(letters[current]);

      const r = envelope.getBoundingClientRect();
      sparkleBurst(sky, r.left + r.width / 2, r.top + r.height / 2);
    }
    open = !open;
    scene.classList.toggle("is-open", open);
    scene.classList.add("has-opened");
    envelope.setAttribute("aria-expanded", String(open));
    letterEl.setAttribute("aria-hidden", String(!open));
  });
}

window.addEventListener("DOMContentLoaded", init);
