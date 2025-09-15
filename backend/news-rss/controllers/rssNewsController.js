// /media/hamid/D/muslimviet/backend/api/controllers/rssNewsController.js
const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const { URL } = require('url');
let limitConcurrency;

// Cấu hình cho Render
const RENDER_CONFIG = {
  DEFAULT_IMAGE: 'https://api-rss-news.fly.dev/default-news.jpg',
  REQUEST_TIMEOUT: 30000,
  CONCURRENT_REQUESTS: 5,
  FRONTEND_URL: 'https://muslimviet.vercel.app',
  // Timeout ngắn hơn cho việc lấy ảnh để tránh block
  IMAGE_FETCH_TIMEOUT: 3000,
  // Max retries cho việc fetch ảnh
  MAX_IMAGE_RETRIES: 2
};

// Cấu hình cache
const rssCache = new NodeCache({
  stdTTL: 1800, // 30 phút
  checkperiod: 300,
  maxKeys: 200
});

const feedCache = new NodeCache({
  stdTTL: 3600, // 1 giờ cho từng feed
  checkperiod: 600,
  maxKeys: 50
});

// Cache riêng cho images để tránh fetch lại những URL đã failed
const imageCache = new NodeCache({
  stdTTL: 7200, // 2 giờ
  checkperiod: 600,
  maxKeys: 1000
});

// Khởi tạo p-limit
(async () => {
  const pLimit = (await import('p-limit')).default;
  limitConcurrency = pLimit(RENDER_CONFIG.CONCURRENT_REQUESTS);
})();

// Cấu hình parser với headers tốt hơn
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['media:thumbnail', 'thumbnail'],
      ['content:encoded', 'contentEncoded'],
      ['description', 'description'],
      ['enclosure', 'enclosure'],
      ['image', 'image'],
      ['itunes:image', 'itunesImage']
    ],
    feed: [
      ['image', 'feedImage'],
      ['logo', 'logo']
    ]
  },
  timeout: RENDER_CONFIG.REQUEST_TIMEOUT,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Danh sách nguồn tin RSS
const rssFeeds = [
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://aboutislam.net/feed/',
  'https://productivemuslim.com/feed/',
  'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml'
];

// Danh sách User-Agents để rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59'
];

// Danh sách domains có thể bị block - sẽ skip image fetch
const BLOCKED_DOMAINS = [
  'nytimes.com',
  'wsj.com', 
  'ft.com',
  'economist.com'
];

// Domains chậm - giảm timeout
const SLOW_DOMAINS = [
  'aboutislam.net',
  'productivemuslim.com'
];

/**
 * Kiểm tra xem domain có bị block không
 */
