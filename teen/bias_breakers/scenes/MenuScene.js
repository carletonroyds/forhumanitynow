import Phaser from 'phaser';
import { audioManager } from '../AudioManager.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.drawMenu();
        this.scale.on('resize', () => {
            this.drawMenu();
        });
    }

    drawMenu() {
        this.children.removeAll(true);

        const { width, height } = this.scale;
        const isDesktop = width >= 900;
        const isMid     = width >= 600;

        const titleSz = isDesktop ? 72 : isMid ? 48 : 34;
        const subSz   = isDesktop ? 36 : isMid ? 26 : 19;
        const instrSz = isDesktop ? 24 : isMid ? 18 : 14;
        const btnSz   = isDesktop ? 32 : isMid ? 26 : 20;
        const pad     = isDesktop ? 60 : 36;

        // Background
        const bg = this.add.image(width / 2, height / 2, '00_start_screen.jpg')
            .setDisplaySize(width, height);

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.55);
        overlay.fillRect(0, 0, width, height);

        // ── Card ────────────────────────────────────────────────────────────────
        const cardW = isDesktop ? Math.min(720, width * 0.72) : width * 0.92;
        const cw    = cardW - pad * 2;

        let y = pad;

        const titleT = this.add.text(cardW / 2, y, 'BIAS BREAKERS', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${titleSz}px`,
            color: '#00ffff',
            fontWeight: 'bold',
            align: 'center',
            stroke: '#ff00ff',
            strokeThickness: isDesktop ? 3 : 2,
            shadow: { blur: 24, color: '#00ffff', fill: true },
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += titleT.displayHeight + 12;

        const subT = this.add.text(cardW / 2, y, 'Rewire & Hack Your Brain', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${subSz}px`,
            color: '#ffffff',
            fontStyle: 'italic',
            align: 'center',
            shadow: { blur: 12, color: '#00ffff', fill: true }
        }).setOrigin(0.5, 0);
        y += subT.displayHeight + 18;

        const instrT = this.add.text(cardW / 2, y,
            'Identify the bias in each scenario.\nSelect the answer that demonstrates it.', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${instrSz}px`,
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += instrT.displayHeight + 32;

        // Start button
        const btnW  = Math.min(cw, isDesktop ? 280 : 220);
        const btnH  = isDesktop ? 68 : isMid ? 58 : 50;
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.18);

        const btnLabel = this.add.text(0, 0, 'START', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${btnSz}px`,
            color: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const startBtn = this.add.container(cardW / 2, y + btnH / 2, [btnBg, btnLabel]);
        startBtn.setInteractive(
            new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );
        startBtn.on('pointerover', () => {
            this.drawButton(btnBg, btnW, btnH, 0xff00ff, 0.35);
            btnLabel.setColor('#ff00ff');
            document.body.style.cursor = 'pointer';
        });
        startBtn.on('pointerout', () => {
            this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.18);
            btnLabel.setColor('#00ffff');
            document.body.style.cursor = 'default';
        });
        startBtn.on('pointerdown', async () => {
            document.body.style.cursor = 'default';
            await audioManager.init();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('confirmation_bias', { score: 0 });
            });
        });
        y += btnH;

        const cardH = y + pad;
        const cardGfx = this.add.graphics();
        cardGfx.fillStyle(0x020208, 0.82);
        cardGfx.fillRoundedRect(0, 0, cardW, cardH, 14);
        cardGfx.lineStyle(1, 0x00ffff, 0.55);
        cardGfx.strokeRoundedRect(0, 0, cardW, cardH, 14);

        const mc = this.add.container(0, 0, [cardGfx, titleT, subT, instrT, startBtn]);
        // Center card — scale down if needed
        const maxH = height * 0.95;
        if (cardH > maxH) {
            const s = maxH / cardH;
            mc.setScale(s);
            mc.setPosition((width - cardW * s) / 2, (height - cardH * s) / 2);
        } else {
            mc.setPosition((width - cardW) / 2, (height - cardH) / 2);
        }

        // Character — desktop only, right side of card area
        if (isDesktop) {
            const charX = (width + cardW) / 2 + (width - (width + cardW) / 2) * 0.5;
            const charY = height / 2;
            const charGlow = this.add.graphics();
            charGlow.fillStyle(0x00ffff, 0.12);
            charGlow.fillCircle(0, 0, 200);
            const character = this.add.image(0, 0, 'start-character')
                .setOrigin(0.5)
                .setScale(Math.min((height * 0.6) / 512, 1.2));
            const charContainer = this.add.container(charX, charY, [charGlow, character]);
            this.tweens.add({
                targets: charContainer, y: charY - 20,
                duration: 2400, ease: 'Sine.easeInOut', yoyo: true, repeat: -1
            });
        }

        // Pulse title
        this.tweens.add({
            targets: titleT, alpha: 0.82,
            duration: 1600, ease: 'Sine.easeInOut', yoyo: true, repeat: -1
        });
    }

    drawButton(graphics, w, h, color, alpha) {
        graphics.clear();
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
        graphics.lineStyle(2, color, 0.9);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    }
}
