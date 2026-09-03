import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Circle,
  RotateCw,
  Plus,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';

export const ExamCountdown: React.FC = () => {
  const { exams, updateExamCoverage, rebalanceRunway, addExam } = useTask();
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [showAddExam, setShowAddExam] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState<string>('');
  const [newCourseCode, setNewCourseCode] = useState<string>('');
  const [newExamDate, setNewExamDate] = useState<string>(
    new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 16)
  );
  const [newTopics, setNewTopics] = useState<string>('Dynamic Programming, Graph Traversal, Greedy Proofs');
  const [newPriority, setNewPriority] = useState<'critical' | 'high' | 'normal'>('high');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (targetIso: string) => {
    const diff = new Date(targetIso).getTime() - currentTime;
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, isPast: false };
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const topicsArray = newTopics.split(',').map(t => t.trim()).filter(Boolean);
    addExam({
      title: newTitle.trim(),
      courseCode: newCourseCode.trim() || 'ACAD',
      examDate: new Date(newExamDate).toISOString(),
      priority: newPriority,
      topicsRemaining: topicsArray.length > 0 ? topicsArray : ['Core Exam Review'],
      dailyQuotaMinutes: 60,
    });

    setNewTitle('');
    setNewCourseCode('');
    setShowAddExam(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="clay-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-slate-200/80 dark:border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h1 className="font-headline-md text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Exam Countdowns & Dynamic Runway
              </h1>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Live ticking countdowns mapped to remaining syllabus topics with automatic daily runway rebalancing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddExam(prev => !prev)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl clay-btn-primary text-white text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Exam</span>
          </button>
        </div>
      </div>

      {/* Add Exam Drawer */}
      {showAddExam && (
        <form onSubmit={handleCreateExam} className="clay-card rounded-3xl p-6 border border-orange-500/30 space-y-4 animate-fade-in">
          <h3 className="font-headline-sm text-sm font-extrabold text-slate-900 dark:text-white">Add Upcoming Exam or Project Milestone</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Exam / Project Name</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. CS 161 Algorithms Final"
                className="w-full clay-inset rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Course Code</label>
              <input
                type="text"
                value={newCourseCode}
                onChange={e => setNewCourseCode(e.target.value)}
                placeholder="e.g. CS 161"
                className="w-full clay-inset rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Exam Date & Time</label>
              <input
                type="datetime-local"
                value={newExamDate}
                onChange={e => setNewExamDate(e.target.value)}
                className="w-full clay-inset rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="w-full clay-inset rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-200 focus:outline-none"
              >
                <option value="critical">Critical (Midterm/Final Exam)</option>
                <option value="high">High (Major Project Milestone)</option>
                <option value="normal">Normal (Quiz/Lab Submission)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Syllabus Modules (Comma separated)</label>
            <input
              type="text"
              value={newTopics}
              onChange={e => setNewTopics(e.target.value)}
              placeholder="e.g. Dynamic Programming, Max Flow, Linear Programming"
              className="w-full clay-inset rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddExam(false)}
              className="px-4 py-2 rounded-xl clay-btn-light text-slate-600 dark:text-neutral-400 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl clay-btn-primary text-white text-xs font-bold cursor-pointer"
            >
              Track Exam Runway
            </button>
          </div>
        </form>
      )}

      {/* Countdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => {
          const timeLeft = calculateTimeLeft(exam.examDate);
          return (
            <div
              key={exam.id}
              className="clay-card rounded-3xl p-6 flex flex-col justify-between border border-slate-200/80 dark:border-white/5 relative overflow-hidden"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-telemetry-sm text-xs font-bold px-2.5 py-0.5 rounded-full clay-pill text-orange-600 dark:text-orange-400">
                    {exam.courseCode}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full clay-pill ${
                    exam.priority === 'critical'
                      ? 'text-red-600 dark:text-red-400'
                      : exam.priority === 'high'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-indigo-600 dark:text-cyan-400'
                  }`}>
                    {exam.priority}
                  </span>
                </div>

                <h3 className="font-headline-sm text-base font-extrabold text-slate-900 dark:text-white mb-4">
                  {exam.title}
                </h3>

                {/* Live Ticking Countdown Badges */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  <div className="clay-inset rounded-2xl p-2.5 text-center">
                    <span className="block text-xl font-telemetry-sm font-extrabold text-slate-900 dark:text-white">{timeLeft.days}</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Days</span>
                  </div>
                  <div className="clay-inset rounded-2xl p-2.5 text-center">
                    <span className="block text-xl font-telemetry-sm font-extrabold text-slate-900 dark:text-white">{timeLeft.hours}</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Hours</span>
                  </div>
                  <div className="clay-inset rounded-2xl p-2.5 text-center">
                    <span className="block text-xl font-telemetry-sm font-extrabold text-orange-600 dark:text-orange-400">{timeLeft.minutes}</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Mins</span>
                  </div>
                  <div className="clay-inset rounded-2xl p-2.5 text-center">
                    <span className="block text-xl font-telemetry-sm font-extrabold text-indigo-600 dark:text-cyan-400">{timeLeft.seconds}</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Secs</span>
                  </div>
                </div>

                {/* Syllabus Coverage Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-700 dark:text-neutral-300">Syllabus Mastered</span>
                    <span className="font-telemetry-sm text-indigo-600 dark:text-cyan-400">{exam.syllabusCoverage}%</span>
                  </div>
                  <div className="h-2.5 w-full clay-inset rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${exam.syllabusCoverage}%` }}
                    />
                  </div>
                </div>

                {/* Remaining Topics Checklist */}
                <div className="space-y-1.5 mb-4">
                  <span className="font-telemetry-sm text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Remaining High-Yield Topics:
                  </span>
                  {exam.topicsRemaining.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => updateExamCoverage(exam.id, topic)}
                      className="w-full flex items-center gap-2 p-2 rounded-xl clay-card-subtle text-left text-xs text-slate-700 dark:text-slate-300 hover:text-orange-600 cursor-pointer transition-colors"
                    >
                      <Circle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate font-semibold">{topic}</span>
                    </button>
                  ))}
                  {exam.topicsCompleted.length > 0 && (
                    <div className="pt-1 text-[11px] text-slate-500 font-telemetry-sm">
                      ✓ {exam.topicsCompleted.length} modules completed
                    </div>
                  )}
                </div>
              </div>

              {/* Runway Quota & Rebalance Action */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Required Runway</span>
                  <span className="text-slate-900 dark:text-white font-telemetry-sm font-extrabold">{exam.dailyQuotaMinutes} mins / day</span>
                </div>
                <button
                  type="button"
                  onClick={() => rebalanceRunway(exam.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl clay-btn-light text-slate-700 dark:text-neutral-300 hover:text-orange-600 cursor-pointer text-xs font-bold"
                  title="Recalculate daily quota based on days remaining"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Rebalance</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
