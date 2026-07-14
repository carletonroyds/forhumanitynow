import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import * as BiasScreens from './scenes/BiasScreens.js';

// Responsive sizing: the canvas always matches the window 1:1 (no FIT
// scaling, so it can never stretch or sit off-center). The internal
// resolution is multiplied by the device pixel ratio and zoomed back
// down with CSS so text stays sharp on retina/mobile screens.
function getViewport() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(window.innerWidth, 1);
    const h = Math.max(window.innerHeight, 1);
    return {
        width: Math.round(w * dpr),
        height: Math.round(h * dpr),
        zoom: 1 / dpr
    };
}

const vp = getViewport();

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: vp.width,
        height: vp.height,
        zoom: vp.zoom
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

// On resize / orientation change, resize the canvas to the new window
// size and re-lay-out whatever scene is active.
let resizeTimer = null;
function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const next = getViewport();
        const current = game.scale.gameSize;
        if (next.width === current.width && next.height === current.height) {
            game.scale.refresh();
            return;
        }
        game.scale.setZoom(next.zoom);
        game.scale.resize(next.width, next.height);
        game.scale.refresh();
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
