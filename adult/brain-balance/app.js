// Uses SCENARIOS and REFLECTIONS from data.js (loaded first as a plain script,
// so the game also works when index.html is opened straight from disk).

// ---------- Icons ----------

const ICON = {
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.2-4.4-9.6-9.1A5.4 5.4 0 0 1 12 6.3a5.4 5.4 0 0 1 9.6 5.6C19.2 16.6 12 21 12 21z"/></svg>`,
  head: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/></svg>`,
  balance: `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5v17M7 20.5h10M4.5 7.5h15"/><path d="M7 7.5 4 13.5a3 3 0 0 0 6 0zM17 7.5l-3 6a3 3 0 0 0 6 0z"/></g></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  replay: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>`
};

const TYPE = {
  emotional: { label: "Heart-led", icon: ICON.heart },
  logical: { label: "Head-led", icon: ICON.head },
  balanced: { label: "Balanced", icon: ICON.balance }
};

const VERDICT = {
  balanced: { title: "Balanced.", text: "You heard the feeling and checked the facts. That's the sweet spot." },
  emotional: { title: "Your heart took the wheel.", text: "The feeling was real, but it made the decision on its own." },
  logical: { title: "Your head took over.", text: "Logic without feeling slid into overthinking, rigidity, or avoidance." }
};

// ---------- Sound ----------

const sound = {
  ctx: null,
  on: readPref("bb-sound", "on") === "on",
  ensure() {
    if (!this.on) return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!this.ctx) this.ctx = new AC();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },
  tone(freq, start, dur, { type = "sine", gain = 0.08 } = {}) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, start + dur);
    o.connect(g).connect(ctx.destination);
    o.start(start);
    o.stop(start + dur + 0.05);
  },
  play(kind) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    if (kind === "balanced") {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, t + i * 0.09, 0.9, { type: "triangle", gain: 0.07 }));
    } else if (kind === "emotional" || kind === "logical") {
      const base = kind === "emotional" ? 246.94 : 293.66;
      this.tone(base, t, 0.6, { type: "sine", gain: 0.12 });
      this.tone(base * 1.06, t + 0.12, 0.6, { type: "sine", gain: 0.08 });
    } else if (kind === "tap") {
      this.tone(880, t, 0.12, { type: "sine", gain: 0.03 });
    } else if (kind === "finish") {
      [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(f, t + i * 0.11, 1.4, { type: "triangle", gain: 0.06 }));
    }
  }
};

