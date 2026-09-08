import React, { createContext, useContext, useState } from 'react';
import { Task, ExamDeadline, TaskEnergyLevel } from '../types';
import { initialTasks, initialExams } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface CircadianStatus {
  currentWindow: 'peak' | 'moderate' | 'trough';
  windowLabel: string;
  recommendedEnergy: TaskEnergyLevel;
  chronotype: 'early_bird' | 'afternoon_flow' | 'night_owl';
  peakHoursDescription: string;
  energyScore: number; // 0 to 100
}

interface TaskContextType {
  tasks: Task[];
  exams: ExamDeadline[];
  circadianStatus: CircadianStatus;
  addTask: (task: Omit<Task, 'id' | 'completedMinutes' | 'completed'>) => void;
  toggleTaskComplete: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addExam: (exam: Omit<ExamDeadline, 'id' | 'syllabusCoverage' | 'topicsCompleted'>) => void;
  updateExamCoverage: (examId: string, completedTopic: string) => void;
  rebalanceRunway: (examId: string) => void;
  isTaskEnergyAligned: (task: Task) => { aligned: boolean; badgeColor: string; reason: string };
  generateAIPlan: (courseTitle: string, examDate: string, syllabusNotes: string) => Promise<string>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const sortTasks = (taskList: Task[], _circadianWindow: 'peak' | 'moderate' | 'trough' = 'peak'): Task[] => {
  return [...taskList].sort((a, b) => {
    // 1. Completed tasks always sink to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 2. Urgency comparison
    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    const aUrgent = a.examRelated || (aDue - Date.now() < 86400000 * 3);
    const bUrgent = b.examRelated || (bDue - Date.now() < 86400000 * 3);

    if (aUrgent !== bUrgent) {
      return aUrgent ? -1 : 1;
    }

    if (Math.abs(aDue - bDue) > 3600000 * 6) {
      return aDue - bDue; // Earliest due first
    }

    // 3. Cognitive Energy weight (deep_focus > medium > low during peak/moderate)
    const energyWeights: Record<TaskEnergyLevel, number> = {
      deep_focus: 3,
      medium: 2,
      low: 1,
    };
    const aEnergy = energyWeights[a.energy] || 1;
    const bEnergy = energyWeights[b.energy] || 1;
    if (aEnergy !== bEnergy) {
      return bEnergy - aEnergy; // Higher energy first
    }

    // 4. Difficulty weight
    const diffWeights = { epic: 4, hard: 3, medium: 2, easy: 1 };
    return (diffWeights[b.difficulty] || 0) - (diffWeights[a.difficulty] || 0);
  });
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const chronotype = user?.chronotype || 'night_owl';

  const [rawTasks, setRawTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('procastinot_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialTasks;
  });

  const [exams, setExams] = useState<ExamDeadline[]>(() => {
    const saved = localStorage.getItem('procastinot_exams');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialExams;
  });

  // Calculate current circadian alertness state based on chronotype and current hour
  const getCircadianStatus = (): CircadianStatus => {
    const hour = new Date().getHours();

    if (chronotype === 'night_owl') {
      if ((hour >= 21 && hour <= 23) || (hour >= 0 && hour < 3)) {
        return {
          currentWindow: 'peak',
          windowLabel: 'Night Owl Peak Alertness (11 PM - 3 AM)',
          recommendedEnergy: 'deep_focus',
          chronotype: 'night_owl',
          peakHoursDescription: '9:00 PM – 3:00 AM',
          energyScore: 96,
        };
      } else if (hour >= 14 && hour < 21) {
        return {
          currentWindow: 'moderate',
          windowLabel: 'Afternoon Ramp-up Window',
          recommendedEnergy: 'medium',
          chronotype: 'night_owl',
          peakHoursDescription: '9:00 PM – 3:00 AM',
          energyScore: 68,
        };
      } else {
        return {
          currentWindow: 'trough',
          windowLabel: 'Morning Biological Trough',
          recommendedEnergy: 'low',
          chronotype: 'night_owl',
          peakHoursDescription: '9:00 PM – 3:00 AM',
          energyScore: 35,
        };
      }
    } else if (chronotype === 'early_bird') {
      if (hour >= 6 && hour < 12) {
        return {
          currentWindow: 'peak',
          windowLabel: 'Early Riser Golden Peak (6 AM - 12 PM)',
          recommendedEnergy: 'deep_focus',
          chronotype: 'early_bird',
          peakHoursDescription: '6:00 AM – 12:00 PM',
          energyScore: 95,
        };
      } else if (hour >= 14 && hour < 19) {
        return {
          currentWindow: 'moderate',
          windowLabel: 'Late Afternoon Steady Flow',
          recommendedEnergy: 'medium',
          chronotype: 'early_bird',
          peakHoursDescription: '6:00 AM – 12:00 PM',
          energyScore: 65,
        };
      } else {
        return {
          currentWindow: 'trough',
          windowLabel: 'Nighttime Sleep Pressure Trough',
          recommendedEnergy: 'low',
          chronotype: 'early_bird',
          peakHoursDescription: '6:00 AM – 12:00 PM',
          energyScore: 30,
        };
      }
    } else {
      // afternoon_flow
      if (hour >= 12 && hour < 18) {
        return {
          currentWindow: 'peak',
          windowLabel: 'Afternoon Flow Peak (12 PM - 6 PM)',
          recommendedEnergy: 'deep_focus',
          chronotype: 'afternoon_flow',
          peakHoursDescription: '12:00 PM – 6:00 PM',
          energyScore: 92,
        };
      } else if ((hour >= 9 && hour < 12) || (hour >= 18 && hour < 22)) {
        return {
          currentWindow: 'moderate',
          windowLabel: 'Bimodal Balanced Window',
          recommendedEnergy: 'medium',
          chronotype: 'afternoon_flow',
          peakHoursDescription: '12:00 PM – 6:00 PM',
          energyScore: 70,
        };
      } else {
        return {
          currentWindow: 'trough',
          windowLabel: 'Late Night Rest Trough',
          recommendedEnergy: 'low',
          chronotype: 'afternoon_flow',
          peakHoursDescription: '12:00 PM – 6:00 PM',
          energyScore: 40,
        };
      }
    }
  };

  const circadianStatus = getCircadianStatus();
  const tasks = sortTasks(rawTasks, circadianStatus.currentWindow);

  const isTaskEnergyAligned = (task: Task) => {
    if (circadianStatus.currentWindow === 'peak') {
      if (task.energy === 'deep_focus') {
        return {
          aligned: true,
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          reason: 'High Cognitive match: Perfect timing for complex proofs & coding.',
        };
      }
      return {
        aligned: true,
        badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        reason: 'Optimal Alertness Window.',
      };
    } else if (circadianStatus.currentWindow === 'trough') {
      if (task.energy === 'deep_focus') {
        return {
          aligned: false,
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          reason: 'Energy Trough Warning: Cognitive friction is high. Consider administrative or low-energy tasks.',
        };
      }
      return {
        aligned: true,
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        reason: 'Well-aligned for restorative or routine work.',
      };
    } else {
      return {
        aligned: true,
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        reason: 'Balanced Cognitive Window.',
      };
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completedMinutes' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      completedMinutes: 0,
      completed: false,
    };
    setRawTasks(prev => {
      const updated = [newTask, ...prev];
      localStorage.setItem('procastinot_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setRawTasks(prev => {
      const updated = prev.map(t =>
        t.id === taskId
          ? { ...t, completed: !t.completed, completedMinutes: !t.completed ? t.estimatedMinutes : 0 }
          : t
      );
      localStorage.setItem('procastinot_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTask = (taskId: string) => {
    setRawTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      localStorage.setItem('procastinot_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const addExam = (examData: Omit<ExamDeadline, 'id' | 'syllabusCoverage' | 'topicsCompleted'>) => {
    const newExam: ExamDeadline = {
      ...examData,
      id: `ex_${Date.now()}`,
      syllabusCoverage: 0,
      topicsCompleted: [],
    };
    setExams(prev => {
      const updated = [newExam, ...prev];
      localStorage.setItem('procastinot_exams', JSON.stringify(updated));
      return updated;
    });
  };

  const updateExamCoverage = (examId: string, completedTopic: string) => {
    setExams(prev => {
      const updated = prev.map(ex => {
        if (ex.id !== examId) return ex;
        const remaining = ex.topicsRemaining.filter(t => t !== completedTopic);
        const completed = [...ex.topicsCompleted, completedTopic];
        const total = remaining.length + completed.length;
        const coverage = total > 0 ? Math.round((completed.length / total) * 100) : 100;
        return {
          ...ex,
          topicsRemaining: remaining,
          topicsCompleted: completed,
          syllabusCoverage: coverage,
        };
      });
      localStorage.setItem('procastinot_exams', JSON.stringify(updated));
      return updated;
    });
  };

  const rebalanceRunway = (examId: string) => {
    setExams(prev => {
      const updated = prev.map(ex => {
        if (ex.id !== examId) return ex;
        const msLeft = new Date(ex.examDate).getTime() - Date.now();
        const daysLeft = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
        const topicsCount = ex.topicsRemaining.length;
        // recalculate quota dynamically: (topics * 45 mins) / daysLeft
        const newQuota = Math.round((topicsCount * 50) / daysLeft);
        return {
          ...ex,
          dailyQuotaMinutes: Math.max(30, newQuota),
        };
      });
      localStorage.setItem('procastinot_exams', JSON.stringify(updated));
      return updated;
    });
  };

  const generateAIPlan = async (courseTitle: string, examDate: string, syllabusNotes: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 1000)); // simulated AI inference
    const msLeft = new Date(examDate).getTime() - Date.now();
    const days = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

    return `AI Study Strategy for ${courseTitle}:
• Total Runway: ${days} days remaining.
• Circadian Recommendation: Night Owl focus sprint blocks between 11:00 PM and 1:30 AM.
• Spaced Repetition Roadmap:
  1. Day 1-2: Core conceptual foundation for ${syllabusNotes.slice(0, 40) || 'primary lecture themes'}.
  2. Day 3-4: Active recall practice sets with timed 50-minute Gamma 40Hz focus blocks.
  3. Day ${Math.max(2, days - 1)}: Past exam simulation and edge-case review.
• Recommended Daily Sprint: 2 x 45-minute Deep Work intervals with zero social media distraction.`;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        exams,
        circadianStatus,
        addTask,
        toggleTaskComplete,
        deleteTask,
        addExam,
        updateExamCoverage,
        rebalanceRunway,
        isTaskEnergyAligned,
        generateAIPlan,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
