// --- 1. INVENTORY ---
const inventory = {
    glassware: [
        { id: 'beaker', name: 'Beaker', type: 'container', shape: 'beaker', iconClass: 'icon-beaker' },
        { id: 'flask', name: 'Flask', type: 'container', shape: 'flask', iconClass: 'icon-flask' },
        { id: 'testtube', name: 'Test Tube', type: 'container', shape: 'testtube', iconClass: 'icon-testtube' },
        { id: 'dish', name: 'Evap. Dish', type: 'container', shape: 'dish', iconClass: 'icon-dish' }
    ],
    hardware: [
        { id: 'burner', name: 'Bunsen Burner', type: 'heater', iconClass: 'icon-burner' },
        { id: 'tongs', name: 'Tongs', type: 'container', shape: 'tongs', iconClass: 'icon-tongs' }
    ],
    chemicals: [
        { id: 'hcl', name: 'Acid: HCl', type: 'liquid', color: '#ff6b6b', iconClass: 'icon-bottle' },
        { id: 'naoh', name: 'Base: NaOH', type: 'liquid', color: '#48dbfb', iconClass: 'icon-bottle' },
        { id: 'agno3', name: 'Silver Nitrate', type: 'liquid', color: '#c8d6e5', iconClass: 'icon-bottle' },
        { id: 'nacl', name: 'Sodium Chloride', type: 'liquid', color: '#dfe6e9', iconClass: 'icon-bottle' },
        { id: 'water', name: 'Water', type: 'liquid', color: '#dff9fb', iconClass: 'icon-bottle' }
    ],
    solids: [
        { id: 'magnesium', name: 'Mg Ribbon', type: 'solid', iconClass: 'icon-ribbon' }
    ]
};

// --- 2. MISSIONS ---
const missions = [
    { title: "Protocol 01: Neutralization", desc: "Synthesize NaCl (Salt Water).", steps: ["1. Place Beaker.", "2. Add HCl.", "3. Add NaOH.", "4. Result: Clear Solution."], check: (items) => Object.values(items).some(i => i.contents.includes('hcl') && i.contents.includes('naoh')) ? " Sodium Chloride (NaCl)" : null },
    { title: "Protocol 02: Phase Change", desc: "Boil Water to 100°C.", steps: ["1. Place Flask + Water.", "2. Heat to 100°C.", "3. Observe Steam."], check: (items) => Object.values(items).some(i => i.contents.includes('water') && i.temp >= 100) ? " Steam (H2O)" : null },
    { title: "Protocol 03: Combustion", desc: "Burn Magnesium using Tongs.", steps: ["1. Drag Mg onto Tongs.", "2. Heat Tongs tip over flame.", "3. Drop Ash in Dish.", "WARNING: Dropping ash on floor fails experiment."], check: (items) => { const dish = Object.values(items).find(i => i.shape === 'dish'); return (dish && dish.contents.includes('mgo_ash')) ? " Magnesium Oxide (MgO) Ash" : null; } },
    { title: "Protocol 04: Precipitation", desc: "Create Silver Chloride.", steps: ["1. Mix AgNO3 + NaCl."], check: (items) => Object.values(items).some(i => i.contents.includes('agcl')) ? " Silver Chloride (AgCl)" : null }
];

let currentMissionIndex = null;
let itemsOnBench = {};
let draggedSidebarItem = null;
let isLabPaused = false;
let missionActive = false;
let missionStartTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Theme immediate apply
    const savedTheme = localStorage.getItem('syntheraTheme');
    if (savedTheme && savedTheme !== 'dark') {
        document.body.classList.add(savedTheme);
    }
    renderSidebar();
    openMissionSelect();
    document.addEventListener('mouseup', stopSmoothDrag);
    document.addEventListener('mousemove', updateSmoothDrag);
});

// LOGGING FUNCTION
function logAction(message) {
    const logBox = document.getElementById('live-log');
    if (logBox) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        entry.innerHTML = `<span>[${time}]</span> ${message}`;
        logBox.prepend(entry);
    }
}

