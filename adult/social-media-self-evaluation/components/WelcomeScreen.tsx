import React from 'react';

interface WelcomeScreenProps {
  questionCount: number;
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ questionCount, onStart }) => {
  return (
    <div className="flex flex-col items-center text-center animate-rise">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs sm:text-sm font-medium tracking-wide uppercase mb-7">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Takes about 1 minute
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight max-w-2xl">
        Social Media
        <br />
        <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
          Self-Evaluation
        </span>
      </h1>

      <p className="mt-6 text-base sm:text-lg text-white/60 max-w-md leading-relaxed">
        {questionCount} quick statements. Rate how true each one is for you, 1 to 10.
        Get a personalized resilience score at the end — re-test anytime after training.
      </p>

      <button
        onClick={onStart}
        className="group mt-10 px-9 py-4 rounded-2xl text-lg font-semibold text-slate-950 bg-white
          shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.4)]
          transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center gap-2"
      >
        Start the test
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>

      <p className="mt-6 text-xs text-white/35 tracking-wide">
        No sign-up. Nothing is saved or sent anywhere.
      </p>
    </div>
  );
};

export default WelcomeScreen;
