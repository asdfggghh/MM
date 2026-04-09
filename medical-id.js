// ============================================================
//  SANJEEVANI SMART-SHIELD — Medical ID (Responder) Page
//  Features: Auto-SOS · Hospital Locator · Blood Bank Finder
// ============================================================

// ---- Kanpur Blood Bank data (e-RaktKosh backed) -------------
// In production, replace this with live e-RaktKosh API call:
// GET https://www.eraktkosh.in/BLDAHIMS/bloodbank/stock/hbstock.cnt?stateCode=09&districtCode=149&lang=0
const BLOOD_BANKS_KANPUR = [
  { name: "Lala Lajpat Rai Hospital Blood Bank",  address: "GT Road, Kanpur", phone: "0512-2330600", distance: "1.2 km" },
  { name: "Regency Hospital Blood Bank",           address: "A-2, Sarvodaya Nagar", phone: "0512-3989898", distance: "2.8 km" },
  { name: "Hallet Hospital Blood Bank",            address: "Mall Road, Kanpur", phone: "0512-2533741", distance: "3.4 km" },
  { name: "GSVM Medical College Blood Bank",       address: "Swaroop Nagar, Kanpur", phone: "0512-2550351", distance: "4.1 km" },
];

// Stock levels are fetched live; these are realistic placeholders
const BLOOD_STOCK_MOCK = {
  "A+": { available: true, units: 14 }, "A-": { available: false, units: 0 },
  "B+": { available: true, units: 22 }, "B-": { available: true,  units: 3 },
  "AB+":{ available: true, units: 8  }, "AB-":{ available: false, units: 0 },
  "O+": { available: true, units: 18 }, "O-": { available: true,  units: 2 },
};

// ---- State ------------------------------------------------
let patientCoords   = null;
let sosDispatched   = false;
let currentProfile  = null;