function openMissionSelect() {
    isLabPaused = true;
    document.getElementById('lab-interface').className = 'interface-blur';
    document.getElementById('mission-select-modal').classList.remove('hidden');
    document.getElementById('mission-overlay').classList.add('hidden');
    const grid = document.getElementById('mission-grid');
    grid.innerHTML = '';
    missions.forEach((m, idx) => {
        const card = document.createElement('div');
        card.className = 'mission-card';
        card.innerHTML = `<h4>${m.title}</h4><p>${m.desc}</p>`;

        card.onclick = (e) => {
            currentMissionIndex = idx;
            document.getElementById('mission-select-modal').classList.add('hidden');
            startMission();
        };
        grid.appendChild(card);
    });
}

function loadMissionData(index) {
    currentMissionIndex = index;
    const m = missions[index];
    document.getElementById('briefing-title').innerText = m.title;
    document.getElementById('briefing-desc').innerText = m.desc;
    const ul = document.getElementById('briefing-steps');
    ul.innerHTML = '';
    m.steps.forEach(s => ul.innerHTML += `<li>${s}</li>`);
}

function startMission() {
    document.getElementById('mission-overlay').classList.add('hidden');
    document.getElementById('mission-select-modal').classList.add('hidden');
    document.getElementById('error-modal').classList.add('hidden');
    document.getElementById('success-modal').classList.add('hidden');
    document.getElementById('lab-interface').className = 'active-lab';
    resetBench();
    isLabPaused = false;
    missionActive = true;
    missionStartTime = Date.now();

    if (currentMissionIndex !== null) {
        logAction(`Started: ${missions[currentMissionIndex].title}`);
    }
}

function endExperiment() {
    if (confirm("End current experiment?")) {
        stayInSandbox();
        logAction("Experiment Ended by User.");
    }
}

function closeMissionSelect() {
    document.getElementById('mission-select-modal').classList.add('hidden');
    document.getElementById('lab-interface').className = 'active-lab';
    isLabPaused = false;
}

function stayInSandbox() {
    document.getElementById('success-modal').classList.add('hidden');
    document.getElementById('lab-interface').className = 'active-lab';
    isLabPaused = false;
    missionActive = false;
    currentMissionIndex = null;
}

function toggleMissionOverlay() {
    if (currentMissionIndex === null && !missionActive) {
        openMissionSelect();
        return;
    }
    const overlay = document.getElementById('mission-overlay');
    if (overlay.classList.contains('hidden')) {
        loadMissionData(currentMissionIndex);
        overlay.classList.remove('hidden');
        document.getElementById('lab-interface').className = 'interface-blur';
        isLabPaused = true;
    } else {
        overlay.classList.add('hidden');
        document.getElementById('lab-interface').className = 'active-lab';
        isLabPaused = false;
    }
}

function resetBench() {
    itemsOnBench = {};
    document.getElementById('bench').innerHTML = `<div class="bench-label">BENCH 01</div><div class="trash-zone"><i class="fa-solid fa-trash-can"></i></div>`;
    document.getElementById('live-log').innerHTML = '';
    document.querySelectorAll('.ash-mess').forEach(e => e.remove());
}

function renderSidebar() {
    const render = (id, list) => {
        const box = document.getElementById(id);
        if (!box) return;
        box.innerHTML = '';
        list.forEach(i => {
            const el = document.createElement('div');
            el.className = 'tool-item';
            el.draggable = true;
            el.innerHTML = `<div class="sidebar-icon ${i.iconClass}"></div><span>${i.name}</span>`;
            el.addEventListener('dragstart', (e) => {
                draggedSidebarItem = i;
                e.dataTransfer.effectAllowed = "copy";
            });
            box.appendChild(el);
        });
    };
    render('list-glassware', inventory.glassware);
    render('list-hardware', inventory.hardware);
    render('list-chemicals', inventory.chemicals);
    render('list-solids', inventory.solids);
}

function allowDrop(e) { e.preventDefault(); }

