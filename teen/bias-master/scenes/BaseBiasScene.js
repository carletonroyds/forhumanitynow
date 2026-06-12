import Phaser from 'phaser';
import { BiasData } from '../BiasData.js';
import { audioManager } from '../AudioManager.js';

// ── Bias Master HUD palette ────────────────────────────────────────────────
export const HUD = {
    panelFill:   0x070312,
    panelAlpha:  0.85,
    border:      0x00e5ff,
    accent:      0xff2dc0,
    trackGrey:   0x1c2333,
    barCyan:     0x00e5ff,
    rowColors:   [0xff2dc0, 0x00e0cc, 0x4f6bff],
    correct:     0x00ff88,
    wrong:       0xff4444
};

const ROW_ICONS = ['◉', '✕', '⌕'];

export function chamferPoints(x, y, w, h, cut) {
    return [
        { x: x + cut,     y: y },
        { x: x + w - cut, y: y },
        { x: x + w,       y: y + cut },
        { x: x + w,       y: y + h - cut },
        { x: x + w - cut, y: y + h },
        { x: x + cut,     y: y + h },
        { x: x,           y: y + h - cut },
        { x: x,           y: y + cut }
    ];
}

export class BaseBiasScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.sceneKey = key;
    }

    init(data) {
        this.score = data.score || 0;
        this.biasIndex = BiasData.findIndex(b => b.id === this.sceneKey);
        this.bias = BiasData[this.biasIndex];
        this.selected = false;
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.drawScene();
        this.scale.on('resize', () => this.drawScene());
    }

    drawScene() {
        this.children.removeAll(true);

        const { width, height } = this.scale;
        const isDesktop = width >= 900;
        const isMid     = width >= 600;

        const labelSz  = isDesktop ? 13 : 11;
        const biasSz   = isDesktop ? 42 : isMid ? 30 : 22;
        const descSz   = isDesktop ? 20 : isMid ? 16 : 13;
        const instrSz  = isDesktop ? 16 : isMid ? 14 : 12;
        const qSz      = isDesktop ? 26 : isMid ? 20 : 16;
        const btnSz    = isDesktop ? 20 : isMid ? 16 : 13;
        const hudSz    = isDesktop ? 14 : 12;
        const footSz   = isDesktop ? 13 : 10;
        const pad      = isDesktop ? 48 : isMid ? 34 : 22;
        const gapSm    = isDesktop ? 12 : 8;
        const gapMd    = isDesktop ? 22 : 14;

        const cardW = isDesktop ? Math.min(860, width * 0.86) : width * 0.95;
        const cw    = cardW - pad * 2;
        const btnW  = cw;
        const minBtnH = isDesktop ? 66 : isMid ? 58 : 50;

        // ── Full-bleed background ────────────────────────────────────────────
        this.add.image(width / 2, height / 2, this.bias.bg)
            .setDisplaySize(width, height);

        const overlay = this.add.graphics();
        overlay.fillStyle(0x05010d, 0.55);
        overlay.fillRect(0, 0, width, height);

        // ── Card contents ─────────────────────────────────────────────────────
        let y = pad * 0.7;

        // Header: BIAS DETECTOR + magenta corner dashes (like File 1)
        const headT = this.add.text(pad * 0.7, y, 'BIAS DETECTOR', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${labelSz}px`,
            color: '#9fb4c8',
            fontStyle: 'bold'
        }).setOrigin(0, 0).setLetterSpacing(3);

        const accents = this.add.graphics();
        const dashW = isDesktop ? 14 : 10;
        for (let i = 0; i < 4; i++) {
            accents.fillStyle(HUD.accent, 0.95 - i * 0.18);
            const dx = cardW - pad * 0.7 - (i + 1) * (dashW + 6);
            accents.fillPoints(chamferPoints(dx, y, dashW, 8, 3), true);
        }
        y += headT.displayHeight + gapSm;

        // Progress bar (cyan on dark track)
        const progress = (this.biasIndex + 1) / BiasData.length;
        const pbH = isDesktop ? 7 : 5;
        const pbW = Math.min(cw * 0.4, 300);

        const pbBg = this.add.graphics();
        pbBg.fillStyle(HUD.trackGrey, 1);
        pbBg.fillRect(pad * 0.7, y, pbW, pbH);
        pbBg.fillStyle(HUD.barCyan, 1);
        pbBg.fillRect(pad * 0.7, y, pbW * progress, pbH);
        y += pbH + gapSm;

        const hudT = this.add.text(pad * 0.7, y,
            `${this.biasIndex + 1} / ${BiasData.length}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${hudSz}px`,
            color: '#e8f6ff', fontStyle: 'bold'
        }).setOrigin(0, 0);
        y += hudT.displayHeight + gapMd;

        // ── Title: gradient text in { brackets } with dotted flanks ──────────
        const biasT = this.add.text(cardW / 2, y, `{ ${this.bias.title.toUpperCase()} }`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${biasSz}px`,
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            shadow: { blur: 18, color: '#7a2dff', fill: true },
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        // left→right magenta/violet → cyan gradient
        biasT.setTint(0xd23bff, 0x00e5ff, 0xb44bff, 0x36c7ff);

        const dots = this.add.graphics();
        dots.fillStyle(HUD.accent, 0.8);
        const dotY = y + biasT.displayHeight / 2;
        const halfTitle = biasT.displayWidth / 2;
        const dotGap = 10;
        for (let i = 1; i <= 6; i++) {
            const off = halfTitle + 16 + i * dotGap;
            if (cardW / 2 - off > pad && cardW / 2 + off < cardW - pad) {
                dots.fillCircle(cardW / 2 - off, dotY, 2);
                dots.fillCircle(cardW / 2 + off, dotY, 2);
            }
        }
        y += biasT.displayHeight + gapSm;

        // Description
        const descT = this.add.text(cardW / 2, y, this.bias.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${descSz}px`,
            color: '#d6dcec',
            align: 'center',
            wordWrap: { width: cw * 0.9 }
        }).setOrigin(0.5, 0);
        y += descT.displayHeight + gapSm;

        // Instruction (hot pink, like File 1)
        const instrT = this.add.text(cardW / 2, y,
            'Select the answer that demonstrates this bias', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${instrSz}px`,
            color: '#ff3db8',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += instrT.displayHeight + gapMd;

        // Question (large, white, bold)
        const qT = this.add.text(cardW / 2, y, this.bias.question, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${qSz}px`,
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: cw * 0.95 }
        }).setOrigin(0.5, 0);
        y += qT.displayHeight + gapMd;

        // ── Answer rows: chamfered neon panels, hex icon, chevron ────────────
        this.optionButtons = [];
        const iconZone = isDesktop ? 76 : 58;
        const chevZone = isDesktop ? 56 : 42;

        this.bias.options.forEach((option, index) => {
            const rowColor = HUD.rowColors[index % HUD.rowColors.length];
            const hexCss   = '#' + rowColor.toString(16).padStart(6, '0');

            const label = this.add.text(0, 0, option, {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${btnSz}px`,
                color: '#ffffff',
                align: 'left',
                wordWrap: { width: btnW - iconZone - chevZone - 16 }
            }).setOrigin(0, 0.5);

            const bh = Math.max(minBtnH, label.displayHeight + 26);
            const bg = this.add.graphics();
            this.drawRow(bg, btnW, bh, rowColor, 0.10);

            label.setPosition(-btnW / 2 + iconZone, 0);

            // hexagon icon
            const hexR = isDesktop ? 17 : 13;
            const hexG = this.add.graphics();
            this.drawHex(hexG, -btnW / 2 + iconZone / 2, 0, hexR, rowColor);
            const iconT = this.add.text(-btnW / 2 + iconZone / 2, 0,
                ROW_ICONS[index % ROW_ICONS.length], {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${Math.round(hexR * 1.05)}px`,
                color: hexCss,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // chevron
            const chevT = this.add.text(btnW / 2 - chevZone / 2, 0, '❯', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${btnSz + 4}px`,
                color: hexCss,
                fontStyle: 'bold'
            }).setOrigin(0.5);

            const btn = this.add.container(cardW / 2, y + bh / 2,
                [bg, hexG, iconT, label, chevT]);
            btn.setInteractive(
                new Phaser.Geom.Rectangle(-btnW / 2, -bh / 2, btnW, bh),
                Phaser.Geom.Rectangle.Contains
            );
            btn.on('pointerover', () => {
                if (!this.selected) {
                    this.drawRow(bg, btnW, bh, rowColor, 0.28);
                    document.body.style.cursor = 'pointer';
                }
            });
            btn.on('pointerout', () => {
                if (!this.selected) {
                    this.drawRow(bg, btnW, bh, rowColor, 0.10);
                    document.body.style.cursor = 'default';
                }
            });
            btn.on('pointerdown', () => {
                document.body.style.cursor = 'default';
                this.handleAnswer(index, bg, label, this.bias.biasedIndex, btnW, bh);
            });

            this.optionButtons.push({ container: btn, bg, text: label, w: btnW, h: bh });
            y += bh + (isDesktop ? 14 : 10);
        });

        y += gapSm;

        // ── Footer badge: THINK CRITICALLY. QUESTION EVERYTHING. ─────────────
        const footT = this.add.text(0, 0, '▲  THINK CRITICALLY.  QUESTION EVERYTHING.', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${footSz}px`,
            color: '#bfeaff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setLetterSpacing(2);
        const fW = footT.displayWidth + 44;
        const fH = footT.displayHeight + 16;
        const footBg = this.add.graphics();
        footBg.fillStyle(0x040810, 0.9);
        footBg.fillPoints(chamferPoints(-fW / 2, -fH / 2, fW, fH, 10), true);
        footBg.lineStyle(1, HUD.border, 0.6);
        footBg.strokePoints(chamferPoints(-fW / 2, -fH / 2, fW, fH, 10), true, true);
        const footer = this.add.container(cardW / 2, y + fH / 2, [footBg, footT]);
        y += fH;

        const cardH = y + pad * 0.7;

        // ── HUD panel: chamfered corners, cyan border, magenta corner accents ─
        const cut = isDesktop ? 26 : 16;
        const cardGfx = this.add.graphics();
        cardGfx.fillStyle(HUD.panelFill, HUD.panelAlpha);
        cardGfx.fillPoints(chamferPoints(0, 0, cardW, cardH, cut), true);
        cardGfx.lineStyle(2, HUD.border, 0.65);
        cardGfx.strokePoints(chamferPoints(0, 0, cardW, cardH, cut), true, true);
        cardGfx.lineStyle(3, HUD.accent, 0.9);
        cardGfx.beginPath();
        cardGfx.moveTo(cut + 40, 0); cardGfx.lineTo(cut, 0);
        cardGfx.lineTo(0, cut); cardGfx.lineTo(0, cut + 40);
        cardGfx.strokePath();
        cardGfx.beginPath();
        cardGfx.moveTo(cardW - cut - 40, cardH); cardGfx.lineTo(cardW - cut, cardH);
        cardGfx.lineTo(cardW, cardH - cut); cardGfx.lineTo(cardW, cardH - cut - 40);
        cardGfx.strokePath();

        const mc = this.add.container(0, 0, [
            cardGfx, headT, accents, pbBg, hudT,
            biasT, dots, descT, instrT, qT,
            ...this.optionButtons.map(b => b.container),
            footer
        ]);

        // Reserve space below the card for the NEXT button
        const btnReserve = isDesktop ? 90 : 74;
        const maxH = height - btnReserve;
        let cardScale = 1;
        if (cardH > maxH) {
            cardScale = maxH / cardH;
            mc.setScale(cardScale);
            mc.setPosition((width - cardW * cardScale) / 2, (height - cardH * cardScale - btnReserve) / 2);
        } else {
            mc.setPosition((width - cardW) / 2, (height - cardH - btnReserve) / 2);
        }

        this._cardCenterX = width / 2;
        this._cardBottom  = mc.y + cardH * cardScale;
    }

    drawRow(graphics, w, h, color, alpha) {
        graphics.clear();
        const pts = chamferPoints(-w / 2, -h / 2, w, h, 14);
        graphics.fillStyle(color, alpha);
        graphics.fillPoints(pts, true);
        graphics.lineStyle(2, color, 0.95);
        graphics.strokePoints(pts, true, true);
    }

    drawHex(graphics, cx, cy, r, color) {
        graphics.clear();
        const pts = [];
        for (let i = 0; i < 6; i++) {
            const a = Math.PI / 6 + i * Math.PI / 3;
            pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
        }
        graphics.fillStyle(color, 0.12);
        graphics.fillPoints(pts, true);
        graphics.lineStyle(2, color, 0.95);
        graphics.strokePoints(pts, true, true);
    }

    handleAnswer(index, bg, text, correctIndex, btnW, btnH) {
        if (this.selected) return;
        this.selected = true;

        const isCorrect = index === correctIndex;
        if (isCorrect) {
            audioManager.playCorrect();
            this.score++;
            this.drawRow(bg, btnW, btnH, HUD.correct, 0.38);
            text.setColor('#ffffff');
            text.setText('✓ ' + text.text);
        } else {
            audioManager.playIncorrect();
            this.drawRow(bg, btnW, btnH, HUD.wrong, 0.38);
            text.setColor('#ffffff');
            text.setText('✗ ' + text.text);

            const correct = this.optionButtons[correctIndex];
            this.drawRow(correct.bg, correct.w, correct.h, HUD.correct, 0.38);

            const errors = this.registry.get('ERRORS') || [];
            errors.push({ title: this.bias.title, description: this.bias.description });
            this.registry.set('ERRORS', errors);
        }

        this.showNextButton();
    }

    showNextButton() {
        const { width } = this.scale;
        const isDesktop = width >= 900;
        const btnW = isDesktop ? 210 : 165;
        const btnH = isDesktop ? 56 : 48;
        const btnSz = isDesktop ? 22 : 18;
        const gap   = isDesktop ? 16 : 12;

        const targetY = this._cardBottom + gap + btnH / 2;

        const bg = this.add.graphics();
        this.drawRow(bg, btnW, btnH, HUD.accent, 0.22);
        const label = this.add.text(0, 0, 'NEXT  ❯❯', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${btnSz}px`,
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const btn = this.add.container(this._cardCenterX, targetY - 20, [bg, label]);
        btn.setAlpha(0);
        btn.setInteractive(
            new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );
        btn.on('pointerover', () => {
            this.drawRow(bg, btnW, btnH, HUD.border, 0.45);
            document.body.style.cursor = 'pointer';
        });
        btn.on('pointerout', () => {
            this.drawRow(bg, btnW, btnH, HUD.accent, 0.22);
            document.body.style.cursor = 'default';
        });
        btn.on('pointerdown', () => {
            document.body.style.cursor = 'default';
            const nextIndex = this.biasIndex + 1;
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                if (nextIndex < BiasData.length) {
                    this.scene.start(BiasData[nextIndex].id, { score: this.score });
                } else {
                    this.scene.start('ResultScene', { score: this.score });
                }
            });
        });

        this.tweens.add({
            targets: btn,
            y: targetY,
            alpha: 1,
            duration: 350,
            ease: 'Back.easeOut'
        });
    }
}
