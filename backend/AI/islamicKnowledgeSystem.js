// Enhanced rate limiting storage
export const rateLimitMap = new Map();
export const userInteractionStats = new Map();

// Islamic Knowledge Base Class
export class IslamicKnowledgeBase {
  constructor() {
    this.quranReferences = new Map();
    this.hadithReferences = new Map();
    this.scholarlyOpinions = new Map();
    this.commonQuestions = new Map();
    this.contemporaryIssues = new Map();
    this.vietnameseContext = new Map();
    this.fatwaDatabase = new Map();
    this.learningResources = new Map();
  }

  // Initialize knowledge base
  async initializeKnowledgeBase() {
    try {
      // Load contemporary issues database
      this.contemporaryIssues = new Map([
        ['technology', {
          topics: ['social media', 'online learning', 'digital privacy'],
          references: ['Quran 2:195', 'Hadith Bukhari 52:41'],
          vietnameseContext: 'Vấn đề công nghệ trong cộng đồng Muslim Việt Nam'
        }],
        ['family', {
          topics: ['modern parenting', 'interfaith marriage', 'education'],
          references: ['Quran 66:6', 'Hadith Muslim 16'],
          vietnameseContext: 'Gia đình Muslim trong xã hội Việt Nam hiện đại'
        }],
        ['business', {
          topics: ['halal business', 'finance', 'entrepreneurship'],
          references: ['Quran 2:275', 'Hadith Bukhari 34:286'],
          vietnameseContext: 'Kinh doanh halal tại Việt Nam'
        }]
      ]);

      // Initialize Vietnamese context database
      this.vietnameseContext = new Map([
        ['culture', {
          topics: ['traditions', 'customs', 'local practices'],
          references: ['Hadith Abu Dawud 4031'],
          context: 'Văn hóa Muslim Việt Nam'
        }],
        ['community', {
          topics: ['mosques', 'organizations', 'events'],
          references: ['Quran 49:13'],
          context: 'Cộng đồng Muslim Việt Nam'
        }]
      ]);

      console.log('✅ Islamic Knowledge Base initialized successfully');
    } catch (error) {
      console.error('❌ Knowledge Base initialization failed:', error);
    }
  }

  // Enhanced learning from responses with contemporary context
  learnFromResponse(question, response, references, userContext = {}) {
    // Extract and store Quran references with context
    const quranRefs = this.extractQuranReferences(response);
    quranRefs.forEach(ref => {
      const currentData = this.quranReferences.get(ref) || {
        count: 0,
        contexts: new Set(),
        vietnameseContext: new Set(),
        contemporaryIssues: new Set()
      };
      
      currentData.count++;
      if (userContext.contexts) userContext.contexts.forEach(ctx => currentData.contexts.add(ctx));
      if (userContext.vietnameseContext) currentData.vietnameseContext.add(userContext.vietnameseContext);
      if (userContext.contemporaryIssues) userContext.contemporaryIssues.forEach(issue => 
        currentData.contemporaryIssues.add(issue)
      );
      
      this.quranReferences.set(ref, currentData);
    });
    
    // Extract and store Hadith references with context
    const hadithRefs = this.extractHadithReferences(response);
    hadithRefs.forEach(ref => {
      const currentData = this.hadithReferences.get(ref) || {
        count: 0,
        contexts: new Set(),
        vietnameseContext: new Set(),
        contemporaryIssues: new Set()
      };
      
      currentData.count++;
      if (userContext.contexts) userContext.contexts.forEach(ctx => currentData.contexts.add(ctx));
      if (userContext.vietnameseContext) currentData.vietnameseContext.add(userContext.vietnameseContext);
      if (userContext.contemporaryIssues) userContext.contemporaryIssues.forEach(issue => 
        currentData.contemporaryIssues.add(issue)
      );
      
      this.hadithReferences.set(ref, currentData);
    });
    
    // Store common questions with enhanced context
    if (this.isCommonQuestion(question)) {
      this.commonQuestions.set(question, {
        answer: response,
        references: [...quranRefs, ...hadithRefs],
        lastUpdated: Date.now(),
        contexts: userContext.contexts || [],
        vietnameseContext: userContext.vietnameseContext,
        contemporaryIssues: userContext.contemporaryIssues || [],
        userFeedback: []
      });
    }

    // Update contemporary issues database
    this.updateContemporaryIssues(question, response, userContext);
  }

