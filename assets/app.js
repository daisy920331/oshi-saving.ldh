// assets/app.js
// ==========================================================
// LDH 追星存錢手帳 - 共用工具
// 目的：
// 1) 提供所有頁面需要的 export（避免月曆/首頁整個 JS 掛掉）
// 2) 支援「背景庫可上傳多張」+ 首頁/各頁背景套用
// ==========================================================

// ===== Keys =====
export const CONFIG_KEY = "oshi_config_v1";
const UI_KEY = "oshi_ui_v1";

// 新增：自訂背景庫（多張）
const BG_LIBRARY_KEY = "oshi_bg_library_v1"; // array of {id,name,dataUrl,addedAt}

// 存錢資料：為了相容舊版本，讀取時會嘗試多個 key
const SAVE_DATA_KEY_PRIMARY = "oshi_savings_v1";
const SAVE_DATA_KEY_CANDIDATES = [
  SAVE_DATA_KEY_PRIMARY,
  "oshi_data_v1",
  "oshi_saving_v1",
  "oshi_save_v1",
  "oshi_money_v1",
];

export const DEFAULT_CATS = ["SHOKICHI", "AKIRA", "團體"];
export const CATS = DEFAULT_CATS; // 供部分頁面直接使用（實際以設定 cats 為準）

// ===== Config =====
export function getConfig(){
  try{
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    return null;
  }
}

export function saveConfig(cfg){
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg || {}));
}

export function ensureConfig(){
  let cfg = getConfig();
  if(!cfg){
    cfg = {
      setupDone:false,
      ownerName:"",
      siteTitle:"",
      cats: DEFAULT_CATS.slice(),
      themeMap:{},
      backgroundUrl:"",
      musicDataUrl:"",
    };
    saveConfig(cfg);
  }
  // 防呆：避免缺欄位
  cfg.cats = Array.isArray(cfg.cats) && cfg.cats.length ? cfg.cats : DEFAULT_CATS.slice();
  cfg.themeMap = cfg.themeMap && typeof cfg.themeMap === "object" ? cfg.themeMap : {};
  cfg.backgroundUrl = cfg.backgroundUrl || "";
  cfg.musicDataUrl = cfg.musicDataUrl || "";
  return cfg;
}

export function getSiteTitle(){
  const cfg = ensureConfig();
  return (cfg.siteTitle || "").trim() || "LDH追星存錢手帳";
}

export function guardSetup(){
  const cfg = ensureConfig();
  const path = (location.pathname || "").toLowerCase();
  const isSetupPage = path.endsWith("/setup.html") || path.endsWith("setup.html");
  if(!cfg.setupDone && !isSetupPage){
    // 用 replace 避免返回鍵回到壞狀態
    location.replace("setup.html");
  }
}

// ===== UI prefs (背景切換/透明度/音量) =====
export function getUI(){
  try{
    const raw = localStorage.getItem(UI_KEY);
    const ui = raw ? JSON.parse(raw) : {};
    return ui && typeof ui === "object" ? ui : {};
  }catch{
    return {};
  }
}

export function saveUI(ui){
  localStorage.setItem(UI_KEY, JSON.stringify(ui || {}));
}

// ===== Built-in backgrounds =====
export function getBuiltInBackgrounds(){
  // 專案內建背景（可自行加檔名）
  return [
    "assets/backgrounds/default.jpg",
    "assets/backgrounds/planner1.jpg",
    "assets/backgrounds/planner2.jpg",
    "assets/backgrounds/planner3.jpg",
  ];
}

// ===== Custom background library =====
export function getCustomBackgrounds(){
  try{
    const raw = localStorage.getItem(BG_LIBRARY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  }catch(e){
    return [];
  }
}

function saveCustomBackgrounds(arr){
  localStorage.setItem(BG_LIBRARY_KEY, JSON.stringify(arr || []));
}

function uid(){
  return "bg_" + Math.random().toString(36).slice(2,10) + "_" + Date.now().toString(36);
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
      addedAt: Date.now(),
    });
  }
  saveCustomBackgrounds(current);
  return current;
}

