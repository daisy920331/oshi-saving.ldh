/* =========================================================
   LDH 追星存錢手帳 - app.js（完整版）
   ---------------------------------------------------------
   - 統一設定讀寫
   - 背景（內建 + 自訂背景庫，多張留存）
   - 修正背景顯示（對應 .bg-wrap::before + --bg-image）
   - 類別顏色主題
   - localStorage 容量估算（背景庫提示）
   ========================================================= */

/* =======================
   Storage Keys
   ======================= */
export const CONFIG_KEY = "oshi_config_v1";
export const BG_LIBRARY_KEY = "oshi_bg_library_v1";

/* =======================
   預設類別
   ======================= */
export const DEFAULT_CATS = ["SHOKICHI", "AKIRA", "團體"];

/* =======================
   Config helpers
   ======================= */
export function getConfig(){
  try{
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){
    console.warn("getConfig failed", e);
    return null;
  }
}

export function saveConfig(cfg){
  try{
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg || {}));
  }catch(e){
    alert("儲存失敗，可能是瀏覽器容量已滿，請刪除一些背景或音樂。");
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
  }
  return cfg;
}

/* =======================
   Backgrounds
   ======================= */

/* 內建背景（你 repo 裡實際存在的檔案） */
export function getBuiltInBackgrounds(){
  return [
    "assets/backgrounds/default.jpg",
    "assets/backgrounds/planner1.jpg",
    "assets/backgrounds/planner2.jpg",
    "assets/backgrounds/planner3.jpg"
  ];
}

/* ---------- 自訂背景庫 ---------- */
function uid(){
  return "bg_" + Math.random().toString(36).slice(2,10) + "_" + Date.now().toString(36);
}

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

  /* 自訂背景放最上面 */
  return [...custom, ...builtIn];
}

/* ---------- 套用背景（關鍵修正） ---------- */
export async function applyBackground(_theme="planner"){
  const cfg = ensureConfig();
  const url = cfg.backgroundUrl || getBuiltInBackgrounds()[0] || "";

  const bg = document.querySelector(".bg-wrap");
  if(!bg) return;

  /* ⚠️ 對應你的 CSS：.bg-wrap::before { background-image: var(--bg-image); } */
  const cssVal = url ? `url("${url}")` : "none";
  bg.style.setProperty("--bg-image", cssVal);

  /* 如果你之後想讓背景更明顯，可調這個（app.css 裡有用） */
  // bg.style.setProperty("--bg-opacity", ".35");
}

/* =======================
   Category theme helpers
   ======================= */
export function getCatTheme(name){
  const s = String(name || "").toLowerCase();

  /* 你之前指定的顏色邏輯 */
  if(s.includes("shokichi")){
    return { bg:"#ffefe8", fg:"#7a2b18", border:"#ffb7a0", tape:"#ff7b52" };
  }
  if(s.includes("akira")){
    return { bg:"#f1f0ee", fg:"#141414", border:"#c9b06a", tape:"#c9b06a" };
  }
  if(s.includes("團體") || s.includes("group")){
    return { bg:"#ecf5ef", fg:"#17422a", border:"#83b69a", tape:"#2e7d52" };
  }

  /* fallback */
  return { bg:"#f5f5f5", fg:"#111111", border:"#cccccc", tape:"#cccccc" };
}

/* =======================
   Storage quota helpers
   ======================= */
export async function getStorageEstimate(){
  try{
    if(navigator.storage && navigator.storage.estimate){
      const est = await navigator.storage.estimate();
      return {
        supported: true,
        usageBytes: Number(est.usage || 0),
        quotaBytes: Number(est.quota || 0)
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
      /* UTF-16 粗估 */
      bytes += (k.length + v.length) * 2;
    }
  }catch(e){}
  return bytes;
}

export function formatBytes(bytes){
  const b = Number(bytes || 0);
  if(b < 1024) return `${b} B`;
  const kb = b / 1024;
  if(kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if(mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}
