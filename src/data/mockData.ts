import {
  UserProfile,
  TimerPreset,
  Task,
  ExamDeadline,
  BlockedDomain,
  VirtualRoom,
  PeerLeaderboardEntry,
  HeatmapDay,
  DailyPerformanceDelta,
  ShopTheme,
  RoutineNotification,
} from '../types';

export const initialUser: UserProfile = {
  id: 'usr_pro_01',
  name: 'Alex Chen',
  email: 'alex.chen@stanford.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'student',
  institution: 'Stanford University',
  chronotype: 'night_owl',
  streak: 18,
  streakFreezes: 2,
  focusPoints: 1420,
  level: 7,
  activeTheme: 'google-stitch',
  unlockedThemes: ['google-stitch'],
  unlockedBadges: ['badge_first_streak', 'badge_deep_diver', 'badge_gamma_master'],
  joinedDate: '2026-01-15',
};

export const defaultPresets: TimerPreset[] = [
  { id: 'preset_classic', name: 'Classic Pomodoro', focusMinutes: 25, breakMinutes: 5, tag: 'Standard' },
  { id: 'preset_deep', name: 'Deep Work Block', focusMinutes: 50, breakMinutes: 10, tag: 'High Cognitive' },
  { id: 'preset_ultra', name: 'Ultra Flow Sprint', focusMinutes: 90, breakMinutes: 15, tag: 'Heavy Coding' },
  { id: 'preset_quick', name: 'Quick Review', focusMinutes: 15, breakMinutes: 3, tag: 'Warmup' },
];

export const initialTasks: Task[] = [
  {
    id: 'tsk_1',
    title: 'CS161: Dynamic Programming & Matrix Chain Multiplication',
    description: 'Implement bottom-up DP table and verify time complexity proofs.',
    course: 'CS 161 (Algorithms)',
    energy: 'deep_focus',
    difficulty: 'hard',
    estimatedMinutes: 90,
    completedMinutes: 50,
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    preferredWindow: 'night',
    tags: ['Algorithms', 'Exam Prep'],
    examRelated: true,
  },
  {
    id: 'tsk_2',
    title: 'MATH 104: Metric Space Topology Problem Set #6',
    description: 'Complete proofs for compactness and Cauchy sequence completeness.',
    course: 'MATH 104 (Analysis)',
    energy: 'deep_focus',
    difficulty: 'epic',
    estimatedMinutes: 120,
    completedMinutes: 0,
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    preferredWindow: 'night',
    tags: ['Math', 'Homework'],
    examRelated: true,
  },
  {
    id: 'tsk_3',
    title: 'System Design: Write distributed raft consensus summary',
    description: 'Synthesize leader election and log replication diagrams into Notion notes.',
    course: 'CS 244B (Distributed)',
    energy: 'medium',
    difficulty: 'medium',
    estimatedMinutes: 45,
    completedMinutes: 45,
    completed: true,
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    preferredWindow: 'afternoon',
    tags: ['Notes', 'Review'],
  },
  {
    id: 'tsk_4',
    title: 'Clean lab repository & submit GitHub Pull Request',
    description: 'Format lint errors, clean up README, and request review from TA.',
    course: 'CS 244B (Distributed)',
    energy: 'low',
    difficulty: 'easy',
    estimatedMinutes: 20,
    completedMinutes: 0,
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    preferredWindow: 'morning',
    tags: ['Admin', 'Git'],
  },
  {
    id: 'tsk_5',
    title: 'Codeforces Practice: Solve 2 Greedy & Graph Problems',
    description: 'Div 2 problem C and D review for upcoming competitive contest.',
    course: 'Competitive Programming',
    energy: 'deep_focus',
    difficulty: 'hard',
    estimatedMinutes: 60,
    completedMinutes: 0,
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    preferredWindow: 'night',
    tags: ['Codeforces', 'Algorithms'],
  },
];

export const initialExams: ExamDeadline[] = [
  {
    id: 'ex_1',
    title: 'CS 161 Algorithms Midterm II',
    courseCode: 'CS 161',
    examDate: new Date(Date.now() + 86400000 * 4 + 3600000 * 14).toISOString(), // ~4.5 days
    priority: 'critical',
    syllabusCoverage: 68,
    topicsRemaining: ['Bellman-Ford & Floyd-Warshall', 'Network Flow & Min-Cut', 'NP-Completeness Reductions'],
    topicsCompleted: ['Divide and Conquer', 'Greedy Huffman Coding', 'Dynamic Programming', 'Dijkstra & BFS/DFS'],
    dailyQuotaMinutes: 90,
  },
  {
    id: 'ex_2',
    title: 'MATH 104 Real Analysis Final',
    courseCode: 'MATH 104',
    examDate: new Date(Date.now() + 86400000 * 11 + 3600000 * 9).toISOString(), // ~11 days
    priority: 'high',
    syllabusCoverage: 45,
    topicsRemaining: ['Lebesgue Measure Intro', 'Riemann-Stieltjes Integration', 'Uniform Convergence of Series'],
    topicsCompleted: ['Real Number Field Axioms', 'Bolzano-Weierstrass', 'Compact & Connected Sets'],
    dailyQuotaMinutes: 75,
  },
  {
    id: 'ex_3',
    title: 'Distributed Systems Raft Project Milestone',
    courseCode: 'CS 244B',
    examDate: new Date(Date.now() + 86400000 * 7 + 3600000 * 23).toISOString(), // ~8 days
    priority: 'normal',
    syllabusCoverage: 80,
    topicsRemaining: ['Log Compaction & Snapshots', 'Network Partition Stress Testing'],
    topicsCompleted: ['Leader Election', 'Heartbeat Protocol', 'Log Replication Entry Matching'],
    dailyQuotaMinutes: 40,
  },
];

