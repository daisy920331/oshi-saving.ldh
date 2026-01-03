// assets/app.js
// ====== Config ======
export const CONFIG_KEY = "oshi_config_v1";

// 新增：自訂背景庫（多張）
const BG_LIBRARY_KEY = "oshi_bg_library_v1"; // array of {id,name,dataUrl,addedAt}

export const DEFAULT_CATS = ["SHOKICHI", "AKIRA", "團體"];

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
  return cfg;
}

// ====== Backgrounds ======
export function getBuiltInBackgrounds(){
  // 你原本的內建背景清單（依你的專案資產調整）
  // 若你本來就有更多背景，直接在這裡加檔名即可
  return [
    "assets/backgrounds/default.jpg",
    "assets/backgrounds/planner1.jpg",
    "assets/backgrounds/planner2.jpg",
    "assets/backgrounds/planner3.jpg",
  ];
}

// === 新增：自訂背景庫 CRUD ===
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

export async function addCustomBackgroundFiles(fileList){
  const files = Array.from(fileList || []).filter(Boolean);
  if(!files.length) return getCustomBackgrounds();

  const current = getCustomBackgrounds();

  for(const f of files){
    // 只接受圖片
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
    id:x.id
  }));
  return [...custom, ...builtIn]; // 讓你上傳的在最上面
}

export async function applyBackground(_theme="planner"){
  const cfg = ensureConfig();
  const url = cfg.backgroundUrl || getBuiltInBackgrounds()[0] || "";
  const bg = document.querySelector(".bg-wrap");
  if(bg){
    bg.style.backgroundImage = url ? `url("${url}")` : "none";
    bg.style.backgroundSize = "cover";
    bg.style.backgroundPosition = "center";
    bg.style.backgroundRepeat = "no-repeat";
    bg.style.filter = "saturate(1.02)";
  }
}

// ====== Theme helpers (你原本用到的) ======
export function getCatTheme(name){
  // 預設顏色（你原本的分類色也可以放在這裡；保留簡單 fallback）
  const s = String(name || "").toLowerCase();
  if(s.includes("shokichi")) return { bg:"#ffefe8", fg:"#7a2b18", border:"#ffb7a0", tape:"#ff7b52" };
  if(s.includes("akira")) return { bg:"#f1f0ee", fg:"#141414", border:"#c9b06a", tape:"#c9b06a" };
  if(s.includes("團體") || s.includes("group")) return { bg:"#ecf5ef", fg:"#17422a", border:"#83b69a", tape:"#2e7d52" };
  return { bg:"#f5f5f5", fg:"#111111", border:"#cccccc", tape:"#cccccc" };
}

// ====== Utils ======
function readFileAsDataURL(file){
  return new Promise((resolve, reject)=>{
    const r = new FileReader();
    r.onload = ()=>resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
