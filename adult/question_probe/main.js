import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import htm from 'htm';
import { scenarios } from './data/scenarios.js';

const html = htm.bind(React.createElement);

const CORRECT_SOUND = new Audio('assets/audio/correct-bell-ding.mp3');
const INCORRECT_SOUND = new Audio('assets/audio/incorrect-low-tone.mp3');
INCORRECT_SOUND.volume = 0.3; // Low volume for a subtle, non-intrusive feedback

const BG_MAP = {
    'work-deadline-img': 'assets/bg-work-deadline.webp',
    'vacation-planning-img': 'assets/bg-vacation-planning.webp',
    'kitchen-chore-img': 'assets/bg-kitchen-chore.webp',
    'doctor-consult-img': 'assets/bg-doctor-consult.webp',
    'social-cancel-img': 'assets/bg-social-cafe.webp',
    'finance-bill-img': 'assets/bg-finance-bill.webp',
    'noisy-neighbor-img': 'assets/bg-noisy-neighbor.webp',
    'career-raise-img': 'assets/bg-finance-bill.webp',
    'restaurant-group-img': 'assets/bg-social-cafe.webp',
    'peer-feedback-img': 'assets/bg-work-deadline.webp',
    'intro': 'assets/bg-intro-title.webp',
    'history': 'assets/bg-history-screen.webp',
};

const RadarChart = ({ data }) => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const categories = Object.keys(data);
    const angleStep = (Math.PI * 2) / categories.length;

    const points = categories.map((cat, i) => {
        const val = data[cat].total > 0 ? data[cat].correct / data[cat].total : 0;
        const x = center + radius * val * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + radius * val * Math.sin(i * angleStep - Math.PI / 2);
        return `${x},${y}`;
    }).join(' ');

    const webLines = [0.25, 0.5, 0.75, 1].map((scale) => (
        html`<polygon
            key=${scale}
            points=${categories.map((_, i) => {
                const x = center + radius * scale * Math.cos(i * angleStep - Math.PI / 2);
                const y = center + radius * scale * Math.sin(i * angleStep - Math.PI / 2);
                return `${x},${y}`;
            }).join(' ')}
            className="fill-transparent stroke-gray-200 stroke-1"
        />`
    ));

    return html`
        <div className="flex flex-col items-center">
            <svg width=${size} height=${size} className="overflow-visible">
                ${webLines}
                ${categories.map((_, i) => {
                    const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
                    const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
                    return html`<line key=${i} x1=${center} y1=${center} x2=${x} y2=${y} className="stroke-gray-200 stroke-1" />`;
                })}
                <polygon points=${points} className="fill-gray-800/20 stroke-gray-800 stroke-2" />
                ${categories.map((cat, i) => {
                    const x = center + (radius + 25) * Math.cos(i * angleStep - Math.PI / 2);
                    const y = center + (radius + 25) * Math.sin(i * angleStep - Math.PI / 2);
                    return html`
                        <text
                            key=${cat}
                            x=${x}
                            y=${y}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-gray-400 uppercase tracking-widest"
                        >
                            ${cat}
                        </text>
                    `;
                })}
            </svg>
        </div>
    `;
};

