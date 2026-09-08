import React, { useState, useMemo } from 'react';
import {
  Flame,
  Shield,
  Grid2X2,
  Check,
  Plus,
  Zap,
  Target,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { useTask } from '../../context/TaskContext';
import { HeatmapDay } from '../../types';
import { formatLocalDate } from '../../utils/streakTelemetry';

interface HabitItem {
  id: string;
  name: string;
  category: string;
  streak: number;
  daysCompleted: boolean[]; // Mon - Sun (7 days)
}

export const StreakHeatmap: React.FC = () => {
  const { heatmapDays, streak, streakFreezes, useStreakFreeze, recordFocusSession } = useGamification();
  const { tasks, toggleTaskComplete, addTask } = useTask();

  const todayStr = formatLocalDate(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const selectedDay: HeatmapDay = useMemo(() => {
    return (
      heatmapDays.find(d => d.date === selectedDate) ||
      heatmapDays.find(d => d.date === todayStr) ||
      heatmapDays[heatmapDays.length - 1] ||
      { date: todayStr, count: 0, level: 0 }
    );
  }, [heatmapDays, selectedDate, todayStr]);

  // Quick task addition in Eisenhower Matrix
  const [newQuadrantTask, setNewQuadrantTask] = useState<{ [key: string]: string }>({});
  const [activeInputQ, setActiveInputQ] = useState<string | null>(null);

  // Clean initial habit list for the Claymorphic Habit Matrix (persisted in localStorage)
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('procastinot_habits');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return [
      { id: 'h1', name: '50m Deep Algorithmic Focus', category: 'Cognitive', streak: 0, daysCompleted: [false, false, false, false, false, false, false] },
      { id: 'h2', name: '40Hz Binaural Entrainment', category: 'Focus', streak: 0, daysCompleted: [false, false, false, false, false, false, false] },
      { id: 'h3', name: 'Review Spaced Repetition Cards', category: 'Study', streak: 0, daysCompleted: [false, false, false, false, false, false, false] },
      { id: 'h4', name: 'Clean Code & Git Commits', category: 'Dev', streak: 0, daysCompleted: [false, false, false, false, false, false, false] },
    ];
  });

  const [newHabitName, setNewHabitName] = useState<string>('');
  const [showAddHabit, setShowAddHabit] = useState<boolean>(false);

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50';
      case 1:
        return 'bg-orange-200 dark:bg-orange-950/70 border-orange-300 dark:border-orange-800/60';
      case 2:
        return 'bg-orange-300 dark:bg-orange-800/80 border-orange-400 dark:border-orange-700/70';
      case 3:
        return 'bg-orange-400 dark:bg-orange-600 border-orange-500 dark:border-orange-500/80';
      case 4:
      default:
        return 'bg-orange-500 dark:bg-orange-500 border-orange-600 dark:border-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]';
    }
  };

  const handleAddQuadrantTask = (quadrant: string) => {
    const title = newQuadrantTask[quadrant]?.trim();
    if (!title) return;
    const isUrgent = quadrant === 'q1' || quadrant === 'q3';
    const isImportant = quadrant === 'q1' || quadrant === 'q2';
    addTask({
      title,
      description: `Added via Eisenhower Matrix (${quadrant.toUpperCase()})`,
      course: 'General Focus',
      energy: isImportant ? 'deep_focus' : 'medium',
      difficulty: isImportant ? 'hard' : 'medium',
      estimatedMinutes: 25,
      dueDate: new Date().toISOString(),
      tags: [quadrant.toUpperCase(), isUrgent ? 'urgent' : 'planned'],
      examRelated: isUrgent && isImportant,
    });
    setNewQuadrantTask(prev => ({ ...prev, [quadrant]: '' }));
    setActiveInputQ(null);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit: HabitItem = {
      id: `h_${Date.now()}`,
      name: newHabitName.trim(),
      category: 'Focus',
      streak: 0,
      daysCompleted: [false, false, false, false, false, false, false],
    };
    setHabits(prev => {
      const updated = [newHabit, ...prev];
      try {
        localStorage.setItem('procastinot_habits', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setNewHabitName('');
    setShowAddHabit(false);
  };

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id === habitId) {
          const updatedDays = [...h.daysCompleted];
          updatedDays[dayIndex] = !updatedDays[dayIndex];
          const completedCount = updatedDays.filter(Boolean).length;
          return { ...h, daysCompleted: updatedDays, streak: completedCount };
        }
        return h;
      });
      try {
        localStorage.setItem('procastinot_habits', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Organize heatmapDays into real GitHub-style columns (weeks of 7 days)
  const { weeks, monthLabels } = useMemo(() => {
    const cols: HeatmapDay[][] = [];
    const labels: { label: string; colIndex: number }[] = [];
    let lastMonth = '';

    for (let i = 0; i < heatmapDays.length; i += 7) {
      const week = heatmapDays.slice(i, i + 7);
      const colIdx = cols.length;
      cols.push(week);

      if (week.length > 0) {
        const d = new Date(week[0].date);
        const monthName = d.toLocaleString('default', { month: 'short' });
        if (monthName !== lastMonth) {
          labels.push({ label: monthName, colIndex: colIdx });
          lastMonth = monthName;
        }
      }
    }

    return { weeks: cols, monthLabels: labels };
  }, [heatmapDays]);

  return (
    <div className="flex flex-col w-full gap-6 select-none max-w-5xl mx-auto">
      {/* SECTION 1: TOP BANNER & REAL GITHUB-STYLE 7-DAY CONSISTENCY HEATMAP */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              <h1 className="font-headline-md text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                Cognitive Consistency & Eisenhower Matrix
              </h1>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Verified daily study output telemetry with interactive calendar grid and 2x2 priority matrix.
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

        {/* 6-MONTH TRUE GITHUB/CODEFORCES CALENDAR HEATMAP */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between font-telemetry-sm text-xs mb-3">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Verified Focus Heatmap (26 Weeks • Mon-Sun)</span>
            </span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">
              {streak} Days Active Unbroken
            </span>
          </div>

          {/* Interactive Scrollable Calendar Matrix */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[640px] clay-inset p-4 rounded-2xl">
              {/* Month Header Track */}
              <div className="flex mb-2 text-[10px] font-telemetry-sm text-slate-400 pl-8 relative h-4">
                {monthLabels.map((m, idx) => (
                  <span
                    key={idx}
                    className="absolute font-bold"
                    style={{ left: `${m.colIndex * 19 + 32}px` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>

              {/* Day Labels + Week Columns Grid */}
              <div className="flex gap-1.5 items-start">
                {/* Left Day Labels (Mon, Wed, Fri) */}
                <div className="flex flex-col justify-between h-[112px] text-[9px] font-telemetry-sm text-slate-400 pr-1 py-0.5 select-none">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                {/* Columns of 7 Days */}
                <div className="flex gap-1">
                  {weeks.map((week, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-1">
                      {week.map((day, rowIdx) => {
                        const isSelected = selectedDay.date === day.date;
                        return (
                          <button
                            key={rowIdx}
                            type="button"
                            onClick={() => setSelectedDate(day.date)}
                            onTouchStart={() => setSelectedDate(day.date)}
                            title={`${day.date}: ${day.count} mins focus`}
                            className={`w-3.5 h-3.5 rounded-xs border transition-all cursor-pointer ${
                              isSelected ? 'ring-2 ring-orange-500 scale-125 z-10' : 'hover:scale-125'
                            } ${getIntensityClass(day.level)}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-4 font-telemetry-sm text-xs text-slate-500">
                <span className="text-[11px]">Click or tap any square to inspect session telemetry</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">Less</span>
                  <span className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                  <span className="w-3 h-3 rounded-xs bg-orange-200 dark:bg-orange-950/60" />
                  <span className="w-3 h-3 rounded-xs bg-orange-300 dark:bg-orange-800" />
                  <span className="w-3 h-3 rounded-xs bg-orange-400 dark:bg-orange-600" />
                  <span className="w-3 h-3 rounded-xs bg-orange-500 dark:bg-orange-500 shadow-[0_0_6px_rgba(234,88,12,0.6)]" />
                  <span className="text-[10px]">More (3h+)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Day Inspector Telemetry Card */}
          <div className="mt-4 clay-card-subtle p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200/80 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl clay-pill flex items-center justify-center text-orange-500 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-telemetry-sm text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                    Intensity Level {selectedDay.level}/4
                  </span>
                </div>
                <p className="font-body-md text-xs text-slate-500 mt-0.5">
                  {selectedDay.count > 0
                    ? `Logged ${selectedDay.count} focus minutes (${Math.floor(selectedDay.count / 60)}h ${selectedDay.count % 60}m) in high-alpha study states.`
                    : 'Rest day or metabolic recharge cycle with no verified timer intervals.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {selectedDay.count > 0 ? (
                <div className="flex items-center gap-1.5 font-telemetry-sm text-xs font-bold text-emerald-600 dark:text-emerald-400 mr-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Proof</span>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => recordFocusSession(25, selectedDay.date)}
                className="px-3 py-1.5 rounded-xl clay-btn-primary text-white text-xs font-telemetry-sm font-bold cursor-pointer hover:opacity-90"
                title={`Log 25m focus sprint for ${selectedDay.date}`}
              >
                +25m Focus
              </button>
              <button
                type="button"
                onClick={() => recordFocusSession(50, selectedDay.date)}
                className="px-3 py-1.5 rounded-xl clay-btn-light text-slate-700 dark:text-slate-300 text-xs font-telemetry-sm font-bold cursor-pointer"
                title={`Log 50m deep work block for ${selectedDay.date}`}
              >
                +50m Deep
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SWAPPED TO PRIMARY POSITION - EISENHOWER 2X2 DECISION MATRIX */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Grid2X2 className="w-6 h-6 text-indigo-500" />
              <h2 className="font-headline-md text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Eisenhower 2x2 Decision Matrix
              </h2>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Organize academic sprints by Urgency vs. Importance. Tasks completed sink below automatically.
            </p>
          </div>
          <span className="font-telemetry-sm text-xs px-3 py-1.5 rounded-full clay-pill text-indigo-600 dark:text-indigo-400 font-extrabold self-start sm:self-auto">
            Dynamic Quadrant Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quadrant 1: Urgent & Important (Do First) */}
          <div className="clay-card-subtle rounded-3xl p-5 border-l-4 border-orange-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span className="font-headline-sm text-sm font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                    Q1: DO FIRST (Urgent & Important)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveInputQ(activeInputQ === 'q1' ? null : 'q1')}
                  className="p-1.5 rounded-xl clay-btn-light text-orange-600 text-xs font-bold cursor-pointer"
                  title="Add task to Q1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeInputQ === 'q1' && (
                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter urgent & important task..."
                    value={newQuadrantTask.q1 || ''}
                    onChange={e => setNewQuadrantTask(prev => ({ ...prev, q1: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAddQuadrantTask('q1')}
                    className="flex-1 clay-inset rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddQuadrantTask('q1')}
                    className="px-3 py-1.5 rounded-xl clay-btn-primary text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {tasks
                  .filter(t => !t.completed && (t.examRelated || t.energy === 'deep_focus'))
                  .slice(0, 4)
                  .map(t => (
                    <div key={t.id} className="p-3 rounded-2xl clay-inset flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">
                          {t.title}
                        </span>
                        <span className="font-telemetry-sm text-[10px] text-orange-600 dark:text-orange-400 font-bold">
                          {t.course} • {t.estimatedMinutes}m sprint
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTaskComplete(t.id)}
                        className="px-2.5 py-1 rounded-lg clay-btn-primary text-white font-telemetry-sm text-[10px] font-extrabold cursor-pointer flex-shrink-0"
                      >
                        Done
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 font-telemetry-sm text-[11px] text-slate-500">
              Exam runway sprints, live problem sets, and urgent project deliverables.
            </div>
          </div>

          {/* Quadrant 2: Important & Not Urgent (Schedule) */}
          <div className="clay-card-subtle rounded-3xl p-5 border-l-4 border-emerald-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  <span className="font-headline-sm text-sm font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    Q2: SCHEDULE (Important, Not Urgent)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveInputQ(activeInputQ === 'q2' ? null : 'q2')}
                  className="p-1.5 rounded-xl clay-btn-light text-emerald-600 text-xs font-bold cursor-pointer"
                  title="Add task to Q2"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeInputQ === 'q2' && (
                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter strategic study goal..."
                    value={newQuadrantTask.q2 || ''}
                    onChange={e => setNewQuadrantTask(prev => ({ ...prev, q2: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAddQuadrantTask('q2')}
                    className="flex-1 clay-inset rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddQuadrantTask('q2')}
                    className="px-3 py-1.5 rounded-xl clay-btn-primary text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {tasks
                  .filter(t => !t.completed && t.energy === 'medium' && !t.examRelated)
                  .slice(0, 4)
                  .map(t => (
                    <div key={t.id} className="p-3 rounded-2xl clay-inset flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">
                          {t.title}
                        </span>
                        <span className="font-telemetry-sm text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {t.course} • {t.estimatedMinutes}m sprint
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTaskComplete(t.id)}
                        className="px-2.5 py-1 rounded-lg clay-btn-light text-emerald-600 font-telemetry-sm text-[10px] font-extrabold cursor-pointer flex-shrink-0"
                      >
                        Done
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 font-telemetry-sm text-[11px] text-slate-500">
              Spaced repetition, concept review, skill acquisition, and long-term research.
            </div>
          </div>

          {/* Quadrant 3: Urgent & Not Important (Delegate / Batch) */}
          <div className="clay-card-subtle rounded-3xl p-5 border-l-4 border-indigo-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span className="font-headline-sm text-sm font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    Q3: DELEGATE / BATCH (Urgent, Low Impact)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveInputQ(activeInputQ === 'q3' ? null : 'q3')}
                  className="p-1.5 rounded-xl clay-btn-light text-indigo-600 text-xs font-bold cursor-pointer"
                  title="Add task to Q3"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {activeInputQ === 'q3' && (
                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter administrative task..."
                    value={newQuadrantTask.q3 || ''}
                    onChange={e => setNewQuadrantTask(prev => ({ ...prev, q3: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAddQuadrantTask('q3')}
                    className="flex-1 clay-inset rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddQuadrantTask('q3')}
                    className="px-3 py-1.5 rounded-xl clay-btn-primary text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {tasks
                  .filter(t => !t.completed && t.energy === 'low')
                  .slice(0, 3)
                  .map(t => (
                    <div key={t.id} className="p-3 rounded-2xl clay-inset flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-slate-100 truncate block">
                          {t.title}
                        </span>
                        <span className="font-telemetry-sm text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                          {t.course} • Administrative
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTaskComplete(t.id)}
                        className="px-2.5 py-1 rounded-lg clay-btn-light text-indigo-600 font-telemetry-sm text-[10px] font-extrabold cursor-pointer flex-shrink-0"
                      >
                        Done
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 font-telemetry-sm text-[11px] text-slate-500">
              Department emails, canvas upload notifications, and peer scheduling syncs.
            </div>
          </div>

          {/* Quadrant 4: Not Urgent & Not Important (Eliminate) */}
          <div className="clay-card-subtle rounded-3xl p-5 border-l-4 border-slate-400 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-slate-500" />
                  <span className="font-headline-sm text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Q4: ELIMINATE (Distractions & Time Sinks)
                  </span>
                </div>
              </div>
              <div className="p-4 rounded-2xl clay-inset space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Social Doom-Scrolling</span>
                  <span className="text-orange-500">Auto-Blocked</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Low-leverage browsing</span>
                  <span className="text-orange-500">Arrested</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Passive video rabbit holes</span>
                  <span className="text-orange-500">10s Box Breath</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 font-telemetry-sm text-[11px] text-slate-500">
              Filtered through Anti-Distraction Shield with 10-second Second Thought friction modal.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: TACTILE HABIT CHECK-IN MATRIX (SWAPPED BELOW EISENHOWER) */}
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
    </div>
  );
};

