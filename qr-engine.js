// ============================================================
//  SANJEEVANI SMART-SHIELD — QR Code Engine (URL Encoding Mode)
//  ============================================================
//  The full patient profile is encoded as Base64 JSON directly
//  into the QR code URL so no server is needed when scanning.
// ============================================================

const QR_SIZE = 280;

/**
 * Build the URL that will be encoded into the QR code.
 */
function buildMedicalIdUrl(profileOrId) {
  const STORED_BASE_URL = localStorage.getItem("SANJEEVANI_BASE_URL");
  const DEBUG_BASE_URL = STORED_BASE_URL || (typeof BASE_URL !== "undefined" ? BASE_URL : ""); 

  let base = "";
  let isExternal = !!DEBUG_BASE_URL;

  if (DEBUG_BASE_URL) {
    base = DEBUG_BASE_URL.replace(/\/$/, "");
  } else {
    const origin = (window.location.origin === "null" || !window.location.origin) ? "file://" : window.location.origin;
    base = origin + window.location.pathname.replace(/\/[^/]*$/, "");
    if (window.location.protocol === "file:") isExternal = false;
  }

  const shieldId = typeof profileOrId === "string" ? profileOrId : profileOrId.shield_id;
  const lang = typeof currentLang !== "undefined" ? currentLang : "en";
  let url = `${base}/medical-id.html?id=${encodeURIComponent(shieldId)}&lang=${lang}`;

  // HYBRID MODE: If we have the full profile object, encode it directly into the URL (?d=)
  // This allows the page to load INSTANTLY (0ms) while waiting for Supabase in the background.
  if (typeof profileOrId === "object" && typeof encodeProfile === "function") {
    const data = encodeProfile(profileOrId);
    url += `&d=${encodeURIComponent(data)}`;
  }
  
  return { url, isExternal };
}

/**
 * Render a branded QR code into a container element.
 * @param {object|string} profileOrId — Full profile object (preferred) or legacy Shield ID string
 * @param {HTMLElement} container     — The DOM element to render into
 */
function renderQRCode(profileOrId, container) {
  container.innerHTML = "";

  // Support both new (profile object) and legacy (shieldId string) calls
  const shieldId = typeof profileOrId === "string" ? profileOrId : profileOrId.shield_id;
  const { url, isExternal } = buildMedicalIdUrl(profileOrId);

  // Status badge for the UI
  const statusBadge = document.createElement("div");
  statusBadge.className = `qr-status-badge ${isExternal ? "scannable" : "local-only"}`;
  statusBadge.innerHTML = isExternal 
    ? `✅ Scannable on Phone` 
    : `⚠️ Not scannable on phone (Local only)`;
  container.appendChild(statusBadge);

  // Outer branded wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "qr-code-wrapper";

  // Header
  const header = document.createElement("div");
  header.className = "qr-code-header";
  header.innerHTML = `
    <span class="qr-logo-icon">🛡</span>
    <span>Sanjeevani Smart-Shield</span>`;
  wrapper.appendChild(header);

  // QR canvas area
  const qrArea = document.createElement("div");
  qrArea.className = "qr-code-area";

  const qrDiv = document.createElement("div");
  qrArea.appendChild(qrDiv);
  wrapper.appendChild(qrArea);

  // Footer
  const footer = document.createElement("div");
  footer.className = "qr-code-footer";
  footer.innerHTML = `<span class="shield-id-label">SHIELD ID</span><span class="shield-id-value">${shieldId}</span>`;
  wrapper.appendChild(footer);

  container.appendChild(wrapper);

  // Generate QR using qrcode.js CDN library
  // Use error correction level M (not H) to keep URL length manageable
  if (typeof QRCode !== "undefined") {
    new QRCode(qrDiv, {
      text:         url,
      width:        QR_SIZE,
      height:       QR_SIZE,
      colorDark:    "#0f172a",
      colorLight:   "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  } else {
    qrDiv.innerHTML = `<div class="qr-fallback">QR library not loaded.<br>URL: <small>${url}</small></div>`;
  }

  return url;
}

/**
 * Generate a printable QR tag layout in a new window.
 */
function printQRTag(profileOrId, patientName, bloodGroup) {
  const shieldId = typeof profileOrId === "string" ? profileOrId : profileOrId.shield_id;
  const { url } = buildMedicalIdUrl(profileOrId);

  const win = window.open("", "_blank", "width=400,height=600");
  win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Sanjeevani Tag — ${shieldId}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #fff; }
    .tag {
      width: 8cm; height: 8cm; margin: 20px auto;
      border: 3px solid #ef4444; border-radius: 12px;
      padding: 12px; text-align: center; box-sizing: border-box;
    }
    .tag-title { color: #ef4444; font-size: 11px; font-weight: bold; letter-spacing: 2px; margin-bottom: 4px; }
    .tag-name  { font-size: 13px; font-weight: bold; margin: 4px 0; color: #0f172a; }
    .tag-bg    { font-size: 24px; font-weight: 900; color: #ef4444; margin: 2px 0; }
    .tag-id    { font-size: 9px; color: #64748b; margin-top: 4px; letter-spacing: 1px; }
    #qr-print  { display: flex; justify-content: center; margin: 4px 0; }
    #qr-print img, #qr-print canvas { width: 120px !important; height: 120px !important; }
    .scan-hint { font-size: 8px; color: #94a3b8; margin-top: 2px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="tag">
    <div class="tag-title">🛡 SANJEEVANI SMART-SHIELD</div>
    <div class="tag-name">${patientName}</div>
    <div class="tag-bg">🩸 ${bloodGroup}</div>
    <div id="qr-print"></div>
    <div class="scan-hint">In an emergency, scan this QR code</div>
    <div class="tag-id">${shieldId}</div>
  </div>
  <script>
    window.onload = function() {
      new QRCode(document.getElementById("qr-print"), {
        text: ${JSON.stringify(url)}, width: 120, height: 120,
        colorDark: "#0f172a", colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
      setTimeout(() => window.print(), 800);
    };
  <\/script>
</body>
</html>`);
  win.document.close();
}