function drop(e) {
    e.preventDefault();
    if (isLabPaused) return;
    const rect = document.getElementById('bench').getBoundingClientRect();
    let x = e.clientX - rect.left - 60;
    let y = e.clientY - rect.top - 60;
    if (x < 0) x = 10;
    if (y < 0) y = 10;
    if (x > rect.width - 100) x = rect.width - 100;
    if (y > rect.height - 100) y = rect.height - 100;
    if (draggedSidebarItem) {
        const target = e.target.closest('.lab-item');
        if (target && itemsOnBench[target.id].type === 'container') {
            if (draggedSidebarItem.type === 'liquid') fillLiquid(target.id, draggedSidebarItem);
            else if (draggedSidebarItem.type === 'solid') fillSolid(target.id, draggedSidebarItem);
            draggedSidebarItem = null;
            return;
        }
        if (draggedSidebarItem.type !== 'liquid' && draggedSidebarItem.type !== 'solid') createItem(draggedSidebarItem, x, y);
        draggedSidebarItem = null;
    }
}

function createItem(data, x, y) {
    const uid = 'obj-' + Date.now();
    const el = document.createElement('div');
    el.id = uid;
    el.draggable = false;
    el.ondragstart = function() { return false; };
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    logAction(`Placed ${data.name} on bench.`);

    if (data.type === 'container') {
        el.className = `lab-item ${data.shape}`;
        if (data.shape === 'tongs') el.innerHTML = `<div class="tongs-handles"></div><div class="tongs-pivot"></div><div class="tongs-body"><div class="tongs-arm-top"></div><div class="tongs-arm-bottom"></div></div><div class="tongs-tips"></div><div class="solid-holder"></div>`;
        else el.innerHTML = `<div class="liquid"></div>`;
        itemsOnBench[uid] = {...data, contents: [], temp: 20, volume: 0 };
    } else if (data.type === 'heater') {
        el.className = `lab-item heater active`;
        el.innerHTML = `<div class="heater-base"></div><div class="heater-tube"></div><div class="flame"></div>`;
        itemsOnBench[uid] = {...data, temp: 500 };
    } else {
        el.className = 'lab-item';
        el.innerHTML = `<i class="fa-solid ${data.icon || 'fa-tool'}"></i>`;
        itemsOnBench[uid] = {...data };
    }
    el.addEventListener('mousedown', startSmoothDrag);
    document.getElementById('bench').appendChild(el);
}

let activeDragEl = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function startSmoothDrag(e) {
    if (isLabPaused) return;
    // CRITICAL FIX: PREVENT DEFAULT TO STOP TEXT SELECTION HIGHLIGHTING
    e.preventDefault();

    activeDragEl = e.target.closest('.lab-item');
    if (!activeDragEl) return;
    const rect = activeDragEl.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    activeDragEl.classList.add('is-dragging');
    activeDragEl.style.zIndex = 1000;
}

function updateSmoothDrag(e) {
    if (!activeDragEl) return;
    e.preventDefault();
    const bench = document.getElementById('bench');
    const benchRect = bench.getBoundingClientRect();
    let newX = e.clientX - benchRect.left - dragOffsetX;
    let newY = e.clientY - benchRect.top - dragOffsetY;
    activeDragEl.style.left = `${newX}px`;
    activeDragEl.style.top = `${newY}px`;
}

function stopSmoothDrag(e) {
    if (!activeDragEl) return;
    activeDragEl.hidden = true;
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    activeDragEl.hidden = false;
    if (elemBelow) { const target = elemBelow.closest('.lab-item'); if (target && target.id !== activeDragEl.id) handleTransfer(activeDragEl.id, target.id); }
    const trash = document.querySelector('.trash-zone');
    const trashRect = trash.getBoundingClientRect();
    const itemRect = activeDragEl.getBoundingClientRect();
    if (itemRect.left < trashRect.right && itemRect.right > trashRect.left && itemRect.top < trashRect.bottom && itemRect.bottom > trashRect.top) {
        logAction(`Disposed ${itemsOnBench[activeDragEl.id].name}`);
        delete itemsOnBench[activeDragEl.id];
        activeDragEl.remove();
    }
    activeDragEl.classList.remove('is-dragging');
    activeDragEl.style.zIndex = '';
    activeDragEl = null;
}

function handleTransfer(sourceId, targetId) { const source = itemsOnBench[sourceId]; const target = itemsOnBench[targetId]; if (source && source.shape === 'tongs' && target && target.shape === 'dish' && source.contents.includes('mgo_ash')) dropAshGravity(sourceId); }

