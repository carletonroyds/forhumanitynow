import Phaser from 'phaser';
import * as Tone from 'tone';
import { scenarioData } from './scenarios.js';

// ── Grayscale shader pipeline ────────────────────────────────────────────────
class GrayscalePostFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game,
            renderTarget: true,
            fragShader: `
            precision mediump float;
            uniform sampler2D uMainSampler;
            varying vec2 outTexCoord;
            void main(void) {
                vec4 c = texture2D(uMainSampler, outTexCoord);
                float g = dot(c.rgb, vec3(0.299, 0.587, 0.114));
                gl_FragColor = vec4(vec3(g), c.a);
            }
            `
        });
    }
}

// ── Phaser config ────────────────────────────────────────────────────────────
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: '100%',
        height: '100%'
    },
    backgroundColor: '#050505',
    pipeline: { GrayscalePostFX },
    scene: { preload, create, update }
};

new Phaser.Game(config);

// ── Game state ───────────────────────────────────────────────────────────────
let gs;                          // game scene reference
let currentScenarioIndex = 0;
let score = 0;
let streak = 0;
let maxStreak = 0;
let synth;
let isSecondPass = false;
let currentScreen = 'start';    // 'start' | 'scenario' | 'feedback' | 'end'
let lastFeedbackState = null;   // { data, isCorrect }
let currentOptionBtns = [];

// ── Lifecycle ────────────────────────────────────────────────────────────────
function preload() {
    scenarioData.forEach((d, i) => {
        this.load.image(`scen_${i}_p1`, d.images.pass1);
        this.load.image(`scen_${i}_p2`, d.images.pass2);
    });
}

function create() {
    gs = this;
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.set({ envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 } });
    gs.scale.on('resize', rerenderScreen);
    showStartScreen();
}

function update() {}

function rerenderScreen() {
    if (currentScreen === 'start')    showStartScreen();
    else if (currentScreen === 'scenario') loadScenario();
    else if (currentScreen === 'feedback' && lastFeedbackState)
        showFeedback(lastFeedbackState.data, lastFeedbackState.isCorrect);
    else if (currentScreen === 'end') showEndScreen();
}

// ── Layout helpers ───────────────────────────────────────────────────────────
function sizes() {
    const { width, height } = gs.scale;
    return {
        width, height,
        isDesktop: width >= 900,
        isMid: width >= 600
    };
}

function centerContainer(container, cardW, cardH, width, height) {
    const maxH = height * 0.95;
    if (cardH > maxH) {
        const s = maxH / cardH;
        container.setScale(s);
        container.setPosition((width - cardW * s) / 2, (height - cardH * s) / 2);
    } else {
        container.setScale(1);
        container.setPosition((width - cardW) / 2, (height - cardH) / 2);
    }
}

function drawCard(g, w, h) {
    g.clear();
    g.fillStyle(0x050510, 0.97);
    g.fillRoundedRect(0, 0, w, h, 14);
    g.lineStyle(1, 0x00ffff, 0.45);
    g.strokeRoundedRect(0, 0, w, h, 14);
}

function drawBtnGfx(g, w, h, color, alpha) {
    g.clear();
    g.fillStyle(color, alpha);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    g.lineStyle(2, color, 0.85);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
}

/**
 * Creates a button container at (x, y) local coords.
 * Returns { container, bg, label, w, h } where h is the actual rendered height.
 */
