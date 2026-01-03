// assets/app.js
// =========================================================
// LDH追星存錢手帳 - app.js（整合完整版）
// - 舊版依賴：guardSetup/getSiteTitle/getUI/saveUI/setupBGM/loadData/saveData...
// - 新版：背景庫多張上傳、刪除、容量提示（navigator.storage.estimate）
// - 修正背景顯示：配合 app.css 使用 .bg-wrap::before + --bg-image
// - ✅ 新增：getCats()（即時讀設定的對象清單，避免月曆不同步）
// =========================================================

// =====================
// Storage Keys
// =====================
export const CONFIG_KEY      = "oshi_config_v1";
export const UI_KEY          = "oshi_ui_v1";
export const SAVE_KEY        = "oshi_savings_v1";     // 存錢資料
export const BG_LIBRARY_KEY  = "oshi_bg_library_v1";  // 背景庫

// =====================
// Defaults
// =====================
export const DEFAULT_CATS = ["SHOKICHI", "AKIRA", "團體"];

// ❌ DEPRECATED：請勿再用 CATS（它只會在載入時算一次，導致設定不同步）
// 保留是為了不讓舊頁面立刻噴錯；你現在的月曆已改用 getCats()
export const CATS = (() => {
  const cfg = safeJSON(localStorage.getItem(CONFIG_KEY), null);
  const arr = cfg?.cats;
  return Array.isArray(arr) && arr.length ? arr : DEFAULT_CATS.slice();
})();

// ✅ 正確用法：每次都即時讀設定
export function getCats(){
  const cfg = ensureConfig();
  if(Array.isArray(cfg.cats) && cfg.cats.length) return cfg.cats.slice();
  return DEFAULT_CATS.slice();
}

// =====================
// Small utils
// =====================
export function pad(n){ return String(n).padStart(2, "0"); }

