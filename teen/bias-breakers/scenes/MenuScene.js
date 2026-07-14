import Phaser from 'phaser';
import { audioManager } from '../AudioManager.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;
        const isPortrait = height > width;
        const u = isPortrait
            ? Math.min(width / 720, height / 1080)
            : Math.min(height / 1080, width / 1280);
        const cx = width / 2;

        // Reset game state
        this.registry.set('ERRORS', []);
        this.registry.set('SCORE', 0);

        // Background — cover without distortion
        const bg = this.add.image(cx, height / 2, '00_start_screen.jpg');
        bg.setScale(Math.max(width / bg.width, height / bg.height));

        // Overlay for neon effect
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, width, height);

        // Top Instructions
        this.add.text(cx, (isPortrait ? 0.05 : 0.06) * height,
            "Identify the bias in each scenario.\nSelect the answer that demonstrates it.", {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round((isPortrait ? 42 : 50) * u)}px`,
            color: '#ffffff',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#00ffff',
            strokeThickness: 2,
            shadow: { blur: 20, color: '#ff00ff', fill: true },
            wordWrap: { width: width * 0.92 }
        }).setOrigin(0.5, 0);

        // Title
        const titleText = this.add.text(cx, isPortrait ? height * 0.34 : height / 2 - 150 * u, 'BIAS BREAKERS', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round((isPortrait ? 96 : 110) * u)}px`,
            color: '#00ffff',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#ff00ff',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 30, stroke: true, fill: true }
        }).setOrigin(0.5);
        if (titleText.width > width * 0.95) {
            titleText.setScale((width * 0.95) / titleText.width);
        }

        // Subtitle
        this.add.text(cx, titleText.y + titleText.displayHeight / 2 + 60 * u, 'Rewire & Hack Your Brain', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round((isPortrait ? 48 : 58) * u)}px`,
            color: '#ffffff',
            fontStyle: 'bold italic',
            shadow: { blur: 15, color: '#00ffff', fill: true }
        }).setOrigin(0.5);

        // Character
        const character = this.add.image(0, 0, 'start-character').setOrigin(0.5);
        const maxCharW = isPortrait ? width * 0.55 : width * 0.28;
        const maxCharH = isPortrait ? height * 0.26 : height * 0.55;
        const charScale = Math.min(1.1, maxCharW / character.width, maxCharH / character.height);
        character.setScale(charScale);

        const charX = isPortrait ? cx : width * 0.82;
        const charY = isPortrait ? height * 0.66 : height * 0.6;

        const charGlow = this.add.graphics();
        charGlow.fillStyle(0x00ffff, 0.15);
        charGlow.fillCircle(0, 0, character.displayWidth * 0.6);

        const charContainer = this.add.container(charX, charY, [charGlow, character]);

        this.tweens.add({
            targets: charContainer,
            y: charY - 25 * u,
            duration: 2500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: charGlow,
            alpha: 0.05,
            scale: 1.2,
            duration: 2500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Start Button
        const btnW = Math.min(width * 0.7, 460 * u);
        const btnH = 110 * u;
        const startBtn = this.add.container(cx, height - (isPortrait ? 110 : 140) * u);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.2);

        const btnText = this.add.text(0, 0, 'START', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(50 * u)}px`,
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        startBtn.add([btnBg, btnText]);
        startBtn.setInteractive(
            new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
            Phaser.Geom.Rectangle.Contains
        );

        startBtn.on('pointerover', () => {
            this.drawButton(btnBg, btnW, btnH, 0xff00ff, 0.4);
            btnText.setColor('#00ffff');
            this.tweens.add({ targets: startBtn, scaleX: 1.05, scaleY: 1.05, duration: 200 });
        });

        startBtn.on('pointerout', () => {
            this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.2);
            btnText.setColor('#ffffff');
            this.tweens.add({ targets: startBtn, scaleX: 1, scaleY: 1, duration: 200 });
        });

        startBtn.on('pointerdown', async () => {
            await audioManager.init(); // Initialize audio on first click
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('confirmation_bias', { score: 0 });
            });
        });

        // Glowing animation for title
        this.tweens.add({
            targets: titleText,
            alpha: 0.85,
            duration: 150,
            yoyo: true,
            repeat: -1,
            repeatDelay: 3000
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
