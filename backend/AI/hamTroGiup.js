// Các hàm tiện ích hỗ trợ

/**
 * Helper Functions for Muslim Việt AI
 */
export const helperFunctions = {
  generateRequestId,
  getClientIP,
  enrichContext,
  processAIResponse,
  logInvalidInput,
  getUserHistory
};

/**
 * Tạo ID yêu cầu duy nhất
 * @returns {string} ID yêu cầu
 */
export function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Lấy địa chỉ IP của client
 * @param {Object} req - Request object
 * @returns {string} Địa chỉ IP của client
 */
export function getClientIP(req) {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         'unknown';
}

/**
 * Làm giàu context với thông tin bổ sung
 * @param {Object} context - Context gốc
 * @param {Object} deepLearningResult - Kết quả deep learning
 * @param {string} clientIP - IP của client
 * @param {Object} additionalData - Dữ liệu bổ sung
 * @returns {Object} Context đã được làm giàu
 */
export async function enrichContext(context, deepLearningResult, clientIP, additionalData) {
  return {
    ...context,
    deepLearning: {
      emotion: deepLearningResult.emotion,
      intent: deepLearningResult.intent,
      confidence: deepLearningResult.confidence,
      isActive: deepLearningResult.isActive
    },
    client: {
      ip: clientIP,
      userAgent: additionalData.userAgent,
      timeOfDay: additionalData.timeOfDay,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    history: additionalData.previousQuestions,
    session: {
      requestId: additionalData.requestId,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Xử lý và cải thiện phản hồi AI
 * @param {Object} aiResponse - Phản hồi AI gốc
 * @param {Object} deepLearningResult - Kết quả deep learning
 * @param {Object} metadata - Metadata
 * @returns {Object} Phản hồi AI đã được xử lý
 */
export async function processAIResponse(aiResponse, deepLearningResult, metadata) {
  // Process and enhance AI response based on deep learning insights
  return {
    ...aiResponse,
    metadata: {
      ...metadata,
      processingEnhancements: {
        emotionAdjusted: deepLearningResult.emotion !== 'neutral',
        intentMatched: deepLearningResult.intent,
        confidenceScore: deepLearningResult.confidence
      }
    }
  };
}

/**
 * Ghi log cho input không hợp lệ
 * @param {string} question - Câu hỏi
 * @param {Error} error - Lỗi
 * @param {string} clientIP - IP client
 * @param {string} requestId - ID request
 */
export async function logInvalidInput(question, error, clientIP, requestId) {
  // Log invalid inputs for analysis and improvement
  console.log(`🚨 [${requestId}] Invalid input logged for ${clientIP}: ${error.message}`);
  // Add to monitoring/analytics system
}

/**
 * Lấy lịch sử người dùng
 * @param {string} clientIP - IP của client
 * @param {number} limit - Giới hạn số lượng
 * @returns {Array} Mảng lịch sử người dùng
 */
export async function getUserHistory(clientIP, limit = 5) {
  // Retrieve user's recent questions for context
  try {
    // Implementation depends on your storage system
    return []; // Fallback to empty array
  } catch (error) {
    console.error('Failed to get user history:', error);
    return [];
  }
}