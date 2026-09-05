import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Brain,
  Coffee,
  Sparkles,
  ChevronDown,
  Activity,
  Zap,
} from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { useTask } from '../../context/TaskContext';
import { GammaWaveControls } from './GammaWaveControls';

export const PomodoroTimer: React.FC = () => {
  const {
    mode,
    timeRemaining,
    totalDuration,
    isRunning,
    activePreset,
    presets,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    switchMode,
    selectPreset,
    setCustomDuration,
    selectedTaskTitle,
    setSelectedTaskTitle,
    sessionLogs,
  } = useTimer();

  const { tasks } = useTask();

  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customFocus, setCustomFocus] = useState<number>(45);
  const [customBreak, setCustomBreak] = useState<number>(10);

  // SVG circular arc math for 3D Chronometer Disc
  const radius = 120;
  const circumference = 2 * Math.PI * radius; // ~753.98
  const progress = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const todaySessions = sessionLogs.filter(s => {
    const todayStr = new Date().toISOString().split('T')[0];
    return s.timestamp.startsWith(todayStr);
  });

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomDuration(customFocus, customBreak);
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-col w-full gap-6 select-none max-w-5xl mx-auto">
      {/* TOP COCKPIT HEADER RIBBON */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.85)] animate-pulse" />
          <div className="flex items-baseline gap-2">
            <span className="font-telemetry-sm text-xs uppercase text-emerald-700 dark:text-emerald-400 font-extrabold tracking-widest">
              CONSOLE RIG // MK-IV
            </span>
            <span className="font-telemetry-sm text-xs text-slate-300 dark:text-slate-600">/</span>
            <span className="font-telemetry-sm text-xs text-slate-600 dark:text-slate-400 font-semibold tracking-wider">
              PRECISION AEROSPACE TELEMETRY DECK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full clay-pill flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            <span className="font-telemetry-sm text-[11px] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
              ISO-994 PROTOCOL ACTIVE
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full clay-pill flex items-center gap-1.5">
            <span className="font-telemetry-sm text-[11px] text-slate-400 font-medium">STATION:</span>
            <span className="font-telemetry-sm text-[11px] text-orange-600 dark:text-orange-400 font-extrabold">
              DEEP_STUDY_01
            </span>
          </div>
        </div>
      </div>

      {/* MAIN 3D CHRONOMETER MATRIX DECK */}
      <div className="clay-card rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-center border border-white/80 dark:border-white/5 relative overflow-hidden">
        {/* Telemetry Header */}
        <div className="w-full flex items-center justify-between mb-5 sm:mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-2xl clay-pill flex items-center justify-center shrink-0">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
            </div>
            <span className="font-telemetry-sm text-[11px] sm:text-xs tracking-wider uppercase text-slate-800 dark:text-slate-200 font-bold">
              CHRONOMETER MATRIX
            </span>
          </div>

          {/* Puffy Clay Mini Cycle Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl clay-inset shrink-0">
            <span className="font-telemetry-sm text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold mr-0.5 sm:mr-1">
              CYCLE {todaySessions.length + 1}/4
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.7)]" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.9)] animate-pulse" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 p-1 sm:p-1.5 rounded-2xl clay-inset max-w-md w-full">
          <button
            type="button"
            onClick={() => switchMode('focus')}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-headline-sm font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
              mode === 'focus'
                ? 'clay-btn-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">
              <span className="hidden min-[380px]:inline">Deep </span>Focus
            </span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('short_break')}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-headline-sm font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
              mode === 'short_break'
                ? 'clay-btn-indigo text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">
              <span className="hidden min-[380px]:inline">Short </span>Break
            </span>
          </button>
          <button
            type="button"
            onClick={() => switchMode('long_break')}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-headline-sm font-bold transition-all cursor-pointer whitespace-nowrap min-w-0 ${
              mode === 'long_break'
                ? 'clay-btn-light text-slate-800 dark:text-slate-100 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
            <span className="whitespace-nowrap">
              <span className="hidden min-[380px]:inline">Long </span>Rest
            </span>
          </button>
        </div>

        {/* 3D PUFFY CLAY CHRONOMETER DISC */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center clay-disc-outer p-4 my-4">
          <div className="w-full h-full rounded-full clay-inset flex items-center justify-center p-3 relative">
            {/* SVG Graduation Marks & Progress Arc */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="clayOrangeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="50%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>
              </defs>

              {/* Graduation Tick Marks */}
              <g className="text-slate-300 dark:text-slate-700" stroke="currentColor" strokeLinecap="round">
                <line x1="160" y1="16" x2="160" y2="28" stroke="#ea580c" strokeWidth="4" />
                <line x1="160" y1="292" x2="160" y2="304" strokeWidth="2.5" />
                <line x1="16" y1="160" x2="28" y2="160" strokeWidth="2.5" />
                <line x1="292" y1="160" x2="304" y2="160" strokeWidth="2.5" />
                <line x1="62" y1="62" x2="70" y2="70" strokeWidth="2" />
                <line x1="258" y1="62" x2="250" y2="70" strokeWidth="2" />
                <line x1="62" y1="258" x2="70" y2="250" strokeWidth="2" />
                <line x1="258" y1="258" x2="250" y2="250" strokeWidth="2" />
              </g>

              {/* Circular Progress Arc */}
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <circle
                cx="160"
                cy="160"
                r={radius}
                fill="none"
                stroke="url(#clayOrangeGlow)"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 160 160)"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Inner Puffy 3D Clay Capsule */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full clay-disc-inner flex flex-col items-center justify-center relative overflow-hidden">
              <span className="font-telemetry-sm text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5 relative z-10">
                T-MINUS REMAINING
              </span>

              {/* Digital Readout */}
              <div className="relative z-10 flex items-baseline">
                <span className="font-telemetry-lg text-4xl sm:text-5xl leading-tight tracking-tight font-extrabold text-slate-900 dark:text-slate-100">
                  {formattedTime}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5 text-slate-500 relative z-10">
                <span className="font-telemetry-sm text-[11px] font-semibold">TOTAL</span>
                <span className="font-telemetry-sm text-[11px] text-slate-800 dark:text-slate-200 font-extrabold">
                  {Math.floor(totalDuration / 60)}:00
                </span>
              </div>

              {/* Clay Pill Flow Status */}
              <div className="mt-2.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 clay-pill border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5 relative z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)] animate-pulse" />
                <span className="font-telemetry-sm text-[10px] text-emerald-800 dark:text-emerald-300 font-extrabold uppercase tracking-wide">
                  {isRunning ? 'FLOW LOCKED' : 'READY TO ENGAGE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYBACK CONTROLS */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 my-5 sm:my-6 z-10 w-full max-w-sm">
          <button
            type="button"
            onClick={resetTimer}
            className="p-3 sm:p-3.5 rounded-2xl clay-btn-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer shrink-0"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={isRunning ? pauseTimer : startTimer}
            className="flex-1 flex items-center justify-center px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl clay-btn-primary text-white font-headline-sm font-extrabold text-sm sm:text-base cursor-pointer gap-2 shadow-lg whitespace-nowrap"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                <span>PAUSE SESSION</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                <span>START SPRINT</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={skipSession}
            className="p-3 sm:p-3.5 rounded-2xl clay-btn-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer shrink-0"
            title="Skip to next session"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Task Selection Inset */}
        <div className="w-full max-w-md my-2 z-10">
          <label className="block font-telemetry-sm text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 text-left">
            Bound Focus Objective
          </label>
          <div className="relative">
            <select
              value={selectedTaskTitle}
              onChange={e => setSelectedTaskTitle(e.target.value)}
              className="w-full appearance-none clay-inset rounded-2xl px-4 py-3 font-body-md text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-semibold focus:outline-none cursor-pointer"
            >
              {tasks.map(t => (
                <option key={t.id} value={t.title}>
                  {t.completed ? '✓ ' : ''}{t.title} ({t.course || 'General'})
                </option>
              ))}
              <option value="General Deep Reading & Problem Sets">General Deep Reading & Problem Sets</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 w-full z-10">
          {presets.map(p => {
            const isSel = activePreset.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(p)}
                className={`px-3.5 py-1.5 rounded-2xl font-telemetry-sm text-xs font-bold transition-all cursor-pointer ${
                  isSel
                    ? 'clay-btn-primary text-white'
                    : 'clay-pill text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {p.name} ({p.focusMinutes}m/{p.breakMinutes}m)
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="px-3.5 py-1.5 rounded-2xl clay-btn-light font-telemetry-sm text-xs text-slate-600 dark:text-slate-400 font-bold cursor-pointer"
          >
            + Custom Interval
          </button>
        </div>
      </div>

      {/* AMBIENT & BINAURAL SOUNDBOARD CONTROLS */}
      <GammaWaveControls />

      {/* DAILY TELEMETRY LOG SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clay-card rounded-3xl p-5 border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <span className="font-telemetry-sm text-xs font-bold text-slate-500 uppercase">Sprints Finished Today</span>
          <span className="font-telemetry-lg text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
            {todaySessions.length} Blocks
          </span>
        </div>
        <div className="clay-card rounded-3xl p-5 border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <span className="font-telemetry-sm text-xs font-bold text-slate-500 uppercase">Focus Minutes Locked</span>
          <span className="font-telemetry-lg text-2xl font-black text-orange-600 dark:text-orange-400 mt-1 block">
            {todaySessions.reduce((a, s) => a + s.durationMinutes, 0)} Mins
          </span>
        </div>
        <div className="clay-card rounded-3xl p-5 border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <span className="font-telemetry-sm text-xs font-bold text-slate-500 uppercase">Points Bank Earned</span>
          <span className="font-telemetry-lg text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
            +{todaySessions.reduce((a, s) => a + s.pointsEarned, 0)} FP
          </span>
        </div>
      </div>

      {/* Custom Duration Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="clay-card rounded-3xl p-6 w-full max-w-sm border border-white/80 dark:border-white/5">
            <h3 className="font-headline-md text-base font-extrabold text-slate-900 dark:text-slate-100 mb-4">
              Set Custom Sprint Interval
            </h3>
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">
                  Focus Interval (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={customFocus}
                  onChange={e => setCustomFocus(parseInt(e.target.value) || 25)}
                  className="w-full clay-inset rounded-2xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 text-sm font-telemetry-md focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">
                  Break Interval (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreak}
                  onChange={e => setCustomBreak(parseInt(e.target.value) || 5)}
                  className="w-full clay-inset rounded-2xl px-3.5 py-2.5 text-slate-800 dark:text-slate-100 text-sm font-telemetry-md focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2.5 rounded-2xl clay-btn-light text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl clay-btn-primary text-white text-xs font-bold cursor-pointer"
                >
                  Apply Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

