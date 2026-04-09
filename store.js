// ============================================================
//  SANJEEVANI SMART-SHIELD — Data Store (Supabase + Offline)
//  ============================================================
//  Architecture (best of both worlds):
//
//  🌐 ONLINE:  All data saved to Supabase PostgreSQL
//              Dashboard gets real-time live updates
//              QR Medical ID fetches live profile from Supabase
//
//  📱 QR CODE: Full profile is ALSO encoded into the QR URL
//              so Medical ID works even without internet
//              (URL ?d= param takes priority over Supabase fetch)
//
//  💾 OFFLINE: If Supabase is unreachable, falls back to
//              localStorage write-queue and retries on reconnect
// ============================================================

const SUPABASE_TABLE = "shields";
const LS_CACHE       = "ss_cache";    // localStorage cache key
const LS_QUEUE       = "ss_queue";    // offline write queue key

// ---- Shield ID Generator ------------------------------------
function generateShieldId(name) {
  const initials = name.trim().split(/\s+/)
    .map(w => w[0].toUpperCase()).join("").slice(0, 3).padEnd(2, "X");
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SSS-${num}-${initials}`;
}

// ---- URL Encoding (QR offline support) ----------------------
function encodeProfile(profile) {
  const json = JSON.stringify(profile);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeProfile(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ---- LocalStorage Cache Helpers -----------------------------
function _cacheLoad() {
  try { return JSON.parse(localStorage.getItem(LS_CACHE) || "[]"); }
  catch { return []; }
}

function _cacheSave(profiles) {
  try { localStorage.setItem(LS_CACHE, JSON.stringify(profiles)); }
  catch {}
}

function _cacheUpsert(profile) {
  const all = _cacheLoad();
  const idx = all.findIndex(p => p.shield_id === profile.shield_id);
  if (idx >= 0) all[idx] = profile;
  else all.unshift(profile);
  _cacheSave(all);
}

// ---- Offline Write Queue ------------------------------------
function _enqueueWrite(profile) {
  try {
    const q = JSON.parse(localStorage.getItem(LS_QUEUE) || "[]");
    q.push(profile);
    localStorage.setItem(LS_QUEUE, JSON.stringify(q));
  } catch {}
}

async function _flushQueue() {
  if (!supabaseClient) return;
  try {
    const q = JSON.parse(localStorage.getItem(LS_QUEUE) || "[]");
    if (!q.length) return;
    for (const profile of q) {
      const { error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .upsert(profile, { onConflict: "shield_id" });
      if (error) throw error;
    }
    localStorage.removeItem(LS_QUEUE);
    console.log(`[Store] Flushed ${q.length} queued offline writes to Supabase.`);
  } catch (err) {
    console.warn("[Store] Queue flush failed (still offline):", err.message);
  }
}

// ---- Public API ---------------------------------------------

/**
 * Save a new patient profile.
 * Writes to Supabase (cloud) + localStorage cache + offline queue fallback.
 */
async function saveProfile(data) {
  const pkg = (typeof PACKAGES !== "undefined" ? PACKAGES : [])
    .find(p => p.id === data.package_id);

  const profile = {
    shield_id:     generateShieldId(data.name),
    name:          data.name.trim(),
    age:           Number(data.age),
    gender:        data.gender || "",
    blood_group:   data.blood_group,
    allergies:     (data.allergies  || []).filter(a => a && a !== "None"),
    conditions:    (data.conditions || []).filter(c => c && c !== "None"),
    organ_donor:   Boolean(data.organ_donor),
    ice_contacts:  (data.ice_contacts || []).filter(c => c.name || c.phone),
    package_name:  data.package_name || pkg?.name || "",
    price:         Number(data.price || pkg?.price || 0),
    registered_at: new Date().toISOString(),
    updated_at:    new Date().toISOString(),
  };

  // Always cache locally first (instant UI)
  _cacheUpsert(profile);

  // Always cache locally first (instant UI update)
  _cacheUpsert(profile);

  if (supabaseClient) {
    try {
      const { data: insertedData, error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      console.log("[Store] ✓ Saved to Supabase:", profile.shield_id);

      // Flush offline queue if connection is good
      _flushQueue();
      return insertedData || profile;

    } catch (err) {
      console.warn("[Store] Supabase write failed, queued for retry:", err.message);
      _enqueueWrite(profile);
      return profile;
    }
  } else {
    _enqueueWrite(profile);
    return profile;
  }
}

/**
 * Fetch a single profile by Shield ID.
 * Priority: Supabase (live) → localStorage cache.
 */
async function getProfile(shieldId) {
  if (!shieldId) return null;

  // 1. Try Supabase (Always fresh)
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .select("*")
        .eq("shield_id", shieldId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log("[Store] Profile not found in Supabase.");
        } else {
          throw error;
        }
      }

      if (data) {
        _cacheUpsert(data); // Sync cache
        return data;
      }
    } catch (err) {
      console.warn("[Store] Supabase fetch error:", err.message);
    }
  }

  // 2. Fallback to localStorage cache
  const cached = _cacheLoad().find(p => p.shield_id === shieldId);
  if (cached) console.log("[Store] Profile loaded from local cache.");
  return cached || null;
}

/**
 * Update an existing profile's fields.
 */
async function updateProfile(shieldId, updates) {
  updates.updated_at = new Date().toISOString();
  if (!supabaseClient) return;
  const { error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .update(updates)
    .eq("shield_id", shieldId);
  if (error) throw error;
}

/**
 * Subscribe to real-time profile updates (powers the live Dashboard).
 * Falls back to localStorage cache if Supabase is not configured.
 * Returns an unsubscribe function.
 */
function subscribeToProfiles(callback, onError) {
  if (!supabaseClient) {
    // Offline mode: load from cache and return
    try {
      callback(_cacheLoad());
    } catch (err) {
      onError?.(err.message);
    }
    return () => {};
  }

  let channel = null;

  // Fetch initial data
  const fetchAll = async () => {
    try {
      const { data, error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .select("*")
        .order("registered_at", { ascending: false });

      if (error) throw error;
      _cacheSave(data); // keep cache in sync
      callback(data);
      _flushQueue();   // flush any offline writes now that we're connected
    } catch (err) {
      console.error("[Store] Initial fetch failed:", err.message);
      // Fall back to cache
      const cached = _cacheLoad();
      if (cached.length) callback(cached);
      else onError?.(err.message);
    }
  };

  fetchAll();

  // Remove any existing subscription with the same name before creating a new one
  if (supabaseClient.getChannels().some(c => c.topic === "realtime:shields-realtime")) {
    supabaseClient.getChannels()
      .filter(c => c.topic === "realtime:shields-realtime")
      .forEach(c => supabaseClient.removeChannel(c));
  }

  // Subscribe to real-time INSERT / UPDATE / DELETE events
  channel = supabaseClient
    .channel("shields-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: SUPABASE_TABLE },
      () => fetchAll()   // re-fetch on any change
    )
    .subscribe(status => {
      if (status === "SUBSCRIBED") {
        console.log("[Store] 🔴 Real-time live feed connected.");
      }
    });

  return () => {
    if (channel) supabaseClient.removeChannel(channel);
  };
}

/**
 * Refresh Dashboard manually (called after kiosk registration
 * to update the Dashboard even before real-time event arrives).
 */
function refreshDashboard() {
  const profiles = _cacheLoad();
  if (typeof renderDashboard === "function") renderDashboard(profiles);
}

/**
 * Compute dashboard statistics from a profiles array.
 */
function computeStats(profiles) {
  const total   = profiles.length;
  const revenue = profiles.reduce((s, p) => s + (Number(p.price) || 0), 0);

  const skuCount = {};
  profiles.forEach(p => {
    if (p.package_name) skuCount[p.package_name] = (skuCount[p.package_name] || 0) + 1;
  });
  const bestSku = Object.keys(skuCount).sort((a, b) => skuCount[b] - skuCount[a])[0] || "—";

  const bgCount = {};
  profiles.forEach(p => {
    if (p.blood_group) bgCount[p.blood_group] = (bgCount[p.blood_group] || 0) + 1;
  });

  return { total, revenue, bestSku, skuCount, bgCount };
}

// ---- Legacy stubs (kept for API compatibility) --------------
function enqueueWrite(profile) { _enqueueWrite(profile); }
async function flushWriteQueue() { await _flushQueue(); }
