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
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Status */}
      <div className="stitch-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl border ${
              isRunning && mode === 'focus'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-violet-500/10 border-violet-500/30 text-violet-400'
            }`}>
              {isRunning && mode === 'focus' ? (
                <ShieldCheck className="w-8 h-8 animate-pulse" />
              ) : (
                <ShieldAlert className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Anti-Distraction Shield & Telemetry
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isRunning && mode === 'focus'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}>
                  {isRunning && mode === 'focus' ? 'Active Focus Guard' : 'Standby Mode'}
                </span>
              </div>
              <p className="text-sm text-neutral-400 mt-1 max-w-xl">
                Real-time network domain interceptor that arrests dopamine reflex loops before they disrupt working memory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#121316] border border-white/5 p-2 rounded-xl">
            <div className="px-3 py-1.5 text-center">
              <span className="block text-xs text-neutral-500 uppercase font-semibold">Resisted</span>
              <span className="text-lg font-bold text-violet-400">{totalAttempts}</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="px-3 py-1.5 text-center">
              <span className="block text-xs text-neutral-500 uppercase font-semibold">Saved</span>
              <span className="text-lg font-bold text-cyan-400">{Math.round(totalMinutesSaved / 60 * 10) / 10}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sandbox: Test Interceptor Live */}
      <div className="stitch-card rounded-2xl p-6 border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-[#191a1f] to-cyan-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-bold text-white">
              Live Interceptor Sandbox & Second-Thought Testbed
            </h2>
          </div>
          <span className="text-xs text-violet-300 font-mono bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
            Interactive Simulator
          </span>
        </div>
        <p className="text-xs text-neutral-400 mb-4">
          Click any preset below or input a domain to simulate an attempted doom-scrolling visit and test the 10-second mindfulness friction challenge:
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {['instagram.com', 'tiktok.com', 'youtube.com', 'reddit.com', 'x.com'].map(domain => (
            <button
              key={domain}
              type="button"
              onClick={() => triggerInterception(domain)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121316] hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
              <span>Simulate {domain}</span>
            </button>
          ))}

          <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
            <input
              type="text"
              value={customTestUrl}
              onChange={e => setCustomTestUrl(e.target.value)}
              placeholder="e.g. netflix.com"
              className="bg-[#121316] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-violet-500 w-36"
            />
            <button
              type="button"
              onClick={() => triggerInterception(customTestUrl || 'distraction.com')}
              className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Test Intercept
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Blacklist Domains Management */}
        <div className="lg:col-span-2 stitch-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Blocked Distraction Domains</h2>
              <p className="text-xs text-neutral-400">
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
              className="flex-1 bg-[#121316] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as any)}
              className="bg-[#121316] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-neutral-300 focus:outline-none focus:border-violet-500"
            >
              <option value="social">Social Media</option>
              <option value="video">Video Streaming</option>
              <option value="gaming">Gaming</option>
              <option value="news">News / Gossip</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
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
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#121316] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-300 uppercase">
                    {b.domain.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{b.name}</span>
                      <span className="text-xs text-neutral-500 font-mono">({b.domain})</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
                      <span className="capitalize text-neutral-500">{b.category}</span>
                      <span>•</span>
                      <span className="text-violet-400">{b.attemptsToday} intercepted</span>
                      <span>•</span>
                      <span className="text-cyan-400">~{b.minutesSaved}m saved</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerInterception(b.domain)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-violet-600/20 text-neutral-400 hover:text-violet-300 text-xs transition-colors cursor-pointer"
                    title="Simulate interception"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlockedDomain(b.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
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
        <div className="stitch-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Top Culprits Breakdown</h2>
              <PieChart className="w-5 h-5 text-neutral-500" />
            </div>

            <p className="text-xs text-neutral-400 mb-6">
              Visual breakdown of non-productive impulse frequency across categories.
            </p>

            {/* Visual Bar Breakdown */}
            <div className="space-y-4">
              {blockedDomains.slice(0, 5).map(b => {
                const pct = totalAttempts > 0 ? Math.round((b.attemptsToday / totalAttempts) * 100) : 0;
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-neutral-300">{b.name}</span>
                      <span className="font-mono text-neutral-400">{b.attemptsToday} hits ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#121316] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 bg-[#121316] p-4 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-1">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Dopamine Friction Impact</span>
            </div>
            <p className="text-xs text-neutral-400">
              By introducing the 10s breathing friction gate, your impulse resistance rate increased by <strong className="text-white">+42%</strong> this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