  // Update contemporary issues based on new information
  updateContemporaryIssues(question, response, userContext) {
    const issues = this.detectContemporaryIssues(question);
    issues.forEach(issue => {
      const currentData = this.contemporaryIssues.get(issue) || {
        topics: new Set(),
        references: new Set(),
        vietnameseContext: new Set(),
        lastUpdated: Date.now()
      };

      // Extract new topics
      const topics = this.extractTopics(response);
      topics.forEach(topic => currentData.topics.add(topic));

      // Add new references
      const refs = [...this.extractQuranReferences(response), ...this.extractHadithReferences(response)];
      refs.forEach(ref => currentData.references.add(ref));

      // Update Vietnamese context
      if (userContext.vietnameseContext) {
        currentData.vietnameseContext.add(userContext.vietnameseContext);
      }

      currentData.lastUpdated = Date.now();
      this.contemporaryIssues.set(issue, currentData);
    });
  }

  // Detect contemporary issues in questions
  detectContemporaryIssues(question) {
    const issues = new Set();
    this.contemporaryIssues.forEach((data, issue) => {
      if (data.topics && data.topics.some && data.topics.some(topic => question.toLowerCase().includes(topic))) {
        issues.add(issue);
      }
    });
    return Array.from(issues);
  }

  // Extract topics from text
  extractTopics(text) {
    const topics = new Set();
    const words = text.toLowerCase().split(/\s+/);
    
    // Từ khóa thường gặp trong các chủ đề Hồi giáo
    const islamicTopics = [
      'prayer', 'salah', 'fasting', 'hajj', 'zakat', 'quran', 'hadith',
      'family', 'marriage', 'business', 'finance', 'technology', 'education',
      'community', 'culture', 'tradition', 'modern', 'contemporary'
    ];
    
    islamicTopics.forEach(topic => {
      if (words.some(word => word.includes(topic))) {
        topics.add(topic);
      }
    });
    
    return Array.from(topics);
  }

  // Get relevant references with contemporary context
  getRelevantReferences(contexts, userContext = {}) {
    const refs = new Set();
    const weights = new Map();
    
    // Get relevant Quran references with weights
    this.quranReferences.forEach((data, ref) => {
      let weight = data.count;
      
      // Add weight for matching contexts
      if (contexts) {
        const matchingContexts = Array.from(data.contexts).filter(ctx => contexts.includes(ctx));
        weight += matchingContexts.length * 2;
      }
      
      // Add weight for Vietnamese context
      if (userContext.vietnameseContext && data.vietnameseContext.has(userContext.vietnameseContext)) {
        weight += 3;
      }
      
      // Add weight for contemporary issues
      if (userContext.contemporaryIssues) {
        const matchingIssues = Array.from(data.contemporaryIssues)
          .filter(issue => userContext.contemporaryIssues.includes(issue));
        weight += matchingIssues.length * 2;
      }
      
      if (weight > 2) {
        refs.add(ref);
        weights.set(ref, weight);
      }
    });
    
    // Get relevant Hadith references with weights
    this.hadithReferences.forEach((data, ref) => {
      let weight = data.count;
      
      if (contexts) {
        const matchingContexts = Array.from(data.contexts).filter(ctx => contexts.includes(ctx));
        weight += matchingContexts.length * 2;
      }
      
      if (userContext.vietnameseContext && data.vietnameseContext.has(userContext.vietnameseContext)) {
        weight += 3;
      }
      
      if (userContext.contemporaryIssues) {
        const matchingIssues = Array.from(data.contemporaryIssues)
          .filter(issue => userContext.contemporaryIssues.includes(issue));
        weight += matchingIssues.length * 2;
      }
      
      if (weight > 2) {
        refs.add(ref);
        weights.set(ref, weight);
      }
    });
    
    // Sort references by weight
    return Array.from(refs)
      .sort((a, b) => weights.get(b) - weights.get(a))
      .slice(0, 10);
  }

