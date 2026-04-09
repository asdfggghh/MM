// ============================================================
//  SANJEEVANI SMART-SHIELD — Kiosk (Enhanced)
//  Live Preview · Stopwatch · Confetti · WhatsApp Share
// ============================================================

let kioskStep    = 1;
const TOTAL_STEPS = 4;
let formData     = {};
let currentProfile = null;
let stopwatchInterval = null;
let stopwatchSeconds  = 0;

const PACKAGES = [
  { id: "tag",       name: "Sanjeevani Tag",  price: 49,  icon: "🏷️",  desc: "Waterproof UV-resistant QR sticker", badge: "" },
  { id: "keychain",  name: "Smart Keychain",  price: 99,  icon: "🔑",  desc: "Metal keychain + 1 year digital profile", badge: "Popular" },
  { id: "lifesaver", name: "Life-Saver Pack", price: 149, icon: "💊",  desc: "Keychain + 50ml Bio-Sanitizer + Priority support", badge: "Best Value" },
];

const ALLERGIES = ["Penicillin","NSAIDs (Ibuprofen)","Latex","Sulfa Drugs","Contrast Dye","Codeine","Peanuts","Shellfish","Eggs","None"];
const CONDITIONS = ["Type 1 Diabetic","Type 2 Diabetic","Asthmatic","Epileptic / Seizure","Cardiac Condition","Hypertension","Blood Disorder","Kidney Disease","None"];

// ---- Init --------------------------------------------------
function initKiosk() {
  kioskStep      = 1;
  formData       = {};
  currentProfile = null;
  stopwatchSeconds = 0;

  clearInterval(stopwatchInterval);
  stopwatchInterval = setInterval(tickStopwatch, 1000);

  document.getElementById("kiosk-result")?.classList.add("hidden");
  document.getElementById("kiosk-form-area")?.classList.remove("hidden");

  // Load URL Config
  const savedUrl = localStorage.getItem("SANJEEVANI_BASE_URL");
  const urlInput = document.getElementById("config-base-url");
  if (urlInput && savedUrl) {
    urlInput.value = savedUrl;
    updateUrlStatus(savedUrl);
  }

  // Bind settings button
  const settingsBtn = document.getElementById("btn-toggle-config");
  if (settingsBtn) settingsBtn.onclick = toggleUrlConfig;

  renderStep(1);
  updateStepIndicator(1);
  updateLivePreview();
}

// ---- URL Config Helpers ------------------------------------
function toggleUrlConfig() {
  const panel = document.getElementById("url-config-panel");
  panel?.classList.toggle("hidden");
}

function saveUrlConfig(val) {
  const cleanUrl = val.trim().replace(/\/$/, "");
  if (cleanUrl) {
    localStorage.setItem("SANJEEVANI_BASE_URL", cleanUrl);
    updateUrlStatus(cleanUrl);
  } else {
    localStorage.removeItem("SANJEEVANI_BASE_URL");
    updateUrlStatus(null);
  }
}

function updateUrlStatus(url) {
  const status = document.getElementById("url-config-status");
  if (!status) return;
  if (url) {
    status.innerHTML = `✅ Active: <span style="color:var(--accent-green)">${url}</span>`;
  } else {
    status.innerHTML = `⚠️ Using local file path (unscannable)`;
  }
}

// ---- Stopwatch --------------------------------------------
function tickStopwatch() {
  stopwatchSeconds++;
  const m = String(Math.floor(stopwatchSeconds / 60)).padStart(2, "0");
  const s = String(stopwatchSeconds % 60).padStart(2, "0");
  const el = document.getElementById("kiosk-stopwatch");
  if (el) el.textContent = `⏱ ${m}:${s}`;
}

// ---- Step Navigation --------------------------------------
function goToStep(step) {
  if (step < 1 || step > TOTAL_STEPS) return;
  if (!validateStep(kioskStep)) return;
  collectStep(kioskStep);
  animateStepTransition(kioskStep, step);
  kioskStep = step;
  updateStepIndicator(step);
  updateLivePreview();
}

