import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  BlockedDomain,
  SecondThoughtInterception,
  VirtualRoom,
  PeerLeaderboardEntry,
  HeatmapDay,
  DailyPerformanceDelta,
  ShopTheme,
  RoutineNotification,
} from '../types';
import {
  initialBlockedDomains,
  initialRooms,
  initialLeaderboard,
  performanceDeltaHistory,
  initialNotifications,
} from '../data/mockData';
import {
  formatLocalDate,
  getRealHeatmapGrid,
  calculateRealStreak,
  loadUserDailyRecords,
  saveUserDailyRecords,
} from '../utils/streakTelemetry';
import { useAuth } from './AuthContext';
import { gammaEngine } from '../audio/gammaEngine';

interface GamificationContextType {
  focusPoints: number;
  streak: number;
  streakFreezes: number;
  activeTheme: string;
  unlockedThemes: string[];
  recordFocusSession: (minutes: number, date?: string) => void;
  clearStudyTelemetry: () => void;
  blockedDomains: BlockedDomain[];
  rooms: VirtualRoom[];
  activeRoomId: string | null;
  leaderboard: PeerLeaderboardEntry[];
  heatmapDays: HeatmapDay[];
  deltaHistory: DailyPerformanceDelta[];
  notifications: RoutineNotification[];
  interceptionActive: boolean;
  interceptedDomain: string | null;
  awardPoints: (amount: number, reason: string) => void;
  spendPoints: (amount: number) => boolean;
  buyTheme: (theme: ShopTheme) => boolean;
  equipTheme: (themeId: string) => void;
  addBlockedDomain: (domain: string, name: string, category: 'social' | 'video' | 'gaming' | 'news') => void;
  removeBlockedDomain: (id: string) => void;
  triggerInterception: (domain: string) => void;
  resolveInterception: (returnedToFocus: boolean, reason?: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  markNotificationRead: (id: string) => void;
  useStreakFreeze: () => boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();

  const [dailyRecords, setDailyRecords] = useState<Record<string, number>>(() => loadUserDailyRecords());
  const [focusPoints, setFocusPoints] = useState<number>(user?.focusPoints ?? 0);
  const [streak, setStreak] = useState<number>(() => calculateRealStreak(dailyRecords));
  const [streakFreezes, setStreakFreezes] = useState<number>(user?.streakFreezes ?? 2);
  const [activeTheme, setActiveTheme] = useState<string>(user?.activeTheme ?? 'google-stitch');
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(user?.unlockedThemes ?? ['google-stitch']);

  const [blockedDomains, setBlockedDomains] = useState<BlockedDomain[]>(() => {
    const saved = localStorage.getItem('procastinot_blocked_domains');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialBlockedDomains;
  });

  const [rooms, setRooms] = useState<VirtualRoom[]>(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState<string | null>('room_1');
  const [leaderboard] = useState<PeerLeaderboardEntry[]>(initialLeaderboard);
  const [heatmapDays, setHeatmapDays] = useState<HeatmapDay[]>(() => getRealHeatmapGrid(dailyRecords));
  const [deltaHistory, setDeltaHistory] = useState<DailyPerformanceDelta[]>(performanceDeltaHistory);
  const [notifications, setNotifications] = useState<RoutineNotification[]>(initialNotifications);

  // Friction modal state
  const [interceptionActive, setInterceptionActive] = useState<boolean>(false);
  const [interceptedDomain, setInterceptedDomain] = useState<string | null>(null);

  // Keep in sync with user profile safely
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (userRef.current) {
      updateUser({
        focusPoints,
        streak,
        streakFreezes,
        activeTheme,
        unlockedThemes,
      });
    }
  }, [focusPoints, streak, streakFreezes, activeTheme, unlockedThemes, updateUser]);

