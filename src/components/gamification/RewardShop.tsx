import React from 'react';
import { Sparkles, ShoppingBag, Check, Palette, Award } from 'lucide-react';
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
    <div className="flex flex-col w-full gap-6 select-none max-w-5xl mx-auto">
      {/* Top Banner & Wallet */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <h1 className="font-headline-md text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                Focus-Hour Reward Shop & Badges
              </h1>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Exchange verified deep work minutes for custom interface aesthetic themes, neural sound packs, and community status badges.
            </p>
          </div>

          <div className="px-5 py-3 rounded-2xl clay-inset flex items-center gap-3 self-start sm:self-auto">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <div>
              <span className="font-telemetry-sm text-[10px] text-slate-500 font-bold uppercase block">Points Bank</span>
              <span className="font-telemetry-lg text-lg font-black text-slate-900 dark:text-slate-100">
                {focusPoints.toLocaleString()} <span className="text-orange-600 dark:text-orange-400 text-xs">FP</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Themes Catalogue */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Unlockable Interface Themes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shopThemes.map(theme => {
            const isUnlocked = unlockedThemes.includes(theme.id);
            const isActive = activeTheme === theme.id;
            return (
              <div
                key={theme.id}
                className={`clay-card rounded-3xl p-5 flex flex-col justify-between border transition-all ${
                  isActive
                    ? 'ring-2 ring-orange-500 border-orange-500/50'
                    : 'border-white/80 dark:border-white/5'
                }`}
              >
                <div>
                  <div
                    className={`w-full h-20 rounded-2xl mb-4 bg-gradient-to-tr ${theme.previewGradient} shadow-md relative flex items-end p-2.5`}
                  >
                    {isActive && (
                      <span className="font-telemetry-sm px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-sm">
                        Equipped
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline-sm text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1">
                    {theme.name}
                  </h3>
                  <p className="font-body-md text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2 font-medium">
                    {theme.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-telemetry-sm text-xs text-slate-800 dark:text-slate-200 font-extrabold">
                    {theme.price === 0 ? 'Free' : `${theme.price} FP`}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleAction(theme)}
                    className={`px-3.5 py-1.5 rounded-2xl font-telemetry-sm text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'clay-pill text-slate-400 cursor-default'
                        : isUnlocked
                        ? 'clay-btn-indigo text-white'
                        : focusPoints >= theme.price
                        ? 'clay-btn-primary text-white'
                        : 'clay-pill text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {isActive ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
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
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Focus Milestone Badges
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl clay-card-subtle border flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'border-white/80 dark:border-white/5'
                  : 'opacity-50'
              }`}
            >
              <div className="text-2xl p-2.5 rounded-2xl clay-pill flex-shrink-0">
                {b.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline-sm text-xs font-extrabold text-slate-900 dark:text-slate-100">{b.title}</h3>
                  {b.unlocked && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="font-body-md text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

