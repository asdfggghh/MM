// ============================================================
//  SANJEEVANI SMART-SHIELD — Supabase Configuration
//  ============================================================
//
//  SETUP (one-time, ~5 minutes):
//
//  1. Go to https://supabase.com → "Start for Free" → create project
//     → Name it "sanjeevani-smart-shield" → choose a region near you
//     → Set a strong database password (save it)
//
//  2. Once the project is ready, go to:
//     Project Settings → API
//     Copy:  "Project URL"  →  paste as SUPABASE_URL below
//     Copy:  "anon / public" key → paste as SUPABASE_ANON_KEY below
//
//  3. Go to SQL Editor (left sidebar) → "New Query" → paste and run
//     the SQL from SUPABASE_SETUP.md (in this project folder)
//
//  4. Replace the placeholder values below with your real values.
//
//  That's it — the app will work fully with real-time sync!
// ============================================================

const SUPABASE_URL      = "https://bmhefxixmqxmgrqnbgra.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaGVmeGl4bXF4bWdycW5iZ3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjIwNjgsImV4cCI6MjA5MTIzODA2OH0.-kzwgcP5hwBUhGgNwxmQSzGYMD0q5LQfAi9zHuZgE-Y";

// ---- Base URL -----------------------------------------------
//  Set this to wherever you host the project, e.g.:
//  "https://yourusername.github.io/sanjeevani"
//  Leave empty "" for same-origin (works when opened as a file)
const BASE_URL = "";

// ---- Client instance ----------------------------------------
let supabaseClient = null;
let supabaseReady  = false;

// Keep legacy variable names so other files don't crash
let db            = null;
let firebaseReady = false;

// ---- Init ---------------------------------------------------
function initFirebase() {
  try {
    if (!SUPABASE_URL || SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL") {
      console.warn("[Sanjeevani] Supabase not configured — running in offline mode.");
      // Still mark as ready so the app runs in offline/URL-encoding mode
      supabaseReady = true;
      firebaseReady = true;
      return;
    }

    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: { params: { eventsPerSecond: 10 } }
    });

    supabaseReady = true;
    firebaseReady = true;
    db = supabaseClient; // alias for any legacy checks

    console.log("[Sanjeevani] Supabase connected ✓");

    // Hide error banner if visible
    const banner = document.getElementById("firebase-error-banner");
    if (banner) banner.classList.add("hidden");

  } catch (err) {
    console.error("[Sanjeevani] Supabase initialization failed:", err);
    supabaseReady = false;
    firebaseReady = false;
    const banner = document.getElementById("firebase-error-banner");
    if (banner) banner.classList.remove("hidden");
  }
}
