import React, { useState } from 'react';
import { Flame, Shield, Award, Calendar, ChevronRight } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { HeatmapDay } from '../../types';

export const StreakHeatmap: React.FC = () => {
  const { heatmapDays, streak, streakFreezes, useStreakFreeze } = useGamification();
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  const getIntensityClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 1:
        return 'bg-violet-950/80 border-violet-900/60';
      case 2:
        return 'bg-violet-800 border-violet-700';
      case 3:
        return 'bg-violet-600 border-violet-500';
      case 4:
        return 'bg-violet-400 border-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.5)]';
      default:
        return 'bg-[#15161b] border-white/5';
    }
  };

  const handleUseFreeze = () => {
    const success = useStreakFreeze();
    if (success) {
      alert('Streak Freeze activated! Your streak is safely preserved for today.');
    } else {
      alert('No streak freezes remaining.');
    }
  };

  return (
    <div className="stitch-card rounded-2xl p-6 border-white/10 space-y-6">
      {/* Header & Streak Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500/20" />
            <h2 className="text-xl font-bold text-white">Daily Consistency & Streak Matrix</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            GitHub / Codeforces-style study heatmap tracking verified deep work minutes and unbroken habits.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span className="text-xs font-bold font-mono">{streak} Day Streak</span>
          </div>

          <button
            type="button"
            onClick={handleUseFreeze}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
            title="Use streak freeze shield"
          >
            <Shield className="w-4 h-4" />
            <span>{streakFreezes} Freezes</span>
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[680px]">
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#121316] border border-white/5">
            {heatmapDays.map((day, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 rounded-sm border transition-all cursor-pointer hover:scale-125 hover:z-10 ${getIntensityClass(
                  day.level
                )}`}
              />
            ))}
          </div>

          {/* Scale Legend */}
          <div className="flex items-center justify-between mt-3 text-xs text-neutral-400 font-mono">
            <span>Past 6 Months Study Record</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <span className="w-3 h-3 rounded-sm bg-[#15161b] border border-white/5" />
              <span className="w-3 h-3 rounded-sm bg-violet-950/80 border border-violet-900/60" />
              <span className="w-3 h-3 rounded-sm bg-violet-800 border border-violet-700" />
              <span className="w-3 h-3 rounded-sm bg-violet-600 border border-violet-500" />
              <span className="w-3 h-3 rounded-sm bg-violet-400 border border-violet-300" />
              <span>More (3h+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip detail bar */}
      <div className="min-h-[28px] text-xs font-mono text-neutral-300 bg-[#121316] px-4 py-2 rounded-xl border border-white/5 flex items-center justify-between">
        {hoveredDay ? (
          <>
            <span className="text-violet-300">{hoveredDay.date}</span>
            <span>
              {hoveredDay.count > 0
                ? `${hoveredDay.count} verified study minutes logged`
                : 'Zero study minutes (Rest day)'}
            </span>
          </>
        ) : (
          <span className="text-neutral-500">
            Hover over any day square to inspect logged focus duration and sprint volume.
          </span>
        )}
      </div>
    </div>
  );
};
