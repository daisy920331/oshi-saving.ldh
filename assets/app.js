// assets/app.js
"use strict";

/** ===== Storage ===== */
const DATA_KEY = "oshi_site_data_v2";
const UI_KEY   = "oshi_site_ui_v3";
const REPO_KEY = "oshi_site_repo_v1";
const LISTS_KEY = "oshi_site_lists_cache_v1";

/** ===== Categories / rules ===== */
export const CATS = ["Shokichi（個人）","Akira（個人）","EXILE THE SECOND（團體）"];

export const DEFAULT_RULES = {
  "IG/X 更新（純文字）": 0,
  "IG/X 更新（有照片）": 0,
  "Blog 更新": 0,
  "影片更新（官方/他人）": 0,
  "影片更新（本人/自拍）": 0,
  "生放送/直播/現場資訊": 0,
  "節目出演/宣番": 0,
  "雜誌/網路專訪": 0,
  "忍住不買（成功）": 0,
  "衝動想買（先存錢冷靜）": 0,
};

export const BGM_DEFAULT_MODE = "first"; // "first" or "random"

/** ===== Helpers ===== */
export function pad(n){ return String(n).padStart(2,"0"); }
export function ymd(d){ return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
export function ymLabel(y,m){ return `${y} 年 ${m+1} 月`; }

/** ===== Data (records) ===== */
export function loadData(){
  const raw = localStorage.getItem(DATA_KEY);
  const fresh = { rules: {...DEFAULT_RULES}, records: {} };
  if(!raw) return fresh;
  try{
    const data = JSON.parse(raw);
    if(!data.rules || !data.records) return fresh;

    for(const k of Object.keys(DEFAULT_RULES)){
      if(!(k in data.rules)) data.rules[k] = DEFAULT_RULES[k];
    }
    for(const arr of Object.values(data.records)){
      if(!Array.isArray(arr)) continue;
      for(const r of arr){
        if(typeof r.rewardImg !== "string") r.rewardImg = "";
      }
    }
    return data;
  }catch{
    return fresh;
  }
}
export function saveData(data){
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function filterRecordsByCat(recordsArr, filterCat){
  if(!filterCat) return recordsArr;
  return recordsArr.filter(r => r.cat === filterCat);
}

export function daySum(data, dateKey, filterCat=""){
  const arr = data.records[dateKey] || [];
  const filtered = filterRecordsByCat(arr, filterCat);
  return filtered.reduce((s,x)=>s + (Number(x.amount)||0), 0);
}
export function monthSum(data, y, m, filterCat=""){
  const prefix = `${y}-${pad(m+1)}-`;
  let s = 0;
  for(const k of Object.keys(data.records)){
    if(k.startsWith(prefix)) s += daySum(data, k, filterCat);
  }
  return s;
}

/** ✅ 同一天貼紙：選「當天最大金額那筆」的 rewardImg */
export function daySticker(data, dateKey, filterCat=""){
  const arr = data.records[dateKey] || [];
  if(arr.length === 0) return "";
  const pool = filterRecordsByCat(arr, filterCat);
  const use = pool.length ? pool : arr;

  let best = null;
  for(const r of use){
    if(!r.rewardImg) continue;
    const amt = Number(r.amount)||0;
    if(!best || amt > (Number(best.amount)||0)) best = r;
  }
  if(!best){
    best = use.find(r => r.rewardImg) || null;
  }
  return best?.rewardImg || "";
}

export function sumByEvent(data, filterCat=""){
  const map = new Map();
  for(const arr of Object.values(data.records)){
    for(const r of filterRecordsByCat(arr, filterCat)){
      map.set(r.event, (map.get(r.event)||0) + (Number(r.amount)||0));
    }
  }
  return map;
}
export function sumByDateForEvent(data, eventName, filterCat=""){
  const map = new Map();
  for(const [date, arr] of Object.entries(data.records)){
    let s = 0;
    for(const r of filterRecordsByCat(arr, filterCat)){
      if(r.event === eventName) s += (Number(r.amount)||0);
    }
    if(s>0) map.set(date, s);
  }
  return [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
}

export function computeStreak(data, todayKey, filterCat=""){
  let streak = 0;
  const [Y,M,D] = todayKey.split("-").map(Number);
  let cur = new Date(Y, M-1, D);
  while(true){
    const key = ymd(cur);
    const sum = daySum(data, key, filterCat);
    if(sum > 0){
      streak += 1;
      cur.setDate(cur.getDate() - 1);
    }else break;
  }
  return streak;
}

/** ===== UI (background/music) ===== */
export function getUI(){
  const def = { bgOpacity: 0.55, musicOn: false, musicMode: BGM_DEFAULT_MODE, bgIndexHome: 0, bgIndexPlanner: 0 };
  const raw = localStorage.getItem(UI_KEY);
  if(!raw) return def;
  try{ return { ...def, ...JSON.parse(raw) }; }catch{ return def; }
}
export function saveUI(ui){ localStorage.setItem(UI_KEY, JSON.stringify(ui)); }

/** ===== Repo config (set once in settings.html) ===== */
export function setRepoConfig({owner, repo, branch="main"}){
  localStorage.setItem(REPO_KEY, JSON.stringify({owner, repo, branch}));
}
export function getRepoConfig(){
  const raw = localStorage.getItem(REPO_KEY);
  if(!raw) return {owner:"", repo:"", branch:"main"};
  try{
    const x = JSON.parse(raw);
    return { owner: x.owner||"", repo: x.repo||"", branch: x.branch||"main" };
  }catch{
    return {owner:"", repo:"", branch:"main"};
  }
}

/** ===== GitHub API: list directory contents =====
 * Requires repo to be public (unauth rate limit ~60 req/hr)
 */
async function ghList(path){
  const {owner, repo, branch} = getRepoConfig();
  if(!owner || !repo) return [];
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: { "Accept": "application/vnd.github+json" } });
  if(!res.ok) throw new Error(`GitHub API error ${res.status}`);
  const json = await res.json();
  if(!Array.isArray(json)) return [];
  return json.filter(x => x.type === "file").map(x => x.path);
}

function toRawUrl(path){
  const {owner, repo, branch} = getRepoConfig();
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

function isImage(name){
  return /\.(png|jpg|jpeg|webp|gif)$/i.test(name);
}
function isAudio(name){
  return /\.(mp3|wav|m4a|ogg)$/i.test(name);
}

function loadListsCache(){
  const raw = localStorage.getItem(LISTS_KEY);
  if(!raw) return { ts: 0, reward:[], home:[], planner:[], music:[] };
  try{
    const x = JSON.parse(raw);
    return { ts: x.ts||0, reward:x.reward||[], home:x.home||[], planner:x.planner||[], music:x.music||[] };
  }catch{
    return { ts: 0, reward:[], home:[], planner:[], music:[] };
  }
}
function saveListsCache(obj){
  localStorage.setItem(LISTS_KEY, JSON.stringify(obj));
}

/** call this from settings.html */
export async function refreshRemoteAssetLists(){
  const now = Date.now();

  const rewardPaths  = await ghList("assets/images/reward");
  const homePaths    = await ghList("assets/images/home");
  const plannerPaths = await ghList("assets/images/planner");
  const musicPaths   = await ghList("assets/music");

  const reward = rewardPaths.filter(p=>isImage(p)).map(toRawUrl);
  const home = homePaths.filter(p=>isImage(p)).map(toRawUrl);
  const planner = plannerPaths.filter(p=>isImage(p)).map(toRawUrl);
  const music = musicPaths.filter(p=>isAudio(p)).map(toRawUrl);

  saveListsCache({ ts: now, reward, home, planner, music });
}

/** Get lists (use cache; auto-refresh if older than 6 hours) */
export async function getAssetLists(){
  const cache = loadListsCache();
  const age = Date.now() - (cache.ts||0);
  if((cache.ts||0) === 0 || age > 6*60*60*1000){
    try{
      await refreshRemoteAssetLists();
      return loadListsCache();
    }catch{
      return cache;
    }
  }
  return cache;
}

/** Pick reward image from remote list */
export async function pickRewardImage(){
  const lists = await getAssetLists();
  if(!lists.reward.length) return "";
  return lists.reward[Math.floor(Math.random()*lists.reward.length)];
}

/** Background apply */
export async function applyBackground(pageType /* "home" | "planner" */){
  const ui = getUI();
  const lists = await getAssetLists();

  const homeList = lists.home.length ? lists.home : [];
  const plannerList = lists.planner.length ? lists.planner : [];

  const url = (pageType === "home")
    ? (homeList[ui.bgIndexHome % Math.max(1, homeList.length)] || "")
    : (plannerList[ui.bgIndexPlanner % Math.max(1, plannerList.length)] || "");

  document.documentElement.style.setProperty("--bg-image", url ? `url("${url}")` : "none");
  document.documentElement.style.setProperty("--bg-opacity", String(ui.bgOpacity ?? 0.55));
}

/** Music setup: choose from remote list */
export async function setupBGM(audioEl){
  if(!audioEl) return;
  const ui = getUI();
  const lists = await getAssetLists();
  if(!lists.music.length){
    audioEl.style.display = "none";
    return;
  }
  let src = lists.music[0];
  if(ui.musicMode === "random"){
    src = lists.music[Math.floor(Math.random()*lists.music.length)];
  }
  audioEl.src = src;
  audioEl.loop = true;
  audioEl.preload = "metadata";
}
