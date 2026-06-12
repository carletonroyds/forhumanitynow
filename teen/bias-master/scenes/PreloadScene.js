import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load assets
        this.load.image('00_start_screen.jpg', 'assets/00_start_screen.jpg');
        this.load.image('start-character', 'assets/start_character_v2.png');
        this.load.image('title-bg', 'assets/title-bg.webp');
        this.load.image('hacker-mascot', 'assets/hacker-mascot.webp');

        // Bias backgrounds (slots for specific filenames)
        this.load.image('01_confirmation_bias.png', 'assets/01_confirmation_bias.png');
        this.load.image('02_loss_aversion.png', 'assets/02_loss_aversion.png');
        this.load.image('03_anchoring_bias.png', 'assets/03_anchoring_bias.png');
        this.load.image('04_availability_heuristic.png', 'assets/04_availability_heuristic.png');
        this.load.image('05_hindsight_bias.png', 'assets/05_hindsight_bias.png');
        this.load.image('06_overconfidence_bias.png', 'assets/06_overconfidence_bias.png');
        this.load.image('07_self_serving_bias.png', 'assets/07_self_serving_bias.png');
        this.load.image('08_status_quo_bias.png', 'assets/08_status_quo_bias.png');
        this.load.image('09_negativity_bias.png', 'assets/09_negativity_bias.png');
        this.load.image('10_them_vs_us_bias.png', 'assets/10_them_vs_us_bias.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}
