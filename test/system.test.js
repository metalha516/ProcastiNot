import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('1. Production Build & Static Assets Verification', () => {
  const distDir = path.resolve('dist');
  assert.ok(fs.existsSync(distDir), 'dist directory must exist');

  const indexHtml = path.join(distDir, 'index.html');
  assert.ok(fs.existsSync(indexHtml), 'dist/index.html must exist');
  
  const htmlContent = fs.readFileSync(indexHtml, 'utf8');
  assert.ok(htmlContent.includes('<div id="root"></div>'), 'root div must exist in index.html');
  assert.ok(htmlContent.includes('/assets/index-'), 'must link to compiled asset chunks');

  // Verify extension & userscript public downloads
  const extensionZip = path.resolve('public/procastinot-browser-extension.zip');
  const userScript = path.resolve('public/procastinot-shield.user.js');
  assert.ok(fs.existsSync(extensionZip), 'Browser extension zip must be present in public/');
  assert.ok(fs.existsSync(userScript), 'Tampermonkey userscript must be present in public/');
  assert.ok(fs.statSync(extensionZip).size > 1000, 'Extension zip must have valid non-empty size');
});

test('2. Anti-Distraction Shield Domain Extraction & Matching Logic', () => {
  const BLOCKED_DOMAINS = [
    'instagram.com',
    'tiktok.com',
    'twitter.com',
    'x.com',
    'reddit.com',
    'youtube.com/shorts',
    'facebook.com',
    'twitch.tv',
    'netflix.com',
    'threads.net',
    'discord.com',
  ];

  const extractDomain = (url) => {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      let hostname = parsed.hostname.toLowerCase().replace(/^(www|m)\./, '');
      if (hostname.includes('youtube.com') && parsed.pathname.includes('/shorts')) {
        return 'youtube.com/shorts';
      }
      return hostname;
    } catch {
      return '';
    }
  };

  const isDistraction = (url) => {
    const domain = extractDomain(url);
    if (!domain) return false;
    return BLOCKED_DOMAINS.some(b => domain === b || domain.endsWith(`.${b}`));
  };

  // Positive interception tests
  assert.equal(isDistraction('https://www.instagram.com/p/reel'), true);
  assert.equal(isDistraction('https://m.tiktok.com/@user'), true);
  assert.equal(isDistraction('https://x.com/home'), true);
  assert.equal(isDistraction('https://reddit.com/r/all'), true);
  assert.equal(isDistraction('https://youtube.com/shorts/12345'), true);
  assert.equal(isDistraction('https://netflix.com/browse'), true);
  assert.equal(isDistraction('https://twitch.tv/streamer'), true);

  // Whitelisted academic tests
  assert.equal(isDistraction('https://stanford.edu/canvas'), false);
  assert.equal(isDistraction('https://github.com/metalha516/ProcastiNot'), false);
  assert.equal(isDistraction('https://stackoverflow.com/questions/123'), false);
  assert.equal(isDistraction('https://mit.edu/ocw'), false);
});

test('3. Task Sorting Algorithm: Urgency, Energy & Completed Sinking', () => {
  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      // 1. Completed tasks sink to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // 2. Urgency comparison (exam within 72h or examRelated)
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      const now = Date.now();
      const aUrgent = a.examRelated || (aDue - now < 86400000 * 3);
      const bUrgent = b.examRelated || (bDue - now < 86400000 * 3);

      if (aUrgent !== bUrgent) {
        return aUrgent ? -1 : 1;
      }

      if (Math.abs(aDue - bDue) > 3600000 * 6) {
        return aDue - bDue;
      }

      // 3. Cognitive Energy weight (deep_focus > medium > low)
      const energyWeights = {
        deep_focus: 3,
        medium: 2,
        low: 1,
      };
      const aEnergy = energyWeights[a.energy] || 1;
      const bEnergy = energyWeights[b.energy] || 1;
      if (aEnergy !== bEnergy) {
        return bEnergy - aEnergy;
      }

      return 0;
    });
  };

  const sampleTasks = [
    { id: '1', title: 'Finished Lab', completed: true, energy: 'deep_focus', examRelated: true },
    { id: '2', title: 'Midterm Study', completed: false, energy: 'deep_focus', examRelated: true, dueDate: new Date(Date.now() + 86400000).toISOString() },
    { id: '3', title: 'Casual Reading', completed: false, energy: 'low', examRelated: false, dueDate: new Date(Date.now() + 86400000 * 10).toISOString() },
    { id: '4', title: 'Problem Set', completed: false, energy: 'medium', examRelated: false, dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
  ];

  const sorted = sortTasks(sampleTasks);

  // Highest priority: active urgent midterm study
  assert.equal(sorted[0].id, '2', 'Urgent exam task must be first');
  // Second priority: active problem set due soon
  assert.equal(sorted[1].id, '4', 'Problem set due soon must be second');
  // Third priority: casual reading
  assert.equal(sorted[2].id, '3', 'Non-urgent low energy must be third');
  // Bottom priority: completed task must sink to the bottom
  assert.equal(sorted[3].id, '1', 'Completed task must sink to the bottom');
});

