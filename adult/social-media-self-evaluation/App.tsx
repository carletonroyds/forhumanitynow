import React, { useState, useCallback, useRef, useEffect } from 'react';
import { questions } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionSlide from './components/QuestionSlide';
import ProgressBar from './components/ProgressBar';
import ResultsScreen from './components/ResultsScreen';

type Stage = 'welcome' | 'question' | 'results';

const AUTO_ADVANCE_DELAY = 420;

const App: React.FC = () => {
  const [stage, setStage] = useState<Stage>('welcome');
  const [scores, setScores] = useState<Record<number, number>>({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animKey, setAnimKey] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const advanceTimer = useRef<number | null>(null);

  const total = questions.length;
  const maxScore = total * 10;
  const totalScore = Object.values(scores).reduce((sum: number, s: number) => sum + s, 0);
  const answeredIds = new Set(Object.keys(scores).map(Number));

  const goTo = useCallback((nextIndex: number, dir: 'forward' | 'back') => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setDirection(dir);
    if (nextIndex >= total) {
      setStage('results');
      return;
    }
    setIndex(nextIndex);
    setAnimKey((k) => k + 1);
  }, [total]);

  const handleStart = () => {
    setStage('question');
    setAnimKey((k) => k + 1);
  };

  const handleScoreChange = (id: number, score: number) => {
    setScores((prev) => ({ ...prev, [id]: score }));
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      goTo(index + 1, 'forward');
    }, AUTO_ADVANCE_DELAY);
  };

  const handleJump = (i: number) => {
    if (i === index) return;
    goTo(i, i > index ? 'forward' : 'back');
  };

  const handleBack = () => {
    if (index === 0) return;
    goTo(index - 1, 'back');
  };

  const handleReset = () => {
    setScores({});
    setIndex(0);
    setStage('welcome');
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    if (stage !== 'question') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleBack();
      else if (e.key === 'ArrowRight' && answeredIds.has(questions[index].id)) goTo(index + 1, 'forward');
      else {
        const n = e.key === '0' ? 10 : parseInt(e.key, 10);
        if (n >= 1 && n <= 10) handleScoreChange(questions[index].id, n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, index, scores]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const SWIPE_THRESHOLD = 60;
    if (delta > SWIPE_THRESHOLD) handleBack();
    else if (delta < -SWIPE_THRESHOLD && answeredIds.has(questions[index].id)) {
      goTo(index + 1, 'forward');
    }
  };

  const currentQuestion = questions[index];

  return (
    <div className="min-h-screen w-full relative overflow-y-auto bg-slate-950 text-white font-sans flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10 landscape:py-4">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[26rem] h-[26rem] bg-fuchsia-600/30 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] bg-cyan-500/20 rounded-full blur-[110px] animate-float-slower" />
        <div className="absolute bottom-0 left-1/4 w-[24rem] h-[24rem] bg-violet-600/25 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div
          className="relative rounded-[1.75rem] sm:rounded-[2rem] border border-white/10 bg-white/[0.03]
            backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {stage === 'question' && (
            <div className="px-5 sm:px-10 pt-5 sm:pt-7 pb-1 landscape:pt-4">
              <ProgressBar current={index} total={total} answeredIds={answeredIds} onJump={handleJump} />
            </div>
          )}

          <div
            className="px-5 sm:px-10 py-7 sm:py-12 landscape:py-5 min-h-[22rem] sm:min-h-[28rem] landscape:min-h-0 flex flex-col"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {stage === 'welcome' && <WelcomeScreen questionCount={total} onStart={handleStart} />}

            {stage === 'question' && (
              <div key={animKey} className={`flex-1 flex flex-col ${direction === 'forward' ? 'animate-slide-in-fwd' : 'animate-slide-in-back'}`}>
                <QuestionSlide
                  question={currentQuestion}
                  index={index}
                  total={total}
                  score={scores[currentQuestion.id]}
                  onScoreChange={handleScoreChange}
                />
              </div>
            )}

            {stage === 'results' && (
              <ResultsScreen score={totalScore} maxScore={maxScore} scores={scores} onReset={handleReset} />
            )}
          </div>

          {stage === 'question' && index > 0 && (
            <button
              onClick={handleBack}
              aria-label="Previous question"
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center
                text-white/50 hover:text-white/90 transition-all duration-200"
            >
              ‹
            </button>
          )}
        </div>

        {stage === 'question' && (
          <p className="text-center text-white/30 text-xs mt-5 tracking-wide">
            Swipe, use ← → arrows, or press a number to answer
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