function nextStep() { goToStep(kioskStep + 1); }
function prevStep() {
  collectStep(kioskStep);
  animateStepTransition(kioskStep, kioskStep - 1);
  kioskStep--;
  updateStepIndicator(kioskStep);
  updateLivePreview();
}

function animateStepTransition(from, to) {
  const container = document.getElementById("step-content");
  if (!container) return renderStep(to === undefined ? from : to > from ? kioskStep + 1 : kioskStep - 1);

  const dir = to > from ? 1 : -1;
  container.style.transform = `translateX(${-dir * 30}px)`;
  container.style.opacity   = "0";

  setTimeout(() => {
    renderStep(to > from ? kioskStep + 1 : kioskStep - 1);
    container.style.transition = "none";
    container.style.transform  = `translateX(${dir * 30}px)`;
    container.style.opacity    = "0";
    requestAnimationFrame(() => {
      container.style.transition = "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease";
      container.style.transform  = "translateX(0)";
      container.style.opacity    = "1";
    });
  }, 200);
}

function updateStepIndicator(step) {
  document.querySelectorAll(".step-dot").forEach((d, i) => {
    d.classList.toggle("active", i + 1 === step);
    d.classList.toggle("completed", i + 1 < step);
  });
  const labels = ["Personal Info", "Medical Conditions", "Emergency Contacts", "Choose Package"];
  const el = document.getElementById("step-label");
  if (el) el.textContent = `Step ${step} of ${TOTAL_STEPS}: ${labels[step - 1]}`;
}

// ---- Live Preview ------------------------------------------
function updateLivePreview() {
  const container = document.getElementById("live-preview-card");
  if (!container) return;

  const name   = formData.name       || "Patient Name";
  const bg     = formData.blood_group || "?";
  const age    = formData.age        || "";
  const gender = formData.gender     || "";

  const alertBadges = [
    ...(formData.allergies  || []),
    ...(formData.conditions || [])
  ].filter(x => x && x !== "None").slice(0, 5)
   .map(x => `<span class="preview-badge">${x}</span>`).join("");

  const ice = formData.ice_contacts?.[0];

  container.innerHTML = `
    <div class="preview-emergency-label">🚨 EMERGENCY MEDICAL ID</div>
    <div class="preview-blood ${bg !== "?" ? "has-data" : ""}">${bg}</div>
    <div class="preview-name">${name}${age ? ` · ${age}yrs` : ""}${gender ? ` · ${gender}` : ""}</div>
    ${alertBadges ? `<div class="preview-alerts">${alertBadges}</div>` : ""}
    ${ice?.phone ? `<div class="preview-ice">📞 ${ice.name} · ${ice.phone}</div>` : `<div class="preview-ice placeholder">Emergency contacts will appear here</div>`}
    <div class="preview-shield-tag">${formData.name ? "Will generate Shield ID after registration" : "Live preview of your Emergency Card"}</div>`;
}

// Live input binding — update preview on every keystroke
function bindLivePreview() {
  document.querySelectorAll("#step-content input, #step-content select").forEach(el => {
    el.addEventListener("input", () => { collectStep(kioskStep); updateLivePreview(); });
  });
}

// ---- Render Steps ------------------------------------------
function renderStep(step) {
  const container = document.getElementById("step-content");
  if (!container) return;

  const renders = [renderStep1, renderStep2, renderStep3, renderStep4];
  renders[(step || kioskStep) - 1](container);
  bindLivePreview();
}

