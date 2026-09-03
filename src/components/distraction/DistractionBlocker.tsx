import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Play,
  Flame,
  Clock,
  ExternalLink,
  Smartphone,
  PieChart,
  Activity,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useTimer } from '../../context/TimerContext';

export const DistractionBlocker: React.FC = () => {
  const { blockedDomains, addBlockedDomain, removeBlockedDomain, triggerInterception } = useGamification();
  const { isRunning, mode } = useTimer();

  const [newDomain, setNewDomain] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'social' | 'video' | 'gaming' | 'news'>('social');
  const [customTestUrl, setCustomTestUrl] = useState<string>('instagram.com');

  const totalAttempts = blockedDomains.reduce((acc, b) => acc + b.attemptsToday, 0);
  const totalMinutesSaved = blockedDomains.reduce((acc, b) => acc + b.minutesSaved, 0);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    addBlockedDomain(newDomain.trim(), newDomain.trim(), newCategory);
    setNewDomain('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Banner & Status */}
      <div className="clay-card rounded-3xl p-6 relative overflow-hidden border border-slate-200/80 dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl clay-pill border transition-colors ${
              isRunning && mode === 'focus'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {isRunning && mode === 'focus' ? (
                <ShieldCheck className="w-8 h-8 animate-pulse" />
              ) : (
                <ShieldAlert className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Anti-Distraction Shield & Telemetry
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider clay-pill ${
                  isRunning && mode === 'focus'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {isRunning && mode === 'focus' ? 'Active Focus Guard' : 'Standby Mode'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Real-time network domain interceptor that arrests dopamine reflex loops before they disrupt working memory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 clay-inset p-2 rounded-2xl">
            <div className="px-3 py-1.5 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Resisted</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400 font-telemetry-sm">{totalAttempts}</span>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-white/10" />
            <div className="px-3 py-1.5 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Saved</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-cyan-400 font-telemetry-sm">{Math.round(totalMinutesSaved / 60 * 10) / 10}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sandbox: Test Interceptor Live */}
      <div className="clay-card rounded-3xl p-6 border border-orange-500/20 bg-gradient-to-r from-orange-50/50 via-white to-amber-50/50 dark:from-violet-950/20 dark:via-[#191a1f] dark:to-cyan-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Live Interceptor Sandbox & Second-Thought Testbed
            </h2>
          </div>
          <span className="text-xs text-orange-600 dark:text-orange-400 font-mono clay-pill px-2 py-0.5 rounded-full font-bold">
            Interactive Simulator
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
          Click any preset below or input a domain to simulate an attempted doom-scrolling visit and test the 10-second mindfulness friction challenge:
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {['instagram.com', 'tiktok.com', 'youtube.com', 'reddit.com', 'x.com'].map(domain => (
            <button
              key={domain}
              type="button"
              onClick={() => triggerInterception(domain)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl clay-btn-light text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-orange-500" />
              <span>Simulate {domain}</span>
            </button>
          ))}

          <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              value={customTestUrl}
              onChange={e => setCustomTestUrl(e.target.value)}
              placeholder="e.g. netflix.com"
              className="clay-inset rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 w-36"
            />
            <button
              type="button"
              onClick={() => triggerInterception(customTestUrl || 'distraction.com')}
              className="px-3.5 py-1.5 rounded-xl clay-btn-primary text-white text-xs font-bold transition-all cursor-pointer"
            >
              Test Intercept
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Blacklist Domains Management */}
        <div className="lg:col-span-2 clay-card rounded-3xl p-6 border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Blocked Distraction Domains</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Monitored applications and doom-scrolling sinks.
              </p>
            </div>
          </div>

          {/* Add Domain Form */}
          <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
              placeholder="Add website (e.g., twitch.tv, discord.com)"
              className="flex-1 clay-inset rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as any)}
              className="clay-inset rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="social">Social Media</option>
              <option value="video">Video Streaming</option>
              <option value="gaming">Gaming</option>
              <option value="news">News / Gossip</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl clay-btn-primary text-white text-xs sm:text-sm font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Filter</span>
            </button>
          </form>

          {/* List of Blocked Domains */}
          <div className="space-y-2">
            {blockedDomains.map(b => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 rounded-2xl clay-card-subtle transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl clay-pill flex items-center justify-center text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                    {b.domain.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{b.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">({b.domain})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="capitalize">{b.category}</span>
                      <span>•</span>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">{b.attemptsToday} intercepted</span>
                      <span>•</span>
                      <span className="text-indigo-600 dark:text-cyan-400 font-semibold">~{b.minutesSaved}m saved</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerInterception(b.domain)}
                    className="p-2 rounded-xl clay-btn-light text-slate-600 dark:text-slate-400 hover:text-orange-600 cursor-pointer"
                    title="Simulate interception"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlockedDomain(b.id)}
                    className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 cursor-pointer"
                    title="Remove filter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Distraction Analytics & Culprits */}
        <div className="clay-card rounded-3xl p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Top Culprits Breakdown</h2>
              <PieChart className="w-5 h-5 text-slate-400" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Visual breakdown of non-productive impulse frequency across categories.
            </p>

            {/* Visual Bar Breakdown */}
            <div className="space-y-4">
              {blockedDomains.slice(0, 5).map(b => {
                const pct = totalAttempts > 0 ? Math.round((b.attemptsToday / totalAttempts) * 100) : 0;
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{b.name}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">{b.attemptsToday} hits ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full clay-inset rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-white/5 clay-inset p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Dopamine Friction Impact</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              By introducing the 10s breathing friction gate, your impulse resistance rate increased by <strong className="text-slate-900 dark:text-white">+42%</strong> this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
