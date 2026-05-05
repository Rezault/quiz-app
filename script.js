const steps = [
  { substrate: "Glucose", enzyme: "hexokinase" },
  { substrate: "Glucose 6-phosphate", enzyme: "phosphohexose isomerase" },
  { substrate: "Fructose 6-phosphate", enzyme: "phosphofructokinase-1" },
  { substrate: "Fructose 1,6-bisphosphate", enzyme: "aldolase" },
  { substrate: "Glyceraldehyde 3-phosphate + Dihydroxyacetone phosphate", enzyme: "triose phosphate isomerase" },
  { substrate: "Glyceraldehyde 3-phosphate (×2)", enzyme: "glyceraldehyde 3-phosphate dehydrogenase" },
  { substrate: "1,3-Bisphosphoglycerate (×2)", enzyme: "phosphoglycerate kinase" },
  { substrate: "3-Phosphoglycerate (×2)", enzyme: "phosphoglycerate mutase" },
  { substrate: "2-Phosphoglycerate (×2)", enzyme: "enolase" },
  { substrate: "Phosphoenolpyruvate (×2)", enzyme: "pyruvate kinase" },
];
const finalProduct = "Pyruvate (×2)";

let mode = "both";
let placed = {};

// One-at-a-time mode state
let oneQueue = [];
let oneIndex = 0;
let oneCorrect = 0;

