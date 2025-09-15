import { useCallback } from 'react';
import type { Scholar } from '../types';
import type { PodcastEpisode } from '../types';
import { FEED_URLS } from '../constants';

// Memoized error messages in Vietnamese
const ERROR_MESSAGES = {
  FETCH_FAILED: 'Gặp lỗi khi tải dữ liệu. Vui lòng thử lại.',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  FEED_NOT_FOUND: 'Không tìm thấy RSS cho học giả này.',
} as const;

const ENV_PROXY = (url: string) => {
  const base = import.meta.env.VITE_PROXY_URL as string | undefined;
  if (!base) return '';
  // Support either .../?url= or .../<encoded>
  if (base.includes('?')) return `${base}${base.endsWith('=') ? '' : (base.endsWith('?') ? '' : '&')}url=${encodeURIComponent(url)}`;
  return `${base.replace(/\/$/, '')}/${encodeURIComponent(url)}`;
};

const CORS_PROXIES = [
  (url: string) => ENV_PROXY(url),
  // Simple, public CORS proxies as fallbacks
  (url: string) => `https://api.allorigins.win/raw?nocache=1&url=${encodeURIComponent(url)}`,
  (url: string) => {
    const stripped = url.replace(/^https?:\/\//, '');
    const isHttps = url.startsWith('https://');
    return `https://r.jina.ai/${isHttps ? 'https' : 'http'}://${stripped}`;
  },
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

function textContent(node: Element | null, selector: string): string {
  if (!node) return '';
  const el = node.querySelector(selector);
  return (el?.textContent || '').trim();
}

function attr(node: Element | null, selector: string, name: string): string {
  if (!node) return '';
  const el = node.querySelector(selector);
  return (el?.getAttribute(name) || '').trim();
}

function parseDurationToHms(input: string): string {
  if (!input) return '';
  // Supports formats like 1234, 12:34, 01:02:03
  const parts = input.split(':').map(p => parseInt(p, 10)).filter(n => !Number.isNaN(n));
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  if (parts.length === 2) {
    const [m, s] = parts;
    return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  if (parts.length === 1) {
    const s = parts[0];
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  return '';
}

function parseRss(xmlString: string): PodcastEpisode[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, 'application/xml');
  const itemNodes = Array.from(xml.querySelectorAll('item'));

  return itemNodes.map((item, index) => {
    const enclosure = item.querySelector('enclosure');
    const audioUrl = enclosure?.getAttribute('url') || textContent(item, 'link');

    const itunesNs = (selector: string) => item.querySelector(`itunes\\:${selector}`) || item.querySelector(selector);
    const title = textContent(item, 'title');
    const description = textContent(item, 'description') || (itunesNs('summary')?.textContent || '').trim();
    const durationRaw = (itunesNs('duration')?.textContent || '').trim();
    const duration = parseDurationToHms(durationRaw);
    const publishDate = textContent(item, 'pubDate') || textContent(item, 'published') || '';
    const thumbnail = item.querySelector('itunes\\:image')?.getAttribute('href')
      || attr(item, 'image', 'href')
      || '';

    return {
      id: `${index}-${title}`,
      title,
      description,
      audioUrl: audioUrl || '',
      duration,
      publishDate,
      thumbnail,
      index,
    } as PodcastEpisode;
  }).filter(ep => ep.audioUrl);
}

async function fetchWithCorsFallback(url: string): Promise<string> {
  // Try proxies first to avoid noisy CORS errors in console
  for (const wrap of CORS_PROXIES) {
    const proxiedUrl = wrap(url);
    if (!proxiedUrl) continue;
    try {
      const resp = await fetch(proxiedUrl, { method: 'GET' });
      if (resp.ok) {
        const text = await resp.text();
        if (text) return text;
      }
    } catch (_) {
      // try next
    }
  }

  // Fallback: try direct (may be blocked by CORS)
  try {
    const resp = await fetch(url, { method: 'GET' });
    if (resp.ok) {
      const text = await resp.text();
      if (text) return text;
    }
  } catch (_) {
    // swallow
  }

  throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
}

export const useRssFeed = () => {
  const fetchRSSFeed = useCallback(async (
    scholarId: string,
    setScholars: React.Dispatch<React.SetStateAction<Scholar[]>>
  ): Promise<void> => {
    try {
      setScholars(prev => prev.map(s =>
        s.id === scholarId ? { ...s, isLoading: true, error: undefined } : s
      ));

      const feedUrl = FEED_URLS[scholarId];
      if (!feedUrl) {
        throw new Error(ERROR_MESSAGES.FEED_NOT_FOUND);
      }

      const xml = await fetchWithCorsFallback(feedUrl);
      const episodes = parseRss(xml);

      setScholars(prev => prev.map(s =>
        s.id === scholarId
          ? { ...s, episodes, isLoading: false, error: undefined }
          : s
      ));

    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.FETCH_FAILED;

      setScholars(prev => prev.map(s =>
        s.id === scholarId
          ? { ...s, isLoading: false, error: errorMessage }
          : s
      ));
    }
  }, []);

  const retryFetch = useCallback((
    scholarId: string,
    scholars: Scholar[],
    setScholars: React.Dispatch<React.SetStateAction<Scholar[]>>
  ) => {
    const scholar = scholars.find(s => s.id === scholarId);
    if (scholar) {
      fetchRSSFeed(scholarId, setScholars);
    }
  }, [fetchRSSFeed]);

  return {
    fetchRSSFeed,
    retryFetch,
  };
};
