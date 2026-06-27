async function init() {
  try {
    const config = await loadConfig();
    document.getElementById("nameTitle").textContent = config.NAME;
    document.getElementById("greeting").textContent = `My dearest ${config.NAME},`;
    document.querySelector(".name-placeholder").textContent = config.NAME;
    document.getElementById("signatureText").textContent = config.SIGNATURE;
  } catch (e) {
    console.error("Could not load .env file:", e);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

async function loadConfig() {
  const res = await fetch(".env");
  const text = await res.text();
  const config = {};
  for (const line of text.split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0) {
      config[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
  }
  return config;
}

init();