export function deleteCustomBackground(id){
  const current = getCustomBackgrounds();
  const next = current.filter(x => x.id !== id);
  saveCustomBackgrounds(next);
  return next;
}

export function renameCustomBackground(id, newName){
  const current = getCustomBackgrounds();
  const item = current.find(x => x.id === id);
  if(item) item.name = (newName || "").trim() || item.name;
  saveCustomBackgrounds(current);
  return current;
}

export function getAllBackgroundOptions(){
  const builtIn = getBuiltInBackgrounds().map(u => ({ type:"builtIn", value:u, label:u }));
  const custom = getCustomBackgrounds().map(x => ({
    type:"custom",
    value:x.dataUrl,
    label:`🖼️ ${x.name}`,
    id:x.id,
  }));
  // 讓你上傳的在最上面
  return [...custom, ...builtIn];
}

function clampIndex(i, len){
  if(!len) return 0;
  const n = ((Number(i)||0) % len + len) % len;
  return n;
}

/**
 * 套用背景（所有頁面共用）
 * - theme: "home" | "planner" ...（用於分頁記住索引）
 * - 背景來源優先順序：
 *   1) 若 cfg.backgroundUrl 有值：用它
 *   2) 否則用 ui 的索引（bgIndexHome / bgIndexPlanner ...）
 * - 不論來源，最後會把選到的背景寫回 cfg.backgroundUrl，確保各頁一致
 */
export async function applyBackground(theme="planner"){
  const cfg = ensureConfig();
  const ui = getUI();

  const options = getAllBackgroundOptions();
  const key = theme === "home" ? "bgIndexHome" : "bgIndexPlanner";

  // 若有 cfg.backgroundUrl，優先用它；沒有才用索引
  let pickedUrl = (cfg.backgroundUrl || "").trim();
  if(!pickedUrl){
    const idx = clampIndex(ui[key] ?? 0, options.length);
    pickedUrl = options[idx]?.value || "";
  }else{
    // 如果 ui[key] 還沒設定，讓它對齊目前 cfg.backgroundUrl（避免第一次點上一張/下一張跳很怪）
    if(ui[key] === undefined || ui[key] === null){
      const i = options.findIndex(o => o.value === pickedUrl);
      ui[key] = i >= 0 ? i : 0;
      saveUI(ui);
    }
  }

  // 透明度
  const opacity = typeof ui.bgOpacity === "number" ? ui.bgOpacity : 0.25;

  // 用 CSS 變數（對應 app.css 的 .bg-wrap::before）
  const root = document.documentElement;
  root.style.setProperty("--bg-image", pickedUrl ? `url(\"${pickedUrl}\")` : "none");
  root.style.setProperty("--bg-opacity", String(opacity));

  // 也順手寫到 cfg.backgroundUrl，讓不同頁面一致
  if(pickedUrl && pickedUrl !== cfg.backgroundUrl){
    cfg.backgroundUrl = pickedUrl;
    saveConfig(cfg);
  }
}

// ===== Music =====
export async function setupBGM(audioEl){
  if(!audioEl) return;
  const cfg = ensureConfig();
  const ui = getUI();

  const src = (cfg.musicDataUrl || "").trim();
  if(!src){
    audioEl.removeAttribute("src");
    audioEl.load?.();
    return;
  }
  if(audioEl.src !== src) audioEl.src = src;
  audioEl.loop = true;

  const vol = typeof ui.musicVolume === "number" ? ui.musicVolume : 0.6;
  audioEl.volume = Math.min(1, Math.max(0, vol));
}

// ===== Category theme (設定頁用) =====
export function getCatTheme(name){
  const s = String(name || "").toLowerCase();
  if(s.includes("shokichi")) return { bg:"#ffefe8", fg:"#7a2b18", border:"#ffb7a0", tape:"#ff7b52" };
  if(s.includes("akira")) return { bg:"#f1f0ee", fg:"#141414", border:"#c9b06a", tape:"#c9b06a" };
  if(s.includes("團體") || s.includes("group")) return { bg:"#ecf5ef", fg:"#17422a", border:"#83b69a", tape:"#2e7d52" };
  return { bg:"#f5f5f5", fg:"#111111", border:"#cccccc", tape:"#cccccc" };
}

