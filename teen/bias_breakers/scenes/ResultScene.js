import Phaser from 'phaser';

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

        const titleSz = isDesktop ? 56 : isMid ? 38 : 28;
        const scoreSz = isDesktop ? 30 : isMid ? 22 : 17;
        const headSz  = isDesktop ? 18 : isMid ? 15 : 13;
        const bodySz  = isDesktop ? 16 : isMid ? 13 : 11;
        const btnSz   = isDesktop ? 24 : isMid ? 20 : 16;
        const pad     = isDesktop ? 52 : isMid ? 36 : 26;
        const gapSm   = isDesktop ? 12 : 8;
        const gapMd   = isDesktop ? 22 : 14;

        const cardW = isDesktop ? Math.min(720, width * 0.86) : width * 0.95;
        const cw    = cardW - pad * 2;
        const btnW  = Math.min(cw, isDesktop ? 280 : 220);
        const btnH  = isDesktop ? 64 : isMid ? 56 : 48;

        const isPerfect = this.score === 10;

        // Background
        this.add.image(width / 2, height / 2, '00_start_screen.jpg')
            .setDisplaySize(width, height);
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.72);
        overlay.fillRect(0, 0, width, height);

        // ── Card contents ─────────────────────────────────────────────────────
        let y = pad;

        const titleT = this.add.text(cardW / 2, y,
            isPerfect ? 'WELL DONE' : 'MISSION COMPLETE', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${titleSz}px`,
            color: '#00ffff',
            fontStyle: 'bold',
            align: 'center',
            shadow: { blur: 18, color: '#00ffff', fill: true },
            wordWrap: { width: cw }
        }).setOrigin(0.5, 0);
        y += titleT.displayHeight + gapSm;

        const scoreT = this.add.text(cardW / 2, y, `SCORE: ${this.score} / 10`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${scoreSz}px`,
            color: '#ff00ff',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5, 0);
        y += scoreT.displayHeight + gapMd;

        const div = this.add.graphics();
        div.lineStyle(1, 0x00ffff, 0.28);
        div.lineBetween(pad, y, cardW - pad, y);
        y += gapMd;

        const items = [];

        if (!isPerfect && this.errors.length > 0) {
            const areaT = this.add.text(pad, y, 'AREAS FOR IMPROVEMENT:', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${headSz}px`,
                color: '#ff4444',
                fontStyle: 'bold'
            }).setOrigin(0, 0);
            y += areaT.displayHeight + gapSm;
            items.push(areaT);

            const unique = [];
            const seen = new Set();
            for (const e of this.errors) {
                if (!seen.has(e.title)) { unique.push(e); seen.add(e.title); }
            }

            unique.forEach(error => {
                const errT = this.add.text(pad, y, `${error.title}: ${error.description}`, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: `${bodySz}px`,
                    color: '#ccffff',
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
                color: '#ffffff',
                fontStyle: 'italic',
                align: 'center'
            }).setOrigin(0.5, 0);
            y += tryT.displayHeight + gapMd;
            items.push(tryT);
        }

        // Replay button
        const replayBg = this.add.graphics();
        this.drawButton(replayBg, btnW, btnH, 0x00ffff, 0.18);
        const replayLabel = this.add.text(0, 0, 'TRY AGAIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${btnSz}px`,
            color: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const replayBtn = this.add.container(cardW / 2, y + btnH / 2, [replayBg, replayLabel]);
        replayBtn.setInteractive(
            new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );
        replayBtn.on('pointerover', () => {
            this.drawButton(replayBg, btnW, btnH, 0xff00ff, 0.32);
            replayLabel.setColor('#ff00ff');
            document.body.style.cursor = 'pointer';
        });
        replayBtn.on('pointerout', () => {
            this.drawButton(replayBg, btnW, btnH, 0x00ffff, 0.18);
            replayLabel.setColor('#00ffff');
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
        y += btnH;

        const cardH = y + pad;
        const cardGfx = this.add.graphics();
        cardGfx.fillStyle(0x020208, 0.88);
        cardGfx.fillRoundedRect(0, 0, cardW, cardH, 14);
        cardGfx.lineStyle(1, 0x00ffff, 0.5);
        cardGfx.strokeRoundedRect(0, 0, cardW, cardH, 14);

        const mc = this.add.container(0, 0, [
            cardGfx, titleT, scoreT, div, ...items, replayBtn
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

    drawButton(graphics, w, h, color, alpha) {
        graphics.clear();
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
        graphics.lineStyle(2, color, 0.88);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
    }
}