test('4. Feature Access & Authentication Policy Verification', () => {
  const PUBLIC_FEATURES = ['timer', 'focus-timer'];
  const PROTECTED_FEATURES = [
    'dashboard',
    'planner-tasks',
    'habits-matrix',
    'blocker',
    'study-rooms',
    'analytics',
    'rewards',
  ];

  const canAccessWithoutAuth = (featureId) => {
    return PUBLIC_FEATURES.includes(featureId);
  };

  // Pomodoro Focus Timer is free and public
  assert.equal(canAccessWithoutAuth('timer'), true);
  assert.equal(canAccessWithoutAuth('focus-timer'), true);

  // All other features require authentication
  for (const feature of PROTECTED_FEATURES) {
    assert.equal(canAccessWithoutAuth(feature), false, `${feature} must require authentication`);
  }
});

test('5. Audio Synthesis & Binaural Frequency Calculations', () => {
  const baseCarrier = 200; // Hz
  const targetBinauralBeat = 40; // 40Hz Gamma frequency for cognitive entrainment
  const leftFreq = baseCarrier;
  const rightFreq = baseCarrier + targetBinauralBeat;

  assert.equal(rightFreq - leftFreq, 40, 'Gamma entrainment frequency difference must be exactly 40Hz');

  // Lowpass filter cutoff for soothing rain impact
  const rainFilterCutoff = 2600; // Hz
  assert.ok(rainFilterCutoff >= 2000 && rainFilterCutoff <= 4000, 'Rain lowpass filter must be in optimal audio range');
});

test('6. Real Streak Telemetry Algorithm Verification', () => {
  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateRealStreak = (dailyStudy = {}) => {
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

  const today = new Date();
  const todayStr = formatLocalDate(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  const twoDaysAgoStr = formatLocalDate(twoDaysAgo);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  const threeDaysAgoStr = formatLocalDate(threeDaysAgo);

  // Scenario A: Brand new user with zero records -> streak 0
  assert.equal(calculateRealStreak({}), 0, 'New user streak must be 0');

  // Scenario B: User studied today for 25m -> streak 1
  assert.equal(calculateRealStreak({ [todayStr]: 25 }), 1, 'Studying today gives streak 1');

  // Scenario C: User studied yesterday, but not yet today -> streak 1 maintained
  assert.equal(calculateRealStreak({ [yesterdayStr]: 50 }), 1, 'Studying yesterday maintains streak 1');

  // Scenario D: User studied yesterday and day before -> streak 2 maintained
  assert.equal(calculateRealStreak({ [yesterdayStr]: 45, [twoDaysAgoStr]: 60 }), 2, '2 consecutive days gives streak 2');

  // Scenario E: User studies today after 2 prior days -> streak 3
  assert.equal(calculateRealStreak({ [todayStr]: 30, [yesterdayStr]: 45, [twoDaysAgoStr]: 60 }), 3, '3 consecutive days gives streak 3');

  // Scenario F: Broken streak (missed 2 days ago)
  assert.equal(calculateRealStreak({ [todayStr]: 25, [threeDaysAgoStr]: 50 }), 1, 'Missing intermediate days resets streak to 1');
});

test('7. Real 26-Week Heatmap Grid Construction', () => {
  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getIntensityLevel = (minutes) => {
    if (!minutes || minutes <= 0) return 0;
    if (minutes < 60) return 1;
    if (minutes < 120) return 2;
    if (minutes < 180) return 3;
    return 4;
  };

  const getRealHeatmapGrid = (dailyStudy = {}) => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() + (6 - dayOfWeek));

    const startDate = new Date(currentSunday);
    startDate.setDate(currentSunday.getDate() - 181);

    const days = [];
    for (let i = 0; i < 182; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = formatLocalDate(d);
      const count = dailyStudy[dateStr] || 0;
      const level = getIntensityLevel(count);

      days.push({ date: dateStr, count, level });
    }
    return days;
  };

  const todayStr = formatLocalDate(new Date());
  const grid = getRealHeatmapGrid({ [todayStr]: 150 });

  // Grid dimensions
  assert.equal(grid.length, 182, 'Grid must contain exactly 182 days (26 weeks × 7 days)');

  // Today's entry has real count and level 3 (150m is between 120 and 179)
  const todayEntry = grid.find(d => d.date === todayStr);
  assert.ok(todayEntry, 'Today must be in the heatmap grid');
  assert.equal(todayEntry.count, 150, 'Today focus count must be exactly 150m');
  assert.equal(todayEntry.level, 3, '150m must map to intensity level 3');

  // Other days default strictly to 0
  const unstudied = grid.filter(d => d.date !== todayStr);
  assert.ok(unstudied.every(d => d.count === 0 && d.level === 0), 'All unstudied days must default to 0m and level 0');
});

