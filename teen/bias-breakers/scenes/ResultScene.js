import Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.score = data.score || 0;
        this.errors = this.registry.get('ERRORS') || [];
    }

    getRestartData() {
        return { score: this.score };
    }

    create() {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;
        const isPortrait = height > width;
        const u = isPortrait ? width / 1080 : height / 1080;
        const cx = width / 2;

        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Background — cover without distortion
        const bg = this.add.image(cx, height / 2, '00_start_screen.jpg');
        bg.setScale(Math.max(width / bg.width, height / bg.height));

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, width, height);

        const isPerfect = this.score === 10;
        const titleStr = isPerfect ? 'WELL DONE' : 'MISSION COMPLETE';
        const contentW = Math.min(width * 0.92, 1300 * u);

        // Everything except the bottom button flows in a container,
        // scaled down if it overflows the space above the button.
        const ui = this.add.container(0, 0);
        let y = 60 * u;

        const resultTitle = this.add.text(cx, y, titleStr, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round((isPortrait ? 72 : 84) * u)}px`,
            color: '#00ffff',
            fontStyle: 'bold',
            align: 'center',
            shadow: { blur: 20, color: '#00ffff', fill: true },
            wordWrap: { width: contentW }
        }).setOrigin(0.5, 0);
        ui.add(resultTitle);
        y += resultTitle.height + 36 * u;

        const scoreText = this.add.text(cx, y, `TOTAL SCORE: ${this.score} / 10`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(54 * u)}px`,
            color: '#ff00ff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0);
        ui.add(scoreText);
        y += scoreText.height + 44 * u;

        if (!isPerfect && this.errors.length > 0) {
            const areasTitle = this.add.text(cx, y, 'AREAS FOR IMPROVEMENT:', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${Math.round(38 * u)}px`,
                color: '#ff4444',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0);
            ui.add(areasTitle);
            y += areasTitle.height + 24 * u;

            // List unique errors
            const uniqueErrors = [];
            const seen = new Set();
            for (const error of this.errors) {
                if (!seen.has(error.title)) {
                    uniqueErrors.push(error);
                    seen.add(error.title);
                }
            }

            uniqueErrors.forEach((error) => {
                const errorText = this.add.text(cx, y, `${error.title}: ${error.description}`, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: `${Math.round(30 * u)}px`,
                    color: '#ffffff',
                    align: 'center',
                    wordWrap: { width: contentW }
                }).setOrigin(0.5, 0);
                ui.add(errorText);
                y += errorText.height + 18 * u;
            });
            y += 20 * u;
        }

        if (!isPerfect) {
            const tryTitle = this.add.text(cx, y, 'TRY AGAIN', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${Math.round(48 * u)}px`,
                color: '#00ffff',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0);
            ui.add(tryTitle);
            y += tryTitle.height + 16 * u;

            const goText = this.add.text(cx, y, 'Go for 10 out of 10', {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${Math.round(34 * u)}px`,
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5, 0);
            ui.add(goText);
            y += goText.height;
        }

        // Scale the flowing content down if it collides with the button area
        const availableH = height - 200 * u;
        if (y > availableH) {
            const s = availableH / y;
            ui.setScale(s);
            ui.x = (width - width * s) / 2;
        }

        // Restart Button (pinned to the bottom, outside the scaled container)
        const btnW = Math.min(width * 0.7, 420 * u);
        const btnH = 96 * u;
        const restartBtn = this.add.container(cx, height - 110 * u);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.1);

        const btnText = this.add.text(0, 0, 'TRY AGAIN', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(38 * u)}px`,
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        restartBtn.add([btnBg, btnText]);
        restartBtn.setInteractive(
            new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );

        restartBtn.on('pointerover', () => {
            this.drawButton(btnBg, btnW, btnH, 0xff00ff, 0.3);
            btnText.setColor('#00ffff');
        });

        restartBtn.on('pointerout', () => {
            this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.1);
            btnText.setColor('#ffffff');
        });

        restartBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.registry.set('ERRORS', []);
                this.scene.start('confirmation_bias', { score: 0 });
            });
        });

        if (isPerfect) {
            this.celebrate();
            this.time.delayedCall(500, () => {
                import('../AudioManager.js').then(m => m.audioManager.playReward());
            });
        }
    }

    celebrate() {
        const { width, height } = this.cameras.main;

        // Fireworks effect
        this.time.addEvent({
            delay: 200,
            repeat: 15,
            callback: () => {
                const x = Phaser.Math.Between(100, width - 100);
                const y = Phaser.Math.Between(100, height - 100);
                const color = Phaser.Display.Color.RandomRGB().color;

                for (let i = 0; i < 30; i++) {
                    const part = this.add.circle(x, y, 4, color);
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 100 + Math.random() * 300;

                    this.tweens.add({
                        targets: part,
                        x: x + Math.cos(angle) * speed,
                        y: y + Math.sin(angle) * speed,
                        alpha: 0,
                        scale: 0.1,
                        duration: 800 + Math.random() * 400,
                        ease: 'Quad.easeOut',
                        onComplete: () => part.destroy()
                    });
                }
            }
        });
    }

    drawButton(graphics, w, h, color, alpha) {
        graphics.clear();
        graphics.lineStyle(4, color, 1);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 15);
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 15);
        // Glow effect
        graphics.lineStyle(8, color, 0.3);
        graphics.strokeRoundedRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, 20);
    }
}
