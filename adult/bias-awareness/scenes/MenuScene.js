import Phaser from 'phaser';
import { audioManager } from '../AudioManager.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.layout();
        this.scale.on('resize', this.layout, this);
    }

    layout() {
        this.children.removeAll();
        const { width, height } = this.scale;
        
        const isDesktop = width >= 900;
        const cardWidth = isDesktop ? 720 : width * 0.9;
        const cardPadding = isDesktop ? 48 : 20;
        const contentWidth = cardWidth - (cardPadding * 2);

        // Breakpoint-based sizing logic
        let titleSize, instrSize, btnFontSize;
        if (isDesktop) {
            titleSize = 30;
            instrSize = 15;
            btnFontSize = 18;
        } else if (width >= 768) {
            titleSize = 26;
            instrSize = 14;
            btnFontSize = 17;
        } else {
            titleSize = 20;
            instrSize = 13;
            btnFontSize = 16;
        }

        // Reset game state
        this.registry.set('ERRORS', []);
        this.registry.set('SCORE', 0);

        // Background
        const bg = this.add.image(width / 2, height / 2, '00_start_screen.jpg');
        const bgScale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(bgScale);

        // Subtle dark overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.4);
        overlay.fillRect(0, 0, width, height);

        let currentY = cardPadding;

        // Game Name
        const titleText = this.add.text(cardWidth / 2, currentY, 'BIAS AWARENESS', {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${titleSize}px`,
            color: '#111111',
            align: 'center',
            fontWeight: '800',
            letterSpacing: 2
        }).setOrigin(0.5, 0);
        currentY += titleText.displayHeight + 30;

        // Large Instructions
        const instructions = this.add.text(cardWidth / 2, currentY, "Study the bias shown. Select the scenario action that demonstrates that specific bias.", {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${instrSize}px`,
            color: '#4c4c4c',
            align: 'center',
            fontWeight: '600',
            wordWrap: { width: contentWidth }
        }).setOrigin(0.5, 0);
        currentY += instructions.displayHeight + 40;

        // Start Button
        const btnWidth = contentWidth;
        const btnHeight = 60;
        const startBtn = this.add.container(cardWidth / 2, currentY + btnHeight / 2);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, btnWidth, btnHeight, 0x111111, 1);
        
        const btnText = this.add.text(0, 0, 'BEGIN STUDY', {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${btnFontSize}px`,
            color: '#ffffff',
            fontWeight: '700',
            letterSpacing: 2
        }).setOrigin(0.5);

        startBtn.add([btnBg, btnText]);
        startBtn.setInteractive(new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);

        startBtn.on('pointerover', () => {
            document.body.style.cursor = 'pointer';
            this.drawButton(btnBg, btnWidth, btnHeight, 0x333333, 1);
        });
        startBtn.on('pointerout', () => {
            document.body.style.cursor = 'default';
            this.drawButton(btnBg, btnWidth, btnHeight, 0x111111, 1);
        });

        startBtn.on('pointerdown', async () => {
            document.body.style.cursor = 'default';
            await audioManager.init();
            this.cameras.main.fadeOut(800, 255, 255, 255);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('confirmation_bias', { score: 0 });
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
        mainContainer.add([cardGraphics, titleText, instructions, startBtn]);

        // Centering
        mainContainer.setPosition((width - cardWidth) / 2, (height - cardHeight) / 2);

        this.mainContainer = mainContainer;
    }

    drawButton(graphics, w, h, color, alpha) {
        graphics.clear();
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
        graphics.lineStyle(1, 0xdddddd, 1);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    }
}