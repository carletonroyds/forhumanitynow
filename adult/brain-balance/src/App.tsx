import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Shield, Target, ArrowRight, RefreshCw, MessageSquare, Sparkles } from 'lucide-react';
import { SCENARIOS } from './data/scenarios';
import { Scenario, Choice, ChoiceType } from './types';

// --- Audio Synthesis ---

const playSound = (type: 'correct' | 'incorrect') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  if (type === 'correct') {
    // More positive "Success" sound (Arpeggio)
    osc.type = 'sine';
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const startTime = now + (i * 0.08);
      const stopTime = startTime + 0.1;
      
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, startTime);
      o.connect(g);
      g.connect(ctx.destination);
      
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.01, stopTime);
      
      o.start(startTime);
      o.stop(stopTime);
    });
  } else {
    // Rounded Error Sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.3);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }
};

// --- Components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-8">
    <motion.div 
      className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.5 }}
    />
  </div>
);

const FeedbackModal = ({ scenario, choice, onNext, isSecondPass }: { 
  scenario: Scenario; 
  choice: Choice; 
  onNext: () => void;
  isSecondPass: boolean;
}) => {
  const isCorrect = choice.type === 'balanced';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="max-w-2xl w-full bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Glitch Background Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            {isCorrect ? (
              <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                <Shield size={24} />
              </div>
            ) : (
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                <Zap size={24} />
              </div>
            )}
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              {isCorrect ? "Balance Achieved" : "System Imbalance"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-red-400 font-bold block mb-1">Emotion Signal</span>
              <p className="text-sm sm:text-base md:text-[18px] text-red-100/80 leading-relaxed">{scenario.feedback.emotionSignal}</p>
            </div>
            <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-400 font-bold block mb-1">Logic Check</span>
              <p className="text-sm sm:text-base md:text-[18px] text-blue-100/80 leading-relaxed">{scenario.feedback.logicCheck}</p>
            </div>
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-cyan-400 font-bold block mb-1">Balanced Insight</span>
              <p className="text-sm sm:text-base md:text-[18px] text-cyan-100/80 leading-relaxed">{scenario.feedback.balancedInsight}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">ABC Breakdown</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-cyan-400 font-mono font-bold">A</span>
                <p className="text-sm sm:text-base md:text-[18px] text-white/80"><span className="text-white/40 italic">Ask:</span> {scenario.feedback.abc.a}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-400 font-mono font-bold">B</span>
                <p className="text-sm sm:text-base md:text-[18px] text-white/80"><span className="text-white/40 italic">Balance:</span> {scenario.feedback.abc.b}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-cyan-400 font-mono font-bold">C</span>
                <p className="text-sm sm:text-base md:text-[18px] text-white/80"><span className="text-white/40 italic">Choose:</span> {scenario.feedback.abc.c}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onNext}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            {isSecondPass && isCorrect ? "Mastery Confirmed" : "Next Scenario"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ReflectionScreen = ({ onRestart }: { onRestart: () => void }) => {
  const [step, setStep] = useState(0);
  const questions = [
    "Have you ever avoided something good because of fear?",
    "What would have been different if you pushed through?",
    "What is one action you will take this week despite fear?"
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-white relative overflow-hidden">
      {/* Cyberpunk Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-xl w-full text-center relative z-10"
        >
          {step < questions.length ? (
            <>
              <div className="mb-8 flex justify-center">
                <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-400 border border-cyan-500/20">
                  <MessageSquare size={32} />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-12 leading-tight">{questions[step]}</h2>
              <button 
                onClick={() => setStep(step + 1)}
                className="px-8 sm:px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-sm uppercase tracking-widest font-bold"
              >
                Reflect & Continue
              </button>
            </>
          ) : (
            <>
              <div className="mb-8 flex justify-center">
                <div className="p-4 bg-green-500/10 rounded-full text-green-400 border border-green-500/20">
                  <Sparkles size={32} />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 uppercase tracking-tighter">System Balanced</h2>
              <p className="text-white/60 mb-12">You have upgraded your decision-making architecture.</p>
              <button 
                onClick={onRestart}
                className="px-8 sm:px-12 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full transition-all text-sm uppercase tracking-widest font-bold flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={18} />
                New Simulation
              </button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'bias-detected' | 'reflection'>('intro');
  const [pass, setPass] = useState<1 | 2>(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([]);

  const currentScenario = SCENARIOS[currentIdx];

  useEffect(() => {
    // Shuffle choices whenever the scenario changes
    const choices = [...currentScenario.choices];
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    setShuffledChoices(choices);
  }, [currentIdx, currentScenario]);

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
    if (choice.type === 'balanced') {
      setScore(prev => prev + 1);
      playSound('correct');
    } else {
      playSound('incorrect');
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      if (pass === 1) {
        setGameState('bias-detected');
      } else {
        setGameState('reflection');
      }
    }
  };

  const startSecondPass = () => {
    setPass(2);
    setCurrentIdx(0);
    setScore(0);
    setGameState('playing');
  };

  if (gameState === 'intro') {
    return (
      <div className="w-full h-full bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="mb-6 inline-block p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
            <Brain size={64} />
          </div>
          <h1 className="text-[40px] sm:text-[52px] md:text-[62.66px] font-black mb-2 uppercase tracking-tighter italic">
            Brain <span className="text-cyan-400">Balance</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[11px] sm:text-[14.66px] mb-12 font-bold">Emotion & Rational Simulator</p>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <button 
              onClick={() => setGameState('playing')}
              className="w-full py-4 sm:py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(34,211,238,0.3)] text-[15px] sm:text-[18.66px]"
            >
              Start Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] sm:text-[12.66px] text-white/30 uppercase tracking-widest font-bold">Version 2.0 // Neural Link Active</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'bias-detected') {
    return (
      <div className="w-full h-full bg-red-950 flex flex-col items-center justify-center p-4 sm:p-8 text-white text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-xl"
        >
          <div className="mb-8 inline-block p-6 bg-red-500/20 rounded-full text-red-400 border border-red-500/40 animate-pulse">
            <Zap size={48} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter italic">Brain Imbalance Detected</h2>
          <p className="text-base sm:text-lg md:text-xl text-red-200/60 mb-12 leading-relaxed">
            Your responses show a lack of balance between emotion and logic. <br/>
            Let's recalibrate your system.
          </p>
          <button 
            onClick={startSecondPass}
            className="px-8 sm:px-12 py-5 bg-white text-red-950 font-black rounded-xl transition-all uppercase tracking-widest hover:bg-red-100"
          >
            Try Again. Get Balanced
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'reflection') {
    return <ReflectionScreen onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="w-full h-full bg-slate-950 text-white relative flex flex-col overflow-hidden">
      {/* Static Background Image */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full">
            <img 
              src={currentScenario.bgImage} 
              alt="Scenario Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* HUD Overlay */}
      <div className="relative z-10 flex-1 flex flex-col p-6 md:p-12 max-w-5xl mx-auto w-full">
        <header className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cyan-400 mb-1">
                {pass === 1 ? "Emotion-Rational" : "Bias Correction Mode"}
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight italic">
                Brain <span className="text-cyan-400">Balance</span>
              </h1>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 block mb-1">Decision Quality</span>
              <span className="text-2xl font-mono font-bold text-cyan-400">{score}/{SCENARIOS.length}</span>
            </div>
          </div>
          <ProgressBar current={currentIdx + 1} total={SCENARIOS.length} />
          
          {pass === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
            >
              <h2 className="text-xl font-black text-red-400 uppercase tracking-tight mb-1">{currentScenario.biasName}</h2>
              <p className="text-xs text-white/60 uppercase tracking-widest">{currentScenario.biasDescription}</p>
            </motion.div>
          )}

          <div className="h-12 flex items-center justify-center">
            <p className="text-sm sm:text-base md:text-[17px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60 text-center px-2">
              {pass === 1 ? "Select the most effective response to this scenario." : "Select the answer that would STOP this bias"}
            </p>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center items-center text-center">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-tight mb-4">
              {currentScenario.text}
            </h2>
          </motion.div>

          <div className="grid gap-4 w-full max-w-2xl mx-auto">
            {shuffledChoices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                className="group relative text-center p-6 bg-white/15 hover:bg-white/25 border border-white/10 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover:bg-cyan-500 transition-all" />
                <p className="text-base sm:text-lg md:text-[22px] font-medium text-white/90 group-hover:text-white transition-colors">{choice.text}</p>
              </button>
            ))}
          </div>
        </main>

        <footer className="mt-12 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-bold text-white/20">
          <span>Simulation ID: {currentScenario.id}</span>
          <span>Neural Link: Stable</span>
        </footer>
      </div>

      {showFeedback && selectedChoice && (
        <FeedbackModal 
          scenario={currentScenario} 
          choice={selectedChoice} 
          onNext={nextQuestion}
          isSecondPass={pass === 2}
        />
      )}
    </div>
  );
}
