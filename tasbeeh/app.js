
 const ring = document.getElementById("ring");
 const undo = document.getElementById("undoBtn");
 const reset = document.getElementById("resetBtn");

ring.addEventListener("click", increment);
undo.addEventListener("click", decrement);
reset.addEventListener("click", resetCounter);



const dhikrBtn1 = document.getElementById("dhikrBtn1");
const dhikrBtn2 = document.getElementById("dhikrBtn2");
const dhikrBtn3 = document.getElementById("dhikrBtn3");

dhikrBtn1.addEventListener("click", () => selectDhikr(0, dhikrBtn1));
dhikrBtn2.addEventListener("click", () => selectDhikr(1, dhikrBtn2));
dhikrBtn3.addEventListener("click", () => selectDhikr(2, dhikrBtn3));

const dhikrs = [
  { ar: 'سُبْحَانَ اللهِ', en: 'Glory be to Allah', target: 33 },
  { ar: 'الْحَمْدُ لِلَّهِ', en: 'Praise be to Allah', target: 33 },
  { ar: 'اللهُ أَكْبَرُ', en: 'Allah is Greatest', target: 34 },
];


let stats = {
  0: { count: 0, completedSets: 0 },
  1: { count: 0, completedSets: 0 },
  2: { count: 0, completedSets: 0 }
};

let globalStats = {
  totalToday: 0
};

let currentDhikr = parseInt(localStorage.getItem("currentDhikr") || "0");

/* ───────── SAVE ───────── */
function save() {
  localStorage.setItem("stats", JSON.stringify(stats));
  localStorage.setItem("globalStats", JSON.stringify(globalStats));
  localStorage.setItem("currentDhikr", currentDhikr);
}

/* ───────── DAILY RESET ───────── */
function checkDailyReset() {
  const now = Date.now();
  const last = parseInt(localStorage.getItem("lastReset") || "0");

  if (now - last >= 24 * 60 * 60 * 1000) {
    stats = {
      0: { count: 0, completedSets: 0 },
      1: { count: 0, completedSets: 0 },
      2: { count: 0, completedSets: 0 }
    };

    globalStats.totalToday = 0;

    localStorage.setItem("lastReset", now.toString());
    save();
  }
}

/* ───────── INCREMENT ───────── */
function increment() {
  const s = stats[currentDhikr];
  const t = dhikrs[currentDhikr].target;

  s.count++;
  globalStats.totalToday++;

  if (s.count === t) {
    s.completedSets++;
    s.count = 0; // reset after full set
  }

  save();
  updateUI();
}

/* ───────── DECREMENT ───────── */
function decrement() {
  const s = stats[currentDhikr];

  if (s.count > 0) {
    s.count--;
    globalStats.totalToday--;
  }

  save();
  updateUI();
}

/* ───────── SWITCH DHIKR ───────── */
function selectDhikr(idx, btn) {
  currentDhikr = idx;

  document.querySelectorAll(".d-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  document.getElementById("dhikr-ar").textContent = dhikrs[idx].ar;
  document.getElementById("dhikr-en").textContent = dhikrs[idx].en;

  updateUI(); 
  save();
}

/* ───────── RESET CURRENT ───────── */
function resetCounter() {
  stats[currentDhikr].count = 0;
  save();
  updateUI();
}

/* ───────── UI ───────── */
function updateUI() {
  const s = stats[currentDhikr];
  const t = dhikrs[currentDhikr].target;

  document.getElementById("counter").textContent = s.count;
  document.getElementById("prog-lbl").textContent = `${s.count} / ${t}`;
  document.getElementById("prog-fill").style.width = (s.count / t) * 100 + "%";

  document.getElementById("total-el").textContent = globalStats.totalToday;
  document.getElementById("sets-el").textContent = s.completedSets;
}

/* ───────── INIT LOAD ───────── */
stats = JSON.parse(localStorage.getItem("stats")) || stats;
globalStats = JSON.parse(localStorage.getItem("globalStats")) || globalStats;

checkDailyReset();
updateUI();