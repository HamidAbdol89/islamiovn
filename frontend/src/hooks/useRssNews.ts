// hooks/useRssNews.ts - FIXED VERSION
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Parser from 'rss-parser';

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  summary: string;
  publishedAt: string;
  link: string;
  source?: { name?: string; url?: string };
  language?: string;
}

export interface NewsItemRss {
  title: string;
  link: string;
  contentSnippet?: string;
  pubDate?: string;
  source?: string;
  image?: string;
}

export interface RssResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  news: NewsItemRss[];
}

// Sources: curated reliable Muslim publishers
const FEED_SOURCES: string[] = [
  'https://muslimmatters.org/feed/',
  'https://aboutislam.net/feed/',
  'https://ilmfeed.com/feed/',
  'https://themuslimvibe.com/feed',
  'https://seekersguidance.org/articles/feed/',
  'https://productivemuslim.com/feed/',
];

// Cache
const newsCache = new Map<string, { data: NewsItemRss[]; timestamp: number }>();
let combinedCache: { data: NewsItemRss[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const articleImageCache = new Map<string, { image: string | null; timestamp: number }>();
const ARTICLE_IMAGE_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper functions
const getCacheKey = (page: number, limit: number): string => `rss_${page}_${limit}`;
const isCacheValid = (timestamp: number): boolean => Date.now() - timestamp < CACHE_DURATION;

// FIXED: Proper proxy URL building
const buildProxyUrl = (targetUrl: string): string => {
  const proxyBase = import.meta.env.VITE_PROXY_URL;
  if (!proxyBase) {
    console.warn('VITE_PROXY_URL not configured');
    return '';
  }
  
  // Remove trailing slash from proxy base
  const cleanBase = proxyBase.replace(/\/$/, '');
  
  // Your worker accepts URL as query parameter
  return `${cleanBase}?url=${encodeURIComponent(targetUrl)}`;
};

// FIXED: Better CORS handling with your worker
async function fetchWithProxy(url: string, signal?: AbortSignal): Promise<string> {
  const proxyUrl = buildProxyUrl(url);
  if (!proxyUrl) {
    throw new Error('Proxy not configured');
  }

  console.log(`Fetching via proxy: ${proxyUrl}`);
  
  try {
    const response = await fetch(proxyUrl, { 
      method: 'GET', 
      signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Proxy returned ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    if (!text) {
      throw new Error('Empty response from proxy');
    }
    
    return text;
  } catch (error) {
    console.error(`Failed to fetch ${url} via proxy:`, error);
    throw error;
  }
}

function getText(el: Element | null, selector: string): string {
  if (!el) return '';
  const node = el.querySelector(selector);
  return (node?.textContent || '').trim();
}

function extractImageFromContent(html: string): string | null {
  if (!html || typeof html !== 'string') return null;
  
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  // Look for images in order of preference
  const selectors = [
    'picture source[srcset]',
    'img[srcset]',
    'img[src]',
    'img[data-src]',
    'img[data-original]',
    'img[data-lazy-src]'
  ];
  
  for (const selector of selectors) {
    const element = doc.querySelector(selector);
    if (element) {
      let imageUrl = '';
      
      if (selector.includes('srcset')) {
        const srcset = element.getAttribute('srcset') || '';
        imageUrl = pickBestFromSrcset(srcset) || '';
      } else {
        const attrs = ['src', 'data-src', 'data-original', 'data-lazy-src'];
        for (const attr of attrs) {
          const value = element.getAttribute(attr);
          if (value && !value.startsWith('data:')) {
            imageUrl = value;
            break;
          }
        }
      }
      
      if (imageUrl) return imageUrl;
    }
  }
  
  return null;
}

function pickBestFromSrcset(srcset: string): string | null {
  if (!srcset) return null;
  try {
    const candidates = srcset.split(',').map(s => s.trim()).map(entry => {
      const parts = entry.split(' ').filter(Boolean);
      return { url: parts[0], width: parseInt(parts[1]?.replace('w', '') || '0', 10) };
    });
    candidates.sort((a, b) => b.width - a.width);
    return candidates[0]?.url || null;
  } catch {
    return null;
  }
}

function normalizeUrl(url: string, baseUrl: string): string {
  if (!url || typeof url !== 'string') return '';
  if (!baseUrl || typeof baseUrl !== 'string') return url;
  if (/^https?:\/\//i.test(url)) return url;
  
  try {
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${new URL(baseUrl).origin}${url}`;
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|webp|gif|bmp|svg)(\?|#|$)/i.test(url);
}

// ENHANCED: Better image extraction from RSS items
function extractImageFromItem(item: Element, feedUrl: string): string {
  const baseUrl = new URL(feedUrl).origin;

  // 1) enclosure (image)
  const enclosure = item.querySelector('enclosure');
  if (enclosure) {
    const encUrl = enclosure.getAttribute('url') || '';
    const encType = (enclosure.getAttribute('type') || '').toLowerCase();
    if (encUrl && (encType.includes('image') || isImageUrl(encUrl))) {
      return normalizeUrl(encUrl, baseUrl);
    }
  }

  // 2) media:content (image)
  const mediaContents = Array.from(item.querySelectorAll('media\\:content')) as Element[];
  for (const mc of mediaContents) {
    const url = mc.getAttribute('url') || '';
    const type = (mc.getAttribute('type') || '').toLowerCase();
    const medium = (mc.getAttribute('medium') || '').toLowerCase();
    if (url && (type.startsWith('image/') || medium === 'image' || isImageUrl(url))) {
      return normalizeUrl(url, baseUrl);
    }
  }

  // 3) first <img> in content:encoded
  const contentHtml = getText(item, 'content\\:encoded');
  const imgFromContent = contentHtml ? extractImageFromContent(contentHtml) : null;
  if (imgFromContent) return normalizeUrl(imgFromContent, baseUrl);

  // 4) first <img> in description
  const descHtml = getText(item, 'description');
  const imgFromDesc = descHtml ? extractImageFromContent(descHtml) : null;
  if (imgFromDesc) return normalizeUrl(imgFromDesc, baseUrl);

  // Fallbacks
  const mediaThumb = item.querySelector('media\\:thumbnail');
  const thumbUrl = mediaThumb?.getAttribute('url');
  if (thumbUrl) return normalizeUrl(thumbUrl, baseUrl);

  const itunesImage = item.querySelector('itunes\\:image')?.getAttribute('href');
  if (itunesImage) return normalizeUrl(itunesImage, baseUrl);

  const imageTag = item.querySelector('image, img');
  const imgSrc = imageTag?.getAttribute('href') || imageTag?.getAttribute('src') || imageTag?.textContent?.trim() || '';
  if (imgSrc) return normalizeUrl(imgSrc, baseUrl);

  const wpFeatured = item.querySelector('wp\\:featured_image')?.textContent?.trim();
  if (wpFeatured) return normalizeUrl(wpFeatured, baseUrl);

  return getSourceFallbackImage(new URL(feedUrl).hostname);
}

// ADDED: Source-specific fallback images
function getSourceFallbackImage(hostname: string): string {
  const fallbacks: Record<string, string> = {
    'muslimmatters.org': 'https://muslimmatters.org/wp-content/uploads/2020/06/mm-logo-2020.png',
    'aboutislam.net': 'https://aboutislam.net/wp-content/uploads/2019/01/AboutIslam-Logo-1.png',
    'ilmfeed.com': 'https://ilmfeed.com/wp-content/uploads/2020/01/ilmfeed-logo.png',
    'islam21c.com': 'https://islam21c.com/wp-content/uploads/2019/11/Islam21c-Logo-Main.png',
    'themuslimvibe.com': 'https://themuslimvibe.com/wp-content/uploads/2020/01/TMV-Logo.png',
    'seekersguidance.org': 'https://seekersguidance.org/svg/seekers-guidance-logo.svg',
    'yaqeeninstitute.org': 'https://yaqeeninstitute.org/wp-content/uploads/2020/01/yaqeen-logo.png',
    'productivemuslim.com': 'https://productivemuslim.com/wp-content/uploads/2020/01/pm-logo.png'
  };
  
  return fallbacks[hostname] || '/default-news.jpg';
}

// ENHANCED: Better HTML meta image extraction
function extractImageFromHtmlDocument(html: string, baseOrigin: string): string | null {
  if (!html) return null;
  
  const doc = new DOMParser().parseFromString(html, 'text/html');
  
  // Meta tags in order of preference
  const metaSelectors = [
    'meta[property="og:image:secure_url"]',
    'meta[property="og:image:url"]', 
    'meta[property="og:image"]',
    'meta[name="twitter:image:src"]',
    'meta[name="twitter:image"]',
    'meta[itemprop="image"]',
    'meta[name="thumbnail"]'
  ];
  
  for (const selector of metaSelectors) {
    const content = doc.querySelector(selector)?.getAttribute('content');
    if (content) {
      const normalizedUrl = normalizeUrl(content, baseOrigin);
      console.log(`Found meta image (${selector}):`, normalizedUrl);
      return normalizedUrl;
    }
  }

  // Fallback to first image in content
  const firstImg = doc.querySelector('img');
  if (firstImg) {
    const src = firstImg.getAttribute('src') || firstImg.getAttribute('data-src');
    if (src) {
      return normalizeUrl(src, baseOrigin);
    }
  }

  return null;
}

// ENHANCED: Article image fetching with better error handling
async function fetchImageFromArticle(link: string, signal?: AbortSignal): Promise<string | null> {
  if (!link) return null;
  
  // Check cache
  const cached = articleImageCache.get(link);
  if (cached && Date.now() - cached.timestamp < ARTICLE_IMAGE_CACHE_DURATION) {
    return cached.image;
  }

  console.log('Fetching image from article:', link);
  
  try {
    const html = await fetchWithProxy(link, signal);
    const baseOrigin = new URL(link).origin;
    const image = extractImageFromHtmlDocument(html, baseOrigin);
    
    // Cache the result (even if null)
    articleImageCache.set(link, { image, timestamp: Date.now() });
    
    if (image) {
      console.log('Successfully extracted image from article:', image);
    }
    
    return image;
  } catch (error) {
    console.error('Failed to fetch article image:', error);
    // Cache the failure to avoid repeated requests
    articleImageCache.set(link, { image: null, timestamp: Date.now() });
    return null;
  }
}

function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s\s+/g, ' ')
    .trim();
}

function cleanText(text: string, maxLength = 300): string {
  if (!text) return '';
  let cleaned = stripHtml(text);
  if (cleaned.length > maxLength) {
    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    cleaned = (lastSpace > maxLength * 0.8) ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }
  return cleaned;
}

// Try to parse using rss-parser when available; fall back to DOM
async function parseWithRssParser(xml: string): Promise<any[]> {
  try {
    const parser = new Parser({
      customFields: {
        item: [
          ['media:content', 'mediaContent'],
          ['media:thumbnail', 'mediaThumbnail'],
          ['content:encoded', 'contentEncoded'],
          ['itunes:image', 'itunesImage'],
        ]
      }
    });
    const feed = await parser.parseString(xml);
    return Array.isArray(feed?.items) ? feed.items : [];
  } catch {
    return [];
  }
}

function pickImageFromParsedItem(item: any): string {
  // 1) enclosure image
  const encUrl = item?.enclosure?.url || '';
  const encType = (item?.enclosure?.type || '').toLowerCase();
  if (encUrl && (encType.includes('image') || isImageUrl(encUrl))) return encUrl;

  // 2) media:content
  const mc = item?.mediaContent;
  const mcUrl = (Array.isArray(mc) ? mc[0]?.$?.url : mc?.$?.url) || mc?.url || '';
  const mcType = ((Array.isArray(mc) ? mc[0]?.$?.type : mc?.$?.type) || '').toLowerCase();
  const mcMedium = ((Array.isArray(mc) ? mc[0]?.$?.medium : mc?.$?.medium) || '').toLowerCase();
  if (mcUrl && (mcType.startsWith('image/') || mcMedium === 'image' || isImageUrl(mcUrl))) return mcUrl;

  // 3) content:encoded first <img>
  const fromContent = item?.contentEncoded ? extractImageFromContent(item.contentEncoded) : null;
  if (fromContent) return fromContent;

  // 4) description first <img>
  const fromDesc = item?.content || item?.contentSnippet ? extractImageFromContent(item.content || item.contentSnippet) : null;
  if (fromDesc) return fromDesc;

  // 5) media:thumbnail
  const mt = item?.mediaThumbnail;
  const mtUrl = (Array.isArray(mt) ? mt[0]?.$?.url : mt?.$?.url) || mt?.url || '';
  if (mtUrl) return mtUrl;

  // 6) itunes:image
  const itunes = item?.itunesImage?.href || item?.itunesImage?.url || '';
  if (itunes) return itunes;

  return '';
}

function parseRss(xmlString: string, feedUrl: string, sourceName: string): NewsItemRss[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, 'application/xml');
  
  // Check for XML parsing errors
  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    console.error('XML parsing error:', parseError.textContent);
    throw new Error('Invalid RSS XML');
  }
  
  const items = Array.from(xml.querySelectorAll('item'));
  const channelImage = xml.querySelector('channel > image > url')?.textContent?.trim() || '';
  console.log(`Parsing ${items.length} items from ${sourceName}`);

  return items.map(item => {
    const title = getText(item, 'title') || 'No title';
    const link = normalizeUrl(getText(item, 'link') || '#', feedUrl);
    const contentRaw = getText(item, 'description') || getText(item, 'content\\:encoded');
    const contentSnippet = cleanText(contentRaw, 300);
    const pubDate = getText(item, 'pubDate') || getText(item, 'published') || getText(item, 'dc\\:date') || new Date().toISOString();
    let image = extractImageFromItem(item, feedUrl);
    if (!image && channelImage) {
      image = normalizeUrl(channelImage, feedUrl);
    }

    return { 
      title, 
      link, 
      contentSnippet, 
      pubDate, 
      source: sourceName, 
      image 
    } as NewsItemRss;
  });
}

async function fetchAllFeeds(signal?: AbortSignal): Promise<NewsItemRss[]> {
  // Check combined cache
  if (combinedCache && Date.now() - combinedCache.timestamp < CACHE_DURATION) {
    console.log('Using combined cache');
    return combinedCache.data;
  }

  console.log('Fetching all RSS feeds...');
  
  const results = await Promise.allSettled(
    FEED_SOURCES.map(async (url) => {
      console.log(`Fetching RSS: ${url}`);
      try {
        const xml = await fetchWithProxy(url, signal);
        const sourceName = new URL(url).hostname;
        // Try rss-parser first
        const parsed = await parseWithRssParser(xml);
        if (parsed.length) {
          console.log('Parsed with rss-parser');
          return parsed.map((it: any) => {
            const link = it.link || '#';
            const imgRaw = pickImageFromParsedItem(it) || '';
            const image = normalizeUrl(imgRaw, link || url);
            return {
              title: it.title || 'No title',
              link,
              contentSnippet: cleanText(it.contentEncoded || it.content || it.contentSnippet || ''),
              pubDate: it.isoDate || it.pubDate || new Date().toISOString(),
              source: sourceName,
              image
            } as NewsItemRss;
          });
        }
        // Fallback to DOM parsing
        return parseRss(xml, url, sourceName);
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error);
        return [];
      }
    })
  );

  // Combine results
  const merged: NewsItemRss[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      console.log(`Successfully fetched ${result.value.length} items from ${FEED_SOURCES[index]}`);
      merged.push(...result.value);
    }
  });

  console.log(`Total merged items: ${merged.length}`);

  // De-duplicate
  const seen = new Set<string>();
  const unique: NewsItemRss[] = [];
  
  for (const item of merged) {
    const key = item.link;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  console.log(`After deduplication: ${unique.length} items`);

  // Enhance images by fetching from articles (limit to avoid overload)
  const missingImages = unique
    .filter(item => !item.image || item.image.includes('/default-news.jpg'))
    .slice(0, 10); // Limit to 10 articles

  if (missingImages.length > 0) {
    console.log(`Fetching images for ${missingImages.length} articles...`);
    
    await Promise.allSettled(
      missingImages.map(async item => {
        const articleImage = await fetchImageFromArticle(item.link || '', signal);
        if (articleImage) {
          item.image = articleImage;
        }
      })
    );
  }

  // Sort by date
  unique.sort((a, b) => new Date(b.pubDate || '').getTime() - new Date(a.pubDate || '').getTime());

  // Cache results
  combinedCache = { data: unique, timestamp: Date.now() };
  console.log('RSS data cached successfully');

  return unique;
}

interface UseRssNewsReturn {
  news: NewsItemRss[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  refetch: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
}

export const useRssNews = (page = 1, limit = 10): UseRssNewsReturn => {
  const [news, setNews] = useState<NewsItemRss[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [pagination, setPagination] = useState(() => ({
    total: 0,
    currentPage: page,
    totalPages: 1,
    limit
  }));

  const currentRequestRef = useRef<AbortController | null>(null);
  const mountedRef = useRef<boolean>(true);
  const cacheKey = useMemo(() => getCacheKey(page, limit), [page, limit]);

  const processSafeNewsData = useCallback((newsData: NewsItemRss[]): NewsItemRss[] => {
    return newsData.map(item => ({
      ...item,
      image: (!item.image || item.image === 'null' || item.image === 'undefined') 
        ? '/logo.png' 
        : item.image,
      title: item.title || 'No title',
      link: item.link || '#',
      contentSnippet: item.contentSnippet || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: item.source || 'Unknown source'
    }));
  }, []);

  const fetchNewsData = useCallback(async (
    currentPage: number, 
    currentLimit: number, 
    isLoadMore = false
  ): Promise<void> => {
    // Cancel previous request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

    const controller = new AbortController();
    currentRequestRef.current = controller;

    try {
      // Check cache first
      const cached = newsCache.get(cacheKey);
      if (cached && isCacheValid(cached.timestamp)) {
        console.log(`Using cached data for page=${currentPage}, limit=${currentLimit}`);
        const safeData = processSafeNewsData(cached.data);
        
        if (mountedRef.current) {
          if (isLoadMore) {
            setNews(prev => [...prev, ...safeData]);
          } else {
            setNews(safeData);
          }
          setLoading(false);
          setLoadingMore(false);
        }
        return;
      }

      // Set loading states
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      console.log(`Fetching RSS data - page=${currentPage}, limit=${currentLimit}...`);

      const merged = await fetchAllFeeds(controller.signal);

      // Client-side pagination
      const start = (currentPage - 1) * currentLimit;
      const end = start + currentLimit;
      const pageSlice = merged.slice(start, end);

      const paginationData = {
        total: merged.length,
        currentPage,
        totalPages: Math.max(1, Math.ceil(merged.length / currentLimit)),
        limit: currentLimit
      };

      const safeNewsData = processSafeNewsData(pageSlice);
      
      // Cache the data
      newsCache.set(cacheKey, {
        data: safeNewsData,
        timestamp: Date.now()
      });

      // Update state if component is still mounted
      if (mountedRef.current) {
        if (isLoadMore) {
          setNews(prev => [...prev, ...safeNewsData]);
        } else {
          setNews(safeNewsData);
        }
        setPagination(paginationData);
        console.log('RSS news updated:', safeNewsData.length, 'items');
      }

    } catch (err: unknown) {
      const error = err as Error & { name?: string };
      
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        return;
      }

      console.error('RSS fetch error:', error.message);
      
      if (mountedRef.current) {
        setError(error.message || 'Cannot load news');
        if (!isLoadMore) {
          setNews([]);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [processSafeNewsData, cacheKey]);

  const refetch = useCallback(() => {
    newsCache.delete(cacheKey);
    combinedCache = null; // Clear combined cache too
    fetchNewsData(page, limit);
  }, [page, limit, fetchNewsData, cacheKey]);

  // Main effect to fetch data when page/limit changes
  useEffect(() => {
    mountedRef.current = true;
    fetchNewsData(page, limit);

    return () => {
      mountedRef.current = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [page, limit, fetchNewsData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && pagination.currentPage < pagination.totalPages) {
      fetchNewsData(pagination.currentPage + 1, pagination.limit, true);
    }
  }, [loadingMore, pagination.currentPage, pagination.totalPages, pagination.limit, fetchNewsData]);

  const hasMore = pagination.currentPage < pagination.totalPages;

  return {
    news,
    loading,
    error,
    pagination,
    refetch,
    hasMore,
    loadingMore,
    loadMore
  };
};