import * as Tone from 'tone';

class AudioManager {
    constructor() {
        this.initialized = false;
        
        // Load the bell sound from assets
        this.correctPlayer = new Tone.Player("assets/high-bell-ring-1.mp3").toDestination();
        this.correctPlayer.volume.value = -10; // Reduced to -10 dB for a subtler feedback

        // "Boo" effect for incorrect answers - quieter
        this.incorrectBoo = new Tone.FMSynth({
            harmonicity: 0.5,
            modulationIndex: 10,
            oscillator: { type: "sawtooth" },
            envelope: {
                attack: 0.1,
                decay: 0.5,
                sustain: 0.5,
                release: 0.5
            },
            modulation: { type: "sine" },
            modulationEnvelope: {
                attack: 0.5,
                decay: 0.1,
                sustain: 1,
                release: 0.5
            }
        }).toDestination();
        this.incorrectBoo.volume.value = -18; // Quieter than bell
    }

    async init() {
        if (this.initialized) return;
        await Tone.start();
        await Tone.loaded(); // Ensure the player is loaded
        this.initialized = true;
        this.startBGM();
    }

    startBGM() {
        // Simple quiet techno loop ~100 BPM
        const bassSynth = new Tone.MonoSynth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.1 }
        });
        
        const filter = new Tone.Filter(600, "lowpass").toDestination();
        bassSynth.connect(filter);
        bassSynth.volume.value = -32;

        const hatSynth = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.05, release: 0.01 }
        }).toDestination();
        hatSynth.volume.value = -38;

        Tone.Transport.bpm.value = 100;

        // Subtle techno pattern
        new Tone.Sequence((time, note) => {
            bassSynth.triggerAttackRelease(note, "16n", time);
        }, ["C1", null, "C1", "D1", "C1", null, "Eb1", null], "8n").start(0);

        // Hi-hat pattern
        new Tone.Loop(time => {
            hatSynth.triggerAttackRelease("32n", time);
        }, "8n").start("16n");

        // Filter movement for "hacker" feel
        new Tone.Loop(time => {
            filter.frequency.rampTo(1200, "2n", time);
            filter.frequency.rampTo(600, "2n", time + Tone.Time("2n"));
        }, "1n").start(0);

        Tone.Transport.start();
    }

    playCorrect() {
        if (!this.initialized) return;
        if (this.correctPlayer.loaded) {
            this.correctPlayer.start();
        }
    }

    playReward() {
        if (!this.initialized) return;
        // Celebration sound - multiple rapid bell rings
        const now = Tone.now();
        for (let i = 0; i < 4; i++) {
            this.correctPlayer.start(now + i * 0.15);
        }
    }

    playIncorrect() {
        if (!this.initialized) return;
        const now = Tone.now();
        // Downward slide for "Boo" effect
        this.incorrectBoo.triggerAttackRelease("G2", "2n", now);
        this.incorrectBoo.frequency.rampTo("C2", 0.6, now + 0.1);
    }
}

export const audioManager = new AudioManager();