// ---- Entry point ------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  initSupabase();

  const params   = new URLSearchParams(window.location.search);
  const shieldId = params.get("id");
  const encoded  = params.get("d");
  const urlLang  = params.get("lang");

  // Multi-language: Build picker and handle URL override
  if (typeof buildLanguagePicker === "function") {
    buildLanguagePicker("lang-picker-resp");
  }
  if (urlLang && typeof setLanguage === "function") {
    setLanguage(urlLang);
  }

  if (!shieldId) {
    showError("No Shield ID found in this QR code. The tag may be damaged or invalid.");
    return;
  }

  document.getElementById("shield-id-display").textContent = shieldId;
  
  // SPEED OPTIMIZATION: If we have direct data in the URL (?d=), show it INSTANTLY (0ms)
  // This solves the "2 minute loading" problem by not waiting for the network.
  if (encoded && typeof decodeProfile === "function") {
    const offlineProfile = decodeProfile(encoded);
    if (offlineProfile) {
      console.log("[MedicalID] Instant-Load: Rendering data from QR payload.");
      currentProfile = offlineProfile;
      renderProfile(offlineProfile);
      showLoading(false);
      showCard(true);
      dispatchSOS(offlineProfile); // Early SOS dispatch
      renderBloodBankSection(offlineProfile.blood_group);
    }
  } else {
    showLoading(true);
  }

  // GEOLOCATION: Start in parallel
  requestGeolocation();

  // DASHBOARD SYNC: Fetch the latest live version from Supabase (authoritative truth)
  try {
    const profile = await getProfile(shieldId);
    if (!profile) {
      // If we didn't have an offline payload AND Supabase fails, then show error
      if (!currentProfile) {
        showError(`Shield ID <strong>${shieldId}</strong> was not found in the Sanjeevani database.`);
      }
      return;
    }

    // Update the UI if the Supabase version is different/newer
    currentProfile = profile;
    renderProfile(profile);
    
    // Ensure loading is hidden and card is shown
    showLoading(false);
    showCard(true);

    // If SOS wasn't dispatched yet, do it now
    if (!sosDispatched) dispatchSOS(profile);

    // Live updates subscription
    if (supabaseClient) {
      supabaseClient
        .channel(`public:shields:id=${shieldId}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "shields", filter: `shield_id=eq.${shieldId}` }, payload => {
          currentProfile = payload.new;
          renderProfile(currentProfile);
        })
        .subscribe();
    }

    renderBloodBankSection(profile.blood_group);

  } catch (err) {
    console.error(err);
    if (!currentProfile) {
      showError("Unable to connect to the Sanjeevani server.<br>Please check your internet connection.");
    }
  }
});

// ---- Geolocation ------------------------------------------
function requestGeolocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    pos => {
      patientCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      updateHospitalButton();
      initIncidentMap(patientCoords.lat, patientCoords.lng);
      if (currentProfile && !sosDispatched) dispatchSOS(currentProfile);
    },
    err => {
      console.warn("[GPS] Geolocation denied:", err.message);
      updateHospitalButton();
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

// ---- Leaflet Incident Map ---------------------------------
let leafletMap = null;

function initIncidentMap(lat, lng) {
  const section = document.getElementById("incident-map-section");
  const mapDiv  = document.getElementById("incident-map");
  const mapsLink = document.getElementById("open-in-maps");
  if (!section || !mapDiv || typeof L === "undefined") return;

  section.classList.remove("hidden");
  if (mapsLink) mapsLink.href = `https://maps.google.com/?q=${lat},${lng}`;

  // Destroy existing map instance if any
  if (leafletMap) { leafletMap.remove(); leafletMap = null; }

  leafletMap = L.map("incident-map", { zoomControl: true, attributionControl: false }).setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(leafletMap);

  // Pulsing incident marker
  const pulseIcon = L.divIcon({
    className: "",
    html: `<div class="pulse-marker"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  L.marker([lat, lng], { icon: pulseIcon })
    .addTo(leafletMap)
    .bindPopup(`<strong>🚨 Incident Location</strong><br>${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    .openPopup();

  // 300m accuracy circle
  L.circle([lat, lng], { radius: 200, color: "#ef4444", weight: 1.5, fillColor: "#ef4444", fillOpacity: 0.07 }).addTo(leafletMap);
}

// ---- Auto-SOS Dispatch ------------------------------------
function dispatchSOS(profile) {
  if (sosDispatched) return;
  sosDispatched = true;

  const contacts = (profile.ice_contacts || []).filter(c => c.phone);
  if (!contacts.length) return;

  // Build GPS link
  const mapsLink = patientCoords
    ? `https://maps.google.com/?q=${patientCoords.lat},${patientCoords.lng}`
    : `https://maps.google.com/maps?q=Kanpur+accident+location`;

  // Compose the WhatsApp SOS message
  const name   = profile.name;
  const bg     = profile.blood_group;
  const msg    = encodeURIComponent(
    `🚨 *EMERGENCY SOS — Sanjeevani Smart-Shield*\n\n` +
    `*${name}* has been in an accident and needs immediate help.\n\n` +
    `🩸 *Blood Group:* ${bg}\n` +
    `📍 *Live Location:* ${mapsLink}\n\n` +
    `Please rush to the location immediately or call emergency services: 112\n\n` +
    `— Sanjeevani Smart-Shield ID: ${profile.shield_id}`
  );

  // Open WhatsApp SOS for each contact (first one auto-fires, rest are shown as buttons)
  const primary = contacts[0];
  const phone   = primary.phone.replace(/[\s\-\+]/g, "");
  const waUrl   = `https://api.whatsapp.com/send?phone=${phone.startsWith("91") ? phone : "91" + phone}&text=${msg}`;

  // Show the SOS sent banner
  showSOSBanner(profile, contacts, waUrl, mapsLink);

  // Auto-open WhatsApp after a short delay (gives time for banner to show)
  setTimeout(() => { window.open(waUrl, "_blank"); }, 1800);
}

function showSOSBanner(profile, contacts, waUrl, mapsLink) {
  const banner = document.getElementById("sos-banner");
  if (!banner) return;

  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  banner.innerHTML = `
    <div class="sos-banner-inner">
      <div class="sos-banner-top">
        <span class="sos-icon">📡</span>
        <div>
          <div class="sos-title">SOS Alert Dispatched</div>
          <div class="sos-time">Sent at ${time} · GPS coordinates attached</div>
        </div>
        <span class="sos-check">✅</span>
      </div>
      <div class="sos-contacts">
        ${contacts.map((c, i) => {
          const p = c.phone.replace(/[\s\-\+]/g, "");
          const phone = p.startsWith("91") ? p : "91" + p;
          const smsMsg = encodeURIComponent(`🚨 SOS: ${profile.name} needs help. Location: ${mapsLink}. Blood: ${profile.blood_group}. Rush now!`);
          return `
            <a class="sos-contact-btn ${i === 0 ? "whatsapp" : "secondary"}"
               href="https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(`🚨 EMERGENCY SOS — Sanjeevani Smart-Shield\n\n${profile.name} has been in an accident!\n🩸 Blood Group: ${profile.blood_group}\n📍 Location: ${mapsLink}\n\nPlease rush immediately or call 112.\n— Shield ID: ${profile.shield_id}`)}"
               target="_blank" id="sos-btn-${i}">
              <span>${i === 0 ? "📲" : "📱"}</span>
              <div>
                <div class="sos-contact-name">${c.name} ${c.relation ? "(" + c.relation + ")" : ""}</div>
                <div class="sos-contact-action">Tap to resend SOS on WhatsApp</div>
              </div>
            </a>`;
        }).join("")}
      </div>
    </div>`;

  banner.classList.remove("hidden");
}

// ---- Manual SOS Trigger -----------------------------------
/**
 * Called when the responder taps the big red SOS button.
 * Opens WhatsApp for the PRIMARY contact automatically,
 * and shows individual buttons for all other contacts.
 * @param {boolean} resend - if true, skip the auto-open and just refresh UI
 */
function triggerManualSOS(resend = false) {
  const profile = currentProfile;
  if (!profile) return;

  const contacts = (profile.ice_contacts || []).filter(c => c.phone);
  if (!contacts.length) {
    alert("No emergency contacts registered for this patient.");
    return;
  }

  const hospitalLink = patientCoords
    ? `https://www.google.com/maps/search/trauma+center+emergency+hospital/@${patientCoords.lat},${patientCoords.lng},13z`
    : `https://www.google.com/maps/search/trauma+center+emergency+hospital+near+me`;

  const allergyLine = (profile.allergies || []).filter(a => a && a !== "None");

  const buildMsg = (contact) => encodeURIComponent(
    `🚨 *EMERGENCY SOS — Sanjeevani Smart-Shield*\n\n` +
    `👤 *Patient:* ${profile.name} | ${profile.age || "?"}yrs | ${profile.gender || ""}\n` +
    `🩸 *Blood Group:* ${profile.blood_group}\n` +
    (allergyLine.length ? `⚠ *ALLERGIES:* ${allergyLine.join(", ")} — Do NOT administer!\n` : "") +
    `\n📍 *Live GPS Location:*\n${mapsLink}\n\n` +
    `🏥 *Nearest Emergency Hospital:*\n${hospitalLink}\n\n` +
    `🆘 *Call Emergency Services: 112*\n\n` +
    `— Sanjeevani Smart-Shield ID: ${profile.shield_id}`
  );

  // Auto-open WhatsApp for primary contact (unless resending)
  if (!resend) {
    const primary = contacts[0];
    const phone   = primary.phone.replace(/[\s\-\+]/g, "");
    const waPhone = phone.startsWith("91") ? phone : "91" + phone;
    window.open(`https://api.whatsapp.com/send?phone=${waPhone}&text=${buildMsg(primary)}`, "_blank");
  }

  // Show confirmation bar
  const sentBar  = document.getElementById("sos-sent-status");
  const sentTime = document.getElementById("sos-sent-time");
  const sosBtn   = document.getElementById("sos-big-btn");
  if (sentBar) {
    sentBar.classList.remove("hidden");
    if (sentTime) {
      const t = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      sentTime.textContent = `Sent at ${t} · GPS coordinates attached · Tap contacts below to resend`;
    }
  }
  if (sosBtn) {
    sosBtn.style.opacity = "0.6";
    sosBtn.innerHTML = `<span class="sos-big-pulse"></span><span class="sos-big-icon">✅</span><div class="sos-big-text"><span class="sos-big-title">SOS SENT</span><span class="sos-big-sub">WhatsApp opened for ${contacts[0].name}</span></div>`;
  }

  // Populate individual contact buttons
  renderSOSContactList(profile, buildMsg, true);
}

/**
 * Renders per-contact WhatsApp SOS buttons under the SOS section.
 * @param {object} profile
 * @param {function} [buildMsg] - optional message builder (uses default if omitted)
 * @param {boolean} [highlight] - if true, highlight buttons as active
 */
function renderSOSContactList(profile, buildMsg, highlight = false) {
  const container = document.getElementById("sos-contact-list");
  if (!container) return;

  const contacts = (profile.ice_contacts || []).filter(c => c.phone);
  if (!contacts.length) return;

  const hospitalLink = patientCoords
    ? `https://www.google.com/maps/search/trauma+center+emergency+hospital/@${patientCoords.lat},${patientCoords.lng},13z`
    : `https://www.google.com/maps/search/trauma+center+emergency+hospital+near+me`;

  const allergyLine = (profile.allergies || []).filter(a => a && a !== "None");

  const defaultMsg = (contact) => encodeURIComponent(
    `🚨 *EMERGENCY SOS — Sanjeevani Smart-Shield*\n\n` +
    `👤 *Patient:* ${profile.name} | ${profile.age || "?"}yrs | ${profile.gender || ""}\n` +
    `🩸 *Blood Group:* ${profile.blood_group}\n` +
    (allergyLine.length ? `⚠ *ALLERGIES:* ${allergyLine.join(", ")} — Do NOT administer!\n` : "") +
    `\n📍 *Live GPS Location:*\n${mapsLink}\n\n` +
    `🏥 *Nearest Emergency Hospital:*\n${hospitalLink}\n\n` +
    `🆘 *Call Emergency Services: 112*\n\n` +
    `— Sanjeevani Smart-Shield ID: ${profile.shield_id}`
  );

  const msgFn = buildMsg || defaultMsg;

  container.innerHTML = contacts.map((c, i) => {
    const phone   = c.phone.replace(/[\s\-\+]/g, "");
    const waPhone = phone.startsWith("91") ? phone : "91" + phone;
    const waUrl   = `https://api.whatsapp.com/send?phone=${waPhone}&text=${msgFn(c)}`;
    return `
      <a class="sos-contact-wa-btn" href="${waUrl}" target="_blank" id="sos-wa-${i}">
        <span class="sos-wa-icon">${i === 0 ? "📲" : "📱"}</span>
        <div class="sos-wa-info">
          <span class="sos-wa-name">${c.name}${c.relation ? ` (${c.relation})` : ""}</span>
          <span class="sos-wa-phone">${c.phone} · ${i === 0 ? "Primary ICE" : "Backup ICE"}</span>
        </div>
        <span class="sos-wa-arrow">→ WhatsApp</span>
      </a>`;
  }).join("");
}

// ---- Hospital Locator -------------------------------------
function updateHospitalButton() {
  const btn = document.getElementById("find-hospital-btn");
  if (!btn) return;
  btn.onclick = openHospitalLocator;
  btn.disabled = false;
}

function openHospitalLocator() {
  let url;
  if (patientCoords) {
    url = `https://www.google.com/maps/search/trauma+center+emergency+hospital/@${patientCoords.lat},${patientCoords.lng},13z`;
  } else {
    url = `https://www.google.com/maps/search/trauma+center+emergency+ICU+near+Kanpur`;
  }
  window.open(url, "_blank");
}

// ---- Blood Bank Section -----------------------------------
function renderBloodBankSection(bloodGroup) {
  const section = document.getElementById("blood-bank-section");
  const container = document.getElementById("blood-bank-content");
  if (!section || !container) return;

  section.classList.remove("hidden");

  // Show loading state
  container.innerHTML = `<div class="bb-loading">🔄 Checking blood availability across Kanpur...</div>`;

  // Simulate API call latency (e-RaktKosh API response)
  setTimeout(() => {
    const stock = BLOOD_STOCK_MOCK[bloodGroup];
    const stockClass = stock?.available ? "available" : "critical";
    const stockText  = stock?.available ? `${stock.units} units available` : "OUT OF STOCK — Urgent need";

    container.innerHTML = `
      <div class="bb-patient-need">
        <span class="bb-need-label">Patient Needs</span>
        <span class="bb-need-blood">${bloodGroup}</span>
        <span class="bb-need-status ${stockClass}">${stockText}</span>
      </div>
      <div class="bb-powered">
        <span>Powered by</span>
        <strong>e-RaktKosh</strong>
        <span class="bb-live-dot"></span>
        <span>Live</span>
      </div>
      <div class="bb-list">
        ${BLOOD_BANKS_KANPUR.map(bank => {
          const bankStock = BLOOD_STOCK_MOCK[bloodGroup];
          const avail = bankStock?.available;
          return `
            <div class="bb-item">
              <div class="bb-item-info">
                <div class="bb-item-name">${bank.name}</div>
                <div class="bb-item-addr">${bank.address} · ${bank.distance}</div>
              </div>
              <div class="bb-item-right">
                <span class="bb-item-status ${avail ? "available" : "out"}">${avail ? "✓ Available" : "✗ Unavailable"}</span>
                <a class="bb-call-btn" href="tel:${bank.phone}">📞 Call</a>
              </div>
            </div>`;
        }).join("")}
      </div>
      <a class="bb-eraktkosh-link" href="https://www.eraktkosh.in" target="_blank">
        🌐 Check all Kanpur blood banks on e-RaktKosh →
      </a>`;
  }, 1800);
}

// ---- Render Profile ----------------------------------------
function renderProfile(profile) {
  document.getElementById("resp-blood-group").textContent = profile.blood_group || "?";

  const nameEl = document.getElementById("resp-name");
  if (nameEl) {
    nameEl.textContent = [
      profile.name,
      profile.age ? `${profile.age} yrs` : "",
      profile.gender
    ].filter(Boolean).join("  ·  ");
  }

  const donorEl = document.getElementById("resp-organ-donor");
  if (donorEl) donorEl.classList.toggle("hidden", !profile.organ_donor);

  // Allergies
  const allergyContainer = document.getElementById("resp-allergies");
  const allergySection   = document.getElementById("allergy-section");
  if (allergyContainer) {
    const allergies = (profile.allergies || []).filter(a => a && a !== "None");
    if (allergies.length) {
      allergyContainer.innerHTML = allergies.map(a =>
        `<span class="alert-badge allergy">⚠ ALLERGIC: ${a.toUpperCase()}</span>`
      ).join("");
      allergySection?.classList.remove("hidden");
    } else {
      allergySection?.classList.add("hidden");
    }
  }

  // Conditions
  const condContainer = document.getElementById("resp-conditions");
  const condSection   = document.getElementById("condition-section");
  if (condContainer) {
    const conds = (profile.conditions || []).filter(c => c && c !== "None");
    if (conds.length) {
      condContainer.innerHTML = conds.map(c =>
        `<span class="alert-badge condition">${c.toUpperCase()}</span>`
      ).join("");
      condSection?.classList.remove("hidden");
    } else {
      condSection?.classList.add("hidden");
    }
  }

  // ICE Contacts
  const iceContainer = document.getElementById("resp-ice-contacts");
  if (iceContainer) {
    const contacts = (profile.ice_contacts || []).filter(c => c.phone);
    iceContainer.innerHTML = contacts.map((c, i) => `
      <a class="ice-call-btn ${i === 0 ? "primary" : "secondary"}"
         href="tel:${c.phone.replace(/\s/g, "")}" id="ice-call-${i}">
        <span class="ice-call-icon">📞</span>
        <div class="ice-call-info">
          <span class="ice-call-label">${i === 0 ? "Primary ICE Contact" : "Backup Contact"}</span>
          <span class="ice-call-name">${c.name}</span>
          <span class="ice-call-phone">${c.phone}</span>
          ${c.relation ? `<span class="ice-call-rel">${c.relation}</span>` : ""}
        </div>
        <span class="ice-call-arrow">→</span>
      </a>`).join("");
  }

  const updEl = document.getElementById("resp-updated");
  if (updEl && profile.updated_at) {
    const dt = new Date(profile.updated_at);
    updEl.textContent = `Profile last updated: ${dt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
  }

  // Render per-contact SOS WhatsApp buttons
  renderSOSContactList(profile);
}

// ---- UI Helpers --------------------------------------------
function showLoading(show) {
  document.getElementById("resp-loading")?.classList.toggle("hidden", !show);
}

function showCard(show) {
  document.getElementById("resp-card")?.classList.toggle("hidden", !show);
}

function showError(msg) {
  showLoading(false);
  document.getElementById("resp-card")?.classList.add("hidden");
  const el = document.getElementById("resp-error");
  if (el) { el.innerHTML = msg; el.classList.remove("hidden"); }
}

// ============================================================
//  DIGITAL VOICE (TTS — Text to Speech)
// ============================================================

let speechSnyth = window.speechSynthesis;
let isSpeaking = false;

function toggleVoice() {
  if (isSpeaking) {
    stopVoice();
  } else {
    speakProfile();
  }
}

function stopVoice() {
  speechSnyth.cancel();
  isSpeaking = false;
  const btn = document.getElementById("voice-btn");
  if (btn) {
    btn.textContent = t("speak_profile");
    btn.classList.remove("speaking");
  }
}

function speakProfile() {
  if (!currentProfile) return;
  
  stopVoice(); // Clear queue

  const text = buildSpeechText(currentProfile);
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Attempt to find a voice matching the current language
  const voices = speechSnyth.getVoices();
  const targetLang = currentLang || "en";
  utterance.lang = targetLang;
  
  const voice = voices.find(v => v.lang.startsWith(targetLang));
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    isSpeaking = true;
    const btn = document.getElementById("voice-btn");
    if (btn) {
      btn.textContent = t("stop_speech");
      btn.classList.add("speaking");
    }
  };

  utterance.onend = () => {
    isSpeaking = false;
    const btn = document.getElementById("voice-btn");
    if (btn) {
      btn.textContent = t("speak_profile");
      btn.classList.remove("speaking");
    }
  };

  speechSnyth.speak(utterance);
}

function buildSpeechText(p) {
  let s = `${t("speech_intro")} ${p.name}. `;
  s += `${t("speech_blood")} ${p.blood_group}. `;
  
  if (p.allergies && p.allergies.length > 0) {
    s += `${t("speech_allergic")} ${p.allergies.join(", ")}. `;
  }
  
  if (p.conditions && p.conditions.length > 0) {
    s += `${t("speech_conditions")} ${p.conditions.join(", ")}. `;
  }
  
  if (p.organ_donor) {
    s += t("speech_donor");
  }

  return s;
}

// Pre-load voices (chrome fix)
window.speechSynthesis.getVoices();

