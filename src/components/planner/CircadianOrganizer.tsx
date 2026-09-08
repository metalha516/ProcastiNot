import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Sunrise,
  Activity,
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { TaskDifficulty, TaskEnergyLevel } from '../../types';

export const CircadianOrganizer: React.FC = () => {
  const { tasks, circadianStatus, addTask, toggleTaskComplete, deleteTask, isTaskEnergyAligned } = useTask();
  const { user, updateUser } = useAuth();

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCourse, setNewCourse] = useState<string>('');
  const [newEnergy, setNewEnergy] = useState<TaskEnergyLevel>('deep_focus');
  const [newDifficulty, setNewDifficulty] = useState<TaskDifficulty>('medium');
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newDueDate, setNewDueDate] = useState<string>(
    () => new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );

  const currentHour = new Date().getHours();

  const handleChronotypeChange = (type: 'early_bird' | 'afternoon_flow' | 'night_owl') => {
    updateUser({ chronotype: type });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      course: newCourse.trim() || 'General',
      energy: newEnergy,
      difficulty: newDifficulty,
      estimatedMinutes: newDuration,
      dueDate: new Date(newDueDate).toISOString(),
      tags: [newCourse || 'Study', newEnergy],
    });

    setNewTitle('');
    setNewCourse('');
    setShowAddForm(false);
  };

  // Generate 24-hour alertness curve coordinates for SVG chart
  const generateCurvePoints = () => {
    const points: { hour: number; level: number }[] = [];
    const chronotype = user?.chronotype || 'night_owl';

    for (let h = 0; h <= 24; h++) {
      let level = 30;
      if (chronotype === 'night_owl') {
        if (h >= 20 || h <= 2) level = 95 - Math.abs(h >= 20 ? h - 23 : h + 1) * 6;
        else if (h >= 14 && h < 20) level = 65 + (h - 14) * 4;
        else level = 30 + Math.sin(h / 3) * 10;
      } else if (chronotype === 'early_bird') {
        if (h >= 6 && h <= 12) level = 95 - Math.abs(h - 9) * 7;
        else if (h > 12 && h <= 18) level = 65 - (h - 12) * 5;
        else level = 25;
      } else {
        if (h >= 12 && h <= 18) level = 92 - Math.abs(h - 15) * 6;
        else if (h >= 8 && h < 12) level = 65;
        else level = 35;
      }
      points.push({ hour: h, level: Math.max(15, Math.min(100, level)) });
    }
    return points;
  };

  const curveData = generateCurvePoints();
  const width = 600;
  const height = 120;
  const pathD = curveData.reduce((acc, p, idx) => {
    const x = (p.hour / 24) * width;
    const y = height - (p.level / 100) * (height - 20) - 10;
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const currentX = (currentHour / 24) * width;

  return (
    <div className="flex flex-col w-full gap-6 select-none max-w-5xl mx-auto">
      {/* Top Banner & Chronotype Switcher */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 border border-white/80 dark:border-white/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-orange-500" />
              <h1 className="font-headline-md text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                Circadian & Task Console
              </h1>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Dynamically aligns high-cognitive tasks with your biological alertness peaks, preventing burnout from scheduling deep work in metabolic troughs.
            </p>
          </div>

          {/* Chronotype Pills */}
          <div className="flex items-center gap-2 clay-inset p-1.5 rounded-2xl">
            {[
              { id: 'early_bird', label: 'Early Bird', icon: Sunrise },
              { id: 'afternoon_flow', label: 'Bimodal Flow', icon: Sun },
              { id: 'night_owl', label: 'Night Owl', icon: Moon },
            ].map(item => {
              const Icon = item.icon;
              const isSel = user?.chronotype === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChronotypeChange(item.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-telemetry-sm text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? 'clay-btn-primary text-white'
                      : 'clay-pill text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Circadian Energy Alertness Curve Visualizer */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm font-bold text-slate-900 dark:text-slate-100">
                Biological Alertness Cycle (24h)
              </span>
              <span className="font-telemetry-sm text-slate-500 font-bold">
                Peak: {circadianStatus.peakHoursDescription}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-telemetry-sm text-emerald-600 dark:text-emerald-400 font-extrabold">
                Current: {circadianStatus.energyScore}% ({currentHour}:00)
              </span>
            </div>
          </div>

          {/* SVG Visual Graph */}
          <div className="relative w-full h-32 clay-inset rounded-2xl overflow-hidden p-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#curveGradient)" />
              <path d={pathD} fill="none" stroke="#ea580c" strokeWidth="3" />
              <line x1={currentX} y1="0" x2={currentX} y2={height} stroke="#10b981" strokeWidth="2.5" strokeDasharray="4" />
              <circle cx={currentX} cy="14" r="5" fill="#10b981" />
            </svg>

            <div className="absolute bottom-1 left-2 right-2 flex justify-between font-telemetry-sm text-[10px] text-slate-500 font-bold pointer-events-none">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Current Window Status Notice */}
        <div className={`mt-4 p-4 rounded-2xl clay-inset flex items-center justify-between text-xs font-medium ${
          circadianStatus.currentWindow === 'peak'
            ? 'border-l-4 border-emerald-500 text-emerald-800 dark:text-emerald-300'
            : circadianStatus.currentWindow === 'trough'
            ? 'border-l-4 border-amber-500 text-amber-800 dark:text-amber-300'
            : 'border-l-4 border-indigo-500 text-indigo-800 dark:text-indigo-300'
        }`}>
          <div className="flex items-center gap-2">
            {circadianStatus.currentWindow === 'trough' ? (
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            ) : (
              <Zap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            )}
            <span>
              <strong>{circadianStatus.windowLabel}:</strong> Recommended task energy level is <strong>{circadianStatus.recommendedEnergy.toUpperCase()}</strong>.
            </span>
          </div>
          <span className="font-telemetry-sm text-[11px] font-bold opacity-80">Synced</span>
        </div>
      </div>

      {/* Task List Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Dynamic Energy-Ranked Tasks
          </h2>
          <p className="font-body-md text-xs text-slate-500 font-medium">
            Sorted by cognitive priority and current biological window alignment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl clay-btn-primary text-white font-headline-sm text-xs font-extrabold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Add Task Modal / Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="clay-card rounded-3xl p-6 border border-white/80 dark:border-white/5 space-y-4">
          <h3 className="font-headline-md text-base font-extrabold text-slate-900 dark:text-slate-100">
            Create Energy-Tagged Task
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">Task Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Implement Dijkstra's Algorithm"
                className="w-full clay-inset rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">Course / Subject</label>
              <input
                type="text"
                value={newCourse}
                onChange={e => setNewCourse(e.target.value)}
                placeholder="e.g. CS 161"
                className="w-full clay-inset rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">Cognitive Energy</label>
              <select
                value={newEnergy}
                onChange={e => setNewEnergy(e.target.value as any)}
                className="w-full clay-inset rounded-2xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              >
                <option value="deep_focus">Deep Focus (Proofs, Heavy Code)</option>
                <option value="medium">Medium (Homework, Flashcards)</option>
                <option value="low">Low Energy (Reading, Admin)</option>
              </select>
            </div>

            <div>
              <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={e => setNewDifficulty(e.target.value as any)}
                className="w-full clay-inset rounded-2xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="epic">Epic Challenge</option>
              </select>
            </div>

            <div>
              <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">Duration (Mins)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={newDuration}
                onChange={e => setNewDuration(parseInt(e.target.value) || 30)}
                className="w-full clay-inset rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-telemetry-sm text-xs text-slate-500 mb-1 font-bold">Target Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                className="w-full clay-inset rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-2xl clay-btn-light text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl clay-btn-primary text-white text-xs font-bold cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task Cards: Active Tasks on Top, Completed Tasks Below */}
      <div className="space-y-3">
        {tasks.filter(t => !t.completed).map(task => {
          const alignment = isTaskEnergyAligned(task);
          return (
            <div
              key={task.id}
              className="clay-card-subtle rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/60 dark:border-white/5 transition-all"
            >
              <div className="flex items-start gap-4 flex-1">
                <button
                  type="button"
                  onClick={() => toggleTaskComplete(task.id)}
                  className="mt-0.5 w-6 h-6 rounded-xl clay-btn-light flex items-center justify-center cursor-pointer flex-shrink-0"
                >
                  <Circle className="w-5 h-5 text-slate-400" />
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-headline-sm text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      {task.title}
                    </h3>
                    <span className="font-telemetry-sm text-xs px-2.5 py-0.5 rounded-full clay-pill text-slate-600 dark:text-slate-400 font-bold">
                      {task.course}
                    </span>
                    {task.examRelated && (
                      <span className="font-telemetry-sm text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                        ⚡ Urgent Runway
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p className="font-body-md text-xs text-slate-500 font-medium">{task.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-telemetry-sm text-[11px] px-2.5 py-0.5 rounded-full clay-inset font-bold text-slate-600 dark:text-slate-400">
                      {alignment.reason}
                    </span>
                    <span className="font-telemetry-sm text-[11px] text-slate-500 flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {task.estimatedMinutes}m duration
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:self-center self-end">
                <span className={`font-telemetry-sm text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                  task.energy === 'deep_focus'
                    ? 'clay-btn-indigo text-white'
                    : 'clay-pill text-slate-700 dark:text-slate-300'
                }`}>
                  {task.energy.replace('_', ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-xl clay-btn-light text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {tasks.filter(t => !t.completed).length === 0 && (
          <div className="clay-card-subtle p-8 rounded-3xl text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-headline-sm text-sm font-bold text-slate-800 dark:text-slate-200">
              All active tasks cleared!
            </p>
            <p className="font-body-md text-xs text-slate-500 mt-1">
              Add a new sprint above or check completed tasks below.
            </p>
          </div>
        )}
      </div>

      {/* Completed Tasks Placed Below */}
      {tasks.filter(t => t.completed).length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Completed Sprints ({tasks.filter(t => t.completed).length})</span>
            </span>
          </div>

          <div className="space-y-2.5 opacity-70">
            {tasks.filter(t => t.completed).map(task => (
              <div
                key={task.id}
                className="clay-card-subtle rounded-3xl p-4 flex items-center justify-between gap-4 border border-white/40 dark:border-white/5"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTaskComplete(task.id)}
                    className="w-6 h-6 rounded-xl clay-btn-light flex items-center justify-center cursor-pointer flex-shrink-0"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  </button>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline-sm text-sm font-bold text-slate-400 line-through truncate">
                      {task.title}
                    </span>
                    <span className="font-telemetry-sm text-xs text-slate-500">
                      {task.course} • {task.estimatedMinutes}m logged
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-xl clay-btn-light text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

