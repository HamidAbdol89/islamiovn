const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173','https://muslimviet.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Cache configuration
const CACHE_CONFIG = {
  maxAge: 6 * 60 * 60 * 1000, // 6 hours default cache
  checkInterval: 2 * 60 * 60 * 1000, // Check for updates every 2 hours
  maxCacheSize: 100, // Maximum number of cached feeds
  retryDelay: 30 * 1000 // 30 seconds retry on failure
};

// In-memory cache with metadata
class IntelligentCache {
  constructor() {
    this.cache = new Map();
    this.metadata = new Map();
    this.updateQueue = new Set();
    
    // Start background update process
    this.startBackgroundUpdates();
  }

  generateKey(scholarId) {
    return `rss_${scholarId}`;
  }

  generateContentHash(content) {
    return crypto.createHash('md5').update(JSON.stringify(content)).digest('hex');
  }

  set(scholarId, data, feedUrl) {
    const key = this.generateKey(scholarId);
    const now = Date.now();
    const contentHash = this.generateContentHash(data.episodes);
    
    // Store data
    this.cache.set(key, {
      data,
      timestamp: now,
      contentHash,
      accessCount: 1,
      lastAccess: now
    });

    // Store metadata for background updates
    this.metadata.set(key, {
      scholarId,
      feedUrl,
      lastCheck: now,
      updateFrequency: this.calculateUpdateFrequency(scholarId),
      failureCount: 0
    });

    // Clean up old entries if cache is too large
    this.cleanup();
  }

  get(scholarId) {
    const key = this.generateKey(scholarId);
    const cached = this.cache.get(key);
    
    if (cached) {
      // Update access statistics
      cached.accessCount++;
      cached.lastAccess = Date.now();
      return cached.data;
    }
    
    return null;
  }

  isValid(scholarId) {
    const key = this.generateKey(scholarId);
    const cached = this.cache.get(key);
    
    if (!cached) return false;
    
    const age = Date.now() - cached.timestamp;
    const maxAge = this.getMaxAge(scholarId);
    
    return age < maxAge;
  }

  getMaxAge(scholarId) {
    // Different cache times based on scholar popularity/update frequency
    const highFrequencyScholars = ['mufti-menk', 'nouman-ali-khan', 'omar-suleiman'];
    const mediumFrequencyScholars = ['yasir-qadhi', 'bilal-philips', 'hamza-yusuf'];
    
    if (highFrequencyScholars.includes(scholarId)) {
      return 2 * 60 * 60 * 1000; // 2 hours
    } else if (mediumFrequencyScholars.includes(scholarId)) {
      return 4 * 60 * 60 * 1000; // 4 hours
    }
    return CACHE_CONFIG.maxAge; // 6 hours default
  }

  calculateUpdateFrequency(scholarId) {
    // Return check interval in milliseconds
    const highFrequencyScholars = ['mufti-menk', 'nouman-ali-khan', 'omar-suleiman'];
    
    if (highFrequencyScholars.includes(scholarId)) {
      return 30 * 60 * 1000; // Check every 30 minutes
    }
    return CACHE_CONFIG.checkInterval; // Default 2 hours
  }

  shouldBackgroundUpdate(scholarId) {
    const key = this.generateKey(scholarId);
    const metadata = this.metadata.get(key);
    const cached = this.cache.get(key);
    
    if (!metadata || !cached) return false;
    
    const timeSinceLastCheck = Date.now() - metadata.lastCheck;
    const shouldUpdate = timeSinceLastCheck >= metadata.updateFrequency;
    
    // Also consider access frequency - update more often if accessed frequently
    const recentlyAccessed = (Date.now() - cached.lastAccess) < (60 * 60 * 1000); // 1 hour
    const highAccess = cached.accessCount > 10;
    
    return shouldUpdate || (recentlyAccessed && highAccess);
  }

  async backgroundUpdate(scholarId) {
    if (this.updateQueue.has(scholarId)) return;
    
    this.updateQueue.add(scholarId);
    
    try {
      const key = this.generateKey(scholarId);
      const metadata = this.metadata.get(key);
      const cached = this.cache.get(key);
      
      if (!metadata || !cached) {
        this.updateQueue.delete(scholarId);
        return;
      }

      console.log(`Background updating ${scholarId}...`);
      
      const newData = await this.fetchFreshData(scholarId, metadata.feedUrl);
      const newContentHash = this.generateContentHash(newData.episodes);
      
      // Only update if content actually changed
      if (newContentHash !== cached.contentHash) {
        console.log(`Content updated for ${scholarId}`);
        cached.data = newData;
        cached.contentHash = newContentHash;
        cached.timestamp = Date.now();
        metadata.failureCount = 0;
      }
      
      metadata.lastCheck = Date.now();
      
    } catch (error) {
      console.error(`Background update failed for ${scholarId}:`, error.message);
      const metadata = this.metadata.get(this.generateKey(scholarId));
      if (metadata) {
        metadata.failureCount++;
        // Exponential backoff for failed updates
        if (metadata.failureCount > 3) {
          metadata.updateFrequency *= 2;
        }
      }
    } finally {
      this.updateQueue.delete(scholarId);
    }
  }