  const awardPoints = (amount: number, reason: string) => {
    setFocusPoints(prev => prev + amount);
    // Add toast or notification
    const newNotif: RoutineNotification = {
      id: `notif_${Date.now()}`,
      title: `+${amount} Focus Points! 🌟`,
      message: reason,
      type: 'streak',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const spendPoints = (amount: number): boolean => {
    if (focusPoints < amount) return false;
    setFocusPoints(prev => prev - amount);
    return true;
  };

  const buyTheme = (theme: ShopTheme): boolean => {
    if (unlockedThemes.includes(theme.id)) {
      equipTheme(theme.id);
      return true;
    }
    if (focusPoints < theme.price) {
      return false;
    }
    setFocusPoints(prev => prev - theme.price);
    setUnlockedThemes(prev => [...prev, theme.id]);
    equipTheme(theme.id);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    return true;
  };

  const equipTheme = (themeId: string) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  const addBlockedDomain = (domain: string, name: string, category: 'social' | 'video' | 'gaming' | 'news') => {
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').toLowerCase();
    const newBlocked: BlockedDomain = {
      id: `b_${Date.now()}`,
      domain: cleanDomain,
      name: name || cleanDomain,
      icon: 'shield-alert',
      attemptsToday: 0,
      minutesSaved: 0,
      category,
      isDefault: false,
    };
    setBlockedDomains(prev => {
      const updated = [newBlocked, ...prev];
      localStorage.setItem('procastinot_blocked_domains', JSON.stringify(updated));
      return updated;
    });
  };

  const removeBlockedDomain = (id: string) => {
    setBlockedDomains(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem('procastinot_blocked_domains', JSON.stringify(updated));
      return updated;
    });
  };

  const triggerInterception = (domain: string) => {
    gammaEngine.playChime('mindfulness');
    setInterceptedDomain(domain);
    setInterceptionActive(true);

    // Increment attempts on the domain
    setBlockedDomains(prev =>
      prev.map(b => (b.domain.includes(domain) || domain.includes(b.domain))
        ? { ...b, attemptsToday: b.attemptsToday + 1 }
        : b
      )
    );
  };

  const resolveInterception = (returnedToFocus: boolean, reason: string = 'habit') => {
    if (returnedToFocus) {
      // Award resilience focus points!
      awardPoints(35, `Resilience Victory: Successfully resisted doom-scrolling on ${interceptedDomain}!`);
      gammaEngine.playChime('complete');
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      } catch {}

      // Add 15 mins saved
      setBlockedDomains(prev =>
        prev.map(b => (interceptedDomain && (b.domain.includes(interceptedDomain) || interceptedDomain.includes(b.domain)))
          ? { ...b, minutesSaved: b.minutesSaved + 15 }
          : b
        )
      );

      // Boost today's delta
      setDeltaHistory(prev => {
        const copy = [...prev];
        const last = { ...copy[copy.length - 1] };
        last.distractionsAvoided += 1;
        last.performanceScore = Math.min(99, last.performanceScore + 2);
        copy[copy.length - 1] = last;
        return copy;
      });
    }

    const log: SecondThoughtInterception = {
      id: `inter_${Date.now()}`,
      domain: interceptedDomain || 'unknown',
      timestamp: new Date().toISOString(),
      reason: reason as 'boredom' | 'fatigue' | 'habit' | 'research',
      returnedToFocus,
      breathingSecondsCompleted: 10,
      pointsAwarded: returnedToFocus ? 35 : 0,
    };

    const savedLogs = localStorage.getItem('procastinot_interceptions');
    const parsedLogs = savedLogs ? JSON.parse(savedLogs) : [];
    localStorage.setItem('procastinot_interceptions', JSON.stringify([log, ...parsedLogs]));

    setInterceptionActive(false);
    setInterceptedDomain(null);
  };

  const joinRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setRooms(prev =>
      prev.map(r => ({
        ...r,
        isJoined: r.id === roomId,
        activeParticipants: r.id === roomId ? r.activeParticipants + 1 : (r.isJoined ? r.activeParticipants - 1 : r.activeParticipants),
      }))
    );
  };

  const leaveRoom = () => {
    if (!activeRoomId) return;
    setRooms(prev =>
      prev.map(r => ({
        ...r,
        isJoined: false,
        activeParticipants: r.id === activeRoomId ? Math.max(0, r.activeParticipants - 1) : r.activeParticipants,
      }))
    );
    setActiveRoomId(null);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const useStreakFreeze = (): boolean => {
    if (streakFreezes <= 0) return false;
    setStreakFreezes(prev => prev - 1);
    return true;
  };

  const recordFocusSession = (minutes: number, date?: string) => {
    const targetDate = date || formatLocalDate(new Date());
    setDailyRecords(prev => {
      const updated = {
        ...prev,
        [targetDate]: (prev[targetDate] || 0) + minutes,
      };
      saveUserDailyRecords(updated);
      const newStreak = calculateRealStreak(updated);
      setStreak(newStreak);
      setHeatmapDays(getRealHeatmapGrid(updated));
      return updated;
    });
  };

  const clearStudyTelemetry = () => {
    const empty: Record<string, number> = {};
    saveUserDailyRecords(empty);
    localStorage.removeItem('procastinot_sessions');
    setDailyRecords(empty);
    setStreak(0);
    setHeatmapDays(getRealHeatmapGrid(empty));
  };

  return (
    <GamificationContext.Provider
      value={{
        focusPoints,
        streak,
        streakFreezes,
        activeTheme,
        unlockedThemes,
        recordFocusSession,
        clearStudyTelemetry,
        blockedDomains,
        rooms,
        activeRoomId,
        leaderboard,
        heatmapDays,
        deltaHistory,
        notifications,
        interceptionActive,
        interceptedDomain,
        awardPoints,
        spendPoints,
        buyTheme,
        equipTheme,
        addBlockedDomain,
        removeBlockedDomain,
        triggerInterception,
        resolveInterception,
        joinRoom,
        leaveRoom,
        markNotificationRead,
        useStreakFreeze,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
