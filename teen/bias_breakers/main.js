import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import * as BiasScreens from './scenes/BiasScreens.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 1920,
        height: 1080
    },
    backgroundColor: '#000000',
    parent: 'game-container',
    scene: [
        BootScene, 
        PreloadScene, 
        MenuScene, 
        ResultScene,
        BiasScreens.ConfirmationBiasScene,
        BiasScreens.LossAversionScene,
        BiasScreens.AnchoringBiasScene,
        BiasScreens.AvailabilityHeuristicScene,
        BiasScreens.HindsightBiasScene,
        BiasScreens.OverconfidenceBiasScene,
        BiasScreens.SelfServingBiasScene,
        BiasScreens.StatusQuoBiasScene,
        BiasScreens.NegativityBiasScene,
        BiasScreens.ThemVsUsBiasScene
    ]
};

const game = new Phaser.Game(config);
