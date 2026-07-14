import Phaser from 'phaser';
import { BiasData } from '../BiasData.js';
import { audioManager } from '../AudioManager.js';

export class BaseBiasScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.sceneKey = key;
    }

    init(data) {
        this.startScore = data.score || 0;
        this.score = this.startScore;
        this.biasIndex = BiasData.findIndex(b => b.id === this.sceneKey);
        this.bias = BiasData[this.biasIndex];
        this.selected = false;
    }

    // Used by the global resize handler so a mid-question resize
    // restarts the question without double-counting the score.
    getRestartData() {
        return { score: this.startScore };
    }

    create() {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;
        const isPortrait = height > width;
        // Design unit: 1 at the reference size, scales with the shorter axis
        const u = isPortrait ? width / 1080 : height / 1080;
        const cx = width / 2;

        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Background — cover the whole screen without distortion
        const bg = this.add.image(cx, height / 2, this.bias.bg);
        bg.setScale(Math.max(width / bg.width, height / bg.height));

        // Dark overlay for readability
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.72);
        overlay.fillRect(0, 0, width, height);

        // All UI lives in one container so it can be scaled down
        // as a whole if it ever overflows the screen.
        const ui = this.add.container(0, 0);
        this.ui = ui;

        const contentW = Math.min(width * 0.92, 1500 * u);
        let y = 36 * u;

        // ----- Progress bar -----
        const pbWidth = Math.min(width * 0.86, 1000 * u);
        const pbHeight = 16 * u;
        const progress = (this.biasIndex + 1) / BiasData.length;

        const pbBg = this.add.graphics();
        pbBg.fillStyle(0x333333, 1);
        pbBg.fillRoundedRect(cx - pbWidth / 2, y, pbWidth, pbHeight, pbHeight / 2);
        const pbFill = this.add.graphics();
        pbFill.fillStyle(0x00ffff, 1);
        pbFill.fillRoundedRect(cx - pbWidth / 2, y, pbWidth * progress, pbHeight, pbHeight / 2);
        ui.add([pbBg, pbFill]);
        y += pbHeight + 18 * u;

        const progressText = this.add.text(cx, y, `${this.biasIndex + 1} / ${BiasData.length}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(30 * u)}px`,
            color: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0);
        ui.add(progressText);
        y += progressText.height + 28 * u;

        // ----- Bias title -----
        const title = this.add.text(cx, y, this.bias.title.toUpperCase(), {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(60 * u)}px`,
            color: '#ff00ff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#00ffff',
            strokeThickness: 2,
            shadow: { blur: 15, color: '#ff00ff', fill: true },
            wordWrap: { width: contentW }
        }).setOrigin(0.5, 0);
        ui.add(title);
        y += title.height + 22 * u;

        // ----- Bias description -----
        const desc = this.add.text(cx, y, this.bias.description, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(34 * u)}px`,
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: contentW }
        }).setOrigin(0.5, 0);
        ui.add(desc);
        y += desc.height + 30 * u;

        // ----- Instruction (same size as the question) -----
        const instruction = this.add.text(cx, y, 'Select the answer that demonstrates this bias', {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(44 * u)}px`,
            color: '#ffe14d',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: contentW }
        }).setOrigin(0.5, 0);
        ui.add(instruction);
        y += instruction.height + 30 * u;

        // ----- Divider -----
        const divider = this.add.graphics();
        divider.lineStyle(2 * u, 0x00ffff, 0.4);
        divider.lineBetween(cx - contentW / 2, y, cx + contentW / 2, y);
        ui.add(divider);
        y += 38 * u;

        // ----- Question -----
        const question = this.add.text(cx, y, this.bias.question, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${Math.round(44 * u)}px`,
            color: '#00ffff',
            fontStyle: 'bold',
            align: 'center',
            wordWrap: { width: contentW }
        }).setOrigin(0.5, 0);
        ui.add(question);
        y += question.height + 44 * u;

        // ----- Answer buttons -----
        this.optionButtons = [];
        const btnW = Math.min(width * 0.92, 1100 * u);
        const btnGap = 28 * u;
        const correctIndex = this.bias.biasedIndex;

        this.bias.options.forEach((option, index) => {
            const btnText = this.add.text(0, 0, option, {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${Math.round(34 * u)}px`,
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: btnW - 70 * u }
            }).setOrigin(0.5);

            const btnH = Math.max(104 * u, btnText.height + 44 * u);
            const btnContainer = this.add.container(cx, y + btnH / 2);
            const btnBg = this.add.graphics();
            this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.12);

            btnContainer.add([btnBg, btnText]);
            btnContainer.setInteractive(
                new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH),
                Phaser.Geom.Rectangle.Contains
            );

            btnContainer.on('pointerover', () => {
                if (this.selected) return;
                this.drawButton(btnBg, btnW, btnH, 0xff00ff, 0.3);
                btnText.setColor('#00ffff');
            });

            btnContainer.on('pointerout', () => {
                if (this.selected) return;
                this.drawButton(btnBg, btnW, btnH, 0x00ffff, 0.12);
                btnText.setColor('#ffffff');
            });

            btnContainer.on('pointerdown', () => this.handleAnswer(index, correctIndex));

            ui.add(btnContainer);
            this.optionButtons.push({ container: btnContainer, bg: btnBg, text: btnText, w: btnW, h: btnH });
            y += btnH + btnGap;
        });

        y += 8 * u;

        // If the whole layout is taller than the screen (small landscape
        // phones, long questions), scale everything down to fit.
        if (y > height) {
            const s = height / y;
            ui.setScale(s);
            ui.x = (width - width * s) / 2;
        }
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

    handleAnswer(index, correctIndex) {
        if (this.selected) return;
        this.selected = true;

        const btn = this.optionButtons[index];
        const isCorrect = index === correctIndex;

        if (isCorrect) {
            audioManager.playCorrect();
            this.score++;
            this.drawButton(btn.bg, btn.w, btn.h, 0x00ff00, 0.4);
            btn.text.setColor('#ffffff');
            btn.text.setText('✓ ' + btn.text.text);
        } else {
            audioManager.playIncorrect();
            this.drawButton(btn.bg, btn.w, btn.h, 0xff0000, 0.4);
            btn.text.setColor('#ffffff');
            btn.text.setText('✗ ' + btn.text.text);

            // Highlight the correct answer
            const correctBtn = this.optionButtons[correctIndex];
            this.drawButton(correctBtn.bg, correctBtn.w, correctBtn.h, 0x00ff00, 0.4);

            // Track error - store title and description
            const errors = this.registry.get('ERRORS') || [];
            errors.push({ title: this.bias.title, description: this.bias.description });
            this.registry.set('ERRORS', errors);
        }

        // Auto-advance: brief pause on a correct answer, a little longer
        // on a miss so the highlighted correct answer can be read.
        this.time.delayedCall(isCorrect ? 1300 : 2600, () => this.goNext());
    }

    goNext() {
        const nextIndex = this.biasIndex + 1;
        const target = nextIndex < BiasData.length ? BiasData[nextIndex].id : 'ResultScene';
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start(target, { score: this.score });
        });
    }
}
