import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Play,
  ExternalLink,
  PieChart,
  Activity,
  Download,
  Copy,
  Check,
  Globe,
  Laptop,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useTimer } from '../../context/TimerContext';

export const DistractionBlocker: React.FC = () => {
  const { blockedDomains, addBlockedDomain, removeBlockedDomain, triggerInterception } = useGamification();
  const { isRunning, mode } = useTimer();

  const [newDomain, setNewDomain] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'social' | 'video' | 'gaming' | 'news'>('social');
  const [customTestUrl, setCustomTestUrl] = useState<string>('https://instagram.com');
  const [activeSuiteTab, setActiveSuiteTab] = useState<'extension' | 'userscript' | 'hosts'>('extension');
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const totalAttempts = blockedDomains.reduce((acc, b) => acc + b.attemptsToday, 0);
  const totalMinutesSaved = blockedDomains.reduce((acc, b) => acc + b.minutesSaved, 0);

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    addBlockedDomain(newDomain.trim(), newDomain.trim(), newCategory);
    setNewDomain('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(id);
    setTimeout(() => setCopiedState(null), 2500);
  };

  const hostsConfig = `# ProcastiNot Focus Shield System Hosts Rules
0.0.0.0 instagram.com www.instagram.com
0.0.0.0 tiktok.com www.tiktok.com
0.0.0.0 twitter.com www.twitter.com x.com www.x.com
0.0.0.0 reddit.com www.reddit.com
0.0.0.0 facebook.com www.facebook.com
0.0.0.0 twitch.tv www.twitch.tv
0.0.0.0 netflix.com www.netflix.com
0.0.0.0 threads.net www.threads.net`;

  const userscriptCode = `// ==UserScript==
// @name         ProcastiNot Distraction Shield & Interceptor
// @namespace    https://procastinot.app/
// @version      1.2
// @description  Intercepts social media visits across all tabs and routes to ProcastiNot 10s mindfulness challenge.
// @match        *://*.instagram.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.reddit.com/*
// @match        *://*.facebook.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.netflix.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  const domain = window.location.hostname.replace(/^(www|m)\\./, '');
  window.stop();
  window.location.replace('${typeof window !== 'undefined' ? window.location.origin : 'https://procastinot-nine.vercel.app'}/?blocked=' + encodeURIComponent(domain));
})();`;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Banner & Status */}
      <div className="clay-card rounded-3xl p-4 sm:p-6 relative overflow-hidden border border-slate-200/80 dark:border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className={`p-2.5 sm:p-3.5 rounded-2xl clay-pill border transition-colors shrink-0 ${
              isRunning && mode === 'focus'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {isRunning && mode === 'focus' ? (
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
              ) : (
                <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  Anti-Distraction Shield & Browser Interceptor
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider clay-pill whitespace-nowrap shrink-0 ${
                  isRunning && mode === 'focus'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {isRunning && mode === 'focus' ? 'Active Focus Guard' : 'Shield Standing By'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Global browser-level link interception that arrests dopamine reflex loops before they disrupt working memory.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-around sm:justify-center gap-2 clay-inset p-2 rounded-2xl self-start sm:self-auto shrink-0 w-full sm:w-auto">
            <div className="px-3 py-1 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Resisted</span>
              <span className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400 font-telemetry-sm">{totalAttempts}</span>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-white/10" />
            <div className="px-3 py-1 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Saved</span>
              <span className="text-base sm:text-lg font-bold text-indigo-600 dark:text-cyan-400 font-telemetry-sm">{Math.round(totalMinutesSaved / 60 * 10) / 10}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Browser Link Interceptor Testbed */}
      <div className="clay-card rounded-3xl p-4 sm:p-6 border border-orange-500/20 bg-gradient-to-r from-orange-50/60 via-white to-amber-50/60 dark:from-violet-950/20 dark:via-[#191a1f] dark:to-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <Globe className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              Live Browser Link Interceptor (Click to Test Real Links)
            </h2>
          </div>
          <span className="self-start sm:self-auto text-[11px] sm:text-xs text-orange-600 dark:text-orange-400 font-mono clay-pill px-2.5 py-1 rounded-full font-bold whitespace-nowrap shrink-0">
            Real Link Capture Active
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          The shield listens to all browser links in real-time. Click any real social media link below or test a custom URL. The browser navigation is automatically intercepted and halted to present the 10-second Second-Thought Mindfulness Gate:
        </p>

        {/* Real Anchor Links That Trigger Interception */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: 'Instagram', url: 'https://instagram.com' },
              { name: 'TikTok', url: 'https://tiktok.com' },
              { name: 'X / Twitter', url: 'https://x.com' },
              { name: 'Reddit', url: 'https://reddit.com' },
              { name: 'YouTube Shorts', url: 'https://youtube.com' },
              { name: 'Facebook', url: 'https://facebook.com' },
              { name: 'Twitch', url: 'https://twitch.tv' },
              { name: 'Netflix', url: 'https://netflix.com' },
            ].map(site => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl clay-btn-light text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-amber-400 transition-all cursor-pointer shadow-sm active:scale-95 sm:hover:scale-105"
                title={`Click real link to ${site.url} to test browser intercept`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-orange-500" />
                <span>Open {site.name}</span>
              </a>
            ))}
          </div>

          {/* Custom URL Input Form */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <input
              type="text"
              value={customTestUrl}
              onChange={e => setCustomTestUrl(e.target.value)}
              placeholder="e.g. https://instagram.com/p/example"
              className="clay-inset rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={() => {
                // Test both anchor click and window.open interception
                try {
                  const parsed = customTestUrl.startsWith('http') ? customTestUrl : `https://${customTestUrl}`;
                  window.open(parsed, '_blank');
                } catch {
                  triggerInterception(customTestUrl);
                }
              }}
              className="px-4 py-2 rounded-xl clay-btn-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Test Open URL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Browser-Wide Protection Suite (Chrome Extension, Userscript, Hosts) */}
      <div className="clay-card rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
            <Laptop className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                Browser-Wide System Protection Suite
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                Block social media when opening new tabs or typing URLs in Chrome, Edge, Brave, or Firefox.
              </p>
            </div>
          </div>

          {/* Suite Tabs */}
          <div className="flex items-center gap-1 clay-inset p-1 rounded-2xl self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSuiteTab('extension')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSuiteTab === 'extension'
                  ? 'clay-btn-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Chrome Extension
            </button>
            <button
              type="button"
              onClick={() => setActiveSuiteTab('userscript')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSuiteTab === 'userscript'
                  ? 'clay-btn-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Userscript
            </button>
            <button
              type="button"
              onClick={() => setActiveSuiteTab('hosts')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSuiteTab === 'hosts'
                  ? 'clay-btn-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              System Hosts
            </button>
          </div>
        </div>

        {/* Tab 1: Chrome Extension */}
        {activeSuiteTab === 'extension' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-indigo-900 dark:text-indigo-300">
                    Manifest V3 Browser Extension
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-200 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                    Ready to Install
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  Redirects any external tab navigating to social media directly into ProcastiNot's 10-second Second-Thought box-breathing intervention.
                </p>
              </div>

              <a
                href="/procastinot-browser-extension.zip"
                download="procastinot-browser-extension.zip"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl clay-btn-indigo text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer flex-shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Extension (.zip)</span>
              </a>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl clay-card-subtle flex flex-col gap-1">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold font-telemetry-sm text-xs">
                  1
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1">Extract Archive</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Unzip <code className="text-orange-600 dark:text-orange-400">procastinot-browser-extension.zip</code> to a local folder.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl clay-card-subtle flex flex-col gap-1">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold font-telemetry-sm text-xs">
                  2
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1">Open Extensions</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Navigate to <code className="text-indigo-600 dark:text-cyan-400">chrome://extensions</code> and toggle <strong>Developer Mode</strong> on.
                </span>
              </div>

              <div className="p-3.5 rounded-2xl clay-card-subtle flex flex-col gap-1">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold font-telemetry-sm text-xs">
                  3
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1">Load Unpacked</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Click <strong>Load unpacked</strong> and select the extracted extension folder. You're fully shielded!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Userscript (Tampermonkey) */}
        {activeSuiteTab === 'userscript' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                    Tampermonkey / Violentmonkey Userscript
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                    1-Click Setup
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  Works seamlessly on Chrome, Firefox, Edge, Safari, and Brave via Tampermonkey or Violentmonkey.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href="/procastinot-shield.user.js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl clay-btn-primary text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>1-Click Install Script</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(userscriptCode, 'userscript')}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl clay-btn-light text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {copiedState === 'userscript' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="clay-inset p-3 rounded-2xl overflow-x-auto text-[11px] font-mono text-slate-700 dark:text-slate-300 max-h-40">
              <pre>{userscriptCode}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: System Hosts */}
        {activeSuiteTab === 'hosts' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-sm text-amber-900 dark:text-amber-300">
                  Operating System Hosts File Filter
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                  Add these DNS loopback lines to <code className="font-mono">C:\Windows\System32\drivers\etc\hosts</code> (Windows) or <code className="font-mono">/etc/hosts</code> (macOS/Linux) for zero-latency OS-wide blockade.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(hostsConfig, 'hosts')}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl clay-btn-light text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex-shrink-0"
              >
                {copiedState === 'hosts' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Copied Hosts Rules!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Hosts Rules</span>
                  </>
                )}
              </button>
            </div>

            <div className="clay-inset p-3 rounded-2xl overflow-x-auto text-[11px] font-mono text-slate-700 dark:text-slate-300">
              <pre>{hostsConfig}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Blacklist Domains Management */}
        <div className="lg:col-span-2 clay-card rounded-3xl p-3.5 sm:p-6 border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Blocked Distraction Domains</h2>
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
              className="flex-1 min-w-0 clay-inset rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as any)}
              className="clay-inset rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none shrink-0"
            >
              <option value="social">Social Media</option>
              <option value="video">Video Streaming</option>
              <option value="gaming">Gaming</option>
              <option value="news">News / Gossip</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl clay-btn-primary text-white text-xs sm:text-sm font-bold cursor-pointer shrink-0"
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
                className="flex items-center justify-between p-2.5 sm:p-3.5 rounded-2xl clay-card-subtle transition-all gap-2 min-w-0 overflow-hidden"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl clay-pill flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase shrink-0">
                    {b.domain.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{b.name}</span>
                      <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-mono truncate">({b.domain})</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                      <span className="capitalize shrink-0">{b.category}</span>
                      <span className="shrink-0">•</span>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold shrink-0">{b.attemptsToday} intercepted</span>
                      <span className="shrink-0 hidden min-[360px]:inline">•</span>
                      <span className="text-indigo-600 dark:text-cyan-400 font-semibold shrink-0">~{b.minutesSaved}m saved</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-1">
                  <button
                    type="button"
                    onClick={() => triggerInterception(b.domain)}
                    className="p-1.5 sm:p-2 rounded-xl clay-btn-light text-slate-600 dark:text-slate-400 hover:text-orange-600 cursor-pointer shrink-0"
                    title="Simulate interception"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlockedDomain(b.id)}
                    className="p-1.5 sm:p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
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
        <div className="clay-card rounded-3xl p-3.5 sm:p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/5">
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