export const initialBlockedDomains: BlockedDomain[] = [
  { id: 'b_1', domain: 'instagram.com', name: 'Instagram', icon: 'camera', attemptsToday: 7, minutesSaved: 42, category: 'social', isDefault: true },
  { id: 'b_2', domain: 'tiktok.com', name: 'TikTok', icon: 'film', attemptsToday: 12, minutesSaved: 68, category: 'social', isDefault: true },
  { id: 'b_3', domain: 'youtube.com', name: 'YouTube Shorts & Feed', icon: 'play-circle', attemptsToday: 9, minutesSaved: 54, category: 'video', isDefault: true },
  { id: 'b_4', domain: 'reddit.com', name: 'Reddit', icon: 'message-square', attemptsToday: 4, minutesSaved: 25, category: 'social', isDefault: true },
  { id: 'b_5', domain: 'x.com', name: 'X / Twitter', icon: 'twitter', attemptsToday: 6, minutesSaved: 31, category: 'news', isDefault: true },
  { id: 'b_6', domain: 'netflix.com', name: 'Netflix', icon: 'tv', attemptsToday: 1, minutesSaved: 30, category: 'video', isDefault: true },
  { id: 'b_7', domain: 'twitch.tv', name: 'Twitch', icon: 'radio', attemptsToday: 3, minutesSaved: 20, category: 'gaming', isDefault: true },
];

