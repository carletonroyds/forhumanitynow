import Phaser from 'phaser';
import { BiasData, IdentificationDistractors } from '../BiasData.js';
import { audioManager } from '../AudioManager.js';

export class KnowledgeQuizScene extends Phaser.Scene {
    constructor() {
        super('KnowledgeQuizScene');
    }

    init(data) {
        this.score = data.score || 0;
        this.quizIndex = data.quizIndex || 0;
        this.bias = BiasData[this.quizIndex];
        this.selected = false;

        // Prepare quiz options (Correct title + 2 random distractors)
        const distractors = [...IdentificationDistractors];
        Phaser.Utils.Array.Shuffle(distractors);
        
        const options = [this.bias.title, distractors[0], distractors[1]];
        Phaser.Utils.Array.Shuffle(options);
        
        this.shuffledOptions = options;
        this.shuffledCorrectIndex = options.indexOf(this.bias.title);
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
        this.cardPadding = cardPadding;
        const contentWidth = cardWidth - (cardPadding * 2);

        // Breakpoint-based font sizes
        let titleSize, questionSize, instrSize, btnFontSize, minBtnHeight;
        if (isDesktop) {
            titleSize = 30;
            questionSize = 20;
            instrSize = 15;
            btnFontSize = 17;
            minBtnHeight = 52;
        } else if (width >= 768) {
            titleSize = 26;
            questionSize = 18;
            instrSize = 14;
            btnFontSize = 16;
            minBtnHeight = 48;
        } else {
            titleSize = 20;
            questionSize = 16;
            instrSize = 13;
            btnFontSize = 15;
            minBtnHeight = 44;
        }

        // Background
        const bg = this.add.image(width / 2, height / 2, this.bias.bg);
        const bgScale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(bgScale);
        
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.3);
        overlay.fillRect(0, 0, width, height);

        // Progress Pill (11-20 of 20 total questions)
        const totalSteps = BiasData.length * 2;
        const currentStep = BiasData.length + this.quizIndex + 1;
        
        let currentY = cardPadding;

        const progressText = this.add.text(cardWidth / 2, currentY + 11, `${currentStep} / ${totalSteps}`, {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '11px',
            color: '#666666',
            fontWeight: '700'
        }).setOrigin(0.5);
        
        const pillWidth = progressText.width + 20;
        const pillHeight = 22;
        const pillBg = this.add.graphics();
        pillBg.fillStyle(0xeeeeee, 1);
        pillBg.fillRoundedRect((cardWidth - pillWidth) / 2, currentY, pillWidth, pillHeight, 11);
        currentY += pillHeight + 20;

        // Title
        const title = this.add.text(cardWidth / 2, currentY, "KNOWLEDGE TEST", {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${titleSize}px`,
            color: '#111111',
            fontWeight: '800',
            align: 'center',
            letterSpacing: 2
        }).setOrigin(0.5, 0);
        currentY += title.displayHeight + 15;

        // Instruction
        const instruction = this.add.text(cardWidth / 2, currentY, "Which bias does this scenario demonstrate?", {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${instrSize}px`,
            color: '#888888',
            fontWeight: '600',
            align: 'center',
            wordWrap: { width: contentWidth }
        }).setOrigin(0.5, 0);
        currentY += instruction.displayHeight + 30;

        // Question (Scenario)
        const question = this.add.text(cardWidth / 2, currentY, this.bias.question, {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: `${questionSize}px`,
            color: '#111111',
            align: 'center',
            fontWeight: '600',
            wordWrap: { width: contentWidth }
        }).setOrigin(0.5, 0);
        currentY += question.displayHeight + 40;

        // Options
        this.optionButtons = [];
        const btnPaddingVal = 16;
        const buttons = this.shuffledOptions.map((option, index) => {
            const btnContainer = this.add.container(cardWidth / 2, 0);
            const btnBg = this.add.graphics();
            const btnText = this.add.text(0, 0, option, {
                fontFamily: 'Montserrat, sans-serif',
                fontSize: `${btnFontSize}px`,
                color: '#333333',
                align: 'center',
                fontWeight: '600',
                wordWrap: { width: contentWidth - 40 }
            }).setOrigin(0.5);

            const dynamicBtnHeight = Math.max(minBtnHeight, btnText.height + (btnPaddingVal * 2));
            this.drawButton(btnBg, contentWidth, dynamicBtnHeight, 0xf8f8f8, 1);

            btnContainer.add([btnBg, btnText]);
            btnContainer.y = currentY + dynamicBtnHeight / 2;
            btnContainer.setInteractive(new Phaser.Geom.Rectangle(-contentWidth / 2, -dynamicBtnHeight / 2, contentWidth, dynamicBtnHeight), Phaser.Geom.Rectangle.Contains);

            btnContainer.on('pointerover', () => {
                if (!this.selected) {
                    this.drawButton(btnBg, contentWidth, dynamicBtnHeight, 0xeeeeee, 1);
                    document.body.style.cursor = 'pointer';
                }
            });

            btnContainer.on('pointerout', () => {
                if (!this.selected) {
                    this.drawButton(btnBg, contentWidth, dynamicBtnHeight, 0xf8f8f8, 1);
                    document.body.style.cursor = 'default';
                }
            });

            btnContainer.on('pointerdown', () => {
                document.body.style.cursor = 'default';
                this.handleAnswer(index, btnBg, btnText, this.shuffledCorrectIndex, contentWidth, dynamicBtnHeight);
            });

            currentY += dynamicBtnHeight + 12;
            this.optionButtons.push({ container: btnContainer, bg: btnBg, text: btnText, w: contentWidth, h: dynamicBtnHeight });
            return btnContainer;
        });

