// Core types for ProcastiNot (OmniFocus / StudyForge)

export type UserRole = 'student' | 'competitive_programmer' | 'researcher' | 'self_learner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  institution?: string;
  chronotype: 'early_bird' | 'afternoon_flow' | 'night_owl';
  streak: number;
  streakFreezes: number;
  focusPoints: number;
  level: number;
  activeTheme: string;
  unlockedThemes: string[];
  unlockedBadges: string[];
  joinedDate: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
}

export type TimerMode = 'focus' | 'short_break' | 'long_break';

export interface TimerPreset {
  id: string;
  name: string;
  focusMinutes: number;
  breakMinutes: number;
  icon?: string;
  tag?: string;
}

export interface GammaAudioState {
  enabled: boolean;
  frequency: number; // default 40 Hz
  carrierFrequency: number; // default 216 Hz
  mode: 'binaural' | 'isochronic';
  gammaVolume: number; // 0 to 1
  ambientType: 'none' | 'pink' | 'brown' | 'rain' | 'library';
  ambientVolume: number; // 0 to 1
}

export interface FocusSessionLog {
  id: string;
  timestamp: string;
  durationMinutes: number;
  mode: TimerMode;
  taskTitle?: string;
  interceptionsEncountered: number;
  pointsEarned: number;
  completed: boolean;
}

export type TaskEnergyLevel = 'low' | 'medium' | 'deep_focus';
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

export interface Task {
  id: string;
  title: string;
  description?: string;
  course?: string;
  energy: TaskEnergyLevel;
  difficulty: TaskDifficulty;
  estimatedMinutes: number;
  completedMinutes: number;
  completed: boolean;
  dueDate: string; // ISO date string
  preferredWindow?: string; // e.g., 'morning', 'afternoon', 'night'
  tags: string[];
  examRelated?: boolean;
}

export interface ExamDeadline {
  id: string;
  title: string;
  courseCode: string;
  examDate: string; // ISO string
  priority: 'high' | 'critical' | 'normal';
  syllabusCoverage: number; // 0 to 100 percentage
  topicsRemaining: string[];
  topicsCompleted: string[];
  dailyQuotaMinutes: number;
}

export interface BlockedDomain {
  id: string;
  domain: string;
  name: string;
  icon: string;
  attemptsToday: number;
  minutesSaved: number;
  category: 'social' | 'video' | 'gaming' | 'news';
  isDefault: boolean;
}

export interface SecondThoughtInterception {
  id: string;
  domain: string;
  timestamp: string;
  reason?: 'boredom' | 'fatigue' | 'habit' | 'research';
  returnedToFocus: boolean;
  breathingSecondsCompleted: number;
  pointsAwarded: number;
}

export interface FocusRoomPeer {
  id: string;
  name: string;
  avatar: string;
  status: 'focusing' | 'short_break' | 'deep_work' | 'idle';
  currentTask: string;
  timeRemainingSeconds: number;
  isMuted: boolean;
  activeStreak: number;
  pointsToday: number;
}

export interface VirtualRoom {
  id: string;
  name: string;
  description: string;
  category: 'library' | 'coding' | 'stem' | 'night_owls';
  activeParticipants: number;
  maxParticipants: number;
  timerMode: TimerMode;
  soundscape: '40hz_gamma' | 'rain_library' | 'silent' | 'binaural_zen';
  isJoined?: boolean;
  peers: FocusRoomPeer[];
}

export interface PeerLeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  institution: string;
  weeklyHours: number;
  dailyHours: number;
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // focus minutes or completed blocks
  level: 0 | 1 | 2 | 3 | 4; // intensity
}

export interface DailyPerformanceDelta {
  date: string; // e.g. "Sep 03"
  focusHours: number;
  tasksCompleted: number;
  distractionsAvoided: number;
  performanceScore: number; // calculated index
  deltaPercentage: number; // vs previous day (+12%, -4%)
}

export interface ShopTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  accentColor: string;
  bgColor: string;
  previewGradient: string;
}

export interface RoutineNotification {
  id: string;
  title: string;
  message: string;
  type: 'circadian' | 'exam' | 'streak' | 'peer';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
