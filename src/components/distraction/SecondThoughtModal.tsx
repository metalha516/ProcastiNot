import React, { useState, useEffect } from 'react';
import { ShieldAlert, Wind, ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const SecondThoughtModal: React.FC = () => {
  const { interceptionActive, interceptedDomain, resolveInterception } = useGamification();

  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [selectedReason, setSelectedReason] = useState<string>('habit');
  const [showOverride, setShowOverride] = useState<boolean>(false);

  useEffect(() => {
    if (!interceptionActive) {
      setSecondsRemaining(10);
      setShowOverride(false);
      return;
    }

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

  if (!interceptionActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#191a1f] border border-violet-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Icon */}
        <div className="relative flex justify-center mb-4">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Second-Thought Intervention
        </h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
          You attempted to open <span className="text-violet-400 font-mono font-medium px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">{interceptedDomain || 'a restricted domain'}</span> during an active deep work sprint.
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
                className="text-neutral-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-violet-500 transition-all duration-1000 ease-linear"
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
              <div className="text-2xl font-bold text-white font-mono">
                {secondsRemaining}s
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-violet-300 mt-1">
                <Wind className="w-3.5 h-3.5" />
                <span>{breathPhase}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-3">
            Box-breathing pause to reset dopamine and re-engage prefrontal control.
          </p>
        </div>

        {/* Reflection Query */}
        <div className="text-left bg-[#121316] border border-white/5 rounded-xl p-4 mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
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
                className={`text-xs text-left p-2 rounded-lg border transition-all ${
                  selectedReason === r.id
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-200'
                    : 'bg-[#191a1f] border-white/5 text-neutral-400 hover:text-neutral-200'
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
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-sm transition-all shadow-lg shadow-violet-600/25 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Deep Work</span>
            <span className="ml-1.5 px-2 py-0.5 text-xs bg-white/20 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              +35 FP
            </span>
          </button>

          {!showOverride ? (
            <button
              type="button"
              disabled={secondsRemaining > 0}
              onClick={() => setShowOverride(true)}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {secondsRemaining > 0
                ? `Pause required (${secondsRemaining}s remaining before bypass)`
                : 'I truly need to visit this domain anyway'}
            </button>
          ) : (
            <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Override will log an anti-focus penalty to your daily score.</span>
              </div>
              <button
                type="button"
                onClick={() => resolveInterception(false, selectedReason)}
                className="text-xs font-semibold text-red-400 hover:text-red-300 underline cursor-pointer"
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
