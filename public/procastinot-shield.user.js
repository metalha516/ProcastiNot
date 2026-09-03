// ==UserScript==
// @name         ProcastiNot Distraction Shield & Mindfulness Interceptor
// @namespace    https://procastinot.app/
// @version      1.2
// @description  Intercepts doom-scrolling & social media URLs across all browser tabs and redirects you to the 10-second Second-Thought Mindfulness Gate.
// @author       ProcastiNot Team
// @match        *://*.instagram.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.reddit.com/*
// @match        *://*.facebook.com/*
// @match        *://*.youtube.com/shorts*
// @match        *://*.twitch.tv/*
// @match        *://*.netflix.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const hostname = window.location.hostname.replace(/^(www|m|mobile)\./, '');
  const appTarget = 'http://localhost:5173/?blocked=' + encodeURIComponent(hostname);

  try {
    window.stop();
  } catch (e) {}

  window.location.replace(appTarget);
})();