function dropAshGravity(tongsId) {
    const tongs = itemsOnBench[tongsId];
    if (!tongs) return;
    const tongsEl = document.getElementById(tongsId);
    tongs.contents = [];
    tongsEl.querySelector('.solid-holder').innerHTML = '';
    const rect = tongsEl.getBoundingClientRect();
    const fallingAsh = document.createElement('div');
    fallingAsh.className = 'falling-ash';
    const startX = rect.right - 10;
    const startY = rect.top + (rect.height / 2);
    fallingAsh.style.left = startX + 'px';
    fallingAsh.style.top = startY + 'px';
    document.body.appendChild(fallingAsh);
    setTimeout(() => {
        let caught = false;
        let catchDishId = null;
        for (let uid in itemsOnBench) {
            if (itemsOnBench[uid].shape === 'dish') {
                const dishRect = document.getElementById(uid).getBoundingClientRect();
                if (startX > dishRect.left && startX < dishRect.right && dishRect.top > startY) {
                    caught = true;
                    catchDishId = uid;
                    break;
                }
            }
        }
        fallingAsh.remove();
        if (caught) {
            const dish = itemsOnBench[catchDishId];
            if (!dish.contents.includes('mgo_ash')) {
                dish.contents.push('mgo_ash');
                document.getElementById(catchDishId).appendChild(document.createElement('div')).className = 'solid-ash';
                logAction("Ash collected in Evap Dish.");
            }
            if (missionActive && currentMissionIndex !== null) {
                if (currentMissionIndex !== 2) { triggerLabError(`Incorrect Procedure!`, 'critical'); return; }
                const res = missions[currentMissionIndex].check(itemsOnBench);
                if (res) triggerSuccess(res);
            }
        } else {
            const mess = document.createElement('div');
            mess.className = 'ash-mess';
            mess.style.left = (startX - 30) + 'px';
            mess.style.top = (startY + 250) + 'px';
            document.body.appendChild(mess);
            setTimeout(() => mess.remove(), 2000);
            triggerLabError("Ash Spilled on Workbench!", missionActive ? 'critical' : 'warning');
        }
    }, 600);
}

// FIX: Liquid Fill Logic & Animation
function fillLiquid(uid, liquid) {
    const item = itemsOnBench[uid];
    if (item.volume >= 100 || item.shape === 'tongs') return;

    item.contents.push(liquid.id);
    item.volume += 25;
    logAction(`Added ${liquid.name} to ${item.name}`);

    const el = document.getElementById(uid);
    const d = el.querySelector('.liquid');

    if (d) {
        d.style.height = `${item.volume}%`;
        d.style.backgroundColor = liquid.color;

        if (item.contents.includes('agno3') && item.contents.includes('nacl') && !item.contents.includes('agcl')) {
            item.contents.push('agcl');
            d.style.backgroundColor = '#ecf0f1';
            logAction("Reaction: Precipitate formed (AgCl)");
        }
    }
}

function fillSolid(uid, solid) {
    const item = itemsOnBench[uid];
    if (item.contents.length > 0) return;
    item.contents.push(solid.id);
    logAction(`Added ${solid.name} to ${item.name}`);

    const el = document.getElementById(uid);
    const sDiv = document.createElement('div');
    sDiv.className = 'solid-ribbon';
    if (item.shape === 'tongs') el.querySelector('.solid-holder').appendChild(sDiv);
    else el.appendChild(sDiv);
}

