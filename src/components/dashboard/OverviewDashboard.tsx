import React, { useState, useEffect } from 'react';
import {
  Timer,
  Sparkles,
  Flame,
  CheckCircle2,
  Users,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Play,
  Grid2X2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTimer } from '../../context/TimerContext';
import { useTask } from '../../context/TaskContext';
import { useGamification } from '../../context/GamificationContext';

interface OverviewDashboardProps {
  onNavigate: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { isRunning, startTimer, sessionLogs } = useTimer();
  const { tasks, toggleTaskComplete, circadianStatus } = useTask();
  const { streak, focusPoints, rooms } = useGamification();

  const [clockStr, setClockStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockStr(now.toTimeString().split(' ')[0]);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeTasks = tasks.filter(t => !t.completed).slice(0, 4);

  // Split streak digits for rotary tumbler display
  const streakDigits = streak.toString().padStart(3, '0').split('');

  // Calculate real today telemetry
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessionLogs.filter(
    s => s.completed && s.mode === 'focus' && s.timestamp.startsWith(todayStr)
  );
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todayHours = Math.floor(todayFocusMinutes / 60);
  const todayMins = todayFocusMinutes % 60;
  const focusTodayStr = `${todayHours}h ${todayMins.toString().padStart(2, '0')}m`;
  const focusTargetRatio = Math.min(1, todayFocusMinutes / 300); // 5h target = 300m
  const focusTargetPercent = Math.round(focusTargetRatio * 100);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;
  const taskEfficiencyPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div className="flex flex-col w-full gap-6 select-none">
      {/* SECTION 1: TOP HERO DECK */}
      <div className="w-full clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Greeting & Mechanical Timestamp */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 clay-pill font-telemetry-sm text-xs font-extrabold border border-emerald-300 dark:border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
                <span>CIRCADIAN PEAK WINDOW</span>
              </span>
              <span className="text-slate-400 dark:text-slate-600 font-bold">|</span>
              <span className="font-telemetry-sm text-xs text-slate-700 dark:text-slate-400 font-extrabold">
                ALPHA STATE: {circadianStatus.energyScore}% SYNCED
              </span>
            </div>

            <div className="flex items-baseline gap-4 mt-1">
              <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-slate-100 tracking-tight font-extrabold">
                Good evening, {user?.name || 'Alex'}
              </h1>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl clay-inset">
                <Timer className="w-4 h-4 text-orange-500" />
                <span className="font-telemetry-md text-sm text-orange-600 dark:text-orange-400 font-extrabold tracking-widest">
                  {clockStr || '19:42:08'}
                </span>
              </div>
            </div>

            <p className="font-body-md text-sm text-slate-700 dark:text-slate-300 max-w-xl font-semibold">
              Cognitive load balanced. High-leverage window runs active before neural recharge protocol engages.
            </p>
          </div>

          {/* Action Button & Tumbler Rotary Display */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-5 w-full lg:w-auto">
            {/* Clay Tumbler (Streak Counter) */}
            <div className="flex flex-col items-center clay-inset p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                {streakDigits.map((digit, idx) => (
                  <div
                    key={idx}
                    className="relative w-9 h-14 bg-white dark:bg-[#1f2537] rounded-xl clay-pill flex items-center justify-center border border-white/60 dark:border-white/5"
                  >
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-orange-400/20" />
                    <span className="font-telemetry-lg text-2xl font-black text-slate-900 dark:text-slate-100">
                      {digit}
                    </span>
                  </div>
                ))}
              </div>
              <span className="font-telemetry-sm text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-extrabold mt-2">
                Days Streak Tumbler
              </span>
            </div>

            {/* Inflated Clay Launch Button */}
            <button
              type="button"
              onClick={() => {
                if (!isRunning) startTimer();
                onNavigate('timer');
              }}
              className="group relative flex-1 sm:flex-initial flex items-center justify-center gap-3.5 px-6 py-4 clay-btn-primary text-white font-headline-sm rounded-2xl cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white drop-shadow group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="tracking-tight text-white font-black text-lg drop-shadow">
                  {isRunning ? 'VIEW TIMER' : 'ENGAGE FLOW'}
                </span>
                <span className="font-telemetry-sm text-xs font-bold text-orange-100 tracking-wider uppercase">
                  50m Deep Protocol
                </span>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#fff] ml-2 animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: METRICS ARRAY (CLAY INSTRUMENT GAUGES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Gauge 1: Focus Today (Analog Arc Meter) */}
        <div className="clay-card p-6 rounded-3xl border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-400 mb-2">
            <span className="font-label-md text-xs uppercase tracking-wider font-extrabold text-slate-800 dark:text-slate-200">
              Focus Today
            </span>
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-center justify-between my-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-slate-200 dark:text-slate-800"
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                />
                <circle
                  className="text-emerald-500 transition-all duration-1000"
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={238.76}
                  strokeDashoffset={238.76 * (1 - focusTargetRatio)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-telemetry-sm text-sm text-emerald-700 dark:text-emerald-400 font-extrabold">
                  {focusTargetPercent}%
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-telemetry-lg text-2xl text-slate-900 dark:text-slate-100 font-black tracking-tight">
                {focusTodayStr}
              </span>
              <span className="font-telemetry-sm text-xs text-slate-600 dark:text-slate-400 font-bold">Target: 5h 00m</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 font-telemetry-sm text-[11px] clay-inset px-3 py-2 rounded-xl">
            <span className="text-slate-700 dark:text-slate-300 font-bold">RUNNING ACCEL</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">
              {todayFocusMinutes > 0 ? `+${todayFocusMinutes}m Today` : 'Awaiting Sprint'}
            </span>
          </div>
        </div>

        {/* Gauge 2: Deep Work Blocks */}
        <div className="clay-card p-6 rounded-3xl border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-400 mb-2">
            <span className="font-label-md text-xs uppercase tracking-wider font-extrabold text-slate-800 dark:text-slate-200">
              Deep Work Blocks
            </span>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <div className="my-2">
            {todaySessions.length > 0 ? (
              <div className="flex items-center gap-1.5 justify-start flex-wrap py-2 px-2.5 clay-inset rounded-2xl">
                {todaySessions.map((sess, idx) => (
                  <div key={idx} className="h-9 px-3 rounded-xl clay-btn-primary flex items-center justify-center">
                    <span className="font-telemetry-sm text-[10px] text-white font-extrabold">{sess.durationMinutes}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2.5 px-3 clay-inset rounded-2xl text-center">
                <span className="font-telemetry-sm text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  0 blocks completed today
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between font-telemetry-sm text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-extrabold">COMPLETED RATIO</span>
            <span className="text-orange-600 dark:text-orange-400 font-black">
              {todaySessions.length} OF 6 CYCLES
            </span>
          </div>
        </div>

        {/* Gauge 3: Focus Points & Rewards */}
        <div className="clay-card p-6 rounded-3xl border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-400 mb-2">
            <span className="font-label-md text-xs uppercase tracking-wider font-extrabold text-slate-800 dark:text-slate-200">
              Points Bank
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 clay-pill font-telemetry-sm text-[10px] font-extrabold">
              TIER {focusPoints >= 2000 ? 'III' : focusPoints >= 1000 ? 'II' : 'I'} DECK
            </span>
          </div>
          <div className="flex items-center gap-3.5 my-2">
            <div className="w-12 h-12 rounded-2xl clay-btn-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-telemetry-lg text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {focusPoints.toLocaleString()}
              </span>
              <span className="font-telemetry-sm text-xs text-orange-600 dark:text-orange-400 font-bold">
                +{todaySessions.reduce((acc, s) => acc + (s.pointsEarned || 0), 0)} FP Earned Today
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('rewards')}
            className="w-full py-2 px-3 rounded-2xl clay-btn-light text-slate-700 dark:text-slate-300 font-telemetry-sm text-xs font-bold flex items-center justify-between cursor-pointer"
          >
            <span>OPEN SHOP</span>
            <ArrowRight className="w-4 h-4 text-orange-500" />
          </button>
        </div>

        {/* Gauge 4: Task Velocity */}
        <div className="clay-card p-6 rounded-3xl border border-white/80 dark:border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-2">
            <span className="font-label-md text-xs uppercase tracking-wider font-extrabold text-slate-700 dark:text-slate-300">
              Task Velocity
            </span>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between my-2">
            <div className="flex items-baseline gap-1">
              <span className="font-telemetry-lg text-3xl font-black text-slate-900 dark:text-slate-100">
                {completedTasksCount}
              </span>
              <span className="font-telemetry-sm text-xs text-slate-500 font-bold">
                / {totalTasksCount} Done
              </span>
            </div>
            <span className="font-telemetry-sm text-xs px-2.5 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold">
              {taskEfficiencyPercent}% Efficiency
            </span>
          </div>
          <div className="w-full clay-inset h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${taskEfficiencyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: TACTILE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): High Priority Task Queue */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="clay-card rounded-3xl p-6 border border-white/80 dark:border-white/5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Active Priority Queue
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('planner-tasks')}
                className="font-telemetry-sm text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>OPEN PLANNER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {activeTasks.map(task => (
                <div
                  key={task.id}
                  className="clay-card-subtle p-4 rounded-2xl flex items-center justify-between gap-4 border border-white/60 dark:border-white/5"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTaskComplete(task.id)}
                      className="w-6 h-6 rounded-xl clay-btn-light flex items-center justify-center cursor-pointer flex-shrink-0"
                    >
                      <CheckCircle2 className={`w-4 h-4 ${task.completed ? 'text-emerald-500 fill-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className="font-headline-sm text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 font-telemetry-sm text-xs text-slate-500">
                        <span>{task.course || 'Core Task'}</span>
                        <span>•</span>
                        <span className="text-orange-600 dark:text-orange-400 font-bold">{task.estimatedMinutes}m duration</span>
                      </div>
                    </div>
                  </div>

                  <span className={`font-telemetry-sm text-[10px] font-extrabold px-3 py-1 rounded-full uppercase flex-shrink-0 ${
                    task.energy === 'deep_focus'
                      ? 'clay-btn-indigo text-white'
                      : 'clay-pill text-slate-700 dark:text-slate-300'
                  }`}>
                    {task.energy.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Eisenhower Matrix Summary & Virtual Study Room */}
        <div className="flex flex-col gap-6">
          {/* Eisenhower Mini Card */}
          <div className="clay-card rounded-3xl p-6 border border-white/80 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Grid2X2 className="w-5 h-5 text-indigo-500" />
                <h3 className="font-headline-md text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Eisenhower Matrix
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('habits-matrix')}
                className="font-telemetry-sm text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                View 2x2
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl clay-inset border border-orange-500/20">
                <span className="font-telemetry-sm text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase block mb-1">
                  1. Do First
                </span>
                <span className="font-headline-sm text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  3 Tasks
                </span>
              </div>
              <div className="p-3 rounded-2xl clay-inset border border-emerald-500/20">
                <span className="font-telemetry-sm text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block mb-1">
                  2. Schedule
                </span>
                <span className="font-headline-sm text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  5 Tasks
                </span>
              </div>
              <div className="p-3 rounded-2xl clay-inset">
                <span className="font-telemetry-sm text-[10px] text-slate-500 font-bold uppercase block mb-1">
                  3. Delegate
                </span>
                <span className="font-headline-sm text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  1 Task
                </span>
              </div>
              <div className="p-3 rounded-2xl clay-inset">
                <span className="font-telemetry-sm text-[10px] text-slate-500 font-bold uppercase block mb-1">
                  4. Eliminate
                </span>
                <span className="font-headline-sm text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  2 Tasks
                </span>
              </div>
            </div>
          </div>

          {/* Virtual Focus Room Quick Join */}
          <div className="clay-card rounded-3xl p-6 border border-white/80 dark:border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <h3 className="font-headline-md text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Live Focus Room
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>

            <p className="font-body-md text-xs text-slate-600 dark:text-slate-400 mb-4 font-medium">
              {rooms[0]?.name || 'Deep Alpha Study Room'} is active with {rooms[0]?.activeParticipants || 14} peers focusing live.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('study-rooms')}
              className="w-full py-3 px-4 rounded-2xl clay-btn-primary text-white font-headline-sm text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>JOIN ROOM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
