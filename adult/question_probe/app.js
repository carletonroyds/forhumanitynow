(() => {
  "use strict";

  const SCENES = window.SCENARIOS;
  const TOTAL = SCENES.length;
  const MAX = TOTAL * 3;
  const DIMS = { c: "Context", s: "Specifics", o: "Openness" };
  const $ = s => document.querySelector(s);
  const pad = n => String(n).padStart(2, "0");
  const say = m => { $("#live").textContent = m; };
  const isPhone = () => window.matchMedia("(max-width: 600px)").matches;
  function setStage(screenSel, stage, focusSel) {
    $(screenSel).dataset.mstage = stage;
    if (!isPhone()) return;
    window.scrollTo({ top: 0 });
    if (focusSel) { const el = $(focusSel); if (el) { if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); } }
  }
  function setTab(tab) {
    $("#resultScreen").dataset.mtab = tab;
    document.querySelectorAll(".m-tabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
    if (isPhone()) window.scrollTo({ top: 0 });
  }
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- Sound ---------- */
  const sound = {
    on: true,
    good: new Audio("assets/audio/correct-bell-ding.mp3"),
    bad: new Audio("assets/audio/incorrect-low-tone.mp3"),
    play(name) {
      if (!this.on) return;
      const a = this[name];
      a.volume = name === "good" ? .35 : .22;
      a.currentTime = 0;
      a.play().catch(() => {});
    }
  };

  /* ---------- Backdrop crossfade ---------- */
  const layers = [$("#bgA"), $("#bgB")];
  let front = 0, currentBg = "";
  function setBg(src) {
    if (src === currentBg) return;
    currentBg = src;
    const next = layers[1 - front];
    next.style.backgroundImage = `url("${src}")`;
    next.classList.add("on");
    layers[front].classList.remove("on");
    front = 1 - front;
  }
  [...new Set(SCENES.map(s => s.bg))].forEach(src => { const i = new Image(); i.src = src; });

  /* ---------- State ---------- */
  let state;
  const fresh = () => ({ screen: "intro", idx: 0, order: [], picks: [], locked: false });
  const points = opt => opt.dims.length;

  function show(name, focusSel) {
    state.screen = name;
    ["intro", "play", "result"].forEach(k => { $(`#${k}Screen`).hidden = k !== name; });
    if (name === "intro") $("#introScreen").dataset.mstage = "copy";
    if (name === "result") setTab("summary");
    $("#restartBtn").hidden = name === "intro";
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (focusSel) requestAnimationFrame(() => $(focusSel).focus({ preventScroll: true }));
  }

  /* Question text carries [c:...] [s:...] [o:...] markup naming the phrase that supplies each quality. */
  const plain = t => t.replace(/\[[cso]:([^\]]+)\]/g, "$1");
  const marked = (t, delay = 0) => { let k = 0; return t.replace(/\[([cso]):([^\]]+)\]/g, (_, d, txt) => `<mark class="hl" data-d="${d}" title="${DIMS[d]}" style="--delay:${delay + k++ * .35}s">${txt}</mark>`); };
  const signal = dims => `<span class="sig" aria-label="${Object.keys(DIMS).filter(d => dims.includes(d)).map(d => DIMS[d]).join(", ") || "None of the three qualities"}">${Object.keys(DIMS).map(d => `<i class="${dims.includes(d) ? "on" : ""}" data-d="${d}" aria-hidden="true">${d.toUpperCase()}</i>`).join("")}</span>`;

  /* ---------- Intro ---------- */
  let anatomyTimer;
  function playAnatomy() {
    const a = $("#anatomy");
    clearTimeout(anatomyTimer);
    a.classList.remove("lit");
    const cycle = () => {
      a.classList.remove("lit"); void a.offsetWidth;
      anatomyTimer = setTimeout(() => { a.classList.add("lit"); anatomyTimer = setTimeout(cycle, 7000); }, 1800);
    };
    cycle();
  }
  function toIntro() {
    state = fresh();
    setBg("assets/bg-intro-title.webp");
    show("intro");
    playAnatomy();
  }

  /* ---------- Play ---------- */
  function start() {
    clearTimeout(anatomyTimer);
    state = fresh();
    show("play", "#sceneTitle");
    renderScene();
  }

  function renderTrack() {
    $("#track").innerHTML = SCENES.map((_, i) => {
      const p = state.picks[i];
      const cls = p ? `p${points(p)}` : i === state.idx ? "now" : "";
      return `<span class="${cls}"></span>`;
    }).join("");
    const total = state.picks.reduce((n, p) => n + points(p), 0);
    $("#hudScore").textContent = `${total} pts`;
    $("#hudCount").textContent = `${pad(state.idx + 1)} / ${TOTAL}`;
  }

  function renderScene() {
    const sc = SCENES[state.idx];
    state.locked = false;
    state.order = shuffle(sc.options);
    setBg(sc.bg);
    renderTrack();
    $("#sceneDomain").textContent = `${pad(state.idx + 1)} · ${sc.domain}`;
    $("#sceneTitle").textContent = sc.title;
    $("#sceneText").textContent = sc.text;
    $("#sceneGoal").textContent = sc.goal;
    $("#verdict").hidden = true;
    $("#mReviewBtn").hidden = true;
    $("#sceneText").classList.remove("expanded");
    setStage("#playScreen", "scene");
    $("#options").innerHTML = state.order.map((o, i) => `
      <button class="option" type="button" data-i="${i}">
        <span class="option-key" aria-hidden="true">${i + 1}</span>
        <span class="option-text">${plain(o.text)}</span>
      </button>`).join("");
    [...$("#options").children].forEach(b => b.addEventListener("click", () => choose(Number(b.dataset.i))));
    say(`Conversation ${state.idx + 1} of ${TOTAL}: ${sc.title}. ${sc.text} ${sc.goal} Choose one of three questions.`);
  }

  function choose(i) {
    if (state.locked) return;
    state.locked = true;
    const sc = SCENES[state.idx];
    const pick = state.order[i];
    const pts = points(pick);
    state.picks[state.idx] = pick;

    [...$("#options").children].forEach((b, k) => {
      const o = state.order[k];
      const isBest = points(o) === 3, isPick = k === i;
      b.disabled = true;
      b.classList.add(isBest ? "best" : "other");
      if (isPick) b.classList.add("chosen");
      const tag = isBest && isPick ? "Your choice · strongest" : isBest ? "Strongest" : isPick ? "Your choice" : "";
      b.querySelector(".option-text").innerHTML = marked(o.text, .15 + k * .1);
      b.insertAdjacentHTML("beforeend", `<div class="analysis"><div class="analysis-head">${tag ? `<span class="tag">${tag}</span>` : "<span></span>"}${signal(o.dims)}</div><p class="note">${o.note}</p></div>`);
    });

    const missing = Object.keys(DIMS).filter(d => !pick.dims.includes(d)).map(d => DIMS[d].toLowerCase());
    const lines = [
      "Missing all three qualities",
      `Missing ${missing.join(" and ")}`,
      `Close · missing ${missing[0]}`,
      "The strongest question"
    ];
    $("#verdictKicker").textContent = lines[pts];
    $("#verdictPts").innerHTML = `+${pts}<small>pts</small>`;
    $("#verdictWhy").textContent = sc.lesson;
    $("#nextBtn").innerHTML = state.idx < TOTAL - 1 ? `Next conversation <span aria-hidden="true">→</span>` : `See your profile <span aria-hidden="true">→</span>`;
    $("#verdict").hidden = false;

    renderTrack();
    const hs = $("#hudScore"); hs.classList.remove("bump"); void hs.offsetWidth; hs.classList.add("bump");
    sound.play(pts === 3 ? "good" : "bad");
    $("#mReviewBtn").hidden = false;
    if (isPhone()) $("#mReviewBtn").focus({ preventScroll: true });
    else {
      $("#nextBtn").focus({ preventScroll: true });
      setTimeout(() => $("#verdict").scrollIntoView({ behavior: "smooth", block: "nearest" }), 250);
    }
    say(`${lines[pts]}. Plus ${pts} points. ${sc.lesson}`);
  }

  function next() {
    if (!state.locked) return;
    if (state.idx < TOTAL - 1) {
      state.idx++;
      renderScene();
      window.scrollTo({ top: 0, behavior: "smooth" });
      $("#sceneTitle").focus({ preventScroll: true });
    } else results();
  }

  /* ---------- Results ---------- */
  const RANKS = [
    [27, "Master questioner", "You ask the questions that move things forward.", "Your instincts consistently combine a reason, the facts and genuine curiosity. That's rare, and it's why people tend to tell you more."],
    [21, "Skilled inquirer", "Your questions usually open the right doors.", "Most of your choices carried two or three of the qualities. The profile below shows which one slips when the stakes rise."],
    [14, "Developing questioner", "You have good instincts and room to sharpen them.", "You often reach for one or two qualities and leave the third behind. Notice which one, and practise adding it before you speak."],
    [0, "Starting point", "Every strong questioner started by noticing this.", "Strong questions are a skill, not a temperament. Review the conversations below to see what the strongest version adds each time."]
  ];
  const COACH = {
    c: ["Lead with the why.", "Your questions often skip the reason you're asking. One sentence about what's at stake (a deadline, a worry, what matters to you) gives the other person a reason to engage instead of guess."],
    s: ["Bring the evidence.", "Your questions tend to stay general. Before a difficult conversation, write down one date, one figure or one example. Specifics turn a feeling into something the other person can act on."],
    o: ["Leave the door open.", "Your questions often contain their own answer, or a verdict. End with “what”, “how” or “what would it take”, and ask about their view before proposing yours."]
  };

  function results() {
    const total = state.picks.reduce((n, p) => n + points(p), 0);
    const counts = { c: 0, s: 0, o: 0 };
    state.picks.forEach(p => [...p.dims].forEach(d => counts[d]++));
    const [, rank, title, summary] = RANKS.find(r => total >= r[0]);

    setBg("assets/bg-history-screen.webp");
    show("result", "#resultTitle");
    $("#rankTag").textContent = rank;
    $("#resultTitle").textContent = title;
    $("#resultSummary").textContent = summary;

    const dial = $("#scoreDial");
    dial.style.setProperty("--p", 0);
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
      $("#scoreNum").textContent = Math.round(total * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(() => { dial.style.setProperty("--p", total / MAX); requestAnimationFrame(tick); });

    $("#profileBars").innerHTML = `<p class="eyebrow">Your question profile</p>` + Object.keys(DIMS).map(d => `
      <div class="bar-row" data-d="${d}">
        <div class="bar-label"><b>${DIMS[d]}</b><span>${counts[d]} / ${TOTAL}</span></div>
        <div class="bar"><i data-w="${counts[d] / TOTAL * 100}"></i></div>
      </div>`).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll(".bar i").forEach(i => { i.style.width = i.dataset.w + "%"; })));

    const weakest = Object.keys(counts).sort((a, b) => counts[a] - counts[b])[0];
    $("#coach").innerHTML = counts[weakest] === TOTAL
      ? `<p class="eyebrow">Next step</p><h3>Take it off the page.</h3><p>You chose the strongest question every time. In your next difficult conversation, try writing the question down first, then check it for context, specifics and openness before you ask it.</p>`
      : `<p class="eyebrow">Your growth edge · ${DIMS[weakest]}</p><h3>${COACH[weakest][0]}</h3><p>${COACH[weakest][1]}</p>`;

    $("#review").innerHTML = SCENES.map((sc, i) => {
      const p = state.picks[i], best = sc.options.find(o => points(o) === 3), pts = points(p);
      return `
        <details class="r-item"${isPhone() ? " open" : ""}>
          <summary>
            <span class="r-num">${pad(i + 1)}</span>
            <span class="r-title">${sc.title}<small>${sc.domain}</small></span>
            <span class="r-pts" aria-label="${pts} of 3 points">${[0, 1, 2].map(k => `<i class="${k < pts ? "on" : ""}"></i>`).join("")}</span>
            <span class="r-chev" aria-hidden="true">⌄</span>
          </summary>
          <div class="r-body">
            <div class="r-q${pts === 3 ? " best-q" : ""}"><h4>${pts === 3 ? "You asked · strongest" : "You asked"}${signal(p.dims)}</h4><p>“${marked(p.text)}”</p></div>
            ${pts === 3 ? "" : `<div class="r-q best-q"><h4>Strongest${signal(best.dims)}</h4><p>“${marked(best.text)}”</p></div>`}
            <p class="r-lesson">${sc.lesson}</p>
          </div>
        </details>`;
    }).join("");

    sound.play(total >= 21 ? "good" : "bad");
    say(`${rank}. ${total} of ${MAX} points. ${title}`);
  }

  /* ---------- Wiring ---------- */
  $("#startBtn").addEventListener("click", start);
  $("#mStartBtn").addEventListener("click", start);
  $("#mIntroBtn").addEventListener("click", () => setStage("#introScreen", "anatomy", "#anatomy"));
  $("#mSceneBtn").addEventListener("click", () => setStage("#playScreen", "decide", "#askLabel"));
  $("#mReviewBtn").addEventListener("click", () => setStage("#playScreen", "review", "#options"));
  $("#sceneText").addEventListener("click", () => { if (isPhone()) $("#sceneText").classList.toggle("expanded"); });
  document.querySelectorAll(".m-tabs button").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
  $("#nextBtn").addEventListener("click", next);
  $("#againBtn").addEventListener("click", start);
  $("#toIntroBtn").addEventListener("click", toIntro);
  $("#restartBtn").addEventListener("click", toIntro);
  $("#homeBtn").addEventListener("click", toIntro);
  $("#soundBtn").addEventListener("click", () => {
    sound.on = !sound.on;
    $("#soundBtn").textContent = sound.on ? "Sound on" : "Sound off";
    $("#soundBtn").setAttribute("aria-pressed", String(sound.on));
  });
  document.addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (state.screen === "intro" && e.key === "Enter" && document.activeElement === document.body) { e.preventDefault(); start(); return; }
    if (state.screen !== "play") return;
    const n = parseInt(e.key, 10);
    if (!state.locked && n >= 1 && n <= 3) { e.preventDefault(); choose(n - 1); }
    else if (state.locked && e.key === "Enter" && document.activeElement !== $("#nextBtn")) { e.preventDefault(); next(); }
  });

  toIntro();
})();
