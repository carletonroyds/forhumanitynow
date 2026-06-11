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
        const { width, height } = this.cameras.main;
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Background
        this.add.image(width / 2, height / 2, this.bias.bg).setDisplaySize(width, height);
        
        // Dark overlay for readability
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, width, height);

        // Progress Bar at top
        const pbY = 40; 
        const pbWidth = 1000;
        const pbHeight = 15;
        const progress = (this.biasIndex + 1) / BiasData.length;
        
        const pbBg = this.add.graphics();
        pbBg.fillStyle(0x333333, 1);
        pbBg.fillRoundedRect((width - pbWidth) / 2, pbY, pbWidth, pbHeight, 10);
        
        const pbFill = this.add.graphics();
        pbFill.fillStyle(0x00ffff, 1);
        pbFill.fillRoundedRect((width - pbWidth) / 2, pbY, pbWidth * progress, pbHeight, 10);
        
        const progressText = this.add.text(width / 2, pbY + 40, `PROGRESS: ${this.biasIndex + 1} / 10`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '20px',
            color: '#00ffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Header: Bias Name and Description
        let nextY = 160; 

        this.add.text(width / 2, nextY, this.bias.title.toUpperCase(), {
            fontFamily: 'Arial, sans-serif',
            fontSize: '54px',
            color: '#ff00ff',
            fontWeight: 'bold',
            stroke: '#00ffff',
            strokeThickness: 2,
            shadow: { blur: 15, color: '#ff00ff', fill: true }
        }).setOrigin(0.5);
        nextY += 60;

        this.add.text(width / 2, nextY, this.bias.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        nextY += 80;

        // Instruction Text
        const instructionStr = "Select the answer that demonstrates this bias";
        
        const instructionText = this.add.text(width / 2, nextY, instructionStr, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '40px',
            color: '#ffffff',
            fontWeight: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // Auto-scale instruction text to force single line
        const maxW = 1600;
        if (instructionText.width > maxW) {
            instructionText.setScale(maxW / instructionText.width);
        }
        nextY += 80;

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0x00ffff, 0.4);
        divider.lineBetween(width / 2 - 700, nextY, width / 2 + 700, nextY);
        nextY += 100;

        // Large centered question
        const questionText = this.bias.question;
        const qStyle = {
            fontFamily: 'Arial, sans-serif',
            fontSize: '44px',
            color: '#00ffff',
            align: 'center',
            fontWeight: 'bold',
            wordWrap: { width: 1500 }
        };

        const qDisplay = this.add.text(width / 2, nextY, questionText, qStyle).setOrigin(0.5);
        nextY += qDisplay.height + 60;

        // 3 Stacked buttons
        this.optionButtons = [];
        const currentOptions = this.bias.options; 
        const currentCorrectIndex = this.bias.biasedIndex;

        currentOptions.forEach((option, index) => {
            const btnWidth = 1000;
            const btnHeight = 90;
            const x = width / 2;
            const y = nextY + index * 120;

            const btnContainer = this.add.container(x, y);
            const btnBg = this.add.graphics();
            this.drawButton(btnBg, btnWidth, btnHeight, 0x00ffff, 0.1);

            const btnText = this.add.text(0, 0, option, {
                fontFamily: 'Arial, sans-serif',
                fontSize: '32px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: btnWidth - 40 }
            }).setOrigin(0.5);

            btnContainer.add([btnBg, btnText]);
            btnContainer.setInteractive(new Phaser.Geom.Rectangle(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight), Phaser.Geom.Rectangle.Contains);

            btnContainer.on('pointerover', () => {
                this.drawButton(btnBg, btnWidth, btnHeight, 0xff00ff, 0.3);
                btnText.setColor('#00ffff');
            });

            btnContainer.on('pointerout', () => {
                if (!this.selected) {
                    this.drawButton(btnBg, btnWidth, btnHeight, 0x00ffff, 0.1);
                    btnText.setColor('#ffffff');
                }
            });

            btnContainer.on('pointerdown', () => this.handleAnswer(index, btnBg, btnText, currentCorrectIndex));
            this.optionButtons.push({ container: btnContainer, bg: btnBg, text: btnText });
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

    handleAnswer(index, bg, text, correctIndex) {
        if (this.selected) return;
        this.selected = true;

        const isCorrect = index === correctIndex;
        if (isCorrect) {
            audioManager.playCorrect();
            this.score++;
            this.drawButton(bg, 1000, 90, 0x00ff00, 0.4);
            text.setColor('#ffffff');
            text.setText("✓ " + text.text);
        } else {
            audioManager.playIncorrect();
            this.drawButton(bg, 1000, 90, 0xff0000, 0.4);
            text.setColor('#ffffff');
            text.setText("✗ " + text.text);
            
            // Show correct answer
            const correctBtn = this.optionButtons[correctIndex];
            this.drawButton(correctBtn.bg, 1000, 90, 0x00ff00, 0.4);

            // Track error - store title and description
            const errors = this.registry.get('ERRORS') || [];
            errors.push({ title: this.bias.title, description: this.bias.description });
            this.registry.set('ERRORS', errors);
        }

        this.showNextButton();
    }

    showNextButton() {
        const { width, height } = this.cameras.main;
        const nextBtn = this.add.container(width - 250, height - 100);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, 250, 70, 0xff00ff, 0.2);

        const btnText = this.add.text(0, 0, 'NEXT >>', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '32px',
            color: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        nextBtn.add([btnBg, btnText]);
        nextBtn.setInteractive(new Phaser.Geom.Rectangle(-125, -35, 250, 70), Phaser.Geom.Rectangle.Contains);

        nextBtn.on('pointerover', () => {
            this.drawButton(btnBg, 250, 70, 0x00ffff, 0.5);
        });

        nextBtn.on('pointerout', () => {
            this.drawButton(btnBg, 250, 70, 0xff00ff, 0.2);
        });

        nextBtn.on('pointerdown', () => {
            const nextIndex = this.biasIndex + 1;
            if (nextIndex < BiasData.length) {
                const nextSceneKey = BiasData[nextIndex].id;
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start(nextSceneKey, { score: this.score });
                });
            } else {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('ResultScene', { score: this.score });
                });
            }
        });

        // Entrance animation
        nextBtn.setAlpha(0);
        this.tweens.add({
            targets: nextBtn,
            alpha: 1,
            x: width - 200,
            duration: 500,
            ease: 'Power2'
        });
    }
}
