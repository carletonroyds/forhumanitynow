import React, { useEffect, useState } from 'react';
import { scoringGuide, questions } from '../constants';

interface ResultsScreenProps {
  score: number;
  maxScore: number;
  scores: Record<number, number>;
  onReset: () => void;
}

const useCountUp = (target: number, duration = 1100) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, maxScore, scores, onReset }) => {
  const pct = Math.round((score / maxScore) * 100);
  const animatedPct = useCountUp(pct);
  const tier = scoringGuide.find((t) => pct >= t.minScore) ?? scoringGuide[scoringGuide.length - 1];

  const entries = questions.map((q) => ({ q, s: scores[q.id] ?? 0 }));
  const strongest = entries.reduce((a, b) => (b.s > a.s ? b : a));
  const weakest = entries.reduce((a, b) => (b.s < a.s ? b : a));

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center animate-rise">
      <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-white/40 mb-6">
        Your Results
      </span>

      <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            stroke="url(#scoreGradient)"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-150 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl sm:text-6xl font-bold text-white tabular-nums">{animatedPct}</span>
          <span className="text-xs uppercase tracking-widest text-white/40 mt-1">out of 100</span>
        </div>
      </div>

      <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${tier.color} text-white text-sm font-semibold shadow-lg`}>
        {tier.label} · {tier.range}
      </div>

      <p className="mt-5 max-w-md text-white/65 text-base sm:text-lg leading-relaxed">
        {tier.description}
      </p>

      <div className="mt-9 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/80">Strongest area</span>
          <p className="text-white font-semibold mt-1.5 leading-snug">{strongest.q.title}</p>
          <p className="text-white/45 text-sm mt-1">Scored {strongest.s}/10</p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300/80">Growth area</span>
          <p className="text-white font-semibold mt-1.5 leading-snug">{weakest.q.title}</p>
          <p className="text-white/45 text-sm mt-1">Scored {weakest.s}/10</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-10 px-9 py-4 rounded-2xl text-lg font-semibold text-slate-950 bg-white
          shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.4)]
          transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
      >
        Take it again
      </button>
    </div>
  );
};

export default ResultsScreen;