// ===== Date helpers =====
export function pad(n){
  return String(n).padStart(2, "0");
}

export function ymd(d){
  const dt = (d instanceof Date) ? d : new Date(d);
  return `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
}

export function ymLabel(y, m){
  // m: 0-11
  return `${y}-${pad(m+1)}`;
}

// ===== Save (存錢) data storage =====
function tryParseJSON(raw, fallback){
  if(!raw) return fallback;
  try{ return JSON.parse(raw); }catch{ return fallback; }
}

function pickExistingSaveKey(){
  for(const k of SAVE_DATA_KEY_CANDIDATES){
    const raw = localStorage.getItem(k);
    if(!raw) continue;
    const obj = tryParseJSON(raw, null);
    if(obj && typeof obj === "object" && obj.records && typeof obj.records === "object"){
      return k;
    }
  }
  return SAVE_DATA_KEY_PRIMARY;
}

export function loadData(){
  const key = pickExistingSaveKey();
  const raw = localStorage.getItem(key);
  const obj = tryParseJSON(raw, null);
  const data = (obj && typeof obj === "object") ? obj : { records:{}, rules:{} };
  data.records = data.records && typeof data.records === "object" ? data.records : {};
  data.rules = data.rules && typeof data.rules === "object" ? data.rules : {};
  data._keyUsed = key;
  return data;
}

export function saveData(data){
  const d = data && typeof data === "object" ? data : { records:{}, rules:{} };
  const key = d._keyUsed || pickExistingSaveKey() || SAVE_DATA_KEY_PRIMARY;
  // 儲存到目前使用 key
  localStorage.setItem(key, JSON.stringify({ records:d.records||{}, rules:d.rules||{} }));
  // 同步寫到 primary（保證後續版本固定讀得到）
  if(key !== SAVE_DATA_KEY_PRIMARY){
    localStorage.setItem(SAVE_DATA_KEY_PRIMARY, JSON.stringify({ records:d.records||{}, rules:d.rules||{} }));
  }
}

export function monthSum(data, y, m, catFilter=""){
  // catFilter: ""=全部；或 "Shokichi" / "Akira" / "GROUP"（events 也用到）
  const prefix = `${y}-${pad(m+1)}-`;
  let s = 0;
  const recs = (data && data.records) ? data.records : {};
  for(const [dateKey, arr] of Object.entries(recs)){
    if(!dateKey.startsWith(prefix)) continue;
    for(const r of (arr||[])){
      const cat = r.cat || "";
      if(catFilter){
        if(catFilter === "GROUP"){
          if(cat.includes("Shokichi") || cat.includes("Akira")) continue;
        }else if(!cat.includes(catFilter)){
          continue;
        }
      }
      s += Number(r.amount)||0;
    }
  }
  return s;
}

export function computeStreak(data, todayKey, catFilter=""){
  // 從 todayKey 往回算連續有紀錄的天數
  const recs = (data && data.records) ? data.records : {};
  let streak = 0;
  let cur = new Date(todayKey + "T00:00:00");
  while(true){
    const key = ymd(cur);
    const arr = recs[key] || [];
    const ok = (arr||[]).some(r=>{
      const cat = r.cat || "";
      if(!catFilter) return true;
      if(catFilter === "GROUP") return !(cat.includes("Shokichi") || cat.includes("Akira"));
      return cat.includes(catFilter);
    });
    if(!ok) break;
    streak += 1;
    cur.setDate(cur.getDate()-1);
  }
  return streak;
}

// ===== Reward image =====
export async function pickRewardImage(){
  // 目前專案的 reward 資料夾沒有實際檔案，避免回傳不存在路徑造成破圖。
  // 你若之後要加 reward 圖，可在這裡改成隨機挑選 dataUrl/檔案。
  return "";
}

// ===== Storage / Quota helpers =====
export async function getStorageEstimate(){
  try{
    if (navigator.storage && navigator.storage.estimate){
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
      bytes += (k.length + v.length) * 2; // UTF-16 近似
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