setInterval(() => {
    if (isLabPaused) return;
    if (!missionActive && currentMissionIndex !== null) return;

    for (let uid in itemsOnBench) {
        const item = itemsOnBench[uid];
        const el = document.getElementById(uid);
        if (item.type === 'container' && el) {
            if (isHeated(uid)) {
                item.temp += 2;
                el.style.zIndex = 50;
                el.classList.add('heating-active');
            } else {
                if (item.temp > 20) item.temp -= 0.5;
                if (!el.classList.contains('is-dragging')) el.style.zIndex = '';
                el.classList.remove('heating-active');
            }
            if (item.shape === 'tongs' && item.contents.includes('magnesium') && isHeated(uid)) {
                item.temp += 5;
                if (item.temp > 100 && !item.contents.includes('mgo_ash')) {
                    el.classList.add('sparking');
                    logAction("Reaction: Magnesium burning...");
                    setTimeout(() => {
                        el.classList.remove('sparking');
                        dropAshGravity(uid);
                    }, 1500);
                    item.contents.push('burning_active');
                }
            }
        }
    }
    if (missionActive && currentMissionIndex !== null) {
        const success = missions[currentMissionIndex].check(itemsOnBench);
        if (success) { triggerSuccess(success); return; }
        for (let i = 0; i < missions.length; i++) {
            if (i !== currentMissionIndex && i !== 2 && missions[i].check(itemsOnBench)) { triggerLabError(`Incorrect Procedure!`, 'critical'); return; }
        }
    }
}, 100);

// FIX: Expanded Heat Zone
function isHeated(uid) {
    const r1 = document.getElementById(uid).getBoundingClientRect();
    if (itemsOnBench[uid].shape === 'tongs') {
        const tipX = r1.right - 10;
        const tipY = r1.top + (r1.height / 2);
        for (let h in itemsOnBench) {
            if (itemsOnBench[h].type === 'heater') {
                const r2 = document.getElementById(h).getBoundingClientRect();
                if (tipX > r2.left - 40 && tipX < r2.right + 40 && tipY > r2.top - 250 && tipY < r2.bottom) return true;
            }
        }
    } else {
        for (let h in itemsOnBench) {
            if (itemsOnBench[h].type === 'heater') {
                const r2 = document.getElementById(h).getBoundingClientRect();
                if (!(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom)) return true;
            }
        }
    }
    return false;
}

function triggerSuccess(name) {
    missionActive = false;
    isLabPaused = true;
    const timeTaken = (Date.now() - missionStartTime) / 1000;
    let rank = 'C',
        rankClass = 'rank-c';
    if (timeTaken < 10) {
        rank = 'S+';
        rankClass = 'rank-s-plus';
    } else if (timeTaken < 20) {
        rank = 'S';
        rankClass = 'rank-s';
    } else if (timeTaken < 30) {
        rank = 'A';
        rankClass = 'rank-a';
    } else if (timeTaken < 45) {
        rank = 'B';
        rankClass = 'rank-b';
    }

    logAction(`Mission Complete! Result: ${name} (Rank: ${rank})`);

    const modal = document.getElementById('success-modal');
    const card = modal.querySelector('.success-card');
    const badge = document.getElementById('rank-badge');
    badge.className = 'rank-badge ' + rankClass;
    card.className = 'success-card ' + (rank === 'S+' || rank === 'S' ? 's-tier' : '');
    badge.innerText = rank;
    document.getElementById('final-product').innerText = name;
    modal.classList.remove('hidden');
    document.getElementById('lab-interface').className = 'interface-blur';
}

function triggerLabError(msg, type = 'critical') {
    missionActive = false;
    isLabPaused = true;
    logAction(`Error: ${msg}`);
    const modal = document.getElementById('error-modal');
    const card = modal.querySelector('.error-card');
    const title = card.querySelector('h1');
    const btn = card.querySelector('.retry-btn');
    document.getElementById('error-message').innerText = msg;
    card.classList.remove('reminder', 'fail-tier');
    if (type === 'warning') {
        card.classList.add('reminder');
        title.innerText = "SAFETY REMINDER";
        btn.innerText = "CONTINUE EXPERIMENT";
        btn.onclick = function() {
            modal.classList.add('hidden');
            document.getElementById('lab-interface').className = 'active-lab';
            isLabPaused = false;
            document.querySelectorAll('.ash-mess').forEach(e => e.remove());
            missionActive = (currentMissionIndex !== null);
        };
    } else {
        card.classList.add('fail-tier');
        title.innerText = "PROTOCOL FAILED";
        btn.innerText = "RESET WORKBENCH";
        btn.onclick = startMission;
    }
    modal.classList.remove('hidden');
    document.getElementById('lab-interface').className = 'interface-blur';
}

