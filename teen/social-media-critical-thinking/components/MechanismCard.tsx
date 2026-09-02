import React, { useState, useEffect } from 'react';
import { Mechanism } from '../types';

interface MechanismCardProps {
  mechanism: Mechanism;
}

const MechanismCard: React.FC<MechanismCardProps> = ({ mechanism }) => {
  const [visibleSections, setVisibleSections] = useState(1);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleSections(3);
      return;
    }

    setVisibleSections(1);

    const timer2 = setTimeout(() => {
      setVisibleSections(2);
    }, 3000);

    const timer3 = setTimeout(() => {
      setVisibleSections(3);
    }, 6000);

    return () => {
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [mechanism.id]);

  const revealAll = () => setVisibleSections(3);

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#1d1c1a]/15 bg-white shadow-[0_18px_60px_rgba(52,43,32,0.14)]">
      <header className="grid gap-6 bg-[#1d1c1a] p-5 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-7 md:p-9">
        <div className="order-2 sm:order-1">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#ef6c5f]">
            Pattern {String(mechanism.id).padStart(2, '0')}
          </p>
          <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-[-0.025em] sm:text-4xl md:text-5xl">
            {mechanism.name}
          </h2>
        </div>
        <img 
          src={mechanism.image} 
          alt={`Illustration representing ${mechanism.name}`}
          className="order-1 h-24 w-24 rounded-2xl border-2 border-white/15 object-cover shadow-lg sm:order-2 sm:h-32 sm:w-32 md:h-40 md:w-40"
          width="200"
          height="200"
          decoding="async"
        />
      </header>
      
      <div className="divide-y divide-[#1d1c1a]/10">
        <section className="grid gap-3 bg-[#e6ded1] p-5 sm:grid-cols-[11rem_1fr] sm:items-start sm:p-7 md:p-8">
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#736b61]">
            The trigger
          </h3>
          <p className="text-lg font-bold leading-snug text-[#2b2824] sm:text-xl md:text-2xl">
            {mechanism.trigger}
          </p>
        </section>

        <div 
          className="grid transition-[grid-template-rows] duration-700 ease-in-out"
          style={{ gridTemplateRows: visibleSections >= 2 ? '1fr' : '0fr' }}
          aria-hidden={visibleSections < 2}
        >
          <div className="overflow-hidden">
            <section className="grid gap-3 bg-[#f7f3ed] p-5 sm:grid-cols-[11rem_1fr] sm:items-start sm:p-7 md:p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#736b61]">
                What it does
              </h3>
              <p className="text-lg font-semibold leading-snug text-[#38332e] sm:text-xl md:text-2xl">
                {mechanism.effect}
              </p>
            </section>
          </div>
        </div>

        <div 
          className="grid transition-[grid-template-rows] duration-700 ease-in-out"
          style={{ gridTemplateRows: visibleSections >= 3 ? '1fr' : '0fr' }}
          aria-hidden={visibleSections < 3}
        >
          <div className="overflow-hidden">
            <section className="grid gap-3 bg-[#f8d6cf] p-5 sm:grid-cols-[11rem_1fr] sm:items-start sm:p-7 md:p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#a82f29]">
                Your antidote
              </h3>
              <p className="text-lg font-extrabold leading-snug text-[#3a211f] sm:text-xl md:text-2xl">
                {mechanism.antidote}
              </p>
            </section>
          </div>
        </div>

        {visibleSections < 3 && (
          <div className="flex flex-col items-stretch justify-between gap-3 bg-white px-5 py-4 min-[360px]:flex-row min-[360px]:items-center sm:px-7">
            <p className="text-sm font-semibold text-[#777067]">
              {visibleSections === 1 ? 'The effect appears next.' : 'The antidote appears next.'}
            </p>
            <button
              type="button"
              onClick={revealAll}
              className="shrink-0 rounded-full border border-[#1d1c1a]/20 px-4 py-2 text-sm font-extrabold text-[#2b2824] transition hover:border-[#c93c32] hover:text-[#c93c32] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#c93c32]"
            >
              Reveal now
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default MechanismCard;
