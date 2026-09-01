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
  Info,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Task, TaskDifficulty, TaskEnergyLevel } from '../../types';

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
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
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
      let level = 30; // base trough
      if (chronotype === 'night_owl') {
        // Peak 21:00 - 02:00, trough 06:00 - 11:00
        if (h >= 20 || h <= 2) level = 95 - Math.abs(h >= 20 ? h - 23 : h + 1) * 6;
        else if (h >= 14 && h < 20) level = 65 + (h - 14) * 4;
        else level = 30 + Math.sin(h / 3) * 10;
      } else if (chronotype === 'early_bird') {
        // Peak 06:00 - 12:00, trough 21:00 - 04:00
        if (h >= 6 && h <= 12) level = 95 - Math.abs(h - 9) * 7;
        else if (h > 12 && h <= 18) level = 65 - (h - 12) * 5;
        else level = 25;
      } else {
        // Afternoon flow: Peak 12:00 - 18:00
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
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Chronotype Switcher */}
      <div className="stitch-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Circadian & Energy-Based Task Organizer
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Dynamically aligns high-cognitive algorithmic tasks with your biological alertness peaks, preventing burnout from scheduling deep work in metabolic troughs.
            </p>
          </div>

          {/* Chronotype Pills */}
          <div className="flex items-center gap-2 bg-[#121316] p-1.5 rounded-2xl border border-white/5">
            {[
              { id: 'early_bird', label: 'Early Bird', icon: Sunrise, window: '6 AM - 12 PM' },
              { id: 'afternoon_flow', label: 'Bimodal Flow', icon: Sun, window: '12 PM - 6 PM' },
              { id: 'night_owl', label: 'Night Owl', icon: Moon, window: '9 PM - 3 AM' },
            ].map(item => {
              const Icon = item.icon;
              const isSel = user?.chronotype === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChronotypeChange(item.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSel
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Circadian Energy Alertness Curve Visualizer */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Biological Alertness Cycle (24h)</span>
              <span className="text-neutral-400 font-mono text-[11px]">
                Peak: {circadianStatus.peakHoursDescription}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span className="text-violet-300 font-medium">
                Current Alertness: {circadianStatus.energyScore}% ({currentHour}:00)
              </span>
            </div>
          </div>

          {/* SVG Visual Graph */}
          <div className="relative w-full h-32 bg-[#121316] rounded-xl overflow-hidden border border-white/5 p-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path d={areaD} fill="url(#curveGradient)" />
              {/* Curve stroke */}
              <path d={pathD} fill="none" stroke="#8B5CF6" strokeWidth="2.5" />

              {/* Current Hour Indicator Line */}
              <line
                x1={currentX}
                y1="0"
                x2={currentX}
                y2={height}
                stroke="#06B6D4"
                strokeWidth="2"
                strokeDasharray="4"
              />
              <circle cx={currentX} cy="14" r="4" fill="#06B6D4" />
            </svg>

            {/* Time ticks */}
            <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[10px] font-mono text-neutral-500 pointer-events-none">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* Current Window Status Notice */}
        <div className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between text-xs ${
          circadianStatus.currentWindow === 'peak'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : circadianStatus.currentWindow === 'trough'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
        }`}>
          <div className="flex items-center gap-2">
            {circadianStatus.currentWindow === 'trough' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <Zap className="w-4 h-4 text-emerald-400" />
            )}
            <span>
              <strong>{circadianStatus.windowLabel}:</strong> Recommended task difficulty: <strong>{circadianStatus.recommendedEnergy.toUpperCase()}</strong>.
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-80">Syncing with biological chronotype</span>
        </div>
      </div>

      {/* Task List Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Dynamic Energy-Ranked Tasks</h2>
          <p className="text-xs text-neutral-400">
            Sorted by cognitive priority and current circadian alignment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Add Task Modal / Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="stitch-card rounded-2xl p-6 border-violet-500/30 bg-[#191a1f] space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white">Create Energy-Tagged Task</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Task Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Implement Dijkstra's Algorithm with Min-Heap"
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Course Code / Subject</label>
              <input
                type="text"
                value={newCourse}
                onChange={e => setNewCourse(e.target.value)}
                placeholder="e.g. CS 161 (Algorithms)"
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Cognitive Energy Requirement</label>
              <select
                value={newEnergy}
                onChange={e => setNewEnergy(e.target.value as any)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-violet-500"
              >
                <option value="deep_focus">Deep Focus (High Cognitive, Proofs, Heavy Coding)</option>
                <option value="medium">Medium (Homework, Summaries, Flashcards)</option>
                <option value="low">Low Energy (Reading, Git Cleanup, Emails)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={e => setNewDifficulty(e.target.value as any)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-violet-500"
              >
                <option value="easy">Easy (Warmup)</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="epic">Epic Challenge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Estimated Duration (Mins)</label>
              <input
                type="number"
                min="10"
                max="240"
                value={newDuration}
                onChange={e => setNewDuration(parseInt(e.target.value) || 30)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.map(task => {
          const alignment = isTaskEnergyAligned(task);
          return (
            <div
              key={task.id}
              className={`stitch-card stitch-card-hover rounded-2xl p-4.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                task.completed ? 'opacity-60 bg-neutral-900/40' : ''
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTaskComplete(task.id)}
                  className="mt-0.5 text-neutral-400 hover:text-violet-400 transition-colors cursor-pointer"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm sm:text-base font-semibold ${
                      task.completed ? 'line-through text-neutral-500' : 'text-white'
                    }`}>
                      {task.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                      {task.course}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-neutral-400">{task.description}</p>
                  )}

                  {/* Energy & Alignment Tag */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${alignment.badgeColor}`}>
                      {alignment.reason}
                    </span>
                    <span className="text-[11px] text-neutral-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMinutes}m estimated
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:self-center self-end">
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