function isOneMode() {
  return mode.startsWith("one-");
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildPathway() {
  const el = document.getElementById("pathway");
  el.innerHTML = "";

  if (isOneMode()) {
    setupOneAtATimeDropZones();
    return;
  }

  steps.forEach((step, i) => {
    if (mode !== "enzymes") {
      const row = document.createElement("div");
      row.className = "step";
      row.innerHTML = `<span class="step-num">${i+1})</span><div class="drop-zone substrate" data-type="substrate" data-index="${i}"></div>`;
      el.appendChild(row);
    } else {
      const row = document.createElement("div");
      row.className = "step";
      row.innerHTML = `<span class="step-num">${i+1})</span><span style="color:#f5c518;font-size:0.75em">${step.substrate}</span>`;
      el.appendChild(row);
    }
    el.innerHTML += `<div class="arrow">↓</div>`;
    if (mode !== "substrates") {
      const erow = document.createElement("div");
      erow.className = "enzyme-label";
      erow.innerHTML = `<div class="drop-zone enzyme" data-type="enzyme" data-index="${i}"></div>`;
      el.appendChild(erow);
    } else {
      el.innerHTML += `<div class="enzyme-label" style="color:#ff6b9d;font-size:0.7em;font-style:italic">(${step.enzyme})</div>`;
    }
  });
  if (mode !== "enzymes") {
    const row = document.createElement("div");
    row.className = "step";
    row.innerHTML = `<span class="step-num"></span><div class="drop-zone substrate" data-type="final" data-index="10"></div>`;
    el.appendChild(row);
  } else {
    el.innerHTML += `<div class="step"><span class="step-num"></span><span style="color:#f5c518;font-size:0.75em">${finalProduct}</span></div>`;
  }
  setupDropZones();
}

function buildWordBank() {
  const el = document.getElementById("wordBank");
  el.innerHTML = "<h3>Word Bank</h3>";

  if (isOneMode()) {
    buildOneAtATimeBank();
    return;
  }

  if (mode !== "enzymes") {
    const substrates = shuffle([...steps.map(s => s.substrate), finalProduct]);
    let html = `<div class="bank-section"><h4>Substrates / Products</h4><div class="words">`;
    substrates.forEach(s => { html += `<div class="word substrate" draggable="true" data-value="${s}">${s}</div>`; });
    html += `</div></div>`;
    el.innerHTML += html;
  }
  if (mode !== "substrates") {
    const enzymes = shuffle(steps.map(s => s.enzyme));
    let html = `<div class="bank-section enzymes"><h4>Enzymes</h4><div class="words">`;
    enzymes.forEach(e => { html += `<div class="word enzyme" draggable="true" data-value="${e}">${e}</div>`; });
    html += `</div></div>`;
    el.innerHTML += html;
  }
  setupDraggables();
}

// --- One at a Time mode ---

function initOneAtATime() {
  const allItems = [];
  const oneCategory = mode.replace("one-", ""); // "both", "substrates", or "enzymes"

  if (oneCategory !== "enzymes") {
    steps.forEach((step, i) => {
      allItems.push({ value: step.substrate, type: "substrate", index: i });
    });
    allItems.push({ value: finalProduct, type: "substrate", index: 10 });
  }
  if (oneCategory !== "substrates") {
    steps.forEach((step, i) => {
      allItems.push({ value: step.enzyme, type: "enzyme", index: i });
    });
  }

  oneQueue = shuffle(allItems);
  oneIndex = 0;
  oneCorrect = 0;
  updateOneScore();
}

function buildOneAtATimeBank() {
  const el = document.getElementById("wordBank");
  el.innerHTML = "<h3>Word Bank</h3>";

  if (oneIndex >= oneQueue.length) {
    el.innerHTML += `<div class="bank-section"><p style="color:#4caf50;font-size:0.85em;text-align:center;">🎉 All done! ${oneCorrect}/${oneQueue.length} correct</p></div>`;
    return;
  }

  const current = oneQueue[oneIndex];
  const typeClass = current.type === "substrate" ? "substrate" : "enzyme";
  const typeLabel = current.type === "substrate" ? "Substrate/Product" : "Enzyme";

  let html = `<div class="bank-section"><h4>${typeLabel} (${oneIndex + 1} of ${oneQueue.length})</h4><div class="words">`;
  html += `<div class="word ${typeClass}" draggable="true" data-value="${current.value}">${current.value}</div>`;
  html += `</div></div>`;
  el.innerHTML += html;

  setupDraggables();
}

function setupOneAtATimeDropZones() {
  const el = document.getElementById("pathway");
  el.innerHTML = "";
  const oneCategory = mode.replace("one-", "");

  steps.forEach((step, i) => {
    if (oneCategory !== "enzymes") {
      const row = document.createElement("div");
      row.className = "step";
      row.innerHTML = `<span class="step-num">${i+1})</span><div class="drop-zone substrate" data-type="substrate" data-index="${i}"></div>`;
      el.appendChild(row);
    } else {
      const row = document.createElement("div");
      row.className = "step";
      row.innerHTML = `<span class="step-num">${i+1})</span><span style="color:#f5c518;font-size:0.75em">${step.substrate}</span>`;
      el.appendChild(row);
    }
    el.innerHTML += `<div class="arrow">↓</div>`;
    if (oneCategory !== "substrates") {
      const erow = document.createElement("div");
      erow.className = "enzyme-label";
      erow.innerHTML = `<div class="drop-zone enzyme" data-type="enzyme" data-index="${i}"></div>`;
      el.appendChild(erow);
    } else {
      el.innerHTML += `<div class="enzyme-label" style="color:#ff6b9d;font-size:0.7em;font-style:italic">(${step.enzyme})</div>`;
    }
  });

  if (oneCategory !== "enzymes") {
    const row = document.createElement("div");
    row.className = "step";
    row.innerHTML = `<span class="step-num"></span><div class="drop-zone substrate" data-type="final" data-index="10"></div>`;
    el.appendChild(row);
  } else {
    el.innerHTML += `<div class="step"><span class="step-num"></span><span style="color:#f5c518;font-size:0.75em">${finalProduct}</span></div>`;
  }

  // Restore already-placed items
  Object.keys(placed).forEach(key => {
    const [type, idx] = key.split("-");
    let zone;
    if (type === "final") {
      zone = document.querySelector(`.drop-zone[data-type="final"][data-index="10"]`);
    } else {
      zone = document.querySelector(`.drop-zone[data-type="${type}"][data-index="${idx}"]`);
    }
    if (zone) {
      zone.textContent = placed[key];
      zone.classList.add("filled", "correct");
    }
  });

  // Setup drop handlers
  document.querySelectorAll(".drop-zone").forEach(zone => {
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const val = e.dataTransfer.getData("text/plain");
      if (oneIndex >= oneQueue.length) return;

      const current = oneQueue[oneIndex];
      const key = `${zone.dataset.type}-${zone.dataset.index}`;

      // Check if this is the correct zone for the current word
      let expectedKey;
      if (current.type === "substrate" && current.index === 10) {
        expectedKey = "final-10";
      } else {
        expectedKey = `${current.type}-${current.index}`;
      }

      if (key === expectedKey) {
        placed[key] = val;
        zone.textContent = val;
        zone.classList.add("filled", "correct");
        oneCorrect++;
        oneIndex++;
        updateOneScore();
        buildOneAtATimeBank();
      } else {
        zone.classList.add("incorrect");
        setTimeout(() => zone.classList.remove("incorrect"), 600);
        updateOneScore("❌ Wrong spot! Try again.");
      }
    });
  });
}

