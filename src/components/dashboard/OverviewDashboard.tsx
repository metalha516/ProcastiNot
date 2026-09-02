import React from 'react';
import {
  Play,
  Brain,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Activity,
  CheckCircle2,
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
  const { isRunning, timeRemaining, mode, startTimer } = useTimer();
  const { tasks, exams, circadianStatus } = useTask();
  const { streak, focusPoints, blockedDomains, rooms, deltaHistory } = useGamification();

  const activeTasks = tasks.filter(t => !t.completed).slice(0, 3);
  const urgentExam = exams[0];
  const totalAttempts = blockedDomains.reduce((acc, b) => acc + b.attemptsToday, 0);
  const totalSavedMins = blockedDomains.reduce((acc, b) => acc + b.minutesSaved, 0);
  const activePeers = rooms.reduce((acc, r) => acc + r.activeParticipants, 0);

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="stitch-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border-white/10 bg-gradient-to-r from-violet-950/30 via-[#191a1f] to-cyan-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {user?.institution || 'Stanford University'}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {circadianStatus.windowLabel}
              </span>
              <a
                href="https://stitch.withgoogle.com/projects/1507620726274103179"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 hover:bg-cyan-500/20 transition-colors"
                title="Google Stitch Reference Project 1507620726274103179"
              >
                <span>Stitch #1507620726274103179</span>
              </a>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Scholar'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Your biological alertness is currently at <strong className="text-violet-400">{circadianStatus.energyScore}%</strong>. High cognitive tasks like CS161 dynamic programming are optimal right now.
            </p>
          </div>

          {/* Quick Focus Sprint Trigger */}
          <div className="flex items-center gap-3 bg-[#121316] p-3 rounded-2xl border border-white/10 self-start md:self-auto">
            <div className="text-right mr-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                {isRunning ? 'Sprint Running' : 'Ready to Focus'}
              </span>
              <span className="text-xl font-mono font-bold text-white">
                {timeFormatted}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!isRunning) startTimer();
                onNavigate('timer');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'View Focus Timer' : 'Launch 40Hz Sprint'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('habits')}
          className="stitch-card stitch-card-hover rounded-2xl p-4.5 cursor-pointer border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white block">{streak} Days</span>
          <span className="text-[11px] text-neutral-500 mt-1 block">Unbroken consistency</span>
        </div>

        <div
          onClick={() => onNavigate('rewards')}
          className="stitch-card stitch-card-hover rounded-2xl p-4.5 cursor-pointer border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400">Reward Wallet</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white block">{focusPoints.toLocaleString()} FP</span>
          <span className="text-[11px] text-cyan-400 mt-1 block">Redeemable in Shop</span>
        </div>

        <div
          onClick={() => onNavigate('blocker')}
          className="stitch-card stitch-card-hover rounded-2xl p-4.5 cursor-pointer border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400">Impulses Resisted</span>
            <ShieldCheck className="w-4 h-4 text-violet-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white block">{totalAttempts} Times</span>
          <span className="text-[11px] text-violet-400 mt-1 block">~{totalSavedMins}m doom-scrolling saved</span>
        </div>

        <div
          onClick={() => onNavigate('rooms')}
          className="stitch-card stitch-card-hover rounded-2xl p-4.5 cursor-pointer border-white/5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-400">Active Peers Online</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white block">{activePeers} Students</span>
          <span className="text-[11px] text-emerald-400 mt-1 block">Across 3 live focus rooms</span>
        </div>
      </div>

      {/* Main Grid: Left 2 cols, Right 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Circadian Task Queue & Urgent Exam Runway */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Exam Runway Card */}
          {urgentExam && (
            <div className="stitch-card rounded-2xl p-5 border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-400" />
                  <h2 className="text-sm font-bold text-white">Upcoming Urgent Runway</h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('countdown')}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Exams</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121316] p-4 rounded-xl border border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{urgentExam.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 font-bold uppercase">
                      Critical
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Remaining syllabus runway: <strong className="text-neutral-200">{urgentExam.topicsRemaining.length} topics</strong> to cover.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Daily Quota</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">{urgentExam.dailyQuotaMinutes} mins / day</span>
                </div>
              </div>
            </div>
          )}

          {/* Today's Prioritized Tasks */}
          <div className="stitch-card rounded-2xl p-5 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Today's Circadian Task Queue</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('circadian')}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Manage All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#121316] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-semibold text-white block">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <span className="text-violet-400 font-medium">{task.course}</span>
                      <span>•</span>
                      <span className="font-mono text-neutral-500">{task.estimatedMinutes}m duration</span>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    task.energy === 'deep_focus'
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {task.energy.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: 40Hz Audio Status & Second-Thought Sandbox */}
        <div className="space-y-6">
          {/* 40Hz Neural Entrainment Snapshot */}
          <div className="stitch-card rounded-2xl p-5 border-violet-500/20 bg-gradient-to-b from-[#191a1f] to-[#14151a]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">40 Hz Gamma Audio</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Real-time gamma wave binaural entrainment configured for your headphones to maintain peak alertness.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('timer')}
              className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Open Audio Synthesizer
            </button>
          </div>

          {/* Quick Sandbox Tester */}
          <div className="stitch-card rounded-2xl p-5 border-white/10">
            <h3 className="text-sm font-bold text-white mb-1.5">Second-Thought Shield</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Blockers active for Instagram, YouTube, TikTok, and Reddit.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('blocker')}
              className="w-full py-2 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              Test Interception Sandbox
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
