import React, { useState } from 'react';
import {
  Sparkles,
  Brain,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';

export const AIStudyPlanner: React.FC = () => {
  const { generateAIPlan, addTask } = useTask();

  const [course, setCourse] = useState<string>('CS 161 Algorithms & Complexity');
  const [examDate, setExamDate] = useState<string>(
    () => new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [freeHours, setFreeHours] = useState<number>(3.5);
  const [syllabusNotes, setSyllabusNotes] = useState<string>(
    'Bellman-Ford, Floyd-Warshall, Dynamic Programming formulation, Network Flow cuts, NP-Hardness reduction theorems.'
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const plan = await generateAIPlan(course, examDate, syllabusNotes);
      setAiOutput(plan);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushToTasks = () => {
    addTask({
      title: `${course.split(' ')[0]}: Spaced Repetition Sprint 1`,
      course: course.slice(0, 15),
      energy: 'deep_focus',
      difficulty: 'hard',
      estimatedMinutes: 50,
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      tags: ['AI Plan', 'Exam Runway'],
      examRelated: true,
    });
    alert('AI study block successfully scheduled into your Circadian Task Organizer!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="clay-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-600/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
              AI Study Runway & Agenda Synthesizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              Calculates remaining exam runway, breaks dense syllabi into spaced-repetition blocks, and aligns with your chronotype.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="clay-card rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            <span>Course & Exam Parameters</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-400 mb-1">Target Course / Subject</label>
              <input
                type="text"
                value={course}
                onChange={e => setCourse(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-400 mb-1">Exam / Deadline Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-400 mb-1">Daily Available Study Runway (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="14"
                  value={freeHours}
                  onChange={e => setFreeHours(parseFloat(e.target.value) || 2)}
                  className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-neutral-400 mb-1">Syllabus Modules or Lecture Topics</label>
              <textarea
                rows={3}
                value={syllabusNotes}
                onChange={e => setSyllabusNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Paste key chapters, topics, or problem areas..."
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-violet-600/25 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing Circadian Study Agenda...' : 'Generate AI Study Plan'}</span>
            </button>
          </form>
        </div>

        {/* AI Output / Schedule Preview */}
        <div className="clay-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>Synthesized Runway Agenda</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                Spaced Repetition
              </span>
            </div>

            {aiOutput ? (
              <div className="bg-slate-50 dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-xl p-4 font-mono text-xs text-slate-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed space-y-2 max-h-96 overflow-y-auto">
                {aiOutput}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 dark:text-neutral-500 space-y-3">
                <Brain className="w-10 h-10 stroke-[1.5] text-slate-300 dark:text-neutral-600" />
                <p className="text-xs max-w-xs">
                  Configure your exam date and syllabus on the left to generate an intelligent runway breakdown.
                </p>
              </div>
            )}
          </div>

          {aiOutput && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-neutral-400">Add to Circadian Task Board?</span>
              <button
                type="button"
                onClick={handlePushToTasks}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Schedule Sprints</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