function renderStep1(c) {
  c.innerHTML = `
    <div class="form-grid-2">
      <div class="form-group">
        <label>Full Name *</label>
        <input type="text" id="f-name" placeholder="e.g. Rahul Kumar" value="${formData.name || ""}">
      </div>
      <div class="form-group">
        <label>Age *</label>
        <input type="number" id="f-age" placeholder="24" min="1" max="120" value="${formData.age || ""}">
      </div>
    </div>
    <div class="form-group">
      <label>Gender</label>
      <div class="chip-group">
        ${["Male","Female","Other","Prefer not to say"].map(g =>
          `<button type="button" class="chip ${formData.gender === g ? "selected" : ""}"
            onclick="selectSingle(this, 'gender', '${g}')">${g}</button>`
        ).join("")}
      </div>
    </div>
    <div class="form-group">
      <label>Blood Group *</label>
      <div class="blood-group-grid">
        ${["A+","A−","B+","B−","AB+","AB−","O+","O−"].map(bg =>
          `<button type="button" class="bg-btn ${formData.blood_group === bg.replace("−","-") ? "selected" : ""}"
            onclick="selectBloodGroup(this, '${bg}')">${bg}</button>`
        ).join("")}
      </div>
    </div>
    <div class="form-group">
      <label class="toggle-label">
        <span>Registered Organ Donor 💚</span>
        <label class="toggle-switch">
          <input type="checkbox" id="f-organ" ${formData.organ_donor ? "checked" : ""} onchange="formData.organ_donor = this.checked; updateLivePreview()">
          <span class="toggle-track"></span>
        </label>
      </label>
    </div>
    <div class="step-actions">
      <span></span>
      <button class="btn-primary" onclick="nextStep()">Medical Info →</button>
    </div>`;
  bindLivePreview();
}

function renderStep2(c) {
  c.innerHTML = `
    <div class="form-group">
      <label>Known Allergies <span class="label-hint">(select all that apply)</span></label>
      <div class="chip-group">
        ${ALLERGIES.map(a =>
          `<button type="button" class="chip ${(formData.allergies||[]).includes(a)?"selected":""}"
            onclick="toggleChip(this); collectStep(${kioskStep}); updateLivePreview()">${a}</button>`
        ).join("")}
      </div>
    </div>
    <div class="form-group" style="margin-top:8px">
      <label>Chronic Conditions <span class="label-hint">(select all that apply)</span></label>
      <div class="chip-group">
        ${CONDITIONS.map(cd =>
          `<button type="button" class="chip ${(formData.conditions||[]).includes(cd)?"selected":""}"
            onclick="toggleChip(this); collectStep(${kioskStep}); updateLivePreview()">${cd}</button>`
        ).join("")}
      </div>
    </div>
    <div class="step-actions">
      <button class="btn-ghost" onclick="prevStep()">← Back</button>
      <button class="btn-primary" onclick="nextStep()">Emergency Contacts →</button>
    </div>`;
}

function renderStep3(c) {
  const contacts = formData.ice_contacts || [{}, {}];
  c.innerHTML = `
    <p class="section-hint">These contacts are called by the system and shown to first responders when the QR is scanned.</p>
    <div class="ice-contact-card">
      <div class="ice-badge primary">🔴 Primary ICE Contact</div>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" id="ice1-name" placeholder="e.g. Priya Kumar" value="${contacts[0]?.name||""}">
        </div>
        <div class="form-group">
          <label>Phone Number *</label>
          <input type="tel" id="ice1-phone" placeholder="+91 98765 43210" value="${contacts[0]?.phone||""}">
        </div>
      </div>
      <div class="form-group">
        <label>Relation</label>
        <input type="text" id="ice1-rel" placeholder="Mother, Wife, Friend" value="${contacts[0]?.relation||""}">
      </div>
    </div>
    <div class="ice-contact-card secondary">
      <div class="ice-badge">🟡 Backup ICE Contact <span class="label-hint">(optional)</span></div>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="ice2-name" placeholder="e.g. Aryan Kumar" value="${contacts[1]?.name||""}">
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" id="ice2-phone" placeholder="+91 91234 56789" value="${contacts[1]?.phone||""}">
        </div>
      </div>
      <div class="form-group">
        <label>Relation</label>
        <input type="text" id="ice2-rel" placeholder="Father, Brother" value="${contacts[1]?.relation||""}">
      </div>
    </div>
    <div class="step-actions">
      <button class="btn-ghost" onclick="prevStep()">← Back</button>
      <button class="btn-primary" onclick="nextStep()">Choose Package →</button>
    </div>`;
  bindLivePreview();
}