  async fetchFreshData(scholarId, feedUrl) {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlData = await response.text();
    const parser = new xml2js.Parser({
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true
    });

    const result = await parser.parseStringPromise(xmlData);
    return this.parseEpisodes(result, scholarId);
  }

  parseEpisodes(result, scholarId) {
    const episodes = [];
    const items = result.rss?.channel?.item || [];
    const itemsArray = Array.isArray(items) ? items : [items];

    itemsArray.forEach((item, index) => {
      const episode = {
        id: `episode-${scholarId}-${index}`,
        title: item.title || 'Untitled Episode',
        description: cleanDescription(item.description || ''),
        audioUrl: getAudioUrl(item),
        duration: getDuration(item) || '00:00',
        publishDate: formatDate(item.pubDate || new Date().toISOString()),
        thumbnail: getThumbnail(item)
      };
      episodes.push(episode);
    });

    return {
      success: true,
      scholarId,
      episodes,
      cached: false,
      lastUpdated: new Date().toISOString()
    };
  }

  startBackgroundUpdates() {
    setInterval(() => {
      // Check all cached items for background updates
      for (const [key, metadata] of this.metadata.entries()) {
        if (this.shouldBackgroundUpdate(metadata.scholarId)) {
          // Don't await - run in background
          this.backgroundUpdate(metadata.scholarId).catch(console.error);
        }
      }
    }, 60000); // Check every minute
  }

  cleanup() {
    if (this.cache.size <= CACHE_CONFIG.maxCacheSize) return;
    
    // Remove least recently used items
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
    
    const toRemove = entries.slice(0, entries.length - CACHE_CONFIG.maxCacheSize);
    for (const [key] of toRemove) {
      this.cache.delete(key);
      this.metadata.delete(key);
    }
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      updateQueueSize: this.updateQueue.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        accessCount: value.accessCount,
        lastAccess: new Date(value.lastAccess).toISOString()
      }))
    };
  }
}

// Initialize cache
const cache = new IntelligentCache();

// Feed URLs mapping
const feedUrls = {
  'mufti-menk': 'https://feeds.acast.com/public/shows/669f8f9582b4e4eb3d88ad2e',
  'nouman-ali-khan': 'https://rss.muslimcentral.com/nouman-ali-khan.rss',
  'omar-suleiman': 'https://rss.muslimcentral.com/omar-suleiman.rss',
  'yasir-qadhi': 'https://rss.muslimcentral.com/yasir-qadhi.rss',
  'bilal-philips': 'https://muslimcentral.com/audio/bilal-philips/feed/',
  'hamza-yusuf': 'https://muslimcentral.com/audio/hamza-yusuf/feed/',
  'abdul-nasir-jangda': 'https://muslimcentral.com/audio/abdul-nasir-jangda/feed/',
  'wahaj-tarin': 'https://muslimcentral.com/audio/wahaj-tarin/feed/',
  'mohamed-hoblos': 'https://muslimcentral.com/audio/muhammad-hoblos/feed/',
  'haifaa-younis': 'https://rss.muslimcentral.com/haifaa-younis.rss',
  'abdulbary-yahya': 'https://rss.muslimcentral.com/abdulbary-yahya.rss',
  'zahir-mahmood': 'https://rss.muslimcentral.com/zahir-mahmood.rss',
  'taimiyyah-zubair': 'https://rss.muslimcentral.com/taimiyyah-zubair.rss',
  'hasan-ali': 'https://rss.muslimcentral.com/hasan-ali.rss',
  'shady-alsuleiman': 'https://rss.muslimcentral.com/shady-alsuleiman.rss',
  'moutasem-al-hameedy': 'https://rss.muslimcentral.com/moutasem-al-hameedy.rss',
  'muhammad-west': 'https://rss.muslimcentral.com/muhammad-west.rss',
  'muiz-bukhary': 'https://rss.muslimcentral.com/muiz-bukhary.rss',
};