export function ymd(d){
  const x = (d instanceof Date) ? d : new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`;
}

export function ymLabel(y, m0){
  return `${y}-${pad(m0+1)}`;
}

function clampMod(i, len){
  if(!len) return 0;
  let x = Number(i || 0);
  x = x % len;
  if(x < 0) x += len;
  return x;
}

function safeJSON(raw, fallback){
  try{ return raw ? JSON.parse(raw) : fallback; }catch{ return fallback; }
}

// =====================
// Config
// =====================
export function getConfig(){
  return safeJSON(localStorage.getItem(CONFIG_KEY), null);
}

export function saveConfig(cfg){
  try{
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg || {}));
  }catch(e){
    alert("儲存失敗：可能是瀏覽器容量已滿（背景/音樂太多）。\n請到設定頁刪除一些背景或改用小圖。");
    throw e;
  }
}

export function ensureConfig(){
  let cfg = getConfig();
  if(!cfg){
    cfg = {
      setupDone: false,
      ownerName: "",
      siteTitle: "",
      cats: DEFAULT_CATS.slice(),
      themeMap: {},
      backgroundUrl: "",
      musicDataUrl: ""
    };
    saveConfig(cfg);
  }else{
    // 向前相容補欄位
    if(!Array.isArray(cfg.cats) || !cfg.cats.length) cfg.cats = DEFAULT_CATS.slice();
    if(!cfg.themeMap) cfg.themeMap = {};
    if(typeof cfg.backgroundUrl !== "string") cfg.backgroundUrl = "";
    if(typeof cfg.musicDataUrl !== "string") cfg.musicDataUrl = "";
    if(typeof cfg.ownerName !== "string") cfg.ownerName = "";
    if(typeof cfg.siteTitle !== "string") cfg.siteTitle = "";
  }
  return cfg;
}

// =====================
// UI prefs (for index.html knobs)
// =====================
export function getUI(){
  const ui = safeJSON(localStorage.getItem(UI_KEY), {}) || {};
  if(typeof ui.bgOpacity !== "number") ui.bgOpacity = 0.25;
  if(typeof ui.musicVolume !== "number") ui.musicVolume = 0.6;
  if(typeof ui.musicOn !== "boolean") ui.musicOn = true;
  if(typeof ui.bgIndexHome !== "number") ui.bgIndexHome = null; // null=用 config.backgroundUrl
  return ui;
}

export function saveUI(ui){
  try{
    localStorage.setItem(UI_KEY, JSON.stringify(ui || {}));
  }catch(e){
    console.warn("saveUI failed", e);
  }
}

// =====================
// Site title (首頁用)
// =====================
export function getSiteTitle(){
  const cfg = ensureConfig();
  const custom = (cfg.siteTitle || "").trim();
  if(custom) return custom;

  const name = (cfg.ownerName || "").trim();
  if(name) return `${name}的LDH追星存錢手帳`;

  return "LDH追星存錢手帳";
}

// =====================
// guardSetup (calendar/expense/events 用)
// =====================
export function guardSetup(){
  const cfg = ensureConfig();
  if(!cfg.setupDone){
    const here = (location.pathname || "").toLowerCase();
    if(!here.endsWith("setup.html")){
      location.href = "setup.html";
    }
  }
}

// =====================
// Category theme (顏色)
// =====================
export function getCatTheme(name){
  const cfg = ensureConfig();
  const fromMap = cfg.themeMap?.[name];
  if(fromMap && (fromMap.bg || fromMap.fg || fromMap.border || fromMap.tape)){
    return {
      bg: fromMap.bg || "#f5f5f5",
      fg: fromMap.fg || "#111111",
      border: fromMap.border || "#cccccc",
      tape: fromMap.tape || "#cccccc",
    };
  }

  const s = String(name || "").toLowerCase();
  if(s.includes("shokichi")){
    return { bg:"#ffefe8", fg:"#7a2b18", border:"#ffb7a0", tape:"#ff7b52" };
  }
  if(s.includes("akira")){
    return { bg:"#f1f0ee", fg:"#141414", border:"#c9b06a", tape:"#c9b06a" };
  }
  if(s.includes("團體") || s.includes("group")){
    return { bg:"#ecf5ef", fg:"#17422a", border:"#83b69a", tape:"#2e7d52" };
  }
  return { bg:"#f5f5f5", fg:"#111111", border:"#cccccc", tape:"#cccccc" };
}

// =====================
// Background library (multi upload)
// =====================
function uid(){
  return "bg_" + Math.random().toString(36).slice(2,10) + "_" + Date.now().toString(36);
}

export function getCustomBackgrounds(){
  const arr = safeJSON(localStorage.getItem(BG_LIBRARY_KEY), []);
  return Array.isArray(arr) ? arr : [];
}

function saveCustomBackgrounds(arr){
  localStorage.setItem(BG_LIBRARY_KEY, JSON.stringify(arr || []));
}

function readFileAsDataURL(file){
  return new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = ()=>resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export async function addCustomBackgroundFiles(fileList){
  const files = Array.from(fileList || []).filter(Boolean);
  if(!files.length) return getCustomBackgrounds();

  const current = getCustomBackgrounds();
  for(const f of files){
    if(!f.type || !f.type.startsWith("image/")) continue;
    const dataUrl = await readFileAsDataURL(f);
    current.push({
      id: uid(),
      name: f.name || "background",
      dataUrl,
      addedAt: Date.now()
    });
  }
  saveCustomBackgrounds(current);
  return current;
}

export function deleteCustomBackground(id){
  const next = getCustomBackgrounds().filter(x => x.id !== id);
  saveCustomBackgrounds(next);
  return next;
}

export function renameCustomBackground(id, newName){
  const arr = getCustomBackgrounds();
  const item = arr.find(x=>x.id===id);
  if(item){
    item.name = String(newName || "").trim() || item.name;
    saveCustomBackgrounds(arr);
  }
  return arr;
}

// 內建背景（有放就會用，沒放也不影響：你主要用背景庫 dataUrl）
export function getBuiltInBackgrounds(){
  return [
    "assets/backgrounds/default.jpg",
    "assets/backgrounds/planner1.jpg",
    "assets/backgrounds/planner2.jpg",
    "assets/backgrounds/planner3.jpg"
  ];
}

export function getAllBackgroundOptions(){
  const custom = getCustomBackgrounds().map(x=>({
    type: "custom",
    value: x.dataUrl,
    label: `🖼️ ${x.name}`,
    id: x.id
  }));
  const builtIn = getBuiltInBackgrounds().map(u=>({
    type: "builtIn",
    value: u,
    label: u
  }));
  return [...custom, ...builtIn];
}

// =====================
// applyBackground (IMPORTANT: use --bg-image for ::before)
// =====================
export async function applyBackground(theme="planner"){
  const cfg = ensureConfig();
  const ui  = getUI();
  const bg  = document.querySelector(".bg-wrap");
  if(!bg) return;

  const options = getAllBackgroundOptions().map(o=>o.value);
  let url = "";

  if(theme === "home" && ui.bgIndexHome !== null && options.length){
    url = options[clampMod(ui.bgIndexHome, options.length)] || "";
  }else{
    url = cfg.backgroundUrl || (options[0] || "");
  }

  const cssVal = url ? `url("${url}")` : "none";
  bg.style.setProperty("--bg-image", cssVal);

  const op = (typeof ui.bgOpacity === "number") ? ui.bgOpacity : 0.25;
  bg.style.setProperty("--bg-opacity", String(op));
}

// =====================
// BGM
// =====================
export async function setupBGM(audioEl){
  const cfg = ensureConfig();
  if(!audioEl) return;

  audioEl.loop = true;
  audioEl.preload = "auto";

  if(cfg.musicDataUrl){
    if(audioEl.src !== cfg.musicDataUrl){
      audioEl.src = cfg.musicDataUrl;
    }
  }else{
    audioEl.removeAttribute("src");
  }
}

// =====================
// Savings Data (存錢)
// =====================
export function loadData(){
  const raw = localStorage.getItem(SAVE_KEY);
  if(!raw) return { rules:{}, records:{} };

  const obj = safeJSON(raw, { rules:{}, records:{} }) || { rules:{}, records:{} };
  if(!obj.rules) obj.rules = {};
  if(!obj.records) obj.records = {};
  return obj;
}

export function saveData(obj){
  try{
    localStorage.setItem(SAVE_KEY, JSON.stringify(obj || {rules:{},records:{}}));
  }catch(e){
    alert("存錢資料儲存失敗：可能容量滿了（背景/貼紙/音樂過大）。");
    throw e;
  }
}

// =====================
// KPI helpers (首頁用)
// =====================
export function monthSum(dataObj, year, month0){
  const data = dataObj || loadData();
  const prefix = `${year}-${pad(month0+1)}-`;
  let sum = 0;

  for(const k of Object.keys(data.records || {})){
    if(!k.startsWith(prefix)) continue;
    const arr = data.records[k] || [];
    for(const r of arr){
      sum += Number(r.amount) || 0;
    }
  }
  return sum;
}

export function computeStreak(dataObj){
  const data = dataObj || loadData();
  const records = data.records || {};
  let d = new Date();
  let streak = 0;

  while(true){
    const key = ymd(d);
    const arr = records[key] || [];
    const has = arr.some(r => (Number(r.amount)||0) > 0);
    if(!has) break;
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// =====================
// Reward image picker (calendar 用)
// =====================
export async function pickRewardImage(){
  const REWARD_KEY = "oshi_reward_assets_v1";
  const rewardArr = safeJSON(localStorage.getItem(REWARD_KEY), null);
  if(Array.isArray(rewardArr) && rewardArr.length){
    const i = Math.floor(Math.random() * rewardArr.length);
    return rewardArr[i] || "";
  }

  const ASSET_KEY = "oshi_deco_assets_v1";
  const assets = safeJSON(localStorage.getItem(ASSET_KEY), []);
  if(Array.isArray(assets) && assets.length){
    const i = Math.floor(Math.random() * assets.length);
    return assets[i] || "";
  }
  return "";
}

// =====================
// Storage quota helpers (settings/setup 顯示容量剩餘)
// =====================
export async function getStorageEstimate(){
  try{
    if(navigator.storage && navigator.storage.estimate){
      const est = await navigator.storage.estimate();
      return {
        supported: true,
        usageBytes: Number(est.usage || 0),
        quotaBytes: Number(est.quota || 0),
      };
    }
  }catch(e){}
  return { supported: false, usageBytes: 0, quotaBytes: 0 };
}

export function bytesFromLocalStorageKeys(keys){
  let bytes = 0;
  try{
    for(const k of (keys || [])){
      const v = localStorage.getItem(k) || "";
      bytes += (k.length + v.length) * 2;
    }
  }catch(e){}
  return bytes;
}

export function formatBytes(bytes){
  const b = Number(bytes || 0);
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}
