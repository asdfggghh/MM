// ============================================================
//  SANJEEVANI SMART-SHIELD — App Controller (Enhanced)
//  SPA Router · Particles · Scroll Reveal · ECG Loop
// ============================================================

const VIEWS = ["home", "kiosk", "dashboard"];
let currentView    = null;
let dashboardUnsub = null;
let particleRAF    = null;

// ---- Router ------------------------------------------------
function navigate(viewName) {
  if (!VIEWS.includes(viewName)) viewName = "home";
  if (currentView === viewName) return;

  const prev = currentView ? document.getElementById(`view-${currentView}`) : null;
  const next  = document.getElementById(`view-${viewName}`);
  if (!next) return;

  if (prev) {
    prev.classList.remove("active");
    prev.classList.add("exit");
    setTimeout(() => { prev.classList.remove("exit"); prev.classList.add("hidden"); }, 320);
  }

  next.classList.remove("hidden", "exit");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => next.classList.add("active"));
  });

  document.querySelectorAll(".nav-link").forEach(el => {
    el.classList.toggle("active", el.dataset.view === viewName);
  });

  if (currentView === "dashboard" && dashboardUnsub) {
    dashboardUnsub();
    dashboardUnsub = null;
  }

  currentView = viewName;
  if (viewName === "kiosk")     initKiosk();
  if (viewName === "dashboard") initDashboard();
  if (viewName === "home")      initHomeView();

  history.pushState({ view: viewName }, "", `#${viewName}`);
  initScrollReveal();
}

// ---- Bootstrap ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize backend
    initSupabase();

    // Apply saved theme & language
    applyTheme(currentTheme);
    if (typeof applyTranslations === "function") applyTranslations();

    // Build language pickers
    if (typeof buildLanguagePicker === "function") buildLanguagePicker("lang-picker-nav");

    // Nav links
    document.querySelectorAll(".nav-link").forEach(el => {
      el.addEventListener("click", e => { e.preventDefault(); navigate(el.dataset.view); });
    });

    window.addEventListener("popstate", e => {
      navigate(e.state?.view || location.hash.replace("#", "") || "home");
    });

    // Scroll-based navbar style
    window.addEventListener("scroll", () => {
      document.querySelector(".navbar")?.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });

    // Initial navigation
    const initial = location.hash.replace("#", "") || "home";
    navigate(initial);
  } catch (err) {
    console.error("[Sanjeevani] Bootstrap error:", err);
    // Attempt fallback navigation if setup fails
    navigate("home");
  }
});

// ---- Home View Init ----------------------------------------
function initHomeView() {
  initParticles();
  startECGLoop();
  initScrollReveal();

  // Real-time stats from Firestore
  subscribeToProfiles(profiles => {
    const stats = computeStats(profiles);
    const totalEl   = document.getElementById("stat-lives");
    const revenueEl = document.getElementById("stat-revenue");
    if (totalEl)   animateCounter(totalEl, 0, stats.total, 1200);
    if (revenueEl) animateCounter(revenueEl, 0, stats.revenue, 1500, "₹");
  }, () => {});
}

// ---- Particle constellation --------------------------------
function initParticles() {
  if (particleRAF) { cancelAnimationFrame(particleRAF); particleRAF = null; }
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const isDark = () => currentTheme === "dark";
  const COUNT  = 55;

  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 1.8 + 0.4,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    op: Math.random() * 0.45 + 0.08,
  }));

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = isDark() ? "59,130,246" : "30,80,200";

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.op})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    // Connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color}, ${0.1 * (1 - d / 110)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    particleRAF = requestAnimationFrame(draw);
  };
  draw();
}

// ---- ECG Loop ----------------------------------------------
function startECGLoop() {
  const path = document.getElementById("ecg-path");
  if (!path) return;

  const len = path.getTotalLength();
  path.style.strokeDasharray  = len;
  path.style.strokeDashoffset = len;
  path.style.transition       = "none";

  const restart = () => {
    path.style.strokeDashoffset = len;
    requestAnimationFrame(() => {
      path.style.transition    = "stroke-dashoffset 2.8s ease-in-out";
      path.style.strokeDashoffset = "0";
    });
  };

  restart();
  path.addEventListener("transitionend", () => {
    setTimeout(restart, 800);
  });
}

// ---- Scroll Reveal -----------------------------------------
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

// ---- Utilities -------------------------------------------

function animateCounter(el, from, to, ms = 1000, prefix = "", suffix = "") {
  const start  = performance.now();
  const delta  = to - from;
  const update = (now) => {
    const progress = Math.min((now - start) / ms, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(from + delta * eased).toLocaleString("en-IN") + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function launchConfetti() {
  const colors = ["#ef4444","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#ec4899"];
  for (let i = 0; i < 90; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    const size = 5 + Math.random() * 7;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.6}s;
      animation-duration: ${1.2 + Math.random() * 1.5}s;
      width: ${size}px; height: ${size}px;
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

function showToast(message, type = "error") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 3500);
}