function updateOneScore(msg) {
  const scoreEl = document.getElementById("score");
  if (msg) {
    scoreEl.textContent = msg;
  } else if (oneIndex >= oneQueue.length) {
    scoreEl.textContent = `🎉 Done! ${oneCorrect}/${oneQueue.length} correct`;
  } else {
    scoreEl.textContent = `✅ ${oneCorrect} correct so far — ${oneIndex + 1} of ${oneQueue.length}`;
  }
}

// --- Standard mode functions ---

function setupDraggables() {
  document.querySelectorAll(".word").forEach(w => {
    w.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", w.dataset.value);
      w.classList.add("dragging");
    });
    w.addEventListener("dragend", () => w.classList.remove("dragging"));
  });
}

function setupDropZones() {
  document.querySelectorAll(".drop-zone").forEach(zone => {
    zone.setAttribute("draggable", "true");
    zone.addEventListener("dragstart", e => {
      const key = `${zone.dataset.type}-${zone.dataset.index}`;
      if (!placed[key]) { e.preventDefault(); return; }
      e.dataTransfer.setData("text/plain", placed[key]);
      zone.classList.add("dragging-out");
      setTimeout(() => {
        const val = placed[key];
        delete placed[key];
        zone.textContent = "";
        zone.classList.remove("filled", "correct", "incorrect", "dragging-out");
        const wordEl = document.querySelector(`.word[data-value="${val}"]`);
        if (wordEl) wordEl.classList.remove("placed");
      }, 0);
    });
    zone.addEventListener("dragend", () => zone.classList.remove("dragging-out"));
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const val = e.dataTransfer.getData("text/plain");
      const prevKey = Object.keys(placed).find(k => placed[k] === val);
      if (prevKey) {
        delete placed[prevKey];
        const prevZone = document.querySelector(`.drop-zone[data-type="${prevKey.split('-')[0]}"][data-index="${prevKey.split('-')[1]}"]`);
        if (prevZone) { prevZone.textContent = ""; prevZone.classList.remove("filled"); }
      }
      const key = `${zone.dataset.type}-${zone.dataset.index}`;
      if (placed[key]) {
        const oldWord = document.querySelector(`.word[data-value="${placed[key]}"]`);
        if (oldWord) oldWord.classList.remove("placed");
      }
      placed[key] = val;
      zone.textContent = val;
      zone.classList.add("filled");
      const wordEl = document.querySelector(`.word[data-value="${val}"]`);
      if (wordEl) wordEl.classList.add("placed");
      zone.classList.remove("correct", "incorrect");
    });
  });
}

function checkAnswers() {
  if (isOneMode()) return;
  let correct = 0, total = 0;
  document.querySelectorAll(".drop-zone").forEach(zone => {
    const type = zone.dataset.type;
    const idx = parseInt(zone.dataset.index);
    const key = `${type}-${idx}`;
    const answer = placed[key];
    let expected;
    if (type === "substrate") expected = steps[idx].substrate;
    else if (type === "enzyme") expected = steps[idx].enzyme;
    else if (type === "final") expected = finalProduct;
    if (mode === "enzymes" && type === "substrate") return;
    if (mode === "substrates" && type === "enzyme") return;
    total++;
    if (answer === expected) { zone.classList.add("correct"); zone.classList.remove("incorrect"); correct++; }
    else if (answer) { zone.classList.add("incorrect"); zone.classList.remove("correct"); }
  });
  document.getElementById("score").textContent = `✅ ${correct} / ${total} correct`;
}

function resetQuiz() {
  placed = {};
  document.querySelectorAll(".word").forEach(w => w.classList.remove("placed"));
  document.getElementById("score").textContent = "Drop terms into the boxes below";
  if (isOneMode()) {
    initOneAtATime();
    setupOneAtATimeDropZones();
    buildOneAtATimeBank();
  } else {
    buildPathway();
    buildWordBank();
  }
}

document.querySelectorAll(".mode-toggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-toggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mode = btn.dataset.mode;
    placed = {};
    if (isOneMode()) {
      initOneAtATime();
      setupOneAtATimeDropZones();
      buildOneAtATimeBank();
    } else {
      document.getElementById("score").textContent = "Drop terms into the boxes below";
      buildPathway();
      buildWordBank();
    }
  });
});

buildPathway();
buildWordBank();
