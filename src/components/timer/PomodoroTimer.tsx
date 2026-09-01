import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Clock,
  Sparkles,
  Coffee,
  Brain,
  CheckCircle2,
  ChevronDown,
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

  // SVG circular calculations
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
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
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Main Timer Display Card */}
      <div className="stitch-card rounded-3xl p-6 sm:p-10 relative overflow-hidden text-center border-white/10">
        {/* Glow ambient circle */}
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          mode === 'focus'
            ? 'bg-violet-600/15'
            : 'bg-emerald-600/15'
        }`} />

        {/* Mode Toggles */}
        <div className="relative inline-flex p-1 bg-[#121316] border border-white/10 rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => switchMode('focus')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Deep Focus</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('short_break')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Short Break</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('long_break')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'long_break'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Long Recharge</span>
          </button>
        </div>

        {/* Circular Timer Ring */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 300 300">
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {/* Background track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="10"
              fill="transparent"
            />

            {/* Animated stroke */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke={mode === 'focus' ? 'url(#timerGradient)' : 'url(#breakGradient)'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time & Mode Label Inside Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white font-mono drop-shadow-md">
              {formattedTime}
            </span>
            <span className={`text-xs font-semibold tracking-wider uppercase mt-2 px-3 py-0.5 rounded-full border ${
              mode === 'focus'
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}>
              {isRunning ? (mode === 'focus' ? 'Focusing' : 'Resting') : 'Paused'}
            </span>

            {/* Task Tag */}
            <div className="mt-3 max-w-[200px] truncate text-xs text-neutral-400">
              {selectedTaskTitle}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-[#121316] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5 transition-all cursor-pointer shadow-md"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={isRunning ? pauseTimer : startTimer}
            className={`flex items-center justify-center w-16 h-16 rounded-3xl font-bold text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
              mode === 'focus'
                ? 'bg-gradient-to-tr from-violet-600 to-cyan-600 shadow-violet-600/30'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={skipSession}
            className="p-3.5 rounded-2xl bg-[#121316] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/5 transition-all cursor-pointer shadow-md"
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Task Selection Dropdown */}
        <div className="max-w-md mx-auto mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5 text-left">
            Active Study Objective
          </label>
          <div className="relative">
            <select
              value={selectedTaskTitle}
              onChange={e => setSelectedTaskTitle(e.target.value)}
              className="w-full appearance-none bg-[#121316] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              {tasks.map(t => (
                <option key={t.id} value={t.title}>
                  {t.completed ? '✓ ' : ''}{t.title} ({t.course || 'General'})
                </option>
              ))}
              <option value="General Focus & Homework">General Focus & Deep Reading</option>
            </select>
            <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/5">
          {presets.map(p => {
            const isSel = activePreset.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPreset(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isSel
                    ? 'bg-violet-600/20 border-violet-500/50 text-violet-300 font-semibold shadow-sm'
                    : 'bg-[#121316] border-white/5 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {p.name} ({p.focusMinutes}m/{p.breakMinutes}m)
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-white bg-[#121316] border border-white/5 hover:border-white/15 transition-colors cursor-pointer"
          >
            + Custom Interval
          </button>
        </div>
      </div>

      {/* 40 Hz Gamma Neural Entrainment Panel */}
      <GammaWaveControls />

      {/* Daily Completed Focus Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stitch-card rounded-2xl p-4">
          <span className="block text-xs font-semibold text-neutral-400 uppercase">Sprints Finished Today</span>
          <span className="text-2xl font-bold text-white mt-1 block">{todaySessions.length} Blocks</span>
        </div>
        <div className="stitch-card rounded-2xl p-4">
          <span className="block text-xs font-semibold text-neutral-400 uppercase">Focus Minutes Locked</span>
          <span className="text-2xl font-bold text-violet-400 mt-1 block">
            {todaySessions.reduce((a, s) => a + s.durationMinutes, 0)} Mins
          </span>
        </div>
        <div className="stitch-card rounded-2xl p-4">
          <span className="block text-xs font-semibold text-neutral-400 uppercase">Focus Points Earned</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 block">
            +{todaySessions.reduce((a, s) => a + s.pointsEarned, 0)} FP
          </span>
        </div>
      </div>

      {/* Custom Duration Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#191a1f] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-white mb-4">Set Custom Sprint Duration</h3>
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Focus Interval (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={customFocus}
                  onChange={e => setCustomFocus(parseInt(e.target.value) || 25)}
                  className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Break Interval (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreak}
                  onChange={e => setCustomBreak(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
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
