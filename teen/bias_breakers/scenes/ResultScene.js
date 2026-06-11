import Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.score = data.score || 0;
        this.errors = this.registry.get('ERRORS') || [];
    }

    create() {
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Background
        this.add.image(width / 2, height / 2, '00_start_screen.jpg').setDisplaySize(width, height);
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, width, height);

        const isPerfect = this.score === 10;
        let titleStr = isPerfect ? "WELL DONE" : "MISSION COMPLETE";

        // Title Text
        const resultTitle = this.add.text(width / 2, 100, titleStr, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '84px',
            color: '#00ffff',
            fontWeight: 'bold',
            shadow: { blur: 20, color: '#00ffff', fill: true }
        }).setOrigin(0.5);

        // Score Text
        this.add.text(width / 2, 220, `TOTAL SCORE: ${this.score} / 10`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '54px',
            color: '#ff00ff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        let nextY = 320;

        if (!isPerfect && this.errors.length > 0) {
            this.add.text(width / 2, nextY, "AREAS FOR IMPROVEMENT:", {
                fontFamily: 'Arial, sans-serif',
                fontSize: '32px',
                color: '#ff0000',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            nextY += 60;

            // List unique errors
            const uniqueErrors = [];
            const seen = new Set();
            for (const error of this.errors) {
                if (!seen.has(error.title)) {
                    uniqueErrors.push(error);
                    seen.add(error.title);
                }
            }

            uniqueErrors.forEach((error, index) => {
                const errorText = this.add.text(width / 2, nextY, `${error.title}: ${error.description}`, {
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '24px',
                    color: '#ffffff',
                    align: 'center',
                    wordWrap: { width: 1200 }
                }).setOrigin(0.5);
                nextY += errorText.height + 20;
            });
        }

        if (!isPerfect) {
            nextY = Math.max(nextY, height - 350);
            this.add.text(width / 2, nextY, "TRY AGAIN", {
                fontFamily: 'Arial, sans-serif',
                fontSize: '48px',
                color: '#00ffff',
                fontWeight: 'bold'
            }).setOrigin(0.5);
            nextY += 60;

            this.add.text(width / 2, nextY, "Go for 10 out of 10", {
                fontFamily: 'Arial, sans-serif',
                fontSize: '32px',
                color: '#ffffff',
                fontWeight: 'bold'
            }).setOrigin(0.5);
        }

        // Restart Button
        const restartBtn = this.add.container(width / 2, height - 120);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, 400, 80, 0x00ffff, 0.1);
        
        const btnText = this.add.text(0, 0, "TRY AGAIN", {
            fontFamily: 'Arial, sans-serif',
            fontSize: '32px',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        restartBtn.add([btnBg, btnText]);
        restartBtn.setInteractive(new Phaser.Geom.Rectangle(-200, -40, 400, 80), Phaser.Geom.Rectangle.Contains);

        restartBtn.on('pointerover', () => {
            this.drawButton(btnBg, 400, 80, 0xff00ff, 0.3);
            btnText.setColor('#00ffff');
        });

        restartBtn.on('pointerout', () => {
            this.drawButton(btnBg, 400, 80, 0x00ffff, 0.1);
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
