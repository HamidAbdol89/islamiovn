// boNho.js - Quản lý cache và response

/**
 * Memory System for Muslim Việt AI
 */
export const memorySystem = {
  initialized: false,
  
  async initialize() {
    console.log(' Initializing Memory System...');
    this.initialized = true;
    return true;
  },
  
  store(key, data) {
    // Placeholder for memory storage
    console.log(` Storing memory: ${key}`);
  },
  
  retrieve(key) {
    // Placeholder for memory retrieval
    console.log(` Retrieving memory: ${key}`);
    return null;
  }
};

/**
 * Kiểm tra cache thông minh (semantic hoặc exact)
 */

export async function checkIntelligentCache(userQuestion, context, deepLearningResult, learningSystem) {
  if (context?.skipCache) return null;
  
  try {
    let cachedResponse = null;
    
    if (deepLearningResult.isActive) {
      // Sử dụng semantic cache
      cachedResponse = await learningSystem.getSemanticallySimilarResponse(userQuestion);
    } else {
      // Sử dụng exact cache
      cachedResponse = learningSystem.getCachedResponse(userQuestion);
    }
    
    if (cachedResponse) {
      return {
        ...cachedResponse,
        fromCache: true,
        cacheType: deepLearningResult.isActive ? 'semantic' : 'exact',
        cacheInfo: 'Câu trả lời từ bộ nhớ thông minh',
        deepLearning: deepLearningResult.insights
      };
    }
  } catch (error) {
    console.error('Cache check failed:', error);
  }
  
  return null;
}

/**
 * Cache response nâng cao
 */
export async function cacheEnhancedResponse(userQuestion, responseData, deepLearningResult, learningSystem, responseCache) {
  try {
    if (deepLearningResult.isActive) {
      // Semantic caching
      await learningSystem.cacheResponseWithSemantics(
        userQuestion, 
        responseData, 
        deepLearningResult.semantics
      );
    } else {
      // Fallback caching
      const cacheKey = Buffer.from(userQuestion.toLowerCase().trim())
        .toString('base64').substring(0, 50);
      responseCache.set(cacheKey, responseData);
    }
  } catch (error) {
    console.error('Caching failed:', error);
  }
}

/**
 * Log cache hit cho analytics
 */
export async function logCacheHit(userQuestion, cachedResponse, clientIP, startTime, learningSystem) {
  try {
    console.log(`[CACHE HIT] ${userQuestion.substring(0, 50)}... (type: ${cachedResponse.cacheType})`);
    
    // Học từ cache hit nếu deep learning đang hoạt động
    if (learningSystem.modelInitialized) {
      await learningSystem.learnFromQuestion(
        userQuestion,
        cachedResponse.contexts || ['cache'],
        Date.now() - startTime,
        clientIP
      );
    }
  } catch (error) {
    console.error('Cache hit logging failed:', error);
  }
}

/**
 * Mở rộng learningSystem với các method semantic
 */