function loadNextMission() {
    document.getElementById('success-modal').classList.add('hidden');
    if (currentMissionIndex + 1 < missions.length) {
        loadMissionData(currentMissionIndex + 1);
        startMission();
    } else {
        alert("Complete!");
        openMissionSelect();
    }
}

function restartMission() { if (confirm("Restart?")) startMission(); }

function setTheme(themeName) {
    document.body.classList.remove('theme-light', 'theme-bahay');
    if (themeName !== 'dark') {
        document.body.classList.add(themeName);
    }
    localStorage.setItem('syntheraTheme', themeName);
}

function setBoxFlyFromOrb(opening) {
  const box = document.getElementById("ai-chatbox");
  if (!box) return;

  const orb = document.getElementById("float-orb");
  if (!orb) return;

  const orbR = orb.getBoundingClientRect();
  const boxR = box.getBoundingClientRect();

  const orbCX = orbR.left + orbR.width / 2;
  const orbCY = orbR.top + orbR.height / 2;

  const boxCX = boxR.left + boxR.width / 2;
  const boxCY = boxR.top + boxR.height / 2;

  const dx = orbCX - boxCX;
  const dy = orbCY - boxCY;

  // small scale so it really feels like it comes from orb
  const MIN_SCALE = 0.08;

  if (opening) {
    // start at orb position (translate to orb center + shrink)
    box.style.transform = `translate(${dx}px, ${dy}px) scale(${MIN_SCALE})`;
  } else {
    // end at orb position
    box.style.transform = `translate(${dx}px, ${dy}px) scale(${MIN_SCALE})`;
  }
}


function toggleAIChat() {
  const overlay = document.getElementById("ai-chat-overlay");
  if (!overlay) return;

  const isOpen = overlay.classList.contains("active");

  if (isOpen) {
    closeAIChat();
  } else {
    openAIChat();
  }
}