function renderStep4(c) {
  c.innerHTML = `
    <p class="section-hint">Each package includes a permanent digital profile hosted in the Sanjeevani database.</p>
    <div class="package-grid">
      ${PACKAGES.map(pkg => `
        <div class="package-card ${formData.package_id === pkg.id ? "selected" : ""}"
          id="pkg-${pkg.id}" onclick="selectPackage('${pkg.id}')">
          ${pkg.badge ? `<div class="pkg-badge">${pkg.badge}</div>` : ""}
          <div class="pkg-icon">${pkg.icon}</div>
          <div class="pkg-name">${pkg.name}</div>
          <div class="pkg-price">₹${pkg.price}</div>
          <div class="pkg-desc">${pkg.desc}</div>
          <div class="pkg-select-indicator">✓</div>
        </div>`).join("")}
    </div>
    <div class="step-actions">
      <button class="btn-ghost" onclick="prevStep()">← Back</button>
      <button class="btn-primary btn-register" id="register-btn" onclick="submitRegistration()">
        🛡 Generate Shield ID
      </button>
    </div>`;
}

// ---- Selection Helpers ------------------------------------
function selectSingle(el, field, value) {
  el.closest(".chip-group").querySelectorAll(".chip").forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  formData[field] = value;
  updateLivePreview();
}

