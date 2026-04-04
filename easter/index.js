
const MAX = 10;
let taps = 0, done = false, cooldown = false;

const HINTS = [
    'Tap the egg! 🥚',
    "It's starting to crack…",
    'Keep going! 💪',
    'The egg is weakening!',
    'More cracks! 🔨',
    "You're halfway there!",
    "It's really breaking! 😮",
    'Almost done!',
    'Just one more tap!',
    '…',
];

/* Build progress dots */
const progressEl = document.getElementById('progress');
for (let i = 0; i < MAX; i++) {
    const d = document.createElement('div');
    d.className = 'pdot';
    d.id = 'pdot-' + i;
    progressEl.appendChild(d);
}

/* Egg element */
const egg = document.getElementById('egg');

/* Single pointer handler (works for mouse & touch) */
egg.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    handleTap();
});

function handleTap() {
    if (done || cooldown) return;
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 140);

    taps++;

    /* Light dot */
    document.getElementById('pdot-' + (taps - 1))?.classList.add('lit');

    /* Show crack */
    const crack = document.getElementById('c' + taps);
    if (crack) {
        crack.classList.remove('show');
        void crack.getBoundingClientRect();
        crack.classList.add('show');
    }

    /* Shake */
    egg.classList.remove('wiggling', 'shake');
    void egg.getBoundingClientRect();
    egg.classList.add('shake');

    /* Update hint */
    document.getElementById('hint').textContent = HINTS[taps - 1] ?? '';

    if (taps >= MAX) {
        done = true;
        setTimeout(breakEgg, 220);
    } else {
        setTimeout(() => {
            egg.classList.remove('shake');
            egg.classList.add('wiggling');
        }, 310);
    }
}

function breakEgg() {
    egg.classList.remove('wiggling', 'shake');
    egg.classList.add('broken');
    document.getElementById('hint').textContent = '🌸';

    setTimeout(() => {
        document.getElementById('result').classList.add('show');
        startConfetti();
    }, 950);
}

function reset() {
    taps = 0; done = false; cooldown = false;
    document.getElementById('result').classList.remove('show');
    stopConfetti();

    egg.classList.remove('broken', 'shake');

    for (let i = 1; i <= MAX; i++) {
        const c = document.getElementById('c' + i);
        if (c) { c.classList.remove('show'); }
    }
    for (let i = 0; i < MAX; i++) {
        document.getElementById('pdot-' + i)?.classList.remove('lit');
    }

    document.getElementById('hint').textContent = HINTS[0];
    void egg.getBoundingClientRect();
    egg.classList.add('wiggling');
}

/* ---- Floating background decorations ---- */
(function spawnFloaties() {
    const emojis = ['🌸', '🌷', '🌼', '🌺', '⭐', '🦋', '🌿'];
    const pastels = ['#f8bbd0', '#fff9c4', '#dcedc8', '#b3e5fc', '#e1bee7', '#ffe0b2'];
    const style = document.createElement('style');
    style.textContent = '@keyframes f-rise{0%{transform:translateY(0)rotate(0);opacity:.55}100%{transform:translateY(-108vh)rotate(380deg);opacity:0}}';
    document.head.appendChild(style);

    for (let i = 0; i < 20; i++) {
        const el = document.createElement('div');
        el.className = 'floatie';
        const size = 14 + Math.random() * 26;
        const left = Math.random() * 100;
        const del = Math.random() * 12;
        const dur = 7 + Math.random() * 9;

        if (Math.random() < 0.45) {
            el.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:${pastels[Math.floor(Math.random() * pastels.length)]};left:${left}vw;bottom:-40px;animation:f-rise ${dur}s ${del}s linear infinite;`;
        } else {
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.cssText = `font-size:${size}px;left:${left}vw;bottom:-54px;animation:f-rise ${dur}s ${del}s linear infinite;`;
        }
        document.body.appendChild(el);
    }
})();

/* ---- Confetti ---- */
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [], running = false, raf, spawnTick = 0;
const COLS = ['#f48fb1', '#fff176', '#a5d6a7', '#80deea', '#ce93d8', '#ffcc02', '#f06292', '#80cbc4', '#ff8a65', '#b3e5fc'];

function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);

function mkParticle() {
    return {
        x: Math.random() * canvas.width, y: -20,
        vx: (Math.random() - .5) * 6, vy: 2 + Math.random() * 4,
        va: (Math.random() - .5) * .18, a: Math.random() * Math.PI * 2,
        w: 8 + Math.random() * 14, h: 4 + Math.random() * 8,
        color: COLS[Math.floor(Math.random() * COLS.length)]
    };
}

function startConfetti() {
    running = true; spawnTick = 0; particles = [];
    for (let i = 0; i < 110; i++) particles.push(mkParticle());
    loop();
}

function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnTick++;
    if (spawnTick < 90) for (let i = 0; i < 3; i++) particles.push(mkParticle());
    particles = particles.filter(p => p.y < canvas.height + 50);
    for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.a += p.va; p.vy += 0.06;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    }
    raf = requestAnimationFrame(loop);
}

function stopConfetti() {
    running = false; cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
}