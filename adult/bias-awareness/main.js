import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { KnowledgeQuizScene } from './scenes/KnowledgeQuizScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import * as BiasScreens from './scenes/BiasScreens.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: '100%',
        height: '100%'
    },
    backgroundColor: '#ffffff',
    parent: 'game-container',
    scene: [
        BootScene, 
        PreloadScene, 
        MenuScene, 
        KnowledgeQuizScene,
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