function selectBloodGroup(el, bg) {
  document.querySelectorAll(".bg-btn").forEach(b => b.classList.remove("selected"));
  el.classList.add("selected");
  formData.blood_group = bg.replace("−", "-");
  updateLivePreview();

  // Ripple effect
  const ripple = document.createElement("span");
  ripple.className = "bg-ripple";
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function selectPackage(id) {
  formData.package_id = id;
  document.querySelectorAll(".package-card").forEach(c => c.classList.remove("selected"));
  document.getElementById(`pkg-${id}`)?.classList.add("selected");
}

function toggleChip(el) { el.classList.toggle("selected"); }

// ---- Validation -------------------------------------------
function validateStep(step) {
  collectStep(step);
  if (step === 1) {
    if (!formData.name?.trim() || formData.name.trim().length < 2) { showToast("Please enter a full name."); return false; }
    if (!formData.age || formData.age < 1)  { showToast("Please enter a valid age."); return false; }
    if (!formData.blood_group) { showToast("Please select blood group."); return false; }
  }
  if (step === 3) {
    if (!formData.ice_contacts?.[0]?.name || !formData.ice_contacts?.[0]?.phone) {
      showToast("Please fill the primary emergency contact."); return false;
    }
  }
  if (step === 4 && !formData.package_id) { showToast("Please select a package."); return false; }
  return true;
}

// ---- Collect Step Data ------------------------------------
function collectStep(step) {
  if (step === 1) {
    formData.name        = document.getElementById("f-name")?.value?.trim() || formData.name;
    formData.age         = parseInt(document.getElementById("f-age")?.value) || formData.age;
    formData.organ_donor = document.getElementById("f-organ")?.checked ?? formData.organ_donor;
    // blood_group & gender handled inline
  }
  if (step === 2) {
    formData.allergies  = [...document.querySelectorAll(".chip-group:nth-of-type(1) .chip.selected")].map(c => c.textContent.trim());
    formData.conditions = [...document.querySelectorAll(".chip-group:nth-of-type(2) .chip.selected")].map(c => c.textContent.trim());
    // Fallback: collect all selected chips
    if (!formData.allergies.length && !formData.conditions.length) {
      const chips = [...document.querySelectorAll(".chip.selected")].map(c => c.textContent.trim());
      formData.allergies  = chips.filter(c => ALLERGIES.includes(c));
      formData.conditions = chips.filter(c => CONDITIONS.includes(c));
    }
  }
  if (step === 3) {
    formData.ice_contacts = [
      { name: document.getElementById("ice1-name")?.value?.trim() || "", phone: document.getElementById("ice1-phone")?.value?.trim() || "", relation: document.getElementById("ice1-rel")?.value?.trim() || "" },
      { name: document.getElementById("ice2-name")?.value?.trim() || "", phone: document.getElementById("ice2-phone")?.value?.trim() || "", relation: document.getElementById("ice2-rel")?.value?.trim() || "" },
    ].filter(c => c.name || c.phone);
  }
  if (step === 4) {
    const pkg = PACKAGES.find(p => p.id === formData.package_id);
    if (pkg) { formData.package_name = pkg.name; formData.price = pkg.price; }
  }
}

// ---- Submit -----------------------------------------------
async function submitRegistration() {
  if (!validateStep(4)) return;
  const btn = document.getElementById("register-btn");
  btn.disabled    = true;
  btn.innerHTML   = `<span class="spinner"></span> Generating Shield...`;

  try {
    const profile  = await saveProfile(formData);
    currentProfile = profile;
    clearInterval(stopwatchInterval);
    launchConfetti();
    showResult(profile);
    // Refresh dashboard data after new registration
    if (typeof refreshDashboard === "function") refreshDashboard();
  } catch (err) {
    console.error(err);
    showToast("Error generating Shield ID. Please try again.");
    btn.disabled  = false;
    btn.innerHTML = "🛡 Generate Shield ID";
  }
}

// ---- Result -----------------------------------------------
function showResult(profile) {
  document.getElementById("kiosk-form-area")?.classList.add("hidden");
  const resultArea = document.getElementById("kiosk-result");
  if (!resultArea) return;
  resultArea.classList.remove("hidden");

  document.getElementById("result-shield-id").textContent = profile.shield_id;
  document.getElementById("result-name").textContent       = profile.name;
  document.getElementById("result-blood").textContent      = profile.blood_group;
  document.getElementById("result-package").textContent    = `${profile.package_name} — ₹${profile.price}`;

  const elapsed = stopwatchSeconds;
  const timeEl  = document.getElementById("result-time");
  if (timeEl) timeEl.textContent = `⚡ Onboarded in ${elapsed}s`;

  // Pass full profile so the QR URL contains the encoded patient data
  renderQRCode(profile, document.getElementById("result-qr"));
  renderMiniPreview(profile);

  document.getElementById("btn-print-tag").onclick      = () => printQRTag(profile, profile.name, profile.blood_group);
  document.getElementById("btn-new-reg").onclick         = initKiosk;
  document.getElementById("btn-whatsapp-share").onclick  = () => shareViaWhatsApp(profile);

  updateSalesCounter();
}

function renderMiniPreview(profile) {
  const preview = document.getElementById("result-preview");
  if (!preview) return;
  const alerts = [...(profile.allergies||[]), ...(profile.conditions||[])]
    .filter(x => x && x !== "None").slice(0, 4)
    .map(x => `<span class="mini-alert">${x}</span>`).join("");
  const ice = profile.ice_contacts?.[0];
  preview.innerHTML = `
    <div class="mini-emergency-card">
      <div class="mini-header">🚨 EMERGENCY MEDICAL ID</div>
      <div class="mini-blood">${profile.blood_group}</div>
      <div class="mini-name">${profile.name}, ${profile.age || ""}${profile.gender ? " · " + profile.gender : ""}</div>
      ${alerts ? `<div class="mini-alerts">${alerts}</div>` : ""}
      ${ice ? `<div class="mini-ice">📞 ${ice.name} · ${ice.phone}</div>` : ""}
      <div class="mini-shield-id">${profile.shield_id}</div>
    </div>`;
}

function shareViaWhatsApp(profile) {
  const msg = encodeURIComponent(
    `🛡 *My Sanjeevani Smart-Shield is ready!*\n\n` +
    `Name: ${profile.name}\nBlood Group: ${profile.blood_group}\n` +
    `Shield ID: ${profile.shield_id}\n\n` +
    `In an emergency, scan this QR or open this link:\n${buildMedicalIdUrl(profile)}`
  );
  window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
}

function updateSalesCounter() {
  const el = document.getElementById("live-sales-count");
  if (!el) return;
  const current = parseInt(el.getAttribute("data-count") || "0");
  el.setAttribute("data-count", current + 1);
  animateCounter(el, current, current + 1, 500);
}
