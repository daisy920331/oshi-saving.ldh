// assets/app.js
// ===== core storage =====
const DATA_KEY = "oshi_savings_v1";
const UI_KEY = "oshi_ui_v1";
const CONFIG_KEY = "oshi_config_v1";

// ===== defaults =====
export const DEFAULT_CATS = ["Shokichi", "Akira", "團體"];

// 顏色：你之前指定的三色（可在設定頁改）
const DEFAULT_THEME_MAP = {
  "Shokichi": { bg: "rgba(226, 88, 34, .14)", fg: "#c2410c", border: "rgba(226, 88, 34, .35)", tape: "rgba(226, 88, 34, .35)" },
  "Akira":    { bg: "rgba(32, 32, 32, .08)", fg: "#1f1f1f", border: "rgba(180,150,90,.55)", tape: "rgba(40,40,40,.30)" },
  "團體":     { bg: "rgba(34, 139, 34, .14)", fg: "#166534", border: "rgba(34, 139, 34, .35)", tape: "rgba(34, 139, 34, .32)" },
};

// 你提供給同擔的「固定初始背景」：放 repo 裡
const DEFAULT_BG_URL = "assets/backgrounds/default.jpg";

// ===== utils =====
export const pad = (n) => String(n).padStart(2, "0");

export function ymd(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function ymLabel(y, m0) {
  return `${y}-${pad(m0 + 1)}`;
}

export function loadData() {
  const raw = localStorage.getItem(DATA_KEY);
  if (!raw) return { rules: {}, records: {} };
  try {
    const x = JSON.parse(raw);
    return x && x.records ? x : { rules: {}, records: {} };
  } catch {
    return { rules: {}, records: {} };
  }
}
export function saveData(x) {
  localStorage.setItem(DATA_KEY, JSON.stringify(x));
}

// ===== config (site-wide settings) =====
export function getConfig() {
  const raw = localStorage.getItem(CONFIG_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
export function saveConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}
export function isConfigured() {
  const cfg = getConfig();
  return !!(cfg && cfg.setupDone);
}

export function getSiteTitle() {
  const cfg = getConfig();
  // 例：小美的LDH追星存錢手帳
  if (cfg?.siteTitle && String(cfg.siteTitle).trim()) return String(cfg.siteTitle).trim();
  if (cfg?.ownerName && String(cfg.ownerName).trim()) return `${String(cfg.ownerName).trim()}的LDH追星存錢手帳`;
  return "LDH追星存錢手帳";
}

export function getCats() {
  const cfg = getConfig();
  const cats = cfg?.cats;
  if (Array.isArray(cats) && cats.filter(Boolean).length) return cats.map(String);
  return DEFAULT_CATS.slice();
}

export function getThemeMap() {
  const cfg = getConfig();
  const m = (cfg && cfg.themeMap && typeof cfg.themeMap === "object") ? cfg.themeMap : {};
  // merge defaults + custom
  return { ...DEFAULT_THEME_MAP, ...m };
}

export function getCatTheme(catName) {
  const map = getThemeMap();
  return map[catName] || { bg: "rgba(150,150,150,.10)", fg: "#111", border: "rgba(150,150,150,.25)", tape: "rgba(150,150,150,.25)" };
}

// 給 tag 用：inline style（不用再寫死 class）
export function tagStyleAttr(catName) {
  const t = getCatTheme(catName);
  return `style="background:${t.bg};color:${t.fg};border-color:${t.border};"`;
}

// 給事件卡片右上角膠帶用（用 CSS 變數控制）
export function tapeVarsAttr(catName) {
  const t = getCatTheme(catName);
  return `style="--tape:${t.tape};--tapeborder:${t.border};"`;
}

// ===== UI (background/music) =====
export function getUI() {
  const raw = localStorage.getItem(UI_KEY);
  if (!raw) return {
    bgOpacity: 0.25,
    musicVolume: 0.6,
    musicOn: false,
    bgIndexHome: 0,
    bgIndexPlanner: 0,
  };
  try {
    const x = JSON.parse(raw);
    return x && typeof x === "object" ? x : {
      bgOpacity: 0.25,
      musicVolume: 0.6,
      musicOn: false,
      bgIndexHome: 0,
      bgIndexPlanner: 0,
    };
  } catch {
    return {
      bgOpacity: 0.25,
      musicVolume: 0.6,
      musicOn: false,
      bgIndexHome: 0,
      bgIndexPlanner: 0,
    };
  }
}
export function saveUI(ui) {
  localStorage.setItem(UI_KEY, JSON.stringify(ui));
}

// 內建背景清單：你可以放多張到 assets/backgrounds/，這裡先給基本
export function getBuiltInBackgrounds() {
  // 你可以自行加：bg2.jpg / bg3.jpg...
  return [
    DEFAULT_BG_URL,
    "assets/backgrounds/bg2.jpg",
    "assets/backgrounds/bg3.jpg",
  ];
}

// 背景來源：優先用 config 的 initialBg（第一次設定選的）
export function getActiveBackgroundUrl(scope = "planner") {
  const cfg = getConfig();
  const ui = getUI();
  const list = getBuiltInBackgrounds().filter(Boolean);

  const idx = (scope === "home") ? (ui.bgIndexHome ?? 0) : (ui.bgIndexPlanner ?? 0);
  const picked = list.length ? list[((idx % list.length) + list.length) % list.length] : DEFAULT_BG_URL;

  // 如果使用者設定了「初始背景」或後來在設定頁換了背景，也可以覆蓋
  const custom = cfg?.backgroundUrl;
  return custom || picked || DEFAULT_BG_URL;
}

export async function applyBackground(scope = "planner") {
  const ui = getUI();
  const bgUrl = getActiveBackgroundUrl(scope);

  const wrap = document.querySelector(".bg-wrap");
  if (!wrap) return;

  wrap.style.opacity = String(ui.bgOpacity ?? 0.25);
  wrap.style.backgroundImage = `url("${bgUrl}")`;
  wrap.style.backgroundSize = "cover";
  wrap.style.backgroundPosition = "center";
  wrap.style.backgroundAttachment = "fixed";
}

// ===== music =====
export async function setupBGM(audioEl) {
  const cfg = getConfig();
  const ui = getUI();
  if (!audioEl) return;

  // 允許使用者在設定頁上傳一首音樂（存 dataURL）
  const src = cfg?.musicDataUrl || "";
  if (src) audioEl.src = src;

  audioEl.volume = Number(ui.musicVolume ?? 0.6);
}

// ===== stats =====
export function monthSum(data, y, m0, catFilter = "") {
  const prefix = `${y}-${pad(m0 + 1)}-`;
  let s = 0;
  for (const k of Object.keys(data.records || {})) {
    if (!k.startsWith(prefix)) continue;
    const arr = data.records[k] || [];
    for (const r of arr) {
      if (catFilter && (r.cat || "") !== catFilter) continue;
      s += Number(r.amount) || 0;
    }
  }
  return s;
}

export function computeStreak(data, todayKey, catFilter = "") {
  // streak = 往回連續有紀錄的天數
  let streak = 0;
  let d = new Date(todayKey);
  while (true) {
    const key = ymd(d);
    const arr = (data.records && data.records[key]) ? data.records[key] : [];
    const ok = arr.some(r => !catFilter || (r.cat || "") === catFilter);
    if (!ok) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ===== reward image picker =====
// 你原本做法：讓使用者每次新增紀錄時從素材庫挑一張鼓勵圖（通常在 settings.html 管理）
// 這裡保留一個簡單版本：從 localStorage 的 reward pool 隨機挑
const REWARD_POOL_KEY = "oshi_reward_pool_v1";

export function loadRewardPool() {
  try { return JSON.parse(localStorage.getItem(REWARD_POOL_KEY) || "[]") || []; }
  catch { return []; }
}
export function saveRewardPool(arr) {
  localStorage.setItem(REWARD_POOL_KEY, JSON.stringify(arr || []));
}

export async function pickRewardImage() {
  const pool = loadRewardPool();
  if (!pool.length) return "";
  // 先用隨機；你也可以改成彈出選擇
  const i = Math.floor(Math.random() * pool.length);
  return pool[i] || "";
}

// ===== first-run guard =====
export function guardSetup() {
  // 只有在 setup.html 不做導頁
  const path = location.pathname.toLowerCase();
  if (path.endsWith("/setup.html") || path.endsWith("setup.html")) return;

  if (!isConfigured()) {
    location.href = "setup.html";
  }
}