const App = () => {
    const [gameState, setGameState] = useState('menu'); // menu, game, results, history
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [bgImage, setBgImage] = useState(BG_MAP['intro']);
    const [history, setHistory] = useState([]); // Array of { scenario, selectedOption }

    useEffect(() => {
        if (gameState === 'menu') setBgImage(BG_MAP['intro']);
        else if (gameState === 'game') setBgImage(BG_MAP[scenarios[currentIndex].image] || BG_MAP['intro']);
        else if (gameState === 'results') setBgImage(BG_MAP['intro']);
        else if (gameState === 'history') setBgImage(BG_MAP['history']);
    }, [gameState, currentIndex]);

    const stats = useMemo(() => {
        const categories = {};
        history.forEach(h => {
            const cat = h.scenario.category || 'Other';
            if (!categories[cat]) categories[cat] = { total: 0, correct: 0 };
            categories[cat].total++;
            if (h.selectedOption.correct) categories[cat].correct++;
        });
        return categories;
    }, [history]);

    const handleStart = () => {
        setGameState('game');
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setShowExplanation(false);
        setHistory([]);
    };

    const handleOptionSelect = (option) => {
        if (showExplanation) return;
        setSelectedOption(option);
        setShowExplanation(true);
        if (option.correct) {
            setScore(s => s + 1);
            CORRECT_SOUND.play().catch(e => console.log('Audio playback prevented:', e));
        } else {
            INCORRECT_SOUND.play().catch(e => console.log('Audio playback prevented:', e));
        }
        
        setHistory(prev => [...prev, {
            scenario: scenarios[currentIndex],
            selectedOption: option
        }]);
    };

    const handleNext = () => {
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setGameState('results');
        }
    };

    return html`
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-x-hidden py-8">
            <!-- Background Image Layer -->
            <${AnimatePresence} mode="wait">
                <${motion.div}
                    key=${bgImage}
                    initial=${{ opacity: 0 }}
                    animate=${{ opacity: 1 }}
                    exit=${{ opacity: 0 }}
                    transition=${{ duration: 1.2 }}
                    className="fixed inset-0 bg-cover bg-center bg-no-repeat"
                    style=${{ backgroundImage: `url(${bgImage})` }}
                />
            </AnimatePresence>

            <!-- Dark Overlay -->
            <div className="fixed inset-0 bg-black opacity-30 pointer-events-none" />

            <!-- UI Card Overlay -->
            <${AnimatePresence} mode="wait">
                ${gameState === 'menu' && html`
                    <${motion.div}
                        key="menu"
                        initial=${{ opacity: 0, y: 20 }}
                        animate=${{ opacity: 1, y: 0 }}
                        exit=${{ opacity: 0, y: -20 }}
                        className="glass-card p-8 md:p-12 rounded-[24px] shadow-2xl max-w-lg w-[92%] text-center z-10"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 uppercase tracking-tighter">Question Probe</h1>
                        <p className="text-base md:text-lg text-black/75 mb-8 leading-relaxed font-light">
                            Professional Decision Support & Communication Training.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick=${handleStart}
                                className="bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-black transition-all duration-300 shadow-lg active:scale-95"
                            >
                                Begin Session
                            </button>
                            ${history.length > 0 && html`
                                <button
                                    onClick=${() => setGameState('history')}
                                    className="bg-white/50 text-gray-700 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white transition-all duration-300 active:scale-95"
                                >
                                    Review Last History
                                </button>
                            `}
                        </div>
                    </motion.div>
                `}

                ${gameState === 'game' && html`
                    <${motion.div}
                        key=${`game-${currentIndex}`}
                        initial=${{ opacity: 0, scale: 0.98 }}
                        animate=${{ opacity: 1, scale: 1 }}
                        exit=${{ opacity: 0, scale: 0.98 }}
                        transition=${{ duration: 0.4 }}
                        className="glass-card p-6 md:p-10 rounded-[24px] shadow-2xl max-w-2xl w-[92%] z-10 flex flex-col mx-auto"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                                Scenario ${currentIndex + 1} of ${scenarios.length}
                            </div>
                            <div className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase bg-gray-100 px-2 py-1 rounded">
                                ${scenarios[currentIndex].category}
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-tight">
                            ${scenarios[currentIndex].title}
                        </h2>
                        <p className="text-base md:text-lg text-black/75 mb-8 md:mb-10 leading-relaxed italic border-l-4 border-gray-200 pl-4 md:pl-6">
                            "${scenarios[currentIndex].description}"
                        </p>

                        <div className="space-y-3">
                            ${scenarios[currentIndex].options.map((option, idx) => html`
                                <button
                                    key=${idx}
                                    onClick=${() => handleOptionSelect(option)}
                                    disabled=${showExplanation}
                                    className=${`w-full text-left p-4 md:p-6 rounded-xl border-2 transition-all duration-300 text-sm md:text-lg font-medium leading-relaxed active:scale-[0.99] ${
                                        showExplanation
                                            ? option === selectedOption
                                                ? option.correct
                                                    ? 'bg-green-50/50 border-green-200 text-green-800'
                                                    : 'bg-red-50/50 border-red-200 text-red-800'
                                                : option.correct
                                                    ? 'bg-green-50/30 border-green-200 text-green-800 opacity-60'
                                                    : 'border-transparent text-gray-300 opacity-40'
                                            : 'bg-white/50 border-gray-100 hover:border-gray-300 text-gray-700 hover:bg-white shadow-sm'
                                    }`}
                                >
                                    ${option.text}
                                </button>
                            `)}
                        </div>

                        <${AnimatePresence}>
                        ${showExplanation && html`
                            <${motion.div}
                                initial=${{ opacity: 0, height: 0 }}
                                animate=${{ opacity: 1, height: 'auto' }}
                                className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-100"
                            >
                                <div className=${`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${selectedOption?.correct ? 'text-green-600' : 'text-red-600'}`}>
                                    ${selectedOption?.correct ? 'Insightful Choice' : 'Consider Alternatives'}
                                </div>
                                <p className="text-black/75 leading-relaxed text-base md:text-lg mb-6 md:mb-8">
                                    ${selectedOption?.explanation}
                                </p>
                                <button
                                    onClick=${handleNext}
                                    className="w-full bg-gray-800 text-white py-4 rounded-xl text-lg font-semibold hover:bg-black transition-all shadow-lg active:scale-95"
                                >
                                    ${currentIndex < scenarios.length - 1 ? 'Next Scenario' : 'View Results'}
                                </button>
                            </motion.div>
                        `}
                        </AnimatePresence>
                    </motion.div>
                `}

                ${gameState === 'results' && html`
                    <${motion.div}
                        key="results"
                        initial=${{ opacity: 0, y: 20 }}
                        animate=${{ opacity: 1, y: 0 }}
                        exit=${{ opacity: 0, y: -20 }}
                        className="glass-card p-8 md:p-12 rounded-[24px] shadow-2xl max-w-lg w-[92%] text-center z-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">Session Complete</h2>
                        <div className="text-gray-400 mb-8 md:mb-10 text-[10px] font-bold tracking-widest uppercase">Expert Analysis Ready</div>
                        
                        <div className="flex justify-center mb-8 md:mb-10">
                            <div className="relative w-40 h-40 md:w-48 md:h-48">
                                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                                    <circle className="text-gray-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="80" cx="100" cy="100" />
                                    <${motion.circle}
                                        initial=${{ strokeDashoffset: 2 * Math.PI * 80 }}
                                        animate=${{ strokeDashoffset: 2 * Math.PI * 80 * (1 - score / scenarios.length) }}
                                        transition=${{ duration: 1.5, ease: "easeOut" }}
                                        className="text-gray-800"
                                        strokeWidth="10"
                                        strokeDasharray=${2 * Math.PI * 80}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="80"
                                        cx="100"
                                        cy="100"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl md:text-5xl font-bold text-gray-800">${Math.round((score / scenarios.length) * 100)}%</span>
                                    <span className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-black/75 mb-8 md:mb-10 leading-relaxed text-base md:text-lg font-light">
                            You successfully demonstrated professional communication in <span className="font-bold text-gray-800">${score}</span> of the <span className="font-bold text-gray-800">${scenarios.length}</span> scenarios presented.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick=${() => setGameState('history')}
                                className="bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-black transition-all shadow-lg active:scale-95"
                            >
                                Detailed Review
                            </button>
                            <button
                                onClick=${() => setGameState('menu')}
                                className="bg-white/50 text-gray-700 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-white transition-all shadow-lg active:scale-95"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </motion.div>
                `}

                ${gameState === 'history' && html`
                    <${motion.div}
                        key="history"
                        initial=${{ opacity: 0, scale: 0.95 }}
                        animate=${{ opacity: 1, scale: 1 }}
                        exit=${{ opacity: 0, scale: 0.95 }}
                        className="glass-card p-6 md:p-10 rounded-[24px] shadow-2xl max-w-4xl w-[92%] z-10 flex flex-col max-h-[90vh] mx-auto overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6 md:mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 leading-tight">Decision History</h2>
                                <p className="text-gray-400 text-[9px] md:text-[10px] font-bold tracking-widest uppercase">Decision Architecture Analysis</p>
                            </div>
                            <button 
                                onClick=${() => setGameState('results')}
                                className="text-gray-400 hover:text-gray-800 transition-colors p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="md:col-span-1 bg-white/40 p-6 rounded-2xl flex flex-col items-center justify-center border border-white/60">
                                <${RadarChart} data=${stats} />
                                <div className="mt-4 text-center">
                                    <h3 className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Competency Map</h3>
                                    <p className="text-[9px] md:text-xs text-gray-400 leading-tight">Cross-category performance distribution</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                ${history.map((h, i) => html`
                                    <div key=${i} className="p-4 md:p-5 rounded-xl bg-white/60 border border-white/80 shadow-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">${h.scenario.category}</span>
                                            <span className=${`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${h.selectedOption.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                ${h.selectedOption.correct ? 'Optimal' : 'Sub-optimal'}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base">${h.scenario.title}</h4>
                                        <p className="text-xs md:text-sm text-black/75 mb-3 italic">"${h.scenario.description}"</p>
                                        <div className="text-xs md:text-sm bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                            <div className="font-bold text-gray-400 uppercase text-[8px] md:text-[9px] tracking-widest mb-1">Selected Response</div>
                                            <div className="text-black/75">${h.selectedOption.text}</div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-tight">
                                <span className="text-gray-600">${score}</span> / ${scenarios.length} Optimal Decisions
                            </div>
                            <button
                                onClick=${() => setGameState('menu')}
                                className="bg-gray-800 text-white px-6 md:px-8 py-3 rounded-xl text-xs md:text-sm font-semibold hover:bg-black transition-all shadow-md active:scale-95"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </motion.div>
                `}
            </AnimatePresence>
        </div>
    `;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(html`<${App} />`);