import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import * as BiasScreens from './scenes/BiasScreens.js';

// Responsive sizing: the internal game size always matches the window's
// aspect ratio, with the shorter side fixed at DESIGN units. This means
// no letterboxing at any breakpoint (portrait or landscape) and all
// scenes can lay themselves out using real width/height values.
const DESIGN = 1080;

function getGameSize() {
    const w = Math.max(window.innerWidth, 1);
    const h = Math.max(window.innerHeight, 1);
    const aspect = w / h;
    if (aspect >= 1) {
        // Landscape / square: fix height
        return { width: Math.round(DESIGN * aspect), height: DESIGN };
    }
    // Portrait: fix width
    return { width: DESIGN, height: Math.round(DESIGN / aspect) };
}

const initialSize = getGameSize();

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: initialSize.width,
        height: initialSize.height
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

// On resize / orientation change, resize the game to the new aspect ratio
// and re-lay-out whatever scene is active.
let resizeTimer = null;
function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const { width, height } = getGameSize();
        const current = game.scale.gameSize;
        if (Math.abs(width - current.width) < 2 && Math.abs(height - current.height) < 2) {
            game.scale.refresh();
            return;
        }
        game.scale.resize(width, height);
        game.scene.getScenes(true).forEach((scene) => {
            const data = typeof scene.getRestartData === 'function'
                ? scene.getRestartData()
                : undefined;
            scene.scene.restart(data);
        });
    }, 150);
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);
