(function () {
    'use strict';

    const canvas    = document.getElementById('star-canvas');
    const ctx       = canvas.getContext('2d');
    const input     = document.getElementById('stress-input');
    const btn       = document.getElementById('let-go-btn');
    const container = document.getElementById('main-container');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let particles = [];

    function spawnStar(x, y) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 2.5;
        return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (0.4 + Math.random() * 1.2),
            size: 1.5 + Math.random() * 3,
            life: 1.0,
            decay: 0.006 + Math.random() * 0.012,
            hue: 90 + Math.random() * 80,
            brightness: 70 + Math.random() * 30,
        };
    }

    let animating = false;

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x    += p.vx;
            p.y    += p.vy;
            p.vy   -= 0.008;
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            const alpha = p.life;
            const glow  = p.size * (1 + (1 - p.life) * 1.5);

            ctx.save();
            ctx.globalAlpha = alpha * 0.35;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glow * 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 60%, ${p.brightness}%, 1)`;
            ctx.fill();

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glow * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 92%, 1)`;
            ctx.fill();
            ctx.restore();
        }

        if (particles.length > 0) {
            requestAnimationFrame(tick);
        } else {
            animating = false;
            fadeInInput();
        }
    }

    function shred() {
        const text = input.value.trim();
        if (!text) return;

        const rect = input.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;

        const count = Math.min(300, Math.max(60, text.length * 5));
        for (let i = 0; i < count; i++) {
            const ox = cx + (Math.random() - 0.5) * rect.width * 0.8;
            const oy = cy + (Math.random() - 0.5) * rect.height * 0.6;
            particles.push(spawnStar(ox, oy));
        }

        input.value = '';

        container.style.opacity = '0';

        if (!animating) {
            animating = true;
            requestAnimationFrame(tick);
        }
    }

    function fadeInInput() {
        setTimeout(() => {
            container.style.opacity = '1';
            input.focus();
        }, 400);
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            shred();
        }
    });

    btn.addEventListener('click', shred);

    function createAmbientDots() {
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            dot.className = 'ambient-dot';
            const size = 3 + Math.random() * 5;
            dot.style.width  = size + 'px';
            dot.style.height = size + 'px';
            dot.style.left   = Math.random() * 100 + 'vw';
            dot.style.bottom = '-10px';
            dot.style.animationDuration = (12 + Math.random() * 18) + 's';
            dot.style.animationDelay    = (Math.random() * 20) + 's';
            document.body.appendChild(dot);
        }
    }
    createAmbientDots();

})();
