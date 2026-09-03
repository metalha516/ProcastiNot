import React from 'react';
import { Trophy, Medal, Award, Flame, Users, TrendingUp, BarChart2 } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';

export const LeaderboardArena: React.FC = () => {
  const { leaderboard } = useGamification();

  const cohortAverageWeekly = 26.4;
  const userEntry = leaderboard.find(l => l.isCurrentUser) || leaderboard[2];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="clay-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                Group Study Arena & Peer Showdowns
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1 max-w-xl">
              Real-time collegiate focus competition. Compare verified weekly deep work output against peer group and cohort averages.
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-bold self-start sm:self-auto flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Rank #{userEntry.rank} in Stanford League</span>
          </div>
        </div>
      </div>

      {/* Comparative Output Visualization: Personal vs Cohort Average */}
      <div className="clay-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Weekly Focus Output vs. Group Benchmark</h2>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
            +17.4% above cohort average
          </span>
        </div>

        {/* Comparative Bars */}
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-800 dark:text-white">You (Alex Chen)</span>
              <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">{userEntry.weeklyHours}h / 40h target</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-[#121316] rounded-full overflow-hidden border border-slate-200/60 dark:border-white/5">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full transition-all duration-700"
                style={{ width: `${(userEntry.weeklyHours / 40) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-neutral-400">Cohort Average (CS & STEM Peers)</span>
              <span className="font-mono text-slate-500 dark:text-neutral-400">{cohortAverageWeekly}h / 40h</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-[#121316] rounded-full overflow-hidden border border-slate-200/60 dark:border-white/5">
              <div
                className="h-full bg-slate-300 dark:bg-neutral-700 rounded-full transition-all duration-700"
                style={{ width: `${(cohortAverageWeekly / 40) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="clay-card rounded-2xl p-6">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Live Peer Focus Rankings</h2>

        <div className="space-y-2">
          {leaderboard.map(entry => {
            const isTop3 = entry.rank <= 3;
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  entry.isCurrentUser
                    ? 'bg-violet-500/10 border-violet-500/40 ring-1 ring-violet-500/30'
                    : 'bg-white dark:bg-[#121316] border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 shadow-xs'
                }`}
              >
                {/* Left: Rank & User */}
                <div className="flex items-center gap-3.5">
                  <div className="w-7 text-center">
                    {entry.rank === 1 ? (
                      <span className="text-amber-500 dark:text-amber-400 font-bold text-sm">🥇</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-slate-400 dark:text-neutral-300 font-bold text-sm">🥈</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-700 dark:text-amber-600 font-bold text-sm">🥉</span>
                    ) : (
                      <span className="text-slate-400 dark:text-neutral-500 font-mono text-xs font-semibold">
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${entry.isCurrentUser ? 'text-violet-600 dark:text-violet-300' : 'text-slate-800 dark:text-white'}`}>
                        {entry.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400 uppercase">
                        {entry.institution}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-mono">
                      <span>{entry.dailyHours}h today</span>
                      <span>•</span>
                      <span className="text-amber-500 dark:text-amber-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-500 dark:fill-amber-400" />
                        {entry.streak}d streak
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Total Hours & Points */}
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-slate-800 dark:text-white block">
                    {entry.weeklyHours} hrs
                  </span>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                    {entry.points.toLocaleString()} FP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