  // Get contemporary guidance
  getContemporaryGuidance(issue, userContext = {}) {
    const data = this.contemporaryIssues.get(issue);
    if (!data) return null;

    return {
      issue,
      topics: Array.from(data.topics || []),
      references: Array.from(data.references || []),
      vietnameseContext: Array.from(data.vietnameseContext || []),
      lastUpdated: data.lastUpdated,
      relevance: this.calculateRelevance(issue, userContext)
    };
  }

  // Calculate relevance score for contemporary issues
  calculateRelevance(issue, userContext) {
    const data = this.contemporaryIssues.get(issue);
    if (!data) return 0;

    let score = 0;
    
    // Base score from usage
    score += (data.references ? data.references.size : 0);
    
    // Add score for Vietnamese context match
    if (userContext.vietnameseContext && data.vietnameseContext && data.vietnameseContext.has(userContext.vietnameseContext)) {
      score += 5;
    }
    
    // Add score for contemporary issues match
    if (userContext.contemporaryIssues && data.contemporaryIssues) {
      const matchingIssues = Array.from(data.contemporaryIssues)
        .filter(i => userContext.contemporaryIssues.includes(i));
      score += matchingIssues.length * 3;
    }
    
    return score;
  }
  
  // Extract Quran references from text
  extractQuranReferences(text) {
    const refs = [];
    const patterns = [
      /Qur'?an\s+(\d+):(\d+)/gi,
      /Surah\s+([A-Za-z-]+)\s+(\d+):(\d+)/gi,
      /Kinh\s+(\d+):(\d+)/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        refs.push(match[0]);
      }
    });
    
    return refs;
  }
  
  // Extract Hadith references from text
  extractHadithReferences(text) {
    const refs = [];
    const patterns = [
      /(?:Sahih|Sunan)\s+(?:al-)?(?:Bukhari|Muslim|Abu Dawud|Tirmidhi|Ibn Majah|Nasai)\s+(?:Hadith|Hadis)\s+#?(\d+)/gi,
      /(?:Hadith|Hadis)\s+(?:Sahih|Sunan)\s+(?:al-)?(?:Bukhari|Muslim|Abu Dawud|Tirmidhi|Ibn Majah|Nasai)\s+#?(\d+)/gi
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        refs.push(match[0]);
      }
    });
    
    return refs;
  }

  // Extract pattern from question for similarity matching
  extractPattern(question) {
    // Chuyển về lowercase và loại bỏ dấu câu
    const cleaned = question.toLowerCase().replace(/[^\w\s]/g, '');
    
    // Tách từ và loại bỏ stop words
    const stopWords = ['what', 'how', 'when', 'where', 'why', 'is', 'are', 'can', 'do', 'does', 'về', 'như', 'thế', 'nào', 'là', 'có'];
    const words = cleaned.split(/\s+/).filter(word => !stopWords.includes(word));
    
    // Sắp xếp từ để tạo pattern chuẩn
    return words.sort().join(' ');
  }

  // Calculate similarity between two text patterns
  calculateSimilarity(pattern1, patterns) {
    let maxSimilarity = 0;
    
    patterns.forEach(pattern2 => {
      const words1 = new Set(pattern1.split(' '));
      const words2 = new Set(pattern2.split(' '));
      
      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);
      
      const similarity = intersection.size / union.size;
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });
    
    return maxSimilarity;
  }
  
  // Check if question is common
  isCommonQuestion(question) {
    const pattern = this.extractPattern(question);
    return this.commonQuestions.has(pattern) || 
           this.calculateSimilarity(pattern, Array.from(this.commonQuestions.keys())) > 0.8;
  }
}

// Khởi tạo instance mặc định để dùng ngay
const defaultKnowledgeBase = new IslamicKnowledgeBase();

// Export mọi thứ cần thiết
export default {
  rateLimitMap,
  userInteractionStats,
  IslamicKnowledgeBase,
  defaultKnowledgeBase
};