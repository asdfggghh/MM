// ============================================================
//  SANJEEVANI SMART-SHIELD — Theme Manager (Light / Dark)
// ============================================================

const THEME_KEY   = "ssw_theme";
let currentTheme  = localStorage.getItem(THEME_KEY) || "dark";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  currentTheme = theme;
  localStorage.setItem(THEME_KEY, theme);

  document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
    btn.innerHTML      = theme === "dark" ? "☀️" : "🌙";
    btn.title          = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    btn.setAttribute("aria-label", btn.title);
  });
}

function toggleTheme() { applyTheme(currentTheme === "dark" ? "light" : "dark"); }

// Apply immediately (before DOM ready) to avoid flash
applyTheme(currentTheme);