function isDomainBlocked(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return BLOCKED_DOMAINS.some(blockedDomain => 
      domain.includes(blockedDomain)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Kiểm tra xem domain có chậm không
 */
function isDomainSlow(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return SLOW_DOMAINS.some(slowDomain => 
      domain.includes(slowDomain)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Lấy random User-Agent
 */
function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Xử lý song song nhiều feed
 */
async function fetchFeedsParallel(feedsToProcess) {
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < feedsToProcess.length; i += batchSize) {
    const batch = feedsToProcess.slice(i, i + batchSize);
    const batchPromises = batch.map(url => 
      limitConcurrency(() => parseFeed(url).catch(e => {
        console.error(`Lỗi khi xử lý ${url}:`, e.message);
        return [];
      })
    ));
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.flat());
    
    if (i + batchSize < feedsToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Phân tích feed RSS với cache và error handling tốt hơn
 */
const parseFeed = async (feedUrl) => {
  const cacheKey = `feed_${feedUrl}`;
  const cached = feedCache.get(cacheKey);
  if (cached) return cached;

  try {
    let feed;
    try {
      feed = await parser.parseURL(feedUrl);
    } catch (initialError) {
      console.warn(`[RETRY] RSS parser lỗi với ${feedUrl}: ${initialError.message}`);
      try {
        const response = await axios.get(feedUrl, {
          timeout: RENDER_CONFIG.REQUEST_TIMEOUT,
          responseType: 'text',
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'application/rss+xml, application/xml, text/xml, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache'
          }
        });
        feed = await parser.parseString(response.data);
      } catch (retryError) {
        console.error(`[FAIL] Không thể lấy RSS từ ${feedUrl}:`, retryError.message);
        return [];
      }
    }

    let sourceName = '';
    try {
      sourceName = feed.title || new URL(feedUrl).hostname.replace(/^www\./, '');
    } catch (err) {
      const urlMatch = feedUrl.match(/https?:\/\/(?:www\.)?([^\/]+)/i);
      sourceName = urlMatch ? urlMatch[1] : 'Nguồn không xác định';
    }

    const feedLogo = feed.feedImage?.url || feed.logo?.url || feed.image?.url || null;

    // Xử lý items với error handling tốt hơn
    const itemsToProcess = feed.items.slice(0, 30);
    const articles = await Promise.all(itemsToProcess.map(async (item) => {
      try {
        let image = await extractImageFromMultipleSources(item, feedUrl);
        
        // Chỉ fetch image từ HTML nếu không bị block và có link
        if (!image && item.link && !isDomainBlocked(item.link)) {
          image = await getBestImageFromHtml(item.link);
        }
        
        if (!image) {
          image = feedLogo || RENDER_CONFIG.DEFAULT_IMAGE;
        }

        // Fix lỗi url.match is not a function
        if (image && typeof image === 'string') {
          try {
            const baseUrl = item.link ? new URL(item.link).origin : new URL(feedUrl).origin;
            image = normalizeUrl(image, baseUrl);
          } catch (normError) {
            console.warn(`Không thể normalize URL image: ${image}`, normError.message);
            image = feedLogo || RENDER_CONFIG.DEFAULT_IMAGE;
          }
        } else {
          image = feedLogo || RENDER_CONFIG.DEFAULT_IMAGE;
        }

        return {
          title: item.title?.trim() || 'Không có tiêu đề',
          link: item.link || feedUrl,
          contentSnippet: getCleanContentSnippet(item),
          fullContent: getFullContent(item),
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          source: sourceName,
          sourceUrl: feedUrl,
          sourceLogo: feedLogo,
          image,
          categories: item.categories || [],
          author: item.creator || item.author || item.dc?.creator || 'Không xác định'
        };
      } catch (itemError) {
        console.warn(`Lỗi xử lý item từ ${sourceName}:`, itemError.message);
        return null;
      }
    }));

    const filtered = articles
      .filter(item => item && item.title && item.link)
      .map(item => {
        try {
          if (item.link && typeof item.link === 'string') {
            const baseUrl = new URL(feedUrl).origin;
            item.link = normalizeUrl(item.link, baseUrl);
          }
        } catch (e) {
          // Giữ nguyên link nếu không thể normalize
        }
        return item;
      });

    feedCache.set(cacheKey, filtered);
    return filtered;
  } catch (err) {
    console.error(`[ERROR] Lỗi khi xử lý RSS ${feedUrl}:`, err.message);
    return [];
  }
};

/**
 * Trích xuất hình ảnh từ nhiều nguồn khác nhau trong item RSS
 */
async function extractImageFromMultipleSources(item, feedUrl) {
  const possibleSources = [
    item.media?.$?.url,
    Array.isArray(item.media) ? item.media[0]?.$?.url : null,
    item.thumbnail?.$?.url,
    Array.isArray(item.thumbnail) ? item.thumbnail[0]?.$?.url : null,
    item.enclosure?.url,
    Array.isArray(item.enclosure) ? item.enclosure.find(e => e.type?.startsWith('image/'))?.url : null,
    item.itunesImage?.href,
    item['itunes:image']?.href,
    item.image?.url,
    extractImageFromContent(item.contentEncoded),
    extractImageFromContent(item.content),
    extractImageFromContent(item.description)
  ];
  
  for (const source of possibleSources) {
    if (source && typeof source === 'string' && !source.includes('data:image')) {
      return source;
    }
  }
  
  return null;
}

/**
 * Lấy hình ảnh từ HTML với cache và better error handling
 */
async function getBestImageFromHtml(url) {
  // Kiểm tra cache trước
  const cacheKey = `img_${url}`;
  const cached = imageCache.get(cacheKey);
  if (cached) return cached;
  
  // Kiểm tra nếu URL đã failed trước đó
  const failedKey = `failed_${url}`;
  if (imageCache.get(failedKey)) {
    return null;
  }

  // Skip nếu domain bị block
  if (isDomainBlocked(url)) {
    console.log(`⚠️ Bỏ qua fetch ảnh từ domain bị block: ${url}`);
    imageCache.set(failedKey, true, 3600); // Cache failed 1 giờ
    return null;
  }

  const timeout = isDomainSlow(url) ? 2000 : RENDER_CONFIG.IMAGE_FETCH_TIMEOUT;

  try {
    const htmlRes = await axios.get(url, { 
      timeout,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive'
      }
    });
    
    const $ = cheerio.load(htmlRes.data);
    const baseUrl = new URL(url).origin;
    let imageSrc = null;
    
    // Ưu tiên các meta tag trước
    const metaSelectors = [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[property="og:image:secure_url"]',
      'meta[property="og:image:url"]'
    ];
    
    for (const selector of metaSelectors) {
      imageSrc = $(selector).attr('content');
      if (imageSrc) break;
    }
    
    // Nếu không tìm thấy trong meta, tìm trong JSON-LD
    if (!imageSrc) {
      try {
        const jsonLdElements = $('script[type="application/ld+json"]').toArray();
        for (const element of jsonLdElements) {
          const jsonContent = $(element).html();
          const parsedJson = JSON.parse(jsonContent);
          const image = findImageInJsonLd(parsedJson);
          if (image) {
            imageSrc = image;
            break;
          }
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }
    
    // Chuẩn hóa URL nếu tìm thấy
    if (imageSrc) {
      imageSrc = normalizeUrl(imageSrc, baseUrl);
      imageCache.set(cacheKey, imageSrc, 3600); // Cache 1 giờ
      return imageSrc;
    }
    
    // Cache null result để tránh fetch lại
    imageCache.set(failedKey, true, 1800); // 30 phút
    return null;
    
  } catch (err) {
    const errorMsg = err.code === 'ECONNABORTED' ? 'timeout' : err.message;
    console.warn(`Không thể trích xuất ảnh từ ${url}: ${errorMsg}`);
    
    // Cache failed result
    imageCache.set(failedKey, true, 1800); // 30 phút
    return null;
  }
}

/**
 * Tìm URL hình ảnh trong cấu trúc JSON-LD
 */
function findImageInJsonLd(data) {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findImageInJsonLd(item);
      if (found) return found;
    }
    return null;
  }
  
  if (typeof data === 'object') {
    // Ưu tiên trường image cụ thể
    if (data.image) {
      if (typeof data.image === 'string') return data.image;
      if (Array.isArray(data.image) && data.image.length > 0) {
        const firstImg = data.image[0];
        return typeof firstImg === 'string' ? firstImg : firstImg.url || null;
      }
      if (data.image.url) return data.image.url;
    }
    
    // Kiểm tra các trường schema.org phổ biến khác
    const imageFields = ['thumbnailUrl', 'primaryImageOfPage', 'articleBody', 'mainEntityOfPage'];
    for (const field of imageFields) {
      if (data[field]) {
        if (typeof data[field] === 'string' && data[field].match(/\.(jpg|jpeg|png|webp|gif)/i)) {
          return data[field];
        }
        if (typeof data[field] === 'object' && data[field].image) {
          return typeof data[field].image === 'string' ? data[field].image : data[field].image?.url;
        }
      }
    }
    
    // Đệ quy tìm trong các trường con
    for (const key in data) {
      if (data[key] && typeof data[key] === 'object') {
        const found = findImageInJsonLd(data[key]);
        if (found) return found;
      }
    }
  }
  
  return null;
}

/**
 * Chuẩn hóa URL tương đối thành tuyệt đối - FIX lỗi url.match is not a function
 */
function normalizeUrl(url, baseUrl) {
  // Kiểm tra input
  if (!url || typeof url !== 'string') return null;
  if (!baseUrl || typeof baseUrl !== 'string') return url;
  
  // Nếu đã là URL tuyệt đối, trả về nguyên gốc
  if (url.match(/^https?:\/\//i)) return url;
  
  try {
    // Xử lý URL tương đối
    if (url.startsWith('//')) {
      // URL protocol-relative
      return `https:${url}`;
    } else if (url.startsWith('/')) {
      // URL tương đối với gốc
      return `${baseUrl}${url}`;
    } else {
      // URL tương đối với đường dẫn hiện tại
      return new URL(url, baseUrl).href;
    }
  } catch (e) {
    console.warn(`Không thể chuẩn hóa URL: ${url}`, e.message);
    return url; // Trả về URL gốc nếu không thể chuẩn hóa
  }
}

/**
 * Lấy đoạn nội dung ngắn gọn và sạch sẽ từ item RSS
 */
function getCleanContentSnippet(item) {
  if (item.contentSnippet) {
    return cleanText(item.contentSnippet, 300);
  }
  
  const sources = [
    item.summary,
    item.description,
    item.content?.text,
    stripHtml(item.contentEncoded),
    stripHtml(item.content),
    stripHtml(item.description)
  ];
  
  for (const source of sources) {
    if (source && typeof source === 'string') {
      return cleanText(source, 300);
    }
  }
  
  return "Không có mô tả.";
}

/**
 * Lấy nội dung đầy đủ từ item RSS nếu có
 */
function getFullContent(item) {
  const sources = [
    item.contentEncoded,
    item.content,
    item.description
  ];
  
  for (const source of sources) {
    if (source && typeof source === 'string' && source.length > 150) {
      return source;
    }
  }
  
  return null;
}

/**
 * Làm sạch và cắt ngắn văn bản
 */
function cleanText(text, maxLength = 300) {
  if (!text) return '';
  
  let cleaned = text.replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim();
  
  if (cleaned.length > maxLength) {
    const truncated = cleaned.substring(0, maxLength);
    const lastSpacePos = truncated.lastIndexOf(' ');
    
    if (lastSpacePos > maxLength * 0.8) {
      cleaned = truncated.substring(0, lastSpacePos) + '...';
    } else {
      cleaned = truncated + '...';
    }
  }
  
  return cleaned;
}

/**
 * Hàm loại bỏ HTML tags từ text
 */
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  
  return html.replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s\s+/g, ' ')
    .trim();
}

/**
 * Trích xuất URL ảnh từ nội dung HTML
 */
function extractImageFromContent(content) {
  if (!content || typeof content !== 'string') return null;
  
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/i,
    /<img[^>]+data-src=["']([^"']+)["']/i,
    /<img[^>]+data-lazy-src=["']([^"']+)["']/i,
    /background-image:\s*url\(['"]?([^'")]+)['"]?\)/i,
    /<div[^>]+data-bg=["']([^"']+)["']/i
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const url = match[1];
      if (!url.startsWith('data:') && !url.includes('icon') && !url.includes('logo-small')) {
        return url;
      }
    }
  }
  
  return null;
}

/**
 * Controller chính để xử lý request
 */
exports.getRssNews = async (req, res) => {
  try {
    res.header('Access-Control-Allow-Origin', RENDER_CONFIG.FRONTEND_URL);
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const source = req.query.source;
    const cacheKey = `rss_${limit}_${page}_${source || 'all'}`;
    
    const cached = rssCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    let feedsToProcess = [...rssFeeds];
    if (source) {
      feedsToProcess = rssFeeds.filter(url => url.includes(source));
      if (feedsToProcess.length === 0) {
        return res.status(400).json({
          error: 'Nguồn tin không hợp lệ',
          message: `Không tìm thấy nguồn tin "${source}"`
        });
      }
    }

    const allNews = await fetchFeedsParallel(feedsToProcess);
    
    if (allNews.length === 0) {
      console.warn('Không lấy được dữ liệu tin tức từ tất cả RSS feeds.');
      return res.status(404).json({
        error: 'Không lấy được dữ liệu tin tức',
        message: 'Vui lòng thử lại sau hoặc chọn nguồn tin khác.'
      });
    }

    const uniqueNews = removeDuplicates(allNews);
    uniqueNews.sort((a, b) => {
      const dateA = new Date(a.pubDate || 0);
      const dateB = new Date(b.pubDate || 0);
      return dateB - dateA;
    });

    const sources = [...new Set(uniqueNews.map(item => item.source))]
      .map(sourceName => {
        const sourceItems = uniqueNews.filter(item => item.source === sourceName);
        return {
          name: sourceName,
          count: sourceItems.length,
          logo: sourceItems[0]?.sourceLogo || null,
          url: sourceItems[0]?.sourceUrl || null
        };
      });

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedNews = uniqueNews.slice(startIndex, endIndex);
    
    const responseData = {
      success: true,
      total: uniqueNews.length,
      page,
      limit,
      totalPages: Math.ceil(uniqueNews.length / limit),
      sources,
      news: paginatedNews
    };
    
    rssCache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Lỗi tổng quát khi đọc RSS:', error);
    res.status(500).json({
      error: 'Lỗi đọc RSS feed',
      message: error.message
    });
  }
};

/**
 * Thêm feed mới
 */
exports.addRssFeed = async (req, res) => {
  const newFeed = req.body.url;
  if (!newFeed) {
    return res.status(400).json({ error: 'Thiếu URL feed' });
  }
  
  try {
    await parser.parseURL(newFeed);
    if (!rssFeeds.includes(newFeed)) {
      rssFeeds.push(newFeed);
    }
    res.json({ success: true, message: 'Đã thêm feed thành công' });
  } catch (err) {
    res.status(400).json({ error: 'Feed không hợp lệ', message: err.message });
  }
};

/**
 * Loại bỏ các bài viết trùng lặp
 */
function removeDuplicates(articles) {
  const uniqueUrls = new Map();
  const uniqueArticles = [];
  
  for (const article of articles) {
    const urlKey = article.link;
    const titleSourceKey = `${article.title}|${article.source}`.toLowerCase();
    
    if (!uniqueUrls.has(urlKey) && !uniqueUrls.has(titleSourceKey)) {
      uniqueUrls.set(urlKey, true);
      uniqueUrls.set(titleSourceKey, true);
      uniqueArticles.push(article);
    }
  }
  
  return uniqueArticles;
}

// Thay require('p-limit') bằng dynamic import để tương thích CommonJS
(async () => {
  const pLimit = (await import('p-limit')).default;
  limitConcurrency = pLimit(5);
})();