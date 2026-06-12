import Phaser from 'phaser';
import { BiasData } from '../BiasData.js';
import { audioManager } from '../AudioManager.js';

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
        this.currentOptionBtns = [];

        const { width, height } = this.scale;
        const isDesktop = width >= 900;
        const isMid     = width >= 600;

        const biasSz   = isDesktop ? 38 : isMid ? 28 : 21;
        const descSz   = isDesktop ? 20 : isMid ? 16 : 13;
        const instrSz  = isDesktop ? 17 : isMid ? 14 : 12;
        const qSz      = isDesktop ? 26 : isMid ? 20 : 16;
        const btnSz    = isDesktop ? 20 : isMid ? 16 : 13;
        const hudSz    = isDesktop ? 14 : 12;
        const pad      = isDesktop ? 44 : isMid ? 32 : 22;
        const gapSm    = isDesktop ? 12 : 8;
        const gapMd    = isDesktop ? 20 : 14;

        const cardW = isDesktop ? Math.min(820, width * 0.86) : width * 0.95;
        const cw    = cardW - pad * 2;
        const btnW  = cw;
        const minBtnH = isDesktop ? 64 : isMid ? 56 : 48;

        // ── Full-bleed background ────────────────────────────────────────────
        const bgImg = this.add.image(width / 2, height / 2, this.bias.bg)
            .setDisplaySize(width, height);

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.50);
        overlay.fillRect(0, 0, width, height);

        // ── Card contents ─────────────────────────────────────────────────────
        let y = pad;

        // Progress row
        const progress = (this.biasIndex + 1) / BiasData.length;
        const pbH = isDesktop ? 8 : 6;

        const pbBg = this.add.graphics();
        pbBg.fillStyle(0x333333, 1);
        pbBg.fillRoundedRect(pad, y, cw, pbH, pbH / 2);

        const pbFill = this.add.graphics();
        pbFill.fillStyle(0x00ffff, 1);
        pbFill.fillRoundedRect(pad, y, cw * progress, pbH, pbH / 2);
        y += pbH + gapSm;

        const hudT = this.add.text(pad, y,
            `${this.biasIndex + 1} / ${BiasData.length}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${hudSz}px`,
            color: '#00ffff', fontStyle: 'bold'
        }).setOrigin(0, 0);
        y += hudT.displayHeight + gapMd;

        // Divider
        const div1 = this.add.graphics();
        div1.lineStyle(1, 0x00ffff, 0.25);
        div1.lineBetween(pad, y, cardW - pad, y);
        y += gapMd;

        // Bias title
        const biasT = this.add.text(cardW / 2, y, this.bias.title.toUpperCase(), {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${biasSz}px`,
            color: '#ff00ff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#00ffff',
            strokeThickness: isDesktop ? 2 : 1,
            shadow: { blur: 12, color: '#ff00ff', fill: true },
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += biasT.displayHeight + gapSm;

        // Description
        const descT = this.add.text(cardW / 2, y, this.bias.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${descSz}px`,
            color: '#ccffff',
            align: 'center',
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += descT.displayHeight + gapSm;

        // Instruction
        const instrT = this.add.text(cardW / 2, y,
            'Select the answer that demonstrates this bias', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${instrSz}px`,
            color: '#ffd900',
            fontStyle: 'italic',
            align: 'center',
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += instrT.displayHeight + gapMd;

        // Divider
        const div2 = this.add.graphics();
        div2.lineStyle(1, 0x00ffff, 0.2);
        div2.lineBetween(pad, y, cardW - pad, y);
        y += gapMd;

        // Question
        const qT = this.add.text(cardW / 2, y, this.bias.question, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${qSz}px`,
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += qT.displayHeight + gapMd;

        // Answer buttons
        this.optionButtons = [];
        this.bias.options.forEach((option, index) => {
            const label = this.add.text(0, 0, option, {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${btnSz}px`,
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: btnW - 32 }
            }).setOrigin(0.5);

            const bh = Math.max(minBtnH, label.displayHeight + 24);
            const bg = this.add.graphics();
            this.drawButton(bg, btnW, bh, 0x00ffff, 0.10);

            const btn = this.add.container(cardW / 2, y + bh / 2, [bg, label]);
            btn.setInteractive(
                new Phaser.Geom.Rectangle(-btnW / 2, -bh / 2, btnW, bh),
                Phaser.Geom.Rectangle.Contains
            );
            btn.on('pointerover', () => {
                if (!this.selected) {
                    this.drawButton(bg, btnW, bh, 0xff00ff, 0.28);
                    label.setColor('#00ffff');
                    document.body.style.cursor = 'pointer';
                }
            });
            btn.on('pointerout', () => {
                if (!this.selected) {
                    this.drawButton(bg, btnW, bh, 0x00ffff, 0.10);
                    label.setColor('#ffffff');
                    document.body.style.cursor = 'default';
                }
            });
            btn.on('pointerdown', () => {
                document.body.style.cursor = 'default';
                this.handleAnswer(index, bg, label, this.bias.biasedIndex, btnW, bh);
            });

            this.optionButtons.push({ container: btn, bg, text: label, w: btnW, h: bh });
            y += bh + 10;
        });

        y += 4;
        const cardH = y + pad;

        const cardGfx = this.add.graphics();
        cardGfx.fillStyle(0x020208, 0.72);
        cardGfx.fillRoundedRect(0, 0, cardW, cardH, 14);
        cardGfx.lineStyle(1, 0x00ffff, 0.45);
        cardGfx.strokeRoundedRect(0, 0, cardW, cardH, 14);

        const mc = this.add.container(0, 0, [
            cardGfx, pbBg, pbFill, hudT, div1,
            biasT, descT, instrT, div2, qT,
            ...this.optionButtons.map(b => b.container)
        ]);

        const maxH = height * 0.96;
        if (cardH > maxH) {
            const s = maxH / cardH;
            mc.setScale(s);
            mc.setPosition((width - cardW * s) / 2, (height - cardH * s) / 2);
        } else {
            mc.setPosition((width - cardW) / 2, (height - cardH) / 2);
        }

        this._mc = mc;
        this._cardW = cardW;
        this._cardH = cardH;
    }

    drawButton(graphics, w, h, color, alpha) {
        graphics.clear();
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
        graphics.lineStyle(2, color, 0.85);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    }

    handleAnswer(index, bg, text, correctIndex, btnW, btnH) {
        if (this.selected) return;
        this.selected = true;

        const isCorrect = index === correctIndex;
        if (isCorrect) {
            audioManager.playCorrect();
            this.score++;
            this.drawButton(bg, btnW, btnH, 0x00ff88, 0.38);
            text.setColor('#ffffff');
            text.setText('✓ ' + text.text);
        } else {
            audioManager.playIncorrect();
            this.drawButton(bg, btnW, btnH, 0xff4444, 0.38);
            text.setColor('#ffffff');
            text.setText('✗ ' + text.text);

            const correct = this.optionButtons[correctIndex];
            this.drawButton(correct.bg, correct.w, correct.h, 0x00ff88, 0.38);

            const errors = this.registry.get('ERRORS') || [];
            errors.push({ title: this.bias.title, description: this.bias.description });
            this.registry.set('ERRORS', errors);
        }

        this.showNextButton();
    }

    showNextButton() {
        const { width, height } = this.scale;
        const isDesktop = width >= 900;
        const btnW = isDesktop ? 200 : 160;
        const btnH = isDesktop ? 56 : 48;
        const btnSz = isDesktop ? 22 : 18;

        const bg = this.add.graphics();
        this.drawButton(bg, btnW, btnH, 0xff00ff, 0.20);
        const label = this.add.text(0, 0, 'NEXT >>', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${btnSz}px`,
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const btn = this.add.container(width - btnW / 2 - 20, height + btnH, [bg, label]);
        btn.setInteractive(
            new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );
        btn.on('pointerover', () => {
            this.drawButton(bg, btnW, btnH, 0x00ffff, 0.45);
            document.body.style.cursor = 'pointer';
        });
        btn.on('pointerout', () => {
            this.drawButton(bg, btnW, btnH, 0xff00ff, 0.20);
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
            y: height - btnH / 2 - 20,
            duration: 450,
            ease: 'Back.easeOut'
        });
    }
}
