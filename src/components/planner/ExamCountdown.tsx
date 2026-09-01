import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  RotateCw,
  Plus,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { ExamDeadline } from '../../types';

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
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="stitch-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Exam Countdowns & Dynamic Runway
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Live ticking countdowns mapped to remaining syllabus topics with automatic daily runway rebalancing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddExam(prev => !prev)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Exam</span>
          </button>
        </div>
      </div>

      {/* Add Exam Drawer */}
      {showAddExam && (
        <form onSubmit={handleCreateExam} className="stitch-card rounded-2xl p-6 border-violet-500/30 bg-[#191a1f] space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-white">Add Upcoming Exam or Project Milestone</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Exam / Project Name</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. CS 161 Algorithms Final"
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Course Code</label>
              <input
                type="text"
                value={newCourseCode}
                onChange={e => setNewCourseCode(e.target.value)}
                placeholder="e.g. CS 161"
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Exam Date & Time</label>
              <input
                type="datetime-local"
                value={newExamDate}
                onChange={e => setNewExamDate(e.target.value)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-violet-500"
              >
                <option value="critical">Critical (Midterm/Final Exam)</option>
                <option value="high">High (Major Project Milestone)</option>
                <option value="normal">Normal (Quiz/Lab Submission)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">Syllabus Modules (Comma separated)</label>
            <input
              type="text"
              value={newTopics}
              onChange={e => setNewTopics(e.target.value)}
              placeholder="e.g. Dynamic Programming, Max Flow, Linear Programming"
              className="w-full bg-[#121316] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddExam(false)}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-400 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
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
              className="stitch-card rounded-2xl p-6 flex flex-col justify-between border-white/10 relative overflow-hidden"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {exam.courseCode}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    exam.priority === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : exam.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {exam.priority}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-4">
                  {exam.title}
                </h3>

                {/* Live Ticking Countdown Badges */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  <div className="bg-[#121316] border border-white/5 rounded-xl p-2 text-center">
                    <span className="block text-xl font-mono font-bold text-white">{timeLeft.days}</span>
                    <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Days</span>
                  </div>
                  <div className="bg-[#121316] border border-white/5 rounded-xl p-2 text-center">
                    <span className="block text-xl font-mono font-bold text-white">{timeLeft.hours}</span>
                    <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Hours</span>
                  </div>
                  <div className="bg-[#121316] border border-white/5 rounded-xl p-2 text-center">
                    <span className="block text-xl font-mono font-bold text-violet-400">{timeLeft.minutes}</span>
                    <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Mins</span>
                  </div>
                  <div className="bg-[#121316] border border-white/5 rounded-xl p-2 text-center">
                    <span className="block text-xl font-mono font-bold text-cyan-400">{timeLeft.seconds}</span>
                    <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Secs</span>
                  </div>
                </div>

                {/* Syllabus Coverage Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-neutral-300">Syllabus Mastered</span>
                    <span className="font-mono text-cyan-400 font-bold">{exam.syllabusCoverage}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#121316] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${exam.syllabusCoverage}%` }}
                    />
                  </div>
                </div>

                {/* Remaining Topics Checklist */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Remaining High-Yield Topics:
                  </span>
                  {exam.topicsRemaining.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => updateExamCoverage(exam.id, topic)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#121316] hover:bg-neutral-800 text-left text-xs text-neutral-300 transition-colors cursor-pointer"
                    >
                      <Circle className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                      <span className="truncate">{topic}</span>
                    </button>
                  ))}
                  {exam.topicsCompleted.length > 0 && (
                    <div className="pt-1 text-[11px] text-neutral-500">
                      ✓ {exam.topicsCompleted.length} modules completed
                    </div>
                  )}
                </div>
              </div>

              {/* Runway Quota & Rebalance Action */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Required Runway</span>
                  <span className="text-white font-mono font-bold">{exam.dailyQuotaMinutes} mins / day</span>
                </div>
                <button
                  type="button"
                  onClick={() => rebalanceRunway(exam.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-violet-600/20 text-neutral-300 hover:text-violet-300 border border-white/5 transition-all cursor-pointer text-xs"
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
