// ============================================================
//  SANJEEVANI SMART-SHIELD — IoT Simulation Engine
//  Accident Detection · Real-time Sensors · Auto-SOS
// ============================================================

let iotInterval = null;
let isCrashActive = false;
let crashTimer = null;
let crashCount = 5;

/**
 * Initialize the IoT sensor feed.
 */
function initIoTEngine() {
  if (iotInterval) clearInterval(iotInterval);
  iotInterval = setInterval(updateSensors, 250);
}

/**
 * Update sensor visuals with semi-random data.
 */
function updateSensors() {
  if (isCrashActive) return;

  // G-Force: 0.8 to 1.2 during "normal" activity
  const gForce = (0.9 + Math.random() * 0.3).toFixed(2);
  const tilt = Math.floor(Math.sin(Date.now() / 1500) * 15);

  updateIoTUI(gForce, tilt);
}

/**
 * Update the DOM elements for IoT sensors.
 */
function updateIoTUI(gForce, tilt) {
  const gEl = document.getElementById("iot-gforce");
  const tEl = document.getElementById("iot-tilt-line");
  const aEl = document.getElementById("iot-tilt-angle");

  if (gEl) gEl.textContent = gForce;
  if (tEl) tEl.style.transform = `rotate(${tilt}deg)`;
  if (aEl) aEl.textContent = `${tilt}°`;
}

/**
 * Trigged by the [SIMULATE CRASH] button.
 */
function simulateCrash() {
  if (isCrashActive) return;
  isCrashActive = true;

  // High-G spike
  const peakG = (12.4 + Math.random() * 5).toFixed(1);
  const peakTilt = Math.random() > 0.5 ? 90 : -90;
  updateIoTUI(peakG, peakTilt);

  // Show Alert UI
  const overlay = document.getElementById("crash-overlay");
  if (overlay) overlay.classList.remove("hidden");

  // Status Chip
  const chip = document.getElementById("iot-status");
  if (chip) {
    chip.textContent = "CRITICAL ALERT";
    chip.classList.add("critical");
  }

  startSOSCountdown();
}

/**
 * Counts down before firing the actual SOS.
 */
function startSOSCountdown() {
  crashCount = 5;
  const countEl = document.getElementById("sos-countdown");
  if (countEl) countEl.textContent = crashCount;

  if (crashTimer) clearInterval(crashTimer);
  crashTimer = setInterval(() => {
    crashCount--;
    if (countEl) countEl.textContent = crashCount;

    if (crashCount <= 0) {
      clearInterval(crashTimer);
      triggerIoTAutoSOS();
    }
  }, 1000);
}

/**
 * Final step: Auto-fires the WhatsApp SOS.
 */
function triggerIoTAutoSOS() {
  // Hide countdown UI
  const overlay = document.getElementById("crash-overlay");
  if (overlay) overlay.classList.add("hidden");

  // Signal the dashboard that an IoT alert happened
  console.log("[IoT] Auto-SOS sequence initiated.");
  
  // Fetch latest profile or demo data
  const profiles = _cacheLoad(); // From store.js
  const profile = profiles[0]; // Take most recent registration for demo

  if (profile) {
    // In a real device, this would hit the backend.
    // Here we simulate the responder scanning link.
    const url = buildMedicalIdUrl(profile);
    window.open(url, "_blank");
    showToast("IoT SOS: Crash data dispatched to emergency services.", "success");
  } else {
    showToast("IoT Simulation: No profile found to alert.", "error");
  }

  isCrashActive = false;
  const chip = document.getElementById("iot-status");
  if (chip) {
    chip.textContent = "CONNECTED • ACTIVE";
    chip.classList.remove("critical");
  }
}

/**
 * Allows the user to cancel the SOS during the countdown.
 */
function cancelIoTSOS() {
  if (crashTimer) clearInterval(crashTimer);
  isCrashActive = false;
  
  const overlay = document.getElementById("crash-overlay");
  if (overlay) overlay.classList.add("hidden");

  const chip = document.getElementById("iot-status");
  if (chip) {
    chip.textContent = "CONNECTED • ACTIVE";
    chip.classList.remove("critical");
  }

  showToast("SOS Alert Cancelled by user.", "info");
}
