/**
 * Intelligence and learning system endpoints
 */

/**
 * Handle intelligent processor endpoint
 */
export function handleIntelligentProcessor(req, res) {
  try {
    const { text, action = 'analyze' } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu văn bản để xử lý',
        suggestion: 'Vui lòng cung cấp văn bản trong trường "text"'
      });
    }
    
    // Basic text processing
    const analysis = {
      length: text.length,
      wordCount: text.split(/\s+/).length,
      language: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text) ? 'vietnamese' : 'other',
      sentiment: 'neutral', // Placeholder
      topics: [], // Placeholder
      timestamp: new Date().toISOString()
    };
    
    // Basic Islamic content detection
    const islamicKeywords = ['allah', 'islam', 'muslim', 'quran', 'hadith', 'salah', 'cầu nguyện', 'đức tin'];
    const hasIslamicContent = islamicKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    if (hasIslamicContent) {
      analysis.topics.push('islamic');
    }
    
    res.json({
      success: true,
      action,
      analysis,
      hasIslamicContent,
      processor: 'Muslim Việt Intelligent Processor',
      version: '2.0.0'
    });
    
  } catch (error) {
    console.error('❌ Intelligent processor error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi xử lý thông minh',
      timestamp: new Date().toISOString()
    });
  }
}

export const setupIntelligenceEndpoints = (app, { learningSystem }) => {
  // Enhanced debug endpoints
  app.get('/debug/intelligence', (req, res) => {
    res.json({
      learningStats: {
        totalPatterns: learningSystem.questionPatterns.size,
        totalCorrelations: learningSystem.topicCorrelations.size,
        topPatterns: Array.from(learningSystem.questionPatterns.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 10)
          .map(([pattern, data]) => ({
            pattern,
            count: data.count,
            avgResponseTime: Math.round(data.avgResponseTime),
            contexts: Array.from(data.contexts)
          })),
        topCorrelations: Array.from(learningSystem.topicCorrelations.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([correlation, count]) => ({
            topics: correlation.split('-'),
            strength: count
          }))
      },
      systemInfo: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    });
  });

  // Deep learning status endpoint
  app.get('/api/deep-learning/status', (req, res) => {
    res.json({
      initialized: learningSystem.modelInitialized,
      modelAvailable: learningSystem.deepLearningModel !== null,
      insights: learningSystem.getLearningInsights()
    });
  });

  // Learning insights endpoint
  app.get('/debug/learning-insights', (req, res) => {
    try {
      const insights = learningSystem.getLearningInsights();
      res.json({
        success: true,
        data: insights,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Test deep learning endpoint
  app.post('/api/test-deep-learning', async (req, res) => {
    try {
      const { text = "Hello world test message" } = req.body;
      
      if (!learningSystem.modelInitialized) {
        return res.json({
          success: false,
          message: 'Deep learning model not initialized yet',
          fallback: learningSystem.analyzeEmotionSimple(text)
        });
      }

      const emotionAnalysis = await learningSystem.analyzeEmotionDeep(text);
      const semanticFeatures = await learningSystem.extractSemanticFeatures(text);
      
      res.json({
        success: true,
        text,
        emotionAnalysis,
        semanticFeatures: semanticFeatures.slice(0, 5),
        modelStatus: 'active'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
};