function getOrbCenter() {
  const orb = document.getElementById("float-orb");
  if (!orb) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = orb.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function setBoxOriginFromPoint(x, y) {
  const box = document.getElementById("ai-chatbox");
  if (!box) return;

  const br = box.getBoundingClientRect();
  const localX = x - br.left;
  const localY = y - br.top;

  const ox = Math.max(0, Math.min(localX, br.width));
  const oy = Math.max(0, Math.min(localY, br.height));

  box.style.transformOrigin = `${ox}px ${oy}px`;
}


function openAIChat() {
  const overlay = document.getElementById("ai-chat-overlay");
  const box = document.getElementById("ai-chatbox");
  if (!overlay || !box) return;

  overlay.classList.remove("hidden");
  overlay.classList.remove("active");

  // Ensure starting state applies immediately
  box.style.transition = "none";
  void overlay.offsetHeight;

  // 1) place chatbox at orb (shrunken)
  setBoxFlyFromOrb(true);

  // force apply
  void box.offsetHeight;

  // 2) animate to normal position/scale
  box.style.transition = "";
  requestAnimationFrame(() => {
    overlay.classList.add("active");
    box.style.transform = ""; // back to CSS default (scale 1, translate 0)
  });
}



function closeAIChat() {
  const overlay = document.getElementById("ai-chat-overlay");
  const box = document.getElementById("ai-chatbox");
  if (!overlay || !box) return;

  const AI_CLOSE_MS = 520;

  // 1) shrink/fly FIRST (visible)
  setBoxFlyFromOrb(false);

  // 2) delay overlay fade so you can SEE the shrink
  setTimeout(() => {
    overlay.classList.remove("active"); // now fade backdrop out
  }, 120); // tweak 80–180ms

  // 3) hide after everything finishes
  setTimeout(() => {
    overlay.classList.add("hidden");
    box.style.transform = ""; // reset for next open
  }, AI_CLOSE_MS);
}



let orbDidDrag = false;
let orbDownPoint = { x: 0, y: 0 };
const ORB_DRAG_THRESHOLD = 6; // px (tweak 4-10)


// 🆕 Floating draggable orb (Messenger-style snap)
function initFloatingOrb() {
  const orb = document.getElementById("float-orb");
  if (!orb) {
    console.warn("[Orb] #float-orb not found in DOM.");
    return;
  }

  // Default starting point (in case no saved pos)
  orb.style.right = "22px";
  orb.style.bottom = "22px";

  // Restore last position (optional)
  const saved = localStorage.getItem("syntheraOrbPos");
  if (saved) {
    try {
      const { left, top } = JSON.parse(saved);
      if (typeof left === "number" && typeof top === "number") {
        orb.style.left = left + "px";
        orb.style.top = top + "px";
        orb.style.right = "auto";
        orb.style.bottom = "auto";
      }
    } catch {}
  }

  let isDown = false;
  let startX = 0, startY = 0;
  let origLeft = 0, origTop = 0;

  const getPoint = (e) => {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const onDown = (e) => {
  e.preventDefault();
  isDown = true;

  // ✅ reset drag state on press
  orbDidDrag = false;

  orb.classList.remove("snap-anim");

  const rect = orb.getBoundingClientRect();
  origLeft = rect.left;
  origTop = rect.top;

  const p = getPoint(e);
  startX = p.x;
  startY = p.y;

  // ✅ store down point for threshold comparison
  orbDownPoint = { x: p.x, y: p.y };

  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);
};

const onMove = (e) => {
  if (!isDown) return;
  e.preventDefault();

  const p = getPoint(e);
  const dx = p.x - startX;
  const dy = p.y - startY;

  // ✅ mark as dragged once we pass threshold
  const movedX = p.x - orbDownPoint.x;
  const movedY = p.y - orbDownPoint.y;
  if (!orbDidDrag && Math.hypot(movedX, movedY) > ORB_DRAG_THRESHOLD) {
    orbDidDrag = true;
  }

  orb.style.left = (origLeft + dx) + "px";
  orb.style.top  = (origTop + dy) + "px";

  orb.style.right = "auto";
  orb.style.bottom = "auto";
};

const onUp = () => {
  if (!isDown) return;
  isDown = false;

  window.removeEventListener("mousemove", onMove);
  window.removeEventListener("mouseup", onUp);
  window.removeEventListener("touchmove", onMove);
  window.removeEventListener("touchend", onUp);

  // ✅ snap + save (your existing code)
  const edgePadX = 350;
  const edgePadTop = 95;
  const edgePadBottom = 34;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rect = orb.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const snapLeft = centerX < vw / 2;

  const left = snapLeft ? edgePadX : (vw - rect.width - edgePadX);
  const top = clamp(rect.top, edgePadTop, vh - rect.height - edgePadBottom);

  orb.classList.add("snap-anim");
  orb.style.left = left + "px";
  orb.style.top = top + "px";
  orb.style.right = "auto";
  orb.style.bottom = "auto";

  localStorage.setItem("syntheraOrbPos", JSON.stringify({ left, top }));
};


  orb.addEventListener("mousedown", onDown);
  orb.addEventListener("touchstart", onDown, { passive: false });

  console.log("[Orb] Initialized.");
}

// ✅ ensure it runs even if script is loaded before element (just in case)
document.addEventListener("DOMContentLoaded", initFloatingOrb);

// 🆕 AI Chatbox toggle (clean + single listener)
document.addEventListener("DOMContentLoaded", () => {
  const orbEl = document.getElementById("float-orb");
  const aiOverlayEl = document.getElementById("ai-chat-overlay");
  const aiBoxEl = document.getElementById("ai-chatbox");

    if (!orbEl || !aiOverlayEl || !aiBoxEl) return;

        orbEl.addEventListener("click", (e) => {
        e.stopPropagation();

        if (orbDidDrag) {
            orbDidDrag = false;
            return;
        }

        const overlay = document.getElementById("ai-chat-overlay");
        if (!overlay) return;

        if (overlay.classList.contains("active")) closeAIChat();
        else openAIChat();
        });

});

function initAIChatComposer() {
  const aiOverlayEl = document.getElementById("ai-chat-overlay");
  const aiBoxEl = document.getElementById("ai-chatbox");
  if (!aiOverlayEl || !aiBoxEl) return;

  // 🔍 Find elements inside your chatbox (supports unknown IDs)
  const input =
    aiBoxEl.querySelector("#ai-chat-input") ||
    aiBoxEl.querySelector('input[type="text"]') ||
    aiBoxEl.querySelector("textarea");

  const sendBtn =
    aiBoxEl.querySelector("#ai-chat-send") ||
    aiBoxEl.querySelector('button[type="submit"]') ||
    aiBoxEl.querySelector(".send-btn");

    const list =
    aiBoxEl.querySelector("#ai-chat-messages") ||
    aiBoxEl.querySelector(".chat-messages") ||
    aiBoxEl.querySelector(".messages");

    const scrollWrap =
    aiBoxEl.querySelector(".ai-body") || list;


  if (!input || !sendBtn || !list) {
    console.warn("[AI Chat] Missing:", { input: !!input, sendBtn: !!sendBtn, list: !!list });
    return;
  }

    const appendMessage = (text, who = "user") => {
    const msg = document.createElement("div");
    msg.className = `chat-msg ${who}`;
    msg.textContent = text;

    list.appendChild(msg);

    // ✅ auto-scroll to latest message
    scrollWrap.scrollTop = scrollWrap.scrollHeight;
    };


  const sendMessage = () => {
    const text = (input.value || "").trim();
    if (!text) return;
    appendMessage(text, "user");
    input.value = "";
  };

  // ✅ Prevent Enter from submitting a form (if your input is inside one)
  const form = input.closest("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage();
    });
  }

  // ✅ Enter to send (Shift+Enter keeps newline for textarea)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ✅ Click send
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
  });

  console.log("[AI Chat] Composer initialized ✅");
}

