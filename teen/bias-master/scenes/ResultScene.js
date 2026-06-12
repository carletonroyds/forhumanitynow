import Phaser from 'phaser';
import { HUD, chamferPoints } from './BaseBiasScene.js';

export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.score  = data.score || 0;
        this.errors = this.registry.get('ERRORS') || [];
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.drawResult();
        this.scale.on('resize', () => this.drawResult());
    }

    drawResult() {
        this.children.removeAll(true);

        const { width, height } = this.scale;
        const isDesktop = width >= 900;
        const isMid     = width >= 600;

        const labelSz = isDesktop ? 13 : 11;
        const titleSz = isDesktop ? 52 : isMid ? 36 : 26;
        const scoreSz = isDesktop ? 30 : isMid ? 22 : 17;
        const headSz  = isDesktop ? 18 : isMid ? 15 : 13;
        const bodySz  = isDesktop ? 16 : isMid ? 13 : 11;
        const btnSz   = isDesktop ? 24 : isMid ? 20 : 16;
        const footSz  = isDesktop ? 13 : 10;
        const pad     = isDesktop ? 52 : isMid ? 36 : 26;
        const gapSm   = isDesktop ? 12 : 8;
        const gapMd   = isDesktop ? 22 : 14;

        const cardW = isDesktop ? Math.min(760, width * 0.86) : width * 0.95;
        const cw    = cardW - pad * 2;
        const btnW  = Math.min(cw, isDesktop ? 280 : 220);
        const btnH  = isDesktop ? 64 : isMid ? 56 : 48;

        const isPerfect = this.score === 10;

        // Background
        this.add.image(width / 2, height / 2, '00_start_screen.jpg')
            .setDisplaySize(width, height);
        const overlay = this.add.graphics();
        overlay.fillStyle(0x05010d, 0.72);
        overlay.fillRect(0, 0, width, height);

        // ── Card contents ─────────────────────────────────────────────────────
        let y = pad * 0.7;

        // Header label + magenta corner dashes
        const headLbl = this.add.text(pad * 0.7, y, 'BIAS DETECTOR', {
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
        y += headLbl.displayHeight + gapMd;

        // Gradient title in { brackets }
        const titleT = this.add.text(cardW / 2, y,
            isPerfect ? '{ WELL DONE }' : '{ MISSION COMPLETE }', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${titleSz}px`,
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            shadow: { blur: 18, color: '#7a2dff', fill: true },
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        titleT.setTint(0xd23bff, 0x00e5ff, 0xb44bff, 0x36c7ff);
        y += titleT.displayHeight + gapSm;

        const scoreT = this.add.text(cardW / 2, y, `SCORE: ${this.score} / 10`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${scoreSz}px`,
            color: '#ff3db8',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5, 0);
        y += scoreT.displayHeight + gapMd;

        // Dotted divider
        const div = this.add.graphics();
        div.fillStyle(HUD.border, 0.5);
        for (let dx = pad; dx < cardW - pad; dx += 12) {
            div.fillCircle(dx, y, 1.5);
        }
        y += gapMd;

        const items = [];

        if (!isPerfect && this.errors.length > 0) {
            const areaT = this.add.text(pad, y, 'AREAS FOR IMPROVEMENT:', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${headSz}px`,
                color: '#ff4444',
                fontStyle: 'bold'
            }).setOrigin(0, 0).setLetterSpacing(1);
            y += areaT.displayHeight + gapSm;
            items.push(areaT);

            const unique = [];
            const seen = new Set();
            for (const e of this.errors) {
                if (!seen.has(e.title)) { unique.push(e); seen.add(e.title); }
            }

            unique.forEach(error => {
                const errT = this.add.text(pad, y, `❯ ${error.title}: ${error.description}`, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: `${bodySz}px`,
                    color: '#d6dcec',
                    wordWrap: { width: cw }
                }).setOrigin(0, 0);
                y += errT.displayHeight + gapSm;
                items.push(errT);
            });

            y += gapSm;
        }

        if (!isPerfect) {
            const tryT = this.add.text(cardW / 2, y, 'Go for 10 out of 10!', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${headSz}px`,
                color: '#ff3db8',
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5, 0);
            y += tryT.displayHeight + gapMd;
            items.push(tryT);
        }

        // Replay button — chamfered HUD style
        const replayBg = this.add.graphics();
        this.drawHudButton(replayBg, btnW, btnH, HUD.border, 0.16);
        const replayLabel = this.add.text(0, 0, 'TRY AGAIN  ❯', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${btnSz}px`,
            color: '#00e5ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const replayBtn = this.add.container(cardW / 2, y + btnH / 2, [replayBg, replayLabel]);
        replayBtn.setInteractive(
            new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );
        replayBtn.on('pointerover', () => {
            this.drawHudButton(replayBg, btnW, btnH, HUD.accent, 0.30);
            replayLabel.setColor('#ff2dc0');
            document.body.style.cursor = 'pointer';
        });
        replayBtn.on('pointerout', () => {
            this.drawHudButton(replayBg, btnW, btnH, HUD.border, 0.16);
            replayLabel.setColor('#00e5ff');
            document.body.style.cursor = 'default';
        });
        replayBtn.on('pointerdown', () => {
            document.body.style.cursor = 'default';
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.registry.set('ERRORS', []);
                this.scene.start('confirmation_bias', { score: 0 });
            });
        });
        y += btnH + gapMd;

        // Footer badge
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

        // HUD panel with chamfered corners + magenta corner accents
        const cut = isDesktop ? 26 : 16;
        const cardGfx = this.add.graphics();
        cardGfx.fillStyle(HUD.panelFill, 0.9);
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
            cardGfx, headLbl, accents, titleT, scoreT, div, ...items, replayBtn, footer
        ]);

        const maxH = height * 0.96;
        if (cardH > maxH) {
            const s = maxH / cardH;
            mc.setScale(s);
            mc.setPosition((width - cardW * s) / 2, (height - cardH * s) / 2);
        } else {
            mc.setPosition((width - cardW) / 2, (height - cardH) / 2);
        }

        if (isPerfect) {
            this.celebrate();
            this.time.delayedCall(500, () => {
                import('../AudioManager.js').then(m => m.audioManager.playReward());
            });
        }
    }

    celebrate() {
        const { width, height } = this.scale;
        this.time.addEvent({
            delay: 200, repeat: 15,
            callback: () => {
                const x = Phaser.Math.Between(100, width - 100);
                const y = Phaser.Math.Between(100, height - 100);
                const color = Phaser.Display.Color.RandomRGB().color;
                for (let i = 0; i < 28; i++) {
                    const part = this.add.circle(x, y, 4, color);
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 100 + Math.random() * 280;
                    this.tweens.add({
                        targets: part,
                        x: x + Math.cos(angle) * speed,
                        y: y + Math.sin(angle) * speed,
                        alpha: 0, scale: 0.1,
                        duration: 750 + Math.random() * 400,
                        ease: 'Quad.easeOut',
                        onComplete: () => part.destroy()
                    });
                }
            }
        });
    }

    drawHudButton(graphics, w, h, color, alpha) {
        graphics.clear();
        const pts = chamferPoints(-w / 2, -h / 2, w, h, 14);
        graphics.fillStyle(color, alpha);
        graphics.fillPoints(pts, true);
        graphics.lineStyle(2, color, 0.9);
        graphics.strokePoints(pts, true, true);
    }
}
