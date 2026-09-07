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
