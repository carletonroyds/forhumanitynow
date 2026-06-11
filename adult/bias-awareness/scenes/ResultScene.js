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
        this.layout();
        this.scale.on('resize', this.layout, this);
        this.cameras.main.fadeIn(800, 255, 255, 255);
    }

    layout() {
        this.children.removeAll();
        const { width, height } = this.scale;
        
        const isDesktop = width >= 900;
        const cardWidth = isDesktop ? 720 : width * 0.9;
        const cardPadding = isDesktop ? 48 : 20;
        const contentWidth = cardWidth - (cardPadding * 2);

        // Breakpoint-based font sizes
        let titleSize, btnFontSize;
        if (isDesktop) {
            titleSize = 30;
            btnFontSize = 18;
        } else if (width >= 768) {
            titleSize = 26;
            btnFontSize = 17;
        } else {
            titleSize = 20;
            btnFontSize = 16;
        }

        // Background
        const bg = this.add.image(width / 2, height / 2, '00_start_screen.jpg');
        const bgScale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(bgScale);
        
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.3);
        overlay.fillRect(0, 0, width, height);

        const isPerfect = this.score === 20;
        let titleStr = isPerfect ? "WELL DONE" : "STUDY COMPLETE";
        
        let currentY = cardPadding;

        // Title Text
        const titleText = this.add.text(cardWidth / 2, currentY, titleStr, {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${titleSize}px`,
            color: '#111111',
            fontWeight: '800',
            letterSpacing: 2
        }).setOrigin(0.5, 0);
        currentY += titleText.displayHeight + 20;

        // Total Score
        const scoreText = this.add.text(cardWidth / 2, currentY, `SCORE: ${this.score} / 20`, {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '24px',
            color: '#111111',
            fontWeight: '700'
        }).setOrigin(0.5, 0);
        currentY += scoreText.displayHeight + 40;

        let errorHeader, errorList;
        if (!isPerfect && this.errors.length > 0) {
            errorHeader = this.add.text(cardWidth / 2, currentY, "Areas for improvement:", {
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                color: '#666666',
                fontWeight: '700',
                letterSpacing: 2
            }).setOrigin(0.5, 0);
            currentY += errorHeader.displayHeight + 10;

            errorList = this.add.text(cardWidth / 2, currentY, this.errors.join(', ').toUpperCase(), {
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                color: '#111111',
                align: 'center',
                fontWeight: '400',
                wordWrap: { width: contentWidth }
            }).setOrigin(0.5, 0);
            currentY += errorList.displayHeight + 40;
        }

        // Restart Button
        const btnWidth = contentWidth;
        const btnHeight = 60;
        const restartBtn = this.add.container(cardWidth / 2, currentY + btnHeight / 2);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, btnWidth, btnHeight, 0x111111, 1);
        
        const btnText = this.add.text(0, 0, 'TRY AGAIN', {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${btnFontSize}px`,
            color: '#ffffff',
            fontWeight: '700',
            letterSpacing: 2
        }).setOrigin(0.5);

        restartBtn.add([btnBg, btnText]);
        restartBtn.setInteractive(new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);

        restartBtn.on('pointerover', () => {
            document.body.style.cursor = 'pointer';
            this.drawButton(btnBg, btnWidth, btnHeight, 0x333333, 1);
        });
        restartBtn.on('pointerout', () => {
            document.body.style.cursor = 'default';
            this.drawButton(btnBg, btnWidth, btnHeight, 0x111111, 1);
        });

        restartBtn.on('pointerdown', () => {
            document.body.style.cursor = 'default';
            this.cameras.main.fadeOut(800, 255, 255, 255);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.registry.set('ERRORS', []); 
                this.registry.set('SCORE', 0);
                this.scene.start('MenuScene');
            });
        });
        currentY += btnHeight;

        const cardHeight = currentY + cardPadding;
        
        // Final Card Graphics
        const cardGraphics = this.add.graphics();
        cardGraphics.fillStyle(0xffffff, 1);
        cardGraphics.fillRoundedRect(0, 0, cardWidth, cardHeight, 16);

        // Container
        const mainContainer = this.add.container(0, 0);
        mainContainer.add([cardGraphics, titleText, scoreText, restartBtn]);
        if (errorHeader) mainContainer.add([errorHeader, errorList]);

        // Centering
        mainContainer.setPosition((width - cardWidth) / 2, (height - cardHeight) / 2);

        this.mainContainer = mainContainer;

        if (isPerfect) {
            this.celebrate();
            this.time.delayedCall(500, () => {
                import('../AudioManager.js').then(m => m.audioManager.playReward());
            });
        }
    }

    celebrate() {
        const { width, height } = this.scale;
        for (let i = 0; i < 40; i++) {
            const part = this.add.rectangle(width / 2, height / 2, 4, 12, 0xcccccc);
            const angle = Math.random() * Math.PI * 2;
            const dist = 200 + Math.random() * 600;
            this.tweens.add({
                targets: part,
                x: width / 2 + Math.cos(angle) * dist,
                y: height / 2 + Math.sin(angle) * dist,
                rotation: Math.random() * 10,
                alpha: 0,
                duration: 1500 + Math.random() * 1000,
                ease: 'Cubic.easeOut',
                onComplete: () => part.destroy()
            });
        }
    }

    drawButton(graphics, w, h, color, alpha) {
        graphics.clear();
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
        graphics.lineStyle(1, 0xdddddd, 1);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    }
}