// ✅ Add this near the bottom (only once)
document.addEventListener("DOMContentLoaded", initAIChatComposer);



function initAIChatComposer() {
    const aiOverlayEl = document.getElementById("ai-chat-overlay");
    const aiBoxEl = document.getElementById("ai-chatbox");
    if (!aiOverlayEl || !aiBoxEl) return;
  
    // 🔍 Find elements inside your chatbox
    const input =
      aiBoxEl.querySelector("#ai-chat-input") ||
      aiBoxEl.querySelector('input[type="text"]') ||
      aiBoxEl.querySelector("textarea");
  
    const sendBtn =
      aiBoxEl.querySelector("#ai-chat-send") ||
      aiBoxEl.querySelector('button[type="submit"]') ||
      aiBoxEl.querySelector(".send-btn");
  
    const list =
      aiBoxEl.querySelector("#ai-chat-messages") ||
      aiBoxEl.querySelector(".chat-messages") ||
      aiBoxEl.querySelector(".messages");
  
    const scrollWrap = aiBoxEl.querySelector(".ai-body") || list;
  
    if (!input || !sendBtn || !list) {
      console.warn("[AI Chat] Missing UI elements.");
      return;
    }
  
    // --- Helper: Add Message to UI ---
    const appendMessage = (text, who = "user", id = null) => {
      const msg = document.createElement("div");
      msg.className = `chat-msg ${who}`;
      // Replace newlines with <br> for formatting
      msg.innerHTML = text.replace(/\n/g, '<br>');
      if (id) msg.id = id;
      
      list.appendChild(msg);
      // Auto-scroll to bottom
      scrollWrap.scrollTop = scrollWrap.scrollHeight;
    };
  
    // --- Main Send Logic ---
    const sendMessage = async () => {
      const text = (input.value || "").trim();
      if (!text) return;
  
      // 1. Show User Message
      appendMessage(text, "user");
      input.value = "";
  
      // 2. Show "Thinking..." Bubble
      const loadingId = "ai-loading-" + Date.now();
      appendMessage('<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing...', "bot", loadingId);
  
      try {
        // 3. Send to Python Backend
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });
  
        const data = await response.json();
  
        // 4. Remove Loading Bubble & Show Real Response
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        
        appendMessage(data.reply, "bot");
  
      } catch (error) {
        console.error("AI Error:", error);
        const loader = document.getElementById(loadingId);
        if (loader) loader.innerText = "Error: Connection Failed.";
      }
    };
  
    // --- Event Listeners ---
  
    // Prevent Enter from submitting forms
    const form = input.closest("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage();
      });
    }
  
    // Enter key to send
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  
    // Click send button
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sendMessage();
    });
  
    console.log("[AI Chat] Composer initialized with Python Backend ✅");
}