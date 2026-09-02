import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Grid2X2,
  Check,
  Plus,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useTask } from '../../context/TaskContext';
import { HeatmapDay } from '../../types';

interface HabitItem {
  id: string;
  name: string;
  category: string;
  streak: number;
  daysCompleted: boolean[]; // Mon - Sun (7 days)
}

export const StreakHeatmap: React.FC = () => {
  const { heatmapDays, streak, streakFreezes, useStreakFreeze } = useGamification();
  const { tasks, toggleTaskComplete } = useTask();
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Mock initial habit list for the Claymorphic Habit Matrix
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: 'h1', name: '50m Deep Algorithmic Focus', category: 'Cognitive', streak: 14, daysCompleted: [true, true, true, true, true, true, false] },
    { id: 'h2', name: '40Hz Binaural Entrainment', category: 'Focus', streak: 9, daysCompleted: [true, true, true, true, false, true, true] },
    { id: 'h3', name: 'Review Spaced Repetition Cards', category: 'Study', streak: 21, daysCompleted: [true, true, true, true, true, true, true] },
    { id: 'h4', name: 'Clean Code & Git Commits', category: 'Dev', streak: 5, daysCompleted: [true, false, true, true, true, false, false] },
  ]);

  const [newHabitName, setNewHabitName] = useState<string>('');
  const [showAddHabit, setShowAddHabit] = useState<boolean>(false);

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const newDays = [...h.daysCompleted];
        newDays[dayIndex] = !newDays[dayIndex];
        const newStreak = newDays[dayIndex] ? h.streak + 1 : Math.max(0, h.streak - 1);
        return { ...h, daysCompleted: newDays, streak: newStreak };
      })
    );
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits(prev => [
      ...prev,
      {
        id: `h_${Date.now()}`,
        name: newHabitName.trim(),
        category: 'Personal',
        streak: 1,
        daysCompleted: [true, false, false, false, false, false, false],
      },
    ]);
    setNewHabitName('');
    setShowAddHabit(false);
  };

  const getIntensityClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 1:
        return 'bg-orange-200 dark:bg-orange-950/40 border-orange-300 dark:border-orange-900/40';
      case 2:
        return 'bg-orange-300 dark:bg-orange-800 border-orange-400 dark:border-orange-700';
      case 3:
        return 'bg-orange-400 dark:bg-orange-600 border-orange-500 dark:border-orange-500';
      case 4:
        return 'bg-orange-500 dark:bg-orange-500 border-orange-600 dark:border-orange-400 shadow-[0_0_8px_rgba(234,88,12,0.6)]';
      default:
        return 'bg-slate-200 dark:bg-slate-800/50 border-transparent';
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 select-none max-w-5xl mx-auto">
      {/* Top Banner & Streak Counters */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              <h1 className="font-headline-md text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                Habits & Eisenhower Matrix
              </h1>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Tactile habit tracking console with daily check-in pills and 2x2 priority matrix alignment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-pill bg-white dark:bg-[#1f2537]">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="font-telemetry-md text-sm font-extrabold text-orange-600 dark:text-orange-400">
                {streak} Day Streak
              </span>
            </div>

            <button
              type="button"
              onClick={useStreakFreeze}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl clay-btn-light text-slate-700 dark:text-slate-300 font-telemetry-sm text-xs font-bold cursor-pointer"
            >
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>{streakFreezes} Freezes</span>
            </button>
          </div>
        </div>

        {/* HEATMAP CONSISTENCY BAR */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between font-telemetry-sm text-xs mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              6-Month Verified Focus Heatmap
            </span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">
              {streak} Days Active Unbroken
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[680px]">
              <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl clay-inset">
                {heatmapDays.map((day, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3.5 h-3.5 rounded-md border transition-all cursor-pointer hover:scale-125 ${getIntensityClass(
                      day.level
                    )}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 font-telemetry-sm text-xs text-slate-500">
                <span>Past Record</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-800" />
                  <span className="w-3 h-3 rounded-sm bg-orange-200 dark:bg-orange-950/40" />
                  <span className="w-3 h-3 rounded-sm bg-orange-300 dark:bg-orange-800" />
                  <span className="w-3 h-3 rounded-sm bg-orange-400 dark:bg-orange-600" />
                  <span className="w-3 h-3 rounded-sm bg-orange-500 dark:bg-orange-500" />
                  <span>More (3h+)</span>
                </div>
              </div>
            </div>
          </div>

          {hoveredDay && (
            <div className="mt-2 font-telemetry-sm text-xs text-slate-600 dark:text-slate-400 clay-inset p-2 rounded-xl text-center font-bold">
              {hoveredDay.date}: {hoveredDay.count} verified study minutes logged
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: CLAY HABIT MATRIX BOARD */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Tactile Habit Check-In Matrix
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAddHabit(prev => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl clay-btn-primary text-white font-headline-sm text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>

        {showAddHabit && (
          <form onSubmit={handleAddHabit} className="mb-5 p-4 rounded-2xl clay-inset flex items-center gap-3">
            <input
              type="text"
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              placeholder="e.g. Read 20 pages of Operating Systems book"
              className="flex-1 bg-transparent outline-none font-body-md text-sm text-slate-800 dark:text-slate-100 font-semibold"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl clay-btn-primary text-white font-headline-sm text-xs font-bold cursor-pointer"
            >
              Add Habit
            </button>
          </form>
        )}

        <div className="flex flex-col gap-3">
          {habits.map(habit => (
            <div
              key={habit.id}
              className="clay-card-subtle p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/60 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl clay-pill flex items-center justify-center text-orange-500 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-sm font-bold text-slate-900 dark:text-slate-100">
                    {habit.name}
                  </h3>
                  <div className="flex items-center gap-2 font-telemetry-sm text-xs text-slate-500">
                    <span>{habit.category}</span>
                    <span>•</span>
                    <span className="text-orange-600 dark:text-orange-400 font-extrabold">
                      {habit.streak} Day Streak
                    </span>
                  </div>
                </div>
              </div>

              {/* Mon - Sun Check-In Pills */}
              <div className="flex items-center gap-2">
                {daysOfWeek.map((dayLabel, idx) => {
                  const isDone = habit.daysCompleted[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleHabitDay(habit.id, idx)}
                      className={`flex flex-col items-center justify-center w-8 h-11 rounded-xl transition-all cursor-pointer ${
                        isDone
                          ? 'clay-btn-primary text-white shadow-md'
                          : 'clay-pill text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="font-telemetry-sm text-[9px] font-bold opacity-80 mb-0.5">{dayLabel}</span>
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: EISENHOWER 2X2 PRIORITY MATRIX GRID */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Grid2X2 className="w-5 h-5 text-indigo-500" />
            <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Eisenhower 2x2 Decision Matrix
            </h2>
          </div>
          <span className="font-telemetry-sm text-xs text-slate-500 font-bold">
            Urgent vs Important Priority Map
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quadrant 1: Urgent & Important (Do First) */}
          <div className="clay-card-subtle rounded-2xl p-5 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline-sm text-sm font-extrabold text-orange-600 dark:text-orange-400 uppercase">
                Q1: DO FIRST (Urgent & Important)
              </span>
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex flex-col gap-2">
              {tasks.filter(t => !t.completed && t.energy === 'deep_focus').slice(0, 3).map(t => (
                <div key={t.id} className="p-3 rounded-xl clay-inset flex items-center justify-between">
                  <span className="font-headline-sm text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {t.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleTaskComplete(t.id)}
                    className="font-telemetry-sm text-[10px] font-extrabold text-orange-500 hover:underline cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 2: Important & Not Urgent (Schedule) */}
          <div className="clay-card-subtle rounded-2xl p-5 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline-sm text-sm font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                Q2: SCHEDULE (Important & Not Urgent)
              </span>
              <Target className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              {tasks.filter(t => !t.completed && t.energy === 'medium').slice(0, 3).map(t => (
                <div key={t.id} className="p-3 rounded-xl clay-inset flex items-center justify-between">
                  <span className="font-headline-sm text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {t.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleTaskComplete(t.id)}
                    className="font-telemetry-sm text-[10px] font-extrabold text-emerald-500 hover:underline cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 3: Urgent & Not Important (Delegate) */}
          <div className="clay-card-subtle rounded-2xl p-5 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline-sm text-sm font-extrabold text-indigo-600 dark:text-indigo-400 uppercase">
                Q3: DELEGATE (Urgent & Not Important)
              </span>
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex flex-col gap-2">
              {tasks.filter(t => !t.completed && t.energy === 'low').slice(0, 2).map(t => (
                <div key={t.id} className="p-3 rounded-xl clay-inset flex items-center justify-between">
                  <span className="font-headline-sm text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {t.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleTaskComplete(t.id)}
                    className="font-telemetry-sm text-[10px] font-extrabold text-indigo-500 hover:underline cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 4: Not Urgent & Not Important (Eliminate) */}
          <div className="clay-card-subtle rounded-2xl p-5 border-l-4 border-slate-400">
            <div className="flex items-center justify-between mb-3">
              <span className="font-headline-sm text-sm font-extrabold text-slate-600 dark:text-slate-400 uppercase">
                Q4: ELIMINATE (Neither)
              </span>
              <Shield className="w-4 h-4 text-slate-400" />
            </div>
            <div className="p-3 rounded-xl clay-inset text-xs font-body-md text-slate-500 font-medium">
              Eliminate unnecessary distractions, unneeded administrative clutter, and time sinks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

