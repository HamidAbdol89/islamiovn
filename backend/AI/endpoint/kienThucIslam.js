/**
 * Islamic knowledge base endpoints
 */

/**
 * Handle Islamic knowledge endpoint
 */
export function handleIslamicKnowledge(req, res) {
  try {
    const { topic } = req.params;
    
    // Basic Islamic knowledge topics
    const knowledgeTopics = {
      'prayer': {
        title: 'Cầu nguyện trong Islam',
        content: 'Salah là một trong năm trụ cột của Islam...',
        references: ['Quran 2:43', 'Hadith Bukhari 8:1']
      },
      'faith': {
        title: 'Đức tin trong Islam',
        content: 'Iman bao gồm sáu điều cơ bản...',
        references: ['Quran 2:177', 'Hadith Muslim 1:1']
      },
      'quran': {
        title: 'Kinh Quran',
        content: 'Quran là kinh thánh cuối cùng được Allah ban xuống...',
        references: ['Quran 2:2', 'Quran 15:9']
      },
      'hadith': {
        title: 'Hadith',
        content: 'Hadith là những lời nói, hành động của Thiên sứ Muhammad...',
        references: ['Hadith Bukhari 1:1', 'Hadith Muslim 1:1']
      }
    };
    
    const knowledge = knowledgeTopics[topic.toLowerCase()];
    
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        error: 'Chủ đề không tìm thấy',
        availableTopics: Object.keys(knowledgeTopics),
        suggestion: 'Vui lòng chọn một trong các chủ đề có sẵn'
      });
    }
    
    res.json({
      success: true,
      topic,
      knowledge,
      timestamp: new Date().toISOString(),
      source: 'Muslim Việt Islamic Knowledge Base'
    });
    
  } catch (error) {
    console.error('❌ Islamic knowledge error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi truy xuất kiến thức Islam',
      timestamp: new Date().toISOString()
    });
  }
}

export const setupIslamicKnowledgeEndpoints = (app, { islamicKnowledgeBase }) => {
  // Enhanced debug endpoints
  app.get('/debug/islamic-knowledge', (req, res) => {
    res.json({
      knowledgeStats: {
        totalQuranReferences: islamicKnowledgeBase.quranReferences.size,
        totalHadithReferences: islamicKnowledgeBase.hadithReferences.size,
        commonQuestions: Array.from(islamicKnowledgeBase.commonQuestions.entries())
          .map(([question, data]) => ({
            question,
            references: data.references,
            lastUpdated: new Date(data.lastUpdated).toISOString()
          })),
        topReferences: {
          quran: Array.from(islamicKnowledgeBase.quranReferences.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10),
          hadith: Array.from(islamicKnowledgeBase.hadithReferences.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
        }
      }
    });
  });
};