function makeBtn(x, y, text, w, minH, fontSize, callback) {
    const label = gs.add.text(0, 0, text, {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${fontSize}px`,
        color: '#00ffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: w - 28 }
    }).setOrigin(0.5);

    const h = Math.max(minH, label.displayHeight + 22);
    const bg = gs.add.graphics();
    drawBtnGfx(bg, w, h, 0xff00ff, 0.08);

    const container = gs.add.container(x, y + h / 2, [bg, label]);
    container.setInteractive(
        new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
        Phaser.Geom.Rectangle.Contains
    );
    container.on('pointerover', () => {
        document.body.style.cursor = 'pointer';
        drawBtnGfx(bg, w, h, 0x00ffff, 0.18);
        label.setColor('#ff00ff');
    });
    container.on('pointerout', () => {
        document.body.style.cursor = 'default';
        drawBtnGfx(bg, w, h, 0xff00ff, 0.08);
        label.setColor('#00ffff');
    });
    container.on('pointerdown', () => {
        document.body.style.cursor = 'default';
        callback();
    });

    return { container, bg, label, w, h };
}

// ── Screens ──────────────────────────────────────────────────────────────────
function showStartScreen() {
    currentScreen = 'start';
    gs.children.removeAll();
    const { width, height, isDesktop, isMid } = sizes();

    const titleSz  = isDesktop ? 46 : isMid ? 32 : 24;
    const subSz    = isDesktop ? 22 : isMid ? 17 : 13;
    const instrSz  = isDesktop ? 16 : isMid ? 14 : 12;
    const btnSz    = isDesktop ? 22 : isMid ? 18 : 15;
    const pad      = isDesktop ? 48 : 28;
    const cardW    = isDesktop ? Math.min(640, width * 0.85) : width * 0.92;
    const cw       = cardW - pad * 2;
    const btnH     = isDesktop ? 64 : 52;
    const btnW     = Math.min(cw, isDesktop ? 300 : 220);

    // BG gradient
    const bg = gs.add.graphics();
    bg.fillGradientStyle(0x050505, 0x050505, 0x0a0a1a, 0x0a0a1a, 1);
    bg.fillRect(0, 0, width, height);

    let y = pad;

    const title = gs.add.text(cardW / 2, y, 'QUESTION QUEST', {
        fontFamily: 'Arial Black, sans-serif',
        fontSize: `${titleSz}px`,
        fontStyle: 'bold',
        color: '#00ffff',
        align: 'center',
        stroke: '#ff00ff',
        strokeThickness: isDesktop ? 2 : 1,
        shadow: { blur: 18, color: '#00ffff', fill: true },
        wordWrap: { width: cw }
    }).setOrigin(0.5, 0);
    y += title.displayHeight + 6;

    const sub = gs.add.text(cardW / 2, y, 'BIG PICTURE + DETAILS', {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${subSz}px`,
        color: '#ff00ff',
        fontStyle: 'bold',
        align: 'center'
    }).setOrigin(0.5, 0);
    y += sub.displayHeight + 14;

    const instr = gs.add.text(cardW / 2, y,
        'Train your brain to ask questions that actually help', {
        fontFamily: 'Arial, sans-serif',
        fontSize: `${instrSz}px`,
        color: '#ffd900',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: cw }
    }).setOrigin(0.5, 0);
    y += instr.displayHeight + 28;

    const { container: startBtn, h: sbH } = makeBtn(
        cardW / 2, y, 'START MISSION', btnW, btnH, btnSz,
        () => { playSfx('C4', '8n'); startQuest(); }
    );
    y += sbH;

    const cardH = y + pad;
    const cardGfx = gs.add.graphics();
    drawCard(cardGfx, cardW, cardH);

    const mc = gs.add.container(0, 0, [cardGfx, title, sub, instr, startBtn]);
    centerContainer(mc, cardW, cardH, width, height);

    gs.tweens.add({ targets: title, alpha: 0.8, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
}

function startQuest() {
    currentScenarioIndex = 0;
    score = 0; streak = 0; maxStreak = 0;
    loadScenario();
}

function loadScenario() {
    currentScreen = 'scenario';
    gs.children.removeAll();
    currentOptionBtns = [];
    const { width, height, isDesktop, isMid } = sizes();
    const data = scenarioData[currentScenarioIndex];

    const sitSz   = isDesktop ? 20 : isMid ? 16 : 13;
    const promptSz = isDesktop ? 14 : isMid ? 13 : 11;
    const btnSz   = isDesktop ? 16 : isMid ? 14 : 12;
    const hudSz   = isDesktop ? 14 : 12;
    const pad     = isDesktop ? 36 : 20;
    const cardW   = isDesktop ? Math.min(760, width * 0.9) : width * 0.95;
    const cw      = cardW - pad * 2;
    const minBtnH = isDesktop ? 52 : isMid ? 46 : 40;

    const bg = gs.add.graphics();
    bg.fillGradientStyle(0x050505, 0x050505, 0x0a0a1a, 0x0a0a1a, 1);
    bg.fillRect(0, 0, width, height);

    let y = pad;

    // HUD
    const progressT = gs.add.text(pad, y,
        `Question ${currentScenarioIndex + 1} / ${scenarioData.length}`, {
        fontFamily: 'Arial, sans-serif', fontSize: `${hudSz}px`,
        color: '#00ffff', fontStyle: 'bold'
    }).setOrigin(0, 0);

    const streakT = gs.add.text(cardW - pad, y, `Streak: ${streak}`, {
        fontFamily: 'Arial, sans-serif', fontSize: `${hudSz}px`,
        color: '#ff00ff', fontStyle: 'bold'
    }).setOrigin(1, 0);

    y += Math.max(progressT.displayHeight, streakT.displayHeight) + 12;

    // Scenario image (grayscale)
    const imgMaxH = isDesktop ? 260 : isMid ? 195 : 145;
    const imgH = Math.min(imgMaxH, cw * 9 / 16);
    const imgKey = isSecondPass ? `scen_${currentScenarioIndex}_p2` : `scen_${currentScenarioIndex}_p1`;
    const scenImg = gs.add.image(cardW / 2, y + imgH / 2, imgKey).setDisplaySize(cw, imgH);
    if (gs.renderer.type === Phaser.WEBGL) scenImg.setPostPipeline('GrayscalePostFX');
    else scenImg.setTint(0x888888);
    y += imgH + 14;

    // Situation
    const sitT = gs.add.text(cardW / 2, y, data.situation, {
        fontFamily: 'Arial, sans-serif', fontSize: `${sitSz}px`,
        color: '#ffffff', fontStyle: 'bold', align: 'center',
        wordWrap: { width: cw }
    }).setOrigin(0.5, 0);
    y += sitT.displayHeight + 8;

    // Prompt
    const promptT = gs.add.text(cardW / 2, y,
        'Which question would lead to the best answer?', {
        fontFamily: 'Arial, sans-serif', fontSize: `${promptSz}px`,
        color: '#ffd900', fontStyle: 'italic', align: 'center',
        wordWrap: { width: cw }
    }).setOrigin(0.5, 0);
    y += promptT.displayHeight + 14;

    // Answer buttons (shuffled)
    const shuffled = Phaser.Utils.Array.Shuffle([...data.options]);
    const optBtns = [];
    shuffled.forEach(opt => {
        let result;
        result = makeBtn(cardW / 2, y, opt.text, cw, minBtnH, btnSz,
            () => handleChoice(opt, result.container, scenImg));
        result.container.y = y + result.h / 2;
        y += result.h + 8;
        optBtns.push(result.container);
    });
    currentOptionBtns = optBtns;

    const cardH = y + pad;
    const cardGfx = gs.add.graphics();
    drawCard(cardGfx, cardW, cardH);

    const mc = gs.add.container(0, 0,
        [cardGfx, progressT, streakT, scenImg, sitT, promptT, ...optBtns]);
    centerContainer(mc, cardW, cardH, width, height);
}

function handleChoice(option, btn, scenImg) {
    const data = scenarioData[currentScenarioIndex];
    const isCorrect = option.type === 'best';

    currentOptionBtns.forEach(b => b.disableInteractive());

    // Flash selected
    const bg = btn.getAt(0);
    gs.tweens.add({ targets: bg, alpha: 0.4, duration: 80, yoyo: true, repeat: 3 });

    gs.time.delayedCall(380, () => {
        if (isCorrect) {
            score++; streak++;
            if (streak > maxStreak) maxStreak = streak;
            playSfx('E5', '8n');
        } else {
            streak = 0;
            playSfx('G3', '8n');
        }
        lastFeedbackState = { data, isCorrect };
        showFeedback(data, isCorrect);
    });
}

function showFeedback(data, isCorrect) {
    currentScreen = 'feedback';
    gs.children.removeAll();
    const { width, height, isDesktop, isMid } = sizes();

    const statusSz = isDesktop ? 26 : isMid ? 20 : 16;
    const headSz   = isDesktop ? 15 : isMid ? 13 : 12;
    const bodySz   = isDesktop ? 14 : isMid ? 12 : 11;
    const btnSz    = isDesktop ? 18 : isMid ? 16 : 14;
    const pad      = isDesktop ? 40 : 24;
    const cardW    = isDesktop ? Math.min(720, width * 0.88) : width * 0.95;
    const cw       = cardW - pad * 2;
    const btnH     = isDesktop ? 58 : 50;
    const btnW     = Math.min(cw, isDesktop ? 260 : 200);

    const bg = gs.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRect(0, 0, width, height);

    let y = pad;

    // Status
    const statusT = gs.add.text(cardW / 2, y,
        isCorrect ? '✓  STREAK +1' : '✗  STREAK RESET', {
        fontFamily: 'Arial, sans-serif', fontSize: `${statusSz}px`,
        fontStyle: 'bold', color: isCorrect ? '#00ff88' : '#ff4444',
        align: 'center'
    }).setOrigin(0.5, 0);
    y += statusT.displayHeight + 14;

    // Divider
    const div = gs.add.graphics();
    div.lineStyle(1, 0x00ffff, 0.3);
    div.lineBetween(pad, y, cardW - pad, y);
    y += 16;

    // Teaching sections
    const sections = [
        { head: 'Big Picture', body: 'Wider context, patterns, goals, and consequences.' },
        { head: 'Details',     body: 'Specific facts, evidence, timing, and direct results.' },
        { head: 'Best Question', body: data.explanation }
    ];
    const sectionItems = [];
    sections.forEach(sec => {
        const headT = gs.add.text(pad, y, sec.head, {
            fontFamily: 'Arial, sans-serif', fontSize: `${headSz}px`,
            color: '#ff00ff', fontStyle: 'bold'
        }).setOrigin(0, 0);
        y += headT.displayHeight + 3;

        const bodyT = gs.add.text(pad, y, sec.body, {
            fontFamily: 'Arial, sans-serif', fontSize: `${bodySz}px`,
            color: '#ccffff', wordWrap: { width: cw }
        }).setOrigin(0, 0);
        y += bodyT.displayHeight + 14;
        sectionItems.push(headT, bodyT);
    });

    y += 4;

    const isLast = currentScenarioIndex >= scenarioData.length - 1;
    const { container: nextBtn, h: nbH } = makeBtn(
        cardW / 2, y,
        isLast ? 'SEE RESULTS' : 'NEXT SCENARIO',
        btnW, btnH, btnSz,
        () => advanceQuest()
    );
    y += nbH;

    const cardH = y + pad;
    const cardGfx = gs.add.graphics();
    drawCard(cardGfx, cardW, cardH);

    const mc = gs.add.container(0, 0,
        [cardGfx, statusT, div, ...sectionItems, nextBtn]);
    centerContainer(mc, cardW, cardH, width, height);
}

function advanceQuest() {
    currentScenarioIndex++;
    if (currentScenarioIndex < scenarioData.length) loadScenario();
    else showEndScreen();
}

function showEndScreen() {
    currentScreen = 'end';
    gs.children.removeAll();
    const { width, height, isDesktop, isMid } = sizes();

    const titleSz = isDesktop ? 38 : isMid ? 28 : 22;
    const scoreSz = isDesktop ? 24 : isMid ? 19 : 15;
    const msgSz   = isDesktop ? 17 : isMid ? 14 : 12;
    const statsSz = isDesktop ? 19 : isMid ? 15 : 13;
    const btnSz   = isDesktop ? 20 : isMid ? 17 : 14;
    const pad     = isDesktop ? 44 : 28;
    const cardW   = isDesktop ? Math.min(640, width * 0.85) : width * 0.92;
    const cw      = cardW - pad * 2;
    const btnH    = isDesktop ? 60 : 52;
    const btnW    = Math.min(cw, isDesktop ? 280 : 220);

    const bg = gs.add.graphics();
    bg.fillGradientStyle(0x050505, 0x050505, 0x0a0a1a, 0x0a0a1a, 1);
    bg.fillRect(0, 0, width, height);

    let y = pad;

    const titleT = gs.add.text(cardW / 2, y, 'MISSION COMPLETE', {
        fontFamily: 'Arial Black, sans-serif', fontSize: `${titleSz}px`,
        fontStyle: 'bold', color: '#00ffff', align: 'center',
        shadow: { blur: 14, color: '#00ffff', fill: true },
        wordWrap: { width: cw }
    }).setOrigin(0.5, 0);
    y += titleT.displayHeight + 10;

    const scoreT = gs.add.text(cardW / 2, y,
        `Final Score: ${score} / ${scenarioData.length}`, {
        fontFamily: 'Arial, sans-serif', fontSize: `${scoreSz}px`,
        color: '#ff00ff', fontStyle: 'bold', align: 'center'
    }).setOrigin(0.5, 0);
    y += scoreT.displayHeight + 10;

    let message = score <= 3
        ? "You're just getting started. Try again and level up."
        : score <= 7
        ? "You're building real question power. Keep going."
        : score <= 9
        ? "Strong work. Go for a perfect 10."
        : "Perfect Score! You've mastered the quest.";

    const msgT = gs.add.text(cardW / 2, y, message, {
        fontFamily: 'Arial, sans-serif', fontSize: `${msgSz}px`,
        color: '#ffffff', align: 'center', wordWrap: { width: cw }
    }).setOrigin(0.5, 0);
    y += msgT.displayHeight + 10;

    const statsT = gs.add.text(cardW / 2, y, `Max Streak: ${maxStreak}`, {
        fontFamily: 'Arial, sans-serif', fontSize: `${statsSz}px`,
        color: '#ffd900', fontStyle: 'bold', align: 'center'
    }).setOrigin(0.5, 0);
    y += statsT.displayHeight + 24;

    const { container: replayBtn, h: rbH } = makeBtn(
        cardW / 2, y, 'REPLAY MISSION', btnW, btnH, btnSz,
        () => { isSecondPass = true; startQuest(); }
    );
    y += rbH + 14;

    const reminderT = gs.add.text(cardW / 2, y,
        'Smart answers start with smart questions.', {
        fontFamily: 'Arial, sans-serif', fontSize: `${isDesktop ? 13 : 11}px`,
        color: '#00ffff', fontStyle: 'italic', align: 'center'
    }).setOrigin(0.5, 0);
    y += reminderT.displayHeight;

    const cardH = y + pad;
    const cardGfx = gs.add.graphics();
    drawCard(cardGfx, cardW, cardH);

    const mc = gs.add.container(0, 0,
        [cardGfx, titleT, scoreT, msgT, statsT, replayBtn, reminderT]);
    centerContainer(mc, cardW, cardH, width, height);

    if (score === scenarioData.length) {
        createFireworks();
        playSfx(['C4', 'E4', 'G4', 'C5'], '4n');
    }
}

// ── Audio + FX ───────────────────────────────────────────────────────────────
function playSfx(note, duration) {
    if (Tone.context.state !== 'running') Tone.start();
    if (Array.isArray(note)) {
        note.forEach((n, i) => synth.triggerAttackRelease(n, duration, Tone.now() + i * 0.1));
    } else {
        synth.triggerAttackRelease(note, duration);
    }
}

function createFireworks() {
    const { width, height } = gs.scale;
    const colors = [0x00ffff, 0xff00ff, 0x00ff00, 0xffff00];
    for (let i = 0; i < 18; i++) {
        gs.time.delayedCall(i * 160, () => {
            const x = Phaser.Math.Between(80, width - 80);
            const y = Phaser.Math.Between(60, height - 160);
            const color = colors[Phaser.Math.Between(0, 3)];
            for (let j = 0; j < 22; j++) {
                const part = gs.add.circle(x, y, 4, color);
                const angle = Math.random() * Math.PI * 2;
                const speed = 80 + Math.random() * 240;
                gs.tweens.add({
                    targets: part,
                    x: x + Math.cos(angle) * speed,
                    y: y + Math.sin(angle) * speed,
                    alpha: 0, scale: 0.1,
                    duration: 700 + Math.random() * 400,
                    ease: 'Quad.easeOut',
                    onComplete: () => part.destroy()
                });
            }
        });
    }
}
