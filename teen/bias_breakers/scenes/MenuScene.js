import Phaser from 'phaser';
import { audioManager } from '../AudioManager.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Reset game state
        this.registry.set('ERRORS', []);
        this.registry.set('SCORE', 0);

        // Background
        this.add.image(width / 2, height / 2, '00_start_screen.jpg').setDisplaySize(width, height);

        // Overlay for neon effect
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, width, height);

        // Top Instructions
        this.add.text(width / 2, 120, "Identify the bias in each scenario.\nSelect the answer that demonstrates it.", {
            fontFamily: 'Arial, sans-serif',
            fontSize: '52px',
            color: '#ffffff',
            align: 'center',
            fontWeight: '900',
            stroke: '#00ffff',
            strokeThickness: 2,
            shadow: { blur: 20, color: '#ff00ff', fill: true }
        }).setOrigin(0.5);

        // Title
        const titleText = this.add.text(width / 2, height / 2 - 150, 'BIAS BREAKERS', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '110px',
            color: '#00ffff',
            align: 'center',
            fontWeight: 'bold',
            stroke: '#ff00ff',
            strokeThickness: 4,
            shadow: { offsetX: 0, offsetY: 0, color: '#00ffff', blur: 30, stroke: true, fill: true }
        }).setOrigin(0.5);

        // Subtitle (Replacement)
        const subtitleText = this.add.text(width / 2, height / 2 - 10, 'Rewire & Hack Your Brain', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '60px',
            color: '#ffffff',
            fontWeight: 'bold',
            fontStyle: 'italic',
            shadow: { blur: 15, color: '#00ffff', fill: true }
        }).setOrigin(0.5);

        // Character (start_character_v2.png)
        const charX = width * 0.82;
        const charY = height * 0.6;
        
        // Add a subtle glow highlight behind the character
        const charGlow = this.add.graphics();
        charGlow.fillStyle(0x00ffff, 0.15);
        charGlow.fillCircle(0, 0, 300);
        
        const character = this.add.image(0, 0, 'start-character')
            .setOrigin(0.5)
            .setScale(1.1); // Slightly larger for prominence

        const charContainer = this.add.container(charX, charY, [charGlow, character]);
        
        this.tweens.add({
            targets: charContainer,
            y: charY - 25,
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
        const startBtn = this.add.container(width / 2, height - 150);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, 450, 100, 0x00ffff, 0.2);
        
        const btnText = this.add.text(0, 0, 'START', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '48px',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        startBtn.add([btnBg, btnText]);
        startBtn.setInteractive(new Phaser.Geom.Rectangle(-225, -50, 450, 100), Phaser.Geom.Rectangle.Contains);

        startBtn.on('pointerover', () => {
            this.drawButton(btnBg, 450, 100, 0xff00ff, 0.4);
            btnText.setColor('#00ffff');
            this.tweens.add({
                targets: startBtn,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200
            });
        });

        startBtn.on('pointerout', () => {
            this.drawButton(btnBg, 450, 100, 0x00ffff, 0.2);
            btnText.setColor('#ffffff');
            this.tweens.add({
                targets: startBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 200
            });
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