// RSS Feed endpoint with intelligent caching
app.get('/api/rss/:scholarId', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { scholarId } = req.params;
    const { force } = req.query; // ?force=true to bypass cache
    
    const feedUrl = feedUrls[scholarId];
    if (!feedUrl) {
      return res.status(404).json({ error: 'Scholar not found' });
    }

    // Check cache first (unless force refresh)
    if (!force && cache.isValid(scholarId)) {
      const cachedData = cache.get(scholarId);
      if (cachedData) {
        const responseTime = Date.now() - startTime;
        console.log(`Cache HIT for ${scholarId} - Response time: ${responseTime}ms`);
        
        // Trigger background update if needed
        if (cache.shouldBackgroundUpdate(scholarId)) {
          cache.backgroundUpdate(scholarId).catch(console.error);
        }
        
        return res.json({
          ...cachedData,
          cached: true,
          responseTime,
          cacheAge: Date.now() - cache.cache.get(cache.generateKey(scholarId)).timestamp
        });
      }
    }

    // Fetch fresh data
    console.log(`Cache MISS for ${scholarId} - Fetching fresh data...`);
    
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      timeout: 15000
    });

    if (!response.ok) {
      // Try to serve stale cache if available
      const staleData = cache.get(scholarId);
      if (staleData) {
        console.log(`Serving stale cache for ${scholarId} due to fetch error`);
        return res.json({
          ...staleData,
          cached: true,
          stale: true,
          error: `Fresh data unavailable (HTTP ${response.status})`
        });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlData = await response.text();
    
    // Parse XML to JSON
    const parser = new xml2js.Parser({
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true
    });

    const result = await parser.parseStringPromise(xmlData);
    
    // Extract episodes from RSS feed
    const episodes = [];
    const items = result.rss?.channel?.item || [];
    const itemsArray = Array.isArray(items) ? items : [items];

    itemsArray.forEach((item, index) => {
      const episode = {
        id: `episode-${scholarId}-${index}`,
        title: item.title || 'Untitled Episode',
        description: cleanDescription(item.description || ''),
        audioUrl: getAudioUrl(item),
        duration: getDuration(item) || '00:00',
        publishDate: formatDate(item.pubDate || new Date().toISOString()),
        thumbnail: getThumbnail(item)
      };
      episodes.push(episode);
    });

    const responseData = {
      success: true,
      scholarId,
      episodes,
      cached: false,
      lastUpdated: new Date().toISOString(),
      responseTime: Date.now() - startTime
    };

    // Cache the result
    cache.set(scholarId, responseData, feedUrl);

    console.log(`Fresh data fetched for ${scholarId} - Response time: ${Date.now() - startTime}ms`);
    res.json(responseData);

  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    
    // Try to serve stale cache as fallback
    const staleData = cache.get(req.params.scholarId);
    if (staleData) {
      console.log(`Serving stale cache for ${req.params.scholarId} due to error`);
      return res.json({
        ...staleData,
        cached: true,
        stale: true,
        error: error.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch RSS feed',
      details: error.message,
      responseTime: Date.now() - startTime
    });
  }
});

// Cache management endpoints
app.get('/api/cache/stats', (req, res) => {
  res.json(cache.getStats());
});

app.post('/api/cache/clear', (req, res) => {
  const { scholarId } = req.body;
  
  if (scholarId) {
    const key = cache.generateKey(scholarId);
    cache.cache.delete(key);
    cache.metadata.delete(key);
    res.json({ success: true, message: `Cache cleared for ${scholarId}` });
  } else {
    cache.cache.clear();
    cache.metadata.clear();
    res.json({ success: true, message: 'All cache cleared' });
  }
});

// Warmup endpoint to preload popular feeds
app.post('/api/cache/warmup', async (req, res) => {
  const popularScholars = ['mufti-menk', 'nouman-ali-khan', 'omar-suleiman', 'yasir-qadhi'];
  const results = [];
  
  for (const scholarId of popularScholars) {
    try {
      if (!cache.isValid(scholarId)) {
        // Trigger background fetch
        cache.backgroundUpdate(scholarId).catch(console.error);
        results.push({ scholarId, status: 'warming' });
      } else {
        results.push({ scholarId, status: 'already_warm' });
      }
    } catch (error) {
      results.push({ scholarId, status: 'error', error: error.message });
    }
  }
  
  res.json({ success: true, results });
});

// Helper functions (unchanged)
function cleanDescription(description) {
  if (!description) return '';
  const cleanText = description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText;
}

function getAudioUrl(item) {
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  if (item.link && item.link.includes('.mp3')) {
    return item.link;
  }
  if (item['media:content'] && item['media:content'].url) {
    return item['media:content'].url;
  }
  return '';
}

function getDuration(item) {
  if (item['itunes:duration']) {
    return item['itunes:duration'];
  }
  if (item.duration) {
    return item.duration;
  }
  if (item['media:content'] && item['media:content'].duration) {
    const seconds = parseInt(item['media:content'].duration);
    return formatDuration(seconds);
  }
  return '00:00';
}

function getThumbnail(item) {
  if (item['itunes:image'] && item['itunes:image'].href) {
    return item['itunes:image'].href;
  }
  if (item.image && item.image.url) {
    return item.image.url;
  }
  if (item['media:thumbnail'] && item['media:thumbnail'].url) {
    return item['media:thumbnail'].url;
  }
  return undefined;
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cache: cache.getStats(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Optimized RSS Proxy server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`RSS endpoint: http://localhost:${PORT}/api/rss/:scholarId`);
  console.log(`Cache stats: http://localhost:${PORT}/api/cache/stats`);
  console.log(`Cache warmup: POST http://localhost:${PORT}/api/cache/warmup`);
});