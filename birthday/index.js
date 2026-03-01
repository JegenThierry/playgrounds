const CONFETTI_COUNT = 164;
const COLORS = ["#f2abe7", "#9fa3ec", "#86d2e1", "#fec31e"];

function createConfettiPiece() {
    const piece = document.createElement('div');
    const size = Math.floor(Math.random() * 10 + 5);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const horizontalPosition = Math.random() * 100;

    Object.assign(piece.style, {
        position: 'fixed',
        top: '-1rem',
        left: `${horizontalPosition}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '2px',
        zIndex: '9999',
        pointerEvents: 'none'
    });

    return piece;
}

function animatePiece(piece) {
    const duration = Math.random() * 3000 + 3000;
    const drift = Math.random() * 200 - 100;
    const rotation = Math.random() * 720;

    piece.animate([
        {transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1},
        {transform: `translate3d(${drift}px, 105vh, 0) rotate(${rotation}deg)`, opacity: 0}
    ], {
        duration: duration,
        iterations: Infinity,
        delay: Math.random() * 5000
    });
}

function launchConfetti() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < CONFETTI_COUNT; i++) {
        const piece = createConfettiPiece();
        fragment.appendChild(piece);
        animatePiece(piece);
    }

    document.body.appendChild(fragment);
}

launchConfetti();