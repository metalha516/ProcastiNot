import { HeatmapDay } from '../types';

/**
 * Format a Date object to YYYY-MM-DD using local calendar coordinates
 * to prevent timezone rollover discrepancies across midnight.
 */
export const formatLocalDate = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Maps minutes studied into GitHub-style intensity levels 0-4.
 */
export const getIntensityLevel = (minutes: number): 0 | 1 | 2 | 3 | 4 => {
  if (!minutes || minutes <= 0) return 0;
  if (minutes < 60) return 1;
  if (minutes < 120) return 2;
  if (minutes < 180) return 3;
  return 4;
};

/**
 * Generates a true 26-week (182-day) Monday-to-Sunday matrix ending on the current week's Sunday.
 * Every tile contains the real user study count (or 0 if unstudied). No random data is generated.
 */
export const getRealHeatmapGrid = (dailyStudy: Record<string, number> = {}): HeatmapDay[] => {
  const today = new Date();

  // In a Mon-Sun week: Monday is 0, Sunday is 6
  const dayOfWeek = (today.getDay() + 6) % 7;
  // Current week's Sunday
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() + (6 - dayOfWeek));

  // 26 weeks = 182 days. Start date is 181 days before current Sunday (always a Monday)
  const startDate = new Date(currentSunday);
  startDate.setDate(currentSunday.getDate() - 181);

  const days: HeatmapDay[] = [];
  for (let i = 0; i < 182; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = formatLocalDate(d);
    const count = dailyStudy[dateStr] || 0;
    const level = getIntensityLevel(count);

    days.push({
      date: dateStr,
      count,
      level,
    });
  }

  return days;
};

/**
 * Computes the user's authentic streak of consecutive study days.
 * - If user studied today, counts backward from today.
 * - If user has not yet studied today, but studied yesterday, the streak is maintained
 *   (counts backward from yesterday).
 * - If neither today nor yesterday had study, streak is 0.
 */
export const calculateRealStreak = (dailyStudy: Record<string, number> = {}): number => {
  const today = new Date();
  const todayStr = formatLocalDate(today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  const studiedToday = (dailyStudy[todayStr] || 0) > 0;
  const studiedYesterday = (dailyStudy[yesterdayStr] || 0) > 0;

  if (!studiedToday && !studiedYesterday) {
    return 0;
  }

  let streak = 0;
  const checkDate = new Date(studiedToday ? today : yesterday);

  while (true) {
    const dStr = formatLocalDate(checkDate);
    const minutes = dailyStudy[dStr] || 0;
    if (minutes > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const STORAGE_KEY = 'procastinot_daily_study';
const SESSIONS_KEY = 'procastinot_sessions';

/**
 * Loads the user's daily study minutes from localStorage,
 * combining manual study records and completed Pomodoro session logs.
 */
export const loadUserDailyRecords = (): Record<string, number> => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }

  const records: Record<string, number> = {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      Object.assign(records, JSON.parse(saved));
    }
  } catch (e) {
    console.error('Failed to parse procastinot_daily_study', e);
  }

  try {
    const sessionsRaw = localStorage.getItem(SESSIONS_KEY);
    if (sessionsRaw) {
      const sessions = JSON.parse(sessionsRaw);
      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          if (s.completed && s.timestamp) {
            const dateStr = formatLocalDate(new Date(s.timestamp));
            const mins = s.durationMinutes || 0;
            if (mins > 0 && !records[dateStr]) {
              records[dateStr] = mins;
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Failed to parse procastinot_sessions', e);
  }

  return records;
};

/**
 * Persists daily study records to localStorage.
 */
export const saveUserDailyRecords = (records: Record<string, number>): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save daily study records', e);
  }
};
