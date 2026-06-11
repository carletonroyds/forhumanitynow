import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Create loading bar
        const width = this.scale.width;
        const height = this.scale.height;
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px Montserrat',
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
        this.load.image('00_start_screen.jpg', 'assets/centered_central_park_aerial-jpg.webp');
        
        // Bias backgrounds
        this.load.image('01_confirmation_bias.png', 'assets/adult_confirmation_bias-jpg.webp');
        this.load.image('02_loss_aversion.png', 'assets/adult_loss_aversion-jpg.webp');
        this.load.image('03_anchoring_bias.png', 'assets/adult_anchoring_bias-jpg.webp');
        this.load.image('04_availability_heuristic.png', 'assets/adult_availability_heuristic-jpg.webp');
        this.load.image('05_hindsight_bias.png', 'assets/hindsight_new.webp');
        this.load.image('06_overconfidence_bias.png', 'assets/adult_overconfidence_bias-jpg.webp');
        this.load.image('07_self_serving_bias.png', 'assets/adult_self_serving_bias-jpg.webp');
        this.load.image('08_status_quo_bias.png', 'assets/adult_status_quo_bias-jpg.webp');
        this.load.image('09_negativity_bias.png', 'assets/adult_negativity_bias-jpg.webp');
        this.load.image('10_them_vs_us_bias.png', 'assets/adult_them_vs_us_bias-jpg.webp');
    }

    async create() {
        // Ensure fonts are loaded before starting the menu
        if (document.fonts) {
            await document.fonts.ready;
        }
        this.scene.start('MenuScene');
    }
}