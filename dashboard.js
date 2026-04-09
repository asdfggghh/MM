// ============================================================
//  SANJEEVANI SMART-SHIELD — Dashboard Logic
//  Real-time Firestore-powered analytics
// ============================================================

let unsubDash = null;
let svgChartRendered = false;

function initDashboard() {
  svgChartRendered = false;
  showDashboardLoader(true);

  // Initialize IoT Engine Simulation
  if (typeof initIoTEngine === "function") initIoTEngine();

  unsubDash = subscribeToProfiles(
    profiles => {
      showDashboardLoader(false);
      renderDashboard(profiles);
    },
    err => {
      showDashboardLoader(false);
      showDashboardError(err);
    }
  );

  // Allow router to tear this down
  dashboardUnsub = unsubDash;
}

function showDashboardLoader(show) {
  const el = document.getElementById("dashboard-loader");
  if (el) el.classList.toggle("hidden", !show);
}

function showDashboardError(message) {
  const el = document.getElementById("dashboard-error");
  if (el) { el.textContent = "⚠ " + message; el.classList.remove("hidden"); }
}

// ---- Main render -------------------------------------------
function renderDashboard(profiles) {
  const stats = computeStats(profiles);

  // Metric cards
  animateDashMetric("dash-total",   stats.total,   "");
  animateDashMetric("dash-revenue", stats.revenue, "₹");
  animateDashMetric("dash-sku",     stats.bestSku, "", true);
  animateDashMetric("dash-today",   countToday(profiles), "");

  // SKU chart
  renderSKUChart(stats.skuCount);

  // Blood group chart
  renderBGChart(stats.bgCount);

  // Registration log
  renderLog(profiles.slice(0, 30));
}

function animateDashMetric(id, value, prefix = "", isText = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (isText) {
    el.textContent = prefix + value;
  } else {
    animateCounter(el, 0, Number(value), 900, prefix);
  }
}

function countToday(profiles) {
  const today = new Date().toISOString().slice(0, 10);
  return profiles.filter(p => (p.registered_at || "").startsWith(today)).length;
}

// ---- SVG Bar Chart: SKU Breakdown --------------------------
function renderSKUChart(skuCount) {
  const container = document.getElementById("sku-chart");
  if (!container) return;
  container.innerHTML = "";

  const keys = Object.keys(skuCount);
  if (!keys.length) {
    container.innerHTML = `<p class="chart-empty">No registrations yet.</p>`;
    return;
  }

  const max   = Math.max(...Object.values(skuCount));
  const W     = container.clientWidth || 400;
  const BAR_H = 36;
  const LABEL = 170;
  const GAP   = 12;
  const H     = keys.length * (BAR_H + GAP) + 20;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", "100%");
  svg.style.overflow = "visible";

  keys.forEach((key, i) => {
    const count  = skuCount[key];
    const y      = i * (BAR_H + GAP) + 4;
    const barW   = max > 0 ? ((count / max) * (W - LABEL - 50)) : 0;
    const pct    = max > 0 ? Math.round((count / Object.values(skuCount).reduce((a, b) => a + b, 0)) * 100) : 0;

    // Label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", 0);
    label.setAttribute("y", y + BAR_H / 2 + 5);
    label.setAttribute("fill", "#94a3b8");
    label.setAttribute("font-size", "12");
    label.setAttribute("font-family", "Inter, sans-serif");
    label.textContent = key;
    svg.appendChild(label);

    // Background track
    const track = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    track.setAttribute("x", LABEL);
    track.setAttribute("y", y);
    track.setAttribute("width",  W - LABEL - 10);
    track.setAttribute("height", BAR_H);
    track.setAttribute("rx", 6);
    track.setAttribute("fill", "rgba(255,255,255,0.04)");
    svg.appendChild(track);

    // Filled bar
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", LABEL);
    bar.setAttribute("y", y);
    bar.setAttribute("width", 0);       // start at 0 for animation
    bar.setAttribute("height", BAR_H);
    bar.setAttribute("rx", 6);
    bar.setAttribute("fill", i === 0 ? "#3b82f6" : i === 1 ? "#8b5cf6" : "#22c55e");
    svg.appendChild(bar);

    // Count label
    const countLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    countLabel.setAttribute("x", LABEL + barW + 6);
    countLabel.setAttribute("y", y + BAR_H / 2 + 5);
    countLabel.setAttribute("fill", "#f8fafc");
    countLabel.setAttribute("font-size", "12");
    countLabel.setAttribute("font-weight", "600");
    countLabel.setAttribute("font-family", "Inter, sans-serif");
    countLabel.textContent = `${count} (${pct}%)`;
    svg.appendChild(countLabel);

    // Animate bar width
    setTimeout(() => {
      bar.style.transition = `width 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${i * 100}ms`;
      bar.setAttribute("width", barW);
    }, 100);
  });

  container.appendChild(svg);
}

// ---- Blood Group Chart (mini circles) ----------------------
function renderBGChart(bgCount) {
  const container = document.getElementById("bg-chart");
  if (!container) return;
  container.innerHTML = "";

  const total = Object.values(bgCount).reduce((a, b) => a + b, 0);
  const BG_COLORS = {
    "A+": "#ef4444", "A-": "#f87171",
    "B+": "#3b82f6", "B-": "#60a5fa",
    "AB+":"#8b5cf6", "AB-":"#a78bfa",
    "O+": "#22c55e", "O-": "#4ade80",
  };

  if (!total) {
    container.innerHTML = `<p class="chart-empty">No registrations yet.</p>`;
    return;
  }

  Object.entries(bgCount).sort((a,b)=>b[1]-a[1]).forEach(([bg, count]) => {
    const pct  = total > 0 ? Math.round((count / total) * 100) : 0;
    const color = BG_COLORS[bg] || "#94a3b8";

    const item = document.createElement("div");
    item.className = "bg-stat-item";
    item.innerHTML = `
      <div class="bg-stat-dot" style="background:${color}"></div>
      <span class="bg-stat-label">${bg}</span>
      <div class="bg-stat-bar-track">
        <div class="bg-stat-bar" style="background:${color}; width:${pct}%"></div>
      </div>
      <span class="bg-stat-count">${count}</span>`;
    container.appendChild(item);
  });
}

// ---- Registration Log --------------------------------------
function renderLog(profiles) {
  const el = document.getElementById("reg-log");
  if (!el) return;

  if (!profiles.length) {
    el.innerHTML = `<div class="log-empty">No registrations yet — go onboard your first customer! 🛡</div>`;
    return;
  }

  el.innerHTML = profiles.map((p, i) => {
    const dt  = p.registered_at ? new Date(p.registered_at) : null;
    const time = dt ? dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";
    const date = dt ? dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

    return `
      <div class="log-row" style="animation-delay: ${i * 30}ms">
        <div class="log-bg">${p.blood_group || "?"}</div>
        <div class="log-info">
          <span class="log-name">${p.name}</span>
          <span class="log-pkg">${p.package_name || "—"}</span>
        </div>
        <div class="log-meta">
          <span class="log-price">₹${p.price || 0}</span>
          <span class="log-time">${date} · ${time}</span>
        </div>
        <div class="log-id">${p.shield_id}</div>
      </div>`;
  }).join("");
}