        const cardHeight = currentY + cardPadding;

        // Final Card Graphics — saved so showNextButton can redraw it
        const cardGraphics = this.add.graphics();
        cardGraphics.fillStyle(0xffffff, 1);
        cardGraphics.fillRoundedRect(0, 0, cardWidth, cardHeight, 16);

        // Container
        const mainContainer = this.add.container(0, 0);
        mainContainer.add([cardGraphics, pillBg, progressText, title, instruction, question, ...buttons]);

        // Centering logic
        this._centerContainer(mainContainer, cardWidth, cardHeight, width, height);

        this.mainContainer = mainContainer;
        this.cardGraphics = cardGraphics;
        this.cardWidth = cardWidth;
        this.cardHeight = cardHeight;
        this.contentWidth = contentWidth;
    }

    _centerContainer(container, cardWidth, cardHeight, width, height) {
        const maxAllowedHeight = height * 0.95;
        if (cardHeight > maxAllowedHeight) {
            const scale = maxAllowedHeight / cardHeight;
            container.setScale(scale);
            container.setPosition((width - cardWidth * scale) / 2, (height - cardHeight * scale) / 2);
        } else {
            container.setScale(1);
            container.setPosition((width - cardWidth) / 2, (height - cardHeight) / 2);
        }
    }

    drawButton(graphics, w, h, color, alpha) {
        graphics.clear();
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
        graphics.lineStyle(1, 0xdddddd, 1);
        graphics.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    }

    handleAnswer(index, bg, text, correctIndex, w, h) {
        if (this.selected) return;
        this.selected = true;

        const isCorrect = index === correctIndex;
        if (isCorrect) {
            audioManager.playCorrect();
            this.score++;
        } else {
            audioManager.playIncorrect();
            const errors = this.registry.get('ERRORS') || [];
            if (!errors.includes(this.bias.title)) {
                errors.push(this.bias.title);
            }
            this.registry.set('ERRORS', errors);
        }

        this.optionButtons.forEach((btn, i) => {
            if (i === correctIndex) {
                this.drawButton(btn.bg, btn.w, btn.h, 0xeefdf3, 1);
                btn.bg.lineStyle(2, 0x22c55e, 1);
                btn.bg.strokeRoundedRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 8);
                btn.text.setColor('#166534').setFontStyle('bold');
            } else if (i === index && !isCorrect) {
                this.drawButton(btn.bg, btn.w, btn.h, 0xfef2f2, 1);
                btn.bg.lineStyle(2, 0xef4444, 1);
                btn.bg.strokeRoundedRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h, 8);
                btn.text.setColor('#991b1b').setFontStyle('bold');
            }
        });

        this.showNextButton();
    }

    showNextButton() {
        const lastBtn = this.optionButtons[this.optionButtons.length - 1];
        const btnH = 50;
        const btnW = 200;
        // Place button center below last answer button
        const nextY = lastBtn.container.y + (lastBtn.h / 2) + 30 + btnH / 2;
        // New card height expands to contain the button + bottom padding
        const newCardHeight = nextY + btnH / 2 + this.cardPadding;

        const nextBtn = this.add.container(this.cardWidth / 2, nextY);
        const btnBg = this.add.graphics();
        this.drawButton(btnBg, btnW, btnH, 0x111111, 1);

        const btnText = this.add.text(0, 0, 'CONTINUE', {
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
            fontWeight: '700',
            letterSpacing: 2
        }).setOrigin(0.5);

        nextBtn.add([btnBg, btnText]);
        nextBtn.setInteractive(new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH), Phaser.Geom.Rectangle.Contains);

        nextBtn.on('pointerover', () => {
            document.body.style.cursor = 'pointer';
            this.drawButton(btnBg, btnW, btnH, 0x333333, 1);
        });
        nextBtn.on('pointerout', () => {
            document.body.style.cursor = 'default';
            this.drawButton(btnBg, btnW, btnH, 0x111111, 1);
        });

        nextBtn.on('pointerdown', () => {
            document.body.style.cursor = 'default';
            const nextIndex = this.quizIndex + 1;
            this.cameras.main.fadeOut(800, 255, 255, 255);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                if (nextIndex < BiasData.length) {
                    this.scene.start('KnowledgeQuizScene', { score: this.score, quizIndex: nextIndex });
                } else {
                    this.scene.start('ResultScene', { score: this.score });
                }
            });
        });

        if (this.mainContainer) {
            this.mainContainer.add(nextBtn);
            // Expand card background to include the Continue button
            this.cardGraphics.clear();
            this.cardGraphics.fillStyle(0xffffff, 1);
            this.cardGraphics.fillRoundedRect(0, 0, this.cardWidth, newCardHeight, 16);
            // Re-center with the new height
            const { width, height } = this.scale;
            this._centerContainer(this.mainContainer, this.cardWidth, newCardHeight, width, height);
            this.cardHeight = newCardHeight;
        }

        nextBtn.setAlpha(0);
        this.tweens.add({ targets: nextBtn, alpha: 1, duration: 500 });
    }
}