export const initialRooms: VirtualRoom[] = [
  {
    id: 'room_1',
    name: 'Stanford Gates Quiet Coding Lab',
    description: 'Zero talking, pure algorithm sprints and compiler optimization. 40 Hz Gamma stream enabled.',
    category: 'coding',
    activeParticipants: 14,
    maxParticipants: 25,
    timerMode: 'focus',
    soundscape: '40hz_gamma',
    isJoined: true,
    peers: [
      { id: 'p_1', name: 'Sarah Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', status: 'deep_work', currentTask: 'CS161 DP Proofs', timeRemainingSeconds: 1420, isMuted: true, activeStreak: 24, pointsToday: 210 },
      { id: 'p_2', name: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', status: 'focusing', currentTask: 'LeetCode Hard Biweekly', timeRemainingSeconds: 980, isMuted: true, activeStreak: 12, pointsToday: 160 },
      { id: 'p_3', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', status: 'short_break', currentTask: 'Stretching & Tea', timeRemainingSeconds: 180, isMuted: true, activeStreak: 31, pointsToday: 280 },
      { id: 'p_4', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', status: 'focusing', currentTask: 'Compiler AST parser', timeRemainingSeconds: 1240, isMuted: true, activeStreak: 9, pointsToday: 120 },
    ],
  },
  {
    id: 'room_2',
    name: 'Midnight STEM Cramming Sanctum',
    description: 'Designed exclusively for night owls grinding problem sets past 11 PM.',
    category: 'night_owls',
    activeParticipants: 29,
    maxParticipants: 40,
    timerMode: 'focus',
    soundscape: 'rain_library',
    peers: [
      { id: 'p_5', name: 'Aiden Vance', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', status: 'focusing', currentTask: 'MATH 104 Topology', timeRemainingSeconds: 1650, isMuted: true, activeStreak: 19, pointsToday: 195 },
      { id: 'p_6', name: 'Zoe Thorne', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', status: 'deep_work', currentTask: 'Biochem Pathways Memorization', timeRemainingSeconds: 1110, isMuted: true, activeStreak: 42, pointsToday: 350 },
    ],
  },
  {
    id: 'room_3',
    name: 'Rainy Day Public Library (Lo-Fi & Pink Noise)',
    description: 'Relaxed focus with gentle rain patter and ambient keyboard clicks.',
    category: 'library',
    activeParticipants: 42,
    maxParticipants: 50,
    timerMode: 'focus',
    soundscape: 'rain_library',
    peers: [],
  },
];

export const initialLeaderboard: PeerLeaderboardEntry[] = [
  { rank: 1, id: 'u_lead_1', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', institution: 'MIT', weeklyHours: 38.5, dailyHours: 6.2, streak: 31, points: 3420 },
  { rank: 2, id: 'u_lead_2', name: 'Sarah Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', institution: 'Stanford', weeklyHours: 35.2, dailyHours: 5.8, streak: 24, points: 3180 },
  { rank: 3, id: 'usr_pro_01', name: 'Alex Chen (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', institution: 'Stanford', weeklyHours: 31.0, dailyHours: 5.1, streak: 18, points: 2890, isCurrentUser: true },
  { rank: 4, id: 'u_lead_3', name: 'Zoe Thorne', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', institution: 'UC Berkeley', weeklyHours: 29.4, dailyHours: 4.6, streak: 42, points: 2750 },
  { rank: 5, id: 'u_lead_4', name: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', institution: 'Carnegie Mellon', weeklyHours: 26.8, dailyHours: 4.2, streak: 12, points: 2410 },
  { rank: 6, id: 'u_lead_5', name: 'Kenji Takahashi', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', institution: 'Tokyo Univ', weeklyHours: 24.1, dailyHours: 3.9, streak: 15, points: 2200 },
];

export const generateHeatmapData = (): HeatmapDay[] => {
  const days: HeatmapDay[] = [];
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Simulate realistic study consistency with higher activity in recent weeks
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const baseProb = isWeekend ? 0.75 : 0.92;
    const active = Math.random() < baseProb;
    let minutes = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;

    if (active) {
      minutes = Math.floor(Math.random() * 240) + 45;
      if (minutes < 60) level = 1;
      else if (minutes < 120) level = 2;
      else if (minutes < 200) level = 3;
      else level = 4;
    }

    days.push({ date: dateStr, count: minutes, level });
  }
  return days;
};

export const performanceDeltaHistory: DailyPerformanceDelta[] = [
  { date: 'Sep 02', focusHours: 4.2, tasksCompleted: 5, distractionsAvoided: 18, performanceScore: 78, deltaPercentage: +4.2 },
  { date: 'Sep 03', focusHours: 5.0, tasksCompleted: 6, distractionsAvoided: 24, performanceScore: 84, deltaPercentage: +7.6 },
  { date: 'Sep 04', focusHours: 3.8, tasksCompleted: 4, distractionsAvoided: 14, performanceScore: 72, deltaPercentage: -14.2 },
  { date: 'Sep 05', focusHours: 5.5, tasksCompleted: 7, distractionsAvoided: 31, performanceScore: 91, deltaPercentage: +26.3 },
  { date: 'Sep 06', focusHours: 6.1, tasksCompleted: 8, distractionsAvoided: 36, performanceScore: 95, deltaPercentage: +4.4 },
  { date: 'Sep 07', focusHours: 4.9, tasksCompleted: 6, distractionsAvoided: 22, performanceScore: 85, deltaPercentage: -10.5 },
  { date: 'Sep 08', focusHours: 5.8, tasksCompleted: 7, distractionsAvoided: 29, performanceScore: 92, deltaPercentage: +8.2 },
  { date: 'Today',  focusHours: 5.1, tasksCompleted: 6, distractionsAvoided: 28, performanceScore: 89, deltaPercentage: +3.5 },
];

export const shopThemes: ShopTheme[] = [
  {
    id: 'google-stitch',
    name: 'Google Stitch Dark',
    description: 'The canonical deep charcoal (#121316 / #191a1f) interface with refined violet & cyan accents.',
    price: 0,
    accentColor: '#8B5CF6',
    bgColor: '#121316',
    previewGradient: 'from-violet-600 to-cyan-500',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'High-contrast electric magenta, neon cyan grid highlights and dark obsidian depth.',
    price: 350,
    accentColor: '#F43F5E',
    bgColor: '#0B0D13',
    previewGradient: 'from-rose-500 via-purple-600 to-cyan-400',
  },
  {
    id: 'obsidian-emerald',
    name: 'Obsidian Emerald',
    description: 'Soothing organic terminal forest greens designed for all-night coding & calm reading.',
    price: 450,
    accentColor: '#10B981',
    bgColor: '#0C1410',
    previewGradient: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'solar-sunset',
    name: 'Solar Flare Gold',
    description: 'Vibrant amber and warm ember luminescence designed for peak dawn concentration.',
    price: 600,
    accentColor: '#F59E0B',
    bgColor: '#14110E',
    previewGradient: 'from-amber-500 to-orange-500',
  },
];

export const initialNotifications: RoutineNotification[] = [
  {
    id: 'notif_1',
    title: 'Peak Night Owl Alertness Window',
    message: 'Your biological alertness peak (11:00 PM – 2:00 AM) is starting. Optimal time for CS161 DP proofs.',
    type: 'circadian',
    timestamp: '10m ago',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'Exam Countdown Alert: CS 161 Midterm II',
    message: '4 days 14 hours remaining. Daily syllabus runway requires 90 minutes of active focus today.',
    type: 'exam',
    timestamp: '1h ago',
    read: false,
  },
  {
    id: 'notif_3',
    title: 'Streak Record Maintained! 🔥',
    message: 'Day 18 consistency locked in. You earned 50 bonus Focus Points and 1 Streak Freeze shield.',
    type: 'streak',
    timestamp: '4h ago',
    read: true,
  },
  {
    id: 'notif_4',
    title: 'Peer Activity: Stanford Gates Lab',
    message: 'Sarah Lin and Marcus Brody just started a 50-minute deep work block.',
    type: 'peer',
    timestamp: '5h ago',
    read: true,
  },
];
