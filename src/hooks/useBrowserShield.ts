import { useEffect, useRef } from 'react';
import { useGamification } from '../context/GamificationContext';

const DEFAULT_BLOCKED_SITES = [
  'instagram.com',
  'tiktok.com',
  'twitter.com',
  'x.com',
  'reddit.com',
  'facebook.com',
  'youtube.com',
  'twitch.tv',
  'netflix.com',
  'threads.net',
  'snapchat.com',
  'discord.com',
  'pinterest.com',
  'tumblr.com',
  'linkedin.com',
];

export const useBrowserShield = () => {
  const { blockedDomains, triggerInterception } = useGamification();
  const blockedDomainsRef = useRef(blockedDomains);
  useEffect(() => {
    blockedDomainsRef.current = blockedDomains;
  }, [blockedDomains]);

  const isDomainBlocked = (targetUrlOrHost: string): string | null => {
    let hostname = targetUrlOrHost.toLowerCase().trim();
    try {
      if (hostname.includes('://')) {
        hostname = new URL(hostname).hostname.toLowerCase();
      } else if (hostname.includes('/')) {
        hostname = new URL('https://' + hostname).hostname.toLowerCase();
      }
    } catch {
      // String parsing fallback
      hostname = targetUrlOrHost.split('/')[0].split('?')[0].toLowerCase();
    }
    hostname = hostname.replace(/^(www|m|mobile)\./, '');

    for (const b of blockedDomainsRef.current) {
      const clean = b.domain.toLowerCase().replace(/^(www|m|mobile)\./, '');
      if (hostname === clean || hostname.endsWith('.' + clean) || clean.endsWith('.' + hostname)) {
        return clean;
      }
      if (clean.includes('x.com') && (hostname === 'twitter.com' || hostname === 'x.com')) {
        return 'x.com';
      }
    }

    for (const defaultDomain of DEFAULT_BLOCKED_SITES) {
      if (hostname === defaultDomain || hostname.endsWith('.' + defaultDomain)) {
        return defaultDomain;
      }
    }

    return null;
  };

  useEffect(() => {
    // 1. Check URL params upon initial load or back/forward navigation
    const checkRedirectParams = () => {
      try {
        const search = window.location.search;
        const hash = window.location.hash;

        if (search) {
          const params = new URLSearchParams(search);
          const blockedParam = params.get('blocked') || params.get('intercept') || params.get('site');
          if (blockedParam) {
            triggerInterception(blockedParam);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
        }

        if (hash.includes('blocked=')) {
          const match = hash.match(/blocked=([^&]+)/);
          if (match && match[1]) {
            triggerInterception(decodeURIComponent(match[1]));
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch {}
    };

    checkRedirectParams();
    window.addEventListener('popstate', checkRedirectParams);

    // 2. Intercept all link clicks across the entire document in capture phase
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (anchor) {
        if (anchor.getAttribute('data-bypass-shield') === 'true') {
          return;
        }
        const href = anchor.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          const matched = isDomainBlocked(href);
          if (matched) {
            e.preventDefault();
            e.stopPropagation();
            triggerInterception(matched);
            return;
          }
        }
      }

      // Check data-intercept-url elements
      const interceptElem = target.closest('[data-intercept-url]');
      if (interceptElem) {
        const url = interceptElem.getAttribute('data-intercept-url');
        if (url) {
          const matched = isDomainBlocked(url);
          if (matched) {
            e.preventDefault();
            e.stopPropagation();
            triggerInterception(matched);
            return;
          }
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, true);

    // 3. Intercept window.open calls across scripts/buttons
    const originalOpen = window.open;
    window.open = function (
      url?: string | URL,
      target?: string,
      features?: string
    ): Window | null {
      if (url) {
        const matched = isDomainBlocked(url.toString());
        if (matched) {
          triggerInterception(matched);
          return null;
        }
      }
      return originalOpen.call(window, url, target, features);
    };

    // 4. Inter-tab broadcast channel for browser extensions or companion tabs
    let channel: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('procastinot_shield');
        channel.onmessage = (ev) => {
          if (ev.data?.type === 'INTERCEPT' && ev.data?.domain) {
            triggerInterception(ev.data.domain);
          }
        };
      }
    } catch {}

    // 5. Cross-tab storage event listener
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'procastinot_external_intercept' && ev.newValue) {
        try {
          const data = JSON.parse(ev.newValue);
          if (data.domain) {
            triggerInterception(data.domain);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('popstate', checkRedirectParams);
      window.removeEventListener('click', handleGlobalClick, true);
      window.open = originalOpen;
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [triggerInterception]);

  return { isDomainBlocked };
};
