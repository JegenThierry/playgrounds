(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  // ── Floating hearts in the background ─────────────────
  const sky = $("sky");
  const HEARTS = ["♥", "♡", "✿", "❀"];
  const HEART_COUNT = 14;

  if (sky && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let i = 0; i < HEART_COUNT; i++) {
      const h = document.createElement("span");
      h.className = "heart";
      h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      const size = 14 + Math.random() * 22;
      h.style.fontSize = size + "px";
      h.style.left = Math.random() * 100 + "vw";
      h.style.bottom = "-40px";
      h.style.color = `hsl(${330 + Math.random() * 30}, 80%, ${65 + Math.random() * 10}%)`;
      h.style.setProperty("--sway", (Math.random() * 40 - 20) + "px");
      h.style.setProperty("--target-opacity", (0.45 + Math.random() * 0.4).toFixed(2));
      h.style.animationDuration = (10 + Math.random() * 10) + "s";
      h.style.animationDelay = (-Math.random() * 12) + "s";
      sky.appendChild(h);
    }
  }

  // ── Phone-number validation ────────────────────────────
  // We accept anything that contains at least 7 digits — generous
  // enough to handle international formats, spaces, dashes, parens.
  const isPlausiblePhone = (raw) => {
    const digits = raw.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  // Pretty-print: keep whatever they typed but trim, fall back to
  // a grouped version if it looks like a clean number.
  const formatForReveal = (raw) => {
    const trimmed = raw.trim();
    const digits = trimmed.replace(/\D/g, "");
    // If they already formatted it themselves, respect that.
    if (/[\s\-().]/.test(trimmed)) return trimmed;
    // Otherwise group: last 4, middle 3 or 4, then prefix.
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11) {
      return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    // Generic spacing: groups of 3 from the right.
    return digits.replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
  };

  // ── Screen transitions ────────────────────────────────
  const testScreen = $("test");
  const revealScreen = $("reveal");

  const showReveal = (numberText) => {
    $("reveal-number").textContent = numberText;

    testScreen.classList.remove("is-active");
    testScreen.setAttribute("aria-hidden", "true");
    revealScreen.classList.add("is-active");
    revealScreen.setAttribute("aria-hidden", "false");

    revealScreen.scrollIntoView({ behavior: "smooth", block: "start" });
    launchConfetti();
  };

  const showTest = () => {
    revealScreen.classList.remove("is-active");
    revealScreen.setAttribute("aria-hidden", "true");
    testScreen.classList.add("is-active");
    testScreen.setAttribute("aria-hidden", "false");

    const phone = $("phone");
    phone.value = "";
    phone.classList.remove("is-error");
    $("phone-error").hidden = true;
    $("submit-btn").classList.remove("is-loading");
    setTimeout(() => phone.focus({ preventScroll: true }), 250);
  };

  // ── Form handling ─────────────────────────────────────
  const form = $("test-form");
  const phoneInput = $("phone");
  const phoneError = $("phone-error");
  const submitBtn = $("submit-btn");

  phoneInput.addEventListener("input", () => {
    if (phoneInput.classList.contains("is-error")) {
      phoneInput.classList.remove("is-error");
      phoneError.hidden = true;
    }
  });

  const API_URL = "/api/send-phone";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = phoneInput.value;

    if (!isPlausiblePhone(value)) {
      phoneInput.classList.remove("is-error");
      // restart the shake animation
      void phoneInput.offsetWidth;
      phoneInput.classList.add("is-error");
      phoneError.hidden = false;
      phoneInput.focus({ preventScroll: true });
      return;
    }

    submitBtn.classList.add("is-loading");

    const formatted = formatForReveal(value);

    // Fire-and-forget email — keep the joke working even if it fails.
    const minDelay = new Promise((r) => setTimeout(r, 1100));
    const url = `${API_URL}?phone=${encodeURIComponent(value)}`;
    const send = fetch(url, { method: "POST" }).catch((err) => {
      console.error("Failed to send email:", err);
    });

    await Promise.all([minDelay, send]);
    showReveal(formatted);
  });

  $("retry-btn").addEventListener("click", showTest);

  // ── Confetti on reveal ────────────────────────────────
  function launchConfetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const colors = ["#ff7eaa", "#d94d7e", "#ffc1d4", "#d8b9ec", "#ffd9e9", "#fff5fa"];
    const count = 60;

    for (let i = 0; i < count; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.width = (6 + Math.random() * 8) + "px";
      c.style.height = (10 + Math.random() * 8) + "px";
      c.style.animationDuration = (2.2 + Math.random() * 1.8) + "s";
      c.style.animationDelay = (Math.random() * 0.3) + "s";
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
  }
})();
