(() => {
  "use strict";

  const B = window.BIASES;
  const CASES = window.CASES;
  const TOTAL = CASES.length;
  const ORDER = CASES.map(c => c.bias);              // field-guide order follows the cases
  const LEVELS = [50, 60, 70, 80, 90, 99];
  const BLIND = ["Much less", "Less", "About average", "More", "Much more"];
  const $ = s => document.querySelector(s);
  const pad = n => String(n).padStart(2, "0");
  const say = m => { $("#live").textContent = m; };
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- Sound: a quiet bell for a correct diagnosis, a soft low tone otherwise ---------- */
  const sound = {
    on: true, ctx: null,
    bell: new Audio("assets/high-bell-ring-1.mp3"),
    play(kind) {
      if (!this.on) return;
      if (kind === "hit") { this.bell.volume = .18; this.bell.currentTime = 0; this.bell.play().catch(() => {}); return; }
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(kind === "miss" ? 196 : 523, t);
        if (kind === "miss") o.frequency.exponentialRampToValueAtTime(147, t + .5);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(kind === "miss" ? .06 : .025, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + (kind === "miss" ? .6 : .12));
        o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + .7);
      } catch (e) { /* audio unavailable */ }
    }
  };

  /* ---------- State ---------- */
  let state = { screen: "intro", prev: "intro", blind: null, idx: 0, options: [], pick: null, conf: null, locked: false, answers: [] };

  function show(name, focusSel) {
    if (name === "guide" && state.screen !== "guide") state.prev = state.screen;
    state.screen = name;
    ["intro", "case", "result", "guide"].forEach(k => { $(`#${k}Screen`).hidden = k !== name; });
    $("#restartBtn").hidden = name === "intro" || (name === "guide" && state.prev === "intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const el = focusSel ? $(focusSel) : null;
    if (el) requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }

  /* ---------- Intro ---------- */
  $("#bsScale").innerHTML = BLIND.map((l, i) => `<button type="button" role="radio" aria-checked="false" data-i="${i}">${l}</button>`).join("");
  [...$("#bsScale").children].forEach(b => b.addEventListener("click", () => {
    state.blind = Number(b.dataset.i);
    [...$("#bsScale").children].forEach(x => x.setAttribute("aria-checked", String(x === b)));
    $("#startBtn").disabled = false;
    sound.play("tap");
  }));

  function toIntro() {
    closeEntry();
    state = { ...state, idx: 0, answers: [], locked: false };
    show("intro");
  }

  /* ---------- Cases ---------- */
  function start() {
    state.idx = 0; state.answers = [];
    show("case", "#caseTitle");
    renderCase();
  }

  function renderTicks() {
    $("#ticks").innerHTML = CASES.map((_, i) => {
      const a = state.answers[i];
      return `<span class="${a ? (a.correct ? "hit" : "miss") : i === state.idx ? "now" : ""}"></span>`;
    }).join("");
    $("#hudLabel").textContent = `Case ${pad(state.idx + 1)} of ${TOTAL}`;
    const hits = state.answers.filter(a => a.correct).length;
    $("#hudScore").textContent = `${hits} correct`;
  }

  function renderCase() {
    const c = CASES[state.idx];
    Object.assign(state, { pick: null, conf: null, locked: false, options: shuffle([c.bias, ...c.confusers]) });
    renderTicks();
    $("#caseDomain").textContent = `Case ${pad(state.idx + 1)} · ${c.domain}`;
    $("#caseTitle").textContent = c.title;
    $("#caseText").textContent = c.text;

    $("#dxOptions").innerHTML = state.options.map((id, i) => `
      <button class="dx" type="button" role="radio" aria-checked="false" data-id="${id}">
        <span class="dx-key" aria-hidden="true">${i + 1}</span>
        <span><span class="dx-name">${B[id].name}</span><span class="dx-short">${B[id].short}</span></span>
      </button>`).join("");
    [...$("#dxOptions").children].forEach(b => b.addEventListener("click", () => choose(b.dataset.id)));

    $("#confidence").innerHTML = LEVELS.map(v => `<button type="button" role="radio" aria-checked="false" data-v="${v}">${v}%<small>${v === 50 ? "a guess" : v === 99 ? "certain" : "&nbsp;"}</small></button>`).join("");
    [...$("#confidence").children].forEach(b => b.addEventListener("click", () => setConf(Number(b.dataset.v))));

    $("#diagnose").querySelectorAll(".step-label, .cf-hint").forEach(el => { el.hidden = false; });
    $("#commitBtn").hidden = false;
    $("#casefile").hidden = true;
    updateCommit();
    say(`Case ${state.idx + 1} of ${TOTAL}. ${c.title}. ${c.text} Choose the bias at work, then your confidence.`);
  }

  function choose(id) {
    if (state.locked) return;
    state.pick = id;
    [...$("#dxOptions").children].forEach(b => b.setAttribute("aria-checked", String(b.dataset.id === id)));
    sound.play("tap");
    updateCommit();
  }
  function setConf(v) {
    if (state.locked) return;
    state.conf = v;
    [...$("#confidence").children].forEach(b => b.setAttribute("aria-checked", String(Number(b.dataset.v) === v)));
    sound.play("tap");
    updateCommit();
  }
  function updateCommit() {
    const ready = state.pick && state.conf;
    $("#commitBtn").disabled = !ready;
    $("#commitBtn").textContent = !state.pick ? "Choose a diagnosis" : !state.conf ? "Set your confidence" : "Commit diagnosis";
  }

  function commit() {
    if (state.locked || !state.pick || !state.conf) return;
    state.locked = true;
    const c = CASES[state.idx], bias = B[c.bias];
    const correct = state.pick === c.bias;
    state.answers[state.idx] = { bias: c.bias, pick: state.pick, conf: state.conf, correct };

    [...$("#dxOptions").children].forEach(b => {
      b.disabled = true;
      const id = b.dataset.id;
      b.classList.add(id === c.bias ? "right" : id === state.pick ? "wrong" : "dim");
    });
    [...$("#confidence").children].forEach(b => { b.disabled = true; });
    $("#commitBtn").hidden = true;
    $("#diagnose").querySelector(".cf-hint").hidden = true;
    renderTicks();

    const conf = state.conf;
    let sub;
    if (correct) sub = conf <= 60 ? `You gave it ${conf}%. You knew more than you trusted.` : conf >= 90 ? `At ${conf}% confidence, and rightly so.` : `You were ${conf}% confident.`;
    else sub = `You diagnosed ${B[state.pick].name} at ${conf}% confidence.` + (conf >= 80 ? " High certainty, wrong answer: worth noticing." : "");
    $("#verdict").className = `verdict ${correct ? "hit" : "miss"}`;
    $("#verdict").innerHTML = `<span class="verdict-mark" aria-hidden="true">${correct ? "✓" : "✕"}</span><p class="verdict-head">${correct ? `Correct: ${bias.name}` : `This was ${bias.name}`}</p><p class="verdict-sub">${sub}</p>`;
    $("#cfImg").src = bias.img;
    $("#cfName").textContent = bias.name;
    $("#cfMech").textContent = bias.mechanism;
    $("#cfEvid").textContent = bias.evidence;
    $("#cfCounter").textContent = bias.counter;
    $("#nextBtn").innerHTML = state.idx < TOTAL - 1 ? `Next case <span aria-hidden="true">→</span>` : `See how your judgment measured up <span aria-hidden="true">→</span>`;
    $("#casefile").hidden = false;

    sound.play(correct ? "hit" : "miss");
    setTimeout(() => $("#casefile").scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    $("#nextBtn").focus({ preventScroll: true });
    say(`${correct ? "Correct" : "Not quite"}. This was ${bias.name}. ${sub} ${bias.mechanism} Countermeasure: ${bias.counter}`);
  }

  function next() {
    if (!state.locked) return;
    if (state.idx < TOTAL - 1) { state.idx++; renderCase(); window.scrollTo({ top: 0, behavior: "smooth" }); $("#caseTitle").focus({ preventScroll: true }); }
    else results();
  }

  /* ---------- Results ---------- */
  function results() {
    const A = state.answers;
    const hits = A.filter(a => a.correct).length;
    const acc = hits / TOTAL * 100;
    const avg = Math.round(A.reduce((n, a) => n + a.conf, 0) / TOTAL);
    const gap = Math.round(avg - acc);

    let title, lede, gapLab, gapCls;
    if (gap > 10) {
      title = "Your confidence outran your accuracy.";
      lede = `You diagnosed ${hits} of ten cases correctly but felt ${avg}% sure on average. That ${gap}-point gap is overconfidence, one of the ten biases, at work in your own answers.`;
      gapLab = "Points overconfident"; gapCls = "warn";
    } else if (gap < -10) {
      title = "You knew more than you believed.";
      lede = `You diagnosed ${hits} of ten correctly while averaging only ${avg}% confidence. Underconfidence is rarer than its opposite, and it is still a miscalibration: it can make you defer when you should decide.`;
      gapLab = "Points underconfident"; gapCls = "warn";
    } else {
      title = hits >= 8 ? "Accurate, and you knew it." : "Your confidence matched your accuracy.";
      lede = `You diagnosed ${hits} of ten correctly at an average confidence of ${avg}%. Being well calibrated, knowing how much you know, is rarer than being right, and arguably more useful.`;
      gapLab = "Calibration gap"; gapCls = "good";
    }

    show("result", "#resultTitle");
    $("#resultTitle").textContent = title;
    $("#resultLede").textContent = lede;
    $("#mAcc").textContent = `${hits}/10`;
    $("#mConf").textContent = `${avg}%`;
    $("#mGap").textContent = `${gap > 0 ? "+" : ""}${gap}`;
    $("#mGapLab").textContent = gapLab;
    $("#mGap").closest(".metric").className = `metric ${gapCls}`;
    drawCalibration(A, avg, acc);

    // Blind spot and recurring confusion
    const bsLess = state.blind !== null && state.blind <= 1;
    const bsText = state.blind === null ? "" : bsLess
      ? `You rated yourself <b>${BLIND[state.blind].toLowerCase()}</b> susceptible than the average person. So do most people: Pronin, Lin and Ross (2002) found that people reliably see bias in others more readily than in themselves. It's called the bias blind spot. ${TOTAL - hits === 0 ? "Your diagnoses were flawless here; the test is whether you catch these in your own decisions." : `You then misdiagnosed ${TOTAL - hits} of ten cases.`}`
      : `You rated yourself <b>${BLIND[state.blind].toLowerCase()}</b>${state.blind === 2 ? "" : " susceptible"} compared with the average person. Most people place themselves below average (Pronin, Lin and Ross, 2002, call this the bias blind spot), so resisting that impulse is itself a sign of good judgment.`;
    const misses = A.filter(a => !a.correct);
    const freq = {};
    misses.forEach(a => { freq[a.pick] = (freq[a.pick] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
    let confText;
    if (!misses.length) confText = "You diagnosed every case correctly. The harder test is noticing these biases in your own decisions, where nobody hands you four options. Keep the countermeasures in the field guide below close.";
    else if (top && top[1] >= 2) confText = `You reached for <b>${B[top[0]].name}</b> ${top[1]} times when something else was at work. When a familiar explanation comes to mind first, that ease is itself worth questioning. Missed: ${misses.map(a => B[a.bias].name).join(", ")}.`;
    else confText = `The cases that caught you: ${misses.map(a => `<b>${B[a.bias].name}</b> (you chose ${B[a.pick].name})`).join("; ")}. Open their entries below to see what separates them.`;
    $("#mirror").innerHTML = `
      ${bsText ? `<article><p class="kicker">The bias blind spot</p><h4>${bsLess ? "You see yourself as less biased than most." : "You resisted the commonest self-assessment."}</h4><p>${bsText}</p></article>` : ""}
      <article><p class="kicker">Where you slipped</p><h4>${!misses.length ? "A clean diagnosis, ten times." : `${misses.length} case${misses.length > 1 ? "s" : ""} to revisit.`}</h4><p>${confText}</p></article>`;

    renderGuide($("#resultGuide"), true);
    sound.play(hits >= 7 ? "hit" : "tap");
    say(`${title} ${lede}`);
  }

  function drawCalibration(A, avg, acc) {
    const W = 420, H = 320, L = 48, R = 400, T = 16, Bm = 276;
    const x = v => L + (v - 50) / 50 * (R - L);
    const y = v => Bm - 12 - v / 100 * (Bm - T - 24);
    const groups = LEVELS.map(v => { const g = A.filter(a => a.conf === v); return { v, n: g.length, acc: g.length ? g.filter(a => a.correct).length / g.length * 100 : 0 }; }).filter(g => g.n);
    let svg = `<desc id="calibDesc">Calibration chart. Average confidence ${avg}%, accuracy ${Math.round(acc)}%.</desc>`;
    svg += `<polygon class="zone-over" points="${x(50)},${y(50)} ${x(100)},${y(100)} ${x(100)},${y(0)} ${x(50)},${y(0)}"/>`;
    svg += `<polygon class="zone-under" points="${x(50)},${y(50)} ${x(100)},${y(100)} ${x(50)},${y(100)}"/>`;
    [0, 25, 50, 75, 100].forEach(v => { svg += `<line class="grid" x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 10}" y="${y(v) + 3}" text-anchor="end">${v}%</text>`; });
    LEVELS.forEach(v => { svg += `<text x="${x(v)}" y="${Bm + 20}" text-anchor="middle">${v}</text>`; });
    svg += `<line class="axis" x1="${L}" x2="${R}" y1="${Bm}" y2="${Bm}"/><line class="axis" x1="${L}" x2="${L}" y1="${T}" y2="${Bm}"/>`;
    svg += `<line class="diag" x1="${x(50)}" y1="${y(50)}" x2="${x(100)}" y2="${y(100)}"/>`;
    svg += `<text class="zone-label" x="${x(97)}" y="${y(8)}" text-anchor="end">Overconfident</text><text class="zone-label" x="${x(53)}" y="${y(92)}">Underconfident</text>`;
    svg += `<text x="${(L + R) / 2}" y="${H - 2}" text-anchor="middle">Your stated confidence (%)</text>`;
    svg += `<text x="12" y="${(T + Bm) / 2}" text-anchor="middle" transform="rotate(-90 12 ${(T + Bm) / 2})">Actually correct</text>`;
    groups.forEach((g, i) => {
      const r = 6 + g.n * 2.2;
      svg += `<circle class="pt" style="animation-delay:${.2 + i * .12}s" cx="${x(g.v)}" cy="${y(g.acc)}" r="${r}"><title>${g.v}% confidence: ${g.n} answer${g.n > 1 ? "s" : ""}, ${Math.round(g.acc)}% correct</title></circle>`;
      svg += `<text class="pt-label" x="${x(g.v)}" y="${y(g.acc) - r - 5}" text-anchor="middle">${g.n}×</text>`;
    });
    svg += `<circle class="avg" cx="${x(Math.max(50, avg))}" cy="${y(acc)}" r="9"><title>Overall: ${avg}% confident, ${Math.round(acc)}% correct</title></circle>`;
    svg += `<text class="pt-label" x="${x(Math.max(50, avg)) + 14}" y="${y(acc) + 4}" fill="#9a3b2e">overall</text>`;
    $("#calibChart").innerHTML = svg;
  }

  /* ---------- Field guide ---------- */
  function renderGuide(host, withResults) {
    host.innerHTML = ORDER.map((id, i) => {
      const b = B[id];
      const a = withResults ? state.answers.find(x => x.bias === id) : null;
      const status = a ? `<span class="${a.correct ? "hit" : "miss"}">${a.correct ? "Diagnosed" : "Missed"}</span>` : "";
      return `<button class="g-card" type="button" data-i="${i}" style="animation-delay:${i * .04}s">
        <figure class="plate"><img src="${b.img}" alt="" loading="lazy"></figure>
        <span class="g-meta"><span>No. ${pad(i + 1)}</span>${status}</span>
        <b>${b.name}</b><span class="g-short">${b.short}</span>
      </button>`;
    }).join("");
    [...host.children].forEach(c => c.addEventListener("click", () => openEntry(Number(c.dataset.i))));
  }
  function openGuide() {
    renderGuide($("#guide"), false);
    show("guide", "#guideTitle");
  }

  let entryIdx = 0;
  function fillEntry(i) {
    entryIdx = (i + TOTAL) % TOTAL;
    const b = B[ORDER[entryIdx]];
    $("#eImg").src = b.img; $("#eImg").alt = "";
    $("#eNo").textContent = `No. ${pad(entryIdx + 1)} of ${TOTAL}`;
    $("#eName").textContent = b.name;
    $("#eShort").textContent = b.short;
    $("#eMech").textContent = b.mechanism;
    $("#eEvid").textContent = b.evidence;
    $("#eCounter").textContent = b.counter;
  }
  function openEntry(i) {
    fillEntry(i);
    const d = $("#entry");
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  function closeEntry() { const d = $("#entry"); if (d.open) { if (d.close) d.close(); else d.removeAttribute("open"); } }

  /* ---------- Wiring ---------- */
  $("#startBtn").addEventListener("click", start);
  $("#commitBtn").addEventListener("click", commit);
  $("#nextBtn").addEventListener("click", next);
  $("#againBtn").addEventListener("click", start);
  $("#toIntroBtn").addEventListener("click", toIntro);
  $("#restartBtn").addEventListener("click", toIntro);
  $("#homeBtn").addEventListener("click", toIntro);
  $("#guideBtn").addEventListener("click", openGuide);
  $("#guideBackBtn").addEventListener("click", () => show(state.prev));
  $("#eClose").addEventListener("click", closeEntry);
  $("#ePrev").addEventListener("click", () => fillEntry(entryIdx - 1));
  $("#eNext").addEventListener("click", () => fillEntry(entryIdx + 1));
  $("#entry").addEventListener("click", e => { if (e.target === $("#entry")) closeEntry(); });
  $("#soundBtn").addEventListener("click", () => {
    sound.on = !sound.on;
    $("#soundBtn").textContent = sound.on ? "Sound on" : "Sound off";
    $("#soundBtn").setAttribute("aria-pressed", String(sound.on));
  });
  document.addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if ($("#entry").open) {
      if (e.key === "ArrowRight") fillEntry(entryIdx + 1);
      if (e.key === "ArrowLeft") fillEntry(entryIdx - 1);
      return;
    }
    if (state.screen !== "case") return;
    const n = parseInt(e.key, 10);
    if (!state.locked && n >= 1 && n <= 4) { e.preventDefault(); choose(state.options[n - 1]); return; }
    if (!state.locked && (e.key === "ArrowRight" || e.key === "ArrowLeft") && document.activeElement?.closest?.("#confidence") == null) {
      const i = state.conf ? LEVELS.indexOf(state.conf) : (e.key === "ArrowRight" ? -1 : LEVELS.length);
      const j = Math.min(LEVELS.length - 1, Math.max(0, i + (e.key === "ArrowRight" ? 1 : -1)));
      e.preventDefault(); setConf(LEVELS[j]); return;
    }
    if (e.key === "Enter" && document.activeElement?.tagName !== "BUTTON") {
      e.preventDefault();
      if (!state.locked) commit(); else next();
    }
  });
})();
