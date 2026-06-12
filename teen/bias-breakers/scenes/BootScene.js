import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load some basic assets if needed for loading screen
    }

    create() {
        this.scene.start('PreloadScene');
    }
}
