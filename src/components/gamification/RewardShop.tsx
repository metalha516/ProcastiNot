import React from 'react';
import { Sparkles, ShoppingBag, Check, Palette, Award, Shield, Zap } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { shopThemes } from '../../data/mockData';
import { ShopTheme } from '../../types';

export const RewardShop: React.FC = () => {
  const { focusPoints, activeTheme, unlockedThemes, buyTheme, equipTheme } = useGamification();

  const handleAction = (theme: ShopTheme) => {
    if (unlockedThemes.includes(theme.id)) {
      equipTheme(theme.id);
    } else {
      const ok = buyTheme(theme);
      if (!ok) {
        alert('Insufficient Focus Points! Complete more verified focus sprints without distraction interceptions to earn FP.');
      }
    }
  };

  const badges = [
    {
      id: 'b_1',
      title: '40 Hz Neural Architect',
      desc: 'Completed 10+ hours with Gamma Wave entrainment active.',
      unlocked: true,
      icon: '🧠',
    },
    {
      id: 'b_2',
      title: 'Doom-Scroll Slayer',
      desc: 'Resisted 25 consecutive Second-Thought friction interventions.',
      unlocked: true,
      icon: '🛡️',
    },
    {
      id: 'b_3',
      title: 'Circadian Peak Synchronizer',
      desc: 'Finished 5 deep work blocks during designated biological peak windows.',
      unlocked: true,
      icon: '⚡',
    },
    {
      id: 'b_4',
      title: 'Codeforces Grandmaster Sprint',
      desc: 'Logged 4 consecutive 90-minute Ultra Flow algorithm blocks.',
      unlocked: false,
      icon: '🏆',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Wallet */}
      <div className="stitch-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-violet-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Focus-Hour Reward Shop & Badges
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Exchange verified deep work minutes for custom interface aesthetic themes, neural sound packs, and community status badges.
            </p>
          </div>

          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-violet-500/30 flex items-center gap-2.5 self-start sm:self-auto">
            <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Wallet Balance</span>
              <span className="text-lg font-bold font-mono text-white">
                {focusPoints.toLocaleString()} <span className="text-cyan-400 text-xs">FP</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Themes Catalogue */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-violet-400" />
          <h2 className="text-base font-bold text-white">Unlockable Interface Themes</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shopThemes.map(theme => {
            const isUnlocked = unlockedThemes.includes(theme.id);
            const isActive = activeTheme === theme.id;
            return (
              <div
                key={theme.id}
                className={`stitch-card rounded-2xl p-5 flex flex-col justify-between border transition-all ${
                  isActive
                    ? 'border-violet-500 ring-2 ring-violet-500/20 bg-[#1e2028]'
                    : 'border-white/5'
                }`}
              >
                <div>
                  {/* Theme Gradient Preview */}
                  <div
                    className={`w-full h-20 rounded-xl mb-4 bg-gradient-to-tr ${theme.previewGradient} shadow-md relative flex items-end p-2.5`}
                  >
                    {isActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm border border-white/20">
                        Equipped
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{theme.name}</h3>
                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed line-clamp-2">
                    {theme.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-300 font-bold">
                    {theme.price === 0 ? 'Free' : `${theme.price} FP`}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAction(theme)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-neutral-800 text-neutral-400 cursor-default'
                        : isUnlocked
                        ? 'bg-violet-600 hover:bg-violet-500 text-white'
                        : focusPoints >= theme.price
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                        : 'bg-neutral-800 text-neutral-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isActive ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Active
                      </span>
                    ) : isUnlocked ? (
                      'Equip'
                    ) : (
                      `Unlock (${theme.price} FP)`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Badges Showcase */}
      <div className="stitch-card rounded-2xl p-6 border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-bold text-white">Focus Milestone Badges</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'bg-[#121316] border-white/10'
                  : 'bg-[#121316]/40 border-white/5 opacity-50'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-white/5 border border-white/5 flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">{b.title}</h3>
                  {b.unlocked && <Check className="w-3 h-3 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
