// ProcastiNot Chrome Extension Service Worker
const BLOCKED_DOMAINS = [
  'instagram.com',
  'tiktok.com',
  'twitter.com',
  'x.com',
  'reddit.com',
  'facebook.com',
  'twitch.tv',
  'netflix.com'
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    try {
      const url = new URL(changeInfo.url);
      const host = url.hostname.replace(/^www\./, '').toLowerCase();

      const matched = BLOCKED_DOMAINS.find(d => host === d || host.endsWith('.' + d));
      if (matched) {
        const target = `https://procastinot-nine.vercel.app/?blocked=${encodeURIComponent(matched)}`;
        chrome.tabs.update(tabId, { url: target });
      }
    } catch {
      // Ignore invalid URLs
    }
  }
});
