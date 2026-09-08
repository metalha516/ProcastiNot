import React, { useState, useEffect } from 'react';
import { ShieldAlert, Wind, ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const SecondThoughtModal: React.FC = () => {
  const { interceptionActive, interceptedDomain, resolveInterception } = useGamification();

  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [selectedReason, setSelectedReason] = useState<string>('habit');
  const [showOverride, setShowOverride] = useState<boolean>(false);

  const [prevActive, setPrevActive] = useState(interceptionActive);
  if (interceptionActive !== prevActive) {
    setPrevActive(interceptionActive);
    if (interceptionActive) {
      setSecondsRemaining(10);
      setShowOverride(false);
    }
  }

  useEffect(() => {
    if (!interceptionActive) return;

    // Breathing phase cycles: 4s inhale, 3s hold, 3s exhale = 10s
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        const next = prev - 1;
        if (next > 6) setBreathPhase('Inhale');
        else if (next > 3) setBreathPhase('Hold');
        else setBreathPhase('Exhale');
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interceptionActive]);

  const handleConfirmVisit = () => {
    const domainToOpen = interceptedDomain;
    resolveInterception(false, selectedReason);
    if (domainToOpen) {
      const targetUrl = domainToOpen.startsWith('http') ? domainToOpen : `https://${domainToOpen}`;
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('data-bypass-shield', 'true');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (!interceptionActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#181d2a] border border-orange-500/30 dark:border-violet-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-orange-500/15 dark:bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Icon */}
        <div className="relative flex justify-center mb-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 dark:bg-violet-500/10 border border-orange-500/30 dark:border-violet-500/30 text-orange-600 dark:text-violet-400">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          Second-Thought Intervention
        </h2>
        <p className="text-sm text-slate-600 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
          You attempted to open <span className="text-orange-600 dark:text-violet-400 font-mono font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-violet-500/10 border border-orange-500/20 dark:border-violet-500/20">{interceptedDomain || 'a restricted domain'}</span> during an active deep work sprint.
        </p>

        {/* 10-Second Mindfulness Breathing Ring */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-slate-200 dark:text-neutral-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-orange-500 dark:text-violet-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 * (1 - (10 - secondsRemaining) / 10)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Breathing center animation */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {secondsRemaining}s
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-violet-300 mt-1">
                <Wind className="w-3.5 h-3.5" />
                <span>{breathPhase}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-3 font-medium">
            Box-breathing pause to reset dopamine and re-engage prefrontal control.
          </p>
        </div>

        {/* Reflection Query */}
        <div className="text-left bg-slate-50 dark:bg-[#111520] border border-slate-200/80 dark:border-white/5 rounded-2xl p-4 mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-400 mb-2">
            What triggered this reflex?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'habit', label: '🧠 Muscle Memory' },
              { id: 'boredom', label: '🥱 Task Boredom' },
              { id: 'fatigue', label: '🔋 Brain Fatigue' },
              { id: 'research', label: '🔍 Vital Academic Search' },
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReason(r.id)}
                className={`text-xs text-left p-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                  selectedReason === r.id
                    ? 'bg-orange-500/15 border-orange-500/50 text-orange-700 dark:text-orange-300'
                    : 'bg-white dark:bg-[#181d2a] border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => resolveInterception(true, selectedReason)}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl clay-btn-primary text-white font-bold text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Deep Work</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-white/25 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              +35 FP
            </span>
          </button>

          {!showOverride ? (
            <button
              type="button"
              disabled={secondsRemaining > 0}
              onClick={() => setShowOverride(true)}
              className="text-xs text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {secondsRemaining > 0
                ? `Pause required (${secondsRemaining}s remaining before bypass)`
                : 'I truly need to visit this domain anyway'}
            </button>
          ) : (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Override will log an anti-focus penalty to your daily score.</span>
              </div>
              <button
                type="button"
                onClick={handleConfirmVisit}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline cursor-pointer"
              >
                Confirm Intentional Visit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