export function extendLearningSystemWithSemantics(learningSystem, responseCache) {
  
  // Phân tích personality user từ lịch sử tương tác
  learningSystem.analyzeUserPersonality = function(userIP) {
    const userPrefs = this.userPreferences.get(userIP);
    if (!userPrefs || !userPrefs.interactionPatterns) return null;
    
    const patterns = userPrefs.interactionPatterns;
    if (patterns.length < 3) return null; // Cần ít nhất 3 interactions
    
    // Phân tích emotion patterns
    const emotionCounts = new Map();
    const topicInterests = new Map();
    let avgResponseTime = 0;
    
    patterns.forEach(pattern => {
      // Đếm emotions
      const emotion = pattern.emotion || 'neutral';
      emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
      
      // Đếm topic interests
      if (pattern.contexts) {
        pattern.contexts.forEach(ctx => {
          topicInterests.set(ctx, (topicInterests.get(ctx) || 0) + 1);
        });
      }
      
      avgResponseTime += pattern.responseTime || 0;
    });
    
    avgResponseTime /= patterns.length;
    
    // Xác định dominant traits
    const dominantEmotion = Array.from(emotionCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];
    
    const topTopics = Array.from(topicInterests.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const traits = [];
    if (dominantEmotion[0] === 'positive') traits.push('optimistic');
    if (dominantEmotion[0] === 'curious') traits.push('inquisitive');
    if (avgResponseTime < 2000) traits.push('quick_learner');
    if (topTopics.length > 2) traits.push('diverse_interests');
    
    return {
      dominantEmotion: dominantEmotion[0],
      dominantTraits: traits,
      topTopics: topTopics.map(t => t[0]),
      interactionFrequency: patterns.length,
      avgResponseTime,
      lastActive: Math.max(...patterns.map(p => p.timestamp))
    };
  };
  
  // Cập nhật user personality model
  learningSystem.updateUserPersonality = function(userIP, interactionData) {
    const userPrefs = this.userPreferences.get(userIP);
    if (!userPrefs) return;
    
    // Thêm vào interaction patterns
    if (!userPrefs.interactionPatterns) {
      userPrefs.interactionPatterns = [];
    }
    
    userPrefs.interactionPatterns.push({
      timestamp: Date.now(),
      question: interactionData.question,
      emotion: interactionData.emotion?.primary || 'neutral',
      contexts: interactionData.contexts || [],
      responseTime: interactionData.responseTime
    });
    
    // Chỉ giữ lại 50 interactions gần nhất
    if (userPrefs.interactionPatterns.length > 50) {
      userPrefs.interactionPatterns = userPrefs.interactionPatterns.slice(-50);
    }
  };
  
  // Lấy response tương tự về mặt semantic
  learningSystem.getSemanticallySimilarResponse = async function(question, threshold = 0.7) {
    if (!this.modelInitialized) return null;
    
    try {
      const questionFeatures = await this.extractSemanticFeatures(question);
      let bestMatch = null;
      let bestSimilarity = 0;
      
      // Kiểm tra cached responses với semantic similarity
      for (const [cachedQuestion, response] of responseCache.entries()) {
        try {
          const cachedFeatures = await this.extractSemanticFeatures(cachedQuestion);
          const similarity = await this.calculateSemanticSimilarity(questionFeatures, cachedFeatures);
          
          if (similarity > threshold && similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = {
              ...response,
              similarity: similarity.toFixed(3),
              originalQuestion: cachedQuestion
            };
          }
        } catch (error) {
          // Bỏ qua cached item này nếu có lỗi
          continue;
        }
      }
      
      return bestMatch;
    } catch (error) {
      console.error('Semantic cache lookup failed:', error);
      return null;
    }
  };
  
  // Cache response với semantic features
  learningSystem.cacheResponseWithSemantics = async function(question, response, semanticFeatures) {
    try {
      const cacheKey = Buffer.from(question.toLowerCase().trim()).toString('base64').substring(0, 50);
      
      const enhancedResponse = {
        ...response,
        semanticFeatures,
        cachedAt: Date.now()
      };
      
      responseCache.set(cacheKey, enhancedResponse);
      responseCache.set(question, enhancedResponse); // Cache theo câu hỏi gốc
      
      return true;
    } catch (error) {
      console.error('Semantic caching failed:', error);
      return false;
    }
  };
  
  // Tính toán semantic similarity giữa feature vectors
  learningSystem.calculateSemanticSimilarity = async function(features1, features2) {
    if (!features1 || !features2 || features1.length === 0 || features2.length === 0) {
      return 0;
    }
    
    try {
      // Đảm bảo cùng độ dài
      const len = Math.min(features1.length, features2.length);
      const f1 = features1.slice(0, len);
      const f2 = features2.slice(0, len);
      
      // Tính cosine similarity
      const dotProduct = f1.reduce((sum, val, i) => sum + val * f2[i], 0);
      const norm1 = Math.sqrt(f1.reduce((sum, val) => sum + val * val, 0));
      const norm2 = Math.sqrt(f2.reduce((sum, val) => sum + val * val, 0));
      
      if (norm1 === 0 || norm2 === 0) return 0;
      
      return dotProduct / (norm1 * norm2);
    } catch (error) {
      console.error('Semantic similarity calculation error:', error);
      return 0;
    }
  };
  
  // Lấy lịch sử tương tác của user
  learningSystem.getUserHistory = function(userIP) {
    const userPrefs = this.userPreferences.get(userIP);
    if (!userPrefs || !userPrefs.interactionPatterns) return [];
    
    return userPrefs.interactionPatterns.slice(-5).map(pattern => ({
      question: pattern.question?.substring(0, 100) + '...',
      emotion: pattern.emotion,
      timestamp: new Date(pattern.timestamp).toISOString(),
      contexts: pattern.contexts?.slice(0, 3)
    }));
  };
}