function readPref(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function writePref(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

// ---------- State ----------

const state = {
  screen: "intro",
  mode: "main",          // "main" | "retrain"
  queue: [],             // scenario indexes for the current run
  pos: 0,
  answers: {},           // scenario id -> first-pass choice type
  retrained: {},         // scenario id -> retrain choice type
  picked: null,
  shuffled: [],
  reflections: ["", "", ""],
  rStep: 0
};

const app = document.getElementById("app");
const backdropImg = document.getElementById("backdrop-img");

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function setBackdrop(src) {
  backdropImg.style.backgroundImage = `url("${src}")`;
}

function preload(src) {
  if (src) { const img = new Image(); img.src = src; }
}

function counts() {
  const c = { emotional: 0, logical: 0, balanced: 0 };
  Object.values(state.answers).forEach((t) => c[t]++);
  return c;
}

// -1 (all heart) .. 0 (balanced) .. 1 (all head)
function lean() {
  const c = counts();
  const total = c.emotional + c.logical + c.balanced;
  // Damp the first few answers so one choice doesn't pin the needle.
  return (c.logical - c.emotional) / Math.max(total, 4);
}

// ---------- Screens ----------

function renderIntro() {
  setBackdrop("assets/title.jpg");
  app.innerHTML = `
    <section class="intro screen">
      <div class="intro__hero" role="img" aria-label="A geometric human profile: the face in burnt orange planes, the back of the head a steel-teal blueprint grid, meeting at a brass circle."></div>
      <div class="intro__content">
        <span class="eyebrow">Emotion &amp; Reason Trainer</span>
        <h1 class="intro__title">Brain<br><em>Balance</em></h1>
        <p class="intro__lede">Your heart reacts fast. Your head likes to overthink. The best decisions use both. Step into ten everyday moments and practice finding the balance.</p>
        <button class="btn btn--primary" id="start">Begin ${ICON.arrow}</button>
        <p class="intro__meta">10 moments &middot; about 8 minutes</p>
      </div>
      <div class="abc-strip">
        ${abcCard("A", "Ask", "What am I feeling? And what's actually happening?")}
        ${abcCard("B", "Balance", "Let the feeling and the facts sit side by side.")}
        ${abcCard("C", "Choose", "Pick the response that honors both.")}
      </div>
    </section>`;
  document.getElementById("start").addEventListener("click", () => {
    sound.play("tap");
    startRun("main", SCENARIOS.map((_, i) => i));
  });
  preload(SCENARIOS[0].image);
}

function abcCard(letter, title, text) {
  return `<div class="abc-card"><span class="abc-card__letter">${letter}</span><div><h3>${title}</h3><p>${text}</p></div></div>`;
}

function startRun(mode, queue) {
  state.mode = mode;
  state.queue = queue;
  state.pos = 0;
  state.screen = "play";
  loadScenario();
}

function loadScenario() {
  const s = SCENARIOS[state.queue[state.pos]];
  state.picked = null;
  state.shuffled = shuffle(s.choices);
  setBackdrop(s.image);
  const next = state.queue[state.pos + 1];
  if (next !== undefined) preload(SCENARIOS[next].image);
  renderPlay(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function progressDots() {
  const total = state.queue.length;
  return Array.from({ length: total }, (_, i) => {
    const s = SCENARIOS[state.queue[i]];
    const source = state.mode === "retrain" ? state.retrained : state.answers;
    const t = source[s.id];
    const cls = i < state.pos || (i === state.pos && state.picked) ? `is-${t}` : i === state.pos ? "is-current" : "";
    return `<span class="progress__dot ${cls}"></span>`;
  }).join("");
}

function renderPlay(fresh = false) {
  const s = SCENARIOS[state.queue[state.pos]];
  const picked = state.picked;
  const total = state.queue.length;
  const retrain = state.mode === "retrain";
  const knob = 50 + lean() * 50;

  app.innerHTML = `
    <section class="play ${fresh ? "screen" : "is-settled"}">
      <header class="topbar">
        <div class="brand">Brain <em>Balance</em></div>
        <div class="progress" aria-label="Moment ${state.pos + 1} of ${total}">
          ${progressDots()}
          <span class="progress__count">${state.pos + 1} / ${total}</span>
        </div>
        <div class="meter" title="Your balance so far">
          <span class="meter__label--heart"><span class="meter__text">Heart</span></span>
          <span class="meter__track" role="img" aria-label="Balance meter"><span class="meter__knob" id="knob" style="left:${knob}%"></span></span>
          <span class="meter__label--head"><span class="meter__text">Head</span></span>
        </div>
      </header>

      <div class="stage">
        <figure class="scene-art" style="margin:0">
          <img src="${s.image}" alt="" />
          ${retrain ? `<div class="retrain-flag"><strong>Watch for: ${esc(s.biasName)}</strong><span>${esc(s.biasDescription)}</span></div>` : ""}
          <figcaption class="scene-art__caption">
            <div class="scene-art__num">${retrain ? "Retrain" : "Moment"} ${String(state.pos + 1).padStart(2, "0")}</div>
            <h2 class="scene-art__title">${esc(s.title)}</h2>
          </figcaption>
        </figure>

        <div class="panel">
          <div class="steps" aria-hidden="true">
            <span class="step ${picked ? "is-done" : "is-active"}"><b>A</b>Ask</span>
            <span class="step ${picked ? "is-done" : "is-active"}"><b>B</b>Balance</span>
            <span class="step ${picked ? "is-active" : ""}"><b>C</b>Choose</span>
          </div>

          <p class="situation">${esc(s.text)}</p>

          <p class="prompt">What would you do?
            <small>${picked ? "Here's how each option leans." : "Ask what you feel and what's true, then pick the response that balances both."}</small>
          </p>

          <div class="choices" role="group" aria-label="Choices">
            ${state.shuffled.map((c, i) => choiceButton(c, i)).join("")}
          </div>

          ${picked ? revealCard(s, picked) : `<p class="kbd-hint">Tip: press 1, 2 or 3 to choose</p>`}
        </div>
      </div>
    </section>`;

  app.querySelectorAll(".choice").forEach((btn) => {
    btn.addEventListener("click", () => choose(Number(btn.dataset.i)));
  });
  const next = document.getElementById("next");
  if (next) next.addEventListener("click", advance);
}

function choiceButton(c, i) {
  const picked = state.picked;
  let cls = `c-${c.type}`;
  if (picked) cls += picked === c ? " is-picked" : " is-dim";
  const tag = picked ? `<span class="choice__tag t-${c.type}">${TYPE[c.type].icon}${TYPE[c.type].label}</span>` : "";
  return `
    <button class="choice ${cls}" data-i="${i}" ${picked ? "disabled" : ""} ${picked === c ? 'aria-current="true"' : ""}>
      <span class="choice__key">${i + 1}</span>
      <span>${esc(c.text)}</span>
      ${tag}
    </button>`;
}

function revealCard(s, picked) {
  const v = VERDICT[picked.type];
  const f = s.feedback;
  const last = state.pos === state.queue.length - 1;
  return `
    <article class="reveal v-${picked.type}" id="reveal" tabindex="-1">
      <div class="verdict">
        <span class="verdict__icon">${TYPE[picked.type].icon}</span>
        <div><h2>${v.title}</h2><p>${v.text}</p></div>
      </div>

      <div class="trap">
        <span class="eyebrow">The trap in this moment</span>
        <strong>${esc(s.biasName)}</strong>
        <p>${esc(s.biasDescription)}</p>
      </div>

      <div class="voices">
        <div class="voice voice--heart"><span class="eyebrow">${ICON.heart}Your heart says</span><p>${esc(f.emotionSignal)}</p></div>
        <div class="voice voice--head"><span class="eyebrow">${ICON.head}Your head says</span><p>${esc(f.logicCheck)}</p></div>
        <div class="voice voice--balance"><span class="eyebrow">${ICON.balance}Together</span><p>${esc(f.balancedInsight)}</p></div>
      </div>

      <ol class="abc-list" aria-label="ABC breakdown">
        <li><b>A</b><p><span>Ask</span>${esc(f.abc.a)}</p></li>
        <li><b>B</b><p><span>Balance</span>${esc(f.abc.b)}</p></li>
        <li><b>C</b><p><span>Choose</span>${esc(f.abc.c)}</p></li>
      </ol>

      <button class="btn btn--primary btn--block" id="next">${last ? "See my balance" : "Next moment"} ${ICON.arrow}</button>
    </article>`;
}

function choose(i) {
  if (state.picked) return;
  const s = SCENARIOS[state.queue[state.pos]];
  const c = state.shuffled[i];
  if (!c) return;
  state.picked = c;
  if (state.mode === "main") state.answers[s.id] = c.type;
  else state.retrained[s.id] = c.type;
  sound.play(c.type);
  renderPlay();
  const reveal = document.getElementById("reveal");
  requestAnimationFrame(() => {
    reveal.scrollIntoView({ behavior: "smooth", block: "start" });
    reveal.focus({ preventScroll: true });
  });
}

function advance() {
  if (state.pos < state.queue.length - 1) {
    state.pos++;
    loadScenario();
  } else {
    state.screen = "results";
    renderResults();
  }
}

// ---------- Results ----------

function profile(c) {
  if (c.balanced >= 8) return {
    title: "Steady <em>Center</em>",
    text: "You consistently let feelings inform you without letting them drive. That's rare, and it's a skill you can keep sharpening."
  };
  if (c.emotional > c.logical) return {
    title: "Heart-<em>Led</em>",
    text: "Your feelings speak first and loudest. That's a gift, because they carry real information. Your practice is the pause: ask what's actually true before you act."
  };
  if (c.logical > c.emotional) return {
    title: "Head-<em>Led</em>",
    text: "You reach for analysis, rules and plans. That's useful until it turns into overthinking or a way to avoid the feeling. Your practice: name the emotion, then let it shape the plan."
  };
  return {
    title: "Pulled Both <em>Ways</em>",
    text: "Sometimes the feeling drives and sometimes the overthinking does. Your practice is the middle path: one honest feeling plus one honest fact, every time."
  };
}

function scaleSVG() {
  return `
    <div class="scale" role="img" aria-label="A balance scale showing your lean between heart and head">
      <svg viewBox="0 0 440 260">
        <defs>
          <linearGradient id="beamGrad" x1="0" x2="1">
            <stop offset="0" stop-color="#d35a20"/><stop offset=".5" stop-color="#c49a45"/><stop offset="1" stop-color="#2c7a80"/>
          </linearGradient>
          <radialGradient id="sun"><stop offset="0" stop-color="#fbf1dc"/><stop offset=".5" stop-color="#c49a45"/><stop offset="1" stop-color="#c49a45" stop-opacity="0"/></radialGradient>
        </defs>
        <circle cx="220" cy="70" r="46" fill="url(#sun)" opacity=".55"/>
        <path d="M220 74 L196 238 H244 Z" fill="rgba(20,24,30,.05)" stroke="rgba(20,24,30,.3)" stroke-width="1.5"/>
        <rect x="150" y="236" width="140" height="8" rx="4" fill="rgba(20,24,30,.18)"/>
        <g class="scale__beam" id="beam"><rect x="56" y="66" width="328" height="8" rx="4" fill="url(#beamGrad)"/></g>
        <g class="scale__pan" id="pan-l" style="transition: transform 1.6s cubic-bezier(.3,1.6,.4,1)">
          <path d="M60 70 L28 150 M60 70 L92 150" stroke="rgba(20,24,30,.35)" stroke-width="1.5"/>
          <path d="M18 150 H102 A42 22 0 0 1 18 150 Z" fill="#d35a20" opacity=".9"/>
          <g transform="translate(48 118) scale(1.05)" color="#d35a20">${ICON.heart.replace("<svg", '<svg width="26" height="26"')}</g>
        </g>
        <g class="scale__pan" id="pan-r" style="transition: transform 1.6s cubic-bezier(.3,1.6,.4,1)">
          <path d="M380 70 L348 150 M380 70 L412 150" stroke="rgba(20,24,30,.35)" stroke-width="1.5"/>
          <path d="M338 150 H422 A42 22 0 0 1 338 150 Z" fill="#2c7a80" opacity=".9"/>
          <g transform="translate(367 118) scale(1.05)" color="#2c7a80">${ICON.head.replace("<svg", '<svg width="26" height="26"')}</g>
        </g>
        <circle cx="220" cy="70" r="9" fill="#ffffff" stroke="#14181e" stroke-width="3"/>
      </svg>
    </div>`;
}

function tiltScale(value) {
  // value: -1 heart-heavy .. 1 head-heavy. Heavier pan sinks.
  const deg = value * 20;
  const rad = (deg * Math.PI) / 180;
  const r = 160;
  const beam = document.getElementById("beam");
  const panL = document.getElementById("pan-l");
  const panR = document.getElementById("pan-r");
  if (!beam) return;
  beam.style.transform = `rotate(${deg}deg)`;
  panL.style.transform = `translate(${r - r * Math.cos(rad)}px, ${-r * Math.sin(rad)}px)`;
  panR.style.transform = `translate(${-(r - r * Math.cos(rad))}px, ${r * Math.sin(rad)}px)`;
}

function renderResults() {
  const c = counts();
  const p = profile(c);
  const missed = SCENARIOS.filter((s) => state.answers[s.id] !== "balanced");
  const hasRetrained = Object.keys(state.retrained).length > 0;
  const stillMissed = missed.filter((s) => state.retrained[s.id] !== "balanced");
  setBackdrop("assets/title.jpg");
  sound.play("finish");

  const trapRows = missed.map((s) => {
    const fixed = state.retrained[s.id] === "balanced";
    return `
      <div class="trap-row">
        <img src="${s.image}" alt="" />
        <div><strong>${esc(s.biasName)}${fixed ? '<span class="fixed">Rebalanced</span>' : ""}</strong><span>${esc(s.title)}: ${esc(s.biasDescription)}</span></div>
      </div>`;
  }).join("");

  const retrainLabel = hasRetrained
    ? (stillMissed.length ? `Retrain the ${stillMissed.length} still tipping` : "")
    : `Retrain my ${missed.length} blind spot${missed.length === 1 ? "" : "s"}`;
  const canRetrain = hasRetrained ? stillMissed.length > 0 : missed.length > 0;
  const retrainQueue = (hasRetrained ? stillMissed : missed).map((s) => SCENARIOS.indexOf(s));

  app.innerHTML = `
    <section class="results screen">
      <span class="eyebrow">Your balance profile</span>
      <h1>${p.title}</h1>
      ${scaleSVG()}
      <p class="results__lede">${p.text}</p>

      <div class="stats">
        <div class="stat stat--heart"><b>${c.emotional}</b><span>Heart-led</span></div>
        <div class="stat stat--balanced"><b>${c.balanced}</b><span>Balanced</span></div>
        <div class="stat stat--head"><b>${c.logical}</b><span>Head-led</span></div>
      </div>

      <div class="actions">
        ${canRetrain ? `<button class="btn btn--primary" id="retrain">${ICON.replay}${retrainLabel}</button>` : ""}
        <button class="btn ${canRetrain ? "btn--ghost" : "btn--primary"}" id="reflect">Reflect &amp; finish ${ICON.arrow}</button>
      </div>

      ${missed.length ? `
        <div class="traps">
          <h3>Where you tipped</h3>
          ${trapRows}
        </div>` : ""}
    </section>`;

  requestAnimationFrame(() => requestAnimationFrame(() => tiltScale(lean())));
  window.scrollTo({ top: 0 });

  const retrainBtn = document.getElementById("retrain");
  if (retrainBtn) retrainBtn.addEventListener("click", () => {
    sound.play("tap");
    retrainQueue.forEach((i) => delete state.retrained[SCENARIOS[i].id]);
    startRun("retrain", retrainQueue);
  });
  document.getElementById("reflect").addEventListener("click", () => {
    sound.play("tap");
    state.screen = "reflect";
    state.rStep = 0;
    renderReflect();
  });
}

// ---------- Reflection ----------

function renderReflect() {
  const i = state.rStep;
  const last = i === REFLECTIONS.length - 1;
  app.innerHTML = `
    <section class="reflect screen">
      <span class="reflect__count">Reflection ${i + 1} of ${REFLECTIONS.length}</span>
      <h2>${esc(REFLECTIONS[i])}</h2>
      <textarea id="answer" placeholder="Write a few words, or just think it through…" aria-label="Your reflection">${esc(state.reflections[i])}</textarea>
      <p class="reflect__note">Your answers stay on this screen. Nothing is saved or sent.</p>
      <div class="actions">
        ${i > 0 ? `<button class="btn btn--ghost" id="back">Back</button>` : ""}
        <button class="btn btn--primary" id="forward">${last ? "Finish" : "Continue"} ${ICON.arrow}</button>
      </div>
    </section>`;
  const ta = document.getElementById("answer");
  ta.addEventListener("input", () => { state.reflections[i] = ta.value; });
  const back = document.getElementById("back");
  if (back) back.addEventListener("click", () => { state.rStep--; renderReflect(); });
  document.getElementById("forward").addEventListener("click", () => {
    sound.play("tap");
    if (last) { state.screen = "finale"; renderFinale(); }
    else { state.rStep++; renderReflect(); }
  });
}

function renderFinale() {
  const pledge = state.reflections[2].trim();
  sound.play("finish");
  app.innerHTML = `
    <section class="finale screen">
      <span class="eyebrow">Training complete</span>
      <h1>Heart and head,<br><em>working together.</em></h1>
      ${scaleSVG()}
      <div class="pledge">
        <span class="eyebrow">${pledge ? "Your balance pledge" : "Carry this with you"}</span>
        <p>${pledge ? esc(pledge) : "When a feeling rises: Ask what it's telling me and what's true. Balance the two. Then Choose."}</p>
      </div>
      <div class="actions">
        <button class="btn btn--primary" id="again">${ICON.replay}Play again</button>
      </div>
    </section>`;
  // Start at the player's lean, then settle level.
  tiltScale(lean());
  setTimeout(() => tiltScale(0), 500);
  window.scrollTo({ top: 0 });
  document.getElementById("again").addEventListener("click", () => {
    Object.assign(state, { answers: {}, retrained: {}, reflections: ["", "", ""], rStep: 0, screen: "intro" });
    renderIntro();
    window.scrollTo({ top: 0 });
  });
}

// ---------- Global controls ----------

const toggle = document.getElementById("sound-toggle");
function syncToggle() {
  toggle.setAttribute("aria-pressed", String(sound.on));
  toggle.setAttribute("aria-label", sound.on ? "Sound on" : "Sound off");
}
toggle.addEventListener("click", () => {
  sound.on = !sound.on;
  writePref("bb-sound", sound.on ? "on" : "off");
  syncToggle();
  if (sound.on) sound.play("tap");
});
syncToggle();

document.addEventListener("keydown", (e) => {
  if (state.screen !== "play" || e.target.tagName === "TEXTAREA") return;
  if (!state.picked && ["1", "2", "3"].includes(e.key)) {
    choose(Number(e.key) - 1);
  } else if (state.picked && (e.key === "Enter" || e.key === "ArrowRight") && !(e.target instanceof HTMLButtonElement)) {
    e.preventDefault();
    advance();
  }
});

renderIntro();