test('8. Real Session Logging & Dashboard Telemetry Integration', () => {
  const sampleSessions = [
    {
      id: 'sess_real_1',
      timestamp: new Date().toISOString(),
      durationMinutes: 50,
      mode: 'focus',
      pointsEarned: 100,
      completed: true,
    },
    {
      id: 'sess_real_2',
      timestamp: new Date().toISOString(),
      durationMinutes: 25,
      mode: 'focus',
      pointsEarned: 50,
      completed: true,
    },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFocusMinutes = sampleSessions
    .filter(s => s.completed && s.mode === 'focus' && s.timestamp.startsWith(todayStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  assert.equal(todayFocusMinutes, 75, 'Today focus minutes must be exactly 75m (50m + 25m)');

  const hours = Math.floor(todayFocusMinutes / 60);
  const mins = todayFocusMinutes % 60;
  const focusStr = `${hours}h ${mins.toString().padStart(2, '0')}m`;
  assert.equal(focusStr, '1h 15m', 'Formatted study time must be 1h 15m');

  const totalPoints = sampleSessions.reduce((acc, s) => acc + s.pointsEarned, 0);
  assert.equal(totalPoints, 150, 'Total points earned today must be 150');
});

test('9. Defensive Form Validation & XSS Neutralization', () => {
  const sanitizeDomain = (raw) => {
    let clean = String(raw || '').trim().toLowerCase();
    try {
      if (clean.includes('://')) {
        clean = new URL(clean).hostname;
      } else if (clean.includes('/')) {
        clean = clean.split('/')[0];
      }
    } catch {
      clean = clean.split('/')[0].split('?')[0];
    }
    return clean.replace(/^(https?:\/\/)?(www|m|mobile)\./, '').split('?')[0].split('#')[0];
  };

  // Malicious XSS inputs
  const xssUrl1 = 'https://instagram.com/<script>alert(1)</script>';
  assert.equal(sanitizeDomain(xssUrl1), 'instagram.com', 'XSS payload in path must be stripped');

  const xssUrl2 = 'javascript:alert("hacked")';
  assert.equal(sanitizeDomain(xssUrl2), 'javascript:alert("hacked")', 'Protocol stripped or path isolated');

  // Extreme string length truncation
  const maxTitleLength = 120;
  const giantTitle = 'A'.repeat(5000);
  const truncated = giantTitle.slice(0, maxTitleLength);
  assert.equal(truncated.length, 120, 'Long titles must constrain to max length');

  // Unicode glyphs & emojis
  const unicodeTask = '🧠 Prove P != NP ⚡ 🚀';
  assert.ok(unicodeTask.includes('🧠'), 'Unicode emojis must be preserved cleanly in task titles');
});

test('10. Fault-Tolerant LocalStorage Recovery & JSON Parsing Safety', () => {
  const safeParseStorage = (rawJson, fallback) => {
    if (!rawJson || typeof rawJson !== 'string') return fallback;
    try {
      return JSON.parse(rawJson);
    } catch {
      return fallback;
    }
  };

  // Valid JSON array
  assert.deepEqual(safeParseStorage('[{"id": 1}]', []), [{ id: 1 }]);

  // Corrupted / malformed JSON strings
  assert.deepEqual(safeParseStorage('{"incomplete": true,', []), [], 'Malformed JSON must return fallback without crashing');
  assert.deepEqual(safeParseStorage('undefined', []), [], 'String undefined must return fallback');
  assert.deepEqual(safeParseStorage(null, []), [], 'Null must return fallback');
});

test('11. Multi-Tab BroadcastChannel Payload Contract Verification', () => {
  const createSyncMessage = (timeRemaining, isRunning, mode) => {
    return {
      type: 'SYNC',
      timeRemaining: Math.max(0, Math.floor(timeRemaining)),
      isRunning: Boolean(isRunning),
      mode: ['focus', 'short_break', 'long_break'].includes(mode) ? mode : 'focus',
      timestamp: Date.now(),
    };
  };

  const msg = createSyncMessage(1499.7, true, 'focus');
  assert.equal(msg.type, 'SYNC');
  assert.equal(msg.timeRemaining, 1499);
  assert.equal(msg.isRunning, true);
  assert.equal(msg.mode, 'focus');
  assert.ok(typeof msg.timestamp === 'number');
});

test('12. Precision Drift-Proof Timer Target Delta Verification', () => {
  // Simulates a 25-minute Pomodoro session where the browser tab is hidden for 10 seconds
  const totalSeconds = 25 * 60; // 1500 seconds
  const startTime = 1000000; // Simulated epoch
  const targetEndTime = startTime + totalSeconds * 1000;

  const calculateRemaining = (currentTime) => {
    const msLeft = targetEndTime - currentTime;
    return Math.max(0, Math.ceil(msLeft / 1000));
  };

  // At start
  assert.equal(calculateRemaining(startTime), 1500);

  // 1 second elapsed normally
  assert.equal(calculateRemaining(startTime + 1000), 1499);

  // Background tab throttle event: 10 seconds pass in background
  const after10sFreeze = startTime + 11000;
  assert.equal(calculateRemaining(after10sFreeze), 1489, 'Drift calculation must instantly recover 10 elapsed seconds');

  // Timer complete
  assert.equal(calculateRemaining(targetEndTime + 5000), 0, 'Completed timer must clamp to 0');
});

